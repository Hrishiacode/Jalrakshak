import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { AlertOctagon, PhoneCall, Navigation, Volume2, ShieldCheck, MapPin, CheckCircle, Radio } from 'lucide-react';

export function CitizenHomePage() {
  const { villages, alerts, isAlertActive } = useStore();
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || 'v1');
  const [language, setLanguage] = useState<'EN' | 'HI' | 'UT'>('HI'); // Hindi by default for Uttarakhand
  const [sosSent, setSosSent] = useState(false);

  const village = villages.find(v => v.id === selectedVillageId) || villages[0];
  const activeAlert = alerts.find(a => a.targetVillage === village.name) || alerts[0];

  const handleSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header with Language selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-xl shadow-lg shadow-rose-600/30">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">JALRAKSHAK CITIZEN WARNING</h1>
            <p className="text-xs text-slate-400">Valley Emergency & Evacuation Assistance</p>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setLanguage('HI')}
            className={`px-2.5 py-1 text-xs font-bold rounded ${language === 'HI' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
          >
            हिंदी
          </button>
          <button 
            onClick={() => setLanguage('EN')}
            className={`px-2.5 py-1 text-xs font-bold rounded ${language === 'EN' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Select Village */}
      <div className="card bg-slate-900/80 border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          {language === 'HI' ? 'अपना गाँव चुनें (Select Village):' : 'Select Your Village Location:'}
        </label>
        <select
          value={selectedVillageId}
          onChange={(e) => setSelectedVillageId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 text-base font-bold outline-none focus:border-cyan-500"
        >
          {villages.map(v => (
            <option key={v.id} value={v.id}>{v.name} (Risk Level: {v.riskLevel})</option>
          ))}
        </select>
      </div>

      {/* Big Impact TTI & Warning Card */}
      <div className={`p-6 rounded-2xl border ${
        village.riskLevel === 'HIGH' 
          ? 'bg-rose-950/70 border-rose-500 shadow-2xl shadow-rose-950' 
          : 'bg-emerald-950/70 border-emerald-500 shadow-xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${
            village.riskLevel === 'HIGH' ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
          }`}>
            {village.riskLevel === 'HIGH' ? '🔴 DANGER - EVACUATE NOW' : '🟢 SAFE - WATCH ALERT'}
          </span>
          <span className="text-xs font-mono text-slate-300">Live Elevation: {village.elevation}m</span>
        </div>

        <div className="text-center py-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-300">
            {language === 'HI' ? 'गाँव तक बाढ़ का पानी पहुँचने का अनुमानित समय' : 'Estimated Time Before Flood Reaches Village'}
          </div>
          <div className="text-6xl font-black font-mono text-white tracking-tight">
            {village.ttiMinutes ? `${village.ttiMinutes} MINS` : 'SAFE'}
          </div>
          <p className="text-sm font-semibold text-rose-200 mt-2">
            {language === 'HI' 
              ? 'कृपया तुरंत उच्च स्थान (Ridge Shelter 1) की ओर प्रस्थान करें!' 
              : 'Move immediately to High Ground Shelter 1 along marked safe route!'}
          </p>
        </div>

        {/* Action Evacuation Route Banner */}
        <div className="mt-4 p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            {language === 'HI' ? 'सुरक्षित निकासी मार्ग (Safe Route):' : 'Recommended Evacuation Route:'}
          </div>
          <p className="text-slate-300">
            {village.name} High Road &rarr; Eastern Ridge Track &rarr; High School Shelter
          </p>
        </div>
      </div>

      {/* SOS Button */}
      <div className="card bg-slate-900 border-slate-800 text-center space-y-3">
        <h3 className="font-bold text-white text-base">
          {language === 'HI' ? 'आपातकालीन सहायता (Emergency Assistance)' : 'Trapped or Require Immediate Help?'}
        </h3>
        
        {sosSent ? (
          <div className="p-4 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            {language === 'HI' 
              ? 'आपकी SOS लोकेशन NDRF और ग्राम प्रधान को भेज दी गई है!' 
              : 'Your GPS location & SOS have been transmitted to NDRF and Village Warden!'}
          </div>
        ) : (
          <button
            onClick={handleSOS}
            className="w-full py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-red-900/50 flex items-center justify-center gap-3 transition-all transform active:scale-95"
          >
            <AlertOctagon className="w-8 h-8 text-white animate-spin" />
            {language === 'HI' ? 'SOS बटन दबाएँ (EMERGENCY SOS)' : 'PRESS FOR EMERGENCY SOS'}
          </button>
        )}
      </div>

      {/* Local Warden Contact */}
      <div className="card bg-slate-900 border-slate-800 space-y-3 text-xs">
        <h4 className="font-bold text-white text-sm">
          {language === 'HI' ? 'आपके ग्राम प्रधान / वार्डन संपर्क:' : 'Your Local Village Warden Contact:'}
        </h4>
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <div className="text-white font-bold text-sm">{village.wardenName}</div>
            <div className="text-slate-400">Head Warden, {village.name}</div>
          </div>
          <a
            href={`tel:${village.wardenPhone}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors text-xs"
          >
            <PhoneCall className="w-4 h-4" /> {village.wardenPhone}
          </a>
        </div>
      </div>
    </div>
  );
}
