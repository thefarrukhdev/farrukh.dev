"use client";

import { useEffect } from "react";

/**
 * State-of-the-Art Passive Telemetry, Silicon Hardware Fingerprinting,
 * and Behavioral Intent Tracker.
 * Runs 100% silently in the background without UI interruption.
 */

// cyrb53 fast 53-bit non-cryptographic hasher
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return hash.toString(36);
}

// 1. Audio DSP Fingerprinting via OfflineAudioContext
async function getAudioFingerprint(): Promise<string> {
  try {
    const AudioCtx =
      window.OfflineAudioContext ||
      (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
    if (!AudioCtx) return "no-audio-ctx";

    const context = new AudioCtx(1, 5000, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 1000;

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.2;

    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    const buffer = await context.startRendering();
    const channelData = buffer.getChannelData(0);
    let sum = 0;
    for (let i = 4500; i < 5000; i++) {
      sum += Math.abs(channelData[i] || 0);
    }
    return sum.toFixed(6);
  } catch {
    return "unsupported";
  }
}

// 2. Canvas 2D Subpixel Rendering Fingerprint
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial', 'Times New Roman', sans-serif";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Farrukh Dev 🚀 😃", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Farrukh Dev 🚀 😃", 4, 17);

    return cyrb53(canvas.toDataURL());
  } catch {
    return "unsupported";
  }
}

// 3. WebGL / GPU Renderer
function getGpuRenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "WebGL yo'q";

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

// 4. Display Refresh Rate Estimation (60Hz vs 120Hz ProMotion vs 144Hz)
function getRefreshRate(): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    let startTime = 0;

    const checkFrame = (now: number) => {
      if (frameCount === 0) {
        startTime = now;
      }
      frameCount++;
      if (frameCount < 30) {
        requestAnimationFrame(checkFrame);
      } else {
        const delta = now - startTime;
        const fps = Math.round((frameCount * 1000) / delta);
        // Normalize to common refresh rate bands
        if (fps >= 135) resolve(144);
        else if (fps >= 110) resolve(120);
        else if (fps >= 80) resolve(90);
        else if (fps >= 55) resolve(60);
        else resolve(fps);
      }
    };

    requestAnimationFrame(checkFrame);
  });
}

// 5. Battery Status (Chromium)
async function getBatteryStatus(): Promise<string> {
  try {
    const nav = navigator as unknown as {
      getBattery?: () => Promise<{ level: number; charging: boolean }>;
    };
    if (nav.getBattery) {
      const b = await nav.getBattery();
      const level = Math.round(b.level * 100);
      const charging = b.charging ? "⚡️ Quvvatlanmoqda" : "🔋 Zaryadda";
      return `${level}% (${charging})`;
    }
    return "Noma'lum";
  } catch {
    return "Noma'lum";
  }
}

// 6. Social Traffic & In-App Webview Detection
function detectSocialAndInApp(urlStr: string, referrer: string, ua: string) {
  let refParam = "";
  try {
    const url = new URL(urlStr);
    refParam =
      url.searchParams.get("ref") ||
      url.searchParams.get("utm_source") ||
      url.searchParams.get("source") ||
      url.searchParams.get("s") ||
      url.searchParams.get("to") ||
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
    sourceBadge = "📱 Telegram (Profil/Kanal havolasi)";
  } else if (lowerRef === "linkedin" || lowerRef === "li") {
    sourceBadge = "💼 LinkedIn (Profil/Post havolasi)";
  } else if (lowerRef === "instagram" || lowerRef === "insta" || lowerRef === "ig") {
    sourceBadge = "📸 Instagram (Bio/Story havolasi)";
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
      sourceBadge = `🔗 Tashqi havola: ${referrer}`;
    } else {
      sourceBadge = "🌐 To'g'ridan-to'g'ri (Direct / Bookmark)";
    }
  }

  return { sourceBadge, inApp, refParam };
}

// 7. Resilient Visitor Lifecycle & Composite Hardware Signature
function getOrInitVisitorProfile(compositeHwHash: string, source: string) {
  try {
    let vid = localStorage.getItem("fv_vid");
    const countStr = localStorage.getItem("fv_vcount");
    let visitCount = countStr ? parseInt(countStr, 10) : 0;
    let firstSeen = localStorage.getItem("fv_first_seen");
    let initialSource = localStorage.getItem("fv_init_src");

    const nowIso = new Date().toISOString();

    if (!vid) {
      vid = `usr_${compositeHwHash.substring(0, 7)}`;
      visitCount = 1;
      firstSeen = nowIso;
      initialSource = source || "Direct";
      localStorage.setItem("fv_vid", vid);
      localStorage.setItem("fv_first_seen", firstSeen);
      localStorage.setItem("fv_init_src", initialSource);
      localStorage.setItem("fv_vcount", "1");
    } else {
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
      vid: `usr_${compositeHwHash.substring(0, 7)}`,
      visitCount: 1,
      isReturning: false,
      firstSeen: new Date().toISOString(),
      initialSource: source,
    };
  }
}

