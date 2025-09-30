import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FloatingSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({ id, name, label, value, onChange, options, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleSelect = (optionValue: string) => {
    // Simulate a change event for the parent form handler
    const event = {
      target: { name, value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
    setIsOpen(false);
  };

  const isEmpty = !value;

  return (
    <div className="form-group" ref={wrapperRef}>
      <div className="select-wrapper" data-empty={isEmpty}>
        <button
          type="button"
          id={id}
          className={`form-input select-button ${isEmpty ? 'placeholder' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-empty={isEmpty}
        >
         <span className="select-button-value">{selectedOption?.label || ''}</span>
        </button>

        <label htmlFor={id} className="form-label">{label}</label>

        {isOpen && (
          <ul
            className="select-dropdown"
            role="listbox"
          >
            {options.map((option) => (
              option.value && (
                <li
                  key={option.value}
                  className={`select-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              )
            ))}
          </ul>
        )}
      </div>
      {/* Hidden select for form submission and accessibility */}
      <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
      >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
};

export default FloatingSelect;
