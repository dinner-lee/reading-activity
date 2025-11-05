'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import SimplePDFViewer from './SimplePDFViewer';

interface StudentViewProps {
  lessonTitle: string;
  readingGuidance: string;
  fileUrl: string;
  helpText: string;
  onAnnotationSubmit: (highlight: string, annotation: string) => void;
}

export default function StudentView({
  lessonTitle,
  readingGuidance,
  fileUrl,
  helpText,
  onAnnotationSubmit
}: StudentViewProps) {
  const [highlights, setHighlights] = useState<Array<{
    id: string;
    text: string;
    coordinates: { x: number; y: number; width: number; height: number };
    pageNumber: number;
  }>>([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [annotationText, setAnnotationText] = useState('');

  const handleHighlightClick = (highlight: any) => {
    setSelectedText(highlight.text);
    setShowAnnotationModal(true);
  };

  const handleAnnotationSubmit = () => {
    if (!annotationText.trim()) return;

    onAnnotationSubmit(selectedText, annotationText);
    
    setAnnotationText('');
    setSelectedText('');
    setShowAnnotationModal(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{lessonTitle}</h1>
          
          {/* Reading Guidance */}
          <div className="bg-blue-50 p-3 rounded-lg max-w-md">
            <p className="text-sm text-blue-800">
              <strong>Reading Activity:</strong> {readingGuidance}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1">
        <SimplePDFViewer
          fileUrl={fileUrl}
          highlights={highlights}
          annotations={[]}
          showStudentNames={false}
          showHighlightCount={false}
          onHighlightClick={handleHighlightClick}
          viewMode="double"
        />
      </div>

      {/* Annotation Modal */}
      {showAnnotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Annotation
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Selected Text:</p>
                <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-400">
                  <p className="text-sm font-medium">"{selectedText}"</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Annotation:
                </label>
                <textarea
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={helpText}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAnnotationModal(false);
                    setAnnotationText('');
                    setSelectedText('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnnotationSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
