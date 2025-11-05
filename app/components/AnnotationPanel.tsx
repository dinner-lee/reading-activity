'use client';

import { useState } from 'react';
import { MessageSquare, User, Calendar } from 'lucide-react';
import { Highlight, Annotation } from './PDFViewer';

interface AnnotationPanelProps {
  highlights: Highlight[];
  annotations: Annotation[];
  onHighlightSelect: (highlight: Highlight) => void;
}

export default function AnnotationPanel({
  highlights,
  annotations,
  onHighlightSelect
}: AnnotationPanelProps) {
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  const handleHighlightClick = (highlight: Highlight) => {
    setSelectedHighlightId(highlight.id);
    onHighlightSelect(highlight);
  };

  // Group highlights by text similarity (mock implementation)
  const groupedHighlights = highlights.reduce((groups, highlight) => {
    const key = highlight.text.substring(0, 20); // Simple grouping by first 20 chars
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(highlight);
    return groups;
  }, {} as Record<string, Highlight[]>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Annotations
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {highlights.length} highlights, {annotations.length} annotations
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedHighlights).map(([textKey, highlightGroup]) => (
          <div key={textKey} className="border-b">
            <div className="p-4">
              {/* Highlighted Text */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Highlighted Text:</p>
                <div className="bg-yellow-100 p-2 rounded border-l-4 border-yellow-400">
                  <p className="text-sm font-medium">
                    "{highlightGroup[0].text.substring(0, 100)}
                    {highlightGroup[0].text.length > 100 ? '...' : ''}"
                  </p>
                </div>
              </div>

              {/* Student Annotations */}
              <div className="space-y-3">
                {highlightGroup.map(highlight => {
                  const highlightAnnotations = annotations.filter(
                    a => a.highlightId === highlight.id
                  );
                  
                  return (
                    <div key={highlight.id} className="space-y-2">
                      {highlightAnnotations.map(annotation => (
                        <div
                          key={annotation.id}
                          className="bg-gray-50 rounded-lg p-3 border cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleHighlightClick(highlight)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900 text-sm">
                                {annotation.studentName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {annotation.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3">
                            {annotation.text}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                              Feedback
                            </button>
                            <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                              Comment All
                            </button>
                          </div>

                          {/* Teacher Feedback (if exists) */}
                          {annotation.teacherFeedback && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Teacher Feedback:</p>
                              <p className="text-sm text-gray-800 bg-blue-50 p-2 rounded">
                                {annotation.teacherFeedback}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Group Actions */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  Leave Feedback to All Students
                </button>
              </div>
            </div>
          </div>
        ))}

        {highlights.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">No annotations yet</p>
            <p className="text-sm text-center">
              Students need to highlight text and add annotations first
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
