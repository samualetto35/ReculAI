'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Star,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { candidatesApi } from '@/lib/api';
import { cn, formatDuration, getScoreColor, getScoreBgColor, getStatusLabel, formatDate } from '@/lib/utils';

export default function CandidateDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const { data } = await candidatesApi.get(id as string);
      return data;
    },
  });

  const evaluationMutation = useMutation({
    mutationFn: (data: any) => candidatesApi.updateEvaluation(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', id] });
    },
  });

  const currentResponse = candidate?.responses?.[currentResponseIndex];
  const analysis = currentResponse?.analysis;
  const transcription = currentResponse?.transcription;

  // Video controls
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentResponseIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleDecision = (decision: string) => {
    evaluationMutation.mutate({ decision });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-1/4" />
          <div className="h-96 bg-surface-200 rounded" />
        </div>
      </div>
    );
  }

  const highlights = analysis?.highlights || [];
  const competencies = analysis?.competencies || [];
  const redFlags = analysis?.redFlags || [];
  const segments = transcription?.segments || [];

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <div className="border-b border-surface-200 bg-surface-50/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href={`/dashboard/interviews/${candidate?.interview?.id}`}
            className="inline-flex items-center gap-2 text-surface-600 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-400">
                  {candidate?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{candidate?.name}</h1>
                <p className="text-surface-600">{candidate?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Score */}
              {candidate?.evaluation?.aiScore && (
                <div className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border', getScoreBgColor(candidate.evaluation.aiScore))}>
                  <Brain className="w-5 h-5" />
                  <span className={cn('text-xl font-bold', getScoreColor(candidate.evaluation.aiScore))}>
                    {Math.round(candidate.evaluation.aiScore)}
                  </span>
                  <span className="text-surface-600">/100</span>
                </div>
              )}

              {/* Decision Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecision('REJECTED')}
                  className={cn(
                    'p-3 rounded-xl transition-colors',
                    candidate?.evaluation?.decision === 'REJECTED'
                      ? 'bg-red-500 text-white'
                      : 'bg-surface-200 text-surface-600 hover:bg-red-500/20 hover:text-red-400'
                  )}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDecision('SHORTLISTED')}
                  className={cn(
                    'p-3 rounded-xl transition-colors',
                    candidate?.evaluation?.decision === 'SHORTLISTED'
                      ? 'bg-green-500 text-white'
                      : 'bg-surface-200 text-surface-600 hover:bg-green-500/20 hover:text-green-400'
                  )}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Video Player */}
          <div className="col-span-2 space-y-6">
            {/* Question Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {candidate?.responses?.map((response: any, index: number) => (
                <button
                  key={response.id}
                  onClick={() => setCurrentResponseIndex(index)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentResponseIndex === index
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
                  )}
                >
                  Soru {index + 1}
                  {response.analysis?.overallScore && (
                    <span className={cn('ml-2', getScoreColor(response.analysis.overallScore))}>
                      ({Math.round(response.analysis.overallScore)})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Question Text */}
            <div className="card p-4">
              <p className="text-white font-medium">{currentResponse?.question?.text}</p>
            </div>

            {/* Video Player */}
            <div className="card overflow-hidden">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  src={currentResponse?.videoUrl}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                />

                {/* Play overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Timeline with highlights */}
              <div className="p-4 space-y-3">
                {/* Progress bar */}
                <div className="relative">
                  <div
                    className="h-2 bg-surface-200 rounded-full cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seekTo(percent * duration);
                    }}
                  >
                    <div
                      className="h-2 bg-brand-500 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Highlight markers */}
                  {highlights.map((highlight: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => seekTo(highlight.timestamp)}
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-surface-0',
                        highlight.type === 'positive' ? 'bg-green-500' :
                        highlight.type === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      )}
                      style={{ left: `${(highlight.timestamp / duration) * 100}%` }}
                      title={highlight.reason}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 text-surface-600 hover:text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-surface-600 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-sm text-surface-600 tabular-nums">
                      {formatDuration(currentTime)} / {formatDuration(duration)}
                    </span>
                  </div>

                  {/* Highlight legend */}
                  <div className="flex items-center gap-4 text-xs text-surface-600">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Güçlü
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Dikkat
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Zayıf
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transcript */}
            {transcription && (
              <div className="card">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full p-4 flex items-center justify-between hover:bg-surface-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-400" />
                    <span className="font-medium text-white">Transkript</span>
                  </div>
                  <ChevronRight className={cn('w-5 h-5 text-surface-600 transition-transform', showTranscript && 'rotate-90')} />
                </button>

                {showTranscript && (
                  <div className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
                    {segments.map((segment: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => seekTo(segment.start)}
                        className="block w-full text-left p-2 rounded-lg hover:bg-surface-100 transition-colors group"
                      >
                        <span className="text-xs text-brand-400 group-hover:text-brand-300">
                          [{formatDuration(segment.start)}]
                        </span>
                        <span className="ml-2 text-surface-700 group-hover:text-white">
                          {segment.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            {/* Summary */}
            {analysis?.summary && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  <h3 className="font-medium text-white">AI Özeti</h3>
                </div>
                <p className="text-surface-600 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </div>
            )}

            {/* Competencies */}
            {competencies.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-brand-400" />
                  <h3 className="font-medium text-white">Yetkinlikler</h3>
                </div>
                <div className="space-y-3">
                  {competencies.map((comp: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-surface-700">{comp.name}</span>
                        <span className={cn('font-medium', getScoreColor((comp.score / comp.maxScore) * 100))}>
                          {comp.score}/{comp.maxScore}
                        </span>
                      </div>
                      <div className="h-2 bg-surface-200 rounded-full">
                        <div
                          className={cn('h-2 rounded-full', 
                            (comp.score / comp.maxScore) >= 0.8 ? 'bg-green-500' :
                            (comp.score / comp.maxScore) >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${(comp.score / comp.maxScore) * 100}%` }}
                        />
                      </div>
                      {comp.evidence && (
                        <p className="text-xs text-surface-600 mt-1">
                          &quot;{comp.evidence}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAR Analysis */}
            {analysis?.starAnalysis && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-brand-400" />
                  <h3 className="font-medium text-white">STAR Analizi</h3>
                  <span className={cn('ml-auto text-sm font-medium', getScoreColor(analysis.starAnalysis.score))}>
                    {analysis.starAnalysis.score}%
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  {['situation', 'task', 'action', 'result'].map((key) => (
                    <div key={key}>
                      <span className="text-brand-400 font-medium uppercase text-xs">
                        {key.charAt(0)}
                      </span>
                      <span className="text-surface-700 ml-2">
                        {analysis.starAnalysis[key] || 'Belirlenmedi'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags */}
            {redFlags.length > 0 && (
              <div className="card p-4 border-red-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="font-medium text-red-400">Dikkat Noktaları</h3>
                </div>
                <div className="space-y-2">
                  {redFlags.map((flag: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg text-sm',
                        flag.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                        flag.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-surface-200 text-surface-600'
                      )}
                    >
                      <span className="font-medium">{flag.type}:</span> {flag.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-5 h-5 text-brand-400" />
                  <h3 className="font-medium text-white">Önemli Anlar</h3>
                </div>
                <div className="space-y-2">
                  {highlights.map((highlight: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => seekTo(highlight.timestamp)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left text-sm transition-colors hover:ring-2 ring-brand-500/50',
                        highlight.type === 'positive' ? 'bg-green-500/10' :
                        highlight.type === 'negative' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-brand-400 font-mono">
                          [{formatDuration(highlight.timestamp)}]
                        </span>
                        <span className={cn(
                          'text-xs font-medium',
                          highlight.type === 'positive' ? 'text-green-400' :
                          highlight.type === 'negative' ? 'text-red-400' : 'text-yellow-400'
                        )}>
                          {highlight.type === 'positive' ? 'Güçlü' :
                           highlight.type === 'negative' ? 'Zayıf' : 'Dikkat'}
                        </span>
                      </div>
                      <p className="text-surface-700">{highlight.text}</p>
                      <p className="text-xs text-surface-600 mt-1">{highlight.reason}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

