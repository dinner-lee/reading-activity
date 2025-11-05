'use client';

import { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export default function FileUpload({ 
  onFileSelect, 
  acceptedTypes = ['.pdf', '.docx', '.txt'],
  maxSize = 10 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type ${fileExtension} is not supported`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setUploadedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📁';
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-green-800">File Uploaded Successfully!</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-700">
                <span className="text-lg">{getFileIcon(uploadedFile.name)}</span>
                <span className="font-medium">{uploadedFile.name}</span>
                <span className="text-gray-500">({formatFileSize(uploadedFile.size)})</span>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Remove File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? 'Drop your file here' : 'Upload Reading Material'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop your file here, or click to browse
              </p>
            </div>
            <div className="text-xs text-gray-400">
              <p>Supported formats: {acceptedTypes.join(', ')}</p>
              <p>Maximum file size: {maxSize}MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <X className="h-4 w-4" />
            <span className="text-sm font-medium">{uploadError}</span>
          </div>
        </div>
      )}

      {/* File Preview */}
      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getFileIcon(uploadedFile.name)}</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
              <p className="text-sm text-gray-600">
                {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <File className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
