interface SearchBarProps {
  city: string;
  keyword: string;
  onCityChange: (city: string) => void;
  onClear: () => void;
  onKeywordChange: (keyword: string) => void;
}

export function SearchBar({ city, keyword, onCityChange, onClear, onKeywordChange }: SearchBarProps) {
  return (
    <section className="search-panel" aria-label="Search resources">
      <div className="search-field">
        <label htmlFor="keyword">What do you need?</label>
        <input id="keyword" name="keyword" type="search" placeholder="Try food, housing, jobs..." autoComplete="off" value={keyword} onChange={(event) => onKeywordChange(event.target.value)} />
      </div>
      <div className="location-field">
        <label htmlFor="city">Location</label>
        <input id="city" name="city" type="search" placeholder="Neighborhood or city" autoComplete="off" value={city} onChange={(event) => onCityChange(event.target.value)} />
      </div>
      <button className="clear-button" type="button" onClick={onClear}>Clear search</button>
    </section>
  );
}