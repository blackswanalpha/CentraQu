import { currencyConverter } from '../currency';
import { SUPPORTED_CURRENCIES } from '../../types/currency';

describe('Currency Converter', () => {
  test('should return supported currencies', () => {
    const currencies = currencyConverter.getSupportedCurrencies();
    expect(currencies).toEqual(SUPPORTED_CURRENCIES);
    expect(currencies).toHaveLength(4);
  });

  test('should convert USD to KSH', () => {
    const result = currencyConverter.convert(100, 'USD', 'KSH');
    
    expect(result.fromAmount).toBe(100);
    expect(result.fromCurrency.code).toBe('USD');
    expect(result.toCurrency.code).toBe('KSH');
    expect(result.toAmount).toBeGreaterThan(0);
    expect(result.rate).toBeGreaterThan(0);
  });

  test('should convert KSH to USD', () => {
    const result = currencyConverter.convert(1000, 'KSH', 'USD');
    
    expect(result.fromAmount).toBe(1000);
    expect(result.fromCurrency.code).toBe('KSH');
    expect(result.toCurrency.code).toBe('USD');
    expect(result.toAmount).toBeGreaterThan(0);
  });

  test('should convert GBP to EUR', () => {
    const result = currencyConverter.convert(50, 'GBP', 'EUR');
    
    expect(result.fromAmount).toBe(50);
    expect(result.fromCurrency.code).toBe('GBP');
    expect(result.toCurrency.code).toBe('EUR');
    expect(result.toAmount).toBeGreaterThan(0);
  });

  test('should handle same currency conversion', () => {
    const result = currencyConverter.convert(100, 'USD', 'USD');
    
    expect(result.fromAmount).toBe(100);
    expect(result.toAmount).toBe(100);
    expect(result.rate).toBe(1);
  });

  test('should format currency correctly', () => {
    const usd = { code: 'USD', name: 'US Dollar', symbol: '$' };
    const ksh = { code: 'KSH', name: 'Kenyan Shilling', symbol: 'KSh' };
    
    expect(currencyConverter.formatCurrency(1234.56, usd)).toBe('$1,234.56');
    expect(currencyConverter.formatCurrency(5000, ksh)).toBe('KSh5,000.00');
  });

  test('should get currency by code', () => {
    const usd = currencyConverter.getCurrencyByCode('USD');
    expect(usd).toBeDefined();
    expect(usd?.code).toBe('USD');
    expect(usd?.symbol).toBe('$');

    const invalid = currencyConverter.getCurrencyByCode('INVALID');
    expect(invalid).toBeUndefined();
  });

  test('should throw error for unsupported currency', () => {
    expect(() => {
      currencyConverter.convert(100, 'INVALID', 'USD');
    }).toThrow('Unsupported currency');
  });

  test('should get exchange rate', () => {
    const rate = currencyConverter.getExchangeRate('USD', 'KSH');
    
    expect(rate.from).toBe('USD');
    expect(rate.to).toBe('KSH');
    expect(rate.rate).toBeGreaterThan(0);
    expect(rate.lastUpdated).toBeDefined();
  });
});