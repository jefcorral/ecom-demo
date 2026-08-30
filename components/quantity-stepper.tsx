"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { showErrorToast } from "@/lib/toast-helper";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  max,
  onChange,
  disabled = false,
}: QuantityStepperProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }

  const handleDecrement = () => {
    if (disabled) return;
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (value >= max) {
      // Snap to max quantity and trigger a warning/error toast
      onChange(max);
      showErrorToast(`Cannot exceed available stock of ${max}.`);
      return;
    }
    onChange(value + 1);
  };

  const handleInputChange = (valStr: string) => {
    const num = parseInt(valStr, 10);
    if (isNaN(num)) {
      setInputValue(0); // Allow typing empty/backspace
      return;
    }
    setInputValue(num);
  };

  const handleBlur = () => {
    if (disabled) return;
    if (inputValue < 1) {
      onChange(1);
    } else if (inputValue > max) {
      onChange(max);
      showErrorToast(`Quantity snapped to max available stock of ${max}.`);
    } else {
      onChange(inputValue);
    }
  };

  const isMinusDisabled = disabled || value <= 1;
  const isPlusDisabled = disabled || value >= max;

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMinusDisabled}
        aria-disabled={isMinusDisabled ? "true" : "false"}
        aria-label="Decrease quantity"
        className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded bg-[#F2B705] hover:bg-[#FFF3CD] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-4 w-4 stroke-[2.5]" />
      </button>

      <input
        type="number"
        min={1}
        max={max}
        value={inputValue === 0 ? "" : inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        className="w-[48px] h-10 md:h-8 p-0 text-center text-[15px] font-bold text-[#2C3E2A] dark:text-foreground bg-transparent border border-border rounded focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isPlusDisabled}
        aria-disabled={isPlusDisabled ? "true" : "false"}
        aria-label="Increase quantity"
        className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded bg-[#F2B705] hover:bg-[#FFF3CD] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
