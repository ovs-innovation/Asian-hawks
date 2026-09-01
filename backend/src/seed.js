import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Company from "./models/Company.js";
import Job from "./models/Job.js";
import Category from "./models/Category.js";
import Blog from "./models/Blog.js";
import Application from "./models/Application.js";
import { Resume, Taxonomy, Subscription, Invoice, Notification } from "./models/Supporting.js";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (_err) {
  // Fallback if custom DNS fails
}

const categories = [
  "Software Development",
  "UI UX Design",
  "DevOps",
  "Cloud",
  "Cyber Security",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Product Management",
  "Digital Marketing",
  "Sales",
  "HR",
  "Finance",
  "Healthcare",
  "Education",
  "Customer Support",
  "Business Development",
  "Content Writing",
  "Video Editing",
  "Graphic Design",
  "Legal",
  "Operations",
  "Government",
  "Internships",
  "Freelancing",
];

const companiesData = [
  {
    name: "Helios Bank",
    slug: "helios-bank",
    industry: "Finance",
    location: "San Francisco",
    city: "San Francisco",
    country: "United States",
    size: "1001-5000",
    employees: 2400,
    about: "Retail and capital markets bank hiring product, risk, and platform teams.",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    featured: true,
  },
  {
    name: "Nimbus Labs",
    slug: "nimbus-labs",
    industry: "Software",
    location: "Remote",
    city: "Austin",
    country: "United States",
    size: "201-500",
    employees: 320,
    about: "Infrastructure software for developer platforms. Remote-first, office in Austin.",
    coverImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    featured: true,
  },
  {
    name: "Harbor Health",
    slug: "harbor-health",
    industry: "Healthcare",
    location: "New York",
    city: "New York",
    country: "United States",
    size: "1001-5000",
    employees: 1100,
    about: "Clinical operations and care-coordination software for hospital networks.",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
    featured: true,
  },
  {
    name: "Brightpath",
    slug: "brightpath",
    industry: "Education",
    location: "Austin",
    city: "Austin",
    country: "United States",
    size: "51-200",
    employees: 180,
    about: "Learning products for universities and professional certification programs.",
    coverImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Keystone",
    slug: "keystone",
    industry: "Consulting",
    location: "London",
    city: "London",
    country: "United Kingdom",
    size: "501-1000",
    employees: 850,
    about: "Operator-led consulting for operations, talent, and digital transformation.",
    coverImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Oakridge",
    slug: "oakridge",
    industry: "Logistics",
    location: "Chicago",
    city: "Chicago",
    country: "United States",
    size: "1001-5000",
    employees: 3200,
    about: "Freight network and warehouse software for national distributors.",
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80",
  },
];

