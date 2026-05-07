import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
  trend?: { value: number; label: string };
}

const colorMap = {
  green: 'text-green-400 bg-green-500/10',
  yellow: 'text-yellow-400 bg-yellow-500/10',
  red: 'text-red-400 bg-red-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'green', trend }: Props) {
  return (
    <div className="card hover:border-dark-600 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)} {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
