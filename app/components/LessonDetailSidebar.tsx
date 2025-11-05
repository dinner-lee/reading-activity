'use client';

import { useState } from 'react';
import { X, Calendar, Users, ExternalLink, Play, Eye } from 'lucide-react';
import { Lesson, Session } from './TeacherDashboard';
import PDFThumbnail from './PDFThumbnail';

interface LessonDetailSidebarProps {
  lesson: Lesson;
  onClose: () => void;
  onStartSession: (session: Session) => void;
  onUpdateLesson: (lesson: Lesson) => void;
}

export default function LessonDetailSidebar({ lesson, onClose, onStartSession, onUpdateLesson }: LessonDetailSidebarProps) {
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');

  const handleCreateSession = () => {
    if (!newSessionName.trim()) return;
    
    const newSession: Session = {
      id: Date.now().toString(),
      name: newSessionName,
      startDate: new Date(),
      shareLink: `https://reading.annotation/${lesson.id}/session/${Date.now()}`,
      studentCount: 0,
      isActive: false
    };
    
    // Update the lesson with the new session
    const updatedLesson: Lesson = {
      ...lesson,
      sessions: [...lesson.sessions, newSession],
      updatedAt: new Date()
    };
    
    onUpdateLesson(updatedLesson);
    setNewSessionName('');
    setShowSessionForm(false);
  };

  const handleStartSession = (session: Session) => {
    onStartSession(session);
  };

  const handleStudentView = (session: Session) => {
    console.log('Opening student view for session:', session);
    // Open student view in new tab
    window.open(session.shareLink, '_blank');
  };

  return (
    <div className="w-96 bg-white shadow-lg border-l min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Lesson Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lesson Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
          
          {/* Lesson Metadata */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>
              <p className="font-medium">{lesson.createdAt.toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <p className="font-medium">{lesson.updatedAt.toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Sessions:</span>
              <p className="font-medium">{lesson.sessions.length}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Students:</span>
              <p className="font-medium">
                {lesson.sessions.reduce((total, session) => total + session.studentCount, 0)}
              </p>
            </div>
          </div>
          
          {/* Thumbnail */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            {lesson.fileUrl ? (
              <PDFThumbnail
                fileUrl={lesson.fileUrl}
                className="w-full h-full rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-sm">No PDF file</p>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">File:</span> {lesson.fileUrl.split('/').pop() || 'No file'}</p>
              <p><span className="font-medium">Type:</span> PDF Document</p>
              <p><span className="font-medium">Status:</span> Ready for students</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Edit Lesson
            </button>
            <button className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
              Duplicate
            </button>
          </div>
        </div>

        {/* Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Sessions</h4>
            <button
              onClick={() => setShowSessionForm(true)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + New Session
            </button>
          </div>

          {/* New Session Form */}
          {showSessionForm && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Session name (e.g., Class 1-A)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateSession}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowSessionForm(false)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-3">
            {lesson.sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{session.name}</h5>
                  {session.isActive && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Started: {session.startDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{session.studentCount} students</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {session.shareLink.split('/').pop()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleStartSession(session)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Session</span>
                  </button>
                  
                  <button
                    onClick={() => handleStudentView(session)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
                    title="View as Student"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Link</span>
                  </button>
                </div>
              </div>
            ))}

            {lesson.sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No sessions created yet</p>
                <p className="text-xs">Create a session to start the lesson</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
