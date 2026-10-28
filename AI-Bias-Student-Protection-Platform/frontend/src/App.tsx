import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { DataIngestionPage } from './pages/DataIngestionPage';
import { RubricTracerPage } from './pages/RubricTracerPage';
import { ProxyGuardPage } from './pages/ProxyGuardPage';
import { FairnessScorecardPage } from './pages/FairnessScorecardPage';
import { DisparateImpactPage } from './pages/DisparateImpactPage';
import { ThresholdSandboxPage } from './pages/ThresholdSandboxPage';
import { DeviceTwinPage } from './pages/DeviceTwinPage';
import { HiddenPromptPage } from './pages/HiddenPromptPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { BiasVerificationPage } from './pages/BiasVerificationPage';
import { CandidateFeedbackPage } from './pages/CandidateFeedbackPage';
import { RemediationLabPage } from './pages/RemediationLabPage';
import { ScamShieldDemoPage } from './pages/ScamShieldDemoPage';
import { RegionalScannerPage } from './pages/RegionalScannerPage';
import { CybercrimeReportPage } from './pages/CybercrimeReportPage';
import { LearnModePage } from './pages/LearnModePage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { AuditHistoryPage } from './pages/AuditHistoryPage';
import { VendorMonoculturePage } from './pages/VendorMonoculturePage';
import { LiveApiAndExportPage } from './pages/LiveApiAndExportPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/data-ingestion" element={<DataIngestionPage />} />
              <Route path="/rubric-tracer" element={<RubricTracerPage />} />
              <Route path="/proxy-guard" element={<ProxyGuardPage />} />
              <Route path="/fairness-scorecard" element={<FairnessScorecardPage />} />
              <Route path="/disparate-impact" element={<DisparateImpactPage />} />
              <Route path="/threshold-sandbox" element={<ThresholdSandboxPage />} />
              <Route path="/device-twin" element={<DeviceTwinPage />} />
              <Route path="/hidden-prompt" element={<HiddenPromptPage />} />
              <Route path="/explainability" element={<ExplainabilityPage />} />
              <Route path="/bias-verification" element={<BiasVerificationPage />} />
              <Route path="/candidate-feedback" element={<CandidateFeedbackPage />} />
              <Route path="/remediation-lab" element={<RemediationLabPage />} />
              <Route path="/scam-shield" element={<ScamShieldDemoPage />} />
              <Route path="/regional-scanner" element={<RegionalScannerPage />} />
              <Route path="/cybercrime-report" element={<CybercrimeReportPage />} />
              <Route path="/learn-mode" element={<LearnModePage />} />
              <Route path="/privacy-center" element={<PrivacyCenterPage />} />
              <Route path="/audit-history" element={<AuditHistoryPage />} />
              <Route path="/vendor-monoculture" element={<VendorMonoculturePage />} />
              <Route path="/live-api" element={<LiveApiAndExportPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
