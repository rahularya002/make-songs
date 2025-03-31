import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';

const projects = [
  { id: 1, name: "Summer Vibes", duration: "3:45", lastEdited: "2h ago" },
  { id: 2, name: "Night Drive", duration: "4:20", lastEdited: "Yesterday" },
  { id: 3, name: "Acoustic Session", duration: "2:55", lastEdited: "3 days ago" }
];

export function RecentProjects() {
  return (
    <section className="bg-black border border-gray-500/40 rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white-800">Recent Projects</h2>
        <button className="text-primary">View All</button>
      </div>
      <div className="space-y-4">
        {projects.map(project => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-black border border-gray-500/40 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-lg">
                <PlayCircle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white-800">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">{project.lastEdited}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}