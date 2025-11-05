# Reading Activity Platform

A web application that allows teachers to track student reading progress through highlights and annotations on PDF documents.

## Features

### Teacher Dashboard
- **Lesson Management**: Create, organize, and manage reading lessons in a hierarchical folder structure
- **File Upload**: Support for PDF, DOCX, and TXT files with OCR capability
- **Session Management**: Create and manage classroom sessions with shareable links
- **Multiple View Modes**:
  - **Text View**: Two-page view with student highlights and annotation counts
  - **Annotation View**: Single-page view with detailed annotation panel
  - **Student View**: Individual student progress tracking

### Student Interface
- **Interactive Reading**: Two-page PDF view for natural reading experience
- **Text Highlighting**: Click and drag to highlight important text sections
- **Annotation System**: Add comments and explanations for highlighted text
- **Real-time Feedback**: Receive teacher feedback on annotations

### Key Features
- **Overlap Detection**: Automatically detects when multiple students highlight similar text (60% overlap threshold)
- **Teacher Feedback**: Synchronous feedback system for immediate student guidance
- **Student Interaction**: Optional feature to show other students' highlights and annotations
- **Flexible Configuration**: Customizable reading guidance and help text

## Technology Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Lucide React icons, Radix UI components
- **PDF Handling**: React-PDF with PDF.js
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reading-activity-annotation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Teachers

1. **Create a Lesson**:
   - Click "Create New" in the sidebar
   - Upload a PDF/DOCX/TXT file
   - Configure reading guidance and help text
   - Set display preferences (student names, highlight counts)
   - Enable/disable synchronous feedback and student interaction

2. **Manage Sessions**:
   - Click on a lesson card to view details
   - Create new sessions for different classes
   - Start sessions to begin student participation
   - View student view to test the interface

3. **Monitor Progress**:
   - Use Text View to see all highlights on the document
   - Switch to Annotation View for detailed feedback
   - Use Student View to track individual progress
   - Provide feedback on student annotations

### For Students

1. **Access Reading Material**:
   - Use the shareable link provided by the teacher
   - Navigate through pages using the controls
   - Read the reading guidance in the top-left corner

2. **Highlight and Annotate**:
   - Click and drag to select text for highlighting
   - Add annotations explaining why the text is important
   - Submit annotations for teacher review

## Project Structure

```
app/
├── components/           # React components
│   ├── TeacherDashboard.tsx    # Main teacher interface
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── LessonGrid.tsx          # Lesson cards display
│   ├── CreateLessonForm.tsx    # Lesson creation form
│   ├── LessonDetailSidebar.tsx # Lesson details panel
│   ├── TeacherView.tsx         # Teacher viewing modes
│   ├── PDFViewer.tsx           # PDF rendering component
│   ├── AnnotationPanel.tsx     # Annotation management
│   ├── StudentViewPanel.tsx    # Student progress tracking
│   └── StudentView.tsx         # Student reading interface
├── student/              # Student-specific pages
│   └── page.tsx          # Student reading page
├── layout.tsx            # Root layout
└── page.tsx              # Main teacher dashboard
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **TeacherDashboard**: Main application state management and routing
- **PDFViewer**: Canvas-based PDF rendering with highlight overlay
- **TeacherView**: Multi-mode interface for teachers to review student work
- **StudentView**: Interactive reading interface for students

## Future Enhancements

- **Real PDF Integration**: Replace mock PDF rendering with actual PDF.js implementation
- **Database Integration**: Add persistent storage for lessons, sessions, and annotations
- **Authentication**: Implement user authentication and authorization
- **Real-time Updates**: WebSocket integration for live collaboration
- **Advanced Analytics**: Detailed reporting on student reading patterns
- **Mobile Support**: Responsive design for tablet and mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.