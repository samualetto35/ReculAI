'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Square,
  RotateCcw,
  ArrowRight,
  Check,
  AlertTriangle,
  Clock,
  Loader2,
  Volume2,
  Camera,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { publicApi, uploadApi } from '@/lib/api';
import { cn, formatDuration, uploadWithProgress } from '@/lib/utils';

type Stage = 'intro' | 'setup' | 'question' | 'thinking' | 'recording' | 'preview' | 'uploading' | 'complete';

export default function CandidateInterviewPage() {
  const { token } = useParams();
  const router = useRouter();
  
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [thinkingTime, setThinkingTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [retakesUsed, setRetakesUsed] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: interview, isLoading, error } = useQuery({
    queryKey: ['public-interview', token],
    queryFn: async () => {
      const { data } = await publicApi.getInterview(token as string);
      return data;
    },
  });

  const startMutation = useMutation({
    mutationFn: () => publicApi.startInterview(token as string, {
      userAgent: navigator.userAgent,
      screen: { width: screen.width, height: screen.height },
    }),
  });

  const submitMutation = useMutation({
    mutationFn: async (questionId: string) => {
      // Get presigned URL
      const { data: uploadData } = await uploadApi.getPresignedUrl({
        candidateId: interview.id,
        questionId,
        fileType: lowBandwidth ? 'audio' : 'video',
        contentType: lowBandwidth ? 'audio/webm' : 'video/webm',
      });

      // Upload file
      await uploadWithProgress(uploadData.uploadUrl, recordedBlobRef.current!, (progress) => {
        setUploadProgress(progress);
      });

      // Submit response
      await publicApi.submitResponse(token as string, questionId, {
        [lowBandwidth ? 'audioUrl' : 'videoUrl']: uploadData.publicUrl,
        duration: recordingTime,
        fileSize: recordedBlobRef.current?.size,
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => publicApi.completeInterview(token as string),
  });

  const currentQuestion = interview?.interview?.questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (interview?.interview?.questions?.length || 0) - 1;

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && (stage === 'thinking' || stage === 'recording')) {
        setTabSwitchCount((prev) => prev + 1);
        publicApi.reportBehavior(token as string, {
          type: 'tab_switch',
          details: { stage, questionIndex: currentQuestionIndex },
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token, stage, currentQuestionIndex]);

  // Setup camera
  const setupCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled ? { facingMode: 'user', width: 1280, height: 720 } : false,
        audio: micEnabled,
      });
      
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check bandwidth
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn?.downlink < 1 || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') {
          setLowBandwidth(true);
        }
      }
    } catch (err) {
      console.error('Camera setup failed:', err);
      alert('Kamera veya mikrofon erişimi sağlanamadı. Lütfen izinleri kontrol edin.');
    }
  }, [cameraEnabled, micEnabled]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current) return;

    recordedChunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    
    try {
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, options);
    } catch {
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
    }

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      recordedBlobRef.current = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(recordedBlobRef.current);
      }
    };

    mediaRecorderRef.current.start(1000);
    setStage('recording');
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= (currentQuestion?.answerTime || 120) - 1) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [currentQuestion]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStage('preview');
  }, []);

  // Start thinking timer
  const startThinking = useCallback(() => {
    setStage('thinking');
    setThinkingTime(currentQuestion?.thinkingTime || 30);

    timerRef.current = setInterval(() => {
      setThinkingTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentQuestion, startRecording]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle submit and next
  const handleSubmitAndNext = async () => {
    setStage('uploading');
    
    try {
      await submitMutation.mutateAsync(currentQuestion.id);

      if (isLastQuestion) {
        await completeMutation.mutateAsync();
        setStage('complete');
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setRetakesUsed(0);
        setStage('question');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Yükleme başarısız. Lütfen tekrar deneyin.');
      setStage('preview');
    }
  };

  // Handle retake
  const handleRetake = () => {
    setRetakesUsed((prev) => prev + 1);
    recordedBlobRef.current = null;
    setStage('question');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Mülakat Bulunamadı</h1>
          <p className="text-surface-600">Bu link geçersiz veya süresi dolmuş olabilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <header className="border-b border-surface-200 bg-surface-50/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{interview?.interview?.company?.name}</p>
              <p className="text-sm text-surface-600">{interview?.interview?.title}</p>
            </div>
          </div>

          {stage !== 'intro' && stage !== 'complete' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-surface-600">
                <span className="text-sm">
                  Soru {currentQuestionIndex + 1} / {interview?.interview?.questions?.length}
                </span>
              </div>
              {lowBandwidth && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs">Düşük Bant</span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* INTRO STAGE */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-8">
                <Video className="w-10 h-10 text-brand-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Merhaba, {interview?.name}!
              </h1>
              <p className="text-lg text-surface-600 mb-8">
                {interview?.interview?.title} mülakatına hoş geldiniz.
              </p>

              <div className="card p-6 text-left mb-8">
                <h2 className="font-semibold text-white mb-4">Mülakat Hakkında</h2>
                <ul className="space-y-3 text-surface-600">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{interview?.interview?.questions?.length}</span>
                    </div>
                    <span>soru cevaplayacaksınız</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-8 h-8 p-1.5 rounded-lg bg-surface-200 text-brand-400" />
                    <span>Her soru için düşünme ve cevaplama süresi verilecek</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <RotateCcw className="w-8 h-8 p-1.5 rounded-lg bg-surface-200 text-brand-400" />
                    <span>Bazı sorularda tekrar çekme hakkınız olacak</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  startMutation.mutate();
                  setStage('setup');
                }}
                className="btn-primary text-lg px-8 py-4"
              >
                Başla
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* SETUP STAGE */}
          {stage === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-2xl font-bold text-white text-center mb-8">
                Kamera ve Mikrofon Ayarları
              </h1>

              <div className="card p-6 mb-8">
                <div className="aspect-video bg-surface-100 rounded-xl overflow-hidden mb-6 relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!mediaStreamRef.current && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={setupCamera}
                        className="btn-primary"
                      >
                        <Camera className="w-5 h-5" />
                        Kamerayı Aç
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setCameraEnabled(!cameraEnabled);
                      if (mediaStreamRef.current) {
                        mediaStreamRef.current.getVideoTracks().forEach((track) => {
                          track.enabled = !cameraEnabled;
                        });
                      }
                    }}
                    className={cn(
                      'p-4 rounded-xl transition-colors',
                      cameraEnabled ? 'bg-brand-500 text-white' : 'bg-surface-200 text-surface-600'
                    )}
                  >
                    {cameraEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => {
                      setMicEnabled(!micEnabled);
                      if (mediaStreamRef.current) {
                        mediaStreamRef.current.getAudioTracks().forEach((track) => {
                          track.enabled = !micEnabled;
                        });
                      }
                    }}
                    className={cn(
                      'p-4 rounded-xl transition-colors',
                      micEnabled ? 'bg-brand-500 text-white' : 'bg-surface-200 text-surface-600'
                    )}
                  >
                    {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (!mediaStreamRef.current) {
                      setupCamera().then(() => setStage('question'));
                    } else {
                      setStage('question');
                    }
                  }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Devam Et
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* QUESTION STAGE */}
          {stage === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="mb-8">
                <span className="text-brand-400 font-medium">Soru {currentQuestionIndex + 1}</span>
              </div>

              <div className="card p-8 mb-8">
                <p className="text-2xl font-medium text-white leading-relaxed">
                  {currentQuestion?.text}
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 text-surface-600 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{currentQuestion?.thinkingTime} sn düşünme</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span>{formatDuration(currentQuestion?.answerTime || 120)} cevap</span>
                </div>
                {currentQuestion?.retakes > 0 && (
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    <span>{currentQuestion.retakes - retakesUsed} tekrar hakkı</span>
                  </div>
                )}
              </div>

              <button onClick={startThinking} className="btn-primary text-lg px-8 py-4">
                Hazırım
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* THINKING STAGE */}
          {stage === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <p className="text-surface-600 mb-2">Düşünme Süresi</p>
                <div className="text-6xl font-bold text-brand-400 tabular-nums">
                  {thinkingTime}
                </div>
              </div>

              <div className="card p-8 text-center">
                <p className="text-xl text-white">{currentQuestion?.text}</p>
              </div>

              <div className="mt-8 text-center">
                <button onClick={startRecording} className="btn-secondary">
                  Şimdi Başla
                </button>
              </div>
            </motion.div>
          )}

          {/* RECORDING STAGE */}
          {stage === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative">
                <div className="aspect-video bg-surface-100 rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Recording indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="recording-indicator" />
                  <span className="text-white font-medium tabular-nums">
                    {formatDuration(recordingTime)}
                  </span>
                </div>

                {/* Time remaining */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm">
                    Kalan: {formatDuration((currentQuestion?.answerTime || 120) - recordingTime)}
                  </span>
                </div>

                {/* Question overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-white">{currentQuestion?.text}</p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button onClick={stopRecording} className="btn-danger text-lg px-8 py-4">
                  <Square className="w-5 h-5" />
                  Kaydı Bitir
                </button>
              </div>
            </motion.div>
          )}

          {/* PREVIEW STAGE */}
          {stage === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white text-center mb-6">
                Kaydınızı İzleyin
              </h2>

              <div className="card p-4 mb-8">
                <div className="aspect-video bg-surface-100 rounded-xl overflow-hidden">
                  <video
                    ref={previewRef}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                {retakesUsed < (currentQuestion?.retakes || 0) && (
                  <button onClick={handleRetake} className="btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    Tekrar Çek ({currentQuestion?.retakes - retakesUsed} hak)
                  </button>
                )}
                <button onClick={handleSubmitAndNext} className="btn-primary text-lg px-8 py-4">
                  {isLastQuestion ? 'Mülakatı Tamamla' : 'Sonraki Soru'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* UPLOADING STAGE */}
          {stage === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center"
            >
              <Loader2 className="w-16 h-16 text-brand-500 animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-bold text-white mb-4">Yükleniyor...</h2>
              <div className="w-full bg-surface-200 rounded-full h-3 mb-2">
                <div
                  className="bg-brand-500 h-3 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-surface-600">{uploadProgress}%</p>
            </motion.div>
          )}

          {/* COMPLETE STAGE */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8">
                <Check className="w-10 h-10 text-green-400" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Tebrikler! 🎉
              </h1>
              <p className="text-lg text-surface-600 mb-8">
                Mülakatınız başarıyla tamamlandı. Değerlendirme sonuçları size iletilecektir.
              </p>

              <div className="card p-6 text-left">
                <h3 className="font-semibold text-white mb-4">Özet</h3>
                <ul className="space-y-2 text-surface-600">
                  <li>✅ {interview?.interview?.questions?.length} soru cevaplandı</li>
                  <li>⏱️ Mülakat süresi: {formatDuration(recordingTime * (interview?.interview?.questions?.length || 1))}</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

