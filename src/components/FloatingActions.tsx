"use client";

import { useState } from "react";

import BottomActionBar from "@/components/BottomActionBar";
import AIChatModal from "@/components/AIChatModal";

export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);

  const openChat = () => {
    setChatOpen(true);
  };

  const setOpen = (value: boolean) => {
    setChatOpen(value);
  };

  return (
    <>
      <BottomActionBar openChat={openChat} />
      <AIChatModal open={chatOpen} setOpen={setOpen} />
    </>
  );
}
