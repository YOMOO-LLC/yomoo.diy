// Onboarding data types and management utilities

export interface BusinessCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  subcategories: string[];
  samples: string[];
  keyFields: string[];
  suggestedFeatures: string[];
}

export interface OnboardingData {
  // Step 1: Business Type
  businessCategory: string;
  businessSubcategory: string;

  // Step 2: Business Information
  businessName: string;
  tagline: string;
  description: string;
  targetAudience: string;
  uniqueValueProposition: string;

  // Step 3: Service/Content Details
  services: string[];
  products: string[];
  pricing: {
    hasPricing: boolean;
    structure: 'free' | 'fixed' | 'subscription' | 'custom';
    details: string;
  };
  keyFeatures: string[];

  // Step 4: Design & Brand Preferences
  designStyle: 'modern' | 'classic' | 'bold' | 'minimal' | 'creative';
  primaryColor: string;
  colorScheme: string;
  hasLogo: boolean;
  logoUrl?: string;

  // Step 5: Contact & Integration
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    wechat?: string;
    weibo?: string;
    douyin?: string;
    xiaohongshu?: string;
  };
  integrations: string[];

  // Step 6: Additional Requirements
  additionalRequirements: string;
  customFeatures: string[];
}

export const BUSINESS_CATEGORIES: Record<string, BusinessCategory> = {
  restaurant: {
    id: 'restaurant',
    icon: '🍽️',
    title: '餐饮服务',
    description: '餐厅、咖啡厅、美食服务',
    subcategories: ['精品餐厅', '快餐连锁', '咖啡厅', '酒吧', '外卖服务', '烘焙店'],
    samples: ['意式料理餐厅', '手工咖啡店', '日式拉面馆', '精酿啤酒吧'],
    keyFields: ['菜单特色', '营业时间', '位置信息', '预订系统'],
    suggestedFeatures: ['在线菜单', '预订系统', '外卖下单', '位置地图', '顾客评价'],
  },
  ecommerce: {
    id: 'ecommerce',
    icon: '🛍️',
    title: '电商零售',
    description: '在线商店、产品销售',
    subcategories: ['时尚服装', '电子产品', '家居用品', '美妆护肤', '运动户外', '手工艺品'],
    samples: ['手工饰品店', '智能家居', '有机护肤品', '运动装备'],
    keyFields: ['产品展示', '购物车', '支付集成', '物流信息'],
    suggestedFeatures: ['产品展示', '购物车', '在线支付', '订单跟踪', '客户评价', '优惠券系统'],
  },
  service: {
    id: 'service',
    icon: '🔧',
    title: '专业服务',
    description: '咨询、维修、专业服务',
    subcategories: ['商业咨询', '设计服务', '技术支持', '法律服务', '财务咨询', '维修服务'],
    samples: ['品牌设计工作室', 'IT咨询公司', '法律事务所', '财务顾问'],
    keyFields: ['服务范围', '专业资质', '成功案例', '联系方式'],
    suggestedFeatures: ['服务介绍', '案例展示', '在线咨询', '预约系统', '专家介绍'],
  },
  portfolio: {
    id: 'portfolio',
    icon: '🎨',
    title: '个人作品集',
    description: '设计师、摄影师、创作者',
    subcategories: ['平面设计', '摄影作品', 'UI/UX设计', '插画艺术', '建筑设计', '音乐制作'],
    samples: ['UI设计师作品集', '婚礼摄影师', '插画师个人站', '建筑师展示'],
    keyFields: ['作品展示', '个人简介', '服务项目', '联系方式'],
    suggestedFeatures: ['作品画廊', '个人简介', '服务价格', '客户推荐', '联系表单'],
  },
  saas: {
    id: 'saas',
    icon: '💻',
    title: 'SaaS 产品',
    description: '软件产品、在线工具',
    subcategories: ['生产力工具', '营销工具', '设计工具', '数据分析', '协作平台', '开发工具'],
    samples: ['项目管理工具', '社交媒体管理', '设计协作平台', '数据仪表板'],
    keyFields: ['产品功能', '定价方案', '免费试用', '技术支持'],
    suggestedFeatures: ['功能介绍', '定价表格', '免费试用', '用户评价', '产品演示', 'API文档'],
  },
  blog: {
    id: 'blog',
    icon: '📝',
    title: '个人博客',
    description: '博客、内容创作',
    subcategories: ['技术博客', '生活分享', '旅行日记', '美食评测', '读书笔记', '投资理财'],
    samples: ['前端技术博客', '旅行摄影日记', '美食探店博客', '读书分享'],
    keyFields: ['内容分类', '个人介绍', '文章归档', '社交链接'],
    suggestedFeatures: ['文章列表', '分类标签', '搜索功能', '评论系统', '社交分享', '订阅功能'],
  },
  nonprofit: {
    id: 'nonprofit',
    icon: '🤝',
    title: '公益组织',
    description: '非营利组织、慈善机构',
    subcategories: ['环保组织', '教育公益', '扶贫助困', '动物保护', '医疗援助', '社区服务'],
    samples: ['环保志愿者组织', '教育基金会', '动物救助站', '社区互助'],
    keyFields: ['组织使命', '项目介绍', '捐款渠道', '志愿者招募'],
    suggestedFeatures: ['使命介绍', '项目展示', '在线捐赠', '志愿者申请', '新闻动态', '影响报告'],
  },
  education: {
    id: 'education',
    icon: '🎓',
    title: '教育培训',
    description: '在线教育、培训机构',
    subcategories: ['语言培训', '职业技能', '学术辅导', '艺术培训', '体育教学', '兴趣课程'],
    samples: ['英语培训机构', '编程训练营', '音乐学校', '健身教练'],
    keyFields: ['课程体系', '师资介绍', '学员成果', '报名方式'],
    suggestedFeatures: ['课程介绍', '师资展示', '学员评价', '在线报名', '学习进度', '证书展示'],
  },
};

