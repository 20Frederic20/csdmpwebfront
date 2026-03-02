'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomSelect from '@/components/ui/custom-select';
import { Country } from '@/features/location/types/location.types';
import { getCountryOptions, formatPhoneNumber, addPhonePrefix, validatePhoneNumber } from '@/features/location/utils/location.utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: Country) => void;
  countries: Country[];
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  selectedCountry?: Country | null;
}

export function PhoneInput({ 
  value, 
  onChange, 
  onCountryChange,
  countries, 
  placeholder = "Numéro de téléphone",
  id = "phone",
  required = false,
  disabled = false,
  error,
  selectedCountry: externalSelectedCountry
}: PhoneInputProps) {
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(value);

  // Use external country if provided, otherwise use internal state
  const selectedCountry = externalSelectedCountry || internalSelectedCountry;

  // Initialize with first country or detect from existing phone
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      // Try to detect country from existing phone number
      const detectedCountry = countries.find(country => 
        value.startsWith(country.phone_prefix)
      ) || countries[0]; // Fallback to first country
      
      setInternalSelectedCountry(detectedCountry);
      
      if (onCountryChange) {
        onCountryChange(detectedCountry);
      }
    }
  }, [countries, value, selectedCountry, onCountryChange]);

  // Update phone number when value prop changes
  useEffect(() => {
    // Si la valeur contient le préfixe, l'enlever pour l'affichage
    if (selectedCountry && value && value.startsWith(selectedCountry.phone_prefix)) {
      setPhoneNumber(value.substring(selectedCountry.phone_prefix.length));
    } else {
      setPhoneNumber(value || '');
    }
  }, [value, selectedCountry]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.country_code === countryCode);
    if (country) {
      setInternalSelectedCountry(country);
      
      // Réinitialiser le numéro de téléphone quand on change de pays
      setPhoneNumber('');
      onChange('');
      
      if (onCountryChange) {
        onCountryChange(country);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    
    if (selectedCountry) {
      const fullPhone = selectedCountry.phone_prefix + newPhone.replace(/\D/g, '');
      onChange(fullPhone);
    } else {
      onChange(newPhone);
    }
  };

  // Afficher seulement le numéro sans le préfixe dans l'input
  const displayPhone = selectedCountry && value.startsWith(selectedCountry.phone_prefix)
    ? value.substring(selectedCountry.phone_prefix.length)
    : value.replace(/\D/g, '');

  // Valider seulement les chiffres après le préfixe
  const phoneWithoutPrefix = selectedCountry && value.startsWith(selectedCountry.phone_prefix)
    ? value.substring(selectedCountry.phone_prefix.length)
    : value.replace(/\D/g, '');

  const validation = selectedCountry && phoneWithoutPrefix ? validatePhoneNumber(phoneWithoutPrefix, selectedCountry) : { isValid: true, message: '' };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-country`} className="text-sm font-medium">
        Pays {required && <span className="text-red-500">*</span>}
      </Label>
      <CustomSelect
        options={getCountryOptions(countries)}
        value={selectedCountry?.country_code || ''}
        onChange={(value) => handleCountryChange(Array.isArray(value) ? value[0] : value || '')}
        placeholder="Sélectionner un pays"
        height="h-10"
        className="w-full"
      />

      <Label htmlFor={id} className="text-sm font-medium mt-3">
        Téléphone {required && <span className="text-red-500">*</span>}
        {selectedCountry && (
          <span className="text-sm text-muted-foreground ml-2">
            {selectedCountry.phone_prefix} xxx xxx xxx ({selectedCountry.national_length} chiffres)
          </span>
        )}
      </Label>
      <div className="flex">
        <div className="flex items-center px-3 py-2 border border-r-0 border-input bg-muted text-muted-foreground rounded-l-md h-9">
          {selectedCountry?.phone_prefix || '+...'}
        </div>
        <Input
          id={id}
          type="tel"
          value={displayPhone}
          onChange={handlePhoneChange}
          placeholder={selectedCountry ? `xxx xxx xxx` : placeholder}
          disabled={disabled || !selectedCountry}
          className={`rounded-l-none ${error || !validation.isValid ? 'border-red-500' : ''}`}
        />
      </div>
      
      {/* Validation message */}
      {selectedCountry && phoneWithoutPrefix && !validation.isValid && (
        <p className="text-sm text-red-500 mt-1">
          {validation.message}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