// Safe payload transport via sendBeacon or keepalive fetch
function sendTelemetry(payload: Record<string, unknown>) {
  try {
    const dataStr = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([dataStr], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/track-visit", blob);
      if (ok) return;
    }
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: dataStr,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function VisitorTracker(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;

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

    // Initial passive extraction
    const canvasHash = getCanvasFingerprint();
    const gpu = getGpuRenderer();
    const colorGamut = window.matchMedia("(color-gamut: p3)").matches
      ? "Display P3 (Wide Color)"
      : "sRGB";

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

    let connectionInfo = "Noma'lum";
    if (nav.connection) {
      const parts = [];
      if (nav.connection.effectiveType) parts.push(nav.connection.effectiveType.toUpperCase());
      if (nav.connection.downlink) parts.push(`${nav.connection.downlink} Mbps`);
      if (nav.connection.rtt) parts.push(`ping: ${nav.connection.rtt}ms`);
      if (parts.length > 0) connectionInfo = parts.join(" / ");
    }

    // Async extraction: Audio, Battery, Refresh Rate
    Promise.all([
      getAudioFingerprint(),
      getBatteryStatus(),
      getRefreshRate(),
    ]).then(([audioHash, battery, hz]) => {
      const rawHardwareString = `${canvasHash}|${audioHash}|${gpu}|${screenRes}|${cpuCores}|${ram}`;
      const compositeHwHash = cyrb53(rawHardwareString);

      const profile = getOrInitVisitorProfile(compositeHwHash, sourceBadge);

      // --- PASSIVE EVENT GATING (BOT FILTER) ---
      // We wait for the first organic human event (touch, scroll, mousemove, keydown)
      // to filter out crawler preview bots (TelegramBot, Twitterbot, LinkedInBot)
      let beaconDispatched = false;
      const alreadyTrackedThisSession = sessionStorage.getItem("fv_tracked");

      const dispatchVisitBeacon = () => {
        if (beaconDispatched || alreadyTrackedThisSession) return;
        beaconDispatched = true;
        sessionStorage.setItem("fv_tracked", "1");

        sendTelemetry({
          type: "visit",
          vid: profile.vid,
          hwHash: compositeHwHash,
          canvasHash,
          audioHash,
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
          refreshRate: `${hz}Hz`,
          colorGamut,
          battery,
          gpu,
          cpu: cpuCores,
          ram,
          connection: connectionInfo,
          timezone,
          languages,
        });
      };

      // If already tracked this session, no need to gate
      if (alreadyTrackedThisSession) {
        beaconDispatched = true;
      } else {
        const humanEvents = ["mousedown", "touchstart", "scroll", "keydown"] as const;
        const onHumanInteraction = () => {
          dispatchVisitBeacon();
          humanEvents.forEach((ev) => window.removeEventListener(ev, onHumanInteraction));
        };
        humanEvents.forEach((ev) => window.addEventListener(ev, onHumanInteraction, { once: true, passive: true }));

        // Mouse move listener with minimum 10px delta
        let startX = -1;
        let startY = -1;
        const onMouseMove = (e: MouseEvent) => {
          if (startX === -1) {
            startX = e.clientX;
            startY = e.clientY;
            return;
          }
          if (Math.hypot(e.clientX - startX, e.clientY - startY) > 10) {
            dispatchVisitBeacon();
            window.removeEventListener("mousemove", onMouseMove);
          }
        };
        window.addEventListener("mousemove", onMouseMove, { passive: true });

        // Fallback timer: 4s (in case a real user reads without moving for 4 seconds)
        setTimeout(() => {
          dispatchVisitBeacon();
        }, 4000);
      }

      // --- HIGH INTENT BEHAVIORAL SIGNALS ---

      const sendEvent = (actionName: string, meta?: Record<string, unknown>) => {
        sendTelemetry({
          type: "event",
          vid: profile.vid,
          hwHash: compositeHwHash,
          visitCount: profile.visitCount,
          sourceBadge,
          action: actionName,
          path: window.location.pathname,
          meta,
        });
      };

      // 1. Text Selection & Copy Event (HR/Recruiter copying contact info or code)
      const handleCopy = () => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
          const preview = selection.length > 80 ? `${selection.substring(0, 80)}...` : selection;
          sendEvent("📋 Tashrifchi matndan nusxa oldi (Copy)", {
            copiedText: preview,
            length: selection.length,
          });
        }
      };
      document.addEventListener("copy", handleCopy);

      // 2. High-Intent Link Clicks (Resume, LinkedIn, Projects)
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
          sendEvent(`🚀 Loyiha demo havolasini ochdi: ${text || href}`, { href });
        }
      };
      document.addEventListener("click", handleClick, { passive: true });

      // 3. Active Dwell Time (Only count when document is visible)
      let activeSeconds = 0;
      let sent30s = false;
      let sent60s = false;

      setInterval(() => {
        if (document.visibilityState === "visible") {
          activeSeconds += 1;

          if (activeSeconds === 30 && !sent30s) {
            sent30s = true;
            sendEvent("⏱ 30 soniya faol o'qish (Qiziqish boshlandi)", {
              activeDwellTime: "30 soniya",
            });
          } else if (activeSeconds === 60 && !sent60s) {
            sent60s = true;
            sendEvent("🔥 1 daqiqa chuqur o'qish (Yuqori qiziqish!)", {
              activeDwellTime: "60+ soniya",
            });
          }
        }
      }, 1000);

      // 4. Scroll Depth (50% and 90% read thresholds)
      let sent50 = false;
      let sent90 = false;
      const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollPercent >= 50 && !sent50) {
          sent50 = true;
          sendEvent("👀 Sahifani 50% ko'rib chiqdi", { depth: "50%" });
        }
        if (scrollPercent >= 90 && !sent90) {
          sent90 = true;
          sendEvent("🌟 Barcha loyihalarni oxirigacha ko'rdi (90%+ Scroll)", { depth: "90%" });
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    });
  }, []);

  return null;
}
