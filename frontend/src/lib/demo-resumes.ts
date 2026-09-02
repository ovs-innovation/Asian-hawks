import type { ResumeData, TemplateId } from "@/types/resume";

export const DEMO_RESUMES: Record<TemplateId, ResumeData> = {
  ats: {
    _id: "demo-ats",
    title: "Alex Morgan Resume",
    headline: "Software Engineer",
    summary:
      "Results-driven Software Engineer with 4+ years of experience in architecting scalable web applications, RESTful microservices, and high-performance frontend systems. Proven expertise in React, TypeScript, Node.js, and cloud deployments with a focus on code quality, automated testing, and CI/CD pipelines.",
    personalInfo: {
      fullName: "Alex Morgan",
      email: "alex.morgan@example.com",
      phone: "+91 98765 43210",
      location: "New Delhi, India",
      city: "New Delhi",
      country: "India",
      headline: "Software Engineer",
      linkedin: "https://linkedin.com/in/alex-morgan-dev",
      github: "https://github.com/alexmorgan-dev",
      portfolio: "https://alexmorgan.dev",
    },
    experience: [
      {
        company: "TechNova Solutions",
        title: "Senior Frontend Engineer",
        start: "2024",
        end: "Present",
        current: true,
        description:
          "Led development of core enterprise dashboard serving 150K+ monthly active users. Reduced bundle size by 38% and improved initial page load performance by 1.8s.",
        highlights: [
          "Architected micro-frontend architecture using Next.js and TypeScript.",
          "Mentored 6 junior engineers and established team coding standards.",
        ],
      },
      {
        company: "Apex Digital Systems",
        title: "Full Stack Developer",
        start: "2021",
        end: "2023",
        current: false,
        description:
          "Developed end-to-end features for fintech payment processing platform handling over $5M in daily transactions.",
        highlights: [
          "Built secure REST APIs using Node.js, Express, and PostgreSQL.",
          "Implemented comprehensive unit and integration test coverage exceeding 90%.",
        ],
      },
    ],
    education: [
      {
        school: "Delhi University",
        degree: "Bachelor of Computer Applications (BCA)",
        field: "Computer Science",
        year: "2018 – 2021",
        grade: "8.8 CGPA",
        description: "Specialized in Data Structures, Algorithms, and Database Management.",
      },
    ],
    skills: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
      "Git & GitHub",
      "Docker",
      "RESTful APIs",
    ],
    projects: [
      {
        name: "CloudOps Orchestration Dashboard",
        description:
          "Real-time server monitoring and alerting tool with live WebSocket metrics and interactive data visualization charts.",
        technologies: "Next.js, Tailwind CSS, WebSockets, Node.js",
        githubUrl: "https://github.com/alexmorgan-dev/cloudops",
        liveUrl: "https://cloudops-demo.dev",
      },
      {
        name: "E-Commerce Checkout Engine",
        description:
          "High-concurrency checkout microservice with automated invoice generation and payment gateway failover.",
        technologies: "React, Node.js, Stripe API, PostgreSQL",
      },
    ],
    certificates: [
      {
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        year: "2023",
      },
      {
        name: "Meta Certified Frontend Developer",
        issuer: "Meta / Coursera",
        year: "2022",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Hindi", proficiency: "Native" },
    ],
    achievements: [
      {
        title: "1st Place Winner – National Hackathon 2023",
        description: "Built automated disaster relief distribution platform with real-time mapping.",
        date: "Nov 2023",
      },
    ],
    isFresher: false,
    template: "ats",
    completeness: 100,
    status: "published",
  },

  modern: {
    _id: "demo-modern",
    title: "Priya Sharma Resume",
    headline: "Product Designer & UI Engineer",
    summary:
      "Passionate Product Designer and UI Engineer with 5 years of experience bridging the gap between design systems and high-converting digital products. Expert in user research, design token architectures, accessible interfaces, and interactive frontend prototypes.",
    personalInfo: {
      fullName: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98123 45678",
      location: "Bengaluru, India",
      city: "Bengaluru",
      country: "India",
      headline: "Product Designer & UI Engineer",
      linkedin: "https://linkedin.com/in/priya-sharma-design",
      github: "https://github.com/priyadesign",
      portfolio: "https://priyasharma.design",
    },
    experience: [
      {
        company: "InnovateX Labs",
        title: "Lead UI/UX Designer",
        start: "2023",
        end: "Present",
        current: true,
        description:
          "Spearheaded multi-brand design system utilized by 40+ product designers and 100+ engineers across web and mobile platforms.",
        highlights: [
          "Increased product design workflow velocity by 45%.",
          "Conducted usability testing across 200+ user interviews to optimize onboarding funnels.",
        ],
      },
      {
        company: "HyperGrowth Media",
        title: "Product Designer",
        start: "2020",
        end: "2023",
        current: false,
        description:
          "Redesigned SaaS analytics suite resulting in a 28% increase in 30-day user retention and 4.8/5 CSAT rating.",
      },
    ],
    education: [
      {
        school: "National Institute of Design (NID)",
        degree: "Bachelor of Design (B.Des)",
        field: "Interaction Design",
        year: "2016 – 2020",
      },
    ],
    skills: [
      "Figma & FigJam",
      "Design Systems",
      "User Research & Testing",
      "Wireframing & Prototyping",
      "HTML5 & CSS3",
      "React.js",
      "Tailwind CSS",
      "Accessibility (WCAG 2.1)",
      "Information Architecture",
    ],
    projects: [
      {
        name: "FinFlow Mobile Banking App",
        description:
          "End-to-end design and interactive prototype for Gen-Z wealth management with automated budget tracking.",
        technologies: "Figma, React Native, Design Systems",
        liveUrl: "https://finflow.design",
      },
    ],
    certificates: [
      {
        name: "Nielsen Norman Group UX Master Certified",
        issuer: "NN/g",
        year: "2023",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Hindi", proficiency: "Fluent" },
    ],
    achievements: [
      {
        title: "Best Mobile UI Design – DesignCon India",
        date: "2023",
      },
    ],
    isFresher: false,
    template: "modern",
    completeness: 100,
    status: "published",
  },

  minimal: {
    _id: "demo-minimal",
    title: "Daniel Wilson Resume",
    headline: "Data Analyst & Operations Specialist",
    summary:
      "Analytical and detail-oriented Data Analyst with extensive experience in transforming complex data sets into actionable executive business intelligence. Skilled in SQL, Python, PowerBI, statistical modeling, and operational process optimization.",
    personalInfo: {
      fullName: "Daniel Wilson",
      email: "daniel.wilson@example.com",
      phone: "+91 97654 32109",
      location: "Mumbai, India",
      city: "Mumbai",
      country: "India",
      headline: "Data Analyst & Operations Specialist",
      linkedin: "https://linkedin.com/in/daniel-wilson-analytics",
      github: "https://github.com/dwilson-data",
      portfolio: "https://danielwilson.io",
    },
    experience: [
      {
        company: "QuantEdge Analytics",
        title: "Senior Business Intelligence Analyst",
        start: "2023",
        end: "Present",
        current: true,
        description:
          "Architected automated reporting pipelines for supply chain operations, saving 25+ hours of manual reporting per week.",
      },
      {
        company: "Vanguard Global Solutions",
        title: "Operations Data Analyst",
        start: "2021",
        end: "2023",
        current: false,
        description:
          "Developed executive dashboards tracking revenue KPIs, churn forecasting, and customer lifetime value metrics.",
      },
    ],
    education: [
      {
        school: "IIT Bombay",
        degree: "B.Tech in Industrial Engineering",
        year: "2017 – 2021",
      },
    ],
    skills: [
      "SQL (PostgreSQL, Snowflake)",
      "Python (Pandas, NumPy, Scikit-learn)",
      "PowerBI & Tableau",
      "ETL Pipelines",
      "Statistical Analysis",
      "Process Automation",
      "Excel Advanced (VBA)",
    ],
    projects: [
      {
        name: "Supply Chain Risk Predictor",
        description: "Predictive machine learning model to forecast inventory shortages 14 days in advance.",
        technologies: "Python, SQL, Streamlit",
      },
    ],
    certificates: [
      {
        name: "Google Data Analytics Professional Certificate",
        issuer: "Google",
        year: "2022",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "German", proficiency: "Intermediate" },
    ],
    achievements: [
      {
        title: "Operational Excellence Award",
        description: "Recognized for optimizing regional warehouse routing and reducing logistics cost by 14%.",
        date: "2023",
      },
    ],
    isFresher: false,
    template: "minimal",
    completeness: 100,
    status: "published",
  },

  creative: {
    _id: "demo-creative",
    title: "Emma Carter Resume",
    headline: "Senior Brand Strategist & Creative Director",
    summary:
      "Visionary Creative Director and Brand Strategist with 6+ years driving viral campaigns, brand identity overhauls, and omni-channel growth for high-growth tech startups and consumer brands. Passionate about storytelling, visual identity, and performance-driven creative assets.",
    personalInfo: {
      fullName: "Emma Carter",
      email: "emma.carter@example.com",
      phone: "+91 91234 56780",
      location: "Pune, India",
      city: "Pune",
      country: "India",
      headline: "Senior Brand Strategist & Creative Director",
      linkedin: "https://linkedin.com/in/emmacarter-creative",
      portfolio: "https://emmacarter.co",
    },
    experience: [
      {
        company: "Starlight Media Agency",
        title: "Creative Director",
        start: "2023",
        end: "Present",
        current: true,
        description:
          "Lead creative strategy for 12 tier-1 consumer brand accounts, generating over $25M in attributed client revenue.",
      },
      {
        company: "Vivid Creative Studios",
        title: "Senior Brand Designer",
        start: "2020",
        end: "2023",
        current: false,
        description:
          "Directed visual rebranding initiatives for 8 SaaS unicorns and consumer tech product launches.",
      },
    ],
    education: [
      {
        school: "Symbiosis Institute of Design",
        degree: "Bachelor of Communication Design",
        year: "2016 – 2020",
      },
    ],
    skills: [
      "Brand Strategy & Identity",
      "Creative Direction",
      "Visual Storytelling",
      "Figma & Adobe Creative Suite",
      "Campaign Management",
      "Content Strategy",
      "Art Direction",
      "Copywriting",
    ],
    projects: [
      {
        name: "EcoNova Global Rebrand",
        description: "Complete visual identity, tone of voice, packaging design, and 360-degree digital launch campaign.",
        technologies: "Figma, Adobe Illustrator, After Effects",
        liveUrl: "https://econova-brand.demo",
      },
    ],
    certificates: [
      {
        name: "Brand Master Academy Certified",
        issuer: "Brand Master Academy",
        year: "2023",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "French", proficiency: "Conversational" },
    ],
    achievements: [
      {
        title: "Gold Trophy – National Advertising & Brand Awards",
        date: "2024",
      },
    ],
    isFresher: false,
    template: "creative",
    completeness: 100,
    status: "published",
  },

  executive: {
    _id: "demo-executive",
    title: "Michael Anderson Resume",
    headline: "VP of Operations & General Management",
    summary:
      "Executive leader with 12+ years of track record in scaling business operations, driving P&L profitability, and executing enterprise strategic transformations across Asia-Pacific markets. Managed 200+ cross-functional personnel and budgets exceeding $40M.",
    personalInfo: {
      fullName: "Michael Anderson",
      email: "m.anderson@example.com",
      phone: "+91 99887 66554",
      location: "Hyderabad, India",
      city: "Hyderabad",
      country: "India",
      headline: "VP of Operations & General Management",
      linkedin: "https://linkedin.com/in/michael-anderson-executive",
      portfolio: "https://manderson.exec",
    },
    experience: [
      {
        company: "Global Logistics Enterprise Corp.",
        title: "Vice President of Operations",
        start: "2022",
        end: "Present",
        current: true,
        description:
          "Oversee operational strategy and logistics infrastructure across 14 regional fulfillment hubs. Delivered 22% YoY EBITDA growth while reducing customer fulfillment churn by 35%.",
      },
      {
        company: "Trident Apex Industries",
        title: "Director of Global Supply Chain",
        start: "2017",
        end: "2022",
        current: false,
        description:
          "Restructured supply network procurement contracts resulting in $12M annual cost savings across international vendor partners.",
      },
    ],
    education: [
      {
        school: "Indian School of Business (ISB)",
        degree: "Post Graduate Programme in Management (MBA)",
        year: "2015 – 2017",
      },
      {
        school: "BITS Pilani",
        degree: "B.E. in Mechanical Engineering",
        year: "2010 – 2014",
      },
    ],
    skills: [
      "P&L Management ($40M+)",
      "Strategic Business Planning",
      "Executive Leadership & Team Building",
      "Supply Chain & Operations Optimization",
      "Enterprise Risk Management",
      "Mergers & Acquisitions Integration",
      "Digital Transformation",
    ],
    projects: [
      {
        name: "Enterprise Digital Operations Transformation",
        description: "Multi-year SAP ERP and automated inventory integration across 14 distribution centers.",
      },
    ],
    certificates: [
      {
        name: "Lean Six Sigma Black Belt",
        issuer: "ASQ",
        year: "2021",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Hindi", proficiency: "Fluent" },
    ],
    achievements: [
      {
        title: "Executive Leader of the Year – APAC Supply Chain Summit",
        date: "2023",
      },
    ],
    isFresher: false,
    template: "executive",
    completeness: 100,
    status: "published",
  },
};

/**
 * Normalizes template slug/id to supported TemplateId
 */
export function normalizeTemplateId(slug?: string | null): TemplateId {
  if (!slug) return "ats";
  const clean = slug.toLowerCase().trim();
  if (clean === "ats" || clean === "ats-professional") return "ats";
  if (clean === "modern" || clean === "modern-professional") return "modern";
  if (clean === "minimal" || clean === "minimalist") return "minimal";
  if (clean === "creative" || clean === "creative-professional") return "creative";
  if (clean === "executive" || clean === "executive-leadership") return "executive";
  return "ats";
}

export function getDemoResume(templateId?: string | null): ResumeData {
  const normalized = normalizeTemplateId(templateId);
  return DEMO_RESUMES[normalized] || DEMO_RESUMES.ats;
}
