"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import LocationService from "@/features/location/services/location.service";
import { City } from "@/features/location/types/location.types";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (value: string) => void;
  isLoading?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  countryCode?: string;
  stateCode?: string;
}

export function CitySelector({
  selectedCity,
  onCityChange,
  isLoading = false,
  required = false,
  label = "Ville",
  placeholder = "Sélectionner une ville",
  countryCode = "BJ",
  stateCode
}: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      try {
        // Essayer de charger depuis le cache d'abord
        const cachedCities = LocationService.getCitiesByCountry(countryCode);
        if (cachedCities.length > 0) {
          setCities(stateCode ? LocationService.getCitiesByDepartment(stateCode) : cachedCities);
        } else {
          // Charger depuis l'API si pas en cache
          const citiesData = await LocationService.fetchCities(countryCode, stateCode);
          setCities(citiesData);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [countryCode, stateCode]);

  const cityOptions = cities.map(city => ({
    value: city.code,
    label: city.name
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="city">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <CustomSelect
        options={cityOptions}
        value={selectedCity}
        onChange={(value) => onCityChange(value as string)}
        placeholder={placeholder}
        height="h-10"
        isDisabled={loading || isLoading}
      />
    </div>
  );
}
