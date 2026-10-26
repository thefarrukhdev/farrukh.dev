import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.email !== "string" || !body.email.trim()) {
      return NextResponse.json(
        { ok: false, error: "Email manzili kiritilishi shart." },
        { status: 400 },
      );
    }

    const email = body.email.trim();
    // Oddiy email validatsiyasi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Yaroqsiz email formati." },
        { status: 400 },
      );
    }

    const name = typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : "Kiritilmadi";
    const userMessage = typeof body.message === "string" && body.message.trim()
      ? body.message.trim()
      : "Xabar matni yo'q (Faqat aloqa qoldirildi)";

    // Geolocation va IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1"
      : realIp || "127.0.0.1";

    const country = req.headers.get("x-vercel-ip-country") || "Noma'lum";
    const city = req.headers.get("x-vercel-ip-city");
    const locationText = city && country !== "Noma'lum"
      ? `${decodeURIComponent(city)}, ${country}`
      : country !== "Noma'lum"
      ? country
      : "Lokal / Aniqlanmadi";

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

    const telegramText = [
      `🚀 <b>YANGI ALOQA / XABAR (Lead)!</b>`,
      `───────────────────────`,
      `👤 <b>Ism:</b> ${escapeHtml(name)}`,
      `📧 <b>Email:</b> <code>${escapeHtml(email)}</code>`,
      ``,
      `💬 <b>Xabar:</b>`,
      `<i>${escapeHtml(userMessage)}</i>`,
      `───────────────────────`,
      `📍 <b>Joylashuv:</b> ${escapeHtml(locationText)}`,
      `🌐 <b>IP:</b> <code>${escapeHtml(ip)}</code>`,
      `⏰ <b>Vaqt:</b> ${timeFormatted} (Toshkent vaqti)`,
    ].join("\n");

    const result = await sendTelegramNotification(telegramText);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: "Xabarni yetkazishda xatolik yuz berdi." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, message: "Xabaringiz muvaffaqiyatli qabul qilindi!" });
  } catch (error: unknown) {
    console.error("[Contact-API] Exception:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda kutilmagan xatolik." },
      { status: 500 },
    );
  }
}
