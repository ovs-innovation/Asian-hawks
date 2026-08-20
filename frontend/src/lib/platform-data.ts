import { PHOTOS } from "./demo-data";

export type DemoTender = {
  _id: string;
  title: string;
  slug: string;
  refNo: string;
  department: string;
  state: string;
  city: string;
  category: string;
  value: string;
  closingDate: string;
  featured: boolean;
};

export type DemoCourse = {
  _id: string;
  title: string;
  slug: string;
  institute: string;
  category: string;
  duration: string;
  mode: string;
  price: number;
  rating: number;
  students: number;
  placement: string;
  image: string;
  featured: boolean;
  description: string;
  modules: string[];
};

export const PLATFORM_STATS = {
  jobs: 24500,
  govJobs: 8200,
  privateJobs: 16300,
  tenders: 1200,
  courses: 340,
  institutes: 85,
  placements: 12400,
};

export const TRENDING_SEARCHES = [
  "SSC CGL",
  "Railway",
  "React Developer",
  "Data Analyst",
  "Construction Tender",
  "Digital Marketing",
  "Bank PO",
  "Internship",
];

export const QUICK_CATEGORIES = [
  { label: "IT & Software", href: "/private-jobs?keyword=Software" },
  { label: "Banking", href: "/government-jobs?keyword=Bank" },
  { label: "SSC", href: "/government-jobs?keyword=SSC" },
  { label: "Railway", href: "/government-jobs?keyword=Railway" },
  { label: "MSME", href: "/tenders?keyword=MSME" },
  { label: "Internship", href: "/internships" },
];

export const PLACEMENT_PARTNERS = [
  "TCS", "Infosys", "Wipro", "HCL", "Accenture", "Capgemini", "Deloitte", "KPMG",
];

export const DEMO_TENDERS: DemoTender[] = [
  {
    _id: "t1",
    title: "Construction of Rural Road Phase II",
    slug: "construction-rural-road-phase-ii",
    refNo: "PWD/MH/2026/1842",
    department: "Public Works Department",
    state: "Maharashtra",
    city: "Nagpur",
    category: "Construction",
    value: "₹2.4 Cr",
    closingDate: "2026-09-12",
    featured: true,
  },
  {
    _id: "t2",
    title: "IT Infrastructure & Cloud Migration",
    slug: "it-infrastructure-cloud-migration",
    refNo: "NIC/DL/2026/902",
    department: "National Informatics Centre",
    state: "Delhi",
    city: "New Delhi",
    category: "IT Services",
    value: "₹85 L",
    closingDate: "2026-08-28",
    featured: true,
  },
  {
    _id: "t3",
    title: "Medical Equipment Supply — District Hospitals",
    slug: "medical-equipment-district-hospitals",
    refNo: "Health/KA/2026/441",
    department: "Health & Family Welfare",
    state: "Karnataka",
    city: "Bangalore",
    category: "Healthcare",
    value: "₹1.1 Cr",
    closingDate: "2026-09-05",
    featured: false,
  },
  {
    _id: "t4",
    title: "Annual Maintenance — Electrical Systems",
    slug: "annual-maintenance-electrical",
    refNo: "CPWD/RJ/2026/118",
    department: "CPWD",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Maintenance",
    value: "₹32 L",
    closingDate: "2026-08-22",
    featured: false,
  },
];

