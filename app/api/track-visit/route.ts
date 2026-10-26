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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      type = "visit",
      vid = "usr_anon",
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
      gpu = "Noma'lum GPU",
      cpu = "Noma'lum",
      ram = "Noma'lum",
      connection = "Noma'lum",
      timezone = "Noma'lum",
      languages = "en",
      action = "",
      meta = {},
    } = body;

    // IP va Vercel Geo ma'lumotlarini olish
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1"
      : realIp || "127.0.0.1";

    const country = req.headers.get("x-vercel-ip-country");
    const city = req.headers.get("x-vercel-ip-city");
    const region = req.headers.get("x-vercel-ip-country-region");
    const lat = req.headers.get("x-vercel-ip-latitude");
    const lon = req.headers.get("x-vercel-ip-longitude");
    const asNumber = req.headers.get("x-vercel-ip-as-number");
    const postal = req.headers.get("x-vercel-ip-postal-code");

    let locationText = "Lokal / Aniqlanmadi";
    if (country) {
      const locParts = [];
      if (city) locParts.push(decodeURIComponent(city));
      if (region) locParts.push(region);
      locParts.push(country);
      if (postal) locParts.push(`[${postal}]`);
      locationText = locParts.join(", ");
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
      // 🎯 FOYDALANUVCHI HARAKATI (Masalan: Rezyumeni ko'rdi, 40s o'qidi, loyihani ochdi)
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
        `📌 <b>Manbasi:</b> ${escapeHtml(sourceBadge)}`,
        `📄 <b>Joriy sahifa:</b> <code>${escapeHtml(path)}</code>`,
        ...(metaLines.length > 0 ? [``, ...metaLines] : []),
        `━━━━━━━━━━━━━━━━━━━━`,
        `📍 <b>Joylashuv:</b> ${escapeHtml(locationText)}`,
        `🌐 <b>IP:</b> <code>${escapeHtml(ip)}</code>`,
        `⏰ <b>Vaqt:</b> ${timeFormatted} (Toshkent)`,
      ].join("\n");
    } else {
      // ⚡️ TO'LIQ KIRISH TELEMETRIYASI
      const title = isReturning
        ? `🔥 <b>QAYTA TASHRIF! (${visitCount}-marta kirdi)</b>`
        : `⚡️ <b>YANGI TASHRIFCHI ANIQLANDI!</b>`;

      const mapsLink = lat && lon
        ? `🗺 <b>Xarita:</b> <a href="https://maps.google.com/?q=${lat},${lon}">Google Maps'da ko'rish</a>`
        : "";

      const ispText = asNumber ? `(ASN: ${escapeHtml(asNumber)})` : "";

      message = [
        title,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📌 <b>Manba:</b> ${escapeHtml(sourceBadge)}`,
        inApp ? `📱 <b>Ilova:</b> ${escapeHtml(inApp)}` : "",
        refParam ? `🏷 <b>Havola parametri:</b> <code>${escapeHtml(refParam)}</code>` : "",
        referrer && referrer !== "Bo'sh" ? `🔗 <b>Referrer:</b> ${escapeHtml(referrer)}` : "",
        isReturning && initialSource ? `🕰 <b>Ilk kelgan manbasi:</b> ${escapeHtml(initialSource)}` : "",
        ``,
        `📍 <b>Joylashuv:</b> ${escapeHtml(locationText)}`,
        mapsLink,
        `🌐 <b>IP:</b> <code>${escapeHtml(ip)}</code> ${ispText}`,
        `🕒 <b>Vaqt mintaqasi:</b> ${escapeHtml(timezone)}`,
        ``,
        `💻 <b>Qurilma:</b> ${deviceType} — <b>${escapeHtml(os)}</b> / <b>${escapeHtml(browser)}</b>`,
        `🎮 <b>Videokarta (GPU):</b> <code>${escapeHtml(gpu)}</code>`,
        `🧠 <b>Texnik quvvat:</b> ${escapeHtml(cpu)} | ${escapeHtml(ram)}`,
        `📐 <b>Ekran:</b> ${escapeHtml(screen)} (Viewport: ${escapeHtml(viewport)})`,
        `📶 <b>Tarmoq aloqasi:</b> ${escapeHtml(connection)}`,
        `🗣 <b>Tizim tillari:</b> ${escapeHtml(languages)}`,
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
