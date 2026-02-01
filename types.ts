
export enum Language {
  ENGLISH = 'English',
  TAMIL = 'Tamil',
  HINDI = 'Hindi',
  MALAYALAM = 'Malayalam',
  TELUGU = 'Telugu'
}

export interface DetectionResult {
  classification: 'AI_GENERATED' | 'HUMAN_GENERATED';
  confidenceScore: number;
  explanation: string;
  linguisticCues: string[];
  audioArtifacts: string[];
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: DetectionResult | null;
  error: string | null;
}
