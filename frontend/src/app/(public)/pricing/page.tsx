import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Starter", price: "$49", note: "For a first hire", items: ["1 active job", "Candidate inbox", "Basic screening", "Email support"] },
  { name: "Growth", price: "$149", note: "For growing teams", featured: true, items: ["8 active jobs", "Shared scorecards", "AI Resume Match", "Recruiter connect"] },
  { name: "Enterprise", price: "Custom", note: "For talent teams", items: ["Unlimited roles", "SSO and permissions", "Dedicated success", "Custom workflows"] },
];

export default function PricingPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-bold">Plans that match how you hire</h1>
          <p className="mt-3 text-slate-500">Candidates are free. Companies pay for seats, roles, and support.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-[14px] border p-8 ${p.featured ? "border-blue-600 shadow-[0_0_0_1px_#2563EB]" : "border-slate-200 dark:border-slate-800"}`}>
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-sm text-slate-500">{p.note}</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight">{p.price}<span className="text-base font-medium text-slate-400">{p.price.startsWith("$") ? "/mo" : ""}</span></p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.items.map((i) => <li key={i}>✓ {i}</li>)}
              </ul>
              <Button className="mt-8" variant={p.featured ? "default" : "secondary"} asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
