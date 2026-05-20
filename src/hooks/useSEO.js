import { useEffect } from "react";

export default function useSEO({ title, description, keywords }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Biology Trunk`;
    } else {
      document.title = "Biology Trunk - Expert Coaching for NEET, TGT, PGT & Board Exams";
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description || "Biology Trunk offers comprehensive courses taught by PhD-qualified faculty for NEET, Board Exams (Class 11 & 12), TGT, PGT, and competitive exams.");
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords || "biology trunk, NEET preparation, TGT coaching, PGT exam prep, board exams class 12, class 11 science, competitive exams prep, expert faculty coaching");
    }
  }, [title, description, keywords]);
}
