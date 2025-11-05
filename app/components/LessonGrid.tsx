'use client';

import { BookOpen, Calendar, Users } from 'lucide-react';
import { Lesson } from './TeacherDashboard';
import PDFThumbnail from './PDFThumbnail';

interface LessonGridProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
}

export default function LessonGrid({ lessons, onLessonClick }: LessonGridProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Lessons</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => onLessonClick(lesson)}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
              {lesson.fileUrl ? (
                <PDFThumbnail
                  fileUrl={lesson.fileUrl}
                  className="w-full h-full rounded-t-lg"
                />
              ) : (
                <BookOpen className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {lesson.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {lesson.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {lesson.updatedAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {lesson.sessions.reduce((total, session) => total + session.studentCount, 0)} students
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {lessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
          <p className="text-gray-600">Create your first lesson to get started</p>
        </div>
      )}
    </div>
  );
}
