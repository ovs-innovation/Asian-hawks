import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";
import Category from "./models/Category.js";
import Company from "./models/Company.js";
import Job from "./models/Job.js";
import Blog from "./models/Blog.js";
import User from "./models/User.js";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore DNS fallback errors
}

const categories = [
  "Banking Jobs",
  "Government Jobs",
  "Defence Jobs",
  "Field Executive Jobs",
  "Sales Jobs",
  "Customer Service Jobs",
  "Team Leader Jobs",
  "Agriculture Jobs",
  "Data Entry Jobs",
  "Freshers Jobs",
  "Experienced Jobs",
];

const companySeed = {
  name: "Asian Hawks Manpower Services Pvt. Ltd.",
  slug: "asian-hawks-manpower-services",
  logo: "/logo.png",
  coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
  industry: "Banking Recruitment",
  location: "Pan India",
  city: "New Delhi",
  country: "India",
  about:
    "Asian Hawks Manpower Services Pvt. Ltd. hires for banking, field operations, customer service, agriculture finance, and defence support roles across India.",
  employees: 500,
  verified: true,
  status: "approved",
  featured: true,
};

const jobs = [
  {
    title: "Seva Sarthi",
    slug: "seva-sarthi-sbi-pan-india",
    category: "Customer Service Jobs",
    department: "SBI Branch Support",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Minimum 1 Year",
    minSalary: 20000,
    maxSalary: 20000,
    currency: "INR",
    location: "Pan India",
    city: "Pan India",
    country: "India",
    featured: true,
    urgent: false,
    vacancies: 25,
    applicationsCount: 18,
    skills: ["Communication Skills", "Customer Handling", "Basic Computer Knowledge", "Professional Behaviour"],
    responsibilities:
      "Assist customers inside SBI branches, help with account opening and documentation, guide customers for YONO and digital banking, support senior citizens and differently-abled customers, maintain branch discipline, coordinate with branch staff, and ensure quality customer service.",
    requirements:
      "Graduate. Minimum 1 year experience preferred. Freshers may apply as per some requirements.",
    benefits: "₹20,000 CTC per month.",
  },
  {
    title: "Team Leader",
    slug: "team-leader-sbi-pan-india",
    category: "Team Leader Jobs",
    department: "ATM Mitra / FOS Collection / FOS Agri / Seva Sarthi",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Minimum 2 Years",
    minSalary: 25000,
    maxSalary: 25000,
    currency: "INR",
    location: "Pan India",
    city: "Pan India",
    country: "India",
    featured: true,
    urgent: true,
    vacancies: 12,
    applicationsCount: 41,
    skills: ["Team Handling", "Reporting", "Recruitment", "Training", "Branch Coordination"],
    responsibilities:
      "Lead field teams, achieve targets, coordinate with SBI branches, conduct reviews, recruit and train team members, ensure reporting and compliance, and improve team productivity.",
    requirements: "Graduate with minimum 2 years experience.",
    benefits: "₹25,000 CTC.",
  },
  {
    title: "Collection Executive",
    slug: "collection-executive-sbi-multi-location",
    category: "Field Executive Jobs",
    department: "Collection",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "6 Months - 3 Years",
    minSalary: 22000,
    maxSalary: 22000,
    currency: "INR",
    location: "Indore, Ratlam, Vijayawada, Ujjain, Dhar, Eluru + nearby",
    city: "Indore",
    country: "India",
    featured: true,
    urgent: false,
    vacancies: 18,
    applicationsCount: 9,
    skills: ["EMI Collection", "Customer Follow-up", "Recovery Visits", "Daily Reporting", "Target Achievement", "Branch Coordination"],
    responsibilities:
      "Handle EMI collection, customer follow-up, recovery visits, daily reporting, target achievement, and branch coordination.",
    requirements: "Graduate. 6 months to 3 years experience. Freshers can also apply.",
    benefits: "₹22,000 NTH, PF, ESIC, travel allowance, and incentives.",
  },
  {
    title: "ATM Mitra - Field Executive",
    slug: "atm-mitra-field-executive-sbi-pan-india",
    category: "Field Executive Jobs",
    department: "ATM Mitra",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Freshers Welcome",
    minSalary: 23000,
    maxSalary: 23000,
    currency: "INR",
    location: "Pan India",
    city: "Pan India",
    country: "India",
    featured: true,
    urgent: false,
    vacancies: 30,
    applicationsCount: 22,
    skills: ["ATM Inspection", "Reporting", "Geo-tagging", "Issue Coordination"],
    responsibilities:
      "Visit SBI ATMs, inspect ATM condition, check cleanliness, verify ATM functionality, upload reports, geo-tag photos, and coordinate issue resolution.",
    requirements: "Graduate.",
    benefits: "₹23,000 CTC.",
  },
  {
    title: "ATM Mitra - Field Supervisor",
    slug: "atm-mitra-field-supervisor-sbi-pan-india",
    category: "Team Leader Jobs",
    department: "ATM Mitra",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Minimum 2 Years",
    minSalary: 25000,
    maxSalary: 25000,
    currency: "INR",
    location: "Pan India",
    city: "Pan India",
    country: "India",
    featured: true,
    urgent: true,
    vacancies: 10,
    applicationsCount: 14,
    skills: ["Team Supervision", "Field Audits", "Reporting", "Training"],
    responsibilities:
      "Supervise field executives, track inspections, audit field work, train new employees, and submit reports.",
    requirements: "Graduate with field supervision experience preferred.",
    benefits: "₹25,000 CTC.",
  },
  {
    title: "KCC Agriculture Loan Officer",
    slug: "kcc-agriculture-loan-officer-pan-india",
    category: "Agriculture Jobs",
    department: "Agriculture Loan Sales",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Freshers Welcome",
    minSalary: 19500,
    maxSalary: 19500,
    currency: "INR",
    location: "Pan India",
    city: "Pan India",
    country: "India",
    featured: false,
    urgent: false,
    vacancies: 20,
    applicationsCount: 60,
    skills: ["Loan Lead Generation", "Farmer Visits", "Document Collection", "Sales Targets"],
    responsibilities:
      "Generate loan leads, visit farmers, explain KCC loans, collect documents, coordinate loan processing, and achieve sales targets.",
    requirements: "12th Pass / Graduate. Freshers welcome.",
    benefits: "₹19,500 CTC, ₹200 daily TA, ₹300 mobile allowance, and performance incentives.",
  },
  {
    title: "Data Entry Operator",
    slug: "data-entry-operator-indian-army-jalandhar-cantt",
    category: "Defence Jobs",
    department: "Indian Army Support",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Freshers Welcome",
    minSalary: 28000,
    maxSalary: 28000,
    currency: "INR",
    location: "Jalandhar Cantt",
    city: "Jalandhar",
    country: "India",
    featured: true,
    urgent: false,
    vacancies: 4,
    applicationsCount: 11,
    skills: ["Data Entry", "Documentation", "MS Office", "Record Management"],
    responsibilities:
      "Handle data entry, documentation, record management, MS Office work, daily reports, and confidential records.",
    requirements: "12th Pass.",
    benefits: "₹28,000 CTC.",
  },
];