const jobsData = [
  {
    title: "Senior Product Designer",
    company: "helios-bank",
    category: "UI UX Design",
    employmentType: "Full Time",
    workplace: "Hybrid",
    experience: "5-8 years",
    minSalary: 140000,
    maxSalary: 175000,
    location: "San Francisco",
    featured: true,
    urgent: false,
    skills: ["Figma", "Product thinking", "Design systems"],
  },
  {
    title: "Staff Backend Engineer",
    company: "nimbus-labs",
    category: "Software Development",
    employmentType: "Full Time",
    workplace: "Remote",
    experience: "8+ years",
    minSalary: 180000,
    maxSalary: 220000,
    location: "Remote",
    featured: true,
    urgent: true,
    skills: ["Go", "PostgreSQL", "Distributed systems"],
  },
  {
    title: "People Operations Lead",
    company: "harbor-health",
    category: "HR",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "6-10 years",
    minSalary: 125000,
    maxSalary: 150000,
    location: "New York",
    featured: true,
    skills: ["People ops", "HRIS", "Compensation"],
  },
  {
    title: "Growth Marketing Manager",
    company: "brightpath",
    category: "Digital Marketing",
    employmentType: "Full Time",
    workplace: "Hybrid",
    experience: "4-6 years",
    minSalary: 110000,
    maxSalary: 135000,
    location: "Austin",
    featured: true,
    skills: ["Lifecycle", "SEO", "Paid social"],
  },
  {
    title: "Forward Deployed Engineer",
    company: "keystone",
    category: "Software Development",
    employmentType: "Full Time",
    workplace: "Hybrid",
    experience: "4-7 years",
    minSalary: 115000,
    maxSalary: 155000,
    location: "London",
    urgent: true,
    skills: ["Python", "Customer engineering", "SQL"],
  },
  {
    title: "Customer Success Manager",
    company: "oakridge",
    category: "Customer Support",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "3-5 years",
    minSalary: 95000,
    maxSalary: 115000,
    location: "Chicago",
    skills: ["Enterprise CS", "Onboarding", "QBR"],
  },
  {
    title: "Machine Learning Engineer",
    company: "nimbus-labs",
    category: "Machine Learning",
    employmentType: "Full Time",
    workplace: "Remote",
    experience: "5-8 years",
    minSalary: 170000,
    maxSalary: 210000,
    location: "Remote",
    featured: true,
    skills: ["PyTorch", "MLOps", "Python"],
  },
  {
    title: "Product Manager, Payments",
    company: "helios-bank",
    category: "Product Management",
    employmentType: "Full Time",
    workplace: "Hybrid",
    experience: "5-8 years",
    minSalary: 155000,
    maxSalary: 190000,
    location: "San Francisco",
    skills: ["Payments", "Roadmapping", "SQL"],
  },
  {
    title: "DevOps Engineer",
    company: "oakridge",
    category: "DevOps",
    employmentType: "Full Time",
    workplace: "Hybrid",
    experience: "4-6 years",
    minSalary: 130000,
    maxSalary: 160000,
    location: "Chicago",
    skills: ["Kubernetes", "Terraform", "AWS"],
  },
  {
    title: "UX Research Intern",
    company: "brightpath",
    category: "Internships",
    employmentType: "Internship",
    workplace: "Hybrid",
    experience: "0-1 years",
    minSalary: 28,
    maxSalary: 35,
    currency: "USD/hr",
    location: "Austin",
    skills: ["Interviews", "Synthesis", "Figma"],
  },
  {
    title: "Security Analyst",
    company: "helios-bank",
    category: "Cyber Security",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "3-5 years",
    minSalary: 120000,
    maxSalary: 145000,
    location: "San Francisco",
    urgent: true,
    skills: ["SIEM", "Threat detection", "Python"],
  },
  {
    title: "Content Editor",
    company: "harbor-health",
    category: "Content Writing",
    employmentType: "Part Time",
    workplace: "Remote",
    experience: "2-4 years",
    minSalary: 45,
    maxSalary: 65,
    currency: "USD/hr",
    location: "Remote",
    skills: ["Editing", "Healthcare", "CMS"],
  },
];

