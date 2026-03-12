import type { ApiKeyConfig, ProfileData, JobData, AnalysisResult, ChatMessage } from '../types';

/**
 * AI分析リクエストの型定義
 */
interface AnalysisRequest {
  profile: ProfileData;
  job: JobData;
  config: ApiKeyConfig;
}

/**
 * チャットリクエストの型定義
 */
interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    profile?: ProfileData;
    job?: JobData;
    analysisResult?: AnalysisResult;
  };
  config: ApiKeyConfig;
}

/**
 * OpenAI APIを使用して分析を実行
 */
async function analyzeWithOpenAI(request: AnalysisRequest): Promise<AnalysisResult> {
  const { profile, job, config } = request;

  const prompt = `
あなたはクラウドソーシング案件分析の専門家です。以下のプロフィールと案件情報を分析してください。

# プロフィール
自己紹介: ${profile.selfIntroduction}
スキル: ${profile.skills}
実績: ${profile.achievements}
得意分野: ${profile.specialty}

# 案件情報
案件説明: ${job.description}
仕事内容: ${job.workDetails}
条件: ${job.requirements}
報酬: ${job.payment}

# 分析指示
以下の形式でJSON形式で回答してください:
{
  "recommendationScore": 1から5の整数,
  "strengths": ["良い点1", "良い点2", ...],
  "concerns": ["注意点1", "注意点2", ...],
  "skillMatch": {
    "labels": ["スキルカテゴリ1", "スキルカテゴリ2", ...],
    "scores": {"スキルカテゴリ1": 0-100の数値, ...}
  },
  "highlightSkills": ["強調すべきスキル1", "強調すべきスキル2", ...],
  "keyPoints": ["提案ポイント1", "提案ポイント2", ...]
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: [
        { role: 'system', content: 'あなたはクラウドソーシング案件分析の専門家です。JSON形式で回答してください。' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from OpenAI API');
  }

  return JSON.parse(content) as AnalysisResult;
}

/**
 * Google Gemini APIを使用して分析を実行
 */
async function analyzeWithGemini(request: AnalysisRequest): Promise<AnalysisResult> {
  const { profile, job, config } = request;

  const prompt = `
あなたはクラウドソーシング案件分析の専門家です。以下のプロフィールと案件情報を分析してください。

# プロフィール
自己紹介: ${profile.selfIntroduction}
スキル: ${profile.skills}
実績: ${profile.achievements}
得意分野: ${profile.specialty}

# 案件情報
案件説明: ${job.description}
仕事内容: ${job.workDetails}
条件: ${job.requirements}
報酬: ${job.payment}

# 分析指示
以下の形式でJSON形式で回答してください:
{
  "recommendationScore": 1から5の整数,
  "strengths": ["良い点1", "良い点2", ...],
  "concerns": ["注意点1", "注意点2", ...],
  "skillMatch": {
    "labels": ["スキルカテゴリ1", "スキルカテゴリ2", ...],
    "scores": {"スキルカテゴリ1": 0-100の数値, ...}
  },
  "highlightSkills": ["強調すべきスキル1", "強調すべきスキル2", ...],
  "keyPoints": ["提案ポイント1", "提案ポイント2", ...]
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.modelName}:generateContent?key=${config.apiKey}`,
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
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    throw new Error('No response from Gemini API');
  }

  return JSON.parse(content) as AnalysisResult;
}

/**
 * 案件分析を実行
 */
export async function analyzeJob(request: AnalysisRequest): Promise<AnalysisResult> {
  const { config } = request;

  if (config.service === 'openai') {
    return analyzeWithOpenAI(request);
  } else if (config.service === 'gemini') {
    return analyzeWithGemini(request);
  } else {
    throw new Error(`Unsupported AI service: ${config.service}`);
  }
}

/**
 * OpenAI APIを使用してチャット
 */
async function chatWithOpenAI(request: ChatRequest): Promise<string> {
  const { messages, context, config } = request;

  let systemMessage = 'あなたはクラウドソーシング案件の応募支援を行うアシスタントです。';
  
  if (context) {
    systemMessage += '\n\n以下の情報を参考に回答してください:\n';
    if (context.profile) {
      systemMessage += `\nプロフィール:\n${JSON.stringify(context.profile, null, 2)}`;
    }
    if (context.job) {
      systemMessage += `\n\n案件情報:\n${JSON.stringify(context.job, null, 2)}`;
    }
    if (context.analysisResult) {
      systemMessage += `\n\n分析結果:\n${JSON.stringify(context.analysisResult, null, 2)}`;
    }
  }

  const apiMessages = [
    { role: 'system', content: systemMessage },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: apiMessages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Google Gemini APIを使用してチャット
 */
async function chatWithGemini(request: ChatRequest): Promise<string> {
  const { messages, context, config } = request;

  let systemPrompt = 'あなたはクラウドソーシング案件の応募支援を行うアシスタントです。';
  
  if (context) {
    systemPrompt += '\n\n以下の情報を参考に回答してください:\n';
    if (context.profile) {
      systemPrompt += `\nプロフィール:\n${JSON.stringify(context.profile, null, 2)}`;
    }
    if (context.job) {
      systemPrompt += `\n\n案件情報:\n${JSON.stringify(context.job, null, 2)}`;
    }
    if (context.analysisResult) {
      systemPrompt += `\n\n分析結果:\n${JSON.stringify(context.analysisResult, null, 2)}`;
    }
  }

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.modelName}:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * AIチャットを実行
 */
export async function chatWithAI(request: ChatRequest): Promise<string> {
  const { config } = request;

  if (config.service === 'openai') {
    return chatWithOpenAI(request);
  } else if (config.service === 'gemini') {
    return chatWithGemini(request);
  } else {
    throw new Error(`Unsupported AI service: ${config.service}`);
  }
}
