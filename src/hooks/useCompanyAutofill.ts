/**
 * Custom Hook: useCompanyAutofill
 * Provides company autofill functionality for forms
 */

import { useState, useCallback } from "react";
import { CompanyAutofillData, GetCompanyAutofillResponse } from "@/types/company";

interface UseCompanyAutofillOptions {
  onSuccess?: (data: CompanyAutofillData) => void;
  onError?: (error: string) => void;
}

interface UseCompanyAutofillReturn {
  autofillData: CompanyAutofillData | null;
  isLoading: boolean;
  error: string | null;
  fetchAutofillData: () => Promise<void>;
  applyAutofill: (formSetters: Partial<Record<keyof CompanyAutofillData, (value: any) => void>>) => void;
}

/**
 * Hook to fetch and apply company autofill data to forms
 * 
 * @example
 * const { fetchAutofillData, applyAutofill, isLoading } = useCompanyAutofill({
 *   onSuccess: (data) => console.log('Autofill data loaded', data),
 * });
 * 
 * // Fetch data
 * await fetchAutofillData();
 * 
 * // Apply to form
 * applyAutofill({
 *   companyName: (value) => form.handleChange('companyName', value),
 *   email: (value) => form.handleChange('email', value),
 * });
 */
export function useCompanyAutofill(options?: UseCompanyAutofillOptions): UseCompanyAutofillReturn {
  const [autofillData, setAutofillData] = useState<CompanyAutofillData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch company autofill data from API
   */
  const fetchAutofillData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/company/autofill");
      const data: GetCompanyAutofillResponse = await response.json();

      if (data.success && data.data) {
        setAutofillData(data.data);
        options?.onSuccess?.(data.data);
      } else {
        const errorMsg = data.error || "Failed to fetch autofill data";
        setError(errorMsg);
        options?.onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An error occurred while fetching autofill data";
      setError(errorMsg);
      options?.onError?.(errorMsg);
      console.error("Error fetching autofill data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  /**
   * Apply autofill data to form fields
   * 
   * @param formSetters - Object mapping field names to setter functions
   */
  const applyAutofill = useCallback((
    formSetters: Partial<Record<keyof CompanyAutofillData, (value: any) => void>>
  ) => {
    if (!autofillData) {
      console.warn("No autofill data available. Call fetchAutofillData() first.");
      return;
    }

    // Apply each field that has a setter
    Object.entries(formSetters).forEach(([field, setter]) => {
      const key = field as keyof CompanyAutofillData;
      const value = autofillData[key];
      
      if (value !== undefined && value !== null && setter) {
        setter(value);
      }
    });
  }, [autofillData]);

  return {
    autofillData,
    isLoading,
    error,
    fetchAutofillData,
    applyAutofill,
  };
}

/**
 * Helper function to create autofill button handler
 * 
 * @example
 * const handleAutofill = createAutofillHandler(
 *   fetchAutofillData,
 *   applyAutofill,
 *   {
 *     companyName: (value) => form.handleChange('companyName', value),
 *     email: (value) => form.handleChange('email', value),
 *   }
 * );
 * 
 * <button onClick={handleAutofill}>Autofill Company Details</button>
 */
export function createAutofillHandler(
  fetchAutofillData: () => Promise<void>,
  applyAutofill: (formSetters: Partial<Record<keyof CompanyAutofillData, (value: any) => void>>) => void,
  formSetters: Partial<Record<keyof CompanyAutofillData, (value: any) => void>>
): () => Promise<void> {
  return async () => {
    await fetchAutofillData();
    applyAutofill(formSetters);
  };
}

