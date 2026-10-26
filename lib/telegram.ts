/**
 * Telegram Notification Helper for Portfolio Analytics and Leads.
 * Uses environment variables to securely dispatch messages to Farrukh's Telegram bot.
 */

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendTelegramNotification(
  htmlText: string,
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.",
    );
    return { success: false, error: "Credentials not configured" };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error("[Telegram] API error:", data);
      return { success: false, error: data.description || "Telegram API error" };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("[Telegram] Network exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown network error",
    };
  }
}
