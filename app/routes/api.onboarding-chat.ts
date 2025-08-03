import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText, type Messages } from '~/lib/.server/llm/stream-text';
import { createScopedLogger } from '~/utils/logger';
import {
  InformationExtractor,
  type ConversationContext,
  type ExtractionResult,
} from '~/components/onboarding/ai/InformationExtractor';
import { getAIRoleForStep } from '~/components/onboarding/ai/AIRoleSystem';
import type { OnboardingData } from '~/components/onboarding/OnboardingData';

export async function action(args: ActionFunctionArgs) {
  return onboardingChatAction(args);
}

const logger = createScopedLogger('api.onboarding-chat');

async function onboardingChatAction({ context, request }: ActionFunctionArgs) {
  try {
    const { step, messages, currentData, mode } = await request.json<{
      step: number;
      messages: Array<{ role: 'ai' | 'user'; content: string }>;
      currentData: Partial<OnboardingData>;
      mode: 'extract' | 'respond';
    }>();

    // const aiRole = getAIRoleForStep(step);

    if (mode === 'extract') {
      // Information extraction mode
      return await handleInformationExtraction({ step, messages, currentData, context });
    } else {
      // AI response generation mode
      return await handleAIResponse({ step, messages, currentData, context });
    }
  } catch (error) {
    logger.error('Error in onboarding chat:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process onboarding chat',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

async function handleInformationExtraction({
  step,
  messages,
  currentData,
  context,
}: {
  step: number;
  messages: Array<{ role: 'ai' | 'user'; content: string }>;
  currentData: Partial<OnboardingData>;
  context: any;
}) {
  const aiRole = getAIRoleForStep(step);

  const conversationContext: ConversationContext = {
    step,
    aiRole,
    messages,
    currentData,
  };

  // Create extraction prompt
  const extractionPrompt = InformationExtractor.createExtractionPrompt(conversationContext);

  // Prepare messages for LLM
  const llmMessages: Messages = [
    {
      id: `system-${Date.now()}`,
      role: 'system',
      content: extractionPrompt,
    },
    {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messages[messages.length - 1]?.content || '',
    },
  ];

  try {
    // Call LLM for information extraction
    const response = await streamText({
      messages: llmMessages,
      env: context.cloudflare?.env,
      options: {
        maxTokens: 500, // Limit tokens for extraction
      },
    });

    // Convert stream to text
    let extractionResponse = '';
    const reader = response.textStream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        extractionResponse += value;
      }
    } finally {
      reader.releaseLock();
    }

    // Parse extraction result
    const extractionResult = InformationExtractor.parseExtractionResult(extractionResponse);

    return new Response(JSON.stringify(extractionResult), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error in information extraction:', error);

    // Fallback extraction result
    const fallbackResult: ExtractionResult = {
      extracted: {},
      confidence: 0,
      missingFields: ['信息提取失败'],
      completionStatus: false,
    };

    return new Response(JSON.stringify(fallbackResult), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleAIResponse({
  step,
  messages,
  currentData,
  context,
}: {
  step: number;
  messages: Array<{ role: 'ai' | 'user'; content: string }>;
  currentData: Partial<OnboardingData>;
  context: any;
}) {
  const aiRole = getAIRoleForStep(step);

  const conversationContext: ConversationContext = {
    step,
    aiRole,
    messages,
    currentData,
  };

  /*
   * Create a mock extraction result for follow-up generation
   * In practice, this would come from the previous extraction call
   */
  const mockExtraction: ExtractionResult = {
    extracted: currentData,
    confidence: 0.7,
    missingFields: determineMissingFields(step, currentData),
    completionStatus: InformationExtractor.validateExtraction(step, currentData),
  };

  // Generate follow-up prompt
  const followUpPrompt = InformationExtractor.generateFollowUpPrompt(conversationContext, mockExtraction);

  // Prepare messages for LLM
  const llmMessages: Messages = [
    {
      id: `system-${Date.now()}`,
      role: 'system',
      content: aiRole.systemPrompt,
    },
    ...messages.map((msg, index) => ({
      id: `msg-${Date.now()}-${index}`,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      id: `followup-${Date.now()}`,
      role: 'user',
      content: followUpPrompt,
    },
  ];

  try {
    // Call LLM for response generation
    const response = await streamText({
      messages: llmMessages,
      env: context.cloudflare?.env,
      options: {
        maxTokens: 300, // Limit tokens for conversational response
      },
    });

    // Return streaming response
    return new Response(response.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    logger.error('Error in AI response generation:', error);

    // Fallback response
    const fallbackResponses = [
      '抱歉，我遇到了一些技术问题。请重新告诉我您的需求。',
      '让我们重新开始，请告诉我更多关于您业务的信息。',
      '系统暂时有些问题，请简单描述一下您的需求。',
    ];

    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return new Response(fallbackResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

function determineMissingFields(step: number, data: Partial<OnboardingData>): string[] {
  const missing: string[] = [];

  switch (step) {
    case 1:
      if (!data.businessCategory) {
        missing.push('业务类型');
      }

      if (!data.description) {
        missing.push('业务描述');
      }

      if (!data.targetAudience) {
        missing.push('目标客户');
      }

      break;
    case 2:
      if (!data.businessName) {
        missing.push('业务名称');
      }

      if (!data.tagline) {
        missing.push('品牌标语');
      }

      if (!data.uniqueValueProposition) {
        missing.push('核心价值');
      }

      break;
    case 3:
      if (!data.services?.length && !data.products?.length) {
        missing.push('服务或产品');
      }

      if (!data.keyFeatures?.length) {
        missing.push('核心特色');
      }

      break;
    case 4:
      if (!data.designStyle) {
        missing.push('设计风格');
      }

      if (!data.primaryColor) {
        missing.push('主色调');
      }

      break;
    case 5:
      if (!data.contactInfo?.email && !data.contactInfo?.phone) {
        missing.push('联系方式');
      }

      break;
  }

  return missing;
}
