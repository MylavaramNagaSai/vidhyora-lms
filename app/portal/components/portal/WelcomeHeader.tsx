"use client";
import React from 'react';

interface WelcomeHeaderProps {
  studentName?: string;
}

export default function WelcomeHeader({ studentName = "Student" }: WelcomeHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
        Welcome back, {studentName}.
      </h1>
      <p className="text-slate-500 font-medium text-lg">
        Pick up exactly where you left off in your mastery track.
      </p>
    </div>
  );
}