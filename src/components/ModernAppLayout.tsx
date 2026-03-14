"use client";

import { useState } from "react";
import {
  PlayIcon,
  CheckCircleIcon,
  BookOpenIcon,
  SettingsIcon,
  HomeIcon,
  MenuIcon,
  XIcon,
  ChevronRightIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";

interface ModernAppLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  {
    id: "player",
    label: "Quran Player",
    icon: PlayIcon,
    description: "Memorize and recite",
    color: "primary",
  },
  {
    id: "progress",
    label: "Progress",
    icon: CheckCircleIcon,
    description: "Track your journey",
    color: "success",
  },
  {
    id: "library",
    label: "Library",
    icon: BookOpenIcon,
    description: "Browse all surahs",
    color: "accent",
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    description: "Customize experience",
    color: "secondary",
  },
];

export default function ModernAppLayout({
  children,
  activeSection,
  onSectionChange,
}: ModernAppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  const currentNavigation = navigationItems.find(
    (item) => item.id === activeSection,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-medium hover:shadow-large transition-all duration-200"
      >
        {isMobileMenuOpen ? (
          <XIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-72" : "w-20"}
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-full bg-white border-r border-neutral-200 shadow-medium flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-neutral-100 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpenIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-2 h-2 text-white" />
                </div>
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-neutral-900 truncate">
                    Quran Player
                  </h1>
                  <p className="text-sm text-neutral-500 truncate">
                    Memorization Journey
                  </p>
                </div>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mt-4 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all duration-200 flex-shrink-0"
            >
              <ChevronRightIcon
                className={`w-4 h-4 transition-transform duration-200 ${!isSidebarOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2 flex-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`
                    w-full group relative overflow-hidden rounded-xl transition-all duration-200 text-left
                    ${
                      isActive
                        ? "bg-primary-50 text-primary-700 shadow-soft border border-primary-200"
                        : "hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900"
                    }
                  `}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className={`
                      relative z-10 p-2 rounded-lg transition-all duration-200 flex-shrink-0
                      ${
                        isActive
                          ? "bg-primary-500 text-white shadow-glow"
                          : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                      }
                    `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {isSidebarOpen && (
                      <div className="flex-1 text-left relative z-10 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {item.label}
                        </div>
                        <div className="text-xs opacity-70 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}

                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          {isSidebarOpen && (
            <div className="p-4 border-t border-neutral-100 flex-shrink-0">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUpIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-primary-900">
                    Your Progress
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Current Streak</span>
                    <span className="font-semibold text-primary-700">
                      7 days
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${isSidebarOpen ? "lg:ml-0" : "lg:ml-0"}`}
      >
        {/* Top Bar */}
        <div className="bg-white border-b border-neutral-200 shadow-soft flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    {currentNavigation && (
                      <currentNavigation.icon className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {currentNavigation?.label}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {currentNavigation?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                  <span className="text-sm text-neutral-600">Online</span>
                </div>
                <div className="text-sm text-neutral-500">Version 1.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-neutral-50">
          <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</div>
        </div>
      </div>
    </div>
  );
}
