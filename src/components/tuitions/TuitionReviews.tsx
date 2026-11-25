"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MessageSquareQuote, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { Review, TuitionApplication } from "@/lib/types";

type ReviewsResponse = {
  success: boolean;
  reviews: Review[];
  averageRating: number;
  total: number;
};

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          style={{ width: size, height: size }}
          className={star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function TuitionReviews({ tuitionId }: { tuitionId: string }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      apiFetch<ReviewsResponse>(`/reviews/tuition/${tuitionId}`, {
        signal: controller.signal,
      }),
      isAuthenticated
        ? apiFetch<{ applications: TuitionApplication[] }>(
            "/applications/my-applications",
            { auth: true, signal: controller.signal }
          )
        : Promise.resolve(null),
    ])
      .then(([data, applications]) => {
        if (!active) return;

        const list = data.reviews || [];
        const ownReview = list.find(
          (review) =>
            review.studentEmail?.toLowerCase() === user?.email?.toLowerCase()
        );

        setReviews(list);
        setAverageRating(data.averageRating || 0);
        setAlreadyReviewed(Boolean(ownReview));
        setCanReview(
          Boolean(
            applications?.applications?.some(
              (item) => item.tuitionId === tuitionId && item.status === "accepted"
            )
          ) && !ownReview
        );
      })
      .catch(() => {
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [tuitionId, isAuthenticated, user?.email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const data = await apiFetch<{ review: Review }>("/reviews", {
        method: "POST",
        auth: true,
        body: { tuitionId, rating, feedback },
      });

      setReviews((current) => [data.review, ...current]);
      setAlreadyReviewed(true);
      setCanReview(false);
      setFeedback("");
      toast.success("Thank you! Your review has been published.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Student Reviews</h2>
          <p className="mt-1 text-xs text-slate-500">
            Feedback from students who joined this batch.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          {averageRating.toFixed(1)}
          <span className="text-xs font-medium text-amber-600">({reviews.length})</span>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading reviews...
        </div>
      ) : (
        <>
          {reviews.length ? (
            <ul className="mt-6 space-y-4">
              {reviews.map((review) => (
                <li
                  key={review._id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      {review.studentName}
                    </p>
                    <StarRow value={review.rating} />
                  </div>
                  {review.feedback ? (
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {review.feedback}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs italic text-slate-400">
                      No written feedback provided.
                    </p>
                  )}
                  {review.createdAt && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
              No reviews yet. Be the first to share your experience.
            </p>
          )}

          {canReview && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
            >
              <h3 className="text-sm font-bold text-slate-800">Rate this tuition</h3>

              <div className="mt-3 flex items-center gap-1" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={rating === star}
                    className="rounded p-1 transition hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Share what you liked about this batch (optional)"
                aria-label="Your feedback"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={submitting}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0f9f6e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#087a54] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {!canReview && !alreadyReviewed && (
            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              {!isAuthenticated ? (
                <>
                  Sign in with a student account and get accepted to this tuition
                  to leave a review.{" "}
                  <Link
                    href="/sign-in"
                    className="font-bold text-[#0f9f6e] hover:underline"
                  >
                    Sign in →
                  </Link>
                </>
              ) : user?.role === "student" ? (
                <>
                  Only students with an accepted application can review this
                  tuition.{" "}
                  <Link
                    href="/dashboard/student/my-applications"
                    className="font-bold text-[#0f9f6e] hover:underline"
                  >
                    Check My Applications →
                  </Link>
                </>
              ) : (
                "Only students with an accepted application can review this tuition."
              )}
            </div>
          )}

          {alreadyReviewed && (
            <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
              You have already reviewed this tuition. Thank you for your feedback!
            </p>
          )}
        </>
      )}
    </section>
  );
}
