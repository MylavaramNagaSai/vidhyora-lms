"use client";
import React from 'react';
import Link from 'next/link';

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

interface ActiveCourseCardProps {
  course: any;
  isFirst: boolean;
}

export default function ActiveCourseCard({ course, isFirst }: ActiveCourseCardProps) {
  return (
    <Link href={`/portal/course/${course.id}`} className="block bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        
        {/* Thumbnail Area */}
        <div className="w-full sm:w-72 aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shrink-0 shadow-inner group-hover:shadow-md transition-shadow">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.name} className="object-cover w-full h-full opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900"></div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-blue-500 transition-transform duration-300">
              <PlayIcon />
            </div>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg">
            {course.totalVideos || (course.videos?.length || 0)} VIDEOS
          </div>
        </div>

        {/* Course Details Area */}
        <div className="flex-1 w-full py-2">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg mb-3 inline-block border border-blue-100/50">
            {isFirst ? 'In Progress' : 'Available'}
          </span>
          
          <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {course.name}
          </h3>
          
          <div className="flex gap-5 text-xs font-bold text-slate-500 mb-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              {course.chapters || 0} Chapters
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {course.days || 0} Days
            </span>
          </div>

          {/* Progress Bar Placeholder */}
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            <span>0% Completed</span>
            <span>0 / {course.days || 0} Days</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

      </div>
    </Link>
  );
}