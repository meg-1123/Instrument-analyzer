import React, { useState, useRef } from 'react';

const AnalyzeMusic = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Mock analysis results for demonstration
  const mockAnalysisResults = {
    title: "Sample Music Track",
    duration: "3:24",
    bpm: 128,
    key: "C Major",
    genre: "Electronic",
    mood: "Energetic",
    instruments: [
      { name: "Electric Guitar", confidence: 95, color: "#FF6B6B" },
      { name: "Bass Guitar", confidence: 88, color: "#4ECDC4" },
      { name: "Drums", confidence: 92, color: "#45B7D1" },
      { name: "Synthesizer", confidence: 78, color: "#96CEB4" },
      { name: "Vocals", confidence: 65, color: "#FFEAA7" }
    ],
    waveform: Array.from({ length: 100 }, () => Math.random() * 60 + 10),
    analysis: {
      tempo: "Fast",
      energy: 8.5,
      danceability: 7.8,
      valence: 6.9,
      acousticness: 2.1
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Check file type and size
    const supportedTypes = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mpeg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!supportedTypes.some(type => file.type.includes(type.split('/')[1]))) {
      alert('Please select a supported audio file (MP3, WAV, FLAC, AAC)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const startAnalysis = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResults(mockAnalysisResults);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (analysisComplete && analysisResults) {
    return (
      <div className="container-fluid" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold">Analysis Results</h1>
            <button className="btn btn-outline-primary" onClick={resetAnalysis}>
              Analyze Another Track
            </button>
          </div>

          <div className="row g-4">
            {/* Main Results */}
            <div className="col-lg-8">
              {/* Track Info */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h3 className="fw-bold mb-2">{analysisResults.title}</h3>
                      <div className="row g-3">
                        <div className="col-6 col-md-3">
                          <small className="text-muted">Duration</small>
                          <div className="fw-bold">{analysisResults.duration}</div>
                        </div>
                        <div className="col-6 col-md-3">
                          <small className="text-muted">BPM</small>
                          <div className="fw-bold">{analysisResults.bpm}</div>
                        </div>
                        <div className="col-6 col-md-3">
                          <small className="text-muted">Key</small>
                          <div className="fw-bold">{analysisResults.key}</div>
                        </div>
                        <div className="col-6 col-md-3">
                          <small className="text-muted">Genre</small>
                          <div className="fw-bold">{analysisResults.genre}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                           style={{ width: '80px', height: '80px' }}>
                        <span style={{ fontSize: '2rem', color: 'white' }}>🎵</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruments Detected */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0 fw-bold">Detected Instruments</h5>
                </div>
                <div className="card-body">
                  {analysisResults.instruments.map((instrument, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold">{instrument.name}</span>
                        <span className="text-muted">{instrument.confidence}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${instrument.confidence}%`,
                            backgroundColor: instrument.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waveform Visualization */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0 fw-bold">Audio Waveform</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-end justify-content-between" style={{ height: '100px' }}>
                    {analysisResults.waveform.map((height, index) => (
                      <div
                        key={index}
                        className="bg-primary"
                        style={{
                          width: '2px',
                          height: `${height}%`,
                          margin: '0 1px',
                          borderRadius: '1px'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Audio Analysis Metrics */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0 fw-bold">Audio Analysis</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Energy</small>
                      <small>{analysisResults.analysis.energy}/10</small>
                    </div>
                    <div className="progress mb-2" style={{ height: '6px' }}>
                      <div className="progress-bar bg-danger" style={{ width: `${analysisResults.analysis.energy * 10}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Danceability</small>
                      <small>{analysisResults.analysis.danceability}/10</small>
                    </div>
                    <div className="progress mb-2" style={{ height: '6px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${analysisResults.analysis.danceability * 10}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Valence (Positivity)</small>
                      <small>{analysisResults.analysis.valence}/10</small>
                    </div>
                    <div className="progress mb-2" style={{ height: '6px' }}>
                      <div className="progress-bar bg-warning" style={{ width: `${analysisResults.analysis.valence * 10}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-0">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Acousticness</small>
                      <small>{analysisResults.analysis.acousticness}/10</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className="progress-bar bg-info" style={{ width: `${analysisResults.analysis.acousticness * 10}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Note */}
              <div className="card shadow-sm border-0">
                <div className="card-body text-center">
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📊</span>
                  <p className="text-muted mb-0">
                    All Analyzes are saved to your profile. Access your history anytime!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Main Content */}
      <div className="container py-2">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Music Analysis</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Upload your music and our AI will analyze the instruments, genre, BPM, and more. 
            Discover what makes your favorite songs unique.
          </p>
        </div>

        <div className="row g-5">
          {/* Upload Section */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-4">Upload Your Music</h4>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded p-5 text-center mb-4 ${
                    dragOver ? 'border-primary bg-light' : 'border-secondary'
                  }`}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }}>
                    📁
                  </div>
                  <p className="mb-3 text-muted">
                    Drag and drop your audio file here, or click to browse
                  </p>
                  <button className="btn btn-outline-primary">
                    Select File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <p className="text-muted text-center mb-4">
                  <small>Supported formats: MP3, WAV, FLAC, AAC (max 10MB)</small>
                </p>

                {/* Selected File Display */}
                {selectedFile && (
                  <div className="alert alert-success d-flex align-items-center justify-content-between">
                    <div>
                      <strong>Selected: </strong>
                      <span>{selectedFile.name}</span>
                      <small className="text-muted ms-2">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </small>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Analyze Button */}
                <div className="d-grid">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={startAnalysis}
                    disabled={!selectedFile || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Analyzing...
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </button>
                </div>

                {/* Info Note */}
                <div className="alert alert-info mt-4 d-flex">
                  <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>ℹ️</span>
                  <div>
                    <p className="mb-0">
                      Our analysis engine uses machine learning to detect instruments and extract 
                      metadata from your audio. For best results, use high-quality audio files 
                      without excessive background noise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-4 d-flex align-items-center">
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>❓</span>
                  How It Works
                </h4>

                <div className="d-flex mb-4">
                  <div 
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}
                  >
                    1
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Upload</h6>
                    <p className="text-muted mb-0">Upload any audio file in supported formats.</p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div 
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}
                  >
                    2
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Analysis</h6>
                    <p className="text-muted mb-0">Our ML model processes the audio to identify instruments and extract metadata.</p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div 
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}
                  >
                    3
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Results</h6>
                    <p className="text-muted mb-0">View detailed breakdown of instruments, genre, BPM, and more.</p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>💾</span>
                  <p className="text-muted mb-0">
                    All Analyzes are saved to your profile. Access your history anytime!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeMusic;