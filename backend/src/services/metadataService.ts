import axios from "axios";
import * as cheerio from "cheerio";

export const fetchUrlMetadata = async (url: string) => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "SmartURLBot/1.0",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text() ||
      null;

    const description =
      $("meta[property='og:description']").attr("content") ||
      $("meta[name='description']").attr("content") ||
      null;

    const image =
      $("meta[property='og:image']").attr("content") || null;

    const favicon =
      $("link[rel='icon']").attr("href") ||
      $("link[rel='shortcut icon']").attr("href") ||
      null;

    return {
      title,
      description,
      image,
      favicon,
    };
  } catch (error) {
    return {
      title: null,
      description: null,
      image: null,
      favicon: null,
    };
  }
};