import React from 'react';
import { FormField } from '~/components/onboarding/ui/FormField';
import { DESIGN_STYLES, type OnboardingData } from '~/components/onboarding/OnboardingData';

interface DesignPreferencesStepProps {
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function DesignPreferencesStep({ data, updateData, onNext, onPrev, canProceed }: DesignPreferencesStepProps) {
  const [selectedStyle, setSelectedStyle] = React.useState<keyof typeof DESIGN_STYLES>(data.designStyle || 'modern');
  const [selectedColor, setSelectedColor] = React.useState(data.primaryColor || '#2563eb');
  const [hasLogo, setHasLogo] = React.useState(data.hasLogo || false);

  React.useEffect(() => {
    const selectedStyleData = DESIGN_STYLES[selectedStyle as keyof typeof DESIGN_STYLES];
    updateData({
      designStyle: selectedStyle as any,
      primaryColor: selectedColor,
      colorScheme: selectedStyleData?.colorPalettes[0] || '#2563eb-#f8fafc',
      hasLogo,
    });
  }, [selectedStyle, selectedColor, hasLogo]);

  const colors = [
    { name: '蓝色', value: '#2563eb', gradient: 'from-blue-500 to-blue-600' },
    { name: '紫色', value: '#7c3aed', gradient: 'from-purple-500 to-purple-600' },
    { name: '绿色', value: '#059669', gradient: 'from-green-500 to-green-600' },
    { name: '红色', value: '#dc2626', gradient: 'from-red-500 to-red-600' },
    { name: '橙色', value: '#ea580c', gradient: 'from-orange-500 to-orange-600' },
    { name: '青色', value: '#0891b2', gradient: 'from-cyan-500 to-cyan-600' },
    { name: '粉色', value: '#db2777', gradient: 'from-pink-500 to-pink-600' },
    { name: '灰色', value: '#374151', gradient: 'from-gray-600 to-gray-700' },
  ];

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-3">选择设计风格</h2>
        <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">选择最符合您品牌形象的设计风格和配色方案</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Design Style Selection */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4">设计风格</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(DESIGN_STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setSelectedStyle(key as keyof typeof DESIGN_STYLES)}
                className={`
                  p-6 border-2 rounded-xl transition-all duration-300 text-left
                  ${
                    selectedStyle === key
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-purple-50/50 shadow-lg scale-105'
                      : 'border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 hover:border-bolt-elements-borderColorHover hover:shadow-md'
                  }
                `}
              >
                <h4
                  className={`font-bold text-lg mb-2 ${selectedStyle === key ? 'text-blue-700' : 'text-bolt-elements-textPrimary'}`}
                >
                  {style.name}
                </h4>
                <p className="text-sm text-bolt-elements-textSecondary mb-3">{style.description}</p>

                {/* Style preview */}
                <div className="space-y-2">
                  {style.colorPalettes.slice(0, 2).map((palette, index) => {
                    const [primary, bg] = palette.split('-');
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: primary }}
                        />
                        <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: bg }} />
                        <span className="text-xs text-bolt-elements-textSecondary">配色方案 {index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4">主色调</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`
                  relative w-16 h-16 rounded-xl transition-all duration-200 flex items-center justify-center
                  bg-gradient-to-br ${color.gradient}
                  ${
                    selectedColor === color.value
                      ? 'scale-110 shadow-lg ring-4 ring-white ring-opacity-60'
                      : 'hover:scale-105 hover:shadow-md'
                  }
                `}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm text-bolt-elements-textSecondary">
              当前选择：{colors.find((c) => c.value === selectedColor)?.name}
            </span>
          </div>
        </div>

        {/* Logo Option */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4">品牌Logo</h3>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="has-logo"
              checked={hasLogo}
              onChange={(e) => setHasLogo(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor rounded focus:ring-blue-500"
            />
            <label htmlFor="has-logo" className="text-sm font-medium text-bolt-elements-textPrimary">
              我有品牌Logo需要使用
            </label>
          </div>

          {hasLogo && (
            <div className="space-y-4 pl-7">
              <FormField
                label="Logo URL"
                value={data.logoUrl || ''}
                onChange={(value) => updateData({ logoUrl: value })}
                type="url"
                placeholder="https://example.com/logo.png"
                description="如果您的Logo已上传到网上，请提供URL地址"
              />
              <div className="text-xs text-bolt-elements-textSecondary">
                <p>💡 小贴士：</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>推荐使用PNG格式的透明背景Logo</li>
                  <li>建议尺寸：宽度200-400px</li>
                  <li>如果暂时没有Logo，我们可以用文字Logo替代</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Design Preview */}
        <div className="p-8 border-2 border-dashed border-bolt-elements-borderColor rounded-xl bg-bolt-elements-background-depth-1">
          <h4 className="text-lg font-semibold text-bolt-elements-textPrimary mb-6 text-center">设计预览</h4>

          <div
            className="max-w-md mx-auto p-6 rounded-xl shadow-lg"
            style={{
              backgroundColor: '#ffffff',
              borderTop: `4px solid ${selectedColor}`,
            }}
          >
            {/* Mock header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {hasLogo ? (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">LOGO</div>
                ) : (
                  <div
                    className="px-3 py-1 rounded text-white text-sm font-bold"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {data.businessName || '业务名称'}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Mock content */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-100 rounded w-full"></div>
              <div className="h-2 bg-gray-100 rounded w-5/6"></div>
              <div
                className="mt-4 px-4 py-2 rounded text-white text-sm text-center"
                style={{ backgroundColor: selectedColor }}
              >
                立即开始
              </div>
            </div>
          </div>

          <p className="text-xs text-bolt-elements-textSecondary text-center mt-4">这是您网站的大致风格预览</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-bolt-elements-borderColor rounded-lg text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一步
        </button>

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
          下一步：联系方式
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
