
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import InstrumentDetection from '@/components/InstrumentDetection';
import MusicMetadata from '@/components/MusicMetadata';
import AudioPlayer from '@/components/AudioPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Music2, HeadphonesIcon, AudioWaveform } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    // If the page is not accessed as /analyze, no login check is needed
    const isAnalyzePage = window.location.pathname === '/analyze';
    
    if (isAnalyzePage && (!user || !JSON.parse(user).isLoggedIn)) {
      navigate('/login');
    }
  }, [navigate]);
  
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user).isLoggedIn;
  };

  const handleFileSelected = (file: File) => {
    // If on the /analyze path, require login
    if (window.location.pathname === '/analyze' && !isAuthenticated()) {
      toast({
        title: "Login required",
        description: "Please log in to analyze music files.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    
    // Simulate API calling for analysis
    toast({
      title: "Analysis started",
      description: "We're analyzing your audio file. This might take a moment...",
    });
    
    // Simulate analysis completion after a delay
    setTimeout(() => {
      setAnalysisComplete(true);
      toast({
        title: "Analysis complete!",
        description: "We've detected the instruments and extracted metadata from your audio file.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {!selectedFile ? (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-music-purple to-music-accent bg-clip-text text-transparent">
                  Analyze Your Music
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload your audio file to identify instruments, extract metadata, and visualize your sound.
                </p>
                
                {!isAuthenticated() && (
                  <div className="mt-6">
                    <Button 
                      size="lg" 
                      onClick={() => navigate('/login')}
                      className="bg-music-purple hover:bg-music-purple/90"
                    >
                      Login to Access All Features
                    </Button>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Create an account to save analyses and access all learning resources
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <FeatureCard 
                  icon={<AudioWaveform className="h-8 w-8 text-music-purple" />}
                  title="Instrument Recognition"
                  description="Identify instruments used in your tracks with confidence scores"
                />
                <FeatureCard 
                  icon={<Music2 className="h-8 w-8 text-music-accent" />}
                  title="Metadata Extraction"
                  description="Extract detailed music metadata including BPM, key, and more"
                />
                <FeatureCard 
                  icon={<HeadphonesIcon className="h-8 w-8 text-music-light-blue" />}
                  title="Audio Visualization"
                  description="See your music come to life with dynamic audio visualizations"
                />
              </div>
              
              <FileUpload onFileSelected={handleFileSelected} />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Audio Analysis Results</h2>
              
              <div className="mb-8">
                <AudioPlayer audioUrl={audioUrl} fileName={selectedFile.name} />
              </div>
              
              {analysisComplete ? (
                <Tabs defaultValue="instruments">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="instruments" className="text-sm sm:text-base">
                      <Mic className="mr-2 h-4 w-4" />
                      Instrument Analysis
                    </TabsTrigger>
                    <TabsTrigger value="metadata" className="text-sm sm:text-base">
                      <Music2 className="mr-2 h-4 w-4" />
                      Music Metadata
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="instruments" className="mt-0">
                    <InstrumentDetection />
                  </TabsContent>
                  
                  <TabsContent value="metadata" className="mt-0">
                    <MusicMetadata />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex items-center justify-center p-12">
                  <div className="flex flex-col items-center">
                    <div className="flex space-x-2 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-10 bg-music-purple rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">Analyzing your audio file...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 InstruMeta All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-card border rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default Index;
