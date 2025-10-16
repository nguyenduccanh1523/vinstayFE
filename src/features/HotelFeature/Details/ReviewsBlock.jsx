import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { reviewApi } from "../../../apis/reviewApi";

function ReviewCard({ review, isOwner, onUpdate, onDelete }) {
  const name =
    review?.user_id?.username ||
    (review?.user_id?.email ? review.user_id.email.split("@")[0] : "User");
  const initial = (name?.charAt(0) || "U").toUpperCase();
  const dateStr = review?.created_at
    ? new Date(review.created_at).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : review?.date || "";

  // inline edit state
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(Number(review?.rating || 0));
  const [editComment, setEditComment] = useState(review?.comment || "");
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setEditRating(Number(review?.rating || 0));
    setEditComment(review?.comment || "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!onUpdate) return;
    if (editRating < 1 || editRating > 5 || !editComment.trim()) return;
    setSaving(true);
    try {
      await onUpdate(review._id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium">
          {initial}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-slate-900">{name}</h4>
              <p className="text-sm text-slate-600">{dateStr}</p>
            </div>
            {!editing && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-medium">{review?.rating ?? "-"}</span>
                </div>
                {isOwner && (
                  <>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                      onClick={startEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => onDelete && onDelete(review._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {!editing ? (
            <p className="text-slate-700">{review?.comment}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Edit rating:</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setEditRating(i)}
                      className={`text-2xl transition ${
                        i <= editRating ? "text-yellow-400" : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-sm text-slate-700">
                  {editRating}/5
                </span>
              </div>
              <textarea
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-slate-200"
                rows={3}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="Update your comment..."
                disabled={saving}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 text-white px-3 py-1.5 disabled:opacity-50"
                  onClick={saveEdit}
                  disabled={
                    saving ||
                    editRating < 1 ||
                    editRating > 5 ||
                    !editComment.trim()
                  }
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-1.5"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsBlock({
  hotelId,
  rating: fallbackRating = 4.8,
  reviewCount: fallbackCount = 0,
}) {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  // form state
  const [formRating, setFormRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchReviews() {
      if (!hotelId) return;
      setLoading(true);
      setErr("");
      try {
        const res = await reviewApi.getHotelReviews(hotelId);
        if (!active) return;
        setReviews(res?.reviews || []);
      } catch (e) {
        if (!active) return;
        setErr("Không thể tải đánh giá. Vui lòng thử lại.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchReviews();
    return () => {
      active = false;
    };
  }, [hotelId]);

  const avgRating = useMemo(() => {
    if (!reviews?.length) return fallbackRating;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews, fallbackRating]);

  const totalCount = useMemo(
    () => (reviews?.length ? reviews.length : fallbackCount),
    [reviews, fallbackCount]
  );

  const roundedAvg = Math.round(avgRating || 0);
  const canSubmit =
    isAuthenticated &&
    formRating >= 1 &&
    formRating <= 5 &&
    comment.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      setErr("You must log in to comment.");
      return;
    }
    if (!hotelId) {
      setErr("Missing hotel information.");
      return;
    }
    if (!canSubmit) return;

    setSubmitting(true);
    setErr("");
    try {
      const payload = {
        hotel_id: hotelId,
        rating: formRating,
        comment: comment.trim(),
      };
      const res = await reviewApi.createReview(payload, token);
      const created = res?.review ||
        res?.data ||
        res || {
          _id: crypto?.randomUUID?.() || String(Date.now()),
          user_id: {},
          hotel_id: hotelId,
          rating: formRating,
          comment: comment.trim(),
          created_at: new Date().toISOString(),
        };

      // Ensure user info present for immediate UI
      if (!created.user_id) {
        created.user_id = {
          _id: user?._id,
          username: user?.username || user?.name || "Bạn",
          email: user?.email,
        };
      }

      setReviews((prev) => [created, ...(prev || [])]);
      setFormRating(0);
      setComment("");
    } catch (e) {
      setErr("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isMyReview = (r) => {
    const uid = r?.user_id?._id || r?.user_id?.id || r?.user_id;
    const me = user?._id || user?.id;
    return Boolean(uid && me && String(uid) === String(me));
  };

  const handleUpdate = async (id, data) => {
    try {
      const res = await reviewApi.updateReview(id, data, token);
      const updated = res?.review || res?.data || res;
      setReviews((prev) =>
        prev.map((r) =>
          (r._id || r.id) === (updated?._id || id)
            ? { ...r, ...data, ...updated }
            : r
        )
      );
    } catch (e) {
      setErr("Cập nhật đánh giá thất bại.");
      throw e;
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      setErr("Bạn cần đăng nhập.");
      return;
    }
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      await reviewApi.deleteReview(id, token);
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (e) {
      setErr("Xóa đánh giá thất bại.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            {Number(avgRating || 0).toFixed(1)}
          </span>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={
                    i <= roundedAvg ? "text-yellow-400" : "text-slate-300"
                  }
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="text-sm text-slate-600">{totalCount} reviews</div>
          </div>
        </div>
      </div>

      {/* Review form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h4 className="font-medium text-slate-900 mb-4">Write a Review</h4>
        {!isAuthenticated && (
          <div className="mb-3 text-sm text-slate-600">
            You must log in to comment.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">Choose star rating:</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => isAuthenticated && setFormRating(i)}
                  className={`text-2xl transition ${
                    i <= formRating ? "text-yellow-400" : "text-slate-300"
                  } ${
                    !isAuthenticated ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  aria-label={`Rate ${i} stars`}
                  disabled={!isAuthenticated}
                >
                  ★
                </button>
              ))}
            </div>
            {formRating > 0 && (
              <span className="ml-2 text-sm text-slate-700">
                {formRating}/5
              </span>
            )}
          </div>
          <div>
            <textarea
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!isAuthenticated || submitting}
            />
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <div>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 text-white px-4 py-2 disabled:opacity-50"
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Sending..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {loading && (
          <div className="text-slate-600 text-sm">Loading reviews...</div>
        )}
        {!loading && reviews?.length === 0 && (
          <div className="text-slate-600 text-sm">No reviews yet.</div>
        )}
        {!loading &&
          reviews?.map((r) => (
            <ReviewCard
              key={r._id || r.created_at}
              review={r}
              isOwner={isMyReview(r)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
}
