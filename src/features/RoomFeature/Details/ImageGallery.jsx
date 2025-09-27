import React, { useEffect, useMemo, useState } from "react";

export default function ImageGallery({ images }) {
  // Luôn ép về mảng
  const list = useMemo(() => {
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === "string" && images) return [images];
    return [];
  }, [images]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  // Nếu list thay đổi làm index vượt biên, đưa về 0
  useEffect(() => {
    if (selectedImage > list.length - 1) setSelectedImage(0);
  }, [list.length, selectedImage]);

  if (!list.length) return null;

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={list[selectedImage]}
          alt="Room view"
          className="h-80 md:h-96 w-full object-cover"
        />
        <button
          onClick={() => setShowAllImages((s) => !s)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium hover:bg-white"
        >
          📷 {list.length} photos
        </button>
      </div>

      {showAllImages ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {list.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setShowAllImages(false);
              }}
              className="rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image}
                alt={`View ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {list.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                selectedImage === index ? "border-slate-900" : "border-transparent"
              }`}
            >
              <img
                src={image}
                alt={`View ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