export const DEMO_COURSES: DemoCourse[] = [
  {
    _id: "c1",
    title: "Retail Banking & Branch Operations",
    slug: "retail-banking-branch-operations",
    institute: "Asian Hawks Training",
    category: "Banking Operations",
    duration: "3 months",
    mode: "Classroom + Placement",
    price: 14999,
    rating: 4.8,
    students: 1860,
    placement: "Bank jobs",
    image: "/courses/bank-branch.jpg",
    featured: true,
    description:
      "Learn day-to-day branch work used in public and private banks: cash, deposits, account opening, and customer handling. Built for candidates targeting Seva Sarthi, clerk, and branch support roles.",
    modules: [
      "Banking basics, products, and branch workflow",
      "Cash handling, deposits, withdrawals, and passbook",
      "Account opening, KYC checklist, and customer service",
      "Interview practice for bank manpower roles",
    ],
  },
  {
    _id: "c2",
    title: "ATM Mitra & Field Executive Training",
    slug: "atm-mitra-field-executive",
    institute: "Asian Hawks Training",
    category: "Field Banking",
    duration: "45 days",
    mode: "Field + Classroom",
    price: 9999,
    rating: 4.7,
    students: 2140,
    placement: "ATM / BC roles",
    image: "/courses/atm-field.jpg",
    featured: true,
    description:
      "Practical training for ATM Mitra, field supervisor, and business correspondent work — site visits, cash loading support, complaint handling, and reporting used on SBI and other bank projects.",
    modules: [
      "ATM ecosystem, roles, and safety rules",
      "Field visits, audit checklist, and photo reporting",
      "Customer queries, downtime, and escalation",
      "Placement briefing for Asian Hawks bank projects",
    ],
  },
  {
    _id: "c3",
    title: "Bank PO & Clerk Exam Preparation",
    slug: "bank-po-clerk-exam",
    institute: "Asian Hawks Training",
    category: "Bank Exams",
    duration: "4 months",
    mode: "Live Online",
    price: 12999,
    rating: 4.6,
    students: 3200,
    placement: "IBPS / SBI exams",
    image: "/courses/bank-exam.jpg",
    featured: true,
    description:
      "Structured prep for IBPS and SBI Clerk / PO: quantitative aptitude, reasoning, English, and banking awareness, with weekly mocks and doubt sessions.",
    modules: [
      "Quant, reasoning, and English fundamentals",
      "Banking awareness and current affairs",
      "Weekly mocks and speed practice",
      "Interview and document verification guidance",
    ],
  },
  {
    _id: "c4",
    title: "KYC, AML & Banking Customer Service",
    slug: "kyc-aml-customer-service",
    institute: "Asian Hawks Training",
    category: "Compliance",
    duration: "2 months",
    mode: "Hybrid",
    price: 8999,
    rating: 4.7,
    students: 980,
    placement: "KYC / CSA roles",
    image: "/courses/kyc-desk.jpg",
    featured: false,
    description:
      "KYC documents, AML red flags, and polite counter service — for customer service, CSA, and onboarding roles in banks and BFSI BPO.",
    modules: [
      "KYC documents and video KYC process",
      "AML basics and suspicious-transaction flags",
      "Call and counter etiquette",
      "Role-play and placement support",
    ],
  },
];

export const GOV_JOBS_PREVIEW = [
  {
    title: "Data Entry Operator",
    org: "Indian Army",
    location: "Jalandhar Cantt",
    qualification: "12th Pass",
    lastDate: "2026-09-12",
    vacancies: 4,
  },
  {
    title: "Seva Sarthi",
    org: "SBI Client Project",
    location: "Pan India",
    qualification: "Graduate",
    lastDate: "2026-09-20",
    vacancies: 25,
  },
  {
    title: "ATM Mitra - Field Executive",
    org: "SBI Client Project",
    location: "Pan India",
    qualification: "Graduate",
    lastDate: "2026-09-28",
    vacancies: 30,
  },
];

export const SUCCESS_STORIES = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer at TCS",
    quote: "Completed the full-stack course and got placed within 3 months.",
    image: PHOTOS.james,
  },
  {
    name: "Priya Patel",
    role: "SSC CGL Selected",
    quote: "The exam prep course and job alerts kept me on track throughout.",
    image: PHOTOS.priya,
  },
  {
    name: "Amit Kumar",
    role: "MSME Contractor",
    quote: "Won my first government tender after using the tender alert system.",
    image: PHOTOS.maya,
  },
];

export const STUDENT_REVIEWS = [
  { name: "Neha K.", course: "Web Development", rating: 5, text: "Structured curriculum and real projects. Got interview calls in week 4." },
  { name: "Vikram S.", course: "SSC CGL Prep", rating: 5, text: "Daily tests and doubt sessions made all the difference." },
  { name: "Sana M.", course: "Digital Marketing", rating: 4, text: "Placement support was genuine — not just promises." },
];
