"use client"
import React from 'react';
import { Headphones, FileText, MessageSquare, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { QuickActions } from './QuickActions';
import { UploadSection } from './UploadSection';
import { RecentProjects } from './RecentProjects';
import { Stats } from './Stats';

export function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error("Sign out error:", error);
      router.push('/');
    }
  };

  // Get user's name from session or use default
  const userName = session?.user?.name || 'Artist';

  return (
    <div className="min-h-screen">
      <Sidebar onSignOut={handleSignOut} />
      {/* Main Content */}
      <div className="ml-20 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white-800">Welcome back, {userName}!</h1>
            <p className="text-white-600">Continue where you left off</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-black/90 border border-gray-500/40 text-white rounded-lg shadow-sm transition-colors"
          >
            <LogOut size={20} className='text-primary' />
            <span>Sign Out</span>
          </button>
        </header>
        <QuickActions />
        {/* Upload Sections */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <UploadSection
            title="Voice Upload"
            icon={<Headphones size={24} />}
            acceptedFiles=".mp3,.wav,.m4a"
            description="Upload your voice recordings in high quality audio formats"
            uploadType="voice"
          />
          <UploadSection
            title="Lyrics Upload"
            icon={<FileText size={24} />}
            acceptedFiles=".txt,.doc,.docx"
            description="Share your lyrics in text format"
            uploadType="lyrics"
          />
          <UploadSection
            title="Dialogue Upload"
            icon={<MessageSquare size={24} />}
            acceptedFiles=".mp3,.wav,.m4a"
            description="Upload dialogue recordings for your project"
            uploadType="dialogue"
          />
        </div>
        <RecentProjects />
        <Stats />
      </div>
    </div>
  );
}