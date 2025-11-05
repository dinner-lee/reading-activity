'use client';

import StudentView from '../components/StudentView';

export default function StudentPage() {
  const handleAnnotationSubmit = (highlight: string, annotation: string) => {
    console.log('Student annotation submitted:', { highlight, annotation });
    // In a real app, this would send the annotation to the server
  };

  return (
    <StudentView
      lessonTitle="Backpropagation Algorithm Study"
      readingGuidance="Analyze the mathematical foundations of backpropagation. Highlight key concepts like gradient descent, chain rule, and loss functions. Explain how these concepts work together in neural network training."
      fileUrl="/backprop.pdf"
      helpText="Explain the mathematical concept and its role in neural network training. Consider how it relates to optimization and learning."
      onAnnotationSubmit={handleAnnotationSubmit}
    />
  );
}
