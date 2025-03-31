import React from 'react';
import { PlusCircle, Mic2, Library, Share2 } from 'lucide-react';

const actions = [
  { icon: <PlusCircle size={20} />, label: "New Project" },
  { icon: <Mic2 size={20} />, label: "Record" },
  { icon: <Library size={20} />, label: "Samples" },
  { icon: <Share2 size={20} />, label: "Share" }
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <button
          key={index}
          className="flex items-center space-x-3 bg-black border border-gray-500/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-primary">{action.icon}</span>
          <span className="text-white-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
}