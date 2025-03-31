import { JSX, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export interface Music {
  icon: JSX.Element;
  image: string;
  title: string;
  subTitle: string;
  duration: string;
  audioSrc: string;
}

export default function AudioPlayer(props: Music): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update progress bar and current time
  const updateProgress = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      // Calculate progress percentage
      const progressPercent = (current / duration) * 100;
      setProgress(progressPercent);
      
      // Format current time
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      setCurrentTime(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
    }
  };

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  return (
    <div className="w-96 border border-gray-700 h-12 rounded-md flex items-center justify-between px-3 m-2 shadow-primary-glow bg-gray-800 text-gray-200">
      <audio ref={audioRef} src={props.audioSrc} />
      
      <div className="flex items-center py-2 gap-2">
        <button 
          onClick={togglePlay} 
          className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-gray-200"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        
        <div className="w-9 h-9">
          <Image
            src={props.image}
            alt={`${props.title} cover`}
            className="rounded-sm"
            width={36}
            height={36}
          />
        </div>
        
        <div>
          <h1 className="text-md text-gray-200">{props.title}</h1>
          <h3 className="font-semibold text-xs text-primary">{props.subTitle}</h3>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-400">{currentTime}</span>
      </div>
    </div>
  );
}