/**
 * Job固有機能 - プロンプト定義エントリーポイント
 */

export { getAnalysisPrompt } from './analysisPrompt';
export { 
  getConsultationSystemPrompt, 
  getApplicationSystemPrompt,
  type ChatContext 
} from './chatPrompts';
export { 
  getNewProfilePrompt, 
  getImproveProfilePrompt 
} from './profilePrompts';
