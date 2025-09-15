import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Guitar, BookOpen, PlayCircle, MusicIcon } from 'lucide-react';

const guitarStrings = ['E', 'A', 'D', 'G', 'B', 'E'];

const guitarNotes = {
  0: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'], // Open strings
  1: ['F2', 'Bb2', 'Eb3', 'Ab3', 'C4', 'F4'],
  2: ['F#2', 'B2', 'E3', 'A3', 'C#4', 'F#4'],
  3: ['G2', 'C3', 'F3', 'Bb3', 'D4', 'G4'],
  4: ['G#2', 'C#3', 'F#3', 'B3', 'D#4', 'G#4'],
  5: ['A2', 'D3', 'G3', 'C4', 'E4', 'A4']
};

const GuitarLearn = () => {
  const [activeString, setActiveString] = useState<number | null>(null);
  const [activeFret, setActiveFret] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  
  useEffect(() => {
    const initAudio = () => {
      Object.keys(guitarNotes).forEach(fret => {
        guitarNotes[Number(fret)].forEach((note, stringIndex) => {
          const audioKey = `${stringIndex}-${fret}`;
          if (!audioRefs.current[audioKey]) {
            const audio = new Audio();
            audio.src = `/guitar-sounds/${note.replace('#', 'sharp')}.mp3`;
            audioRefs.current[audioKey] = audio;
          }
        });
      });
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playNote = (string: number, fret: number) => {
    setActiveString(string);
    setActiveFret(fret);
    
    const audioKey = `${string}-${fret}`;
    const audio = audioRefs.current[audioKey];
    
    if (audio) {
      Object.values(audioRefs.current).forEach(a => {
        if (a && a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
      });
      
      audio.currentTime = 0;
      audio.play().catch(err => console.log("Audio play error:", err));
    } else {
      console.log(`Playing note: String ${string+1}, Fret ${fret}`);
      
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        const baseFreq = 82.41;
        const freqMultiplier = Math.pow(2, 1/12);
        const stringOffset = [0, 5, 10, 15, 19, 24];
        const freq = baseFreq * Math.pow(freqMultiplier, stringOffset[string] + fret);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'triangle';
        gainNode.gain.value = 0.5;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        
        setTimeout(() => {
          oscillator.stop();
        }, 1500);
      } catch (e) {
        console.log("Web Audio API not supported");
      }
    }
    
    setTimeout(() => {
      setActiveString(null);
      setActiveFret(null);
    }, 300);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Guitar className="h-6 w-6 text-amber-500" />
          <h1 className="text-3xl font-bold">Guitar Lessons</h1>
        </div>

        <Tabs defaultValue="learn">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="learn">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice">
              <PlayCircle className="h-4 w-4 mr-2" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="resources">
              <MusicIcon className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">How to Play the Guitar</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-amber-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">GETTING STARTED WITH GUITAR</h3>
                    <ol className="space-y-4 list-decimal list-inside">
                      <li className="mb-4">
                        <span className="font-semibold">Learn the parts of the guitar.</span> Familiarize yourself with the headstock, 
                        neck, frets, body, bridge, and strings.
                        <ul className="ml-8 mt-2 list-disc">
                          <li>The guitar has 6 strings from thickest to thinnest: E, A, D, G, B, E</li>
                          <li>The thickest string (6th string) is called the Low E</li>
                          <li>The thinnest string (1st string) is called the High E</li>
                        </ul>
                      </li>
                      
                      <li className="mb-4">
                        <span className="font-semibold">Learn how to hold the guitar properly.</span> Sit up straight with the guitar resting on your right thigh (if right-handed). The back of the guitar should touch your chest and stomach.
                        <ul className="ml-8 mt-2 list-disc">
                          <li>Your left hand should wrap around the neck with your thumb positioned at the back of the neck.</li>
                          <li>Your right hand should be positioned over the sound hole (acoustic) or pickups (electric).</li>
                        </ul>
                      </li>
                      
                      <li className="mb-4">
                        <span className="font-semibold">Practice basic open chords.</span> Start with the simplest chords: E, A, D, and G major. Learn to transition between them smoothly.
                        <ul className="ml-8 mt-2 list-disc">
                          <li>For the E chord: Place your first finger on the 3rd string, 1st fret; second finger on the 5th string, 2nd fret; third finger on the 4th string, 2nd fret.</li>
                          <li>For the A chord: Place your first finger on the 4th string, 2nd fret; second finger on the 3rd string, 2nd fret; third finger on the 2nd string, 2nd fret.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                  
                  <Button onClick={() => document.getElementById('guitar-practice')?.scrollIntoView({ behavior: 'smooth' })}>
                    Start Practicing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" id="guitar-practice">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Virtual Guitar Practice</h2>
                <p className="mb-6">Click on the strings and frets to play notes. Try simple chord shapes or individual notes.</p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="relative max-w-3xl mx-auto">
                    <div className="bg-amber-800 rounded-lg p-2">
                      <div className="relative bg-amber-900 rounded h-64">
                        {[...Array(5)].map((_, fretIndex) => (
                          <div 
                            key={fretIndex} 
                            className="absolute w-full border-t-2 border-gray-400"
                            style={{ top: `${(fretIndex + 1) * 20}%` }}
                          />
                        ))}
                        
                        {guitarStrings.map((string, stringIndex) => (
                          <div 
                            key={stringIndex}
                            className="absolute h-full"
                            style={{ 
                              left: `${16.6 * stringIndex + 8.3}%`,
                              width: '1px',
                              backgroundColor: stringIndex < 3 ? '#D4D4D8' : '#A1A1AA', 
                              boxShadow: '0 0 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {[...Array(6)].map((_, fretIndex) => (
                              <div
                                key={fretIndex}
                                className={`absolute cursor-pointer rounded-full ${activeString === stringIndex && activeFret === fretIndex ? 'bg-amber-500' : 'bg-transparent hover:bg-amber-300'}`}
                                style={{ 
                                  top: `${fretIndex * 20 + 10}%`,
                                  left: '-10px',
                                  width: '20px',
                                  height: '20px'
                                }}
                                onClick={() => playNote(stringIndex, fretIndex)}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-around mt-2">
                      {guitarStrings.map((string, index) => (
                        <div key={index} className="text-center w-12">
                          <span className="font-semibold">{string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-2">Try these simple exercises:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Play each open string from low E to high E</li>
                    <li>Practice the E major chord shape (022100)</li>
                    <li>Practice A major chord shape (X02220)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Guitar Learning Resources</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Beginner Guitar PDF Resources</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <Button variant="link" className="p-0 h-auto text-blue-500">
                          Basic Guitar Chords Chart
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto text-blue-500">
                          Guitar Fretboard Note Map
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto text-blue-500">
                          Simple Guitar Songs with Tabs
                        </Button>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                        <PlayCircle className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                        <PlayCircle className="h-10 w-10 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GuitarLearn;
