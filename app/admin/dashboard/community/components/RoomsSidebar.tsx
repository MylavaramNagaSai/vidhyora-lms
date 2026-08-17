"use client";
import React from 'react';

interface RoomsSidebarProps {
  activeRoomId: string;
  setActiveRoomId: (id: string) => void;
  availableRooms: any[];
}

export default function RoomsSidebar({ activeRoomId, setActiveRoomId, availableRooms }: RoomsSidebarProps) {
  return (
    <div className="space-y-4 sticky top-6">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 pl-2">Discussion Rooms</h3>
      <div className="space-y-1">
        <button 
          onClick={() => setActiveRoomId("global")}
          className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all ${activeRoomId === 'global' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-transparent text-slate-600 hover:bg-white hover:shadow-sm'}`}
        >
          🌐 Global Community
        </button>
        {availableRooms.map(room => (
          <button 
            key={room.id}
            onClick={() => setActiveRoomId(room.id)}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all truncate ${activeRoomId === room.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-transparent text-slate-600 hover:bg-white hover:shadow-sm'}`}
          >
            # {room.name || room.title}
          </button>
        ))}
      </div>
    </div>
  );
}