const blogs = [
  {
    title: "How to write a job post people finish reading",
    slug: "write-a-job-post-people-finish",
    excerpt: "Salary, team, and interview steps belong in the first screen.",
    category: "Hiring",
    author: "Asian Hawks Editorial",
    coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    content:
      "A complete job post states compensation, the hiring manager, and the interview plan before anyone is asked for a resume.",
    published: true,
  },
  {
    title: "Scorecards hiring managers will actually fill in",
    slug: "scorecards-hiring-managers-use",
    excerpt: "Four questions and one recommendation. Longer forms get abandoned.",
    category: "Interviews",
    author: "Priya Shah",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    content: "Keep scorecards short. Ask for evidence against the role, a hire/no-hire call, and one risk.",
    published: true,
  },
  {
    title: "Preparing for a recruiter conversation",
    slug: "preparing-recruiter-conversation",
    excerpt: "Bring range, timeline, and two examples of work.",
    category: "Candidates",
    author: "James Okonkwo",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    content: "Candidates who know their salary range and start date move further, faster.",
    published: true,
  },
];

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: "jobportal",
  serverSelectionTimeoutMS: 20000,
});

const admin = await User.findOne({ role: "super_admin" }).select("_id");

for (const name of categories) {
  await Category.findOneAndUpdate(
    { name },
    {
      $set: {
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: `${name} roles at Asian Hawks`,
        active: true,
      },
    },
    { upsert: true, new: true }
  );
}

const company = await Company.findOneAndUpdate(
  { slug: companySeed.slug },
  {
    $set: {
      ...companySeed,
      owner: admin?._id,
    },
  },
  { upsert: true, new: true }
);

let createdJobs = 0;
let updatedJobs = 0;
for (const job of jobs) {
  const existing = await Job.findOne({ slug: job.slug }).select("_id");
  await Job.findOneAndUpdate(
    { slug: job.slug },
    {
      $set: {
        ...job,
        company: company._id,
        postedBy: admin?._id,
        industry: company.industry,
        seoTitle: `${job.title} at ${company.name}`,
        metaDescription: `${job.title} · ${job.location} · ${company.name}`,
        qualifications: job.requirements,
        languages: ["English", "Hindi"],
        status: "published",
      },
    },
    { upsert: true, new: true }
  );
  if (existing) updatedJobs += 1;
  else createdJobs += 1;
}

company.openPositions = await Job.countDocuments({ company: company._id, status: "published" });
await company.save();

for (const name of categories) {
  const count = await Job.countDocuments({ category: name, status: "published" });
  await Category.findOneAndUpdate({ name }, { $set: { jobCount: count } });
}

let createdBlogs = 0;
let updatedBlogs = 0;
for (const blog of blogs) {
  const existing = await Blog.findOne({ slug: blog.slug }).select("_id");
  await Blog.findOneAndUpdate({ slug: blog.slug }, { $set: blog }, { upsert: true, new: true });
  if (existing) updatedBlogs += 1;
  else createdBlogs += 1;
}

const categoryCount = await Category.countDocuments({ name: { $in: categories } });

console.log(
  JSON.stringify(
    {
      company: company.name,
      categories_upserted: categoryCount,
      jobs_created: createdJobs,
      jobs_updated: updatedJobs,
      blogs_created: createdBlogs,
      blogs_updated: updatedBlogs,
    },
    null,
    2
  )
);

await mongoose.disconnect();
