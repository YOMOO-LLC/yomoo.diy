import React from 'react';
import { FormField } from '~/components/onboarding/ui/FormField';
import { BUSINESS_CATEGORIES, type OnboardingData } from '~/components/onboarding/OnboardingData';

interface BusinessInfoStepProps {
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function BusinessInfoStep({ data, updateData, onNext, onPrev, canProceed }: BusinessInfoStepProps) {
  const selectedCategory = data.businessCategory ? BUSINESS_CATEGORIES[data.businessCategory] : null;

  // Smart suggestions based on business category
  const getTaglineSuggestions = () => {
    if (!selectedCategory) {
      return [];
    }

    const suggestions: Record<string, string[]> = {
      restaurant: ['正宗美食，用心制作', '新鲜食材，地道口味', '味蕾上的艺术之旅', '传统工艺，现代体验'],
      ecommerce: ['品质生活，从这里开始', '精选好物，值得信赖', '让生活更美好', '品质优选，价格实惠'],
      service: ['专业服务，值得信赖', '专业团队，专业服务', '让专业成就您的成功', '品质服务，客户至上'],
      portfolio: ['创意无限，设计有我', '用设计讲述故事', '创造美好，分享精彩', '专业创作，用心设计'],
      saas: ['提升效率，简化工作', '让工作更智能', '专业工具，助力成功', '创新科技，服务未来'],
      blog: ['分享生活，记录美好', '用文字连接世界', '记录思考，分享智慧', '生活有态度，文字有温度'],
    };

    return suggestions[selectedCategory.id] || [];
  };

  const getTargetAudienceSuggestions = () => {
    if (!selectedCategory) {
      return [];
    }

    const suggestions: Record<string, string[]> = {
      restaurant: ['美食爱好者', '本地居民', '商务人士', '年轻白领', '家庭聚餐客群', '外国游客'],
      ecommerce: ['年轻消费者', '品质追求者', '价格敏感用户', '忠实用户', '新客户', '企业采购'],
      service: ['中小企业主', '创业者', '个人用户', '企业客户', '专业人士', '需要解决方案的用户'],
      portfolio: ['潜在客户', '设计爱好者', '企业雇主', '合作伙伴', '同行设计师', '媒体记者'],
      saas: ['中小企业', '团队管理者', '个人用户', '初创公司', '大型企业', '远程工作者'],
      blog: ['同龄读者', '兴趣爱好者', '专业人士', '学习者', '内容创作者', '社区成员'],
    };

    return suggestions[selectedCategory.id] || [];
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-3">填写基本信息</h2>
        <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">
          告诉我们关于您业务的基本信息，这些将成为您网站的核心内容
        </p>
      </div>

      {/* Selected Category Reminder */}
      {selectedCategory && (
        <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-200 rounded-lg">
          <span className="text-2xl">{selectedCategory.icon}</span>
          <div>
            <span className="text-sm text-bolt-elements-textSecondary">您选择的业务类型：</span>
            <span className="ml-2 font-medium text-bolt-elements-textPrimary">
              {selectedCategory.title} - {data.businessSubcategory}
            </span>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-6">
        <FormField
          label="业务名称"
          value={data.businessName || ''}
          onChange={(value) => updateData({ businessName: value })}
          placeholder="例如：张师傅的意式料理、小明的设计工作室"
          description="这将作为您网站的主标题显示"
          required
          maxLength={50}
        />

        <FormField
          label="业务标语"
          value={data.tagline || ''}
          onChange={(value) => updateData({ tagline: value })}
          placeholder="一句话描述您的业务特色"
          description="简短有力的标语，让访客快速了解您的特色"
          suggestions={getTaglineSuggestions()}
          maxLength={80}
        />

        <FormField
          label="业务描述"
          value={data.description || ''}
          onChange={(value) => updateData({ description: value })}
          type="textarea"
          placeholder="详细介绍您的业务，包括历史、特色、优势等..."
          description="这段描述将帮助访客更好地了解您的业务"
          required
          maxLength={500}
          rows={4}
        />

        <FormField
          label="目标受众"
          value={data.targetAudience || ''}
          onChange={(value) => updateData({ targetAudience: value })}
          placeholder="您希望吸引哪些客户？"
          description="描述您的理想客户群体，这将影响网站的设计风格和内容重点"
          suggestions={getTargetAudienceSuggestions()}
          maxLength={200}
        />

        <FormField
          label="核心价值主张"
          value={data.uniqueValueProposition || ''}
          onChange={(value) => updateData({ uniqueValueProposition: value })}
          type="textarea"
          placeholder="什么让您与众不同？为什么客户应该选择您？"
          description="突出您的独特优势，让访客选择您而不是竞争对手的理由"
          maxLength={300}
          rows={3}
        />
      </div>

      {/* Tips Section */}
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 border border-yellow-200 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
          <span className="text-xl">💡</span>
          填写小贴士
        </h4>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>
            • <strong>业务名称</strong>：简洁易记，避免过于复杂的词汇
          </li>
          <li>
            • <strong>标语</strong>：突出最核心的特色或承诺
          </li>
          <li>
            • <strong>描述</strong>：真实具体，避免空洞的形容词
          </li>
          <li>
            • <strong>目标受众</strong>：越具体越好，有助于精准定位
          </li>
          <li>
            • <strong>价值主张</strong>：从客户角度思考，他们能获得什么好处
          </li>
        </ul>
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
          下一步：服务详情
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
