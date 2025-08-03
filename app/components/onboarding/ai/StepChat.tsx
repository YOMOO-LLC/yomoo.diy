import React, { useState, useEffect, useRef } from 'react';
import { getAIRoleForStep, type AIRole } from './AIRoleSystem';
import { type OnboardingData } from '~/components/onboarding/OnboardingData';
import { InformationExtractor, type ExtractionResult, type ConversationContext } from './InformationExtractor';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface StepChatProps {
  step: number;
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

export function StepChat({ step, data, updateData, onNext, onPrev }: StepChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiRole: AIRole = getAIRoleForStep(step);

  // Initialize conversation with AI's first message
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: `ai-initial-${Date.now()}`,
        role: 'ai',
        content: aiRole.initialMessage,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [step, aiRole.initialMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle user message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim() || isAITyping) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsAITyping(true);

    // Extract information and generate AI response using LLM
    try {
      await processConversationWithLLM();
    } catch (error) {
      console.error('Error processing conversation:', error);

      // Fallback response
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        role: 'ai',
        content: '抱歉，我遇到了一些技术问题。请重新告诉我您的需求。',
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsAITyping(false);
      }, 1000);
    }
  };

  // Process conversation with LLM for extraction and response generation
  const processConversationWithLLM = async () => {
    try {
      // Step 1: Extract information from conversation
      const extractionResponse = await fetch('/api/onboarding-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step,
          messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
          currentData: data,
          mode: 'extract',
        }),
      });

      if (!extractionResponse.ok) {
        throw new Error(`Extraction failed: ${extractionResponse.statusText}`);
      }

      const extraction: ExtractionResult = await extractionResponse.json();
      setExtractionResult(extraction);

      // Update onboarding data with extracted information
      if (extraction.extracted && Object.keys(extraction.extracted).length > 0) {
        const mergedData = InformationExtractor.mergeData(data, extraction.extracted);
        updateData(mergedData);
      }

      // Update completion status
      setIsCompleted(extraction.completionStatus);

      // Step 2: Generate AI response
      let aiResponse: string;

      if (extraction.completionStatus) {
        // Use completion message if all criteria are met
        aiResponse = InformationExtractor.generateCompletionMessage(aiRole);

        // Add AI response to conversation
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsAITyping(false);
      } else {
        // Generate follow-up response using LLM
        const responseStream = await fetch('/api/onboarding-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            step,
            messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
            currentData: data,
            mode: 'respond',
          }),
        });

        if (!responseStream.ok) {
          throw new Error(`Response generation failed: ${responseStream.statusText}`);
        }

        // Handle streaming response
        const reader = responseStream.body?.getReader();

        if (reader) {
          let aiResponseContent = '';
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              aiResponseContent += chunk;
            }
          } finally {
            reader.releaseLock();
          }

          // Add AI response to conversation
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            role: 'ai',
            content: aiResponseContent.trim(),
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
          setIsAITyping(false);
        }
      }
    } catch (error) {
      console.error('Error in LLM processing:', error);

      // Fallback to local simulation if API fails
      try {
        const context: ConversationContext = {
          step,
          aiRole,
          messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
          currentData: data,
        };

        const mockExtraction = await simulateInformationExtraction(context);
        const extraction = InformationExtractor.parseExtractionResult(mockExtraction);

        setExtractionResult(extraction);

        if (extraction.extracted) {
          const mergedData = InformationExtractor.mergeData(data, extraction.extracted);
          updateData(mergedData);
        }

        setIsCompleted(extraction.completionStatus);

        const aiResponse = extraction.completionStatus
          ? InformationExtractor.generateCompletionMessage(aiRole)
          : await simulateFollowUpResponse(context, extraction);

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsAITyping(false);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setIsAITyping(false);
      }
    }
  };

  // Simulation functions (replace with actual LLM API calls in production)
  const simulateInformationExtraction = async (context: ConversationContext): Promise<string> => {
    // This simulates what an actual LLM would return for information extraction
    const { step, messages } = context;
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Mock extraction based on step and user message
    switch (step) {
      case 1:
        if (lastUserMessage.includes('餐厅') || lastUserMessage.includes('餐饮')) {
          return JSON.stringify({
            extracted: {
              businessCategory: 'restaurant',
              businessSubcategory: '餐厅',
              description: lastUserMessage,
              targetAudience: '美食爱好者',
            },
            confidence: 0.9,
            missingFields: ['businessSubcategory'],
            completionStatus: lastUserMessage.length > 20,
          });
        }

        return JSON.stringify({
          extracted: { description: lastUserMessage },
          confidence: 0.5,
          missingFields: ['businessCategory', 'businessSubcategory'],
          completionStatus: false,
        });

      case 2:
        return JSON.stringify({
          extracted: {
            businessName: extractNameFromMessage(lastUserMessage),
            description: lastUserMessage,
            tagline: '',
          },
          confidence: 0.8,
          missingFields: extractNameFromMessage(lastUserMessage) ? ['tagline'] : ['businessName'],
          completionStatus: extractNameFromMessage(lastUserMessage) !== null,
        });

      default:
        return JSON.stringify({
          extracted: {},
          confidence: 0.3,
          missingFields: ['基本信息'],
          completionStatus: false,
        });
    }
  };

  const simulateFollowUpResponse = async (
    context: ConversationContext,
    _extraction: ExtractionResult,
  ): Promise<string> => {
    // This simulates what an actual LLM would return for follow-up questions
    const { step } = context;

    const responses = {
      1: [
        '听起来很有趣！能再详细说说您的业务是做什么的吗？',
        '这个业务方向很好！您的目标客户主要是哪些人呢？',
        '我对您的业务很感兴趣，能分享更多具体信息吗？',
      ],
      2: ['您的品牌名称是什么呢？', '有什么特别的品牌故事可以分享吗？', '您希望客户对您的品牌有什么印象？'],
      3: ['您的核心服务有哪些？', '客户通常是怎么使用您的服务的？', '与同行相比，您的特色在哪里？'],
      4: ['您喜欢什么样的设计风格？', '有特别偏好的颜色吗？', '您觉得什么样的视觉效果比较适合？'],
      5: ['客户一般怎么联系您？', '您有在用微信或其他社交平台吗？', '希望在网站上展示哪些联系方式？'],
    };

    const stepResponses = responses[step as keyof typeof responses] || responses[1];

    return stepResponses[Math.floor(Math.random() * stepResponses.length)];
  };

  const extractNameFromMessage = (message: string): string | null => {
    // Simple name extraction logic
    const namePatterns = [/叫(.+)/, /名字是(.+)/, /名称是(.+)/, /^(.+)$/];

    for (const pattern of namePatterns) {
      const match = message.match(pattern);

      if (match && match[1] && match[1].trim().length > 0 && match[1].trim().length < 50) {
        return match[1].trim();
      }
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* AI Role Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{aiRole.avatar}</div>
          <div>
            <h3 className="font-bold text-blue-800">{aiRole.name}</h3>
            <p className="text-sm text-blue-600">{aiRole.title}</p>
          </div>
        </div>
        <p className="text-sm text-blue-700">{aiRole.personality}</p>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-bolt-elements-borderColor rounded-xl mb-4 h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`
                  max-w-[80%] p-3 rounded-2xl text-sm
                  ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }
                `}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isAITyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`与${aiRole.name}对话...`}
            className="flex-1 px-4 py-3 border border-bolt-elements-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isAITyping}
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isAITyping}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            发送
          </button>
        </div>
      </form>

      {/* Progress Indicator */}
      {extractionResult && Object.keys(extractionResult.extracted).length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            已收集信息
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              置信度: {Math.round((extractionResult.confidence || 0) * 100)}%
            </span>
          </h4>
          <div className="text-sm text-green-700">
            {Object.entries(extractionResult.extracted).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            ))}
          </div>
          {extractionResult.missingFields.length > 0 && (
            <div className="mt-3 text-xs text-orange-600">
              <span className="font-medium">待收集:</span> {extractionResult.missingFields.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-bolt-elements-borderColor rounded-lg text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一步
        </button>

        {isCompleted && (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            下一步
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
