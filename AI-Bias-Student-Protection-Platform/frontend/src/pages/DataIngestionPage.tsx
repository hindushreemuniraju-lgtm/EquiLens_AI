import React, { useEffect, useState } from 'react';
import { Upload, Database, CheckCircle2, AlertCircle, FileSpreadsheet, Eye, ShieldCheck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { DatasetItem } from '../types';

export const DataIngestionPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const list = await api.getDatasets();
      setDatasets(list);
      if (list.length > 0 && !selectedDataset) {
        loadDetails(list[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load datasets");
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (id: string) => {
    try {
      const details = await api.getDatasetDetails(id);
      setSelectedDataset(details);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const res = await api.uploadDataset(file);
      setUploadSuccess(`Successfully ingested ${res.name} (${res.rows} rows, ${res.columns} columns).`);
      await fetchDatasets();
      if (res.id) loadDetails(res.id);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#22222E]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
              PILLAR 1: INGESTION
            </span>
            <span className="text-xs text-slate-400 font-mono">Multi-Modal Ingestion &amp; Schema Inspector</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Dataset Management &amp; Attribute Scanner</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Accepts CSV, Excel, and Parquet applicant records. Automatically isolates protected demographic columns for compliance auditing while keeping them strictly sequestered from model training features.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow transition-all">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "INGESTING..." : "UPLOAD NEW DATASET"}</span>
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.parquet,.json"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Datasets Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {datasets.map((d) => (
          <div
            key={d.id}
            onClick={() => loadDetails(d.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedDataset?.id === d.id
                ? "bg-[#181824] border-[#007BA7] shadow-cerulean-glow"
                : "bg-[#121217] border-[#22222E] hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#007BA7] font-semibold">{d.id}</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-white mt-1 truncate">{d.name}</h4>
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{d.row_count.toLocaleString()} rows</span>
              <span>•</span>
              <span>{d.column_count} columns</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Dataset Details */}
      {selectedDataset && (
        <div className="space-y-6">
          {/* Data Quality & Schema Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Auto-detected Protected Attributes */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark">
              <div className="flex items-center justify-between pb-3 border-b border-[#22222E] mb-3">
                <span className="text-xs font-mono font-bold text-[#FF2D95] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Auto-Detected Protected Attributes (Isolated)
                </span>
                <span className="text-[10px] font-mono text-slate-500">AUDIT VAULT ONLY</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The scanner auto-tagged these columns as sensitive protected categories. They are excluded from prediction inputs and preserved strictly for parity auditing:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedDataset.protected_attributes?.map((attr, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-[#FF2D95]/10 text-[#FF2D95] border border-[#FF2D95]/30 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D95]" />
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Quality Report */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark">
              <div className="flex items-center justify-between pb-3 border-b border-[#22222E] mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Data Quality &amp; Hygiene Inspection
                </span>
                <span className="text-[10px] font-mono text-emerald-400">VERIFIED CLEAN</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1A1A24]">
                  <div className="text-lg font-bold text-white">{selectedDataset.row_count}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Total Rows</div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1A1A24]">
                  <div className="text-lg font-bold text-white">{selectedDataset.column_count}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Columns</div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1A1A24]">
                  <div className="text-lg font-bold text-emerald-400">
                    {selectedDataset.data_quality?.duplicate_rows ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Duplicates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Preview Table */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark">
            <div className="flex items-center justify-between pb-3 border-b border-[#22222E] mb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#007BA7]" />
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Dataset Sample Preview (First 25 Rows)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Displaying 25 of {selectedDataset.row_count} total records
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-thin max-h-96">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0A0A0A] text-slate-400 sticky top-0 border-b border-[#22222E]">
                  <tr>
                    {Object.keys(selectedDataset.schema || {}).map((col) => (
                      <th key={col} className="p-2.5 whitespace-nowrap font-semibold">
                        <div className="text-slate-200">{col}</div>
                        <div className="text-[9px] text-[#007BA7] font-normal">{selectedDataset.schema[col]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A24] text-slate-300">
                  {selectedDataset.preview_rows?.map((row, i) => (
                    <tr key={i} className="hover:bg-[#161622] transition-colors">
                      {Object.keys(selectedDataset.schema || {}).map((col) => (
                        <td key={col} className="p-2.5 whitespace-nowrap">
                          {String(row[col] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