export const DESIGN_STYLES = {
  modern: {
    name: '现代简约',
    description: '简洁线条，大胆留白，注重功能性',
    colorPalettes: ['#2563eb-#f8fafc', '#059669-#ecfdf5', '#7c3aed-#f3e8ff'],
  },
  classic: {
    name: '经典优雅',
    description: '传统美学，优雅配色，专业可信',
    colorPalettes: ['#1f2937-#f9fafb', '#92400e-#fef7ed', '#1e40af-#eff6ff'],
  },
  bold: {
    name: '大胆创新',
    description: '鲜明对比，强烈视觉冲击',
    colorPalettes: ['#dc2626-#fef2f2', '#ea580c-#fff7ed', '#9333ea-#faf5ff'],
  },
  minimal: {
    name: '极简主义',
    description: '极致简洁，突出内容本身',
    colorPalettes: ['#000000-#ffffff', '#374151-#f9fafb', '#6b7280-#f3f4f6'],
  },
  creative: {
    name: '创意个性',
    description: '独特风格，富有创意表达',
    colorPalettes: ['#f59e0b-#fffbeb', '#10b981-#d1fae5', '#8b5cf6-#ede9fe'],
  },
};

export const INTEGRATION_OPTIONS = [
  { id: 'analytics', name: 'Google Analytics', description: '网站访问统计' },
  { id: 'maps', name: '地图定位', description: 'Google Maps 集成' },
  { id: 'booking', name: '在线预订', description: '预约系统集成' },
  { id: 'payment', name: '在线支付', description: '支付网关集成' },
  { id: 'chat', name: '在线客服', description: '实时聊天功能' },
  { id: 'social', name: '社交登录', description: '第三方登录集成' },
  { id: 'newsletter', name: '邮件订阅', description: '邮件营销集成' },
  { id: 'reviews', name: '评价系统', description: '客户评价展示' },
  { id: 'crm', name: 'CRM系统', description: '客户关系管理' },
  { id: 'inventory', name: '库存管理', description: '产品库存系统' },
];

