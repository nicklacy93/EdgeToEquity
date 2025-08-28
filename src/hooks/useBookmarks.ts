"use client";

import { useState, useEffect } from "react";
import type { ChatMessage } from "@/types/ChatTypes";

export function useBookmarks() {
  const [bookmarkedMessages, setBookmarkedMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      try {
        setBookmarkedMessages(JSON.parse(stored));
      } catch (error) {
        console.error("❌ Failed to parse bookmarks from localStorage:", error);
        setBookmarkedMessages([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkedMessages));
  }, [bookmarkedMessages]);

  const isBookmarked = (msg: ChatMessage) =>
    bookmarkedMessages.some((m) => m.id === msg.id);

  const toggleBookmark = (msg: ChatMessage) => {
    setBookmarkedMessages((prev) =>
      isBookmarked(msg)
        ? prev.filter((m) => m.id !== msg.id)
        : [...prev, msg]
    );
  };

  return {
    bookmarkedMessages: bookmarkedMessages ?? [],
    toggleBookmark,
    isBookmarked,
  };
}
