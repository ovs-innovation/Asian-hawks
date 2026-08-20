"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";
import { hydrate } from "@/store/authSlice";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, hydrated } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (!hydrated) dispatch(hydrate());
  }, [hydrated, dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || !["super_admin", "moderator"].includes(user.role)) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f4fa]">
        <div className="h-8 w-8 rounded-full border-2 border-[#0f5daa] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !["super_admin", "moderator"].includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
