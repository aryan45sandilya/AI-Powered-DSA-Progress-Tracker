interface Props {
  difficulty: string;
}

export default function DifficultyBadge({ difficulty }: Props) {
  const classes = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  }[difficulty] || 'bg-slate-500/20 text-slate-400 text-xs font-medium px-2 py-0.5 rounded-full';

  return <span className={classes}>{difficulty}</span>;
}
