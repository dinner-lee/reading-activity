'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, FileText } from 'lucide-react';

interface SimplePDFViewerProps {
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

export default function SimplePDFViewer({
  fileUrl,
  highlights = [],
  annotations = [],
  showStudentNames = true,
  showHighlightCount = true,
  onHighlightClick,
  viewMode = 'double'
}: SimplePDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const secondIframeRef = useRef<HTMLIFrameElement>(null);

  // Simulate PDF loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTotalPages(10); // Mock total pages
    }, 1000);

    return () => clearTimeout(timer);
  }, [fileUrl]);

  const goToPreviousPage = () => {
    if (viewMode === 'double') {
      // In double page mode, go back by 2 pages (keep on odd pages)
      if (currentPage > 2) {
        setCurrentPage(currentPage - 2);
      } else {
        setCurrentPage(1);
      }
    } else {
      // In single page mode, go back by 1 page
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const goToNextPage = () => {
    if (viewMode === 'double') {
      // In double page mode, go forward by 2 pages (keep on odd pages)
      if (currentPage + 1 < totalPages) {
        setCurrentPage(currentPage + 2);
      }
    } else {
      // In single page mode, go forward by 1 page
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600 text-sm">Please check the file URL and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-white">
      {/* PDF Content - Full Screen Immersive */}
      <div className="h-full w-full flex justify-center items-center bg-white">
        {viewMode === 'double' ? (
          <div className="flex h-full w-full bg-white" style={{ gap: 0, margin: 0, padding: 0 }}>
            {/* Left Page */}
            <div className="flex-1 bg-white h-full" style={{ margin: 0, padding: 0 }}>
              <iframe
                ref={iframeRef}
                src={`${fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitV`}
                className="w-full h-full"
                style={{
                  pointerEvents: 'none',
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'block',
                }}
                onLoad={() => setLoading(false)}
                onError={() => setError('Failed to load PDF')}
              />
            </div>

            {/* Right Page */}
            {currentPage < totalPages && (
              <div className="flex-1 bg-white h-full" style={{ margin: 0, padding: 0 }}>
                <iframe
                  ref={secondIframeRef}
                  src={`${fileUrl}#page=${currentPage + 1}&toolbar=0&navpanes=0&scrollbar=0&view=FitV`}
                  className="w-full h-full"
                  style={{
                    pointerEvents: 'none',
                    border: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'block',
                  }}
                  onLoad={() => setLoading(false)}
                  onError={() => setError('Failed to load PDF')}
                />
              </div>
            )}
          </div>
        ) : (
          /* Single Page View */
          <div className="bg-white shadow-2xl h-full max-w-[900px] w-full">
            <iframe
              ref={iframeRef}
              src={`${fileUrl}#page=${currentPage}&zoom=${Math.round(scale * 100)}&toolbar=0&navpanes=0&scrollbar=0&view=FitV`}
              className="border-0 w-full h-full"
              onLoad={() => setLoading(false)}
              onError={() => setError('Failed to load PDF')}
            />
          </div>
        )}
      </div>

      {/* Floating Page Navigation - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2 flex items-center gap-3">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-700 font-medium min-w-[100px] text-center">
            {viewMode === 'double' 
              ? `Pages ${currentPage}-${currentPage + 1} / ${totalPages}`
              : `Page ${currentPage} / ${totalPages}`
            }
          </span>
          <button
            onClick={goToNextPage}
            disabled={viewMode === 'double' ? currentPage + 1 >= totalPages : currentPage >= totalPages}
            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Floating Zoom Controls - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-2 flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-700 font-medium min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}