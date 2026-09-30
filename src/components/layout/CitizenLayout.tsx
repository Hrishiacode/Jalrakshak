import React from 'react';
import { useStore } from '../../store/useStore';
import { LogOut } from 'lucide-react';

export function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple top bar */}
      <header className="bg-white border-b border-navy-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-data-primary rounded-md flex items-center justify-center text-white font-bold text-xs">
            J
          </div>
          <span className="font-bold text-navy-900 text-sm">JALRAKSHAK</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="demo-banner text-[10px]">Demo</span>
          <button
            onClick={() => {
              useStore.getState().resetScenario();
              window.location.href = '/';
              setTimeout(() => useStore.setState({ currentRole: undefined as any }), 50);
            }}
            className="text-navy-400 hover:text-navy-600 cursor-pointer"
            title="Switch Role"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
