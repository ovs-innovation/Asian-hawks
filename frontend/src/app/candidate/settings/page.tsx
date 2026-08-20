"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { logout } from "@/store/authSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  async function remove() {
    try {
      await api("/auth/me", { method: "DELETE" });
    } catch {
      /* local sign-out still */
    }
    dispatch(logout());
    toast.success("Account removed");
    router.push("/");
  }
  return (
    <>
      <PageHeader title="Settings" body="Email, password, and notification preferences." />
      <Card className="max-w-xl p-6">
        <h2 className="font-semibold">Delete account</h2>
        <p className="mt-2 text-sm text-slate-500">This removes your profile and applications. It cannot be undone.</p>
        <Button className="mt-4" variant="destructive" onClick={remove}>Delete account</Button>
      </Card>
    </>
  );
}
