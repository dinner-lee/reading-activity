'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, FileText } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
  highlights?: Highlight[];
  annotations?: Annotation[];
  showStudentNames?: boolean;
  showHighlightCount?: boolean;
  onHighlightClick?: (highlight: Highlight) => void;
  viewMode?: 'single' | 'double';
}

export interface Highlight {
  id: string;
  text: string;
  pageNumber: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  studentId: string;
  studentName: string;
  color: string;
  opacity: number;
}

export interface Annotation {
  id: string;
  highlightId: string;
  studentId: string;
  studentName: string;
  text: string;
  createdAt: Date;
  teacherFeedback?: string;
}

export default function PDFViewer({
  fileUrl,
  highlights = [],
  annotations = [],
  showStudentNames = true,
  showHighlightCount = true,
  onHighlightClick,
  viewMode = 'double'
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF.js dynamically to avoid SSR issues
  useEffect(() => {
    const loadPDF = async () => {
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
        
        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({
          url: fileUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        
        // Extract text from all pages for highlighting
        const textPromises = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          textPromises.push(extractTextFromPage(pdf, i));
        }
        const allText = await Promise.all(textPromises);
        setPdfText(allText);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF file. Please check the file URL.');
        setLoading(false);
      }
    };

    if (fileUrl) {
      loadPDF();
    }
  }, [fileUrl]);

  // Extract text from a PDF page
  const extractTextFromPage = async (pdf: any, pageNum: number): Promise<string> => {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      return textContent.items.map((item: any) => item.str).join(' ');
    } catch (err) {
      console.error(`Error extracting text from page ${pageNum}:`, err);
      return '';
    }
  };

  // Render PDF page
  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      const viewport = page.getViewport({ scale, rotation });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;

      // Draw highlights for this page
      const pageHighlights = highlights.filter(h => h.pageNumber === pageNum);
      pageHighlights.forEach(highlight => {
        const { x, y, width, height } = highlight.coordinates;
        
        // Convert PDF coordinates to canvas coordinates
        const canvasX = x * scale;
        const canvasY = y * scale;
        const canvasWidth = width * scale;
        const canvasHeight = height * scale;
        
        // Draw highlight
        ctx.fillStyle = highlight.color;
        ctx.globalAlpha = highlight.opacity;
        ctx.fillRect(canvasX, canvasY, canvasWidth, canvasHeight);
        ctx.globalAlpha = 1;

        // Draw highlight count or student name
        if (showHighlightCount) {
          const count = highlights.filter(h => 
            h.pageNumber === pageNum && 
            Math.abs(h.coordinates.x - x) < 10 && 
            Math.abs(h.coordinates.y - y) < 10
          ).length;
          
          ctx.fillStyle = '#000000';
          ctx.font = `${12 * scale}px Arial`;
          ctx.fillText(`${count}`, canvasX + canvasWidth - 20, canvasY + 15);
        }
      });
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, rotation, highlights]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Handle text selection for highlighting
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        const x = rect.left - containerRect.left;
        const y = rect.top - containerRect.top;
        const width = rect.width;
        const height = rect.height;
        
        // Create highlight
        const highlight: Highlight = {
          id: Date.now().toString(),
          text: selectedText,
          pageNumber: currentPage,
          coordinates: { x, y, width, height },
          studentId: 'current-user',
          studentName: 'Current User',
          color: '#ffeb3b',
          opacity: 0.6
        };
        
        if (onHighlightClick) {
          onHighlightClick(highlight);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600 text-sm">Please check the file URL and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={rotate}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 flex justify-center items-center p-4 overflow-auto">
        <div className="bg-white shadow-lg" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="border cursor-text"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
            onMouseUp={handleTextSelection}
            onClick={(e) => {
              // Handle highlight clicks
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Find clicked highlight
                const clickedHighlight = highlights.find(h => 
                  h.pageNumber === currentPage &&
                  x >= h.coordinates.x * scale &&
                  x <= (h.coordinates.x + h.coordinates.width) * scale &&
                  y >= h.coordinates.y * scale &&
                  y <= (h.coordinates.y + h.coordinates.height) * scale
                );
                
                if (clickedHighlight && onHighlightClick) {
                  onHighlightClick(clickedHighlight);
                }
              }
            }}
          />
        </div>
      </div>

      {/* Page Text Display (for debugging) */}
      {pdfText[currentPage - 1] && (
        <div className="bg-gray-50 p-2 text-xs text-gray-600 max-h-20 overflow-y-auto">
          <strong>Page {currentPage} Text:</strong> {pdfText[currentPage - 1].substring(0, 200)}...
        </div>
      )}
    </div>
  );
}