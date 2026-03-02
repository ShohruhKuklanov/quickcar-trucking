"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BottomActionBar({ openChat = () => {} }) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.1 }
    );

    if (footer) observer.observe(footer);

    return () => {
      if (footer) observer.unobserve(footer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={
        `
        fixed bottom-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none
        transition-all duration-500
        ${hidden ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100"}
      `
      }
    >
      <div
        className="
        pointer-events-auto
        hidden md:flex
        items-center gap-4
        bg-white/90 backdrop-blur-lg
        shadow-md
        rounded-2xl
        px-4 py-2
        border border-black/5
        transition-all duration-300
      "
      >
        {/* Ask a Question */}
        <button
          className="
          flex items-center gap-3
          h-10 px-5
          rounded-xl
          bg-gray-100
          hover:bg-gray-200
          text-sm font-medium text-gray-700
          transition-all duration-200
        "
          type="button"
          onClick={openChat}
        >
          <span className="text-base">💬</span>
          <span>Ask a Question</span>
        </button>

        {/* Primary CTA */}
        <button
          className="
          flex items-center gap-3
          h-10 px-5
          rounded-xl
          bg-blue-600
          text-white
          text-sm font-medium
          transition-all duration-200
          hover:-translate-y-0.5
          hover:shadow-md
          hover:shadow-blue-500/30
        "
          type="button"
          onClick={() => {
            router.push("/quote");
          }}
        >
          <span className="text-sm">Get a Quote</span>
        </button>
      </div>
    </div>
  );
}
