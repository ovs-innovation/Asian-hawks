import { Mail, MessageCircle } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";

export default function ContactPage() {
  return (
    <section className="bg-[#f4f7fb]">
      <div className="bg-[linear-gradient(135deg,#03224c_0%,#0f5daa_100%)]">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-12 sm:py-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80">Asian Hawks</p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight !text-white sm:text-[38px]">
            Contact us
          </h1>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-white/90">
            Jobs, training, or interview help — WhatsApp or send a message.
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="https://wa.me/916280698650"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#157347] px-5 text-[14px] font-semibold text-white sm:h-11 sm:w-auto"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[var(--max-w)] gap-6 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <a
            href="mailto:asianhawksmanpower@gmail.com"
            className="flex gap-3 rounded-2xl border border-[#e6edf5] bg-white p-6"
          >
            <Mail size={20} className="mt-0.5 shrink-0 text-[#0f5daa]" />
            <span>
              <span className="block text-[13px] font-semibold text-[#64748b]">General</span>
              <span className="mt-1 block break-all text-[15px] font-semibold text-[#111827]">
                asianhawksmanpower@gmail.com
              </span>
            </span>
          </a>
          <a
            href="mailto:Hr@asianhawksmanpower.com"
            className="flex gap-3 rounded-2xl border border-[#e6edf5] bg-white p-6"
          >
            <Mail size={20} className="mt-0.5 shrink-0 text-[#b31b43]" />
            <span>
              <span className="block text-[13px] font-semibold text-[#64748b]">HR</span>
              <span className="mt-1 block break-all text-[15px] font-semibold text-[#111827]">
                Hr@asianhawksmanpower.com
              </span>
            </span>
          </a>
          <p className="px-1 text-[14px] leading-6 text-[#475569]">
            Asian Hawks Manpower Services Pvt. Ltd. · Pan India
          </p>
        </div>

        <div className="rounded-2xl border border-[#e6edf5] bg-white p-6 sm:p-8">
          <h2 className="text-[20px] font-bold text-[#111827]">Send a message</h2>
          <p className="mt-1 mb-5 text-[14px] text-[#64748b]">
            Name, number, and your query. Resume attach the job listing se karo.
          </p>
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
