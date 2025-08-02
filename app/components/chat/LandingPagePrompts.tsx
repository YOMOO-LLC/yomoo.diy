import React from 'react';

const LANDING_PAGE_PROMPTS = [
  {
    text: '我想为我的餐厅创建一个 Landing Page',
    category: 'restaurant',
    icon: '🍽️',
    description: '餐厅、咖啡厅、美食服务',
  },
  {
    text: '我需要一个电商产品展示页面',
    category: 'ecommerce',
    icon: '🛍️',
    description: '在线商店、产品销售',
  },
  {
    text: '我要展示我的专业服务',
    category: 'service',
    icon: '🔧',
    description: '咨询、维修、专业服务',
  },
  {
    text: '我想创建个人作品集网站',
    category: 'portfolio',
    icon: '🎨',
    description: '设计师、摄影师、创作者',
  },
  {
    text: '我需要一个 SaaS 产品介绍页',
    category: 'saas',
    icon: '💻',
    description: '软件产品、在线工具',
  },
  {
    text: '我想建立个人博客首页',
    category: 'blog',
    icon: '📝',
    description: '博客、内容创作',
  },
];

interface LandingPagePromptsProps {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

export function LandingPagePrompts({ sendMessage }: LandingPagePromptsProps) {
  return (
    <div
      id="landing-page-prompts"
      className="relative flex flex-col gap-6 w-full max-w-4xl mx-auto flex justify-center mt-6"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 px-4 py-2 rounded-full mb-4">
          <span className="text-2xl">🚀</span>
          <span className="text-sm font-medium text-bolt-elements-textPrimary">Landing Page 创建模式</span>
        </div>
        <h3 className="text-xl font-bold text-bolt-elements-textPrimary mb-3">AI 为您打造专业级 Landing Page</h3>
        <p className="text-sm text-bolt-elements-textSecondary max-w-2xl mx-auto leading-relaxed">
          选择您的业务类型，AI 将通过智能对话收集您的需求，然后生成完整的、可预览的专业网站项目。
          <br />
          <span className="text-xs opacity-75 mt-1 block">包含 HTML、CSS、JavaScript，支持响应式设计和实时预览</span>
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {LANDING_PAGE_PROMPTS.map((prompt, index) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, prompt.text);
              }}
              className="group relative p-4 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 hover:border-bolt-elements-borderColorHover transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-1">{prompt.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-bolt-elements-textPrimary group-hover:text-bolt-elements-textPrimaryHover mb-1">
                    {prompt.text}
                  </div>
                  <div className="text-xs text-bolt-elements-textSecondary">{prompt.description}</div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-bolt-elements-focus/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-bolt-elements-textSecondary">或者直接在下方输入框描述您的需求</p>
      </div>
    </div>
  );
}

export default LandingPagePrompts;
