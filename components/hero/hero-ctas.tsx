"use client";

import { ArrowRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";
import { hero } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.35, ease: EASE } }}
        className="mt-2 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3"
      >
        <div className="shrink-0">
          <ContactButton />
        </div>

        <motion.div
          layout
          transition={{ layout: { duration: 0.35, ease: EASE } }}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0"
        >
          <Link
            href={hero.ctas.primary.href}
            className="border border-foreground/5 focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground shadow-2xl transition-colors hover:bg-foreground/4 whitespace-nowrap shrink-0"
          >
            {hero.ctas.primary.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 shrink-0"
              aria-hidden="true"
            />
          </Link>

          <a
            href={hero.ctas.resume.href}
            target="_blank"
            rel="noopener noreferrer"
            download="Farrukh_Resume.pdf"
            className="border border-foreground/8 focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground/70 transition-colors hover:text-foreground hover:bg-foreground/4 whitespace-nowrap shrink-0"
          >
            {hero.ctas.resume.label}
          </a>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
