'use client';

import { useState, useEffect } from 'react';

interface PDFThumbnailProps {
  fileUrl: string;
  className?: string;
}

export default function PDFThumbnail({ fileUrl, className = '' }: PDFThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only run on client side
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // Dynamic import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({
          url: fileUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Get first page

        // Create canvas for thumbnail
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Could not get canvas context');
        }

        // Set thumbnail size (smaller than full page)
        const scale = 0.2; // 20% of original size
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;

        // Convert canvas to data URL
        const thumbnailDataUrl = canvas.toDataURL('image/png');
        setThumbnailUrl(thumbnailDataUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error generating PDF thumbnail:', err);
        setError('Failed to generate thumbnail');
        setLoading(false);
      }
    };

    if (fileUrl) {
      generateThumbnail();
    }
  }, [fileUrl]);

  if (loading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !thumbnailUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-1">📄</div>
          <div className="text-xs">PDF</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt="PDF Thumbnail"
      className={`rounded-lg object-cover ${className}`}
    />
  );
}
