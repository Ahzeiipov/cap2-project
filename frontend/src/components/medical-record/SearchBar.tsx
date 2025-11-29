type Props = {
  value: string;
  onChange: (val: string) => void;
  className?: string;
};

export default function SearchBar({ value, onChange, className = '' }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search..."
      className={`border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    />
  );
}
