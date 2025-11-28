"use client";

import React, { useState } from 'react';
import { CurrencyConverter, CurrencyInput } from '@/components/Currency';
import { ConversionResult } from '@/types/currency';

export default function CurrencyConverterPage() {
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([]);

  const handleConversionResult = (result: ConversionResult) => {
    setConversionHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 conversions
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Currency Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Convert between KSH, USD, GBP, and EUR currencies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Converter */}
        <div className="lg:col-span-2">
          <CurrencyConverter onConversionResult={handleConversionResult} />
        </div>

        {/* Conversion History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-stroke dark:border-gray-700">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
            Recent Conversions
          </h3>
          
          {conversionHistory.length > 0 ? (
            <div className="space-y-3">
              {conversionHistory.map((conversion, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">
                        {conversion.fromCurrency.symbol}{conversion.fromAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 mx-2">→</span>
                      <span className="font-medium">
                        {conversion.toCurrency.symbol}{conversion.toAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {conversion.fromCurrency.code} to {conversion.toCurrency.code} • {new Date(conversion.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <p className="text-sm">No conversions yet</p>
              <p className="text-xs">Start converting to see your history</p>
            </div>
          )}
        </div>
      </div>

      {/* Currency Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { code: 'USD', name: 'US Dollar', symbol: '$', description: 'United States Dollar' },
          { code: 'KSH', name: 'Kenyan Shilling', symbol: 'KSh', description: 'Kenyan Shilling' },
          { code: 'GBP', name: 'British Pound', symbol: '£', description: 'British Pound Sterling' },
          { code: 'EUR', name: 'Euro', symbol: '€', description: 'European Union Euro' }
        ].map((currency) => (
          <div 
            key={currency.code}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-stroke dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-primary">{currency.symbol}</div>
              <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {currency.code}
              </div>
            </div>
            <h4 className="font-semibold text-dark dark:text-white">{currency.name}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {currency.description}
            </p>
          </div>
        ))}
      </div>

      {/* Feature Demo Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Try the Currency Input Component
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This component can be used in forms throughout the application for currency-related inputs.
        </p>
        <div className="max-w-md">
          <CurrencyInput
            label="Sample Amount"
            placeholder="Enter amount..."
            showCurrencySelector={true}
          />
        </div>
      </div>
    </div>
  );
}