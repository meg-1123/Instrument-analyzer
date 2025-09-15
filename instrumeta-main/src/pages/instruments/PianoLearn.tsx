
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Piano, BookOpen, PlayCircle, MusicIcon } from 'lucide-react';

// Piano notes
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PianoLearn = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Create references for each note
  useEffect(() => {
    // Initialize audio for each note
    const initializeAudio = () => {
      notes.forEach(note => {
        if (!audioRefs.current[note]) {
          const audio = new Audio(`/piano-sounds/${note}.mp3`);
          audio.preload = 'auto';
          audioRefs.current[note] = audio;
        }
      });
    };

    // Initialize on first user interaction (required by some browsers)
    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      // Cleanup audio objects
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playNote = (note: string) => {
    // Stop any currently playing note
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    setActiveNote(note);
    
    // Try to play the actual sound if available
    const audio = audioRefs.current[note];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log("Error playing audio:", err);
        createFallbackSound(note);
      });
    } else {
      console.log(`Playing note: ${note}`);
      createFallbackSound(note);
    }
    
    // Simulate the note playing and then stopping
    setTimeout(() => {
      setActiveNote(null);
    }, 300);
  };

  // Create a sound using Web Audio API as fallback
  const createFallbackSound = (note: string) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Calculate frequency based on note
      const noteIndex = notes.indexOf(note);
      const baseFreq = 261.63; // Middle C (C4)
      const freqMultiplier = Math.pow(2, 1/12);
      const freq = baseFreq * Math.pow(freqMultiplier, noteIndex);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.5;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      
      setTimeout(() => {
        oscillator.stop();
      }, 1000);
    } catch (e) {
      console.log("Web Audio API not supported");
    }
  };

  const isWhiteKey = (note: string) => !note.includes('#');

  const renderPianoKey = (note: string, index: number) => {
    const isWhite = isWhiteKey(note);
    
    return (
      <div
        key={note}
        className={`
          ${isWhite ? 'bg-white border-gray-300' : 'bg-black z-10'}
          ${isWhite ? 'h-40 w-14' : 'h-28 w-10 absolute -ml-5 mt-0'}
          ${activeNote === note ? (isWhite ? 'bg-blue-100' : 'bg-blue-800') : ''}
          border border-gray-300 rounded-b-md cursor-pointer transition-colors
          ${isWhite ? '' : 'transform'}
          active:scale-[0.98] hover:${isWhite ? 'bg-blue-50' : 'bg-blue-900'}
        `}
        style={{
          left: isWhite ? `${index * 3.5}rem` : undefined
        }}
        onClick={() => playNote(note)}
      >
        <div className="absolute bottom-2 w-full text-center">
          <span className={`text-sm font-semibold ${isWhite ? 'text-gray-700' : 'text-white'}`}>
            {note}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Piano className="h-6 w-6 text-blue-500" />
          <h1 className="text-3xl font-bold">Piano Lessons</h1>
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
                <h2 className="text-2xl font-bold mb-4">How to Play the Piano</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">MASTERING THE BASICS</h3>
                    <ol className="space-y-4 list-decimal list-inside">
                      <li className="mb-4">
                        <span className="font-semibold">Find Middle C on the keyboard.</span> As a beginner, Middle C serves as your 
                        anchoring point. It's the key in the very middle of the keyboard, the first white 
                        key in a set of 3 with 2 black keys in between. Place your right thumb on Middle 
                        C, then let the rest of your fingers fall on the white keys to the right of Middle C.
                        <ul className="ml-8 mt-2 list-disc">
                          <li>Press the Middle C key with your thumb to play the note. In piano 
                          fingering notation, your thumb is frequently labeled with a 1.</li>
                          <li>Then play the white key next to it, D, with your index or 2 finger.</li>
                          <li>Your middle or 3 finger plays E, while your ring or 4 finger falls on the F key.</li>
                          <li>Your pinky or 5 finger plays G. These are the first 5 notes of the C Major scale.</li>
                        </ul>
                      </li>
                      
                      <li className="mb-4">
                        <span className="font-semibold">Set your metronome to about 80 bpm and gradually increase the speed as necessary.</span> Practice the C Major scale (80 bpm initially). To play the full C Major 
                        scale, begin by playing the first 3 notes you played when you located Middle C: 
                        C, D, and E. Now, instead of playing F with your ring finger, tuck your thumb 
                        under your 3 fingers and slide your hand down to play F with your thumb. Your 
                        4 fingers will now be in place to play the rest of the scale: G, A, B, and back to C 
                        an octave higher.
                        <ul className="ml-8 mt-2 list-disc">
                          <li>Start with the metronome at a relatively slow tempo and practice the 
                          scale until you can play it smoothly, moving your hand through the notes 
                          and hitting them in order without making any mistakes or looking down 
                          at the keyboard. Then, speed the metronome up a little and try again.</li>
                        </ul>
                      </li>
                      
                      <li className="mb-4">
                        <span className="font-semibold">Try other scales to learn the relationship between the notes.</span> Once you've 
                        mastered the C Major scale, you can move on to other scales. Some scales use 
                        only white keys, while others use white and black keys. As with the C Major 
                        scale, set your metronome to a slow tempo and gradually increase the speed.
                      </li>
                    </ol>
                  </div>
                  
                  <Button onClick={() => document.getElementById('piano-practice')?.scrollIntoView({ behavior: 'smooth' })}>
                    Start Practicing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" id="piano-practice">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Virtual Piano Practice</h2>
                <p className="mb-6">Click on the keys to play notes. Try to play a simple melody like "Twinkle Twinkle Little Star" (C C G G A A G).</p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="relative h-40 max-w-3xl mx-auto">
                    {/* White keys */}
                    {notes.filter(isWhiteKey).map((note, index) => renderPianoKey(note, index))}
                    
                    {/* Black keys */}
                    {notes.filter(note => !isWhiteKey(note)).map((note, index) => {
                      // Calculate position for black keys
                      const whiteKeyIndex = notes.findIndex(n => n === note.charAt(0));
                      return renderPianoKey(note, whiteKeyIndex);
                    })}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-2">Try these simple exercises:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Play C-D-E-F-G-F-E-D-C slowly</li>
                    <li>Play C-E-G (C major chord)</li>
                    <li>Play "Mary Had a Little Lamb": E-D-C-D-E-E-E</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Piano Learning Resources</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Beginner Piano PDF Resources</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <Button variant="link" className="p-0 h-auto text-blue-500">
                          Piano Basics - Finger Positions
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto text-blue-500">
                          Piano Scales for Beginners
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto text-blue-500">
                          Simple Piano Songs with Notes
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

export default PianoLearn;
