"use client";

import { useEffect } from "react";

export function VisitorTracker(): null {
  useEffect(() => {
    // Brauzer sessiyasi bo'yicha qayta-qayta spam qilmaslik uchun tekshiruv
    const isTracked = sessionStorage.getItem("fv_tracked");
    if (isTracked) return;

    try {
      sessionStorage.setItem("fv_tracked", "1");

      const payload = {
        path: window.location.pathname + window.location.search,
        referrer: document.referrer || "Direct / Bookmark",
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language || "en",
      };

      fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Telemetriya xatoliklari foydalanuvchiga ta'sir qilmasligi kerak
      });
    } catch {
      // Storage xatoliklari bo'lsa e'tiborsiz qoldirish
    }
  }, []);

  return null;
}
