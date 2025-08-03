import React from 'react';
import { CategoryCard } from '~/components/onboarding/ui/CategoryCard';
import { BUSINESS_CATEGORIES, type OnboardingData } from '~/components/onboarding/OnboardingData';

interface BusinessTypeStepProps {
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function BusinessTypeStep({ data, updateData, onNext, canProceed }: BusinessTypeStepProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(data.businessCategory || '');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState(data.businessSubcategory || '');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(''); // Reset subcategory when category changes
    updateData({
      businessCategory: categoryId,
      businessSubcategory: '',
    });
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    updateData({ businessSubcategory: subcategory });
  };

  const selectedCategoryData = selectedCategory ? BUSINESS_CATEGORIES[selectedCategory] : null;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-3">选择您的业务类型</h2>
        <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">
          请选择最符合您业务的类型，这将帮助我们为您提供更精准的建议和模板
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.values(BUSINESS_CATEGORIES).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => handleCategorySelect(category.id)}
            showSamples={true}
          />
        ))}
      </div>

      {/* Subcategory Selection */}
      {selectedCategoryData && (
        <div className="mt-8 p-6 bg-bolt-elements-background-depth-2 rounded-xl border border-bolt-elements-borderColor">
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4 flex items-center gap-2">
            <span className="text-2xl">{selectedCategoryData.icon}</span>
            选择具体的 {selectedCategoryData.title} 类型
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedCategoryData.subcategories.map((subcategory, index) => (
              <button
                key={index}
                onClick={() => handleSubcategorySelect(subcategory)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left
                  ${
                    selectedSubcategory === subcategory
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary border border-bolt-elements-borderColor hover:border-blue-300 hover:bg-blue-50/50'
                  }
                `}
              >
                {subcategory}
              </button>
            ))}
          </div>

          {/* Selected category features preview */}
          {selectedSubcategory && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">推荐功能模块：</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategoryData.suggestedFeatures.map((feature, index) => (
                  <span key={index} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success examples */}
      {selectedCategoryData && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/30 to-purple-50/30 border border-blue-200 rounded-xl">
          <h4 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3 flex items-center gap-2">
            <span className="text-xl">✨</span>
            成功案例参考
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategoryData.samples.map((sample, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-bolt-elements-textPrimary">{sample}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <div></div> {/* Empty div for spacing */}
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
            ${
              canProceed
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary cursor-not-allowed'
            }
          `}
        >
          下一步：填写基本信息
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
