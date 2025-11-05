'use client';

import { useState } from 'react';
import { User, MessageSquare, Calendar } from 'lucide-react';
import { Highlight, Annotation } from './PDFViewer';

interface StudentViewPanelProps {
  highlights: Highlight[];
  annotations: Annotation[];
}

export default function StudentViewPanel({
  highlights,
  annotations
}: StudentViewPanelProps) {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Get unique students
  const students = Array.from(
    new Set(highlights.map(h => h.studentId))
  ).map(studentId => {
    const studentHighlights = highlights.filter(h => h.studentId === studentId);
    const studentAnnotations = annotations.filter(a => a.studentId === studentId);
    return {
      id: studentId,
      name: studentHighlights[0]?.studentName || 'Unknown Student',
      highlightCount: studentHighlights.length,
      annotationCount: studentAnnotations.length,
      highlights: studentHighlights,
      annotations: studentAnnotations
    };
  });

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className="h-full flex">
      {/* Student List */}
      <div className="w-80 bg-white border-r">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Students</h3>
          <p className="text-sm text-gray-600">{students.length} students</p>
        </div>
        
        <div className="overflow-y-auto">
          {students.map(student => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student.id)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedStudent === student.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span>{student.highlightCount} highlights</span>
                    <span>{student.annotationCount} annotations</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Details */}
      <div className="flex-1 bg-gray-50">
        {selectedStudentData ? (
          <div className="h-full flex flex-col">
            <div className="p-6 bg-white border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedStudentData.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedStudentData.highlightCount} highlights • {selectedStudentData.annotationCount} annotations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {selectedStudentData.annotations.map((annotation, index) => {
                  const highlight = selectedStudentData.highlights.find(
                    h => h.id === annotation.highlightId
                  );
                  
                  return (
                    <div key={annotation.id} className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">Annotation #{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{annotation.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Highlighted Text */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Highlighted Text:</p>
                        <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-400">
                          <p className="text-sm font-medium">
                            "{highlight?.text || 'Text not found'}"
                          </p>
                        </div>
                      </div>

                      {/* Student Annotation */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Student's Annotation:</p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-800">{annotation.text}</p>
                        </div>
                      </div>

                      {/* Teacher Feedback */}
                      {annotation.teacherFeedback ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Teacher Feedback:</p>
                          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            <p className="text-sm text-gray-800">{annotation.teacherFeedback}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No teacher feedback yet</p>
                          <button className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Add Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {selectedStudentData.annotations.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No annotations yet</p>
                    <p className="text-sm text-gray-600">
                      {selectedStudentData.name} hasn't added any annotations yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Select a student</p>
              <p className="text-sm">Choose a student from the list to view their annotations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
