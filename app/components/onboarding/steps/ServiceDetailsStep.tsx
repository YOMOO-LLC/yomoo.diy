import React from 'react';
import { FormField, MultiSelectField } from '~/components/onboarding/ui/FormField';
import { BUSINESS_CATEGORIES, type OnboardingData } from '~/components/onboarding/OnboardingData';

interface ServiceDetailsStepProps {
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function ServiceDetailsStep({ data, updateData, onNext, onPrev, canProceed }: ServiceDetailsStepProps) {
  const selectedCategory = data.businessCategory ? BUSINESS_CATEGORIES[data.businessCategory] : null;

  const [services, setServices] = React.useState<string[]>(data.services || []);
  const [products, setProducts] = React.useState<string[]>(data.products || []);
  const [keyFeatures, setKeyFeatures] = React.useState<string[]>(data.keyFeatures || []);
  const [hasPricing, setHasPricing] = React.useState(data.pricing?.hasPricing || false);

  React.useEffect(() => {
    updateData({
      services,
      products,
      keyFeatures,
      pricing: {
        hasPricing,
        structure: data.pricing?.structure || 'free',
        details: data.pricing?.details || '',
      },
    });
  }, [services, products, keyFeatures, hasPricing]);

  const getServiceSuggestions = () => {
    if (!selectedCategory) {
      return [];
    }

    const suggestions: Record<string, Array<{ id: string; name: string; description: string }>> = {
      restaurant: [
        { id: 'dine-in', name: '堂食服务', description: '餐厅内用餐体验' },
        { id: 'takeout', name: '外卖服务', description: '打包带走服务' },
        { id: 'delivery', name: '配送服务', description: '送餐到家服务' },
        { id: 'catering', name: '承办宴席', description: '大型聚餐承办' },
        { id: 'private-dining', name: '包厢服务', description: '私人用餐空间' },
        { id: 'reservation', name: '预订服务', description: '提前订座服务' },
      ],
      ecommerce: [
        { id: 'online-sales', name: '在线销售', description: '网上购物服务' },
        { id: 'custom-orders', name: '定制服务', description: '个性化定制产品' },
        { id: 'wholesale', name: '批发业务', description: '大宗采购服务' },
        { id: 'consultation', name: '产品咨询', description: '专业选购建议' },
        { id: 'after-sales', name: '售后服务', description: '产品维护支持' },
        { id: 'installation', name: '安装服务', description: '产品安装指导' },
      ],
      service: [
        { id: 'consulting', name: '专业咨询', description: '行业专业建议' },
        { id: 'implementation', name: '方案实施', description: '解决方案执行' },
        { id: 'maintenance', name: '维护服务', description: '持续维护支持' },
        { id: 'training', name: '培训服务', description: '专业技能培训' },
        { id: 'support', name: '技术支持', description: '7×24技术支持' },
        { id: 'custom-development', name: '定制开发', description: '个性化解决方案' },
      ],
    };

    return suggestions[selectedCategory.id] || [];
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-3">详述您的服务内容</h2>
        <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">
          具体描述您提供的服务和产品，这将帮助我们为您设计最合适的展示方式
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Services Selection */}
        <MultiSelectField
          label="主要服务"
          value={services}
          onChange={setServices}
          options={getServiceSuggestions()}
          placeholder="搜索或选择您提供的服务..."
          description="选择您主要提供的服务类型"
          maxSelections={6}
        />

        {/* Custom Services Input */}
        <FormField
          label="其他服务"
          value={services.filter((s) => !getServiceSuggestions().find((opt) => opt.id === s)).join(', ')}
          onChange={(value) => {
            const predefinedServices = services.filter((s) => getServiceSuggestions().find((opt) => opt.id === s));
            const customServices = value
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s);
            setServices([...predefinedServices, ...customServices]);
          }}
          placeholder="如果上面没有您的服务，请手动输入，用逗号分隔"
          description="补充其他未列出的服务项目"
        />

        {/* Products */}
        <FormField
          label="核心产品"
          value={products.join(', ')}
          onChange={(value) =>
            setProducts(
              value
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s),
            )
          }
          placeholder="列出您的主要产品，用逗号分隔"
          description="如果适用，列出您销售或展示的产品"
        />

        {/* Key Features */}
        <FormField
          label="关键特色"
          value={keyFeatures.join(', ')}
          onChange={(value) =>
            setKeyFeatures(
              value
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s),
            )
          }
          placeholder="高品质、快速交付、专业团队、创新技术..."
          description="突出您的服务或产品的主要优势特色"
          required
        />

        {/* Pricing Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="has-pricing"
              checked={hasPricing}
              onChange={(e) => setHasPricing(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor rounded focus:ring-blue-500"
            />
            <label htmlFor="has-pricing" className="text-sm font-medium text-bolt-elements-textPrimary">
              需要在网站上显示价格信息
            </label>
          </div>

          {hasPricing && (
            <div className="space-y-4 pl-7">
              <div>
                <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">定价结构</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'free', label: '免费服务' },
                    { value: 'fixed', label: '固定价格' },
                    { value: 'subscription', label: '订阅制' },
                    { value: 'custom', label: '定制报价' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        updateData({
                          pricing: { ...data.pricing!, structure: option.value as any },
                        })
                      }
                      className={`
                        px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          data.pricing?.structure === option.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary border border-bolt-elements-borderColor hover:border-blue-300'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                label="定价详情"
                value={data.pricing?.details || ''}
                onChange={(value) =>
                  updateData({
                    pricing: { ...data.pricing!, details: value },
                  })
                }
                type="textarea"
                placeholder="具体的价格信息、套餐说明等..."
                description="详细说明您的定价方案"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {(services.length > 0 || products.length > 0) && (
        <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span>
            服务内容预览
          </h4>
          <div className="space-y-3">
            {services.length > 0 && (
              <div>
                <span className="text-sm font-medium text-green-700">主要服务：</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {services.map((service, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {products.length > 0 && (
              <div>
                <span className="text-sm font-medium text-green-700">核心产品：</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {products.map((product, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
          下一步：设计偏好
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
