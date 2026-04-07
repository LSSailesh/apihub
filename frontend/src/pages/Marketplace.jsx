import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApis } from "../services/marketplaceService";
import ApiCard from "../components/marketplace/ApiCard";
import SearchBar from "../components/marketplace/SearchBar";
import CategoryFilter from "../components/marketplace/CategoryFilter";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("popular");

  const { data, isLoading } = useQuery({
    queryKey: ["apis", search, category, sort],
    queryFn: () => getApis({ search, category, sort }).then((r) => r.data),
  });

  return (
    <div className="page-container">
      <h2 className="fw-bold mb-1">API Marketplace</h2>
      <p className="text-muted mb-4">Discover and explore APIs for your projects</p>

      <SearchBar value={search} onChange={setSearch} />

      <div className="row g-4 mt-1">
        <div className="col-md-3">
          <CategoryFilter selected={category} onChange={setCategory} />
          <div className="mt-3">
            <label className="form-label fw-semibold">Sort by</label>
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        <div className="col-md-9">
          {isLoading ? (
            <p className="text-muted">Loading APIs...</p>
          ) : data?.length === 0 ? (
            <p className="text-muted">No APIs found.</p>
          ) : (
            <div className="row g-3">
              {data?.map((api) => (
                <div className="col-md-6 col-lg-4" key={api.id}>
                  <ApiCard api={api} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
