import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface TranscriptionResult {
  text: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language?: string;
  confidence?: number;
}

interface AnalysisInput {
  question: string;
  transcript: string;
  segments: Array<{ start: number; end: number; text: string }>;
  rubric?: any;
}

interface AnalysisResult {
  overallScore: number;
  competencies: Array<{
    name: string;
    score: number;
    maxScore: number;
    evidence: string;
    timestamp?: number;
  }>;
  highlights: Array<{
    type: 'positive' | 'negative' | 'notable';
    text: string;
    timestamp: number;
    reason: string;
  }>;
  redFlags?: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  summary: string;
  starAnalysis?: {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    score: number;
  };
  rawResponse?: any;
}

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });
  }

  async transcribe(audioUrl: string): Promise<TranscriptionResult> {
    try {
      // Download audio file
      const response = await fetch(audioUrl);
      const audioBuffer = await response.arrayBuffer();
      
      // Create a File object for OpenAI
      const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

      // Transcribe with Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
      });

      // Parse segments
      const segments = (transcription as any).segments?.map((seg: any) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text.trim(),
      })) || [];

      return {
        text: transcription.text,
        segments,
        language: (transcription as any).language,
        confidence: this.calculateAverageConfidence((transcription as any).segments),
      };
    } catch (error: any) {
      console.error('Transcription error:', error);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  async analyzeResponse(input: AnalysisInput): Promise<AnalysisResult> {
    const systemPrompt = this.buildSystemPrompt(input.rubric);
    const userPrompt = this.buildUserPrompt(input);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const parsed = JSON.parse(content);
      
      return {
        overallScore: parsed.overall_score || 0,
        competencies: parsed.competencies || [],
        highlights: this.mapHighlightsToTimestamps(parsed.highlights || [], input.segments),
        redFlags: parsed.red_flags || [],
        summary: parsed.summary || '',
        starAnalysis: parsed.star_analysis,
        rawResponse: parsed,
      };
    } catch (error: any) {
      console.error('Analysis error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  private buildSystemPrompt(rubric?: any): string {
    let prompt = `Sen deneyimli bir İK uzmanısın. Aday mülakat yanıtlarını analiz ediyorsun.

GÖREV:
1. Adayın yanıtını objektif olarak değerlendir
2. STAR metodunu (Durum-Görev-Eylem-Sonuç) kullanarak yapılandırılmış analiz yap
3. Güçlü ve zayıf yönleri belirle
4. Şüpheli veya endişe verici kalıpları tespit et

DEĞERLENDİRME KRİTERLERİ:
- İletişim Becerisi (netlik, akıcılık, yapı)
- Problem Çözme (analitik düşünme, mantık)
- Deneyim Kalitesi (somut örnekler, sonuç odaklılık)
- Profesyonellik (tutum, özgüven, uygunluk)`;

    if (rubric) {
      prompt += `\n\nÖZEL DEĞERLENDİRME KRİTERLERİ:\n${JSON.stringify(rubric, null, 2)}`;
    }

    prompt += `

JSON FORMATI:
{
  "overall_score": 0-100 arası puan,
  "competencies": [
    {
      "name": "Yetkinlik adı",
      "score": 1-5 arası puan,
      "maxScore": 5,
      "evidence": "Kanıt cümlesi - adayın tam olarak söylediği"
    }
  ],
  "highlights": [
    {
      "type": "positive|negative|notable",
      "text": "Önemli cümle",
      "reason": "Neden önemli"
    }
  ],
  "red_flags": [
    {
      "type": "inconsistency|evasion|unprofessional|other",
      "description": "Açıklama",
      "severity": "low|medium|high"
    }
  ],
  "summary": "2-3 cümlelik özet",
  "star_analysis": {
    "situation": "Durum açıklaması veya null",
    "task": "Görev açıklaması veya null",
    "action": "Eylem açıklaması veya null",
    "result": "Sonuç açıklaması veya null",
    "score": 0-100 STAR uyumluluk puanı
  }
}`;

    return prompt;
  }

  private buildUserPrompt(input: AnalysisInput): string {
    return `SORU: ${input.question}

ADAYIN YANITI:
${input.transcript}

ZAMAN DAMGALI SEGMENTLER:
${input.segments.map(s => `[${this.formatTime(s.start)}] ${s.text}`).join('\n')}

Bu yanıtı analiz et ve belirtilen JSON formatında döndür.`;
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private calculateAverageConfidence(segments?: any[]): number {
    if (!segments || segments.length === 0) return 0;
    const total = segments.reduce((sum, seg) => sum + (seg.avg_logprob || 0), 0);
    // Convert log probability to confidence percentage
    return Math.min(100, Math.max(0, (1 + total / segments.length) * 100));
  }

  private mapHighlightsToTimestamps(
    highlights: any[],
    segments: Array<{ start: number; end: number; text: string }>,
  ): AnalysisResult['highlights'] {
    return highlights.map((h) => {
      // Find the segment that contains this highlight text
      const matchingSegment = segments.find((s) =>
        s.text.toLowerCase().includes(h.text?.toLowerCase()?.substring(0, 30) || ''),
      );

      return {
        type: h.type || 'notable',
        text: h.text || '',
        timestamp: matchingSegment?.start || 0,
        reason: h.reason || '',
      };
    });
  }
}

