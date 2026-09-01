export function printResume(fileName = "Resume") {
  if (typeof window === "undefined") return;

  const originalTitle = document.title;
  document.title = fileName.replace(/\.[^/.]+$/, "");

  const styleId = "resume-print-styles";
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #resume-print-area, #resume-print-area * {
          visibility: visible !important;
        }
        #resume-print-area {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          background: white !important;
        }
        .resume-document {
          box-shadow: none !important;
          border: none !important;
          padding: 20px !important;
          max-width: 100% !important;
          min-height: auto !important;
        }
        @page {
          size: A4 portrait;
          margin: 12mm 15mm 15mm 15mm;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
