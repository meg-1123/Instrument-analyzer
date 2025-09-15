
import React, { useState, useRef } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload = ({ onFileSelected }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div 
          className={`upload-zone rounded-xl p-8 flex flex-col items-center justify-center ${dragActive ? 'dragging' : ''}`} 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={inputRef} 
            type="file" 
            className="hidden" 
            accept="audio/*"
            onChange={handleFileChange} 
          />
          
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-music-purple" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Upload Audio File</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
            Drag and drop your audio file here, or click to browse. We support MP3, WAV, FLAC, and other audio formats.
          </p>
          
          <Button onClick={triggerFileInput}>
            <Music className="mr-2 h-4 w-4" />
            Select Audio File
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl p-6 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate max-w-[200px] sm:max-w-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile} className="text-muted-foreground hover:text-destructive">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex gap-4 mt-2">
            <Button variant="outline" onClick={clearFile}>
              Change File
            </Button>
            <Button onClick={() => toast({ title: "Analysis in progress", description: "Your audio file is being analyzed..." })}>
              Analyze Audio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
