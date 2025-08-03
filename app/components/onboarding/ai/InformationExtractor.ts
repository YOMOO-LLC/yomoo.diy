// Information extraction utilities for AI-powered onboarding
import { type OnboardingData } from '~/components/onboarding/OnboardingData';
import { type AIRole } from './AIRoleSystem';

export interface ExtractionResult {
  extracted: Partial<OnboardingData>;
  confidence: number;
  missingFields: string[];
  completionStatus: boolean;
}

export interface ConversationContext {
  step: number;
  aiRole: AIRole;
  messages: Array<{ role: 'ai' | 'user'; content: string }>;
  currentData: Partial<OnboardingData>;
}

export class InformationExtractor {
  /**
   * Creates extraction prompts for the LLM to extract structured information
   */
  static createExtractionPrompt(context: ConversationContext): string {
    const { step, aiRole, messages, currentData } = context;

    const conversationHistory = messages.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');

    const basePrompt = `
你是一个信息提取专家。请从以下对话中提取结构化信息。

## 当前步骤: ${step} - ${aiRole.title}
## AI角色: ${aiRole.name} (${aiRole.title})

## 完成标准:
${aiRole.completionCriteria.map((criteria, i) => `${i + 1}. ${criteria}`).join('\n')}

## 对话历史:
${conversationHistory}

## 当前已有数据:
${JSON.stringify(currentData, null, 2)}

请按照以下JSON格式返回提取结果，不要包含任何其他文本:
`;

    switch (step) {
      case 1:
        return (
          basePrompt +
          `
{
  "extracted": {
    "businessCategory": "选择的业务类别ID (restaurant/ecommerce/service/portfolio/saas/blog/nonprofit/education)",
    "businessSubcategory": "具体的业务细分",
    "description": "业务描述",
    "targetAudience": "目标客户群体"
  },
  "confidence": 0.95,
  "missingFields": ["如果还缺少某些关键信息，列出字段名"],
  "completionStatus": true
}`
        );

      case 2:
        return (
          basePrompt +
          `
{
  "extracted": {
    "businessName": "业务/品牌名称",
    "tagline": "品牌标语或口号",
    "description": "更详细的品牌故事和描述",
    "uniqueValueProposition": "核心价值主张"
  },
  "confidence": 0.95,
  "missingFields": [],
  "completionStatus": true
}`
        );

      case 3:
        return (
          basePrompt +
          `
{
  "extracted": {
    "services": ["服务1", "服务2", "服务3"],
    "products": ["产品1", "产品2"],
    "keyFeatures": ["特色功能1", "特色功能2"],
    "pricing": {
      "hasPricing": true,
      "structure": "fixed|subscription|custom|free",
      "details": "定价详情描述"
    }
  },
  "confidence": 0.95,
  "missingFields": [],
  "completionStatus": true
}`
        );

      case 4:
        return (
          basePrompt +
          `
{
  "extracted": {
    "designStyle": "modern|classic|bold|minimal|creative",
    "primaryColor": "#2563eb",
    "colorScheme": "#2563eb-#f8fafc",
    "hasLogo": true,
    "logoUrl": "Logo URL或描述"
  },
  "confidence": 0.95,
  "missingFields": [],
  "completionStatus": true
}`
        );

      case 5:
        return (
          basePrompt +
          `
{
  "extracted": {
    "contactInfo": {
      "email": "邮箱地址",
      "phone": "电话号码",
      "address": "地址",
      "website": "官网"
    },
    "socialMedia": {
      "wechat": "微信号",
      "weibo": "微博",
      "douyin": "抖音",
      "xiaohongshu": "小红书"
    },
    "integrations": ["analytics", "maps", "booking", "payment"]
  },
  "confidence": 0.95,
  "missingFields": [],
  "completionStatus": true
}`
        );

      default:
        return (
          basePrompt +
          `
{
  "extracted": {},
  "confidence": 0.0,
  "missingFields": [],
  "completionStatus": false
}`
        );
    }
  }

