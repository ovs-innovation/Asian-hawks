"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { Sidebar } from "@/components/sidebar";
import { Menu, ExternalLink, ShieldCheck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const userInitial = (user?.name || "A")[0].toUpperCase();

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          />
        )}

        <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:-ml-64"}`}>
          <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 sm:px-6 z-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[#0f5daa] transition-all shadow-2xs"
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-label="Toggle Sidebar"
              >
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f5daa]/10 text-[#0f5daa]">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <h1 className="text-sm font-bold text-slate-900">Admin Control Center</h1>
                  <p className="text-[11px] text-slate-500 hidden sm:block">Asian Hawks Management Portal</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0f5daa] hover:bg-blue-50"
              >
                <span>Live Site</span>
                <ExternalLink size={13} />
              </a>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#0f5daa] text-xs font-bold text-white">
                  {userInitial}
                </div>
                <div className="hidden sm:block leading-tight text-left">
                  <p className="text-xs font-bold text-slate-900">{user?.name || "Asian Hawks Admin"}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user?.role?.replace("_", " ") || "Super Admin"}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
