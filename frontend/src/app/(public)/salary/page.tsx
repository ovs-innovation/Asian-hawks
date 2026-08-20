const rows = [
  ["Product Designer", "$110k", "$175k", "San Francisco"],
  ["Backend Engineer", "$140k", "$220k", "Remote"],
  ["People Operations", "$95k", "$150k", "New York"],
  ["Growth Marketing", "$90k", "$135k", "Austin"],
  ["DevOps Engineer", "$120k", "$170k", "Chicago"],
  ["Data Scientist", "$130k", "$190k", "London"],
];

export default function SalaryPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1320px]">
        <h1 className="text-4xl font-bold">Salary guide</h1>
        <p className="mt-3 max-w-xl text-slate-500">Ranges from live Northline listings. Not a survey, not a guess.</p>
        <div className="mt-10 overflow-hidden rounded-[12px] border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900">
              <tr>
                {["Role", "Lower", "Upper", "Market"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-t border-slate-200 dark:border-slate-800">
                  {r.map((c) => <td key={c} className="px-5 py-4">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
