import React, { useState, useEffect } from 'react';
import { exerciseApi } from '../../services/api';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    equipment: string;
    difficulty: string;
  }) => void;
  initialFilters: {
    search: string;
    category: string;
    equipment: string;
    difficulty: string;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, initialFilters }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search);
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
  const [selectedEquipment, setSelectedEquipment] = useState(initialFilters.equipment);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialFilters.difficulty);

  const [categories, setCategories] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const [categoriesData, equipmentData, difficultiesData] = await Promise.all([
          exerciseApi.getCategories(),
          exerciseApi.getEquipment(),
          exerciseApi.getDifficulties(),
        ]);

        setCategories(categoriesData);
        setEquipment(equipmentData);
        setDifficulties(difficultiesData);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: searchTerm,
        category: selectedCategory,
        equipment: selectedEquipment,
        difficulty: selectedDifficulty,
      });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedEquipment, selectedDifficulty]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEquipment(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedEquipment('');
    setSelectedDifficulty('');
  };

  const formatOptionName = (option: string): string => {
    return option.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedEquipment || selectedDifficulty;

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse flex gap-4">
          <div className="flex-1 h-10 bg-neutral-200 rounded-lg"></div>
          <div className="w-32 h-10 bg-neutral-200 rounded-lg"></div>
          <div className="w-32 h-10 bg-neutral-200 rounded-lg"></div>
          <div className="w-32 h-10 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-light" />
            </div>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-neutral-50 placeholder-light"
              style={{ borderColor: 'rgba(45, 52, 54, 0.2)', color: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-neutral-50 text-primary"
            style={{ borderColor: 'rgba(45, 52, 54, 0.2)' }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatOptionName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment Filter */}
        <div>
          <select
            value={selectedEquipment}
            onChange={handleEquipmentChange}
            className="w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-neutral-50 text-primary"
            style={{ borderColor: 'rgba(45, 52, 54, 0.2)' }}
          >
            <option value="">All Equipment</option>
            {equipment.map((eq) => (
              <option key={eq} value={eq}>
                {formatOptionName(eq)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-neutral-50 text-primary"
            style={{ borderColor: 'rgba(45, 52, 54, 0.2)' }}
          >
            <option value="">All Levels</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {formatOptionName(difficulty)}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn btn-ghost w-full"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
            {searchTerm && (
              <div className="card card-compact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: 'var(--space-xs) var(--space-sm)',
                border: '1.5px solid var(--color-primary)',
                backgroundColor: 'var(--color-primary-100)'
              }}>
                <span className="text-body-sm text-white">"{searchTerm}"</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:opacity-70"
                  style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X className="h-3 w-3" style={{ color: 'white' }} />
                </button>
              </div>
            )}

            {selectedCategory && (
              <div className="card card-compact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: 'var(--space-xs) var(--space-sm)',
                border: '1.5px solid var(--color-primary)',
                backgroundColor: 'var(--color-primary-100)'
              }}>
                <span className="text-body-sm text-white">{formatOptionName(selectedCategory)}</span>
                <button
                  onClick={() => setSelectedCategory('')}
                  className="hover:opacity-70"
                  style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X className="h-3 w-3" style={{ color: 'white' }} />
                </button>
              </div>
            )}

            {selectedEquipment && (
              <div className="card card-compact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: 'var(--space-xs) var(--space-sm)',
                border: '1.5px solid var(--color-primary)',
                backgroundColor: 'var(--color-primary-100)'
              }}>
                <span className="text-body-sm text-white">{formatOptionName(selectedEquipment)}</span>
                <button
                  onClick={() => setSelectedEquipment('')}
                  className="hover:opacity-70"
                  style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X className="h-3 w-3" style={{ color: 'white' }} />
                </button>
              </div>
            )}

            {selectedDifficulty && (
              <div className="card card-compact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: 'var(--space-xs) var(--space-sm)',
                border: '1.5px solid var(--color-primary)',
                backgroundColor: 'var(--color-primary-100)'
              }}>
                <span className="text-body-sm text-white">{formatOptionName(selectedDifficulty)}</span>
                <button
                  onClick={() => setSelectedDifficulty('')}
                  className="hover:opacity-70"
                  style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X className="h-3 w-3" style={{ color: 'white' }} />
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