const blogs = [
  {
    title: "How to write a job post people finish reading",
    slug: "write-a-job-post-people-finish",
    excerpt: "Salary, team, and interview steps belong in the first screen.",
    category: "Hiring",
    author: "Northline Editorial",
    coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    content:
      "A complete job post states compensation, the hiring manager, and the interview plan before the candidate is asked for a resume. Anything less creates extra loops for both sides.",
  },
  {
    title: "Scorecards hiring managers will actually fill in",
    slug: "scorecards-hiring-managers-use",
    excerpt: "Four questions and one recommendation. Longer forms get abandoned.",
    category: "Interviews",
    author: "Priya Shah",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    content:
      "Keep scorecards short. Ask for evidence against the role, a hire/no-hire recommendation, and one risk. Recruiters can follow up; the panel should not write a novel.",
  },
  {
    title: "Preparing for a recruiter conversation",
    slug: "preparing-recruiter-conversation",
    excerpt: "Bring range, timeline, and two examples of work.",
    category: "Candidates",
    author: "James Okonkwo",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    content:
      "Candidates who know their salary range and start date get further, faster. Two concrete examples of recent work beat a generic biography every time.",
  },
];

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "jobportal",
    serverSelectionTimeoutMS: 20000,
  });
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Category.deleteMany({}),
    Blog.deleteMany({}),
    Application.deleteMany({}),
    Resume.deleteMany({}),
    Taxonomy.deleteMany({}),
    Subscription.deleteMany({}),
    Invoice.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const seedPassword = process.env.SEED_PASSWORD || process.env.ADMIN_PASSWORD;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;
  if (!adminPasswordPlain) {
    throw new Error("Set ADMIN_PASSWORD in backend/.env before seeding.");
  }
  const password = await bcrypt.hash(seedPassword || adminPasswordPlain, 10);
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@asianhawks.in").toLowerCase();
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 10);

  const admin = await User.create({
    name: "Asian Hawks Admin",
    email: adminEmail,
    password: adminPassword,
    role: "super_admin",
    headline: "Platform administrator",
    location: "London",
    status: "active",
    profileCompletion: 100,
  });

  await User.create({
    name: "Noah Patel",
    email: "moderator@northline.com",
    password: password,
    role: "moderator",
    headline: "Trust and safety",
    status: "active",
  });

  const companyDocs = [];
  for (const c of companiesData) {
    const owner = await User.create({
      name: `${c.name} Talent`,
      email: `talent@${c.slug}.com`,
      password,
      role: "recruiter",
      headline: `Recruiter at ${c.name}`,
      location: c.location,
      status: "active",
      profileCompletion: 80,
    });
    const company = await Company.create({
      ...c,
      verified: true,
      status: "approved",
      owner: owner._id,
      website: `https://${c.slug}.example`,
      openPositions: 0,
    });
    owner.company = company._id;
    await owner.save();
    companyDocs.push(company);
  }

  const candidate = await User.create({
    name: "Maya Chen",
    email: "maya@example.com",
    password,
    role: "candidate",
    headline: "Product designer",
    location: "San Francisco",
    skills: ["Figma", "Research", "Design systems"],
    status: "active",
    profileCompletion: 72,
  });

  await Resume.create({
    user: candidate._id,
    headline: "Product designer",
    summary: "Eight years designing internal tools and customer products for financial services.",
    skills: ["Figma", "Research", "Prototyping"],
    experience: [
      {
        company: "Helios Bank",
        title: "Product Designer",
        start: "2021",
        end: "Present",
        current: true,
        description: "Led the payments design system and onboarding flows.",
      },
    ],
    education: [{ school: "RISD", degree: "BFA", field: "Graphic Design", year: "2016" }],
    projects: [{ name: "Ledger UI kit", url: "", description: "Shared component library for treasury tools." }],
    achievements: ["Reduced onboarding time by 28%"],
    certificates: [{ name: "NN/g UX Certification", issuer: "Nielsen Norman Group", year: "2022" }],
  });

  await Category.insertMany(
    categories.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `${name} roles on Northline`,
      jobCount: 0,
    }))
  );

  const createdJobs = [];
  for (const j of jobsData) {
    const company = companyDocs.find((c) => c.slug === j.company);
    const job = await Job.create({
      ...j,
      company: company._id,
      postedBy: company.owner,
      slug: j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + company.slug,
      status: "published",
      department: j.category,
      industry: company.industry,
      city: company.city,
      country: company.country,
      currency: j.currency || "USD",
      vacancies: 1,
      responsibilities: "Own outcomes for this function. Work with product, engineering, and operators.",
      requirements: j.skills.join(", ") + ". Evidence of shipped work in a similar environment.",
      benefits: "Health coverage, learning stipend, and a published interview plan.",
      qualifications: "A portfolio or work samples that show judgment, not only craft.",
      languages: ["English"],
      seoTitle: `${j.title} at ${company.name}`,
      metaDescription: `${j.title} · ${company.name} · ${j.location}`,
      screeningQuestions: [{ question: "Why this role, in two or three sentences?", required: true }],
    });
    company.openPositions += 1;
    await company.save();
    createdJobs.push(job);
  }

  await Application.create({
    job: createdJobs[0]._id,
    candidate: candidate._id,
    company: createdJobs[0].company,
    coverLetter: "I have spent the last four years on payments design systems.",
    status: "reviewing",
  });
  createdJobs[0].applicationsCount = 1;
  await createdJobs[0].save();

  await Blog.insertMany(blogs);
  await Taxonomy.insertMany([
    { type: "industry", name: "Finance" },
    { type: "industry", name: "Software" },
    { type: "industry", name: "Healthcare" },
    { type: "country", name: "United States" },
    { type: "country", name: "United Kingdom" },
    { type: "city", name: "San Francisco" },
    { type: "city", name: "London" },
    { type: "skill", name: "Figma" },
    { type: "skill", name: "Python" },
    { type: "experience_level", name: "Senior" },
    { type: "salary_range", name: "$100k–$150k" },
    { type: "employment_type", name: "Full Time" },
  ]);

  await Subscription.create({
    company: companyDocs[0]._id,
    plan: "growth",
    status: "active",
    amount: 149,
    renewsAt: new Date(Date.now() + 30 * 86400000),
  });
  await Invoice.create({
    company: companyDocs[0]._id,
    number: "INV-1001",
    amount: 149,
    status: "paid",
    issuedAt: new Date(),
  });
  await Notification.create({
    user: candidate._id,
    title: "Application received",
    body: "Helios Bank is reviewing Senior Product Designer.",
    link: "/candidate/applied",
  });

  console.log("Seed complete. Admin email:", adminEmail, "(password from backend/.env)");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
