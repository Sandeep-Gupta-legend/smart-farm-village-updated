import React from 'react';
import SearchBar from './SearchBar';

interface PageWithSearchProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSearch?: boolean;
  className?: string;
}

const PageWithSearch: React.FC<PageWithSearchProps> = ({
  children,
  onSearch,
  placeholder = "Search...",
  showSearch = true,
  className = ""
}) => {
  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className={className}>
      {showSearch && (
        <div className="mb-6">
          <SearchBar
            placeholder={placeholder}
            onSearch={handleSearch}
            className="p-3"
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default PageWithSearch;


