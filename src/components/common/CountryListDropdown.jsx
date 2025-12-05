import React from "react";
import { countryList } from "../constants/countryList";
import DropdownWithSearch from "./DropdownWithSearch";

const CountryListDropdown = ({
  label = "Country",
  name = "country",
  value,
  onChange,
  error = false,
  errorText = "",
  placeholder = "Select Country",
  className = "",
}) => {
  // Transform your countryList to DropdownWithSearch format
  const countryOptions = countryList.map((country) => ({
    value: country.countryCode, // or use srNo if you prefer
    label: `${country.countryName} (+${country.countryCode || "-"})`,
    ...country, // include original data (like maxLength) for flexibility
  }));

  return (
    <div className={`w-full ${className}`}>
      <DropdownWithSearch
        label={label}
        name={name}
        placeholder={placeholder}
        options={countryOptions}
        value={value}
        onChange={(selectedValue) => {
          // Pass both selected country object and value upward
          const selectedCountry = countryOptions.find(
            (c) => c.value === selectedValue
          );
          onChange(selectedCountry);
        }}
        error={error}
        errorText={errorText}
      />
    </div>
  );
};

export default CountryListDropdown;

