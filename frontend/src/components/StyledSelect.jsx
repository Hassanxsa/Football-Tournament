import React from 'react';

/**
 * StyledSelect - A select dropdown with consistent black text to ensure visibility
 * against any background color.
 */
const StyledSelect = ({ 
  name, 
  value, 
  onChange, 
  disabled, 
  className, 
  children,
  placeholder
}) => {
  // Custom styles to ensure text is visible
  const selectStyles = {
    color: 'black',
    fontWeight: 'normal',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    width: '100%'
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      style={selectStyles}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
};

/**
 * StyledOption - An option element with consistent black text for visibility
 */
export const StyledOption = ({ value, children }) => {
  const optionStyles = {
    color: 'black',
    backgroundColor: '#ffffff',
  };

  return (
    <option value={value} style={optionStyles}>
      {children}
    </option>
  );
};

export default StyledSelect;
