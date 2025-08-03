import React from 'react';
import {
  BUSINESS_CATEGORIES,
  DESIGN_STYLES,
  INTEGRATION_OPTIONS,
  type OnboardingData,
} from '~/components/onboarding/OnboardingData';

interface PreviewConfirmStepProps {
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  canProceed: boolean;
  isLoading: boolean;
}

export function PreviewConfirmStep({ data, onPrev, onFinish, isLoading }: PreviewConfirmStepProps) {
  const selectedCategory = data.businessCategory ? BUSINESS_CATEGORIES[data.businessCategory] : null;
  const selectedDesignStyle = data.designStyle ? DESIGN_STYLES[data.designStyle] : null;
  const selectedIntegrations = INTEGRATION_OPTIONS.filter((opt) => data.integrations?.includes(opt.id));

  const sections = [
    {
      title: '业务信息',
      icon: '🏢',
      items: [
        {
          label: '业务类型',
          value: selectedCategory ? `${selectedCategory.title} - ${data.businessSubcategory}` : '未设置',
        },
        { label: '业务名称', value: data.businessName || '未设置' },
        { label: '标语', value: data.tagline || '未设置' },
        { label: '目标受众', value: data.targetAudience || '未设置' },
      ],
    },
    {
      title: '服务内容',
      icon: '🛍️',
      items: [
        { label: '主要服务', value: data.services?.length ? data.services.join('、') : '未设置' },
        { label: '核心产品', value: data.products?.length ? data.products.join('、') : '无' },
        { label: '关键特色', value: data.keyFeatures?.length ? data.keyFeatures.join('、') : '未设置' },
        { label: '价格展示', value: data.pricing?.hasPricing ? `是 (${data.pricing.structure})` : '否' },
      ],
    },
    {
      title: '设计风格',
      icon: '🎨',
      items: [
        { label: '设计风格', value: selectedDesignStyle?.name || '未设置' },
        { label: '主色调', value: data.primaryColor || '未设置', isColor: true },
        { label: '品牌Logo', value: data.hasLogo ? (data.logoUrl ? '已提供URL' : '需要使用') : '不使用' },
      ],
    },
    {
      title: '联系方式',
      icon: '📞',
      items: [
        { label: '邮箱', value: data.contactInfo?.email || '未设置' },
        { label: '电话', value: data.contactInfo?.phone || '未设置' },
        { label: '地址', value: data.contactInfo?.address || '未设置' },
        {
          label: '社交媒体',
          value:
            Object.keys(data.socialMedia || {}).filter((key) => (data.socialMedia as any)?.[key]).length + ' 个平台',
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-3">预览确认信息</h2>
        <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">
          请确认以下信息无误，我们将基于这些信息为您生成专业的 Landing Page
        </p>
      </div>

      {/* Information Summary */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="p-6 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-xl"
            >
              <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4 flex items-center gap-2">
                <span className="text-xl">{section.icon}</span>
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-start gap-3">
                    <span className="text-sm font-medium text-bolt-elements-textSecondary min-w-0 flex-shrink-0">
                      {item.label}:
                    </span>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {item.isColor && item.value !== '未设置' && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: item.value }}
                        />
                      )}
                      <span className="text-sm text-bolt-elements-textPrimary text-right break-words">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        {selectedIntegrations.length > 0 && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200 rounded-xl">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              功能集成
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedIntegrations.map((integration, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-green-800 text-sm">{integration.name}</div>
                    <div className="text-xs text-green-600">{integration.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Requirements */}
        {data.additionalRequirements && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-200 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              额外要求
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">{data.additionalRequirements}</p>
          </div>
        )}

        {/* Generation Preview */}
        <div className="mt-8 p-8 bg-gradient-to-r from-purple-50/30 to-pink-50/30 border-2 border-dashed border-purple-300 rounded-xl text-center">
          <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">🚀</span>
            即将为您生成
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                📱
              </div>
              <span className="font-medium text-purple-700">响应式设计</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                ⚡
              </div>
              <span className="font-medium text-purple-700">快速加载</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                🎨
              </div>
              <span className="font-medium text-purple-700">专业设计</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl">
                🔧
              </div>
              <span className="font-medium text-purple-700">功能完整</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-purple-600">包含完整的 HTML、CSS、JavaScript 代码，支持实时预览和一键部署</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onPrev}
          disabled={isLoading}
          className="px-6 py-3 border border-bolt-elements-borderColor rounded-lg text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一步
        </button>

        <button
          onClick={onFinish}
          disabled={isLoading}
          className={`
            px-12 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center gap-3
            ${
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105 active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              生成中...
            </>
          ) : (
            <>
              <span className="text-2xl">🎯</span>
              开始生成我的网站
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-blue-800 font-medium">正在为您生成专业网站，请稍候...</span>
          </div>
        </div>
      )}
    </div>
  );
}
