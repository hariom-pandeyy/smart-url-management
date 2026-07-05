import { Request, Response } from "express";
import pool from "../config/db";
import { generateShortCode } from "../utils/shortCode";
import { AuthRequest } from "../middleware/authMiddleware";
import { UAParser } from "ua-parser-js";
import { fetchUrlMetadata } from "../services/metadataService";
import { hashPassword } from "../utils/hash";
import { comparePassword } from "../utils/hash";
import { generateQRCode } from "../services/qrService";
export const createShortUrl = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
  original_url,
  custom_alias,
  expires_at,
  password,
  max_clicks,
} = req.body;

    if (!original_url) {
      return res.status(400).json({
        message: "Original URL is required",
      });
    }

    let shortCode = custom_alias || generateShortCode();
    const metadata = await fetchUrlMetadata(original_url);
    const baseUrl = process.env.BASE_URL || "https://smart-url-management.onrender.com";
    const qrCodePath = await generateQRCode(shortCode, baseUrl);
    const passwordHash = password
  ? await hashPassword(password)
  : null;

    const existing = await pool.query(
      "SELECT id FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "Short code already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO urls
       (user_id,
 original_url,
 short_code,
 custom_alias,
 expires_at,
 title,
 description,
 favicon,
 preview_image,
 password_hash,
 max_clicks,
 qr_code )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
    [
  req.user?.userId,
  original_url,
  shortCode,
  custom_alias || null,
  expires_at || null,
  metadata.title,
  metadata.description,
  metadata.favicon,
  metadata.image,
  passwordHash,
  max_clicks || null,
  qrCodePath
]
    );

    return res.status(201).json({
      message: "Short URL created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to create short URL",
      error,
    });
  }
};

export const redirectUrl = async (
  req: Request,
  res: Response
) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      `SELECT * FROM urls
       WHERE short_code = $1
       AND is_active = TRUE`,
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    

    const url = result.rows[0];
    const parser = new UAParser(req.headers["user-agent"]);
    if (url.password_hash) {
  return res.status(401).json({
    message: "This link is password protected",
    shortCode: url.short_code,
  });
}
if (url.expires_at && new Date() > new Date(url.expires_at)) {
  return res.status(410).json({
    message: "This link has expired",
  });
}

if (url.max_clicks && url.click_count >= url.max_clicks) {
  return res.status(403).json({
    message: "Maximum click limit reached",
  });
}

const browser = parser.getBrowser().name || "Unknown";
const operatingSystem = parser.getOS().name || "Unknown";
const device = parser.getDevice().type || "Desktop";

const ipAddress = req.ip ||
  req.socket.remoteAddress ||
  "Unknown";

const referrer =
  req.headers.referer || "Direct";
    
    

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).json({
        message: "This link has expired",
      });
    }

    await pool.query(
      `UPDATE urls
       SET click_count = click_count + 1
       WHERE id = $1`,
      [url.id]
    );
await pool.query(
  `INSERT INTO click_logs
   (url_id, ip_address, browser, operating_system, device_type, referrer)
   VALUES ($1, $2, $3, $4, $5, $6)`,
  [url.id, ipAddress, browser, operatingSystem, device, referrer]
);
    return res.redirect(302, url.original_url);

  } catch (error) {
    return res.status(500).json({
      message: "Redirect failed",
      error,
    });
  }
};

export const verifyPassword = async (req: Request, res: Response) => {
  try {
    const { shortCode, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    const url = result.rows[0];

    if (!url.password_hash) {
      return res.status(400).json({
        message: "This link is not password protected",
      });
    }

    const isMatch = await comparePassword(
      password,
      url.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      message: "Password verified",
      original_url: url.original_url,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Verification failed",
      error,
    });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const totalClicks = await pool.query(
      "SELECT click_count FROM urls WHERE id = $1",
      [id]
    );

    if (totalClicks.rows.length === 0) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    const browserStats = await pool.query(
      `SELECT browser, COUNT(*) AS count
       FROM click_logs
       WHERE url_id = $1
       GROUP BY browser
       ORDER BY count DESC`,
      [id]
    );

    const deviceStats = await pool.query(
      `SELECT device_type, COUNT(*) AS count
       FROM click_logs
       WHERE url_id = $1
       GROUP BY device_type
       ORDER BY count DESC`,
      [id]
    );

    const osStats = await pool.query(
      `SELECT operating_system, COUNT(*) AS count
       FROM click_logs
       WHERE url_id = $1
       GROUP BY operating_system
       ORDER BY count DESC`,
      [id]
    );
    const timelineStats = await pool.query(
  `SELECT 
     DATE(clicked_at) AS date,
     COUNT(*) AS clicks
   FROM click_logs
   WHERE url_id = $1
   GROUP BY DATE(clicked_at)
   ORDER BY DATE(clicked_at) ASC`,
  [id]
);

    const recentClicks = await pool.query(
      `SELECT *
       FROM click_logs
       WHERE url_id = $1
       ORDER BY clicked_at DESC
       LIMIT 10`,
      [id]
    );

    return res.status(200).json({
      total_clicks: totalClicks.rows[0].click_count,
      browsers: browserStats.rows,
      devices: deviceStats.rows,
      operating_systems: osStats.rows,
      timeline: timelineStats.rows,
      recent_clicks: recentClicks.rows,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch analytics",
      error,
    });
  }
};

export const getMyLinks = async (req: any, res: any) => {
  try {
    const result = await pool.query(
  `SELECT
    id,
    original_url,
    title,
    description,
    favicon,
    preview_image,
    short_code,
    click_count,
    is_active,
    qr_code,
    created_at,
    expires_at
   FROM urls
   WHERE user_id = $1
   ORDER BY created_at DESC`,
  [req.user?.userId]
);
    res.status(200).json({
      links: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch links",
    });
  }
};

export const deleteLink = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM urls
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Link not found",
      });
    }

    res.json({
      message: "Link deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete link",
    });
  }
};