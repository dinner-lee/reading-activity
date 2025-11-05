'use client';

import { useState } from 'react';
import { FileText, MessageSquare, Users, ArrowLeft } from 'lucide-react';
import SimplePDFViewer, { Highlight, Annotation } from './SimplePDFViewer';
import AnnotationPanel from './AnnotationPanel';
import StudentViewPanel from './StudentViewPanel';

interface TeacherViewProps {
  lessonTitle: string;
  readingGuidance: string;
  fileUrl: string;
  highlights: Highlight[];
  annotations: Annotation[];
  showStudentNames: boolean;
  showHighlightCount: boolean;
  onBack: () => void;
}

type ViewMode = 'text' | 'annotation' | 'student';

export default function TeacherView({
  lessonTitle,
  readingGuidance,
  fileUrl,
  highlights,
  annotations,
  showStudentNames,
  showHighlightCount,
  onBack
}: TeacherViewProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('text');
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);

  const handleHighlightClick = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    if (currentView === 'text') {
      // Show annotation popup for text view
    }
  };

  const mockHighlights: Highlight[] = [
    {
      id: '1',
      text: 'backpropagation algorithm',
      pageNumber: 1,
      coordinates: { x: 50, y: 120, width: 200, height: 20 },
      studentId: 's1',
      studentName: 'Alice Chen',
      color: '#ffeb3b',
      opacity: 0.6
    },
    {
      id: '2',
      text: 'gradient descent',
      pageNumber: 1,
      coordinates: { x: 300, y: 150, width: 150, height: 20 },
      studentId: 's2',
      studentName: 'Bob Rodriguez',
      color: '#4caf50',
      opacity: 0.6
    },
    {
      id: '3',
      text: 'neural network',
      pageNumber: 1,
      coordinates: { x: 100, y: 200, width: 120, height: 20 },
      studentId: 's3',
      studentName: 'Carol Kim',
      color: '#2196f3',
      opacity: 0.6
    },
    {
      id: '4',
      text: 'chain rule',
      pageNumber: 2,
      coordinates: { x: 80, y: 100, width: 100, height: 20 },
      studentId: 's1',
      studentName: 'Alice Chen',
      color: '#ffeb3b',
      opacity: 0.6
    },
    {
      id: '5',
      text: 'loss function',
      pageNumber: 2,
      coordinates: { x: 250, y: 180, width: 120, height: 20 },
      studentId: 's4',
      studentName: 'David Park',
      color: '#ff9800',
      opacity: 0.6
    },
    {
      id: '6',
      text: 'derivative',
      pageNumber: 3,
      coordinates: { x: 150, y: 140, width: 100, height: 20 },
      studentId: 's2',
      studentName: 'Bob Rodriguez',
      color: '#4caf50',
      opacity: 0.6
    }
  ];

  const mockAnnotations: Annotation[] = [
    {
      id: 'a1',
      highlightId: '1',
      studentId: 's1',
      studentName: 'Alice Chen',
      text: 'This is the core algorithm that makes deep learning possible. I find it fascinating how it efficiently computes gradients through the entire network.',
      createdAt: new Date('2024-01-20T10:30:00')
    },
    {
      id: 'a2',
      highlightId: '2',
      studentId: 's2',
      studentName: 'Bob Rodriguez',
      text: 'Gradient descent is the optimization method that backpropagation uses to update weights. The learning rate is crucial here.',
      createdAt: new Date('2024-01-20T11:15:00')
    },
    {
      id: 'a3',
      highlightId: '3',
      studentId: 's3',
      studentName: 'Carol Kim',
      text: 'Neural networks are inspired by biological neurons. The connection between biological and artificial networks is really interesting.',
      createdAt: new Date('2024-01-20T12:00:00')
    },
    {
      id: 'a4',
      highlightId: '4',
      studentId: 's1',
      studentName: 'Alice Chen',
      text: 'The chain rule from calculus is fundamental to backpropagation. It allows us to compute gradients layer by layer.',
      createdAt: new Date('2024-01-20T14:20:00')
    },
    {
      id: 'a5',
      highlightId: '5',
      studentId: 's4',
      studentName: 'David Park',
      text: 'The loss function measures how far our predictions are from the actual values. Different loss functions are used for different tasks.',
      createdAt: new Date('2024-01-20T15:45:00')
    },
    {
      id: 'a6',
      highlightId: '6',
      studentId: 's2',
      studentName: 'Bob Rodriguez',
      text: 'Derivatives tell us the rate of change. In neural networks, they tell us how much each weight contributes to the error.',
      createdAt: new Date('2024-01-20T16:30:00')
    }
  ];

  return (
    <div className="h-screen flex bg-white relative">
      {/* Main PDF Viewer - Full Screen with 2-page view */}
      <div className="flex-1 relative">
        {currentView === 'text' && (
          <SimplePDFViewer
            fileUrl={fileUrl}
            highlights={mockHighlights}
            annotations={mockAnnotations}
            showStudentNames={showStudentNames}
            showHighlightCount={showHighlightCount}
            onHighlightClick={handleHighlightClick}
            viewMode="double"
          />
        )}

        {currentView === 'annotation' && (
          <div className="flex h-full">
            <div className="flex-1">
              <SimplePDFViewer
                fileUrl={fileUrl}
                highlights={mockHighlights}
                annotations={mockAnnotations}
                showStudentNames={showStudentNames}
                showHighlightCount={showHighlightCount}
                onHighlightClick={handleHighlightClick}
                viewMode="double"
              />
            </div>
            <div className="w-96 border-l bg-white">
              <AnnotationPanel
                highlights={mockHighlights}
                annotations={mockAnnotations}
                onHighlightSelect={setSelectedHighlight}
              />
            </div>
          </div>
        )}

        {currentView === 'student' && (
          <div className="w-full h-full bg-gray-50">
            <StudentViewPanel
              highlights={mockHighlights}
              annotations={mockAnnotations}
            />
          </div>
        )}

        {/* Floating Header - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={onBack}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">{lessonTitle}</h1>
            </div>
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Reading Activity:</strong> {readingGuidance}
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Buttons - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCurrentView('text')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentView === 'text'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4" />
                Text View
              </button>
              <button
                onClick={() => setCurrentView('annotation')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentView === 'annotation'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Annotation View
              </button>
              <button
                onClick={() => setCurrentView('student')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentView === 'student'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                Student View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Annotation Popup */}
      {selectedHighlight && currentView === 'text' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Highlight Details
                </h3>
                <button
                  onClick={() => setSelectedHighlight(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Highlighted Text:</p>
                <p className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-400">
                  "{selectedHighlight.text}"
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Student Annotations:</h4>
                {mockAnnotations
                  .filter(a => a.highlightId === selectedHighlight.id)
                  .map(annotation => (
                    <div key={annotation.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {annotation.studentName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {annotation.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{annotation.text}</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          Leave Feedback
                        </button>
                        <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                          Leave Comment to All
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
