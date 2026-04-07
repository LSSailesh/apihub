const CATEGORIES = [
  "All", "AI/ML", "Weather", "Finance", "Maps",
  "Payments", "Social", "Communication", "Data", "Other"
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div>
      <label className="form-label fw-semibold">Category</label>
      <div className="d-flex flex-column gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm text-start ${selected === (cat === "All" ? "" : cat)
              ? "btn-primary"
              : "btn-outline-secondary"
            }`}
            onClick={() => onChange(cat === "All" ? "" : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
