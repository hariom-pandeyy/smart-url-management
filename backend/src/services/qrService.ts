import QRCode from "qrcode";
import path from "path";

export const generateQRCode = async (
  shortCode: string,
  baseUrl: string
) => {
  try {
    const qrPath = path.join(
      __dirname,
      "../../public/qr",
      `${shortCode}.png`
    );

    const url =  `https://smart-url-management.vercel.app/${shortCode}`;

    await QRCode.toFile(qrPath, url);

    return `/qr/${shortCode}.png`;
  } catch (error) {
    console.error(error);
    return null;
  }
};