
import React from 'react';
import { Guitar, Piano, Drum, Music, Mic } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data for instruments - this would come from API in real app
const mockInstruments = [
  { name: "Guitar", confidence: 85, icon: Guitar, color: "bg-music-purple" },
  { name: "Piano", confidence: 62, icon: Piano, color: "bg-music-accent" },
  { name: "Drums", confidence: 48, icon: Drum, color: "bg-music-light-blue" },
  { name: "Vocals", confidence: 93, icon: Mic, color: "bg-red-500" },
  { name: "Strings", confidence: 34, icon: Music, color: "bg-amber-500" },
];

const InstrumentDetection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span>Instrument Recognition</span>
          <div className="flex ml-3 space-x-1">
            {[1,2,3,4].map(i => (
              <div 
                key={i}
                className={`instrument-bar w-1 h-5 rounded-full bg-music-purple`}
                style={{ 
                  animationName: `equalizer-${i}`,
                  animationDuration: `${1 + (i * 0.2)}s`,
                  animationIterationCount: 'infinite'
                }}
              />
            ))}
          </div>
        </CardTitle>
        <CardDescription>
          The instruments detected in your audio file with confidence levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockInstruments.map((instrument, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`p-1.5 rounded-md ${instrument.color} mr-3`}>
                    <instrument.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{instrument.name}</span>
                </div>
                <span className="text-sm font-medium">{instrument.confidence}%</span>
              </div>
              <Progress value={instrument.confidence} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstrumentDetection;
