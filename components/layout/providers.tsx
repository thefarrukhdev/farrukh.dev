"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ThemeProvider } from "next-themes";
import { ContactProvider } from "@/components/contact/contact-context";
import { ContactModal } from "@/components/contact/contact-modal";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <ContactProvider>
          <VisitorTracker />
          <ContactModal />
          <SmoothScroll>{children}</SmoothScroll>
        </ContactProvider>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
