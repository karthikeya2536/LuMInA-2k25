import React from 'react';

interface GalleryPageProps {
  onBack: () => void;
}

const images = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/lumina-gallery-${i}/600/400`,
  alt: `Gallery image ${i + 1}`,
}));

const GalleryPage: React.FC<GalleryPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen container mx-auto px-6 py-12 animate-item-enter">
      <button onClick={onBack} className="mb-8 text-brand-accent hover:underline">
        &larr; Back to Home
      </button>
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">LuMInA Gallery</h1>
        <p className="text-lg text-brand-text-dark max-w-2xl mx-auto">
          A glimpse into the vibrant moments and unforgettable memories from our fest.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="group overflow-hidden rounded-lg shadow-lg"
            style={{ animation: `item-enter 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards ${100 + index * 100}ms`, opacity: 0 }}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