  /**
   * Generate appropriate follow-up questions based on missing information
   */
  static generateFollowUpPrompt(context: ConversationContext, extractionResult: ExtractionResult): string {
    const { aiRole } = context;
    const { missingFields, completionStatus } = extractionResult;

    if (completionStatus) {
      return this.generateCompletionMessage(aiRole);
    }

    const basePrompt = `
你是${aiRole.name}，一位${aiRole.title}。
性格特点: ${aiRole.personality}
提问策略: ${aiRole.questionStrategy}

基于当前对话，你还需要收集以下信息: ${missingFields.join('、')}

请生成一个自然、友好的回复，继续收集这些信息。回复应该:
1. 体现你的性格特点
2. 遵循你的提问策略
3. 一次只问1-2个关键问题
4. 保持对话的自然流畅

请直接返回回复内容，不要包含其他格式:
`;

    return basePrompt;
  }

  /**
   * Generate completion message when all criteria are met
   */
  static generateCompletionMessage(aiRole: AIRole): string {
    const completionMessages = [
      `太好了！作为${aiRole.title}，我已经收集到了足够的信息。让我来为您总结一下我们讨论的内容...`,
      `完美！基于我们的专业对话，我已经充分了解了您的需求。现在可以进入下一个环节了。`,
      `非常感谢您详细的介绍！作为${aiRole.name}，我认为我们已经收集到了所有必要的信息。`,
      `很好！从${aiRole.title}的角度来看，我们的讨论非常充实，现在可以继续下一步了。`,
    ];

    return completionMessages[Math.floor(Math.random() * completionMessages.length)];
  }

  /**
   * Parse extraction result from LLM response
   */
  static parseExtractionResult(llmResponse: string): ExtractionResult {
    try {
      // Try to extract JSON from response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          extracted: result.extracted || {},
          confidence: result.confidence || 0,
          missingFields: result.missingFields || [],
          completionStatus: result.completionStatus || false,
        };
      }
    } catch (error) {
      console.error('Failed to parse extraction result:', error);
    }

    // Fallback result
    return {
      extracted: {},
      confidence: 0,
      missingFields: [],
      completionStatus: false,
    };
  }

  /**
   * Validate extracted information against step requirements
   */
  static validateExtraction(step: number, extracted: Partial<OnboardingData>): boolean {
    switch (step) {
      case 1:
        return !!(extracted.businessCategory && extracted.description);
      case 2:
        return !!(extracted.businessName && extracted.description);
      case 3:
        return !!(extracted.services?.length || extracted.products?.length);
      case 4:
        return !!(extracted.designStyle && extracted.primaryColor);
      case 5:
        return !!(extracted.contactInfo?.email || extracted.contactInfo?.phone);
      case 6:
        return true; // Final step
      default:
        return false;
    }
  }

  /**
   * Merge extracted data with existing onboarding data
   */
  static mergeData(existing: Partial<OnboardingData>, extracted: Partial<OnboardingData>): Partial<OnboardingData> {
    const merged = { ...existing };

    // Merge basic fields
    Object.keys(extracted).forEach((key) => {
      const value = extracted[key as keyof OnboardingData];

      if (value !== undefined && value !== null && value !== '') {
        if (key === 'contactInfo' || key === 'socialMedia') {
          // Merge nested objects
          const existingValue = existing[key as keyof OnboardingData];
          merged[key as keyof OnboardingData] = {
            ...(existingValue && typeof existingValue === 'object' ? existingValue : {}),
            ...(value && typeof value === 'object' ? value : {}),
          } as any;
        } else if (Array.isArray(value)) {
          // Merge arrays, avoiding duplicates
          const existingArray = (existing[key as keyof OnboardingData] as any[]) || [];
          merged[key as keyof OnboardingData] = [
            ...existingArray,
            ...value.filter((item) => !existingArray.includes(item)),
          ] as any;
        } else {
          merged[key as keyof OnboardingData] = value as any;
        }
      }
    });

    return merged;
  }

  /**
   * Generate summary of collected information for the step
   */
  static summarizeCollectedInfo(step: number, data: Partial<OnboardingData>): string {
    switch (step) {
      case 1:
        return `业务类型: ${data.businessCategory || '未确定'}, 描述: ${data.description || '无'}`;
      case 2:
        return `业务名称: ${data.businessName || '未确定'}, 标语: ${data.tagline || '无'}`;
      case 3:
        return `服务: ${data.services?.join('、') || '无'}, 产品: ${data.products?.join('、') || '无'}`;
      case 4:
        return `设计风格: ${data.designStyle || '未确定'}, 主色调: ${data.primaryColor || '未确定'}`;
      case 5:
        return `联系方式: ${data.contactInfo?.email || '无邮箱'} ${data.contactInfo?.phone || '无电话'}`;
      default:
        return '信息收集中...';
    }
  }
}
