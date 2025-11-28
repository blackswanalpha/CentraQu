"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/Dashboard/form-input';
import { FormSelect, SelectOption } from '@/components/Dashboard/form-select';
import { currencyConverter } from '@/lib/currency';
import { ConversionResult, Currency } from '@/types/currency';

interface CurrencyConverterProps {
  className?: string;
  onConversionResult?: (result: ConversionResult) => void;
}

export function CurrencyConverter({ className, onConversionResult }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('KSH');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string>('');

  const currencies = currencyConverter.getSupportedCurrencies();
  const currencyOptions: SelectOption[] = currencies.map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`
  }));

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleConvert = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      const conversion = currencyConverter.convert(numAmount, fromCurrency, toCurrency);
      setResult(conversion);
      setError('');
      onConversionResult?.(conversion);
    } catch (err) {
      setError('Conversion failed. Please try again.');
      setResult(null);
    }
  };

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      handleConvert();
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency]);

  const fromCurrencyObj = currencyConverter.getCurrencyByCode(fromCurrency);
  const toCurrencyObj = currencyConverter.getCurrencyByCode(toCurrency);

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-stroke dark:border-gray-700", className)}>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-2">
            Currency Converter
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Convert between KSH, USD, GBP, and EUR
          </p>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            error={error}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormSelect
              label="From"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              options={currencyOptions}
            />

            <div className="flex justify-center md:justify-start">
              <button
                onClick={handleSwapCurrencies}
                className="mb-2 p-2 rounded-lg border border-stroke hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                type="button"
                aria-label="Swap currencies"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l-4-4" />
                </svg>
              </button>
            </div>

            <FormSelect
              label="To"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              options={currencyOptions}
            />
          </div>
        </div>

        {result && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-dark dark:text-white">
                {currencyConverter.formatCurrency(result.toAmount, result.toCurrency)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currencyConverter.formatCurrency(result.fromAmount, result.fromCurrency)}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span>Exchange Rate:</span>
                <span>
                  1 {result.fromCurrency.code} = {result.rate.toFixed(4)} {result.toCurrency.code}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>Last Updated:</span>
                <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Exchange rates are for demonstration purposes only
        </div>
      </div>
    </div>
  );
}