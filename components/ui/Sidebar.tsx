'use client';

import React from 'react';
import { Music4, PlayCircle, Library, TrendingUp, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  onSignOut: () => void;
}

export function Sidebar({ onSignOut }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-20  shadow-lg flex flex-col items-center py-8 border-r border-gray-400/40">
      <div className="text-red-600 mb-8">
        <Music4 size={32} />
      </div>
      <nav className="flex flex-col space-y-6 flex-1">
        <button className="p-3 text-red-600 h rounded-xl transition-colors">
          <PlayCircle size={24} />
        </button>
        <button className="p-3 text-gray-600  rounded-xl transition-colors">
          <Library size={24} />
        </button>
        <button className="p-3 text-gray-600  rounded-xl transition-colors">
          <TrendingUp size={24} />
        </button>
        <button className="p-3 text-gray-600  rounded-xl transition-colors">
          <Settings size={24} />
        </button>
      </nav>
      <button 
        onClick={onSignOut}
        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-auto"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}