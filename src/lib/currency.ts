import { Currency, ExchangeRate, ConversionResult, SUPPORTED_CURRENCIES } from '@/types/currency';

// Exchange rates should come from an API
const MOCK_EXCHANGE_RATES: Record<string, Record<string, number>> = {};

export class CurrencyConverter {
  private static instance: CurrencyConverter;

  private constructor() {}

  public static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }

  public getSupportedCurrencies(): Currency[] {
    return SUPPORTED_CURRENCIES;
  }

  public getExchangeRate(fromCurrency: string, toCurrency: string): ExchangeRate {
    const rate = MOCK_EXCHANGE_RATES[fromCurrency]?.[toCurrency] || 1;
    
    return {
      from: fromCurrency,
      to: toCurrency,
      rate,
      lastUpdated: new Date().toISOString()
    };
  }

  public convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): ConversionResult {
    const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * exchangeRate.rate;

    const fromCurrencyObj = SUPPORTED_CURRENCIES.find(c => c.code === fromCurrency);
    const toCurrencyObj = SUPPORTED_CURRENCIES.find(c => c.code === toCurrency);

    if (!fromCurrencyObj || !toCurrencyObj) {
      throw new Error('Unsupported currency');
    }

    return {
      fromAmount: amount,
      toAmount: Number(convertedAmount.toFixed(2)),
      fromCurrency: fromCurrencyObj,
      toCurrency: toCurrencyObj,
      rate: exchangeRate.rate,
      timestamp: new Date().toISOString()
    };
  }

  public formatCurrency(amount: number, currency: Currency): string {
    return `${currency.symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  public getCurrencyByCode(code: string): Currency | undefined {
    return SUPPORTED_CURRENCIES.find(c => c.code === code);
  }
}

export const currencyConverter = CurrencyConverter.getInstance();