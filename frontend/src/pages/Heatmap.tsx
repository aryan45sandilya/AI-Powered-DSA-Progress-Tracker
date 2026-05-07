import { useQuery } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import api from '../api/axios';
import HeatmapChart from '../components/HeatmapChart';

export default function Heatmap() {
  const { data: heatmapData = {}, isLoading } = useQuery<Record<string, number>>({
    queryKey: ['heatmap'],
    queryFn: () => api.get('/tracker/heatmap').then((r) => r.data),
  });

  const totalDays = Object.keys(heatmapData).length;
  const totalSolved = Object.values(heatmapData).reduce((a, b) => a + b, 0);
  const maxDay = Math.max(...Object.values(heatmapData), 0);
  const avgPerDay = totalDays > 0 ? (totalSolved / totalDays).toFixed(1) : '0';

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Activity size={24} className="text-indigo-400" /> Activity Heatmap
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Your solving consistency over the past year</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card text-center">
          <div className="text-2xl font-bold text-slate-100">{totalSolved}</div>
          <div className="text-slate-400 text-sm">Total Solved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand-400">{totalDays}</div>
          <div className="text-slate-400 text-sm">Active Days</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{maxDay}</div>
          <div className="text-slate-400 text-sm">Best Day</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{avgPerDay}</div>
          <div className="text-slate-400 text-sm">Avg / Active Day</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card">
        <h2 className="font-semibold text-slate-200 mb-6">Submission Activity</h2>
        {isLoading ? (
          <div className="h-32 bg-dark-700 rounded animate-pulse" />
        ) : (
          <HeatmapChart data={heatmapData} />
        )}
      </div>

      {/* Monthly breakdown */}
      {!isLoading && Object.keys(heatmapData).length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-slate-200 mb-4">Monthly Breakdown</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }, (_, i) => {
              const now = new Date();
              const month = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
              const monthStr = month.toISOString().slice(0, 7);
              const count = Object.entries(heatmapData)
                .filter(([date]) => date.startsWith(monthStr))
                .reduce((sum, [, v]) => sum + v, 0);
              return (
                <div key={monthStr} className="text-center p-3 bg-dark-700 rounded-lg">
                  <div className="text-lg font-bold text-slate-100">{count}</div>
                  <div className="text-xs text-slate-500">
                    {month.toLocaleDateString('en', { month: 'short', year: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
