
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

interface AudioPlayerProps {
  audioUrl?: string;
  fileName?: string;
}

const AudioPlayer = ({ audioUrl, fileName = "No file selected" }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Update volume when the volume state changes
    audio.volume = volume / 100;
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audio.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setCurrentTime(audio.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const onProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold truncate max-w-[200px] sm:max-w-xs">{fileName}</h3>
            <span className="text-sm text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          
          <div className="mb-6">
            <Slider 
              value={[currentTime]} 
              min={0} 
              max={duration || 100}
              step={0.1}
              onValueChange={onProgressChange}
              className="cursor-pointer"
            />
          </div>
          
          <div className="waveform-container mb-6">
            <div className="h-full w-full bg-secondary/20 rounded-md overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={i} 
                  className="instrument-bar inline-block w-2 mx-0.5 bg-music-purple/60 rounded-full"
                  style={{ 
                    height: `${Math.random() * 50 + 10}px`,
                    opacity: i / 40 > currentTime / duration ? 0.3 : 1
                  }}
                />
              ))}
            </div>
            <div className="waveform-line"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={togglePlayPause} 
                className="rounded-full h-12 w-12 bg-music-purple hover:bg-music-deep-purple flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 w-32">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
        
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
