'use client';  // Obligatoire car il y a de l'interaction (useState, events)

import { useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue, ActionMeta } from 'react-select';

interface Option {
  value: string | number;
  label: string;
  // tu peux ajouter d'autres champs : isDisabled, color, etc.
}

interface CustomSelectProps {
  options: Option[];
  value?: string | string[] | null;          // string pour single, string[] pour multi
  onChange?: (value: string | string[] | null) => void;
  placeholder?: string;
  isMulti?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  // Pour contrôler via les classes
  height?: string; // ex: "h-12", "h-10", etc.
  padding?: string; // ex: "px-3", "px-4", etc.
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Sélectionnez...',
  isMulti = false,
  isDisabled = false,
  isLoading = false,
  className,
  height = "h-12", // hauteur par défaut
  padding = "px-3", // padding par défaut
}: CustomSelectProps) {
  const [selected, setSelected] = useState<
    SingleValue<Option> | MultiValue<Option>
  >(null);
  const [isClient, setIsClient] = useState(false);

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

    // Fonction pour convertir les classes Tailwind en valeurs CSS
  const getStylesFromClasses = () => {
    // Mapping des classes de hauteur vers pixels
    const heightMap: { [key: string]: string } = {
      'h-8': '32px',
      'h-9': '36px',
      'h-10': '40px',
      'h-11': '44px',
      'h-12': '48px',
      'h-14': '56px',
      'h-16': '64px',
    };

    // Mapping des classes de padding vers pixels
    const paddingMap: { [key: string]: string } = {
      'px-2': '8px',
      'px-3': '12px',
      'px-4': '16px',
      'px-5': '20px',
      'px-6': '24px',
    };

    return {
      height: heightMap[height] || '48px',
      padding: paddingMap[padding] || '12px',
    };
  };

  // Synchronisation avec la prop value (contrôlé depuis l'extérieur)
  useEffect(() => {
    if (!isClient) return; // Ne pas synchroniser côté serveur
    
    if (value === null || value === undefined) {
      setSelected(null);
      return;
    }

    if (isMulti) {
      // value est string[]
      const selectedOpts = options.filter(opt =>
        (value as string[]).includes(opt.value as string)
      );
      setSelected(selectedOpts);
    } else {
      // value est string | number
      const selectedOpt = options.find(opt => opt.value === value);
      setSelected(selectedOpt || null);
    }
  }, [value, options, isMulti, isClient]);

  const handleChange = (
    newValue: SingleValue<Option> | MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    setSelected(newValue);

    if (!onChange) return;

    if (isMulti) {
      const vals = (newValue as MultiValue<Option>).map(opt => opt.value);
      onChange(vals.length ? vals.map(v => String(v)) : null);
    } else {
      const val = (newValue as SingleValue<Option>)?.value ?? null;
      onChange(val !== null ? String(val) : null);
    }
  };

  return (
    <>
      {!isClient ? (
        // Fallback côté serveur pour éviter les erreurs d'hydratation
        <select 
          className={`${className} ${height} ${padding} py-2 border border-gray-300 rounded-md bg-white`}
          disabled={isDisabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Select
          className={className}
          classNamePrefix="react-select"  // utile pour custom CSS
          options={options}
          value={selected}
          onChange={handleChange}
          placeholder={placeholder}
          isMulti={isMulti}
          isDisabled={isDisabled}
          isLoading={isLoading}
          noOptionsMessage={() => 'Aucune option trouvée'}
          // Styles dynamiques basés sur les classes
          styles={{
            control: (base) => {
              const styles = getStylesFromClasses();
              return {
                ...base,
                borderColor: '#d1d5db',
                borderRadius: '0.375rem',
                minHeight: styles.height,
                height: styles.height,
                padding: `0 ${styles.padding}`,
              };
            },
            valueContainer: (base) => {
              const styles = getStylesFromClasses();
              return {
                ...base,
                padding: '0 8px',
              };
            },
            indicatorsContainer: (base) => ({
              ...base,
              padding: '0 4px',
            }),
          }}
        />
      )}
    </>
  );
}