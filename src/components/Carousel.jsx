import React, { useState, useEffect } from 'react';

export default function Carousel({ images, interval }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="carousel">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`carousel__img ${
            i === idx ? 'carousel__img--visible' : ''
          }`}
        />
      ))}
    </div>
  );
}
