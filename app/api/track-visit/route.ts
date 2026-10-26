import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, sendTelegramNotification } from "@/lib/telegram";

function parseDevice(ua: string) {
  let os = "Noma'lum OS";
  if (/windows/i.test(ua)) os = "Windows PC";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS (Apple Mac)";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone/i.test(ua)) os = "Apple iPhone";
  else if (/ipad/i.test(ua)) os = "Apple iPad";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Noma'lum Brauzer";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  const isMobile = /mobile|iphone|android|ipad/i.test(ua);
  const deviceType = isMobile ? "📱 Mobil Qurilma" : "💻 Kompyuter (Desktop)";

  return { os, browser, deviceType };
}

interface IpEnrichment {
  isp?: string;
  org?: string;
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
  isMobile?: boolean;
  isProxy?: boolean;
  asNumber?: string;
}

async function enrichIp(ip: string): Promise<IpEnrichment> {
  // Agar lokal yoki ichki IP bo'lsa, tashqi API chaqirmaymiz
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return {};
  }

  try {
    const url = `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,isp,org,as,mobile,proxy,hosting`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(1200),
    });
    if (!res.ok) return {};
    const data = await res.json();
    if (data.status !== "success") return {};

    return {
      isp: data.isp,
      org: data.org,
      city: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      isMobile: Boolean(data.mobile),
      isProxy: Boolean(data.proxy || data.hosting),
      asNumber: data.as,
    };
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      type = "visit",
      vid = "usr_anon",
      hwHash = "",
      visitCount = 1,
      isReturning = false,
      initialSource = "",
      path = "/",
      sourceBadge = "🌐 Noma'lum manba",
      inApp = "",
      refParam = "",
      referrer = "Bo'sh",
      screen = "Noma'lum",
      viewport = "Noma'lum",
      refreshRate = "",
      colorGamut = "",
      battery = "",
      gpu = "Noma'lum GPU",
      cpu = "Noma'lum",
      ram = "Noma'lum",
      connection = "Noma'lum",
      timezone = "Noma'lum",
      languages = "en",
      action = "",
      meta = {},
    } = body;

    // IP Extraction
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1"
      : realIp || "127.0.0.1";

    // Vercel Geolocation headers
    const vCountry = req.headers.get("x-vercel-ip-country");
    const vCity = req.headers.get("x-vercel-ip-city");
    const vRegion = req.headers.get("x-vercel-ip-country-region");
    const vLat = req.headers.get("x-vercel-ip-latitude");
    const vLon = req.headers.get("x-vercel-ip-longitude");

    // Server-side IP Enrichment (ISP, Organization, VPN, Mobile/Fiber)
    const ipInfo = await enrichIp(ip);

    const country = ipInfo.country || vCountry || "Noma'lum";
    const city = ipInfo.city || (vCity ? decodeURIComponent(vCity) : "");
    const lat = ipInfo.lat ? String(ipInfo.lat) : vLat;
    const lon = ipInfo.lon ? String(ipInfo.lon) : vLon;

    let locationText = "Lokal / Aniqlanmadi";
    if (country !== "Noma'lum") {
      const parts = [];
      if (city) parts.push(city);
      if (vRegion && !city.includes(vRegion)) parts.push(vRegion);
      parts.push(country);
      locationText = parts.join(", ");
    }

    const now = new Date();
    const timeFormatted = now.toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const userAgent = req.headers.get("user-agent") || "";
    const { os, browser, deviceType } = parseDevice(userAgent);

    let message = "";

    if (type === "event") {
      // 🎯 FOYDALANUVCHI HARAKATI (Nusxaladi, rezyumeni ochdi, scroll qildi)
      const metaLines: string[] = [];
      if (meta && typeof meta === "object") {
        for (const [k, v] of Object.entries(meta)) {
          if (v) metaLines.push(`• <b>${escapeHtml(k)}:</b> <code>${escapeHtml(String(v))}</code>`);
        }
      }

      message = [
        `🎯 <b>TASHRIFCHI HARAKATI (Signal)!</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `🔥 <b>Harakat:</b> ${escapeHtml(action)}`,
        `👤 <b>Foydalanuvchi:</b> <code>#${escapeHtml(vid)}</code> (${visitCount}-tashrif)`,
        hwHash ? `🧬 <b>Apparat kodi:</b> <code>#hw_${escapeHtml(hwHash)}</code>` : "",
        `📌 <b>Manbasi:</b> ${escapeHtml(sourceBadge)}`,
        `📄 <b>Joriy sahifa:</b> <code>${escapeHtml(path)}</code>`,
        ...(metaLines.length > 0 ? [``, ...metaLines] : []),
        `━━━━━━━━━━━━━━━━━━━━`,
        `📍 <b>Joylashuv:</b> ${escapeHtml(locationText)}`,
        `🌐 <b>IP:</b> <code>${escapeHtml(ip)}</code>`,
        `⏰ <b>Vaqt:</b> ${timeFormatted} (Toshkent)`,
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      // ⚡️ TO'LIQ PASSIV TELEMETRIYA VA SILICON BARMOQ IZI
      const title = isReturning
        ? `🔥 <b>QAYTA TASHRIF! (${visitCount}-marta kirdi)</b>`
        : `⚡️ <b>YANGI TASHRIFCHI ANIQLANDI!</b>`;

      const mapsLink = lat && lon
        ? `🗺 <b>Xarita:</b> <a href="https://maps.google.com/?q=${lat},${lon}">Google Maps'da ko'rish</a>`
        : "";

      // Tarmoq va Provayder xulosasi
      const networkTypeBadge = ipInfo.isMobile
        ? "📱 Mobil internet (4G/5G)"
        : "🏠 Simli Wi-Fi / Ofis interneti";

      const vpnBadge = ipInfo.isProxy
        ? "⚠️ VPN / Proksi aniqlandi"
        : "🟢 Haqiqiy IP (VPN yo'q)";

      const ispLine = ipInfo.isp
        ? `🏢 <b>Provayder:</b> ${escapeHtml(ipInfo.isp)}${ipInfo.org && ipInfo.org !== ipInfo.isp ? ` (${escapeHtml(ipInfo.org)})` : ""}`
        : "";

      message = [
        title,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📌 <b>Manba:</b> ${escapeHtml(sourceBadge)}`,
        inApp ? `📱 <b>Ilova:</b> ${escapeHtml(inApp)}` : "",
        refParam ? `🏷 <b>Teg (Parametr):</b> <code>${escapeHtml(refParam)}</code>` : "",
        referrer && referrer !== "Bo'sh" ? `🔗 <b>Referrer:</b> ${escapeHtml(referrer)}` : "",
        isReturning && initialSource ? `🕰 <b>Ilk kelgan manbasi:</b> ${escapeHtml(initialSource)}` : "",
        ``,
        `🏢 <b>Tarmoq & Provayder:</b>`,
        ispLine,
        `• <b>Aloqa:</b> ${networkTypeBadge} | ${vpnBadge}`,
        `• <b>IP:</b> <code>${escapeHtml(ip)}</code>`,
        ``,
        `📍 <b>Geografiya:</b>`,
        `• <b>Joylashuv:</b> ${escapeHtml(locationText)}`,
        mapsLink,
        `• <b>Vaqt mintaqasi:</b> ${escapeHtml(timezone)}`,
        ``,
        `💻 <b>Qurilma & Apparatli Barmoq Izi:</b>`,
        `• <b>Qurilma:</b> ${deviceType} — <b>${escapeHtml(os)}</b> / <b>${escapeHtml(browser)}</b>`,
        hwHash ? `• <b>Silicon ID:</b> <code>#hw_${escapeHtml(hwHash)}</code>` : "",
        `• <b>Videokarta (GPU):</b> <code>${escapeHtml(gpu)}</code>`,
        `• <b>Tizim kuchi:</b> ${escapeHtml(cpu)} | ${escapeHtml(ram)}`,
        `• <b>Ekran:</b> ${escapeHtml(screen)} (Viewport: ${escapeHtml(viewport)}) ${refreshRate ? `[${escapeHtml(refreshRate)}]` : ""}`,
        colorGamut ? `• <b>Rang formati:</b> ${escapeHtml(colorGamut)}` : "",
        battery && battery !== "Noma'lum" ? `• <b>Batareya:</b> ${escapeHtml(battery)}` : "",
        connection && connection !== "Noma'lum" ? `• <b>Aloqa tezligi:</b> ${escapeHtml(connection)}` : "",
        `• <b>Tizim tillari:</b> ${escapeHtml(languages)}`,
        ``,
        `📄 <b>Kirgan sahifasi:</b> <code>${escapeHtml(path)}</code>`,
        `⏰ <b>Toshkent vaqti:</b> ${timeFormatted}`,
        `🆔 <b>Visitor ID:</b> <code>#${escapeHtml(vid)}</code>`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    await sendTelegramNotification(message);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[Track-Visit] Exception:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
