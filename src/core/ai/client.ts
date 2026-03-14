/**
 * AI共通基盤機能 - AI通信処理
 * 
 * AIサービスとのHTTPS通信を担当する汎用的な関数
 * プロダクト固有の概念（案件、プロフィール等）を含まない
 */

import type { AIClientRequest, AIClientResponse, AIChatRequest, ChatMessage } from './types';

/**
 * AI APIへのHTTP通信を実行
 * 
 * @param params - AI通信パラメータ
 * @returns AI APIからの生レスポンス、またはエラー情報
 */
export async function callAI(params: AIClientRequest): Promise<AIClientResponse> {
  const { service, apiKey, prompt, modelName, temperature = 0.7, maxTokens } = params;

  try {
    if (service === 'openai') {
      return await callOpenAI(apiKey, prompt, modelName, temperature, maxTokens);
    } else if (service === 'gemini') {
      return await callGemini(apiKey, prompt, modelName, temperature);
    } else {
      throw new Error(`Unsupported AI service: ${service}`);
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}

/**
 * OpenAI APIを呼び出し
 */
async function callOpenAI(
  apiKey: string,
  prompt: string,
  modelName: string,
  temperature: number,
  maxTokens?: number
): Promise<AIClientResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒タイムアウト

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: 'あなたは専門的なアシスタントです。必ずJSON形式のみで回答してください。' },
          { role: 'user', content: prompt }
        ],
        temperature,
        ...(maxTokens && { max_tokens: maxTokens }),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error details:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    return { rawResponse: content };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API request timed out (30 seconds)');
    }
    throw error;
  }
}

/**
 * Google Gemini APIを呼び出し
 */
async function callGemini(
  apiKey: string,
  prompt: string,
  modelName: string,
  temperature: number
): Promise<AIClientResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒タイムアウト

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error details:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response from Gemini API');
    }

    return { rawResponse: content };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API request timed out (30 seconds)');
    }
    throw error;
  }
}

/**
 * チャット形式でAI APIへのHTTP通信を実行
 * 
 * @param params - AIチャット通信パラメータ
 * @returns AI APIからの生レスポンス、またはエラー情報
 */
export async function callAIChat(params: AIChatRequest): Promise<AIClientResponse> {
  const { service, apiKey, messages, modelName, temperature = 0.7, maxTokens } = params;

  try {
    if (service === 'openai') {
      return await chatWithOpenAI(apiKey, messages, modelName, temperature, maxTokens);
    } else if (service === 'gemini') {
      return await chatWithGemini(apiKey, messages, modelName, temperature);
    } else {
      throw new Error(`Unsupported AI service: ${service}`);
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}

/**
 * OpenAI APIでチャット通信
 */
async function chatWithOpenAI(
  apiKey: string,
  messages: ChatMessage[],
  modelName: string,
  temperature: number,
  maxTokens?: number
): Promise<AIClientResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒タイムアウト

  try {
    // ChatMessage型をOpenAI API形式に変換
    const apiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
      content: msg.content,
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: apiMessages,
        temperature,
        ...(maxTokens && { max_tokens: maxTokens }),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`OpenAI API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    return { rawResponse: content };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API request timed out (30 seconds)');
    }
    throw error;
  }
}

/**
 * Google Gemini APIでチャット通信
 */
async function chatWithGemini(
  apiKey: string,
  messages: ChatMessage[],
  modelName: string,
  temperature: number
): Promise<AIClientResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒タイムアウト

  try {
    // ChatMessage型をGemini API形式に変換
    // systemメッセージは最初のuserメッセージに統合
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    let systemPrompt = '';
    
    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += msg.content + '\n\n';
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }
    
    // systemプロンプトがある場合、最初のuserメッセージに結合
    if (systemPrompt && contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = systemPrompt + contents[0].parts[0].text;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error details:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response from Gemini API');
    }

    return { rawResponse: content };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API request timed out (30 seconds)');
    }
    throw error;
  }
}
