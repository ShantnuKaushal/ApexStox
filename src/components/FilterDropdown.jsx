import React from 'react';

export default function FilterDropdown({ value, onChange }) {
  return (
    <select
      className="filter-dropdown"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="all">All</option>
      <option value="tracked">Tracked</option>
      <option value="untracked">Untracked</option>
    </select>
  );
}
