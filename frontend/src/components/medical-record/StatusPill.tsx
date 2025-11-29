type StatusPillProps = { status: 'completed' | 'draft' | string };
export default function StatusPill({ status }: StatusPillProps) {
  const isCompleted = status === 'completed';
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-semibold border ${
      isCompleted ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }`}>
      {isCompleted ? 'Completed' : 'Draft'}
    </span>
  );
}
