import React, { useEffect, useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import { Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import type { Slide } from 'yet-another-react-lightbox';
interface DriveFile {
  id: string;
  name: string;
  width?: number;
  height?: number;
  thumbnailLink?: string;
  webViewLink?: string;
}

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY!;
const FOLDER_ID = process.env.REACT_APP_FOLDER_ID!;

function Gallery() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const q = encodeURIComponent(`'${FOLDER_ID}' in parents and mimeType contains 'image/'`);
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${GOOGLE_API_KEY}&fields=files(id,name,imageMediaMetadata(width,height),thumbnailLink,webViewLink)`;
      const res = await fetch(url);
      const data = await res.json();
      const list = Array.isArray(data.files) ? data.files : [];
      setFiles(
        list.map((f: any) => ({
          id: f.id,
          name: f.name,
          width: f.imageMediaMetadata?.width,
          height: f.imageMediaMetadata?.height,
          thumbnailLink: f.thumbnailLink,
         webViewLink: f.webViewLink
          
        }))
      );
    } catch (error) {
      console.error('Error fetching images:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // PhotoAlbum thumbnails
  const photos = files.map(f => ({
    src: f.thumbnailLink!,
    width: f.width || 800,
    height: f.height || 600,
    title: f.name,
    referrerPolicy: 'no-referrer',
  }));

  // Lightbox slides
  const slides = files.map(f => ({
    src: `https://drive.google.com/thumbnail?id=${f.id}&sz=w10000`,
    width: f.width || 800,
    height: f.height || 600,
    title: f.name,
    
  }));

  return (
    <div style={{ textAlign: 'center', padding: '10px 5px' }}>
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={fetchImages}
          disabled={loading}
          style={{
            padding: '8px 16px',
            fontSize: '20px',
            minWidth: '145px',
            borderRadius: '6px',
            fontFamily: "'Raleway', sans-serif", 
            backgroundColor: '#8c78b7',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Odświeżanie...' : 'Odśwież'}
        </button>
      </div>

      {photos.length > 0 ? (
         <PhotoAlbum
        layout="columns"
        photos={photos}
        onClick={({ index }) => {
          setCurrentIndex(index);
          setLightboxOpen(true);
        }}
        componentsProps={{
          // <-- This injects into every <img>
          image: {
            referrerPolicy: 'no-referrer',  // no Referer header when fetching
            loading: 'lazy',
            decoding: 'async',
          },
        }}
      />
      ) : (
        <p></p>
      )}

      {lightboxOpen && slides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={currentIndex}
          plugins={[Zoom]}
          zoom={{ maxZoomPixelRatio: 3 }}
          on={{ view: ({ index }) => setCurrentIndex(index) }}
           render={{
    slide: ({ slide }) => {
      const typedSlide = slide as Slide & {
        src: string;
        title?: string;
        width?: number;
        height?: number;
      };

      return (
        <img
          src={typedSlide.src}
          alt={typedSlide.title || ''}
          width={typedSlide.width}
          height={typedSlide.height}
            style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
            }}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      );
    },
  
  }}
        />
      )}
    </div>
  );
}

export default Gallery;