
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calendar, Clock, Music, Tag, Hash } from 'lucide-react';

// Mock data for metadata - this would come from API in real app
const mockMetadata = {
  title: "Summer Vibes (Original Mix)",
  artist: "Beachfront Collective",
  album: "Tropical Moments",
  year: "2023",
  genre: "Electronic/Dance",
  duration: "3:45",
  bpm: "128",
  key: "A minor",
  format: "MP3",
  bitrate: "320 kbps"
};

const MusicMetadata = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span>Music Metadata</span>
          <Info className="ml-2 h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Detailed information about your audio file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetadataItem icon={<Music />} label="Title" value={mockMetadata.title} />
            <MetadataItem icon={<Mic />} label="Artist" value={mockMetadata.artist} />
            <MetadataItem icon={<Disc />} label="Album" value={mockMetadata.album} />
            <MetadataItem icon={<Calendar />} label="Year" value={mockMetadata.year} />
            <MetadataItem icon={<Tag />} label="Genre" value={mockMetadata.genre} />
            <MetadataItem icon={<Clock />} label="Duration" value={mockMetadata.duration} />
            <MetadataItem icon={<Tempo />} label="BPM" value={mockMetadata.bpm} />
            <MetadataItem icon={<Hash />} label="Key" value={mockMetadata.key} />
            <MetadataItem icon={<File />} label="Format" value={mockMetadata.format} />
            <MetadataItem icon={<Activity />} label="Bitrate" value={mockMetadata.bitrate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const MetadataItem = ({ icon, label, value }: MetadataItemProps) => {
  return (
    <div className="flex items-center p-2 rounded-md bg-secondary/50">
      <div className="p-2 rounded-md bg-background mr-3">
        {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-music-purple" })}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

// Custom icons
const Mic = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" x2="12" y1="19" y2="22"></line>
  </svg>
);

const Disc = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const Tempo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="4 17 10 11 16 17 22 11"></polyline>
    <line x1="4" x2="22" y1="7" y2="7"></line>
  </svg>
);

const File = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const Activity = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default MusicMetadata;
