'use client';

import { Plus, Folder, BookOpen } from 'lucide-react';
import { Lesson } from './TeacherDashboard';

interface SidebarProps {
  onCreateNew: () => void;
  lessons: Lesson[];
}

export default function Sidebar({ onCreateNew, lessons }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-4">
        {/* Create New Button */}
        <button
          onClick={onCreateNew}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create New
        </button>

        {/* Folder/Lesson Tree */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            My Lessons
          </h3>
          
          <div className="space-y-1">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="group">
                <div className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium truncate">
                    {lesson.title}
                  </span>
                </div>
                
                {/* Sessions under each lesson */}
                {lesson.sessions.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {lesson.sessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                        <Folder className="h-3 w-3 text-gray-400" />
                        <span className="text-xs truncate">
                          {session.name}
                        </span>
                        {session.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
