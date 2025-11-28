"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/Dashboard/form-input';
import { CurrencySelector } from './currency-selector';
import { currencyConverter } from '@/lib/currency';
import { Currency } from '@/types/currency';

interface CurrencyInputProps {
  label?: string;
  value?: number;
  currency?: string;
  onValueChange?: (amount: number) => void;
  onCurrencyChange?: (currency: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  showCurrencySelector?: boolean;
}

export function CurrencyInput({
  label = "Amount",
  value = 0,
  currency = "USD",
  onValueChange,
  onCurrencyChange,
  placeholder = "0.00",
  required = false,
  error,
  className,
  showCurrencySelector = true
}: CurrencyInputProps) {
  const [amount, setAmount] = useState<string>(value.toString());
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency);

  const currencyObj = currencyConverter.getCurrencyByCode(selectedCurrency);

  useEffect(() => {
    setAmount(value.toString());
  }, [value]);

  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    
    const numValue = parseFloat(newAmount);
    if (!isNaN(numValue)) {
      onValueChange?.(numValue);
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    onCurrencyChange?.(newCurrency);
  };

  const formatDisplayValue = () => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    return currencyObj ? 
      currencyConverter.formatCurrency(parseFloat(amount), currencyObj) : 
      amount;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={label}
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder={placeholder}
          required={required}
          error={error}
          min="0"
          step="0.01"
          icon={currencyObj && (
            <span className="text-sm font-medium">{currencyObj.symbol}</span>
          )}
        />

        {showCurrencySelector && (
          <CurrencySelector
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            label="Currency"
          />
        )}
      </div>

      {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Formatted: <span className="font-medium">{formatDisplayValue()}</span>
        </div>
      )}
    </div>
  );
}