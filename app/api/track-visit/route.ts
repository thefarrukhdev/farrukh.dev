import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, sendTelegramNotification } from "@/lib/telegram";

function parseDevice(ua: string) {
  let os = "Noma'lum OS";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Noma'lum Brauzer";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  const isMobile = /mobile|iphone|android|ipad/i.test(ua);
  const deviceType = isMobile ? "📱 Telefon/Planshet" : "💻 Kompyuter (Desktop)";

  return { os, browser, deviceType };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { path = "/", screen = "Noma'lum", referrer = "To'g'ridan-to'g'ri (Direct)", language = "en" } = body;

    // IP Extraction
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1"
      : realIp || "127.0.0.1";

    // Vercel Geolocation headers
    const country = req.headers.get("x-vercel-ip-country") || "Noma'lum";
    const city = req.headers.get("x-vercel-ip-city");

    const locationText = city && country !== "Noma'lum"
      ? `${decodeURIComponent(city)}, ${country}`
      : country !== "Noma'lum"
      ? country
      : "Lokal / Aniqlanmadi";

    // User Agent parsing
    const userAgent = req.headers.get("user-agent") || "";
    const { os, browser, deviceType } = parseDevice(userAgent);

    const now = new Date();
    // Toshkent vaqti bilan formatlash
    const timeFormatted = now.toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const message = [
      `👀 <b>Portfolio'ga Yangi Tashrif!</b>`,
      ``,
      `📍 <b>Joylashuv:</b> ${escapeHtml(locationText)}`,
      `🌐 <b>IP manzil:</b> <code>${escapeHtml(ip)}</code>`,
      `${deviceType}: <b>${escapeHtml(os)}</b> / <b>${escapeHtml(browser)}</b>`,
      `📐 <b>Ekran:</b> ${escapeHtml(screen)} (${escapeHtml(language)})`,
      `📄 <b>Sahifa:</b> <code>${escapeHtml(path)}</code>`,
      `🔗 <b>Manba:</b> ${escapeHtml(referrer)}`,
      `⏰ <b>Vaqt:</b> ${timeFormatted} (Toshkent vaqti)`,
    ].join("\n");

    await sendTelegramNotification(message);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[Track-Visit] Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
