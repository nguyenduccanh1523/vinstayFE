import React, { useMemo, useState } from "react";

export default function ImageGallery({ images }) {
  // chuẩn hoá: luôn là mảng ảnh (fallback placeholder)
  const imgs = useMemo(() => {
    if (Array.isArray(images) && images.length) return images;
    if (typeof images === "string" && images) return [images];
    return ["https://via.placeholder.com/1600x900?text=Hotel"];
  }, [images]);

  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-4">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={imgs[selected] || imgs[0]}
          alt="Hotel main"
          className="h-96 md:h-[500px] w-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium hover:bg-white"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        >
          📷 View photos
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {imgs.slice(0, 4).map((url, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`rounded-lg overflow-hidden border-2 transition-all aspect-square ${
              selected === idx ? "border-slate-900" : "border-transparent"
            }`}
            type="button"
          >
            <img src={url} alt={`thumb-${idx}`} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
