import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { AppLayout } from './components/layout/AppLayout';
import { CitizenLayout } from './components/layout/CitizenLayout';
import { LoginScreen } from './components/LoginScreen';

// Authority Pages
import { DashboardPage } from './pages/authority/DashboardPage';
import { LiveMapPage } from './pages/authority/LiveMapPage';
import { TTIBoardPage } from './pages/authority/TTIBoardPage';
import { AlertsPage } from './pages/authority/AlertsPage';
import { EvacuationPage } from './pages/authority/EvacuationPage';
import { SensorsPage } from './pages/authority/SensorsPage';
import { SimulationPage } from './pages/authority/SimulationPage';
import { AnalyticsPage } from './pages/authority/AnalyticsPage';
import { GroundReportsPage } from './pages/authority/GroundReportsPage';
import { ResponsePage } from './pages/authority/ResponsePage';
import { CatchmentGraphPage } from './pages/authority/CatchmentGraphPage';
import { DrillCenterPage } from './pages/authority/DrillCenterPage';

// Citizen Pages
import { CitizenHomePage } from './pages/citizen/CitizenHomePage';

// Warden Pages
import { WardenDashboardPage } from './pages/warden/WardenDashboardPage';

function App() {
  const currentRole = useStore((s) => s.currentRole);

  if (!currentRole) {
    return <LoginScreen />;
  }

  if (currentRole === 'citizen') {
    return (
      <BrowserRouter>
        <CitizenLayout>
          <Routes>
            <Route path="/" element={<CitizenHomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CitizenLayout>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Authority / Admin / Warden / Responder routes */}
          <Route path="/" element={
            currentRole === 'warden' ? <WardenDashboardPage /> : <DashboardPage />
          } />
          <Route path="/map" element={<LiveMapPage />} />
          <Route path="/tti" element={<TTIBoardPage />} />
          <Route path="/catchment" element={<CatchmentGraphPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/evacuation" element={<EvacuationPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/reports" element={<GroundReportsPage />} />
          <Route path="/response" element={<ResponsePage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/drill" element={<DrillCenterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
