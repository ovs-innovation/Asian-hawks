import React from "react";
import type { ResumeData } from "@/types/resume";
import { AtsTemplate } from "./ats-template";
import { ModernTemplate } from "./modern-template";
import { MinimalTemplate } from "./minimal-template";
import { CreativeTemplate } from "./creative-template";
import { ExecutiveTemplate } from "./executive-template";

export function TemplateRenderer({ data }: { data: ResumeData }) {
  switch (data.template) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "executive":
      return <ExecutiveTemplate data={data} />;
    case "ats":
    default:
      return <AtsTemplate data={data} />;
  }
}
