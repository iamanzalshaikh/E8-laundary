import axios from "axios";
import * as cheerio from "cheerio";
import { Client as GoogleMapsClient, PlaceInputType } from "@googlemaps/google-maps-services-js";
import logger from "../config/logger.js";

interface ScrapedBusinessData {
  businessName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  hours?: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  description?: string;
  services?: string[];
  photos?: string[];
  dataSource: "website_scrape" | "google_scrape";
}

/**
 * Scrape business data from website URL
 */
export async function scrapeWebsite(url: string): Promise<ScrapedBusinessData> {
  try {
    logger.info(`🌐 [SCRAPER] Scraping website: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const data: ScrapedBusinessData = {
      dataSource: "website_scrape",
    };

    // Extract business name
    const businessName =
      $("title").text().split("|")[0]?.trim() ||
      $("h1").first().text().trim() ||
      $('meta[property="og:site_name"]').attr("content");
    if (businessName !== undefined && businessName !== "") data.businessName = businessName;

    // Extract phone
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const bodyText = $("body").text();
    const phoneMatch = bodyText.match(phoneRegex);
    if (phoneMatch) data.phone = phoneMatch[0];

    // Extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = bodyText.match(emailRegex);
    if (emailMatch) data.email = emailMatch[0];

    // Extract description
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content");
    if (description !== undefined && description !== "") data.description = description;
    
    // Photos
    const images: string[] = [];
    $("img").each((i, elem) => {
      const src = $(elem).attr("src");
      if (src && !src.includes("icon") && !src.includes("logo")) {
        try {
          const absoluteUrl = new URL(src, url).href;
          images.push(absoluteUrl);
        } catch (e) {}
      }
    });
    data.photos = images.slice(0, 10);

    logger.info("✅ [SCRAPER] Website scraping completed", { name: data.businessName });
    return data;
  } catch (error: any) {
    logger.error("❌ [SCRAPER] Website scraping failed", { error: error.message });
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

/**
 * Scrape business data from Google Business Profile
 */
export async function scrapeGoogleBusiness(
  googleUrl: string
): Promise<ScrapedBusinessData> {
  try {
    logger.info(`🔍 [SCRAPER] Scraping Google Business: ${googleUrl}`);

    const placeIdMatch = googleUrl.match(/place\/([^\/]+)/);
    if (!placeIdMatch) throw new Error("Invalid Google Business URL");

    const placeName = placeIdMatch[1] ?? "";
    if (!placeName) throw new Error("Invalid Google Business URL");
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) throw new Error("Google Maps API key not configured");

    const client = new GoogleMapsClient({});
    const searchResponse = await client.findPlaceFromText({
      params: {
        input: placeName,
        inputtype: PlaceInputType.textQuery,
        fields: ["place_id", "name"],
        key: googleApiKey,
      },
    });

    const firstCandidate = searchResponse.data.candidates?.[0];
    if (!firstCandidate?.place_id) throw new Error("Business not found on Google");
    const placeId = firstCandidate.place_id;

    const detailsResponse = await client.placeDetails({
      params: {
        place_id: placeId!,
        fields: ["name", "formatted_address", "formatted_phone_number", "opening_hours", "website", "photos", "address_components"],
        key: googleApiKey,
      },
    });

    const place = detailsResponse.data.result;
    const addressComponents = place.address_components || [];
    const getAddressComp = (type: string) =>
      addressComponents.find((c) => c.types.includes(type as (typeof c.types)[number]))?.long_name ?? "";

    const data: ScrapedBusinessData = {
      address: {
        street: `${getAddressComp("street_number")} ${getAddressComp("route")}`.trim(),
        city: getAddressComp("locality"),
        state: getAddressComp("administrative_area_level_1"),
        zipCode: getAddressComp("postal_code"),
        country: getAddressComp("country"),
      },
      dataSource: "google_scrape",
    };
    if (place.name != null && place.name !== "") data.businessName = place.name;
    if (place.formatted_phone_number != null && place.formatted_phone_number !== "") data.phone = place.formatted_phone_number;

    if (place.photos) {
      data.photos = place.photos.slice(0, 10).map(p => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${googleApiKey}`
      );
    }

    logger.info("✅ [SCRAPER] Google Business scraping completed", { name: data.businessName });
    return data;
  } catch (error: any) {
    logger.error("❌ [SCRAPER] Google scraping failed", { error: error.message });
    throw new Error(`Failed to scrape Google Business: ${error.message}`);
  }
}

/**
 * Main Scraper
 */
export async function scrapeBusinessData(url: string): Promise<ScrapedBusinessData> {
  const isGoogle = url.includes("google.com/maps") || url.includes("business.google.com");
  return isGoogle ? scrapeGoogleBusiness(url) : scrapeWebsite(url);
}
