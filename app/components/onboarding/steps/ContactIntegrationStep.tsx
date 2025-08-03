import React from 'react';
import { FormField, MultiSelectField } from '~/components/onboarding/ui/FormField';
import { INTEGRATION_OPTIONS, type OnboardingData } from '~/components/onboarding/OnboardingData';

interface ContactIntegrationStepProps {
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function ContactIntegrationStep({ data, updateData, onNext, onPrev, canProceed }: ContactIntegrationStepProps) {
  const [integrations, setIntegrations] = React.useState<string[]>(data.integrations || []);

  React.useEffect(() => {
    updateData({ integrations });
  }, [integrations]);

  const contactInfo = data.contactInfo || { email: '', phone: '', address: '', website: '' };
  const socialMedia = data.socialMedia || {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    wechat: '',
    weibo: '',
    douyin: '',
    xiaohongshu: '',
  };

  const updateContactInfo = (field: string, value: string) => {
    updateData({
      contactInfo: {
        ...contactInfo,
        [field]: value,
      },
    });
  };

  const updateSocialMedia = (platform: string, value: string) => {
    updateData({
      socialMedia: {
        ...socialMedia,
        [platform]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-3">联系方式与功能集成</h2>
        <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">
          添加您的联系信息和需要的功能集成，让访客能够轻松联系您
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4 flex items-center gap-2">
            <span className="text-xl">📞</span>
            基本联系信息
          </h3>
          <div className="space-y-4">
            <FormField
              label="邮箱地址"
              value={contactInfo.email || ''}
              onChange={(value) => updateContactInfo('email', value)}
              type="email"
              placeholder="contact@example.com"
              description="客户联系您的主要邮箱"
              required
            />

            <FormField
              label="联系电话"
              value={contactInfo.phone || ''}
              onChange={(value) => updateContactInfo('phone', value)}
              type="tel"
              placeholder="400-123-4567"
              description="客户咨询和预约的电话号码"
            />

            <FormField
              label="地址信息"
              value={contactInfo.address || ''}
              onChange={(value) => updateContactInfo('address', value)}
              placeholder="详细的营业地址（如果有实体店面）"
              description="如果有实体店面或办公地址"
            />

            <FormField
              label="官方网站"
              value={contactInfo.website || ''}
              onChange={(value) => updateContactInfo('website', value)}
              type="url"
              placeholder="https://www.example.com"
              description="如果您已有其他官方网站"
            />
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4 flex items-center gap-2">
            <span className="text-xl">🌐</span>
            社交媒体链接
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="微信公众号"
                value={socialMedia.wechat || ''}
                onChange={(value) => updateSocialMedia('wechat', value)}
                placeholder="公众号名称或二维码链接"
              />

              <FormField
                label="微博"
                value={socialMedia.weibo || ''}
                onChange={(value) => updateSocialMedia('weibo', value)}
                placeholder="https://weibo.com/username"
              />

              <FormField
                label="抖音"
                value={socialMedia.douyin || ''}
                onChange={(value) => updateSocialMedia('douyin', value)}
                placeholder="抖音号或链接"
              />

              <FormField
                label="小红书"
                value={socialMedia.xiaohongshu || ''}
                onChange={(value) => updateSocialMedia('xiaohongshu', value)}
                placeholder="小红书链接"
              />

              <FormField
                label="Facebook"
                value={socialMedia.facebook || ''}
                onChange={(value) => updateSocialMedia('facebook', value)}
                placeholder="https://facebook.com/page"
              />

              <FormField
                label="Instagram"
                value={socialMedia.instagram || ''}
                onChange={(value) => updateSocialMedia('instagram', value)}
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
        </div>

        {/* Feature Integrations */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4 flex items-center gap-2">
            <span className="text-xl">🔧</span>
            功能集成
          </h3>
          <MultiSelectField
            label="需要集成的功能"
            value={integrations}
            onChange={setIntegrations}
            options={INTEGRATION_OPTIONS}
            placeholder="搜索需要的功能..."
            description="选择您希望在网站中集成的第三方功能"
            maxSelections={5}
          />
        </div>

        {/* Additional Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            额外要求
          </h3>
          <FormField
            label="其他特殊需求"
            value={data.additionalRequirements || ''}
            onChange={(value) => updateData({ additionalRequirements: value })}
            type="textarea"
            placeholder="如果您有其他特殊要求或想法，请在这里详细说明..."
            description="任何我们上面没有涵盖到的需求都可以在这里说明"
            rows={4}
          />
        </div>

        {/* Contact Preview */}
        {(contactInfo.email || contactInfo.phone) && (
          <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-200 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📋</span>
              联系信息预览
            </h4>
            <div className="space-y-2 text-sm">
              {contactInfo.email && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📧</span>
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📱</span>
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.address && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📍</span>
                  <span>{contactInfo.address}</span>
                </div>
              )}
              {Object.entries(socialMedia).filter(([_, url]) => url).length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🌐</span>
                  <span>社交媒体: {Object.entries(socialMedia).filter(([_, url]) => url).length} 个平台</span>
                </div>
              )}
              {integrations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">⚙️</span>
                  <span>功能集成: {integrations.length} 项</span>
                </div>
              )}
            </div>
          </div>
        )}
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
          最后一步：预览确认
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