// Utility functions for managing onboarding data
export class OnboardingDataManager {
  private static _storageKey = 'bolt-onboarding-data';

  static saveData(data: Partial<OnboardingData>): void {
    const existingData = this.loadData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(this._storageKey, JSON.stringify(updatedData));
  }

  static loadData(): Partial<OnboardingData> {
    try {
      const stored = localStorage.getItem(this._storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  static clearData(): void {
    localStorage.removeItem(this._storageKey);
  }

  static generatePrompt(data: OnboardingData): string {
    const category = BUSINESS_CATEGORIES[data.businessCategory];
    const designStyle = DESIGN_STYLES[data.designStyle];

    return `请为 "${data.businessName}" 创建一个专业的 ${category.title} Landing Page。

## 业务信息
- 业务名称：${data.businessName}
- 标语：${data.tagline}
- 业务描述：${data.description}
- 业务类型：${data.businessSubcategory}
- 目标受众：${data.targetAudience}
- 核心价值：${data.uniqueValueProposition}

## 服务/产品
- 主要服务：${data.services.join('、')}
- 核心产品：${data.products.join('、')}
- 关键特性：${data.keyFeatures.join('、')}
${data.pricing.hasPricing ? `- 定价结构：${data.pricing.structure} - ${data.pricing.details}` : ''}

## 设计要求
- 设计风格：${designStyle.name} - ${designStyle.description}
- 主色调：${data.primaryColor}
- 配色方案：${data.colorScheme}
${data.hasLogo ? `- 品牌Logo：${data.logoUrl}` : ''}

## 联系信息
- 邮箱：${data.contactInfo.email}
- 电话：${data.contactInfo.phone}
- 地址：${data.contactInfo.address}
${data.contactInfo.website ? `- 官网：${data.contactInfo.website}` : ''}

## 社交媒体
${Object.entries(data.socialMedia)
  .filter(([_, url]) => url)
  .map(([platform, url]) => `- ${platform}: ${url}`)
  .join('\n')}

## 功能集成
${data.integrations.length > 0 ? `需要集成：${data.integrations.join('、')}` : ''}

${data.additionalRequirements ? `## 额外要求\n${data.additionalRequirements}` : ''}

请生成完整的响应式网站，包含以下模块：
1. Hero 区域（包含主标语和核心价值）
2. 服务/产品展示区域
3. 特色功能介绍
4. 关于我们/公司介绍
5. 联系信息和表单
6. 页脚（包含社交媒体链接）

要求达到 Apple、Stripe 级别的设计品质，具有强烈的情感感染力和专业性。使用现代 HTML5、CSS3 和 JavaScript，确保完全响应式设计。`;
  }

  static validateStep(step: number, data: Partial<OnboardingData>): boolean {
    switch (step) {
      case 1:
        return !!(data.businessCategory && data.businessSubcategory);
      case 2:
        return !!(data.businessName && data.tagline && data.description);
      case 3:
        return !!(data.services?.length || data.products?.length);
      case 4:
        return !!(data.designStyle && data.primaryColor);
      case 5:
        return !!data.contactInfo?.email;
      default:
        return true;
    }
  }
}

// Default empty onboarding data
export const createEmptyOnboardingData = (): Partial<OnboardingData> => ({
  businessCategory: '',
  businessSubcategory: '',
  businessName: '',
  tagline: '',
  description: '',
  targetAudience: '',
  uniqueValueProposition: '',
  services: [],
  products: [],
  pricing: {
    hasPricing: false,
    structure: 'free',
    details: '',
  },
  keyFeatures: [],
  designStyle: 'modern',
  primaryColor: '#2563eb',
  colorScheme: '#2563eb-#f8fafc',
  hasLogo: false,
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    website: '',
  },
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    wechat: '',
    weibo: '',
    douyin: '',
    xiaohongshu: '',
  },
  integrations: [],
  additionalRequirements: '',
  customFeatures: [],
});
