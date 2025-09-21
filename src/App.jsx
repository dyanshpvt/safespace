import React, { useEffect, useRef, useState } from 'react';
import logo from './assets/logo with name.png'
import bg from './assets/bg.png'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom';
import ocean from './assets/oceans.mp3'
import rain from './assets/rain.mp3'
import forest from './assets/forest.mp3'
import fire from './assets/fire.mp3'

const ReformedHeroSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate()   
  const [playingSound, setPlayingSound] = useState(null);
  const audioContextRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef(null);
  const audioTimeoutRef = useRef(null);
  const oscillatorsRef = useRef({});

  const playSound = (id) => {
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }

    // agar wahi sound chal raha hai toh pause kar do
    if (playingSound === id) {
      if (audio) {
        audio.pause();
      }
      setPlayingSound(null);
      setTimeRemaining(0);
      return;
    }

    // agar koi aur chal raha tha toh usse stop karo
    if (audio) {
      audio.pause();
    }

    // naya sound select karo
    const selectedSound = sounds.find((s) => s.id === id);
    const newAudio = new Audio(selectedSound.audio);
    
    // Enable looping for continuous playback
    newAudio.loop = true;
    newAudio.volume = 0.6;
    
    newAudio.play().then(() => {
      setAudio(newAudio);
      setPlayingSound(id);
      
      // Set 10-minute timer (600 seconds)
      setTimeRemaining(600);
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - stop the audio
            newAudio.pause();
            setPlayingSound(null);
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Backup timeout to ensure audio stops after 10 minutes
      audioTimeoutRef.current = setTimeout(() => {
        newAudio.pause();
        setPlayingSound(null);
        setTimeRemaining(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }, 600000); // 10 minutes in milliseconds
      
    }).catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  useEffect(() => {
    // Initialize Audio Context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      // Cleanup
      Object.values(oscillatorsRef.current).forEach(osc => {
        if (osc && osc.source) osc.source.stop();
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Clear timers on cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, []);

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Sound generation functions
  const generateRainSound = () => {
    const audioContext = audioContextRef.current;
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise for rain
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.3;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { source, gainNode };
  };

  const generateOceanSound = () => {
    const audioContext = audioContextRef.current;
    const bufferSize = audioContext.sampleRate * 4;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate ocean wave pattern
    for (let i = 0; i < bufferSize; i++) {
      const wave1 = Math.sin(2 * Math.PI * 0.1 * i / audioContext.sampleRate) * 0.3;
      const wave2 = Math.sin(2 * Math.PI * 0.05 * i / audioContext.sampleRate) * 0.2;
      const noise = (Math.random() - 0.5) * 0.1;
      data[i] = wave1 + wave2 + noise;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioContext.currentTime);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { source, gainNode };
  };

  const generateBirdSound = () => {
    const audioContext = audioContextRef.current;
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.connect(audioContext.destination);
    
    // Create periodic bird chirps
    const playChirp = () => {
      const osc = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
      
      envelope.gain.setValueAtTime(0, audioContext.currentTime);
      envelope.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      osc.connect(envelope);
      envelope.connect(gainNode);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.3);
      
      // Random next chirp
      if (playingSound === 'birds') {
        setTimeout(playChirp, Math.random() * 3000 + 1000);
      }
    };
    
    playChirp();
    return { gainNode };
  };

  const generateForestSound = () => {
    const audioContext = audioContextRef.current;
    const bufferSize = audioContext.sampleRate * 3;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate gentle wind through leaves
    for (let i = 0; i < bufferSize; i++) {
      const wind = Math.sin(2 * Math.PI * 0.02 * i / audioContext.sampleRate) * 0.1;
      const rustling = (Math.random() - 0.5) * 0.05;
      data[i] = wind + rustling;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioContext.currentTime);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { source, gainNode };
  };

  const soundGenerators = {
    rain: generateRainSound,
    ocean: generateOceanSound,
    birds: generateBirdSound,
    forest: generateForestSound
  };

  const playSounds = async (soundType) => {
    try {
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Stop current playing sound
      if (playingSound && oscillatorsRef.current[playingSound]) {
        const current = oscillatorsRef.current[playingSound];
        if (current.source) current.source.stop();
        if (current.gainNode) current.gainNode.disconnect();
      }

      if (playingSound === soundType) {
        setPlayingSound(null);
        return;
      }

      // Start new sound
      const soundGenerator = soundGenerators[soundType];
      if (soundGenerator) {
        const audioNodes = soundGenerator();
        oscillatorsRef.current[soundType] = audioNodes;
        if (audioNodes.source) audioNodes.source.start();
        setPlayingSound(soundType);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

   const sounds = [
    {
      id: 1,
      name: "Rain",
      description: "Gentle raindrops falling",
      icon: "🌧️",
      color: "from-blue-400 to-blue-600",
      audio: rain, 
    },
    {
      id: 2,
      name: "Forest",
      description: "Birds and leaves",
      icon: "🌲",
      color: "from-green-400 to-green-600",
      audio: forest,
    },
    {
      id: 3,
      name: "Ocean",
      description: "Waves crashing on the shore",
      icon: "🌊",
      color: "from-cyan-400 to-blue-500",
      audio: ocean,
    },
    {
      id: 4,
      name: "Fireplace",
      description: "Crackling cozy fire",
      icon: "🔥",
      color: "from-orange-400 to-red-500",
      audio: fire,
    },
  ];

  useEffect(() => {
    if (!showSplash) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      const t2 = setTimeout(() => setShowSplash(false), 700);
      return () => clearTimeout(t2);
    }
  }, [countdown, showSplash]);

  // After splash, try to autoplay ambient rain and resume audio context; add fallbacks on user gesture
  useEffect(() => {
    if (showSplash) return;

    const tryStartAudio = async () => {
      try {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch {}

      try {
        if (audioRef.current) {
          // Ensure not muted for autoplay attempt
          audioRef.current.muted = isMuted;
          audioRef.current.volume = 0.35;
          await audioRef.current.play();
        }
      } catch {}
    };

    // Immediate attempt
    tryStartAudio();

    // Listener to guarantee start on first interaction
    const onInteract = () => {
      tryStartAudio();
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('touchstart', onInteract, { once: true });

    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
  }, [showSplash, isMuted]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  return (
    <div id="home" className="relative w-full min-h-screen overflow-hidden scroll-smooth">
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4532] text-white">
          <div className="text-center">
            <div className="text-6xl font-bold mb-6">{countdown > 0 ? `Breathe ${countdown}..` : ''}</div>
            <div className="text-sm opacity-80">Welcome to SafeSpace</div>
          </div>
        </div>
      )}
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        {/* Replace this div with your actual background image */}
        <img src={bg} alt="bg-image" className='w-full h-full object-cover blur-[3px]' />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-4 md:px-8 py-6">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo} // yahan apna logo path dalo
            alt="SafeSpace Logo" 
            className="w-20 h-20 md:w-16 md:h-16 object-contain"
          />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex space-x-6 xl:space-x-8">
            <a href="#home" className="text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium transition-all duration-200 px-3 py-2 rounded-lg">
              Home
            </a>
            <a href="#about" className="text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium transition-all duration-200 px-3 py-2 rounded-lg">
              About Us
            </a>
            <a href="#services" className="text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium transition-all duration-200 px-3 py-2 rounded-lg">
              AI Psychologist 
            </a>
            <a href="#contact" className="text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium transition-all duration-200 px-3 py-2 rounded-lg">
              Human Assistance
            </a>
          </div>
          <Link to='/dashboard' className="bg-[#406246] hover:bg-[#2d4532] text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            SIGN UP/LOGIN
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-[#406246] p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
          <div className="p-6 space-y-4">
            <a href="#home" className="block text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium py-2 rounded-lg px-3 transition-colors duration-200">
              Home
            </a>
            <a href="#about" className="block text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium py-2 rounded-lg px-3 transition-colors duration-200">
              About Us
            </a>
            <a href="#services" className="block text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium py-2 rounded-lg px-3 transition-colors duration-200">
              ChatBot
            </a>
            <a href="#contact" className="block text-[#406246] hover:bg-[#406246] hover:text-[#f5f0de] text-lg font-medium py-2 rounded-lg px-3 transition-colors duration-200">
              Human Assistance
            </a>
            <button className="w-full bg-[#406246] hover:bg-[#2d4532] text-white px-6 py-3 rounded-2xl font-bold mt-4 transition-all duration-300">
              SIGN UP/LOGIN
            </button>
          </div>
        </div>
      )}
      
      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-[90vh] px-4 md:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#527a59] leading-tight mb-8">
            <span className="block mb-2 transform hover:scale-105 transition-transform duration-300 mt-[-150px]">
              Turn Stress
            </span>
            <span className="block font-serif italic transform hover:scale-105 transition-transform duration-300">
              into Serenity
            </span>
          </h1>
          

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link  to="/dashboard" className="bg-[#406246] hover:bg-[#2d4532] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1" onClick={() => navigate("/dashboard")}>
              Start Your Journey
            </Link >
            <a href="#about" className="border-2 border-[#406246] text-white hover:bg-[#406246] hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300">
              Explore Features
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#406246]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>


      {/* About Section */}
      <section id="about" className="relative z-10 bg-[#e9f3ec]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d4532] mb-4">About SafeSpace</h2>
          <p className="text-[#2d4532]/90 leading-relaxed">
            SafeSpace is your calm corner on the internet. Start with a short set of
            assessments, chat with our AI psychologist, and receive guidance tailored to
            your current state. If you need human care, we help you book an appointment
            seamlessly.
          </p>
        </div>
      </section>

      {/* Services / ChatBot Section */}
      <section id="services" className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-white/40">
            <h3 className="text-xl font-semibold text-[#2d4532] mb-2">Assessments</h3>
            <p className="text-[#2d4532]/80">Brief, evidence-aligned check-ins to understand how you're feeling today.</p>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-white/40">
            <h3 className="text-xl font-semibold text-[#2d4532] mb-2">AI Psychologist</h3>
            <p className="text-[#2d4532]/80">Conversational support that adapts to your responses with care and clarity.</p>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-white/40">
            <h3 className="text-xl font-semibold text-[#2d4532] mb-2">Personalized Path</h3>
            <p className="text-[#2d4532]/80">Get exercises to practice, or book an appointment when you need human help.</p>
          </div>
        </div>
      </section>

      {/* Human Assistance CTA */}
 <section className="py-12 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#25433c] mb-6">
            🎵 Soothing Sounds
          </h2>
          <p className="text-xl text-[#406246]/80 max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in nature's calming symphony. Click on any sound to
            create your perfect peaceful atmosphere.
          </p>
        </div>

        {/* Sound Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sounds.map((sound) => (
            <div
              key={sound.id}
              className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                playingSound === sound.id ? "scale-105" : ""
              }`}
              onClick={() => playSound(sound.id)}
            >
              <div
                className={`bg-white/15 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 hover:bg-white/20 ${
                  playingSound === sound.id
                    ? "border-white/50 animate-pulse shadow-2xl bg-white/25"
                    : "border-white/20 hover:border-white/30"
                }`}
              >
                {/* Sound Icon */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {sound.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
                    {sound.name}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-sm">{sound.description}</p>
                </div>

                {/* Play/Pause Indicator */}
                <div className="flex justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      playingSound === sound.id
                        ? "bg-white text-gray-700"
                        : "bg-white/20 text-white group-hover:bg-white/30"
                    }`}
                  >
                    {playingSound === sound.id ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Sound Waves Animation */}
                {playingSound === sound.id && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-end space-x-1">
                      <div className="w-1 bg-white rounded-full animate-pulse h-4"></div>
                      <div
                        className="w-1 bg-white rounded-full animate-pulse h-6"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 bg-white rounded-full animate-pulse h-3"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 bg-white rounded-full animate-pulse h-5"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/30">
            <h3 className="text-2xl font-bold text-[#25433c] mb-4">
              🧘‍♀️ Perfect for Relaxation
            </h3>
            <p className="text-[#406246] leading-relaxed">
              These nature sounds are scientifically proven to reduce stress,
              improve focus, and promote better sleep. Each sound will play continuously
              for 10 minutes to help you relax and unwind. Create your own peaceful
              sanctuary wherever you are.
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default ReformedHeroSection;