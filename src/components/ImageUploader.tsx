import React, { useRef, useState, ChangeEvent } from 'react';

interface Props {
  code: string | null;
}

export default function ImageUploader({ code }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const backCameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected || !selected.type.startsWith('image/')) {
      setStatus('Wybierz poprawny obraz.');
      setFile(null);
      return;
    }
    setFile(selected);
    setStatus('Obraz wybrany. Gotowy do wysłania.');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Nie wybrano pliku.');
      return;
    }

    setStatus('Wysyłanie na serwer...');

    const form = new FormData();
    form.append('file', file);

    const headers: Record<string, string> = {};
    if (code) {
      headers['X-Auth-Code'] = code;
    }

    try {
      const res = await fetch('https://weraimati.ddns.net/api/upload', {
        method: 'POST',
        headers,
        body: form,
      });

      if (res.ok) {
        setStatus('Wysłano pomyślnie! Obraz wkrótce pojawi się w galerii!');
      } else {
        const err = await res.json();
        setStatus(`Błąd wysyłania: ${err.message || res.statusText}`);
      }
    } catch (error: any) {
      setStatus(`Błąd połączenia: ${error.message}`);
    }
  };

  // Shared style for buttons
  const buttonStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px 16px',
    fontSize: '20px',
    borderRadius: '10px',
    color: '#fff',
    border: 'none',
    fontFamily: "'Raleway', sans-serif", 
    cursor: 'pointer',
    minWidth: '145px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={{ maxWidth: 120, margin: '0.5rem auto', textAlign: 'center' }}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={backCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Side-by-side buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => backCameraInputRef.current?.click()}
          style={{
            ...buttonStyle,
            backgroundColor: '#8c78b7',
          }}
        >
          <span style={{ fontSize: '36px' }}>📷</span>
          <span>Zrób zdjęcie</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            ...buttonStyle,
            backgroundColor: '#8c78b7',
          }}
        >
          <span style={{ fontSize: '36px' }}>🖼️</span>
          <span>Wybierz obraz</span>
        </button>
      </div>

      {/* Upload button - now matches others */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleUpload}
          style={{
            ...buttonStyle,
            backgroundColor: '#8c78b7',
            maxWidth: 'calc(80% - 10px)',
          }}
        >
          <span style={{ fontSize: '36px' }}>📤</span>
          <span>Prześlij do galerii</span>
        </button>
      </div>

      {/* Status Message */}
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
