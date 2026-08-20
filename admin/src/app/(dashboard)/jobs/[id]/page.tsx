import { redirect } from "next/navigation";

export default async function JobIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/jobs/${id}/edit`);
}
