import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  FileSearch,
  KeyRound,
  BarChart3,
  Scale,
  Sliders,
  Video,
  FileCode,
  Binary,
  ShieldCheck,
  Award,
  FlaskConical,
  ShieldAlert,
  Languages,
  FileText,
  GraduationCap,
  Lock,
  History,
  Network,
  Share2
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "EXECUTIVE CENTER",
    items: [
      { name: "Overview Dashboard", path: "/", icon: LayoutDashboard }
    ]
  },
  {
    title: "PILLAR 1: INGESTION & PROXY",
    items: [
      { name: "Data Ingestion", path: "/data-ingestion", icon: Database },
      { name: "Rubric Bias Tracer", path: "/rubric-tracer", icon: FileSearch },
      { name: "Proxy Leakage Guard", path: "/proxy-guard", icon: KeyRound, badge: "High Risk" }
    ]
  },
  {
    title: "PILLAR 2: FAIRNESS & AUDITING",
    items: [
      { name: "Fairness Scorecard", path: "/fairness-scorecard", icon: BarChart3 },
      { name: "80% Disparate Impact", path: "/disparate-impact", icon: Scale, badge: "EEOC" },
      { name: "Threshold Sandbox", path: "/threshold-sandbox", icon: Sliders, badge: "Live" },
      { name: "Device & Media Twin", path: "/device-twin", icon: Video },
      { name: "Hidden-Prompt Audit", path: "/hidden-prompt", icon: FileCode }
    ]
  },
  {
    title: "PILLAR 3: EXPLAINABILITY",
    items: [
      { name: "SHAP Credential Attribution", path: "/explainability", icon: Binary },
      { name: "Bias-Free Verification", path: "/bias-verification", icon: ShieldCheck },
      { name: "Candidate Feedback", path: "/candidate-feedback", icon: Award }
    ]
  },
  {
    title: "PILLAR 4: REMEDIATION LAB",
    items: [
      { name: "Bias Remediation Lab", path: "/remediation-lab", icon: FlaskConical, badge: "Core AI" }
    ]
  },
  {
    title: "PILLAR 5: STUDENT PROTECTION",
    items: [
      { name: "Scam Shield Demo", path: "/scam-shield", icon: ShieldAlert, badge: "Demo" },
      { name: "Regional Scanner", path: "/regional-scanner", icon: Languages },
      { name: "1-Click Cybercrime Report", path: "/cybercrime-report", icon: FileText },
      { name: "Student Learn Mode", path: "/learn-mode", icon: GraduationCap }
    ]
  },
  {
    title: "PILLAR 6: PRIVACY & DPDP",
    items: [
      { name: "Privacy & Consent", path: "/privacy-center", icon: Lock },
      { name: "System Audit Trail", path: "/audit-history", icon: History }
    ]
  },
  {
    title: "ROADMAP & INTEGRATION",
    items: [
      { name: "Vendor Monoculture", path: "/vendor-monoculture", icon: Network, badge: "Roadmap" },
      { name: "Live ATS API & Export", path: "/live-api", icon: Share2 }
    ]
  }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-[#22222E] flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-6">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-[#161622] text-white border-l-2 border-[#007BA7] shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#121217]"
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#007BA7] transition-colors" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      item.badge === "Demo"
                        ? "bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30 animate-pulse"
                        : item.badge === "High Risk"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Bottom Footer Info */}
      <div className="mt-auto p-4 border-t border-[#22222E] bg-[#0E0E14] text-[11px] font-mono text-slate-500 flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span>Engine Status</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            OPERATIONAL
          </span>
        </div>
        <div className="text-[10px] text-slate-600">
          Jet Black • Cerulean • Neon Rose
        </div>
      </div>
    </aside>
  );
};
