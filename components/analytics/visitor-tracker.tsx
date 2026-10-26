"use client";

import { useEffect } from "react";

/**
 * Silent Visitor Intelligence & Social Campaign Attribution Tracker.
 * Runs 100% silently in the background without UI interruption.
 */

function getGpuRenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "WebGL qo'llab-quvvatlanmaydi";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) {
      return (gl.getParameter(gl.RENDERER) as string) || "Standart WebGL";
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return typeof renderer === "string" ? renderer : "Standart GPU";
  } catch {
    return "Noma'lum GPU";
  }
}

function detectSocialAndInApp(urlStr: string, referrer: string, ua: string) {
  let refParam = "";
  try {
    const url = new URL(urlStr);
    refParam =
      url.searchParams.get("ref") ||
      url.searchParams.get("utm_source") ||
      url.searchParams.get("source") ||
      url.searchParams.get("s") ||
      url.searchParams.get("utm_campaign") ||
      "";
  } catch {}

  let inApp = "";
  if (/telegram/i.test(ua)) {
    inApp = "📱 Telegram In-App Browser";
  } else if (/instagram/i.test(ua)) {
    inApp = "📸 Instagram In-App Webview";
  } else if (/linkedin|linkedinapp/i.test(ua)) {
    inApp = "💼 LinkedIn In-App Webview";
  } else if (/twitter|tweet|x\/android|x\/ios/i.test(ua)) {
    inApp = "🐦 X (Twitter) In-App Webview";
  } else if (/fban|fbav|facebookexternalhit/i.test(ua)) {
    inApp = "📘 Facebook In-App Webview";
  } else if (/tiktok|bytedance/i.test(ua)) {
    inApp = "🎵 TikTok In-App Webview";
  }

  let sourceBadge = "";
  const lowerRef = refParam.toLowerCase();

  if (lowerRef === "tg" || lowerRef === "telegram") {
    sourceBadge = "📱 Telegram (Profil yoki Kanal havolasi)";
  } else if (lowerRef === "linkedin" || lowerRef === "li") {
    sourceBadge = "💼 LinkedIn (Profil yoki Post havolasi)";
  } else if (lowerRef === "instagram" || lowerRef === "insta" || lowerRef === "ig") {
    sourceBadge = "📸 Instagram (Bio yoki Story havolasi)";
  } else if (lowerRef === "resume" || lowerRef === "cv") {
    sourceBadge = "📄 Rezyume / CV (Ish beruvchi / HR)";
  } else if (lowerRef === "hh" || lowerRef === "headhunter") {
    sourceBadge = "🏢 HeadHunter (Vakansiya arizasi)";
  } else if (lowerRef === "github" || lowerRef === "gh") {
    sourceBadge = "🐙 GitHub Profili";
  } else if (lowerRef === "twitter" || lowerRef === "x") {
    sourceBadge = "🐦 X (Twitter)";
  } else if (refParam) {
    sourceBadge = `🎯 Maxsus belgi: ${refParam}`;
  }

  // Referrer orqali aniqlash agar ref bo'sh bo'lsa
  if (!sourceBadge && referrer) {
    if (/t\.me|telegram/i.test(referrer)) {
      sourceBadge = "📱 Telegram";
    } else if (/linkedin\.com/i.test(referrer)) {
      sourceBadge = "💼 LinkedIn";
    } else if (/instagram\.com/i.test(referrer)) {
      sourceBadge = "📸 Instagram";
    } else if (/t\.co|twitter\.com|x\.com/i.test(referrer)) {
      sourceBadge = "🐦 X (Twitter)";
    } else if (/github\.com/i.test(referrer)) {
      sourceBadge = "🐙 GitHub";
    } else if (/google\./i.test(referrer)) {
      sourceBadge = "🔍 Google Search (Qidiruv orqali)";
    } else if (/yandex\./i.test(referrer)) {
      sourceBadge = "🔍 Yandex Search (Qidiruv orqali)";
    } else if (/facebook\.com|fb\.com/i.test(referrer)) {
      sourceBadge = "📘 Facebook";
    }
  }

  if (!sourceBadge) {
    if (inApp) {
      sourceBadge = inApp;
    } else if (referrer && !referrer.includes(window.location.hostname)) {
      sourceBadge = `🔗 Tashqi sayt: ${referrer}`;
    } else {
      sourceBadge = "🌐 To'g'ridan-to'g'ri (Direct / Bookmark)";
    }
  }

  return { sourceBadge, inApp, refParam };
}

interface VisitorProfile {
  vid: string;
  visitCount: number;
  isReturning: boolean;
  firstSeen: string;
  initialSource: string;
}

