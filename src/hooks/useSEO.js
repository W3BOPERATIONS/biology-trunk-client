import { useEffect } from "react";

export default function useSEO({ title, description, keywords }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Biology Trunk`;
    } else {
      document.title = "Biology Trunk - Expert Biology Education by PhD Faculty";
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description || "Biology Trunk offers comprehensive biology courses taught by PhD-qualified faculty for NEET, board exams, and competitive biological sciences.");
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords || "biology trunk, NEET biology, PhD faculty, biology online classes, competitive exam biology, class 11 biology, class 12 biology, expert biology tutoring");
    }
  }, [title, description, keywords]);
}
