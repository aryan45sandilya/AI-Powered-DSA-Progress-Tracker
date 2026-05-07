import { useMemo } from 'react';
import { format, eachDayOfInterval, subYears, startOfWeek, getDay } from 'date-fns';

interface Props {
  data: Record<string, number>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getColor(count: number): string {
  if (count === 0) return 'bg-dark-700';
  if (count === 1) return 'bg-brand-900';
  if (count <= 3) return 'bg-brand-700';
  if (count <= 6) return 'bg-brand-500';
  return 'bg-brand-400';
}

export default function HeatmapChart({ data }: Props) {
  const { weeks, monthLabels } = useMemo(() => {
    const end = new Date();
    const start = subYears(end, 1);
    const days = eachDayOfInterval({ start, end });

    // Pad to start on Sunday
    const firstDay = getDay(days[0]);
    const paddedDays: (Date | null)[] = Array(firstDay).fill(null).concat(days);

    // Group into weeks
    const weeksArr: (Date | null)[][] = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeksArr.push(paddedDays.slice(i, i + 7));
    }

    // Month labels
    const labels: { month: string; col: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, col) => {
      const firstReal = week.find((d) => d !== null);
      if (firstReal) {
        const m = firstReal.getMonth();
        if (m !== lastMonth) {
          labels.push({ month: MONTHS[m], col });
          lastMonth = m;
        }
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, []);

  const totalSolved = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {monthLabels.map(({ month, col }) => (
            <div
              key={`${month}-${col}`}
              className="text-xs text-slate-500"
              style={{ marginLeft: col === 0 ? 0 : `${(col - (monthLabels[monthLabels.indexOf({ month, col } as typeof monthLabels[0])] || { col: 0 }).col) * 14}px` }}
            >
              {month}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {DAYS.map((day, i) => (
              <div key={day} className="h-3 w-6 text-xs text-slate-600 flex items-center">
                {i % 2 === 1 ? day.slice(0, 1) : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="w-3 h-3" />;
                const dateStr = format(day, 'yyyy-MM-dd');
                const count = data[dateStr] || 0;
                return (
                  <div
                    key={di}
                    className={`w-3 h-3 rounded-sm ${getColor(count)} cursor-pointer transition-opacity hover:opacity-80`}
                    title={`${dateStr}: ${count} solved`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-8">
          <span className="text-xs text-slate-500">Less</span>
          {[0, 1, 3, 5, 7].map((n) => (
            <div key={n} className={`w-3 h-3 rounded-sm ${getColor(n)}`} />
          ))}
          <span className="text-xs text-slate-500">More</span>
          <span className="text-xs text-slate-500 ml-4">{totalSolved} submissions in the last year</span>
        </div>
      </div>
    </div>
  );
}
