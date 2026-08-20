"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { Suspense } from "react";

function ResetForm() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: params.get("token"), password }),
      });
      toast.success("Password updated");
      router.push("/login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reset failed");
    }
  }
  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <Input type="password" required minLength={8} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Update password</Button>
    </form>
  );
}

export default function ResetPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold">Reset password</h1>
      <Suspense>
        <ResetForm />
      </Suspense>
    </section>
  );
}
