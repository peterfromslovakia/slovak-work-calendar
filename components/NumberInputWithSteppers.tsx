import React from 'react';

interface NumberInputWithSteppersProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInputWithSteppers: React.FC<NumberInputWithSteppersProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}) => {
  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
        onChange(0);
        return;
    }
    const newValue = parseFloat(rawValue);
    if (!isNaN(newValue)) {
      if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-60">
      <label htmlFor={id} className="text-gray-600 font-medium text-sm">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={min !== undefined && value <= min}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
          aria-label="Znížiť hodnotu"
        >
          -
        </button>
        <input
          id={id}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="w-full text-center font-semibold text-gray-900 border-x border-gray-300 outline-none p-2 bg-transparent"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          aria-label="Zvýšiť hodnotu"
        >
          +
        </button>
      </div>
    </div>
  );
};