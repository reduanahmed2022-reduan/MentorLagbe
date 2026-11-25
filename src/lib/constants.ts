export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Coding",
  "Music",
  "Language",
  "IELTS",
];

export const CLASS_LEVELS = [
  "Primary",
  "SSC",
  "HSC",
  "University",
  "Adult",
];

export const LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Online",
];

export const MODES = ["Online", "Offline"] as const;

export const PREFERRED_SCHEDULE_OPTIONS = [
  "Weekdays 6–8 PM",
  "Weekdays 8–10 PM",
  "Weekends 10 AM–12 PM",
  "Weekends 4–6 PM",
  "Weekends 7–9 PM",
  "Morning (before 9 AM)",
  "Flexible",
] as const;

export const PRO_PRICES = {
  tutor: 15,
  student: 10,
} as const;

export const PUBLIC_NAV = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Find Tutors", href: "/tutors" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/#how-it-works" },
] as const;

export const BRAND = {
  name: "MentorLagbe",
  tagline: "Smart tuition & mentorship, made personal.",
  email: "reduanahmed2022@gmail.com",
  phone: "+880 1711-000000",
  location: "Dhaka, Bangladesh",
};
