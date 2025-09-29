import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Option { value: string; label: string }

interface FloatingSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  label: string;
  required?: boolean;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({ id, name, value, onChange, options, label, required }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [internalValue, setInternalValue] = useState<string>(value);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // use 'click' so portal option clicks fire their handlers before we close
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  useEffect(() => {
    // Listen for other FloatingSelects opening so we can close when another opens
    const onOtherOpen = (e: Event) => {
      try {
        const custom = e as CustomEvent<string>;
        if (custom.detail !== id) {
          setOpen(false);
        }
      } catch {
        // ignore
      }
    };
    document.addEventListener('floatingselect:open', onOtherOpen as EventListener);
    return () => document.removeEventListener('floatingselect:open', onOtherOpen as EventListener);
  }, [id]);

  useEffect(() => {
    // close when value changes (useful when controlled externally)
    setOpen(false);
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!open || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });

    const onScroll = () => {
      if (!wrapperRef.current) return;
      const r = wrapperRef.current.getBoundingClientRect();
      setPosition({ top: r.bottom + 8, left: r.left, width: r.width });
    };
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  const handleToggle = () => setOpen(o => !o);

  // When opening, compute position immediately, notify others, and open so dropdown renders synchronously
  const handleOpenNotify = (nextOpen: boolean) => {
    if (nextOpen) {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
      }
      const ev = new CustomEvent('floatingselect:open', { detail: id });
      document.dispatchEvent(ev);
      setOpen(true);
      return;
    }
    setOpen(false);
  };

  const handleSelect = (optValue: string) => {
    // build a synthetic event shape similar to a native select change
    const synthetic = { target: { name, value: optValue } } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange(synthetic);
    // update internal state immediately so the UI reflects the selection without waiting for parent
    setInternalValue(optValue);
    setOpen(false);
  };

  const selectedLabel = options.find(o => o.value === internalValue)?.label || '';

  return (
  <div className="select-wrapper" data-empty={internalValue ? 'false' : 'true'} data-open={open ? 'true' : 'false'} ref={wrapperRef}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => handleOpenNotify(!open)}
        className={`form-input select-button cursor-none ${value ? '' : 'placeholder'}`}
        title={value ? selectedLabel : `Select ${label}`}
      >
        <span className="select-button-value">{selectedLabel || ''}</span>
        <span className="select-caret" aria-hidden>▾</span>
      </button>
      <label htmlFor={id} className="form-label">{label}</label>
      {open && position && createPortal(
        <ul
          role="listbox"
          tabIndex={-1}
          className="select-dropdown"
          style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
        >
          {options.map(opt => (
            <li key={opt.value} role="option" aria-selected={opt.value === value} className={`select-option ${opt.value === value ? 'selected' : ''}`} onClick={() => handleSelect(opt.value)}>
              {opt.label}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
};

export default FloatingSelect;