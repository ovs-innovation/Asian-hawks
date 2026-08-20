"use client";

import { FormEvent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card, Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/demo-data";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await api<{ items: { _id: string; name: string }[] }>("/categories");
      } catch {
        return { items: CATEGORIES.map((name) => ({ _id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name })) };
      }
    },
  });
  const create = useMutation({
    mutationFn: () =>
      api("/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }),
      }),
    onSuccess: () => {
      toast.success("Category created");
      setName("");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name) create.mutate();
  }
  return (
    <>
      <PageHeader title="Job categories" body="Create and order hiring categories." />
      <form onSubmit={onSubmit} className="mb-6 flex max-w-md gap-2">
        <Input placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>
      <div className="grid gap-2 md:grid-cols-3">
        {data?.items?.map((c) => (
          <Card key={c._id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              {"jobCount" in c && <Badge className="mt-2" tone="blue">Jobs: {(c as { jobCount?: number }).jobCount || 0}</Badge>}
            </div>
            <Button size="sm" variant="destructive" onClick={() => remove.mutate(c._id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </>
  );
}
