"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { api } from "@/lib/api";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await api<{ resetToken?: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("If the account exists, a reset link has been sent.");
      if (data.resetToken) toast.message(`Dev token: ${data.resetToken}`);
    } catch {
      toast.success("If the account exists, a reset link has been sent.");
    }
  }
  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold">Forgot password</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Input type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit">Send reset link</Button>
      </form>
    </section>
  );
}
