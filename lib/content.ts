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
    "Frontend Developer focused on React & Next.js — fast, accessible, scalable, and built to last.",
  portrait: {
    src: "/farrukh.jpg",
    alt: "Farrukh Djumayev portrait",
  },
  ctas: {
    primary: { label: "View My Work", href: "/projects" },
    resume: { label: "Resume", href: "/Farrukh_Resume.pdf?v=2" },
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
      "End-to-end career & job placement platform for School 21 students and tech employers.",
    description:
      "Engineered the frontend of a comprehensive career platform enabling School 21 students to connect with tech employers, apply for vacancies, and track applications. Implemented interactive dashboards, student portfolios, job filters, and secure authentication workflows using Next.js, React, and TailwindCSS / ShadCN UI.",
    meta: "Next.js · React · TypeScript · Tailwind CSS · ShadCN UI, 2026",
    imageRatio: 16 / 10,
    image: "/projects/careerhub.png",
    imageAlt: "School 21 CareerHub screenshot",
    demoUrl: "https://careerhub.21-school.uz/",
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
  {
    id: "kokand-university",
    icon: Building2,
    iconLabel: "Kokand University",
    title:
      "Vacancies & Analytics Platform for Kokand University, centralizing job postings and applicant tracking.",
    description:
      "Engineered a vacancies and analytics platform for Kokand University, centralizing job postings, automating applicant tracking, and constructing dynamic reporting dashboards for administration to support data-driven decision-making.",
    meta: "Next.js · React · TypeScript · Tailwind CSS, 2025",
    imageRatio: 16 / 10,
    image: "/projects/kokand_university_lightMode.png",
    imageAlt: "Kokand University platform screenshot",
    githubUrl: "https://github.com/thefarrukhdev/kokand_university",
    demoUrl: "https://kualumni.uz/",
  },
  {
    id: "kelajakka-qadam",
    icon: BookOpen,
    iconLabel: "Kelajakka Qadam",
    title: "Minimal responsive promo website for an educational center.",
    description:
      "Showcases an educational center's links, courses, and information. Built with HTML5, CSS3, and JavaScript featuring clean layout and responsive design.",
    meta: "HTML · CSS · JavaScript, 2024",
    imageRatio: 16 / 10,
    image: "/projects/kelajakka_qadam_markazi_lightMode.png",
    imageAlt: "Kelajakka Qadam Markazi website screenshot",
    githubUrl: "https://github.com/thefarrukhdev/KelajakkaQadam",
    demoUrl: "https://kelajakka-qadam-markazi.vercel.app/",
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
    company: "Independent",
    role: "Frontend Developer",
    period: "2024 – Present",
    brand: "#0AE448",
  },
  {
    company: "School 21 / 42 Network",
    role: "Software Engineering Student",
    period: "2024 – Present",
    brand: "#1f1f1f",
  },
  {
    company: "Najot Ta'lim",
    role: "Frontend Development Program",
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
    degree: "Software Engineering Program",
    period: "2024 – Present",
  },
  {
    school: "Najot Ta'lim",
    degree: "Frontend Development Program",
    period: "Completed",
  },
];

/* -------------------------------------------------------------------------- */
/* About — Skills                                                             */
/* -------------------------------------------------------------------------- */

export const skills: string[] = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Redux Toolkit",
  "Zustand",
  "REST APIs & Axios",
  "Tailwind CSS",
  "ShadCN UI",
  "Git & GitHub",
  "Vercel",
  "Component Architecture",
  "Web Performance Optimization",
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
  { label: "Redux Toolkit", slug: "redux", bg: "#764ABC", fg: "#ffffff" },
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
    "I\u2019m always open to new opportunities and collaborations. Feel free to reach out through any of the channels below!",
  cta: { label: "See projects", href: "/projects" },
  socials: {
    email: "mailto:farrukh.front.dev@gmail.com",
    linkedin: "https://www.linkedin.com/in/farrukhdjumayev",
    github: "https://github.com/thefarrukhdev",
  },
  copyright: "2026 © Farrukh Djumayev",
  role: "Frontend Developer",
} as const;
