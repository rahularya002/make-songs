import React from 'react';

export function Stats() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-black border border-gray-500/40 p-6 rounded-2xl shadow-sm">
        <h3 className="text-white-500 mb-2">Total Projects</h3>
        <p className="text-3xl font-bold text-white-800">24</p>
      </div>
      <div className="bg-black border border-gray-500/40  p-6 rounded-2xl shadow-sm">
        <h3 className="text-white-500 mb-2">Hours Recorded</h3>
        <p className="text-3xl font-bold text-white-800">156</p>
      </div>
      <div className="bg-black border border-gray-500/40 p-6 rounded-2xl shadow-sm">
        <h3 className="text-white-500 mb-2">Collaborators</h3>
        <p className="text-3xl font-bold text-white-800">12</p>
      </div>
    </div>
  );
}