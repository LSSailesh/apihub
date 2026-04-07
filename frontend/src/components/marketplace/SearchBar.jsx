export default function SearchBar({ value, onChange }) {
  return (
    <div className="input-group mb-2">
      <span className="input-group-text bg-white">🔍</span>
      <input
        type="text"
        className="form-control"
        placeholder="Search APIs by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
