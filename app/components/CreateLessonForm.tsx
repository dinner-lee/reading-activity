'use client';

import { useState } from 'react';
import { Upload, X, Eye, Settings } from 'lucide-react';
import { Lesson } from './TeacherDashboard';
import PDFUpload from './PDFUpload';

interface CreateLessonFormProps {
  onSave: (lessonData: Partial<Lesson>) => void;
  onCancel: () => void;
}

export default function CreateLessonForm({ onSave, onCancel }: CreateLessonFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessonLink: '',
    readingGuidance: '',
    helpText: '',
    showStudentNames: true,
    showHighlightCount: true,
    synchronousFeedback: false,
    studentInteraction: false,
    file: null as File | null
  });

  const [preview, setPreview] = useState<{
    thumbnail: string | null;
    title: string;
    description: string;
  }>({
    thumbnail: null,
    title: '',
    description: ''
  });

  const handleFileUpload = (file: File, fileUrl: string) => {
    setFormData(prev => ({ ...prev, file }));
    
    // Create thumbnail preview for PDF files
    setPreview(prev => ({ ...prev, thumbnail: '/pdf-thumbnail.png' }));
  };

  const handleSave = () => {
    onSave({
      title: formData.title,
      description: formData.description,
      fileUrl: formData.file ? URL.createObjectURL(formData.file) : ''
    });
  };

  return (
    <div className="flex gap-6">
      {/* Form Section */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Lesson</h2>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Link
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://reading.annotation/
              </span>
              <input
                type="text"
                value={formData.lessonLink}
                onChange={(e) => setFormData(prev => ({ ...prev, lessonLink: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="literary_lesson_one"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload PDF Reading Material
            </label>
            <PDFUpload
              onFileSelect={handleFileUpload}
              maxSize={10}
            />
            {formData.file && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">
                  ✓ {formData.file.name} uploaded successfully
                </p>
                <p className="text-xs text-green-500 mt-1">
                  PDF ready for student highlighting and annotation
                </p>
              </div>
            )}
          </div>

          {/* Reading Guidance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reading Activity Guidance
            </label>
            <textarea
              value={formData.readingGuidance}
              onChange={(e) => setFormData(prev => ({ ...prev, readingGuidance: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Highlight the important parts of the text and explain why you think they're important"
            />
          </div>

          {/* Help Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Annotation Help Text
            </label>
            <textarea
              value={formData.helpText}
              onChange={(e) => setFormData(prev => ({ ...prev, helpText: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Guidance text that will appear in the student annotation input form"
            />
          </div>

          {/* Additional Configuration */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Additional Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show student names on annotations
                  </label>
                  <p className="text-xs text-gray-500">
                    Display individual student names next to their annotations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showStudentNames}
                  onChange={(e) => setFormData(prev => ({ ...prev, showStudentNames: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show highlight count
                  </label>
                  <p className="text-xs text-gray-500">
                    Display number of students who highlighted each section
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showHighlightCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, showHighlightCount: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Synchronous feedback
                  </label>
                  <p className="text-xs text-gray-500">
                    Deliver teacher feedback to students immediately
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.synchronousFeedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, synchronousFeedback: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Student interaction display
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow students to see other students' highlights and annotations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.studentInteraction}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentInteraction: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Lesson
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-80 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview
        </h3>
        
        <div className="space-y-4">
          {/* Thumbnail Preview */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {preview.thumbnail ? (
              <img
                src={preview.thumbnail}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Upload file to see preview</p>
              </div>
            )}
          </div>
          
          {/* Title Preview */}
          <div>
            <h4 className="font-semibold text-gray-900">
              {formData.title || 'Untitled Lesson'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {formData.description || 'No description provided'}
            </p>
          </div>
          
          {/* Reading Guidance Preview */}
          {formData.readingGuidance && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Reading Activity:</strong> {formData.readingGuidance}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
