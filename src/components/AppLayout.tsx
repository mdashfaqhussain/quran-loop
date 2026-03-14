"use client";

import { useState } from "react";
import { 
  BookOpenIcon, 
  PlayIcon, 
  CheckCircleIcon, 
  SettingsIcon,
  HomeIcon 
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'player', label: 'Player', icon: PlayIcon },
  { id: 'progress', label: 'Progress', icon: CheckCircleIcon },
  { id: 'library', label: 'Library', icon: BookOpenIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function AppLayout({ children, activeSection, onSectionChange }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-parchment-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-parchment-200 shadow-sm`}>
        <div className="p-4">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-2xl">📖</div>
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-ink-DEFAULT text-lg">Quran Player</h1>
                <p className="text-xs text-ink-fant">Memorization Tool</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${activeSection === item.id 
                      ? 'bg-emerald-DEFAULT text-white shadow-sm' 
                      : 'text-ink-muted hover:bg-parchment-100 hover:text-ink-DEFAULT'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 -right-3 w-6 h-6 bg-emerald-DEFAULT text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700 transition-all"
        >
          <span className="text-xs">
            {isSidebarOpen ? '◀' : '▶'}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-parchment-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5 text-ink-muted" />
              <span className="font-semibold text-ink-DEFAULT">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </span>
            </div>
            <div className="text-sm text-ink-faint">
              Quran Loop Player v1.0
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
