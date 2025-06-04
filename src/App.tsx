import React, { useEffect, useRef, useState } from 'react';
import ImageUploader from './components/ImageUploader';
import Gallery from './components/Gallery';

function App() {
  const [codeParam, setCodeParam] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCodeParam(params.get('code'));
  }, []);

  // Scroll to gallery when it becomes visible
  useEffect(() => {
  if (showGallery && galleryRef.current) {
    const offset = 150; // Adjust for how far below the top you want
    const top = galleryRef.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}, [showGallery]);

  return (
    <div style={{ textAlign: 'center', padding: '10px 10px', backgroundColor: '#ffffff', fontFamily: "'Raleway', sans-serif", minHeight: '100vh'}}>
      <h1 style={{ fontSize: '2.2rem', padding: '20 20', margin: '0', color: '#8c78b7' }}>Wesele Wery i Mateusza</h1>
      <h1 style={{ fontSize: '1.6rem', padding: '10', margin: '0', color: '#8c78b7' }}>Pokaż jak się bawisz!</h1>

      <ImageUploader code={codeParam} />

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => setShowGallery((prev) => !prev)}
          style={{
            padding: '10px 10px',
            fontSize: '20px',
            minWidth: '145px',
            fontFamily: "'Raleway', sans-serif",
            borderRadius: '8px',
            backgroundColor: '#8c78b7',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {showGallery ? 'Ukryj galerię' : 'Pokaż galerię'}
        </button>
      </div>

      <div>
        <img
          src={process.env.PUBLIC_URL + '/images/baner.png'}
          alt="Decorative"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
        />
      </div>

      {showGallery && (
        <div ref={galleryRef} style={{ marginTop: '5px', minHeight: '800px' }}>
          {showGallery && <Gallery />}
        </div>
      )}
    </div>
  );
}

export default App;
