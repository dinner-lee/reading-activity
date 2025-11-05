'use client';

import { useState } from 'react';
import { User, LogOut, Plus, Folder, BookOpen } from 'lucide-react';
import Sidebar from './Sidebar';
import LessonGrid from './LessonGrid';
import CreateLessonForm from './CreateLessonForm';
import LessonDetailSidebar from './LessonDetailSidebar';
import TeacherView from './TeacherView';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: Session[];
}

export interface Session {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  shareLink: string;
  studentCount: number;
  isActive: boolean;
}

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Backpropagation Algorithm Study',
      description: 'Students will analyze the mathematical foundations and implementation details of backpropagation in neural networks',
      fileUrl: '/backprop.pdf',
      thumbnailUrl: '/pdf-thumbnail.png',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      sessions: [
        {
          id: 's1',
          name: 'Machine Learning Class A',
          startDate: new Date('2024-01-20'),
          shareLink: 'https://reading.annotation/backprop_lesson/session/s1',
          studentCount: 18,
          isActive: true
        },
        {
          id: 's2',
          name: 'Machine Learning Class B',
          startDate: new Date('2024-01-22'),
          shareLink: 'https://reading.annotation/backprop_lesson/session/s2',
          studentCount: 15,
          isActive: false
        }
      ]
    }
  ]);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [showTeacherView, setShowTeacherView] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const handleCreateLesson = (lessonData: Partial<Lesson>) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: lessonData.title || 'Untitled Lesson',
      description: lessonData.description || '',
      fileUrl: lessonData.fileUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      sessions: []
    };
    setLessons(prev => [...prev, newLesson]);
    setShowCreateForm(false);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowDetailSidebar(true);
  };

  const handleStartSession = (lesson: Lesson, session: Session) => {
    setSelectedLesson(lesson);
    setCurrentSession(session);
    setShowTeacherView(true);
    setShowDetailSidebar(false);
  };

  const handleBackToDashboard = () => {
    setShowTeacherView(false);
    setCurrentSession(null);
    setSelectedLesson(null);
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    ));
    setSelectedLesson(updatedLesson);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show when NOT in TeacherView */}
      {!showTeacherView && (
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Reading Activity Platform
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-5 w-5" />
                <span>My Account</span>
              </div>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {showTeacherView && selectedLesson && currentSession ? (
        <TeacherView
          lessonTitle={selectedLesson.title}
          readingGuidance="Analyze the mathematical foundations of backpropagation. Highlight key concepts like gradient descent, chain rule, and loss functions. Explain how these concepts work together in neural network training."
          fileUrl={selectedLesson.fileUrl}
          highlights={[]}
          annotations={[]}
          showStudentNames={true}
          showHighlightCount={true}
          onBack={handleBackToDashboard}
        />
      ) : (
        <div className="flex">
          {/* Left Sidebar */}
          <Sidebar 
            onCreateNew={() => setShowCreateForm(true)}
            lessons={lessons}
          />

          {/* Main Content */}
          <main className="flex-1 p-6">
            {showCreateForm ? (
              <CreateLessonForm 
                onSave={handleCreateLesson}
                onCancel={() => setShowCreateForm(false)}
              />
            ) : (
              <LessonGrid 
                lessons={lessons}
                onLessonClick={handleLessonClick}
              />
            )}
          </main>

          {/* Right Detail Sidebar */}
          {showDetailSidebar && selectedLesson && (
            <LessonDetailSidebar
              lesson={selectedLesson}
              onClose={() => setShowDetailSidebar(false)}
              onStartSession={(session: Session) => handleStartSession(selectedLesson, session)}
              onUpdateLesson={handleUpdateLesson}
            />
          )}
        </div>
      )}
    </div>
  );
}
