import { MoreVertical } from 'lucide-react';

export default function ActionMenu() {
  return (
    <button className="flex items-center justify-center rounded-full hover:bg-gray-100 p-2 transition" aria-label="Show record actions">
      <MoreVertical size={20} />
    </button>
  );
}
