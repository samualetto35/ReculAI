"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AIService = class AIService {
    constructor(config) {
        this.config = config;
        this.openai = new openai_1.default({
            apiKey: this.config.get('OPENAI_API_KEY'),
        });
    }
    async transcribe(audioUrl) {
        try {
            const response = await fetch(audioUrl);
            const audioBuffer = await response.arrayBuffer();
            const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
            const transcription = await this.openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                response_format: 'verbose_json',
                timestamp_granularities: ['segment'],
            });
            const segments = transcription.segments?.map((seg) => ({
                start: seg.start,
                end: seg.end,
                text: seg.text.trim(),
            })) || [];
            return {
                text: transcription.text,
                segments,
                language: transcription.language,
                confidence: this.calculateAverageConfidence(transcription.segments),
            };
        }
        catch (error) {
            console.error('Transcription error:', error);
            throw new Error(`Transcription failed: ${error.message}`);
        }
    }
    async analyzeResponse(input) {
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
        }
        catch (error) {
            console.error('Analysis error:', error);
            throw new Error(`Analysis failed: ${error.message}`);
        }
    }
    buildSystemPrompt(rubric) {
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
    buildUserPrompt(input) {
        return `SORU: ${input.question}

ADAYIN YANITI:
${input.transcript}

ZAMAN DAMGALI SEGMENTLER:
${input.segments.map(s => `[${this.formatTime(s.start)}] ${s.text}`).join('\n')}

Bu yanıtı analiz et ve belirtilen JSON formatında döndür.`;
    }
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    calculateAverageConfidence(segments) {
        if (!segments || segments.length === 0)
            return 0;
        const total = segments.reduce((sum, seg) => sum + (seg.avg_logprob || 0), 0);
        return Math.min(100, Math.max(0, (1 + total / segments.length) * 100));
    }
    mapHighlightsToTimestamps(highlights, segments) {
        return highlights.map((h) => {
            const matchingSegment = segments.find((s) => s.text.toLowerCase().includes(h.text?.toLowerCase()?.substring(0, 30) || ''));
            return {
                type: h.type || 'notable',
                text: h.text || '',
                timestamp: matchingSegment?.start || 0,
                reason: h.reason || '',
            };
        });
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map