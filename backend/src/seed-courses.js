import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import mongoose from "mongoose";
import Course from "./models/Course.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore DNS fallback errors
}

const courses = [
  {
    title: "Retail Banking & Branch Operations",
    slug: "retail-banking-branch-operations",
    instituteName: "Asian Hawks Training",
    category: "Banking Operations",
    duration: "3 months",
    classFormat: "hybrid",
    mode: "Hybrid (live + recorded)",
    meetingLink: "",
    recordingUrl: "",
    schedule: "Mon–Sat, 10:00 AM – 1:00 PM",
    classroomLocation: "Training centre + selected bank branches",
    price: 14999,
    rating: 4.8,
    students: 1860,
    placement: "Bank jobs",
    image: "/courses/bank-branch.jpg",
    featured: true,
    status: "published",
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
    title: "ATM Mitra & Field Executive Training",
    slug: "atm-mitra-field-executive",
    instituteName: "Asian Hawks Training",
    category: "Field Banking",
    duration: "45 days",
    classFormat: "classroom",
    mode: "Classroom",
    classroomLocation: "Field + classroom batches",
    schedule: "Weekday field visits, weekend classroom",
    price: 9999,
    rating: 4.7,
    students: 2140,
    placement: "ATM / BC roles",
    image: "/courses/atm-field.jpg",
    featured: true,
    status: "published",
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
    title: "Bank PO & Clerk Exam Preparation",
    slug: "bank-po-clerk-exam",
    instituteName: "Asian Hawks Training",
    category: "Bank Exams",
    duration: "4 months",
    classFormat: "live_online",
    mode: "Live online",
    meetingLink: "",
    schedule: "Live weekday evenings, 7:00 PM – 9:00 PM",
    price: 12999,
    rating: 4.6,
    students: 3200,
    placement: "IBPS / SBI exams",
    image: "/courses/bank-exam.jpg",
    featured: true,
    status: "published",
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
    title: "KYC, AML & Banking Customer Service",
    slug: "kyc-aml-customer-service",
    instituteName: "Asian Hawks Training",
    category: "Compliance",
    duration: "2 months",
    classFormat: "recorded",
    mode: "Recorded",
    recordingUrl: "",
    schedule: "Self-paced recorded lessons",
    price: 8999,
    rating: 4.7,
    students: 980,
    placement: "KYC / CSA roles",
    image: "/courses/kyc-desk.jpg",
    featured: false,
    status: "published",
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

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing from backend/.env");
  process.exit(1);
}

await mongoose.connect(uri, { dbName: "jobportal", serverSelectionTimeoutMS: 20000 });

for (const course of courses) {
  await Course.findOneAndUpdate(
    { slug: course.slug },
    { ...course, curriculum: course.modules },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Upserted course:", course.title);
}

await mongoose.disconnect();
console.log("Training courses ready.");
process.exit(0);