function getOrInitVisitorProfile(source: string): VisitorProfile {
  try {
    let vid = localStorage.getItem("fv_vid");
    const countStr = localStorage.getItem("fv_vcount");
    let visitCount = countStr ? parseInt(countStr, 10) : 0;
    let firstSeen = localStorage.getItem("fv_first_seen");
    let initialSource = localStorage.getItem("fv_init_src");

    const nowIso = new Date().toISOString();

    if (!vid) {
      vid = "usr_" + Math.random().toString(36).substring(2, 8);
      visitCount = 1;
      firstSeen = nowIso;
      initialSource = source || "Direct";
      localStorage.setItem("fv_vid", vid);
      localStorage.setItem("fv_first_seen", firstSeen);
      localStorage.setItem("fv_init_src", initialSource);
      localStorage.setItem("fv_vcount", "1");
    } else {
      // Yangi sessiyami?
      if (!sessionStorage.getItem("fv_session_active")) {
        visitCount += 1;
        localStorage.setItem("fv_vcount", visitCount.toString());
      }
    }

    sessionStorage.setItem("fv_session_active", "1");
    localStorage.setItem("fv_last_seen", nowIso);

    return {
      vid,
      visitCount,
      isReturning: visitCount > 1,
      firstSeen: firstSeen || nowIso,
      initialSource: initialSource || source,
    };
  } catch {
    return {
      vid: "usr_incognito",
      visitCount: 1,
      isReturning: false,
      firstSeen: new Date().toISOString(),
      initialSource: source,
    };
  }
}

export function VisitorTracker(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Bir brauzer sessiyasida qayta-qayta kirish xabarini bermaslik
    const alreadyTrackedThisSession = sessionStorage.getItem("fv_tracked");

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
      };
    };

    const urlStr = window.location.href;
    const referrer = document.referrer || "";
    const ua = navigator.userAgent;

    const { sourceBadge, inApp, refParam } = detectSocialAndInApp(
      urlStr,
      referrer,
      ua,
    );
    const profile = getOrInitVisitorProfile(sourceBadge);

    const gpu = getGpuRenderer();
    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Noma'lum";
    const languages = navigator.languages
      ? Array.from(navigator.languages).join(", ")
      : navigator.language || "en";

    const screenRes = `${window.screen.width}x${window.screen.height} (@${window.devicePixelRatio || 1}x)`;
    const viewportRes = `${window.innerWidth}x${window.innerHeight}`;
    const cpuCores = navigator.hardwareConcurrency
      ? `${navigator.hardwareConcurrency} cores`
      : "Noma'lum";
    const ram = nav.deviceMemory ? `~${nav.deviceMemory} GB RAM` : "Noma'lum";
    const touchPoints = navigator.maxTouchPoints || 0;

    let connectionInfo = "Noma'lum";
    if (nav.connection) {
      const parts = [];
      if (nav.connection.effectiveType) parts.push(nav.connection.effectiveType.toUpperCase());
      if (nav.connection.downlink) parts.push(`${nav.connection.downlink} Mbps`);
      if (nav.connection.rtt) parts.push(`ping: ${nav.connection.rtt}ms`);
      if (parts.length > 0) connectionInfo = parts.join(" / ");
    }

    // A) Agar bu sessiyada hali xabar yuborilmagan bo'lsa, to'liq kirish telemetriyasini yuborish
    if (!alreadyTrackedThisSession) {
      sessionStorage.setItem("fv_tracked", "1");

      const payload = {
        type: "visit",
        vid: profile.vid,
        visitCount: profile.visitCount,
        isReturning: profile.isReturning,
        initialSource: profile.initialSource,
        path: window.location.pathname + window.location.search,
        sourceBadge,
        inApp,
        refParam,
        referrer: referrer || "To'g'ridan-to'g'ri / Bo'sh",
        screen: screenRes,
        viewport: viewportRes,
        gpu,
        cpu: cpuCores,
        ram,
        touchPoints,
        connection: connectionInfo,
        timezone,
        languages,
      };

      fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }

    // B) Muhim havolalarni bosishni avtomatik eshitish (Silent Action Beacon)
    const sendEvent = (actionName: string, meta?: Record<string, unknown>) => {
      fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event",
          vid: profile.vid,
          visitCount: profile.visitCount,
          sourceBadge,
          action: actionName,
          path: window.location.pathname,
          meta,
        }),
        keepalive: true,
      }).catch(() => {});
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = target.textContent?.trim() || "";

      if (
        href.includes(".pdf") ||
        href.includes("Resume") ||
        text.toLowerCase().includes("resume")
      ) {
        sendEvent("📄 Rezyumeni (PDF) ko'rishga kirdi / yukladi", { href });
      } else if (href.includes("linkedin.com")) {
        sendEvent("💼 LinkedIn profilingiz havolasini ochdi", { href });
      } else if (href.includes("github.com")) {
        sendEvent("🐙 GitHub profilingiz havolasini ochdi", { href });
      } else if (href.includes("safaar") || href.includes("bunkerstroy")) {
        sendEvent(`🚀 Loyiha jonli demo havolasini ochdi: ${text || href}`, { href });
      }
    };

    document.addEventListener("click", handleClick, { passive: true });

    // C) Saytda 40 soniyadan ortiq qolgan qiziquvchan tashrifchi bildirishnomasi
    let dwellTimeout: NodeJS.Timeout | null = null;
    const dwellSentKey = "fv_dwell_sent";

    if (!sessionStorage.getItem(dwellSentKey)) {
      dwellTimeout = setTimeout(() => {
        if (document.visibilityState === "visible") {
          sessionStorage.setItem(dwellSentKey, "1");
          sendEvent("⏱ Foydalanuvchi saytda 40+ soniya o'rganmoqda (Yuqori qiziqish)", {
            dwellTime: "40 soniya+",
            currentPath: window.location.pathname,
          });
        }
      }, 40000);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      if (dwellTimeout) clearTimeout(dwellTimeout);
    };
  }, []);

  return null;
}
