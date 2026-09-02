import { toast } from "sonner";

export function printResume(fileName = "Resume", customElementId?: string) {
  if (typeof window === "undefined") return;

  // 1. Find printable resume content with high specificity
  let targetEl: Element | null = null;
  if (customElementId) {
    targetEl = document.getElementById(customElementId);
  }
  if (!targetEl) {
    targetEl =
      document.querySelector("#resume-print-area .resume-document") ||
      document.getElementById("resume-print-area") ||
      document.querySelector(".resume-document");
  }

  if (!targetEl) {
    toast.error("Resume document preview not found. Please try again.");
    return;
  }

  // 2. Set PDF document filename title
  const originalTitle = document.title;
  const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_\-]/gi, "_");
  document.title = cleanName;

  // 3. Inject global print CSS styles
  const styleId = "resume-global-print-styles";
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
      #global-print-portal {
        display: none;
      }
      @media print {
        body > *:not(#global-print-portal) {
          display: none !important;
        }
        #global-print-portal {
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          color: black !important;
        }
        #global-print-portal * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #global-print-portal a:after {
          content: none !important;
        }
        #global-print-portal section,
        #global-print-portal header {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        #global-print-portal .resume-document {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-height: auto !important;
          background: white !important;
        }
        @page {
          size: A4 portrait;
          margin: 8mm 10mm 10mm 10mm;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // 4. Populate top-level print portal directly under document.body
  let portalEl = document.getElementById("global-print-portal");
  if (!portalEl) {
    portalEl = document.createElement("div");
    portalEl.id = "global-print-portal";
    document.body.appendChild(portalEl);
  }

  // If target element is wrapped inside a container, grab the outer HTML or container HTML
  const outerContainer = targetEl.classList.contains("resume-document")
    ? targetEl
    : targetEl.querySelector(".resume-document") || targetEl;
  portalEl.innerHTML = outerContainer.outerHTML || outerContainer.innerHTML;

  toast.info("Opening print preview… Select 'Save as PDF' to download.");

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
      if (portalEl) portalEl.innerHTML = "";
    }, 1000);
  }, 150);
}
