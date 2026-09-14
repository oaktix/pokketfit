'use client';

import React, { useState } from 'react';
import MobileShell from '@/components/layout/MobileShell';
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Check, 
  Wifi, 
  FileText,
  Bell,
  Loader2,
  LogOut
} from 'lucide-react';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { getBMILabel } from '@/lib/engine/bmi';
import { registerPushSubscription } from '@/lib/notifications/push-client';
import { TactileButton } from '@/components/motion/MotionPrimitives';

import { useAuth } from '@/components/auth/AuthProvider';
import { useTheme } from '@/components/theme/ThemeProvider';
import { playNotificationSound } from '@/lib/notifications/sound';
import InstallSettingsButton from '@/components/mobile/InstallSettingsButton';

export default function ProfilePage() {
  const [store, setStore] = useState(getLocalStore());
  const { currentUser, offlineQueue } = store;
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const [wakeUpTime, setWakeUpTime] = useState(currentUser.wakeUpTime);
  const [sleepTime, setSleepTime] = useState(currentUser.sleepTime);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pushStatus, setPushStatus] = useState<'idle' | 'loading' | 'enabled' | 'error'>('idle');
  const [pushMessage, setPushMessage] = useState('');

  const handleEnablePush = async () => {
    setPushStatus('loading');
    setPushMessage('');
    const res = await registerPushSubscription(currentUser.id);
    if (res.success) {
      playNotificationSound();
      setPushStatus('enabled');
      setPushMessage('Web Push notifications enabled for this device!');
    } else {
      setPushStatus('error');
      setPushMessage(res.error || 'Failed to enable push notifications.');
    }
  };

  const handleSaveTimes = () => {
    const updatedUser = {
      ...currentUser,
      wakeUpTime,
      sleepTime,
    };
    const updatedStore = { ...store, currentUser: updatedUser };
    setStore(updatedStore);
    saveLocalStore(updatedStore);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pokketfit_data_export_${currentUser.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to delete your local profile and reset all records?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Profile Card Header (Matching Mockup 3ce028c7d69cd2a286623018e8e9d41e.webp) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#E37210] p-0.5">
            <div className="w-full h-full rounded-full bg-[#110D0A] flex items-center justify-center text-xl font-extrabold text-white">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{currentUser.name}</h2>
            <div className="text-xs text-[#8A8279]">{currentUser.email}</div>
            <div className="text-[11px] text-[#E37210] font-semibold mt-1">
              {currentUser.rankTitle}
            </div>
          </div>
        </div>

        {/* Appearance & Theme Mode (Dark, Light, System) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Appearance & Theme</h3>
            <span className="text-[10px] text-[#E37210] font-bold uppercase tracking-wider bg-[#E37210]/15 px-2.5 py-0.5 rounded-full">
              {theme}
            </span>
          </div>
          <p className="text-xs text-[#8A8279]">
            Select your preferred visual mode or match your device's system settings automatically.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setTheme('dark')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#E37210] text-white'
                  : 'bg-[#1E1914] text-[#8A8279] border border-[#2A241E] hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                theme === 'light'
                  ? 'bg-[#E37210] text-white'
                  : 'bg-[#1E1914] text-[#8A8279] border border-[#2A241E] hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                theme === 'system'
                  ? 'bg-[#E37210] text-white'
                  : 'bg-[#1E1914] text-[#8A8279] border border-[#2A241E] hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Schedule & Sleep Windows (PRD Section 20) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Sleep & Reminder Schedule</h3>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" /> Saved
              </span>
            )}
          </div>
          <p className="text-xs text-[#8A8279]">
            Pokketfit respects your sleep window and suppresses all notifications between bedtime and wake-up.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs text-[#C7BFB5] block mb-1">Wake-up Time</label>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-[#C7BFB5] block mb-1">Bedtime (Sleep Hours)</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            onClick={handleSaveTimes}
            className="w-full py-2.5 rounded-xl bg-[#1E1914] hover:bg-[#2A241E] border border-[#2A241E] text-xs font-bold text-[#FAF8F5] active:scale-95 transition-colors"
          >
            Update Schedule
          </button>
        </div>

        {/* Web Push Notifications (PRD Section 18 & 24) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#E37210]" />
              <h3 className="text-sm font-bold text-white">Web Push Reminders</h3>
            </div>
            {pushStatus === 'enabled' && (
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full font-semibold flex items-center">
                <Check className="w-3 h-3 mr-1" /> Active
              </span>
            )}
          </div>
          <p className="text-xs text-[#8A8279]">
            Receive real-time 30-minute habit reminders for workouts, hydration, meals, and streaks on this device.
          </p>

          {pushMessage && (
            <div className={`p-2.5 rounded-xl text-xs ${
              pushStatus === 'enabled' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
            }`}>
              {pushMessage}
            </div>
          )}

          {pushStatus !== 'enabled' && (
            <TactileButton
              onClick={handleEnablePush}
              disabled={pushStatus === 'loading'}
              className="w-full py-2.5 rounded-xl bg-[#E37210] hover:bg-[#F2801E] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-2"
            >
              {pushStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable Push Reminders on This Device</span>
                </>
              )}
            </TactileButton>
          )}
        </div>

        {/* Offline & Sync Status (PRD Section 28 & 45) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Offline Sync Queue</h3>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full font-semibold">
              {offlineQueue.length} Pending
            </span>
          </div>
          <p className="text-xs text-[#8A8279]">
            All workouts and habit updates are timestamped with unique operation IDs and queued when offline.
          </p>
        </div>

        {/* Install PWA Option */}
        <InstallSettingsButton />

        {/* Account & Privacy Compliance (PRD Section 4, 32 & 35) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Privacy & Account Control</h3>
          <p className="text-xs text-[#8A8279]">
            Under NDPR and GDPR principles, you maintain full sovereignty over your physical health and fitness data.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleExportData}
              className="w-full py-2.5 px-4 rounded-xl bg-[#110D0A] hover:bg-[#1E1914] border border-[#2A241E] text-xs font-semibold text-[#D5D1CB] flex items-center justify-between active:scale-95 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-[#E37210]" />
                <span>Export Fitness History (JSON)</span>
              </div>
            </button>

            <button
              onClick={() => signOut()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E1914] hover:bg-[#2A241E] border border-white/[0.08] text-xs font-bold text-white flex items-center justify-between active:scale-95 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4 text-[#E37210]" />
                <span>Sign Out of PokketFit</span>
              </div>
            </button>

            <button
              onClick={handleResetData}
              className="w-full py-2 px-4 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-[11px] font-semibold text-red-400 flex items-center justify-between active:scale-95 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Reset Local Data</span>
              </div>
            </button>
          </div>
        </div>

        {/* Health Disclaimer Footer */}
        <div className="text-[11px] text-[#706760] text-center pt-2 pb-4 space-y-1">
          <p>Pokketfit Coach v1.0.0 • Production Candidate</p>
        </div>
      </div>
    </MobileShell>
  );
}
