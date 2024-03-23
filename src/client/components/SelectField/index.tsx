export default function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <label className="block text-gray-300 text-sm font-bold mb-2">
        {label}
      </label>
      <select
        className="block w-full px-4 py-2 border border-zinc-700 rounded-md focus-within:border-amber-400 hover:border-amber-400 bg-transparent text-white"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value as T)}
      >
        {options.map((option) => (
          <option className="bg-[#333333]" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
