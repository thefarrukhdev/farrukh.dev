import {
  BookOpen,
  Briefcase,
  Building2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for all site copy and structured content.
 */

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const hero = {
  greeting: "Hey",
  greetingEmoji: "👋",
  name: "I\u2019m Farrukh",
  headingLines: ["I build things", "for the web."] as const,
  tagline:
    "Software Engineer specializing in modern web architecture, high-performance interfaces, and full-stack systems with React, Next.js, TypeScript, and NestJS.",
  portrait: {
    src: "/farrukh.jpg",
    alt: "Farrukh Djumayev portrait",
  },
  ctas: {
    primary: { label: "View My Work", href: "/projects" },
    resume: { label: "Resume", href: "/Farrukh_Resume.pdf?v=3" },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export type Project = {
  id: string;
  icon: LucideIcon;
  iconLabel: string;
  title: string;
  description: string;
  meta: string;
  imageRatio: number;
  image: string;
  imageAlt: string;
  githubUrl?: string;
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    id: "career-hub",
    icon: Briefcase,
    iconLabel: "School 21 CareerHub",
    title:
      "Institutional career & placement platform connecting 500+ School 21 engineers with tech employers.",
    description:
      "Engineered the institutional career placement portal connecting 500+ active software engineers from School 21 (42 Network) with tech employers. Implemented authenticated student portfolios, multi-attribute vacancy search filters, and an administrative candidate tracking pipeline. Built accessible, WCAG-compliant UI primitives with ShadCN and Radix UI, achieving 98+ Google Lighthouse scores.",
    meta: "Next.js 15 · TypeScript · Tailwind CSS · ShadCN UI · REST APIs, 2026",
    imageRatio: 16 / 10,
    image: "/projects/careerhub.png",
    imageAlt: "School 21 CareerHub screenshot",
    demoUrl: "https://careerhub.21-school.uz/",
  },
  {
    id: "safaar",
    icon: Building2,
    iconLabel: "Safaar Booking",
    title:
      "Full-stack accommodation and travel booking monorepo with client portal and administrative dashboard.",
    description:
      "Architected a scalable full-stack accommodation booking monorepo with dedicated client reservation portal and administrative property dashboard. Designed relational PostgreSQL schemas with atomic transactions and isolation levels to handle room reservation workflows and eliminate race conditions. Implemented role-based access control (RBAC) and Dockerized microservices.",
    meta: "Next.js 15 · NestJS · TypeScript · PostgreSQL · Prisma · Docker, 2026",
    imageRatio: 16 / 10,
    image: "/projects/safaar.png",
    imageAlt: "Safaar Travel & Accommodation Platform screenshot",
    githubUrl: "https://github.com/thefarrukhdev/safaar",
    demoUrl: "https://github.com/thefarrukhdev/safaar",
  },
  {
    id: "kokand-university",
    icon: BookOpen,
    iconLabel: "Kokand University",
    title:
      "Alumni employment tracking & administrative analytics platform for Kokand University.",
    description:
      "Developed an administrative analytics portal and vacancy hub for university graduates and corporate recruiters. Constructed interactive data visualization dashboards for administrative staff to monitor graduate placement statistics and employment trends, streamlining student application workflows and reducing API roundtrip latency by 35%.",
    meta: "Next.js · React · TypeScript · Tailwind CSS · REST APIs, 2025",
    imageRatio: 16 / 10,
    image: "/projects/kokand_university_lightMode.png",
    imageAlt: "Kokand University platform screenshot",
    githubUrl: "https://github.com/thefarrukhdev/kokand_university",
    demoUrl: "https://kualumni.uz/",
  },
  {
    id: "paymex",
    icon: Wallet,
    iconLabel: "PAYMEX",
    title:
      "Telegram Mini App for financial services, currency exchange, and international payments.",
    description:
      "Engineered a mobile-first Telegram Mini App frontend for PAYMEX, a financial services platform enabling currency exchange and international payments. Features responsive glassmorphism UI, ITCSS architecture, Telegram WebApp API integration, and dark-green theme.",
    meta: "React · Telegram WebApp API · JavaScript · ITCSS Architecture, 2026",
    imageRatio: 16 / 10,
    image: "/projects/paymex-projects.png",
    imageAlt: "PAYMEX Telegram Mini App screenshot",
    githubUrl: "https://github.com/thefarrukhdev/paymex",
    demoUrl: "https://paymex.vercel.app/",
  },
];

/* -------------------------------------------------------------------------- */
/* About — Experience                                                         */
/* -------------------------------------------------------------------------- */

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  slug?: string;
  brand?: string;
};

export const experience: ExperienceEntry[] = [
  {
    company: "Independent Solutions",
    role: "Fullstack / Frontend Engineer",
    period: "2024 – Present",
    brand: "#0AE448",
  },
  {
    company: "School 21 / 42 Network",
    role: "Software Engineering Program",
    period: "2024 – Present",
    brand: "#1f1f1f",
  },
  {
    company: "Najot Ta'lim",
    role: "Frontend Development Bootcamp",
    period: "Completed",
    brand: "#2F74C0",
  },
];

/* -------------------------------------------------------------------------- */
/* About — Education                                                          */
/* -------------------------------------------------------------------------- */

export type EducationEntry = {
  school: string;
  degree: string;
  period: string;
  slug?: string;
};

export const education: EducationEntry[] = [
  {
    school: "School 21 / 42 Network",
    degree: "Software Engineering (Peer-to-Peer, C & Algorithms)",
    period: "2024 – Present",
  },
  {
    school: "Najot Ta'lim",
    degree: "Modern Frontend Engineering (React, Next.js, TypeScript)",
    period: "Completed",
  },
];

/* -------------------------------------------------------------------------- */
/* About — Skills                                                             */
/* -------------------------------------------------------------------------- */

export const skills: string[] = [
  "TypeScript & JavaScript (ES6+)",
  "Next.js 15 (App Router, Server Actions)",
  "React 19 & React Server Components",
  "Node.js & NestJS Microservices",
  "PostgreSQL & Prisma ORM",
  "Tailwind CSS & ShadCN UI",
  "Zustand & TanStack Query",
  "Docker & CI/CD Pipelines",
  "RESTful APIs & WebSockets",
  "Vitest, Jest & Playwright",
  "C & Low-Level Algorithms",
  "Web Performance & Core Web Vitals",
];

/* -------------------------------------------------------------------------- */
/* About — Stack (physics chips)                                              */
/* -------------------------------------------------------------------------- */

export type StackChip = {
  label: string;
  slug: string;
  bg: string;
  fg: string;
  iconUrl?: string;
};

export const stackChips: StackChip[] = [
  { label: "React", slug: "react", bg: "#1FB6CB", fg: "#ffffff" },
  { label: "Next.js", slug: "nextdotjs", bg: "#1f1f1f", fg: "#ffffff" },
  { label: "TypeScript", slug: "typescript", bg: "#2F74C0", fg: "#ffffff" },
  { label: "NestJS", slug: "nestjs", bg: "#E0234E", fg: "#ffffff" },
  { label: "PostgreSQL", slug: "postgresql", bg: "#4169E1", fg: "#ffffff" },
  { label: "Docker", slug: "docker", bg: "#2496ED", fg: "#ffffff" },
  { label: "Tailwind CSS", slug: "tailwindcss", bg: "#2BBCF5", fg: "#ffffff" },
  { label: "Git", slug: "git", bg: "#F05032", fg: "#ffffff" },
  { label: "GitHub", slug: "github", bg: "#181717", fg: "#ffffff" },
  { label: "Vercel", slug: "vercel", bg: "#000000", fg: "#ffffff" },
];

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const contact = {
  heading: "Let\u2019s connect",
  subtitle:
    "I\u2019m always open to discussing new engineering opportunities, full-stack projects, and technical collaborations. Feel free to reach out!",
  cta: { label: "See projects", href: "/projects" },
  socials: {
    email: "mailto:djumayev.dev@gmail.com",
    linkedin: "https://www.linkedin.com/in/farrukhdjumayev",
    github: "https://github.com/thefarrukhdev",
  },
  copyright: "2026 © Farrukh Djumayev",
  role: "Software Engineer",
} as const;
