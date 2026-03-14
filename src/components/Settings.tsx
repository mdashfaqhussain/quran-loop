"use client";

import { useState } from "react";
import { Volume2, Clock, Languages, Moon, Sun, User } from "lucide-react";
import AuthUI from "./AuthUI";

interface SettingsProps {
  settings: {
    autoPlayNext: boolean;
    defaultLoopCount: number;
    defaultSpeed: number;
    showTranslation: boolean;
    theme: 'light' | 'dark';
    audioQuality: 'high' | 'medium' | 'low';
  };
  onSettingsChange: (settings: any) => void;
}

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'display' | 'account'>('general');

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Settings Tabs */}
      <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'general', label: 'General' },
            { key: 'audio', label: 'Audio' },
            { key: 'display', label: 'Display' },
            { key: 'account', label: 'Account' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? 'bg-emerald-DEFAULT text-white'
                  : 'bg-parchment-100 text-ink-muted hover:bg-parchment-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-DEFAULT">Auto-play Next Ayat</p>
                <p className="text-xs text-ink-faint">Automatically load next ayat after completing loops</p>
              </div>
              <button
                onClick={() => updateSetting('autoPlayNext', !settings.autoPlayNext)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.autoPlayNext ? 'bg-emerald-DEFAULT' : 'bg-parchment-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.autoPlayNext ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-DEFAULT">Default Loop Count</p>
                <p className="text-xs text-ink-faint">Number of repetitions for new ayats</p>
              </div>
              <select
                value={settings.defaultLoopCount}
                onChange={(e) => updateSetting('defaultLoopCount', Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-parchment-300 bg-parchment-50 text-ink-DEFAULT text-sm"
              >
                {[1, 3, 5, 7, 10, 15, 20].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Audio Settings */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-DEFAULT">Default Playback Speed</p>
                <p className="text-xs text-ink-faint">Initial speed for new ayats</p>
              </div>
              <select
                value={settings.defaultSpeed}
                onChange={(e) => updateSetting('defaultSpeed', Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-parchment-300 bg-parchment-50 text-ink-DEFAULT text-sm"
              >
                <option value={0.6}>0.6×</option>
                <option value={0.75}>0.75×</option>
                <option value={1}>1×</option>
                <option value={1.25}>1.25×</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-DEFAULT">Audio Quality</p>
                <p className="text-xs text-ink-faint">Higher quality uses more data</p>
              </div>
              <select
                value={settings.audioQuality}
                onChange={(e) => updateSetting('audioQuality', e.target.value)}
                className="px-3 py-2 rounded-lg border border-parchment-300 bg-parchment-50 text-ink-DEFAULT text-sm"
              >
                <option value="low">Low (64kbps)</option>
                <option value="medium">Medium (128kbps)</option>
                <option value="high">High (192kbps)</option>
              </select>
            </div>
          </div>
        )}

        {/* Display Settings */}
        {activeTab === 'display' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-DEFAULT">Show Translation</p>
                <p className="text-xs text-ink-faint">Display English translation</p>
              </div>
              <button
                onClick={() => updateSetting('showTranslation', !settings.showTranslation)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.showTranslation ? 'bg-emerald-DEFAULT' : 'bg-parchment-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.showTranslation ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-DEFAULT">Theme</p>
                <p className="text-xs text-ink-faint">Choose appearance theme</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                    ${settings.theme === 'light'
                      ? 'border-emerald-DEFAULT bg-emerald-DEFAULT text-white'
                      : 'border-parchment-300 bg-parchment-50 text-ink-muted hover:bg-parchment-100'
                    }
                  `}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                    ${settings.theme === 'dark'
                      ? 'border-emerald-DEFAULT bg-emerald-DEFAULT text-white'
                      : 'border-parchment-300 bg-parchment-50 text-ink-muted hover:bg-parchment-100'
                    }
                  `}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account - Sign in / Sync */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary-600" />
              <p className="font-medium text-neutral-800">Account & sync</p>
            </div>
            <p className="text-sm text-neutral-600">
              Sign in to sync your memorized verses and settings across devices.
            </p>
            <AuthUI />
          </div>
        )}
      </div>
    </div>
  );
}
