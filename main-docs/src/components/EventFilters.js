import React, { useState } from 'react';
import styles from './EventFilters.module.css';

const EventFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    type: 'all',
    time: 'upcoming',
    format: 'all',
    ...initialFilters
  });

  const [viewMode, setViewMode] = useState('list');

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      type: 'all',
      time: 'upcoming',
      format: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const FilterGroup = ({ label, options, value, onChange, icon }) => (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>
        <i className={`fas fa-${icon}`}></i>
        {label}
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={styles.filterSelect}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'office-hours', label: 'Office Hours' },
    { value: 'hacky-hour', label: 'Hacky Hour' },
    { value: 'field-trip', label: 'Field Trip' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'special', label: 'Special Event' }
  ];

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past Events' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' }
  ];

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.time !== 'upcoming') count++;
    if (filters.format !== 'all') count++;
    return count;
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>
          <i className="fas fa-filter"></i>
          Filter Events
        </h3>
        
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <i className="fas fa-list"></i>
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'calendar' ? styles.active : ''}`}
            onClick={() => setViewMode('calendar')}
            title="Calendar View"
          >
            <i className="fas fa-calendar"></i>
          </button>
        </div>
      </div>

      <div className={styles.filterControls}>
        <div className={styles.filterRow}>
          <FilterGroup
            label="Event Type"
            options={eventTypes}
            value={filters.type}
            onChange={(value) => updateFilter('type', value)}
            icon="tag"
          />
          
          <FilterGroup
            label="Time"
            options={timeOptions}
            value={filters.time}
            onChange={(value) => updateFilter('time', value)}
            icon="clock"
          />
          
          <FilterGroup
            label="Format"
            options={formatOptions}
            value={filters.format}
            onChange={(value) => updateFilter('format', value)}
            icon="desktop"
          />
        </div>

        <div className={styles.filterActions}>
          {getActiveFilterCount() > 0 && (
            <button 
              onClick={clearFilters}
              className={styles.clearButton}
            >
              <i className="fas fa-times"></i>
              Clear Filters ({getActiveFilterCount()})
            </button>
          )}
          
          <div className={styles.resultCount}>
            <i className="fas fa-info-circle"></i>
            Showing filtered results
          </div>
        </div>
      </div>

      {/* Quick filter chips */}
      <div className={styles.quickFilters}>
        <button
          className={`${styles.quickFilter} ${filters.time === 'upcoming' && filters.type === 'all' ? styles.active : ''}`}
          onClick={() => {
            updateFilter('time', 'upcoming');
            updateFilter('type', 'all');
          }}
        >
          <i className="fas fa-calendar-plus"></i>
          Upcoming Events
        </button>
        
        <button
          className={`${styles.quickFilter} ${filters.type === 'showcase' ? styles.active : ''}`}
          onClick={() => updateFilter('type', 'showcase')}
        >
          <i className="fas fa-star"></i>
          Showcases
        </button>
        
        <button
          className={`${styles.quickFilter} ${filters.type === 'office-hours' ? styles.active : ''}`}
          onClick={() => updateFilter('type', 'office-hours')}
        >
          <i className="fas fa-users"></i>
          Office Hours
        </button>
        
        <button
          className={`${styles.quickFilter} ${filters.format === 'virtual' ? styles.active : ''}`}
          onClick={() => updateFilter('format', 'virtual')}
        >
          <i className="fas fa-video"></i>
          Virtual Only
        </button>
      </div>
    </div>
  );
};

export default EventFilters;
