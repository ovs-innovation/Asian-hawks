"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";
import { hydrate, logout } from "@/store/authSlice";
import { api } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, hydrated } = useSelector((s: RootState) => s.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hydrated) dispatch(hydrate());
  }, [hydrated, dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || !token || !["super_admin", "moderator"].includes(user.role)) {
      dispatch(logout());
      router.replace("/login");
      return;
    }

    let cancelled = false;
    api("/auth/me")
      .then(() => {
        if (cancelled) return;
        setChecked(true);
      })
      .catch(() => {
        if (cancelled) return;
        dispatch(logout());
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, user, token, dispatch, router]);

  if (!hydrated || !checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f4fa]">
        <div className="h-8 w-8 rounded-full border-2 border-[#0f5daa] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
