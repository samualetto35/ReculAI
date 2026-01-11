'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  Camera,
  Sparkles,
  PartyPopper,
  Sun,
  Moon
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { useTheme } from '../../providers';

type Stage = 'intro' | 'setup' | 'question' | 'thinking' | 'recording' | 'preview' | 'uploading' | 'complete';

// Demo interview data
const demoInterview = {
  id: 'demo-interview',
  title: 'Senior Frontend Developer',
  company: { name: 'TechCorp A.Ş.' },
  candidateName: 'Demo Kullanıcı',
  questions: [
    { id: 'q1', text: 'Kendinizi kısaca tanıtır mısınız?', thinkingTime: 30, answerTime: 120, retakes: 1 },
    { id: 'q2', text: 'En zorlu teknik problemi nasıl çözdünüz?', thinkingTime: 45, answerTime: 180, retakes: 1 },
    { id: 'q3', text: 'React performans optimizasyonu hakkında neler biliyorsunuz?', thinkingTime: 30, answerTime: 150, retakes: 0 },
  ],
};

export default function DemoCandidateInterviewPage() {
  const { theme, toggleTheme } = useTheme();
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [thinkingTime, setThinkingTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [retakesUsed, setRetakesUsed] = useState(0);
  const [hasCamera, setHasCamera] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stageRef = useRef<Stage>(stage);

  // Keep stageRef in sync
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const interview = demoInterview;
  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

  // Callback ref for recording video - attaches stream immediately when element mounts
  const recordingVideoCallback = useCallback((videoElement: HTMLVideoElement | null) => {
    if (videoElement && mediaStreamRef.current) {
      videoElement.srcObject = mediaStreamRef.current;
      videoElement.play().catch(console.error);
    }
  }, []);

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
      setHasCamera(true);
      return true;
    } catch (err) {
      console.error('Camera setup failed:', err);
      setHasCamera(false);
      return false;
    }
  }, [cameraEnabled, micEnabled]);

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (isRecordingStopped) return;
    setIsRecordingStopped(true);
    
    clearAllTimers();
    
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setStage('preview');
  }, [isRecordingStopped, clearAllTimers]);

  // Start recording
  const startRecording = useCallback(() => {
    clearAllTimers();
    setIsRecordingStopped(false);
    setStage('recording');
    setRecordingTime(0);


    if (mediaStreamRef.current) {
      recordedChunksRef.current = [];
      try {
        const options = { mimeType: 'video/webm;codecs=vp9,opus' };
        mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, options);
      } catch {
        try {
          mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
        } catch {
          // If recording fails, just simulate it for demo
        }
      }

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          recordedBlobRef.current = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          if (previewRef.current && recordedBlobRef.current) {
            previewRef.current.src = URL.createObjectURL(recordedBlobRef.current);
          }
        };

        mediaRecorderRef.current.start(1000);
      }
    }

    // Get current question's answer time
    const maxTime = interview.questions[currentQuestionIndex]?.answerTime || 120;

    // Timer for recording
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= maxTime) {
          // Stop recording when time is up - use setTimeout to avoid state update issues
          setTimeout(() => {
            if (stageRef.current === 'recording') {
              clearAllTimers();
              setIsRecordingStopped(true);
              if (mediaRecorderRef.current?.state === 'recording') {
                mediaRecorderRef.current.stop();
              }
              setStage('preview');
            }
          }, 0);
          return prev;
        }
        return newTime;
      });
    }, 1000);
  }, [currentQuestionIndex, interview.questions, clearAllTimers]);

  // Start thinking timer
  const startThinking = useCallback(() => {
    clearAllTimers();
    setStage('thinking');
    const thinkTime = currentQuestion?.thinkingTime || 30;
    setThinkingTime(thinkTime);

    timerRef.current = setInterval(() => {
      setThinkingTime((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          // Use setTimeout to avoid calling startRecording during state update
          setTimeout(() => {
            if (stageRef.current === 'thinking') {
              startRecording();
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentQuestion, startRecording, clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [clearAllTimers]);

  // Handle submit and next
  const handleSubmitAndNext = async () => {
    clearAllTimers();
    setStage('uploading');
    setUploadProgress(0);
    
    // Simulate upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    if (isLastQuestion) {
      // Stop all media
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setStage('complete');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setRetakesUsed(0);
      setRecordingTime(0);
      recordedBlobRef.current = null;
      recordedChunksRef.current = [];
      setIsRecordingStopped(false);
      setStage('question');
    }
  };

  // Handle retake
  const handleRetake = () => {
    clearAllTimers();
    setRetakesUsed((prev) => prev + 1);
    recordedBlobRef.current = null;
    recordedChunksRef.current = [];
    setRecordingTime(0);
    setIsRecordingStopped(false);
    setStage('question');
  };

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-brand-600 text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Demo Modu - Gerçek bir aday gibi mülakat deneyimi yaşayın</span>
          <Link href="/demo" className="underline ml-2 hover:no-underline">
            ← Geri Dön
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-surface-200 bg-surface-50/80 backdrop-blur-xl sticky top-10 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-surface-900">{interview.company.name}</p>
              <p className="text-sm text-surface-600">{interview.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {stage !== 'intro' && stage !== 'complete' && (
              <div className="flex items-center gap-2 text-surface-600">
                <span className="text-sm">
                  Soru {currentQuestionIndex + 1} / {interview.questions.length}
                </span>
              </div>
            )}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-600 hover:text-surface-800 transition-colors"
              title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 mt-10">
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
              
              <h1 className="text-3xl font-bold text-surface-900 mb-4">
                Merhaba, {interview.candidateName}!
              </h1>
              <p className="text-lg text-surface-600 mb-8">
                {interview.title} mülakatına hoş geldiniz.
              </p>

              <div className="card p-6 text-left mb-8">
                <h2 className="font-semibold text-surface-900 mb-4">Mülakat Hakkında</h2>
                <ul className="space-y-3 text-surface-600">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-surface-900">{interview.questions.length}</span>
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
                onClick={() => setStage('setup')}
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
              <h1 className="text-2xl font-bold text-surface-900 text-center mb-8">
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
                  {!hasCamera && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
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
                      const newEnabled = !cameraEnabled;
                      setCameraEnabled(newEnabled);
                      if (mediaStreamRef.current) {
                        mediaStreamRef.current.getVideoTracks().forEach((track) => {
                          track.enabled = newEnabled;
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
                      const newEnabled = !micEnabled;
                      setMicEnabled(newEnabled);
                      if (mediaStreamRef.current) {
                        mediaStreamRef.current.getAudioTracks().forEach((track) => {
                          track.enabled = newEnabled;
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

                {!hasCamera && (
                  <p className="text-center text-surface-600 text-sm mt-4">
                    Demo modunda kamera olmadan da devam edebilirsiniz.
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={async () => {
                    if (!hasCamera) {
                      await setupCamera();
                    }
                    setStage('question');
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
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="mb-8">
                <span className="text-brand-400 font-medium">Soru {currentQuestionIndex + 1}</span>
              </div>

              <div className="card p-8 mb-8">
                <p className="text-2xl font-medium text-surface-900 leading-relaxed">
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
                {(currentQuestion?.retakes || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    <span>{(currentQuestion?.retakes || 0) - retakesUsed} tekrar hakkı</span>
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
                <p className="text-xl text-surface-900">{currentQuestion?.text}</p>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    clearAllTimers();
                    startRecording();
                  }} 
                  className="btn-secondary"
                >
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
                  {hasCamera ? (
                    <video
                      ref={recordingVideoCallback}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
                          <Mic className="w-12 h-12 text-brand-400" />
                        </div>
                        <p className="text-surface-900 font-medium">Kayıt Devam Ediyor...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recording indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
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
              <h2 className="text-xl font-bold text-surface-900 text-center mb-6">
                Kaydınızı İzleyin
              </h2>

              <div className="card p-4 mb-8">
                <div className="aspect-video bg-surface-100 rounded-xl overflow-hidden flex items-center justify-center">
                  {recordedBlobRef.current ? (
                    <video
                      ref={previewRef}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-brand-400 ml-1" />
                      </div>
                      <p className="text-surface-900 font-medium">Demo: Kayıt Önizlemesi</p>
                      <p className="text-surface-600 text-sm mt-1">Süre: {formatDuration(recordingTime)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                {retakesUsed < (currentQuestion?.retakes || 0) && (
                  <button onClick={handleRetake} className="btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    Tekrar Çek ({(currentQuestion?.retakes || 0) - retakesUsed} hak)
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
              <h2 className="text-xl font-bold text-surface-900 mb-4">Yükleniyor...</h2>
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
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8">
                <PartyPopper className="w-12 h-12 text-green-400" />
              </div>

              <h1 className="text-3xl font-bold text-surface-900 mb-4">
                Tebrikler! 🎉
              </h1>
              <p className="text-lg text-surface-600 mb-8">
                Demo mülakatı başarıyla tamamladınız!
              </p>

              <div className="card p-6 text-left mb-8">
                <h3 className="font-semibold text-surface-900 mb-4">Özet</h3>
                <ul className="space-y-2 text-surface-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    {interview.questions.length} soru cevaplandı
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Kamera ve mikrofon kullanıldı
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Tüm yanıtlar kaydedildi
                  </li>
                </ul>
              </div>

              <div className="card p-6 bg-brand-500/5 border-brand-500/20 mb-8">
                <p className="text-surface-900 font-medium mb-2">
                  Recula'yı beğendiniz mi?
                </p>
                <p className="text-surface-600 text-sm mb-4">
                  Gerçek hesabınızı oluşturun ve işe alım süreçlerinizi modernleştirin.
                </p>
                <a href="https://apprecula.netlify.app/register" className="btn-primary">
                  Ücretsiz Başla
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Link href="/demo" className="btn-ghost">
                  <ArrowLeft className="w-4 h-4" />
                  Demo Seçimi
                </Link>
                <Link href="/demo/recruiter" className="btn-secondary">
                  İK Demosunu Dene
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
