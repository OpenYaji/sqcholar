import React from 'react';

function NewsSlide({ imageUrl, alt }) {
  return (
    <div className="news-slide">
      <img src={imageUrl} alt={alt} />
    </div>
  );
}

export default NewsSlide;