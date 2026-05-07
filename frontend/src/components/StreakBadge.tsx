interface Props {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakBadge({ streak, size = 'md' }: Props) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-xl px-4 py-2',
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'from-orange-500 to-red-500';
    if (streak >= 14) return 'from-yellow-500 to-orange-500';
    if (streak >= 7) return 'from-green-500 to-emerald-500';
    return 'from-brand-500 to-green-600';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${getStreakColor()} rounded-full font-semibold text-white ${sizeClasses[size]}`}>
      <span>🔥</span>
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}
