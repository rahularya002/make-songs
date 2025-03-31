'use client'
import Image from "next/image";
import Link from "next/link";
import { Home, Upload, Music, User } from 'lucide-react';

const menuItems = [
  { icon: Home, label: "Home", href: "/Dashboard" },
  { icon: Upload, label: "Uploads", href: "/Dashboard/uploads" },
  { icon: Music, label: "Your Songs", href: "/Dashboard/your-songs" },
];

export default function AppSidebar() {
  return (
    <div className="h-screen w-64 flex flex-col border-r">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <Image src="/Logo-dark.png" alt="logo" width={100} height={100} />
      </div>
      
      {/* Content */}
      <div className="flex-grow px-4 py-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.href} className="mb-1">
              <Link 
                href={item.href}
                className="flex items-center w-full px-3 py-2 text-sm rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="border-t p-4">
        <nav>
          <div>
            <Link 
              href="/profile"
              className="flex items-center w-full px-3 py-2 text-sm rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}