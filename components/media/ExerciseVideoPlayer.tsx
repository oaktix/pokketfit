'use client';

import React, { useState } from 'react';
import { Play, Pause, AlertCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface ExerciseVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  exerciseName: string;
  targetMuscles?: string[];
}

export default function ExerciseVideoPlayer({
  videoUrl,
  posterUrl,
  exerciseName,
  targetMuscles = [],
}: ExerciseVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!videoUrl || hasError) {
    return (
      <div className="w-full aspect-video bg-[#16120E] border border-[#2A241E] rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-card-dark">
        <div className="w-12 h-12 rounded-2xl bg-[#1E1914] border border-[#2A241E] flex items-center justify-center text-xl mb-3 shadow-inner">
          🏃‍♂️
        </div>
        <h4 className="text-sm font-bold text-white mb-1">{exerciseName} Demonstration</h4>
        <p className="text-xs text-[#8A8279] max-w-xs leading-relaxed">
          Visual pose guidance & form cues. Connect Cloudinary to stream 60fps movement demonstrations.
        </p>
        {targetMuscles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-3">
            {targetMuscles.map((muscle) => (
              <span key={muscle} className="text-[10px] font-semibold bg-[#110D0A] text-[#E37210] border border-[#E37210]/30 px-2 py-0.5 rounded-full">
                {muscle}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative group border border-[#2A241E] shadow-card-dark">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        playsInline
        muted={isMuted}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />

      {/* Video Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex justify-between items-center pointer-events-auto">
          <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
            {exerciseName}
          </span>
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-black/60 text-white hover:text-[#E37210] transition-colors backdrop-blur-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-center pointer-events-auto">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#E37210] hover:bg-[#F2801E] text-white flex items-center justify-center shadow-glow-orange active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
        </div>

        <div className="text-[10px] text-[#A8A096] text-right pointer-events-auto">
          HD Cloudinary Stream
        </div>
      </div>
    </div>
  );
}
