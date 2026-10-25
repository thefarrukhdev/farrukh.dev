import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} — Frontend Engineer`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <Hero />
      <Projects withHeadline viewMoreVisible />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
