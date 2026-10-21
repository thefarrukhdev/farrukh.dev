"use client";

import { ArrowRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactButton } from "./contact-button";
import { contact } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactCardCtas(): ReactNode {
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
          className="shrink-0"
        >
          <Link
            href={contact.cta.href}
            className="border border-foreground/5 focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground shadow-md/2 transition-colors whitespace-nowrap shrink-0"
          >
            {contact.cta.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 shrink-0"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
