import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { DetailDocViewer } from './DetailDocViewer';
import { WatermarkOverlay } from './WatermarkOverlay';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Calendar,
  User,
  Clock,
  Layers,
  FileText,
  Video,
  Maximize,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '../lib/youtube';

type YouTubePlayerState = {
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
};

type YouTubePlayerOptions = {
  videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: () => void;
    onStateChange?: (event: { data: number }) => void;
    onError?: () => void;
  };
};

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayerState;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

const loadYouTubeIframeApi = (): Promise<void> => {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (existingScript) {
      existingScript.addEventListener('error', () => reject(new Error('YouTube API failed to load.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('YouTube API failed to load.'));
    document.head.appendChild(script);
  }).catch((error) => {
    youtubeApiPromise = null;
    throw error;
  });

  return youtubeApiPromise;
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
  startWithVideo?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
  startWithVideo = false,
}) => {
  const { t, language, getProjectTranslation } = useLanguage();

  const isVideoProject = project?.categoryTag === 'VIDEO' || project?.categoryTag === 'SHORTS' || !!project?.videoUrl;
  const isProductPage = project?.categoryTag === 'PRODUCT' || project?.category === 'PRODUCT PAGE';
  const youtubeVideoId = getYouTubeVideoId(project?.videoUrl);
  const preferredMediaDisplay = project?.mediaDisplay ?? (project?.videoUrl ? 'youtube' : 'thumbnail');

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'video' | 'detail_doc' | 'overview'>('overview');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayerState | null>(null);
  const [youtubePlayerReady, setYouTubePlayerReady] = useState(false);

  // Sync state whenever the selected project or startWithVideo changes
  useEffect(() => {
    if (!project) return;

    setVideoError(false);
    setVideoLoading(true);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
    setIsMuted(true);
    setYouTubePlayerReady(false);

    if (isProductPage) {
      setActiveTab('detail_doc');
    } else if (isVideoProject && (startWithVideo || preferredMediaDisplay === 'youtube')) {
      setActiveTab('video');
      setIsPlaying(true);
    } else {
      setActiveTab('overview');
    }
  }, [project?.id, startWithVideo, isProductPage, isVideoProject, preferredMediaDisplay]);

  // Load and initialize the YouTube IFrame Player only when the video tab is visible.
  useEffect(() => {
    if (!project || !youtubeVideoId || activeTab !== 'video' || !youtubeContainerRef.current) {
      return;
    }

    let cancelled = false;

    loadYouTubeIframeApi()
      .then(() => {
        if (cancelled || !youtubeContainerRef.current || !window.YT?.Player) return;

        youtubePlayerRef.current?.destroy();
        youtubePlayerRef.current = new window.YT.Player(youtubeContainerRef.current, {
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (cancelled || !youtubePlayerRef.current) return;
              youtubePlayerRef.current.mute();
              youtubePlayerRef.current.playVideo();
              setDuration(youtubePlayerRef.current.getDuration() || 0);
              setVideoLoading(false);
              setYouTubePlayerReady(true);
            },
            onStateChange: ({ data }) => {
              if (!window.YT) return;
              setIsPlaying(data === window.YT.PlayerState.PLAYING);
              if (data === window.YT.PlayerState.ENDED) setCurrentTime(0);
            },
            onError: () => {
              setVideoError(true);
              setVideoLoading(false);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setVideoError(true);
          setVideoLoading(false);
        }
      });

    return () => {
      cancelled = true;
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
      setYouTubePlayerReady(false);
    };
  }, [activeTab, project?.id, youtubeVideoId]);

  // Keep the custom timeline synchronized with the YouTube player.
  useEffect(() => {
    if (!youtubeVideoId || !youtubePlayerReady || activeTab !== 'video') return;

    const timer = window.setInterval(() => {
      const player = youtubePlayerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() || 0);
      setDuration(player.getDuration() || 0);
    }, 250);

    return () => window.clearInterval(timer);
  }, [activeTab, youtubePlayerReady, youtubeVideoId]);

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (youtubeVideoId && youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
      return;
    }

    if (!videoRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  // Handle Mute toggle
  const toggleMute = () => {
    if (youtubeVideoId && youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.unMute();
      } else {
        youtubePlayerRef.current.mute();
      }
      setIsMuted(!isMuted);
      return;
    }

    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Handle Timeline Seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (youtubeVideoId && youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(seekTime, true);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Handle Fullscreen Video
  const handleFullscreen = () => {
    if (youtubeVideoId && youtubePlayerRef.current) {
      youtubePlayerRef.current.getIframe().requestFullscreen?.().catch(() => {});
      return;
    }
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  // Format seconds to mm:ss
  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!project) return null;

  const projectImage =
    preferredMediaDisplay === 'youtube'
      ? getYouTubeThumbnailUrl(project.videoUrl) || project.image
      : project.image;
  const pTrans = getProjectTranslation(project.id);
  const projectTitle = pTrans?.title || project.title;
  const projectDesc = pTrans?.description || project.description;
  const projectClient = pTrans?.client || project.client;
  const projectDuration = pTrans?.duration || project.duration;
  const projectHighlights = pTrans?.highlights || project.highlights;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  // Dynamic localized labels
  const labelPlayVideoTab = language === 'ko' ? '영상 재생' : language === 'ja' ? '動画再生' : 'Video Player';
  const labelDetailDocTab = language === 'ko' ? '상세페이지 전체보기' : language === 'ja' ? '詳細ページ全体' : 'Full Product Page';
  const labelOverviewTab = language === 'ko' ? '기획 & 작업 개요' : language === 'ja' ? '企画・作業概要' : 'Project Overview';
  const labelUnmute = language === 'ko' ? '소리 켜기 (Unmute)' : language === 'ja' ? 'ミュート解除 (Unmute)' : 'Unmute Audio';
  const labelSwitchToVideo = language === 'ko' ? '영상 플레이어로 전환' : language === 'ja' ? '動画プレーヤーに切替' : 'Switch to Video Player';
  const labelSwitchToDetail = language === 'ko' ? '상세페이지 전문 전체보기' : language === 'ja' ? '詳細ページ全体を見る' : 'View Full Product Page';
  const labelPlanningHeading = language === 'ko' ? '기획 의도 및 작업 상세' : language === 'ja' ? '企画意図および詳細' : 'Design & Creative Strategy';
  const labelHighlightsHeading = language === 'ko' ? '핵심 작업 포인트' : language === 'ja' ? '主要ポイント' : 'Key Highlights';
  const labelToolsHeading = language === 'ko' ? '활용 소프트웨어' : language === 'ja' ? '使用ツール' : 'Tools Used';
  const labelGalleryHeading = language === 'ko' ? '상세 갤러리 컷' : language === 'ja' ? '詳細ギャラリー' : 'Detail Gallery';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          id={`project-modal-${project.id}`}
          className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-neutral-200 flex flex-col will-change-transform"
        >
          {/* Top Bar with Navigation and Tabs */}
          <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 bg-white/95 px-4 sm:px-6 py-3.5 backdrop-blur-md">
            {/* Title & Category Badge */}
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-mono-tag text-xs font-bold text-blue-700 uppercase">
                {project.category}
              </span>
              <span className="text-xs font-bold text-neutral-400">
                {project.year}
              </span>
            </div>

            {/* In-Modal View Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-neutral-100/90 p-1 rounded-xl">
              {isVideoProject && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Video size={13} />
                  <span>{labelPlayVideoTab}</span>
                </button>
              )}

              {isProductPage && (
                <button
                  onClick={() => setActiveTab('detail_doc')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'detail_doc'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <FileText size={13} />
                  <span>{labelDetailDocTab}</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Sparkles size={13} />
                <span>{labelOverviewTab}</span>
              </button>
            </div>

            {/* Prev/Next & Close Action */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => onSelectProject(prevProject)}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 transition cursor-pointer"
                title={t.modal.prevProject}
                aria-label={t.modal.prevProject}
              >
                <ArrowLeft size={15} />
              </button>
              <button
                onClick={() => onSelectProject(nextProject)}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 transition cursor-pointer"
                title={t.modal.nextProject}
                aria-label={t.modal.nextProject}
              >
                <ArrowRight size={15} />
              </button>
              <button
                onClick={onClose}
                className="ml-1.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950 transition cursor-pointer"
                aria-label={t.modal.close}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* MAIN MODAL BODY CONTENT */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* VIEW MODE 1: FULL DETAIL PAGE VIEWER */}
            {activeTab === 'detail_doc' && isProductPage && (
              <div className="space-y-6">
                <div className="border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-1">
                    <FileText size={14} />
                    <span>{labelDetailDocTab}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-neutral-950 break-keep">
                    {projectTitle}
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 break-keep">
                    {projectDesc}
                  </p>
                </div>

                {/* Detail Page Visual Canvas */}
                <DetailDocViewer project={project} />
              </div>
            )}

            {/* VIEW MODE 2: INTERACTIVE VIDEO REEL PLAYER */}
            {activeTab === 'video' && isVideoProject && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-950 break-keep">
                      {projectTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 break-keep">
                      {project.role} · {projectDuration || project.duration}
                    </p>
                  </div>
                  {isMuted && (
                    <button
                      onClick={toggleMute}
                      className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-xs active:scale-95"
                    >
                      <Volume2 size={13} />
                      <span>{labelUnmute}</span>
                    </button>
                  )}
                </div>

                {/* Dedicated HTML5 Video Player with Fail-safe Fallback */}
                <div className="relative w-full aspect-16/9 bg-neutral-950 rounded-2xl overflow-hidden shadow-xl border border-neutral-800 group">
                  {/* Copyright Watermark on Video */}
                  <WatermarkOverlay variant="video" text="lovey" />

                  {project.videoUrl && !videoError ? (
                    youtubeVideoId ? (
                      <div className="relative h-full w-full bg-neutral-950">
                        {/* The API replaces this empty node with its iframe. */}
                        <div
                          ref={youtubeContainerRef}
                          className="h-full w-full"
                          aria-label={`${projectTitle} YouTube player`}
                        />
                        {videoLoading && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-950/60 pointer-events-none">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span className="text-xs text-neutral-300 font-medium">Loading YouTube player...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <video
                        key={`video-player-${project.id}`}
                        ref={videoRef}
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        preload="auto"
                        onTimeUpdate={() => {
                          if (videoRef.current) {
                            setCurrentTime(videoRef.current.currentTime);
                          }
                        }}
                        onLoadedMetadata={() => {
                          if (videoRef.current) {
                            setDuration(videoRef.current.duration || 30);
                            setVideoLoading(false);
                            setVideoError(false);
                          }
                        }}
                        onCanPlay={() => {
                          setVideoLoading(false);
                          setVideoError(false);
                        }}
                        onError={() => {
                          setVideoError(true);
                          setVideoLoading(false);
                        }}
                        onClick={togglePlay}
                        className="h-full w-full object-contain cursor-pointer"
                      >
                        <source src={project.videoUrl} type="video/mp4" />
                        </video>

                        {/* Loading State Spinner */}
                        {videoLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60 pointer-events-none">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span className="text-xs text-neutral-300 font-medium">Loading video...</span>
                            </div>
                          </div>
                        )}

                        {/* Big Center Play Overlay (when paused) */}
                        {!isPlaying && !videoLoading && (
                          <div
                            onClick={togglePlay}
                            className="absolute inset-0 flex items-center justify-center bg-neutral-950/40 cursor-pointer transition-opacity"
                          >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform hover:scale-110">
                              <Play size={28} className="fill-white ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    /* High-fidelity Video Reel Fallback Simulator */
                    <div className="relative h-full w-full bg-neutral-950 flex flex-col justify-between p-6">
                      <img
                        src={projectImage}
                        alt={projectTitle}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover opacity-35"
                      />
                      {/* Ambient gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                      {/* Top Reel Meta */}
                      <div className="relative z-10 flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2 rounded-full bg-blue-600/80 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                          <Video size={13} />
                          VIDEO REEL PREVIEW
                        </span>
                        <span className="font-mono text-neutral-400 font-semibold">
                          4K UHD · 60FPS MASTER
                        </span>
                      </div>

                      {/* Center Play & Reel Title */}
                      <div className="relative z-10 text-center my-auto">
                        <button
                          onClick={togglePlay}
                          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform hover:scale-110 cursor-pointer mb-3"
                        >
                          {isPlaying ? <Pause size={24} /> : <Play size={24} className="fill-white ml-1" />}
                        </button>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white break-keep">
                          {projectTitle}
                        </h3>
                        <p className="text-xs text-neutral-300 mt-1 max-w-md mx-auto break-keep">
                          {projectDesc}
                        </p>
                      </div>

                      {/* Bottom Audio Wave / Beat Visualizer */}
                      <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400">
                        <div className="flex items-center gap-1">
                          {[40, 70, 30, 85, 60, 95, 45, 80, 55, 90, 35, 75, 50, 100, 65, 40].map((h, i) => (
                            <span
                              key={i}
                              style={{
                                height: isPlaying ? `${Math.max(6, (h * ((currentTime * 10 + i) % 10)) / 10)}px` : '6px',
                                transition: 'height 0.15s ease'
                              }}
                              className="w-1 bg-blue-500 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono font-medium text-neutral-400">
                          {projectDuration || project.duration}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Sleek Video Controller Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-transparent p-3 sm:p-4 opacity-100 sm:opacity-90 group-hover:opacity-100 transition-opacity z-20">
                    {/* Timeline Scrubber */}
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="range"
                        min={0}
                        max={duration || 60}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-neutral-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
                      />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause size={15} /> : <Play size={15} className="fill-white ml-0.5" />}
                        </button>

                        <button
                          onClick={toggleMute}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} />}
                        </button>

                        <span className="font-mono text-[11px] text-neutral-300">
                          {formatTime(currentTime)} / {formatTime(duration || 60)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleFullscreen}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                          title="Fullscreen"
                        >
                          <Maximize size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 3: OVERVIEW & NARRATIVE (Always available or when Overview tab selected) */}
            <div className={`space-y-6 ${activeTab !== 'overview' && 'pt-6 border-t border-neutral-100'}`}>
              {/* Header Visual if not in video mode */}
              {activeTab === 'overview' && (
                <div className="relative aspect-16/9 w-full bg-neutral-950 rounded-2xl overflow-hidden shadow-xs">
                  <img
                    src={projectImage}
                    alt={projectTitle}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  {/* Copyright Watermark on Modal Header Image */}
                  <WatermarkOverlay variant="modal" text="lovey" />

                  {isVideoProject && (
                    <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center">
                      <button
                        onClick={() => setActiveTab('video')}
                        className="flex items-center gap-2.5 rounded-full bg-white/95 px-6 py-3 text-xs font-bold text-blue-600 shadow-2xl backdrop-blur-xs transition hover:scale-105 hover:bg-white hover:text-blue-700 cursor-pointer"
                      >
                        <Play size={16} className="fill-blue-600" />
                        <span>{labelSwitchToVideo}</span>
                      </button>
                    </div>
                  )}
                  {isProductPage && (
                    <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center">
                      <button
                        onClick={() => setActiveTab('detail_doc')}
                        className="flex items-center gap-2.5 rounded-full bg-white/95 px-6 py-3 text-xs font-bold text-blue-600 shadow-2xl backdrop-blur-xs transition hover:scale-105 hover:bg-white hover:text-blue-700 cursor-pointer"
                      >
                        <FileText size={16} />
                        <span>{labelSwitchToDetail}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Title & Metadata */}
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-neutral-950 break-keep leading-snug">
                  {projectTitle}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed break-keep">
                  {projectDesc}
                </p>
              </div>

              {/* Quick Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded-2xl bg-neutral-50 p-4 sm:p-5 border border-neutral-100">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                    <User size={12} /> {t.modal.client}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 break-keep">
                    {projectClient || project.client || 'Confidential'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                    <Layers size={12} /> {t.modal.category}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 break-keep">
                    {project.role || project.category}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                    <Clock size={12} /> {t.modal.duration}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 break-keep">
                    {projectDuration || project.duration || 'Standard'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase flex items-center gap-1">
                    <Calendar size={12} /> {t.modal.year}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 break-keep">
                    {project.year}
                  </p>
                </div>
              </div>

              {/* Full Story Narrative */}
              {project.fullStory && (
                <div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-neutral-950 mb-2 break-keep">
                    {labelPlanningHeading}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
                    {project.fullStory}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {projectHighlights && projectHighlights.length > 0 && (
                <div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-neutral-950 mb-3 break-keep">
                    {labelHighlightsHeading}
                  </h4>
                  <ul className="space-y-2">
                    {projectHighlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 break-keep">
                        <CheckCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools Used */}
              {project.tools && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    {labelToolsHeading}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg bg-neutral-100 px-3 py-1 font-mono-tag text-xs font-semibold text-neutral-800 whitespace-nowrap"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Images */}
              {project.gallery && project.gallery.length > 0 && activeTab === 'overview' && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    {labelGalleryHeading}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((imgUrl, i) => (
                      <div key={i} className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-16/10 border border-neutral-200/80 group">
                        <img
                          src={imgUrl}
                          alt={`${projectTitle} detail ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover hover:scale-105 transition duration-300"
                        />
                        <WatermarkOverlay variant="card" text="lovey" showCenterWatermark={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
