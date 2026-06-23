import { useState } from "react";
import { getAIReview } from "../services/aiReviewService";

export function useAIReview(user, language, code, problemTitle, setActiveTab) {
  const [aiReview, setAiReview] = useState(null);
  const [lastReviewKey, setLastReviewKey] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const handleAIReview = async () => {
    if (!user) {
      setActiveTab("ai-review");
      setAiReview(null);
      setReviewMessage("🔒 Login required to use AI Review.");
      return;
    }

    try {
      setActiveTab("ai-review");
      const reviewKey = `${language}-${code}`;
      if (aiReview && lastReviewKey === reviewKey) {
        return;
      }

      setAiReview(null);
      setReviewMessage("");
      setReviewLoading(true);
      const review = await getAIReview(
        code,
        language,
        problemTitle,
        user.email,
      );
      setAiReview(review);
      setLastReviewKey(reviewKey);
    } catch (err) {
      setAiReview(null);
      setReviewMessage(err.message || "Failed to generate review");
    } finally {
      setReviewLoading(false);
    }
  };

  return {
    aiReview,
    reviewLoading,
    reviewMessage,
    handleAIReview,
  };
}
