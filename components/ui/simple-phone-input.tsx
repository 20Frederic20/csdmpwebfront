"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Country } from "@/features/location/types/location.types";
import { getCountryOptions, validatePhoneNumber } from "@/features/location/utils/location.utils";

interface SimplePhoneInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  defaultCountryCode?: string;
}

export function SimplePhoneInput({ 
  value, 
  onChange, 
  placeholder = "Numéro de téléphone",
  id = "phone",
  required = false,
  disabled = false,
  error,
  label = "Téléphone",
  defaultCountryCode = "BJ"
}: SimplePhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/countries`);
        if (response.ok) {
          const countriesData = await response.json();
          setCountries(countriesData);
          
          // Sélectionner le pays par défaut
          const defaultCountry = countriesData.find((c: Country) => c.country_code === defaultCountryCode) || countriesData[0];
          setSelectedCountry(defaultCountry);
        }
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };

    loadCountries();
  }, [defaultCountryCode]);

  useEffect(() => {
    if (selectedCountry && value) {
      // Si la valeur contient le préfixe, l'enlever pour l'affichage
      if (value.startsWith(selectedCountry.phone_prefix)) {
        setPhoneNumber(value.substring(selectedCountry.phone_prefix.length));
      } else {
        setPhoneNumber(value.replace(/\D/g, ''));
      }
    } else {
      setPhoneNumber("");
    }
  }, [value, selectedCountry]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value.replace(/\D/g, '');
    setPhoneNumber(newPhone);
    
    if (selectedCountry) {
      const fullPhone = selectedCountry.phone_prefix + newPhone;
      onChange(fullPhone);
    } else {
      onChange(newPhone || null);
    }
  };

  const displayPhone = selectedCountry && value && value.startsWith(selectedCountry.phone_prefix)
    ? value.substring(selectedCountry.phone_prefix.length)
    : value?.replace(/\D/g, '') || "";

  // Valider seulement les chiffres après le préfixe
  const phoneWithoutPrefix = selectedCountry && value && value.startsWith(selectedCountry.phone_prefix)
    ? value.substring(selectedCountry.phone_prefix.length)
    : value?.replace(/\D/g, '') || "";
    
  const validation = selectedCountry && phoneWithoutPrefix ? validatePhoneNumber(phoneWithoutPrefix, selectedCountry) : { isValid: true, message: '' };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex">
        <div className="flex items-center px-3 py-2 border border-r-0 border-input bg-muted text-muted-foreground rounded-l-md">
          {selectedCountry?.phone_prefix || '+...'}
        </div>
        <Input
          id={id}
          type="tel"
          value={displayPhone}
          onChange={handlePhoneChange}
          placeholder={selectedCountry ? `xxx xxx xxx` : placeholder}
          disabled={disabled || !selectedCountry}
          className={`rounded-l-none h-10 ${error || !validation.isValid ? 'border-red-500' : ''}`}
        />
      </div>
      
      {/* Validation message */}
      {selectedCountry && phoneWithoutPrefix && !validation.isValid && (
        <p className="text-sm text-red-500 mt-1">
          {validation.message}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
