import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, Map, Clock, Bell, Shield, Activity, Radio,
  FileText, Truck, Play, BarChart3, ChevronLeft, ChevronRight, LogOut,
  GitBranch, ClipboardList, Users
} from 'lucide-react';
import type { Role } from '../../types';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Overview', icon: <LayoutDashboard size={18} />, roles: ['authority', 'admin', 'responder', 'warden'] },
  { path: '/map', label: 'Live Map', icon: <Map size={18} />, roles: ['authority', 'admin', 'responder'] },
  { path: '/tti', label: 'Time-to-Impact', icon: <Clock size={18} />, roles: ['authority', 'admin', 'responder', 'warden'] },
  { path: '/catchment', label: 'Catchment Graph', icon: <GitBranch size={18} />, roles: ['authority', 'admin'] },
  { path: '/alerts', label: 'Alerts', icon: <Bell size={18} />, roles: ['authority', 'admin', 'responder', 'warden'] },
  { path: '/evacuation', label: 'Evacuation', icon: <Shield size={18} />, roles: ['authority', 'admin'] },
  { path: '/sensors', label: 'Sensors', icon: <Activity size={18} />, roles: ['authority', 'admin', 'warden'] },
  { path: '/reports', label: 'Ground Reports', icon: <FileText size={18} />, roles: ['authority', 'admin', 'warden'] },
  { path: '/response', label: 'Response', icon: <Truck size={18} />, roles: ['authority', 'admin', 'responder'] },
  { path: '/simulation', label: 'Simulation', icon: <Play size={18} />, roles: ['authority', 'admin'] },
  { path: '/drill', label: 'Drill Center', icon: <ClipboardList size={18} />, roles: ['authority', 'admin'] },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} />, roles: ['authority', 'admin'] },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const currentRole = useStore((s) => s.currentRole);
  const currentUser = useStore((s) => s.currentUser);
  const systemStatus = useStore((s) => s.systemStatus);
  const dataQuality = useStore((s) => s.dataQuality);
  const alerts = useStore((s) => s.alerts);
  const isDemoRunning = useStore((s) => s.isDemoRunning);
  const demoStep = useStore((s) => s.demoStep);
  const setRole = useStore((s) => s.setRole);

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));
  const activeAlerts = alerts.filter((a) => a.isActive).length;

  return (
    <div className="flex h-screen overflow-hidden bg-navy-50">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-16' : 'w-56'} bg-white border-r border-navy-100 flex flex-col transition-all duration-200 flex-shrink-0`}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-navy-100 ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-data-primary rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              J
            </div>
            {!collapsed && (
              <div>
                <div className="font-bold text-navy-900 text-sm tracking-tight">JALRAKSHAK</div>
                <div className="text-[10px] text-navy-400">Live Disaster Intelligence</div>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-navy-100">
            <div className="flex items-center gap-2 text-xs">
              <span className={`status-dot ${systemStatus}`}></span>
              <span className="text-navy-600 font-medium uppercase tracking-wider">
                {systemStatus === 'operational' ? 'System Operational' :
                  systemStatus === 'degraded' ? 'Degraded Confidence' : 'Critical'}
              </span>
            </div>
            {dataQuality !== 'high' && (
              <div className="text-[10px] text-risk-warning mt-1 font-medium">
                Data Quality: {dataQuality.toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center px-2' : ''
                } ${isActive
                  ? 'bg-data-primary/10 text-data-primary'
                  : 'text-navy-500 hover:bg-navy-50 hover:text-navy-800'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span>{item.label}</span>
              )}
              {!collapsed && item.path === '/alerts' && activeAlerts > 0 && (
                <span className="ml-auto bg-risk-alert text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeAlerts}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Demo Step Indicator */}
        {isDemoRunning && !collapsed && (
          <div className="px-4 py-2 border-t border-navy-100">
            <div className="text-[10px] text-data-primary font-semibold uppercase tracking-wider">
              Demo Step {demoStep}/8
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-navy-100 text-navy-400 hover:text-navy-600 hover:bg-navy-50 transition-colors flex items-center justify-center"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* User */}
        <div className={`p-3 border-t border-navy-100 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed && (
            <div className="text-xs text-navy-500 mb-1 truncate">{currentUser.name}</div>
          )}
          <button
            onClick={() => {
              useStore.getState().resetScenario();
              // Force a re-render by setting role to same value then clearing
              window.location.href = '/';
              setTimeout(() => useStore.setState({ currentRole: undefined as any }), 50);
            }}
            className="flex items-center gap-2 text-xs text-navy-400 hover:text-risk-alert transition-colors cursor-pointer"
            title="Switch Role"
          >
            <LogOut size={14} />
            {!collapsed && <span>Switch Role</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
