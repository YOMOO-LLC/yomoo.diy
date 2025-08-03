import React from 'react';
import type { BusinessCategory } from '~/components/onboarding/OnboardingData';

interface CategoryCardProps {
  category: BusinessCategory;
  isSelected?: boolean;
  onClick: () => void;
  showSamples?: boolean;
}

export function CategoryCard({ category, isSelected = false, onClick, showSamples = false }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative p-6 border-2 rounded-xl transition-all duration-300 text-left w-full
        ${
          isSelected
            ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-purple-50/50 shadow-lg scale-105'
            : 'border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 hover:border-bolt-elements-borderColorHover hover:bg-bolt-elements-background-depth-3 hover:shadow-md'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Main content */}
      <div className="flex items-start gap-4">
        <div
          className={`
          text-3xl flex-shrink-0 transition-transform duration-300
          ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
        `}
        >
          {category.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`
            font-bold text-lg mb-2 transition-colors duration-300
            ${
              isSelected
                ? 'text-blue-700'
                : 'text-bolt-elements-textPrimary group-hover:text-bolt-elements-textPrimaryHover'
            }
          `}
          >
            {category.title}
          </h3>

          <p className="text-sm text-bolt-elements-textSecondary mb-3 leading-relaxed">{category.description}</p>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-1 mb-3">
            {category.subcategories.slice(0, 3).map((sub, index) => (
              <span
                key={index}
                className={`
                  text-xs px-2 py-1 rounded-full transition-colors duration-300
                  ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary'
                  }
                `}
              >
                {sub}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span className="text-xs text-bolt-elements-textSecondary">
                +{category.subcategories.length - 3} 更多
              </span>
            )}
          </div>

          {/* Sample examples */}
          {showSamples && (
            <div className="mt-3 pt-3 border-t border-bolt-elements-borderColor">
              <p className="text-xs text-bolt-elements-textSecondary mb-2">示例：</p>
              <div className="flex flex-wrap gap-1">
                {category.samples.slice(0, 2).map((sample, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full border border-green-200"
                  >
                    {sample}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div
        className={`
        absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
        ${
          isSelected
            ? 'bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-100'
            : 'bg-gradient-to-r from-bolt-elements-focus/5 to-transparent opacity-0 group-hover:opacity-100'
        }
      `}
      />
    </button>
  );
}
