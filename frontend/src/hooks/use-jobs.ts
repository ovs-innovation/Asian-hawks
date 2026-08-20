"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DEMO_BLOGS, DEMO_JOBS, type DemoJob } from "@/lib/demo-data";

export function useJobs(params = "") {
  const query = params.includes("limit=") ? params : `${params}${params.includes("?") ? "&" : "?"}limit=50`;
  return useQuery({
    queryKey: ["jobs", query],
    queryFn: async ({ signal }) => {
      try {
        const data = await api<{ items: DemoJob[] }>(`/jobs${query}`, { signal });
        if (data.items?.length) return data.items;
      } catch {
        /* demo fallback */
      }
      return DEMO_JOBS;
    },
  });
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ["job", slug],
    queryFn: async ({ signal }) => {
      try {
        const data = await api<{ job: DemoJob }>(`/jobs/${slug}`, { signal });
        if (data.job) return data.job;
      } catch {
        /* demo */
      }
      return DEMO_JOBS.find((j) => j.slug === slug) ?? null;
    },
  });
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async ({ signal }) => {
      try {
        const data = await api<{ items: typeof DEMO_BLOGS }>(`/blogs`, { signal });
        if (data.items?.length) return data.items;
      } catch {
        /* demo */
      }
      return DEMO_BLOGS;
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async ({ signal }) => {
      try {
        return await api<{ jobs: number; companies: number; candidates: number; successRate: number }>("/stats", { signal });
      } catch {
        return { jobs: 12000, companies: 850, candidates: 64000, successRate: 97 };
      }
    },
  });
}
