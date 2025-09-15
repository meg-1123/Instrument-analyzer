import React, { useState, useEffect, useRef } from 'react';

const VirtualInstruments = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState({});
  const [activeNote, setActiveNote] = useState(null);
  const [activeString, setActiveString] = useState(null);
  const [activeDrum, setActiveDrum] = useState(null);
  const audioContext = useRef(null);

  const initAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext.current;
  };

  const playSound = (soundUrl) => {
    const context = initAudioContext();

    fetch(soundUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start(0);
      })
      .catch(error => console.error('Error with playing sound:', error));
  };

  const playTone = (frequency, duration = 0.5, identifier = null) => {
    const context = initAudioContext();

    let waveType = 'sine';
    if (currentView === 'piano') waveType = 'triangle';
    if (currentView === 'guitar') waveType = 'sawtooth';
    if (currentView === 'xylophone') waveType = 'sine';
    if (currentView === 'drums') waveType = 'square';

    // For kick drum specifically, use a different approach
    if (identifier === 'kick') {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.setValueAtTime(150, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(60, context.currentTime + 0.1);

      gainNode.gain.setValueAtTime(1.0, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);

      setActiveDrum('kick');
      setTimeout(() => setActiveDrum(null), duration * 1000);
      return;
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = waveType;
    oscillator.frequency.value = frequency;

    // Increased gain from 0.1 to 0.7 for more volume
    gainNode.gain.setValueAtTime(0.7, context.currentTime);

    // Create an attack-release envelope for more natural sound
    if (currentView === 'drums') {
      // Quick attack, medium decay for percussion sounds
      gainNode.gain.linearRampToValueAtTime(1.0, context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    } else {
      // More gentle envelope for melodic instruments
      gainNode.gain.linearRampToValueAtTime(0.9, context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    }

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);

    // Set active element for visual feedback
    if (identifier) {
      if (currentView === 'piano') setActiveNote(identifier);
      if (currentView === 'guitar') setActiveString(identifier);
      if (currentView === 'xylophone') setActiveNote(identifier);
      if (currentView === 'drums') setActiveDrum(identifier);

      // Reset after animation
      setTimeout(() => {
        setActiveNote(null);
        setActiveString(null);
        setActiveDrum(null);
      }, duration * 1000);
    }
  };
  const playDrumSound = (drumType) => {
    const context = initAudioContext();

    setActiveDrum(drumType);

    switch (drumType) {
      case 'kick':
        // Deep, punchy kick drum
        const kickOsc = context.createOscillator();
        const kickGain = context.createGain();

        kickOsc.connect(kickGain);
        kickGain.connect(context.destination);

        kickOsc.frequency.setValueAtTime(150, context.currentTime);
        kickOsc.frequency.exponentialRampToValueAtTime(40, context.currentTime + 0.1);

        kickGain.gain.setValueAtTime(1.0, context.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);

        kickOsc.start(context.currentTime);
        kickOsc.stop(context.currentTime + 0.5);
        break;

      case 'snare':
        // Noise-based snare sound
        const snareOsc = context.createOscillator();
        const snareNoise = context.createBufferSource();
        const snareGain = context.createGain();
        const noiseGain = context.createGain();

        // Create a noise buffer
        const bufferSize = context.sampleRate * 0.3;
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        snareNoise.buffer = buffer;

        snareOsc.type = 'triangle';
        snareOsc.frequency.value = 250;

        snareOsc.connect(snareGain);
        snareNoise.connect(noiseGain);
        snareGain.connect(context.destination);
        noiseGain.connect(context.destination);

        snareGain.gain.setValueAtTime(0.8, context.currentTime);
        snareGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);

        noiseGain.gain.setValueAtTime(0.8, context.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);

        snareOsc.start(context.currentTime);
        snareNoise.start(context.currentTime);

        snareOsc.stop(context.currentTime + 0.1);
        snareNoise.stop(context.currentTime + 0.2);
        break;

      case 'hihat':
        // High frequency noise for hi-hat
        const hihatOsc = context.createOscillator();
        const hihatGain = context.createGain();
        const hihatFilter = context.createBiquadFilter();

        hihatOsc.type = 'square';
        hihatOsc.frequency.value = 800;

        hihatFilter.type = 'highpass';
        hihatFilter.frequency.value = 700;
        hihatFilter.Q.value = 15;

        hihatOsc.connect(hihatFilter);
        hihatFilter.connect(hihatGain);
        hihatGain.connect(context.destination);

        hihatGain.gain.setValueAtTime(0.6, context.currentTime);
        hihatGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);

        hihatOsc.start(context.currentTime);
        hihatOsc.stop(context.currentTime + 0.2);
        break;

      case 'tom1':
        // Mid tom drum
        const tom1Osc = context.createOscillator();
        const tom1Gain = context.createGain();

        tom1Osc.connect(tom1Gain);
        tom1Gain.connect(context.destination);

        tom1Osc.type = 'sine';
        tom1Osc.frequency.setValueAtTime(180, context.currentTime);
        tom1Osc.frequency.exponentialRampToValueAtTime(120, context.currentTime + 0.1);

        tom1Gain.gain.setValueAtTime(1.0, context.currentTime);
        tom1Gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);

        tom1Osc.start(context.currentTime);
        tom1Osc.stop(context.currentTime + 0.4);
        break;

      case 'tom2':
        // Low tom drum
        const tom2Osc = context.createOscillator();
        const tom2Gain = context.createGain();

        tom2Osc.connect(tom2Gain);
        tom2Gain.connect(context.destination);

        tom2Osc.type = 'sine';
        tom2Osc.frequency.setValueAtTime(130, context.currentTime);
        tom2Osc.frequency.exponentialRampToValueAtTime(80, context.currentTime + 0.1);

        tom2Gain.gain.setValueAtTime(1.0, context.currentTime);
        tom2Gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);

        tom2Osc.start(context.currentTime);
        tom2Osc.stop(context.currentTime + 0.4);
        break;

      case 'crash':
        // Crash cymbal with filtered noise
        const crashOsc = context.createOscillator();
        const crashGain = context.createGain();

        crashOsc.type = 'triangle';
        crashOsc.frequency.value = 400;

        const crashFilter = context.createBiquadFilter();
        crashFilter.type = 'highpass';
        crashFilter.frequency.value = 200;

        crashOsc.connect(crashFilter);
        crashFilter.connect(crashGain);
        crashGain.connect(context.destination);

        crashGain.gain.setValueAtTime(0.8, context.currentTime);
        crashGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.0);

        crashOsc.start(context.currentTime);
        crashOsc.stop(context.currentTime + 1.0);
        break;

      default:
        // Fallback to original playTone for unknown drum types
        playTone(400, 0.3, drumType);
    }

    // Reset after animation
    setTimeout(() => {
      setActiveDrum(null);
    }, 500);
  };
  // Piano key frequencies (C4 to B4)
  const pianoNotes = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88,
    'C5': 523.25
  };

  // Guitar string frequencies (standard tuning)
  const guitarStrings = {
    'E': 82.41,
    'A': 110.00,
    'D': 146.83,
    'G': 196.00,
    'B': 246.94,
    'e': 329.63
  };

  // Xylophone note frequencies (C major scale)
  const xylophoneNotes = {
    'C': 261.63,
    'D': 293.66,
    'E': 329.63,
    'F': 349.23,
    'G': 392.00,
    'A': 440.00,
    'B': 493.88,
    'C5': 523.25
  };

  // Drum sounds
  const drumSounds = {
    'kick': '/sounds/kick.mp3',
    'snare': '/sounds/snare.mp3',
    'hihat': '/sounds/hihat.mp3',
    'tom1': '/sounds/tom1.mp3',
    'tom2': '/sounds/tom2.mp3',
    'crash': '/sounds/crash.mp3'
  };

  // Load drum sound files
  useEffect(() => {
    if (currentView === 'drums') {
      setLoading({ status: true, message: 'Loading drum sounds...' });
      // Simulate loading time
      const timer = setTimeout(() => {
        setLoading({ status: false, message: '' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const resetToHome = () => {
    setCurrentView('home');
  };

  // Quiz related functions
  const handleStartQuiz = () => {
    setCurrentQuiz(0);
    setQuizAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setCurrentView(`${currentView}-quiz`);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    const newAnswers = { ...quizAnswers, [questionIndex]: answerIndex };
    setQuizAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuiz < 4) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const instrumentKey = currentView.replace('-quiz', '');
    const instrument = instruments[instrumentKey];
    let correctCount = 0;

    instrument.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setQuizCompleted(true);
  };

  const instruments = {
    piano: {
      title: 'Piano',
      description: 'Learn to play keys with our interactive piano. Perfect for beginners and intermediate players.',
      icon: '🎹',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      content: {
        history: 'The piano was invented around 1700 by Bartolomeo Cristofori in Italy. It evolved from the harpsichord and clavichord, offering dynamic expression through touch sensitivity.',
        basics: 'Piano has 88 keys - 52 white keys and 36 black keys. The white keys represent natural notes (C, D, E, F, G, A, B) while black keys are sharps and flats.',
        technique: 'Proper posture is crucial: sit straight, feet flat on floor, curved fingers, and relaxed wrists. Start with simple scales and arpeggios.',
        famous: 'Famous pianists include Mozart, Chopin, Beethoven, and contemporary artists like Elton John and Billy Joel.'
      },
      quiz: [
        {
          question: 'Who invented the piano?',
          options: ['Mozart', 'Bartolomeo Cristofori', 'Bach', 'Chopin'],
          correct: 1
        },
        {
          question: 'How many keys does a standard piano have?',
          options: ['76', '88', '61', '104'],
          correct: 1
        },
        {
          question: 'What should be the proper finger position when playing piano?',
          options: ['Flat fingers', 'Curved fingers', 'Straight fingers', 'Bent backwards'],
          correct: 1
        },
        {
          question: 'Which keys represent natural notes on a piano?',
          options: ['Black keys', 'White keys', 'Both', 'Neither'],
          correct: 1
        },
        {
          question: 'What is the most important aspect of piano posture?',
          options: ['Standing up', 'Sitting straight', 'Leaning forward', 'Slouching'],
          correct: 1
        }
      ]
    },
    guitar: {
      title: 'Guitar',
      description: 'Learn to play this versatile stringed instrument. Great for chords and melodies.',
      icon: '🎸',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      content: {
        history: 'The modern guitar evolved over centuries from ancient stringed instruments. The six-string classical guitar emerged in the 18th century and electric guitars appeared in the 1930s.',
        basics: 'Standard guitars have 6 strings tuned to E, A, D, G, B, E (low to high). The neck is divided by frets which represent different pitches when strings are pressed.',
        technique: 'Playing involves using the fretting hand (typically left) to press strings against frets and the picking hand (typically right) to pluck or strum strings.',
        famous: 'Famous guitarists include Jimi Hendrix, Eric Clapton, Jimmy Page, Eddie Van Halen, and Andrés Segovia.'
      },
      quiz: [
        {
          question: 'How many strings does a standard guitar have?',
          options: ['4', '5', '6', '7'],
          correct: 2
        },
        {
          question: 'What is the standard tuning of guitar strings from lowest to highest?',
          options: ['E-A-D-G-B-E', 'A-D-G-C-E-A', 'G-C-F-Bb-D-G', 'D-G-C-F-A-D'],
          correct: 0
        },
        {
          question: 'What divides the guitar neck into semitone intervals?',
          options: ['Strings', 'Frets', 'Bridge', 'Nut'],
          correct: 1
        },
        {
          question: 'When did electric guitars first appear?',
          options: ['1890s', '1930s', '1950s', '1970s'],
          correct: 1
        },
        {
          question: 'Which of these is a famous guitarist?',
          options: ['Mozart', 'Beethoven', 'Jimi Hendrix', 'Bach'],
          correct: 2
        }
      ]
    },
    xylophone: {
      title: 'Xylophone',
      description: 'Learn about this percussion instrument with tuned wooden bars.',
      icon: '🔔',
      color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      content: {
        history: 'The xylophone originated in Asia and Africa and has been used for thousands of years. The modern orchestral xylophone was developed in the 19th century.',
        basics: 'A xylophone consists of wooden bars of different lengths arranged in a row like piano keys. Each bar produces a specific pitch when struck.',
        technique: 'Played by striking the bars with mallets. The center of the bar produces the clearest tone. Different mallets create different timbres.',
        famous: 'Famous xylophonists include Yoichi Hiraoka, Bob Becker, Evelyn Glennie, and Red Norvo from the jazz era.'
      },
      quiz: [
        {
          question: 'Where did the xylophone originate?',
          options: ['Europe', 'Americas', 'Asia and Africa', 'Australia'],
          correct: 2
        },
        {
          question: 'What are xylophone bars typically made of?',
          options: ['Metal', 'Wood', 'Plastic', 'Glass'],
          correct: 1
        },
        {
          question: 'Where should you strike the xylophone bar for the clearest tone?',
          options: ['On the edge', 'In the center', 'Near the cord', 'Any location'],
          correct: 1
        },
        {
          question: 'When was the modern orchestral xylophone developed?',
          options: ['18th century', '19th century', '20th century', '21st century'],
          correct: 1
        },
        {
          question: 'What are used to play the xylophone?',
          options: ['Hammers', 'Bows', 'Mallets', 'Fingers'],
          correct: 2
        }
      ]
    },
    drums: {
      title: 'Drums',
      description: 'Learn the fundamentals of rhythm with this essential percussion instrument.',
      icon: '🥁',
      color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      content: {
        history: 'Drums are among the oldest musical instruments, used by ancient civilizations worldwide. The modern drum kit developed in the early 20th century for jazz and dance bands.',
        basics: 'A standard drum kit includes a bass drum, snare drum, tom-toms, hi-hat cymbals, and crash/ride cymbals, each producing distinctive sounds.',
        technique: 'Drummers use sticks, brushes, or mallets to strike the drum heads and cymbals. Coordination between hands and feet is essential for most styles.',
        famous: 'Famous drummers include Buddy Rich, John Bonham (Led Zeppelin), Neil Peart (Rush), and modern artists like Travis Barker and Sheila E.'
      },
      quiz: [
        {
          question: 'When did the modern drum kit develop?',
          options: ['Late 19th century', 'Early 20th century', 'Mid 20th century', 'Late 20th century'],
          correct: 1
        },
        {
          question: 'Which is NOT typically part of a standard drum kit?',
          options: ['Bass drum', 'Snare drum', 'Piano', 'Hi-hats'],
          correct: 2
        },
        {
          question: 'What is essential for drummers to develop?',
          options: ['Vocal range', 'Coordination', 'Flexibility', 'Music reading'],
          correct: 1
        },
        {
          question: 'Which of these is a famous drummer?',
          options: ['Eric Clapton', 'John Bonham', 'Jimi Hendrix', 'Vladimir Horowitz'],
          correct: 1
        },
        {
          question: 'What implements do drummers typically use to play drums?',
          options: ['Bows', 'Hammers', 'Sticks', 'Picks'],
          correct: 2
        }
      ]
    },
    home: {
      title: 'Virtual Instruments',
      icon: '🎵',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  };

  const instrument = instruments[currentView] || instruments.home;

  const renderInteractiveInstrument = () => {
    switch (currentView) {
      case 'piano':
        return (
          <div className="card shadow border-0 mb-4 overflow-hidden">
            <div className="card-header bg-primary text-white p-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">{instrument.icon}</span>
                Interactive Piano
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-center mb-4 text-muted">Click on the keys to play notes</p>
              <div className="d-flex justify-content-center mb-4">
                <div className="piano-container" style={{ position: 'relative', height: '240px', width: '100%', maxWidth: '800px' }}>
                  {/* White keys */}
                  <div className="white-keys" style={{ display: 'flex', height: '100%' }}>
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'].map((note) => (
                      <div
                        key={note}
                        className="white-key"
                        onClick={() => playTone(pianoNotes[note], 0.8, note)}
                        style={{
                          flex: 1,
                          backgroundColor: activeNote === note ? '#e6e6ff' : 'white',
                          border: '1px solid #ccc',
                          borderRadius: '0 0 6px 6px',
                          cursor: 'pointer',
                          marginRight: '2px',
                          height: '100%',
                          position: 'relative',
                          transition: 'background-color 0.1s',
                          boxShadow: activeNote === note ? 'none' : '0 5px 5px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', fontWeight: '500' }}>
                          {note}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Black keys */}
                  <div style={{ position: 'absolute', top: 0, left: '5%', height: '65%', width: '90%', display: 'flex' }}>
                    {['C#', 'D#', '', 'F#', 'G#', 'A#', ''].map((note, index) => (
                      note ? (
                        <div
                          key={note}
                          onClick={() => playTone(pianoNotes[note], 0.8, note)}
                          style={{
                            width: '8%',
                            height: '100%',
                            backgroundColor: activeNote === note ? '#555' : '#333',
                            marginLeft: index === 0 ? `${(100 / 7) * 0.7}%` : (index === 3 ? `${(100 / 7) * 2.3}%` : `${(100 / 7) * 1.2}%`),
                            zIndex: 1,
                            cursor: 'pointer',
                            borderRadius: '0 0 4px 4px',
                            boxShadow: activeNote === note ? 'none' : '0 3px 5px rgba(0,0,0,0.3)',
                            transition: 'background-color 0.1s'
                          }}
                        >
                          <div style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', color: 'white', fontSize: '0.8rem' }}>
                            {note}
                          </div>
                        </div>
                      ) : <div key={`spacer-${index}`} style={{ width: '8%' }} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-muted">Try playing a simple melody like "Mary Had a Little Lamb" (E, D, C, D, E, E, E)</p>
            </div>
          </div>
        );

      case 'guitar':
        return (
          <div className="card shadow border-0 mb-4 overflow-hidden">
            <div className="card-header bg-danger text-white p-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">{instrument.icon}</span>
                Interactive Guitar
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-center mb-4 text-muted">Click on strings to play</p>
              <div className="d-flex justify-content-center mb-4">
                <div className="guitar-container" style={{
                  position: 'relative',
                  height: '350px',
                  width: '100%',
                  maxWidth: '600px',
                  background: 'linear-gradient(to right, #D2B48C, #8B4513)',
                  borderRadius: '10px',
                  padding: '30px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}>
                  {Object.entries(guitarStrings).map(([string, freq], index) => (
                    <div
                      key={string}
                      onClick={() => playTone(freq, 1.5, string)}
                      style={{
                        position: 'relative',
                        height: '40px',
                        width: '100%',
                        marginBottom: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}>{string}</div>
                      <div style={{
                        flex: 1,
                        height: index === 0 ? '7px' : index === 1 ? '6px' : index === 2 ? '5px' : index === 3 ? '4px' : index === 4 ? '3px' : '2px',
                        backgroundColor: activeString === string ? '#f8f8f8' : '#ddd',
                        borderRadius: '2px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        animation: activeString === string ? 'stringVibration 0.5s ease-out' : 'none'
                      }}></div>
                    </div>
                  ))}
                  <div style={{ position: 'absolute', width: '15px', height: '90%', backgroundColor: '#8B4513', right: '40px', top: '5%', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}></div>

                  <style>
                    {`
                      @keyframes stringVibration {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-2px); }
                        50% { transform: translateY(3px); }
                        75% { transform: translateY(-1px); }
                      }
                    `}
                  </style>
                </div>
              </div>
              <p className="text-center text-muted">The guitar is tuned to standard tuning: E, A, D, G, B, e (from lowest to highest)</p>
            </div>
          </div>
        );

      case 'xylophone':
        return (
          <div className="card shadow border-0 mb-4 overflow-hidden">
            <div className="card-header bg-info text-white p-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">{instrument.icon}</span>
                Interactive Xylophone
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-center mb-4 text-muted">Click on the bars to play notes</p>
              <div className="d-flex justify-content-center mb-4">
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  paddingBottom: '30px',
                  paddingTop: '20px',
                  position: 'relative'
                }}>
                  {Object.entries(xylophoneNotes).map(([note, freq], index) => (
                    <div
                      key={note}
                      onClick={() => playTone(freq, 1.0, note)}
                      style={{
                        height: `${180 - (index * 12)}px`,
                        width: '50px',
                        backgroundColor: activeNote === note
                          ? `hsl(${index * 36}, 95%, 75%)`
                          : `hsl(${index * 36}, 90%, 65%)`,
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        paddingBottom: '15px',
                        cursor: 'pointer',
                        boxShadow: activeNote === note
                          ? '0 0 10px rgba(0,0,0,0.2)'
                          : '0 6px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.1s ease',
                        transform: activeNote === note ? 'translateY(2px)' : 'translateY(0)',
                        fontWeight: '500'
                      }}
                    >
                      {note}
                    </div>
                  ))}

                  {/* Support bar */}
                  <div style={{
                    position: 'absolute',
                    width: '90%',
                    height: '12px',
                    backgroundColor: '#8B4513',
                    borderRadius: '6px',
                    bottom: '15px',
                    zIndex: '-1'
                  }}></div>
                </div>
              </div>
              <p className="text-center text-muted">Try playing "Twinkle Twinkle Little Star" (C, C, G, G, A, A, G)</p>
            </div>
          </div>
        );

      case 'drums':
        return (
          <div className="card shadow border-0 mb-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">{instrument.icon}</span>
                Interactive Drums
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-center mb-4 text-muted">Click on drum components to play sounds</p>
              {loading.status ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 fw-bold">{loading.message}</p>
                </div>
              ) : (
                <div className="drum-kit" style={{
                  position: 'relative',
                  width: '100%',
                  height: '500px',
                  background: 'linear-gradient(145deg, #2c3e50, #34495e)',
                  borderRadius: '20px',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                  padding: '20px'
                }}>
                  {/* Backdrop design elements */}
                  <div style={{
                    position: 'absolute',
                    width: '90%',
                    height: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    top: '40%',
                    left: '5%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    width: '2px',
                    height: '90%',
                    background: 'rgba(255,255,255,0.1)',
                    left: '50%',
                    top: '5%'
                  }}></div>

                  {/* Bass drum */}
                  <div className="kick-container"
                    onClick={() => playDrumSound('kick')}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '40px',
                      transform: 'translateX(-50%)',
                      cursor: 'pointer'
                    }}>
                    <div className="kick-outline" style={{
                      position: 'absolute',
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.2)',
                      left: '-10px',
                      top: '-10px',
                      animation: activeDrum === 'kick' ? 'pulse 0.3s ease-out' : 'none'
                    }}></div>
                    <div className="kick" style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #e74c3c, #c0392b)',
                      boxShadow: activeDrum === 'kick'
                        ? '0 0 20px rgba(231, 76, 60, 0.7), inset 0 0 30px rgba(0,0,0,0.4)'
                        : '0 10px 20px rgba(0,0,0,0.3), inset 0 0 30px rgba(0,0,0,0.4)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      transform: activeDrum === 'kick' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}>
                      KICK
                    </div>
                  </div>

                  {/* Snare drum */}
                  <div className="snare-container"
                    onClick={() => playDrumSound('snare')}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '45%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}>
                    <div className="snare-outline" style={{
                      position: 'absolute',
                      width: '120px',
                      height: '80px',
                      borderRadius: '10px',
                      border: '3px solid rgba(255,255,255,0.2)',
                      left: '-8px',
                      top: '-8px',
                      animation: activeDrum === 'snare' ? 'pulse 0.3s ease-out' : 'none'
                    }}></div>
                    <div className="snare" style={{
                      width: '110px',
                      height: '70px',
                      borderRadius: '8px',
                      background: 'radial-gradient(circle, #f39c12, #d35400)',
                      boxShadow: activeDrum === 'snare'
                        ? '0 0 20px rgba(243, 156, 18, 0.7), inset 0 0 20px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.4)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      transform: activeDrum === 'snare' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}>
                      SNARE
                    </div>
                  </div>

                  {/* Hi-hat */}
                  <div className="hihat-container"
                    onClick={() => playDrumSound('hihat')}
                    style={{
                      position: 'absolute',
                      left: '25%',
                      top: '30%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}>
                    <div className="hihat-outline" style={{
                      position: 'absolute',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.2)',
                      left: '-8px',
                      top: '-8px',
                      animation: activeDrum === 'hihat' ? 'pulse 0.3s ease-out' : 'none'
                    }}></div>
                    <div className="hihat" style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #f1c40f, #d4ac0d)',
                      boxShadow: activeDrum === 'hihat'
                        ? '0 0 20px rgba(241, 196, 15, 0.7), inset 0 0 20px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.4)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      textAlign: 'center',
                      padding: '5px',
                      fontSize: '0.9rem',
                      transform: activeDrum === 'hihat' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}>
                      HI-HAT
                    </div>
                  </div>

                  {/* Tom 1 */}
                  <div className="tom1-container"
                    onClick={() => playDrumSound('tom1')}
                    style={{
                      position: 'absolute',
                      left: '75%',
                      top: '25%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}>
                    <div className="tom1-outline" style={{
                      position: 'absolute',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.2)',
                      left: '-8px',
                      top: '-8px',
                      animation: activeDrum === 'tom1' ? 'pulse 0.3s ease-out' : 'none'
                    }}></div>
                    <div className="tom1" style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #3498db, #2980b9)',
                      boxShadow: activeDrum === 'tom1'
                        ? '0 0 20px rgba(52, 152, 219, 0.7), inset 0 0 25px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.3), inset 0 0 25px rgba(0,0,0,0.4)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      transform: activeDrum === 'tom1' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}>
                      TOM 1
                    </div>
                  </div>

                  {/* Tom 2 */}
                  <div className="tom2-container"
                    onClick={() => playDrumSound('tom2')}
                    style={{
                      position: 'absolute',
                      left: '80%',
                      top: '55%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}>
                    <div className="tom2-outline" style={{
                      position: 'absolute',
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.2)',
                      left: '-8px',
                      top: '-8px',
                      animation: activeDrum === 'tom2' ? 'pulse 0.3s ease-out' : 'none'
                    }}></div>
                    <div className="tom2" style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #2ecc71, #27ae60)',
                      boxShadow: activeDrum === 'tom2'
                        ? '0 0 20px rgba(46, 204, 113, 0.7), inset 0 0 25px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.3), inset 0 0 25px rgba(0,0,0,0.4)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      transform: activeDrum === 'tom2' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}>
                      TOM 2
                    </div>
                  </div>

                  {/* Crash */}
                  <div className="crash-container"
                    onClick={() => playDrumSound('crash')}
                    style={{
                      position: 'absolute',
                      right: '15%',
                      top: '15%',
                      cursor: 'pointer'
                    }}>
                    <div className="crash-outline" style={{
                      position: 'absolute',
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.2)',
                      left: '-8px',
                      top: '-8px',
                      animation: activeDrum === 'crash' ? 'pulse 0.3s ease-out' : 'none'
                    }}></div>
                    <div className="crash" style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #9b59b6, #8e44ad)',
                      boxShadow: activeDrum === 'crash'
                        ? '0 0 20px rgba(155, 89, 182, 0.7), inset 0 0 25px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.3), inset 0 0 25px rgba(0,0,0,0.4)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      transform: activeDrum === 'crash' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}>
                      CRASH
                    </div>
                  </div>

                  <style>
                    {`
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.05); opacity: 1; }
                  100% { transform: scale(1); opacity: 0.7; }
                }
              `}
                  </style>
                </div>
              )}
              <p className="text-center text-muted mt-4">Try creating a rhythm pattern! The kick (red) is the bass drum, snare (orange) adds accent.</p>
            </div>
          </div>
        );

      case 'home':
        return renderInstrumentSelection();

      default:
        return null;
    }
  };

  const renderInstrumentSelection = () => {
    return (
      <div className="row g-4">
        {Object.entries(instruments).filter(([key]) => key !== 'home').map(([key, inst]) => (
          <div className="col-md-6 col-lg-3" key={key}>
            <div
              className="card h-100 shadow-lg border-0 instrument-card"
              onClick={() => setCurrentView(key)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="card-img-top text-center p-4"
                style={{ background: inst.color, minHeight: '160px' }}
              >
                <div
                  className="mb-2 mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '50%',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}
                >
                  <span style={{ fontSize: '3.5rem' }}>{inst.icon}</span>
                </div>
              </div>
              <div className="card-body text-center p-4">
                <h5 className="card-title fw-bold mb-2">{inst.title}</h5>
                <p className="card-text text-muted mb-3">{inst.description}</p>
                <button className="btn btn-primary w-100 fw-bold">
                  Learn & Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Quiz view
  if (currentView.includes('-quiz')) {
    const instrumentKey = currentView.replace('-quiz', '');
    const instrument = instruments[instrumentKey];
    const currentQuestion = instrument.quiz[currentQuiz];

    if (quizCompleted) {
      return (
        <div className="container-fluid" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9f9f9, #f0f0f0)' }}>
          <div className="container py-5">
            <div className="card shadow-lg border-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="card-body text-center p-5">
                <h2 className="fw-bold mb-4">Quiz Completed!</h2>
                <div className="mb-4">
                  <span style={{ fontSize: '4rem' }}>
                    {score >= 4 ? '🎉' : score >= 3 ? '👍' : '📚'}
                  </span>
                </div>
                <h4>Your Score: {score}/5</h4>
                <p className="text-muted">
                  {score >= 4 ? 'Excellent work!' : score >= 3 ? 'Good job!' : 'Keep practicing!'}
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-primary" onClick={() => setCurrentView(instrumentKey)}>
                    Learn Again
                  </button>
                  <button className="btn btn-outline-secondary" onClick={resetToHome}>
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9f9f9, #f0f0f0)' }}>
        <div className="container py-5">
          <div className="card shadow-lg border-0" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{instrument.title} Quiz</h5>
                <span className="badge bg-light text-dark">Question {currentQuiz + 1}/5</span>
              </div>
            </div>
            <div className="card-body p-4">
              <h4 className="mb-4">{currentQuestion.question}</h4>
              <div className="d-grid gap-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`btn btn-outline-primary text-start ${quizAnswers[currentQuiz] === index ? 'active' : ''
                      }`}
                    onClick={() => handleQuizAnswer(currentQuiz, index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={resetToHome}>
                  Back to Home
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                  disabled={quizAnswers[currentQuiz] === undefined}
                >
                  {currentQuiz < 4 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'home') {
    return (
      <div className="container-fluid" style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f9f9f9, #f0f0f0)'
      }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.5)'
              }}
            >
              <span style={{ fontSize: '4rem', color: 'white' }}>🎵</span>
            </div>
            <h1 className="display-4 fw-bold mb-3">Virtual Instruments</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Learn about various musical instruments and play them virtually!
              Select an instrument below to explore its sounds and history.
            </p>
          </div>

          {renderInstrumentSelection()}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f9f9f9, #f0f0f0)'
    }}>
      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" onClick={(e) => { e.preventDefault(); resetToHome(); }} className="text-decoration-none">
                Home
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{instrument.title}</li>
          </ol>
        </nav>

        <div className="row mb-4 align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center mb-3">
              <div
                className="me-4 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  background: instrument.color,
                  borderRadius: '50%',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>{instrument.icon}</span>
              </div>
              <div>
                <h1 className="display-5 fw-bold mb-0">{instrument.title}</h1>
                <p className="lead text-muted mb-0">Interactive Learning Experience</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={resetToHome}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Instruments
            </button>
          </div>
        </div>

        {/* Interactive instrument section */}
        <div className="row mb-5">
          <div className="col-12">
            {renderInteractiveInstrument()}
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="mb-4">
              <h3 className="fw-bold mb-4">Learn About the {instrument.title}</h3>

              <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                <div className="card-header bg-primary text-white p-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-book me-2"></i>
                    History & Background
                  </h5>
                </div>
                <div className="card-body p-4">
                  <p className="mb-0 lead">{instrument.content?.history || "Information coming soon!"}</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                <div className="card-header bg-success text-white p-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-info-circle me-2"></i>
                    Basic Information
                  </h5>
                </div>
                <div className="card-body p-4">
                  <p className="mb-0 lead">{instrument.content?.basics || "Information coming soon!"}</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                <div className="card-header bg-warning text-dark p-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-tools me-2"></i>
                    Playing Technique
                  </h5>
                </div>
                <div className="card-body p-4">
                  <p className="mb-0 lead">{instrument.content?.technique || "Information coming soon!"}</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="card-header bg-info text-dark p-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-star me-2"></i>
                    Famous Artists
                  </h5>
                </div>
                <div className="card-body p-4">
                  <p className="mb-0 lead">{instrument.content?.famous || "Information coming soon!"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px', borderRadius: '12px', overflow: 'hidden' }}>
              <div
                className="card-header text-white text-center p-5"
                style={{ background: instrument.color }}
              >
                <div
                  className="mb-4 mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '50%'
                  }}
                >
                  <span style={{ fontSize: '4rem' }}>{instrument.icon}</span>
                </div>
                <h3 className="fw-bold mb-0">Test Your Knowledge</h3>
              </div>
              <div className="card-body p-4">
                <p className="lead mb-4">
                  Take our 5-question quiz to see how much you've learned about the {instrument.title.toLowerCase()}!
                </p>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg py-3 fw-bold"
                    onClick={handleStartQuiz}
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualInstruments;