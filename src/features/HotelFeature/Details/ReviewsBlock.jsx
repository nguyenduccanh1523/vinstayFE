import React from "react";

function ReviewCard({ review }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium">
          {review.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-slate-900">{review.author}</h4>
              <p className="text-sm text-slate-600">{review.date}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-medium">{review.rating}</span>
            </div>
          </div>
          <p className="text-slate-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsBlock({ rating = 4.8, reviewCount = 0 }) {
  const reviews = [
    {
      author: "Sarah Johnson",
      rating: 5.0,
      date: "Dec 2024",
      comment:
        "Absolutely stunning hotel! The service was impeccable and the location couldn't be better. The rooftop pool has amazing views.",
    },
    {
      author: "Michael Chen",
      rating: 4.8,
      date: "Nov 2024",
      comment: "Great stay overall. Room was spacious and staff was helpful.",
    },
    {
      author: "Emma Wilson",
      rating: 4.9,
      date: "Nov 2024",
      comment:
        "Perfect location for exploring. The restaurant serves excellent dishes. Highly recommended!",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Guest Reviews</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{Number(rating).toFixed(1)}</span>
          <div>
            <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
            <div className="text-sm text-slate-600">{reviewCount} reviews</div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>
    </div>
  );
}
