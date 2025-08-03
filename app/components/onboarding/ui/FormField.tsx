import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'email' | 'tel' | 'url';
  placeholder?: string;
  description?: string;
  required?: boolean;
  suggestions?: string[];
  maxLength?: number;
  rows?: number;
}

export function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  description,
  required = false,
  suggestions = [],
  maxLength,
  rows = 3,
}: FormFieldProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (suggestions.length > 0 && value) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion.toLowerCase() !== value.toLowerCase(),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, suggestions]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const inputId = `field-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="relative mb-6">
      <label htmlFor={inputId} className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {description && <p className="text-xs text-bolt-elements-textSecondary mb-3 leading-relaxed">{description}</p>}

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            className="w-full px-4 py-3 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary placeholder-bolt-elements-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-vertical min-h-[80px]"
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-4 py-3 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary placeholder-bolt-elements-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        )}

        {/* Character count */}
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-bolt-elements-textSecondary">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface MultiSelectFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ id: string; name: string; description?: string }>;
  placeholder?: string;
  description?: string;
  maxSelections?: number;
}

export function MultiSelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  description,
  maxSelections,
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(search.toLowerCase()) ||
      (option.description && option.description.toLowerCase().includes(search.toLowerCase())),
  );

  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else if (!maxSelections || value.length < maxSelections) {
      onChange([...value, optionId]);
    }
  };

  const selectedOptions = options.filter((option) => value.includes(option.id));

  return (
    <div className="relative mb-6">
      <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
        {label}
        {maxSelections && (
          <span className="text-xs text-bolt-elements-textSecondary ml-2">(最多选择 {maxSelections} 项)</span>
        )}
      </label>

      {description && <p className="text-xs text-bolt-elements-textSecondary mb-3 leading-relaxed">{description}</p>}

      {/* Selected items */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {option.name}
              <button type="button" onClick={() => toggleOption(option.id)} className="ml-1 hover:text-blue-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary placeholder-bolt-elements-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
        />

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-bolt-elements-textSecondary">没有找到匹配的选项</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  disabled={!!(maxSelections && value.length >= maxSelections && !value.includes(option.id))}
                  className={`
                    w-full px-4 py-3 text-left transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                    ${
                      value.includes(option.id)
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2'
                    }
                    ${
                      maxSelections && value.length >= maxSelections && !value.includes(option.id)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{option.name}</div>
                      {option.description && (
                        <div className="text-xs text-bolt-elements-textSecondary mt-1">{option.description}</div>
                      )}
                    </div>
                    {value.includes(option.id) && (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
