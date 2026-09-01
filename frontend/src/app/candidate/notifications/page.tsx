"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle2,
  Briefcase,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";

type NotificationItem = {
  _id: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
};

export default function CandidateNotificationsPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<{ items: NotificationItem[] }>({
    queryKey: ["notifications"],
    queryFn: () => api<{ items: NotificationItem[] }>("/notifications"),
  });

  const markReadMutation = useMutation({
    mutationFn: () => api("/notifications/read", { method: "POST" }),
    onSuccess: () => {
      toast.success("Notifications marked as read");
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Notifications"
        body="Track your application status updates, interview schedules, and workspace alerts."
        action={
          unreadCount > 0 ? (
            <Button
              type="button"
              onClick={() => markReadMutation.mutate()}
              disabled={markReadMutation.isPending}
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-10 px-4 rounded-xl"
            >
              <CheckCheck size={16} className="mr-1.5 text-[#0f5daa]" />
              <span>Mark All as Read</span>
            </Button>
          ) : null
        }
      />

      {/* Notifications Summary Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0f5daa] font-bold">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Activity & Alerts</h3>
            <p className="text-xs text-slate-500">
              {unreadCount > 0 ? `${unreadCount} unread notification(s)` : "All notifications read"}
            </p>
          </div>
        </div>

        <Link
          href="/candidate/applied"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f5daa] hover:underline"
        >
          <span>View Applied Jobs</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Error state */}
      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 flex items-center justify-between">
          <span>{error instanceof Error ? error.message : "Failed to load notifications"}</span>
          <button type="button" onClick={() => refetch()} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : null}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : null}

      {/* Notifications List */}
      {!isLoading && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => {
            const isInterview = item.title?.toLowerCase().includes("interview");
            const isReceived = item.title?.toLowerCase().includes("received") || item.title?.toLowerCase().includes("submitted");

            return (
              <Card
                key={item._id}
                className={`group relative p-5 transition-all border-slate-200 ${
                  !item.read ? "bg-blue-50/40 border-blue-200/80 shadow-2xs" : "bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-bold text-lg ${
                        isInterview
                          ? "bg-purple-100 text-purple-700"
                          : isReceived
                          ? "bg-blue-100 text-[#0f5daa]"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isInterview ? (
                        <Calendar size={20} />
                      ) : isReceived ? (
                        <FileText size={20} />
                      ) : (
                        <CheckCircle2 size={20} />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        {!item.read ? (
                          <span className="h-2 w-2 rounded-full bg-[#0f5daa]" title="Unread" />
                        ) : null}
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.body}</p>

                      <p className="text-[11px] font-semibold text-slate-400 pt-0.5">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {item.link ? (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-slate-200 text-[#0f5daa] hover:bg-blue-50 font-bold text-xs h-8 px-3 rounded-lg shrink-0 self-center"
                    >
                      <Link href={item.link}>View Details</Link>
                    </Button>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {/* Empty State */}
      {!isLoading && notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-200">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] mb-4">
            <Bell size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Notifications Yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            You will receive instant alerts here whenever an employer reviews your application or schedules an interview.
          </p>
          <Button asChild className="mt-5 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-6 h-10 font-semibold text-xs shadow-2xs">
            <Link href="/candidate/applied">View Application Status</Link>
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
