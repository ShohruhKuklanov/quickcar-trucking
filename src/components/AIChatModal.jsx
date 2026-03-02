"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bot } from "lucide-react";

const FIRST_ASSISTANT_MESSAGE =
  "Thank you for contacting Quickcar Trucking LLC! We ship 200,000+ vehicles per year, so you’re in good hands. With our True Price Guarantee, you’ll get a locked-in price with no hidden fees. How can we help today?\n\nHenry: 646 989 2727\nPlease select one of the options below to proceed.";

export default function AIChatModal({ open, setOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState([
    { role: "assistant", content: FIRST_ASSISTANT_MESSAGE },
  ]);
  const [leadState, setLeadState] = useState({
    pickup: null,
    delivery: null,
    vehicleType: null,
    timeline: null,
    serviceLevel: "Standard",
    negotiationLevel: 0,
    email: null,
    phone: null,
  });
  const lastPriceRef = useRef(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const urgencySentRef = useRef(false);
  const inactivityTimeoutRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      window.clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = window.setTimeout(() => {
      if (urgencySentRef.current) return;
      urgencySentRef.current = true;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Just a heads up — dispatch windows fill quickly for popular lanes. Would you like me to reserve availability?",
        },
      ]);
    }, 30000);
  };

  useEffect(() => {
    if (!open) return;
    urgencySentRef.current = false;
    resetInactivityTimer();

    return () => {
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
    };
  }, [open]);

  const scrollToQuote = () => {
    const el =
      document.getElementById("quote-section") ||
      document.getElementById("quote") ||
      document.getElementById("quote-form");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showQuickOptions =
    messages.length === 1 && messages[0]?.role === "assistant" && !loading;

  const chooseQuickOption = (label) => {
    resetInactivityTimer();
    setMessages((prev) => [...prev, { role: "user", content: label }]);

    if (label === "Get a quote!") {
      setOpen(false);
      if (pathname === "/") {
        window.setTimeout(() => scrollToQuote(), 0);
      } else {
        router.push("/quote");
      }
      return;
    }

    if (label === "Chat with an agent") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "You can reach Henry at (646) 989-2727. If you share your name and pickup/delivery states here, I can help right away too.",
        },
      ]);
      return;
    }

    if (label === "Existing Order") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please share your order number (or the email/phone used to book) and I’ll help you with the status and next steps.",
        },
      ]);
      return;
    }

    if (label === "Existing quote") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please share your quote ID (or the email used) and I’ll pull it up and help you proceed.",
        },
      ]);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    if (loading) return;

    resetInactivityTimer();

    const userMessage = { role: "user", content: text };
    const outgoing = [...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Lead capture: if the user provided an email, store the transcript.
    if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(userMessage.content)) {
      fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadState,
          conversationTranscript: outgoing,
          price: lastPriceRef.current,
        }),
      }).catch(() => {});
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: outgoing, leadState }),
        signal: controller.signal,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const replyText =
        typeof data?.message === "string" && data.message.trim()
          ? data.message
          : res.ok
            ? "Sorry — I didn’t get a response. Please try again."
            : "Sorry — something went wrong on our side. Please try again.";

      if (data && typeof data === "object" && data.leadState) {
        setLeadState(data.leadState);
      }

      if (typeof data?.price === "number") {
        lastPriceRef.current = data.price;
      }

      if (data?.escalate === true) {
        fetch("/api/notify-dispatcher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadState: data?.leadState ?? leadState,
            price: typeof data?.price === "number" ? data.price : lastPriceRef.current,
            transcript: [...outgoing, { role: "assistant", content: replyText }],
          }),
        }).catch(() => {});
      }

      // Persist lead when we have contact info + a quote.
      const nextLeadState = data?.leadState ?? leadState;
      const hasEmail = typeof nextLeadState?.email === "string" && nextLeadState.email.length > 3;
      const hasQuote = typeof data?.price === "number" || typeof lastPriceRef.current === "number";
      if (hasEmail && hasQuote) {
        fetch("/api/save-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...nextLeadState,
            price: typeof data?.price === "number" ? data.price : lastPriceRef.current,
            conversationTranscript: [...outgoing, { role: "assistant", content: replyText }],
          }),
        }).catch(() => {});
      }

      if (/lock this price/i.test(replyText)) {
        scrollToQuote();
      }

      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    } catch (err) {
      const isAbort = err?.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isAbort
            ? "Sorry — this is taking longer than expected. Please try again."
            : "Sorry — I couldn’t reach the server. Please try again.",
        },
      ]);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4 font-semibold">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gray-100">
              <Bot className="h-4 w-4 text-gray-700" aria-hidden="true" />
            </span>
            <span>Quickcar AI Assistant</span>
          </div>
          <button type="button" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="h-80 space-y-3 overflow-y-auto p-4 text-sm">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex items-start gap-2"}>
              {m.role === "assistant" ? (
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Bot className="h-4 w-4 text-gray-700" aria-hidden="true" />
                </span>
              ) : null}

              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </div>
          ))}

          {showQuickOptions ? (
            <div className="flex flex-wrap gap-2">
              {["Get a quote!", "Existing Order", "Existing quote", "Chat with an agent"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => chooseQuickOption(label)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-50"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {loading && <div className="text-gray-400">Typing...</div>}
        </div>

        <div className="flex gap-2 border-t p-3">
          <input
            value={input}
            onChange={(e) => {
              resetInactivityTimer();
              setInput(e.target.value);
            }}
            placeholder="Ask about price, pickup time..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            type="button"
            onClick={sendMessage}
            className="rounded-lg bg-blue-600 px-4 text-sm text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
