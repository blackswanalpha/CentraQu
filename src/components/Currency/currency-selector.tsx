"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { FormSelect, SelectOption } from '@/components/Dashboard/form-select';
import { currencyConverter } from '@/lib/currency';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function CurrencySelector({
  value,
  onChange,
  label = "Currency",
  className,
  placeholder = "Select currency",
  required = false,
  error
}: CurrencySelectorProps) {
  const currencies = currencyConverter.getSupportedCurrencies();
  const currencyOptions: SelectOption[] = currencies.map(currency => ({
    value: currency.code,
    label: `${currency.symbol} ${currency.code} - ${currency.name}`
  }));

  return (
    <FormSelect
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={currencyOptions}
      placeholder={placeholder}
      required={required}
      error={error}
      className={className}
    />
  );
}