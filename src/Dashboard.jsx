import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import logo from './assets/logo with name.png'

// Theme and Language Context
const AppContext = createContext();

// Translations with Indian Languages
const translations = {
    english: {
        welcome: 'Welcome Back',
        goodMorning: 'Good Morning',
        goodAfternoon: 'Good Afternoon',
        goodEvening: 'Good Evening',
        overview: 'Overview',
        chatbot: 'AI Psychologist',
        games: 'Wellness Games',
        sessions: 'Book Session',
        progress: 'My Progress',
        resources: 'Resources',
        settings: 'Settings',
        startChat: 'Start Chat Session',
        playMindfulness: 'Play Mindfulness Game',
        bookAppointment: 'Book Appointment',
        viewProgress: 'View Progress',
        talkToCounselor: 'Talk to our AI counselor',
        relaxWithGames: 'Relax with guided activities',
        scheduleWithPro: 'Schedule with a professional',
        checkWellnessJourney: 'Check your wellness journey',
        wellnessTip: "Today's Wellness Tip",
        breathingExercise: 'Breathing Exercise',
        moodTracker: 'Mood Tracker',
        gratitudeJournal: 'Gratitude Journal',
        meditationTimer: 'Meditation Timer',
        natureSounds: 'Nature Sounds',
        stressReliefGame: 'Stress Relief Game',
        dailyAffirmations: 'Daily Affirmations'
    },
    hindi: {
        welcome: 'वापस स्वागत है',
        goodMorning: 'सुप्रभात',
        goodAfternoon: 'नमस्कार',
        goodEvening: 'शुभ संध्या',
        overview: 'अवलोकन',
        chatbot: 'AI मनोवैज्ञानिक',
        games: 'कल्याण खेल',
        sessions: 'सत्र बुक करें',
        progress: 'मेरी प्रगति',
        resources: 'संसाधन',
        settings: 'सेटिंग्स',
        startChat: 'चैट सत्र शुरू करें',
        playMindfulness: 'माइंडफुलनेस गेम खेलें',
        bookAppointment: 'अपॉइंटमेंट बुक करें',
        viewProgress: 'प्रगति देखें',
        talkToCounselor: 'हमारे AI काउंसलर से बात करें',
        relaxWithGames: 'निर्देशित गतिविधियों के साथ आराम करें',
        scheduleWithPro: 'एक पेशेवर के साथ शेड्यूल करें',
        checkWellnessJourney: 'अपनी कल्याण यात्रा की जांच करें',
        wellnessTip: 'आज का कल्याण सुझाव',
        breathingExercise: 'श्वास व्यायाम',
        moodTracker: 'मूड ट्रैकर',
        gratitudeJournal: 'कृतज्ञता जर्नल',
        meditationTimer: 'ध्यान टाइमर',
        natureSounds: 'प्रकृति की आवाज़ें',
        stressReliefGame: 'तनाव राहत खेल',
        dailyAffirmations: 'दैनिक पुष्टि'
    },
    tamil: {
        welcome: 'மீண்டும் வரவேற்கிறோம்',
        goodMorning: 'காலை வணக்கம்',
        goodAfternoon: 'மதிய வணக்கம்',
        goodEvening: 'மாலை வணக்கம்',
        overview: 'கண்ணோட்டம்',
        chatbot: 'AI உளவியலாளர்',
        games: 'நல்வாழ்வு விளையாட்டுகள்',
        sessions: 'அமர்வு பதிவு',
        progress: 'எனது முன்னேற்றம்',
        resources: 'வளங்கள்',
        settings: 'அமைப்புகள்',
        startChat: 'அரட்டை அமர்வு தொடங்க',
        playMindfulness: 'மனநிறைவு விளையாட்டு விளையாட',
        bookAppointment: 'நேரம் பதிவு',
        viewProgress: 'முன்னேற்றத்தை பார்',
        talkToCounselor: 'எங்கள் AI ஆலோசகரிடம் பேசுங்கள்',
        relaxWithGames: 'வழிகாட்டப்பட்ட செயல்பாடுகளுடன் ஓய்வெடுங்கள்',
        scheduleWithPro: 'ஒரு நிபுணருடன் திட்டமிடுங்கள்',
        checkWellnessJourney: 'உங்கள் நல்வாழ்வு பயணத்தை சரிபார்க்கவும்',
        wellnessTip: 'இன்றைய நல்வாழ்வு உதவிக்குறிப்பு',
        breathingExercise: 'சுவாச பயிற்சி',
        moodTracker: 'மனநிலை கண்காணிப்பு',
        gratitudeJournal: 'நன்றி பதிவு',
        meditationTimer: 'தியான கடிகாரம்',
        natureSounds: 'இயற்கை ஒலிகள்',
        stressReliefGame: 'மன அழுத்த நிவாரண விளையாட்டு',
        dailyAffirmations: 'தினசரி உறுதிப்பாடுகள்'
    },
    bengali: {
        welcome: 'আবার স্বাগতম',
        goodMorning: 'সুপ্রভাত',
        goodAfternoon: 'শুভ অপরাহ্ন',
        goodEvening: 'শুভ সন্ধ্যা',
        overview: 'সংক্ষিপ্ত বিবরণ',
        chatbot: 'AI মনোবিজ্ঞানী',
        games: 'কল্যাণ গেম',
        sessions: 'সেশন বুক করুন',
        progress: 'আমার অগ্রগতি',
        resources: 'সম্পদ',
        settings: 'সেটিংস',
        startChat: 'চ্যাট সেশন শুরু করুন',
        playMindfulness: 'মাইন্ডফুলনেস গেম খেলুন',
        bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
        viewProgress: 'অগ্রগতি দেখুন',
        talkToCounselor: 'আমাদের AI কাউন্সিলরের সাথে কথা বলুন',
        relaxWithGames: 'নির্দেশিত কার্যক্রমের সাথে বিশ্রাম নিন',
        scheduleWithPro: 'একজন পেশাদারের সাথে সময় নির্ধারণ করুন',
        checkWellnessJourney: 'আপনার কল্যাণ যাত্রা পরীক্ষা করুন',
        wellnessTip: 'আজকের কল্যাণ টিপ',
        breathingExercise: 'শ্বাস-প্রশ্বাসের ব্যায়াম',
        moodTracker: 'মুড ট্র্যাকার',
        gratitudeJournal: 'কৃতজ্ঞতা জার্নাল',
        meditationTimer: 'ধ্যান টাইমার',
        natureSounds: 'প্রকৃতির শব্দ',
        stressReliefGame: 'স্ট্রেস রিলিফ গেম',
        dailyAffirmations: 'দৈনিক নিশ্চিতকরণ'
    },
    telugu: {
        welcome: 'మళ్లీ స్వాగతం',
        goodMorning: 'శుభోదయం',
        goodAfternoon: 'శుభ మధ్యాహ్నం',
        goodEvening: 'శుభ సాయంత్రం',
        overview: 'అవలోకనం',
        chatbot: 'AI మనస్తత్వవేత్త',
        games: 'క్షేమ ఆటలు',
        sessions: 'సెషన్ బుక్ చేయండి',
        progress: 'నా పురోగతి',
        resources: 'వనరులు',
        settings: 'సెట్టింగులు',
        startChat: 'చాట్ సెషన్ ప్రారంభించండి',
        playMindfulness: 'మైండ్ఫుల్నెస్ గేమ్ ఆడండి',
        bookAppointment: 'అపాయింట్మెంట్ బుక్ చేయండి',
        viewProgress: 'పురోగతిని చూడండి',
        talkToCounselor: 'మా AI కౌన్సిలర్తో మాట్లాడండి',
        relaxWithGames: 'మార్గదర్శక కార్యకలాపాలతో విశ్రాంతి తీసుకోండి',
        scheduleWithPro: 'ఒక నిపుణుడితో షెడ్యూల్ చేయండి',
        checkWellnessJourney: 'మీ క్షేమ ప్రయాణాన్ని తనిఖీ చేయండి',
        wellnessTip: 'ఈరోజు క్షేమ చిట్కా',
        breathingExercise: 'శ్వాస వ్యాయామం',
        moodTracker: 'మూడ్ ట్రాకర్',
        gratitudeJournal: 'కృతజ్ఞత జర్నల్',
        meditationTimer: 'ధ్యాన టైమర్',
        natureSounds: 'ప్రకృతి శబ్దాలు',
        stressReliefGame: 'ఒత్తిడి నివారణ గేమ్',
        dailyAffirmations: 'రోజువారీ నిర్ధారణలు'
    }
};

// Theme configurations
const themes = {
    green: {
        primary: 'from-[#406246] to-[#2d4532]',
        secondary: 'from-green-600 to-emerald-600',
        accent: 'from-emerald-500/20 to-green-600/20',
        background: 'from-[#1a2b1f] via-[#2d4532] to-[#406246]',
        border: 'border-green-400/30',
        text: 'text-green-300',
        hover: 'hover:bg-green-800/30'
    },
    blue: {
        primary: 'from-[#1e3a8a] to-[#1e40af]',
        secondary: 'from-blue-600 to-cyan-600',
        accent: 'from-blue-500/20 to-cyan-600/20',
        background: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
        border: 'border-blue-400/30',
        text: 'text-blue-300',
        hover: 'hover:bg-blue-800/30'
    },
    purple: {
        primary: 'from-[#581c87] to-[#7c3aed]',
        secondary: 'from-purple-600 to-violet-600',
        accent: 'from-purple-500/20 to-violet-600/20',
        background: 'from-[#1a0b2e] via-[#2d1b4e] to-[#4c1d95]',
        border: 'border-purple-400/30',
        text: 'text-purple-300',
        hover: 'hover:bg-purple-800/30'
    }
};

// Custom hooks for better code organization
const useTime = () => {
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
    const timer = setInterval(() => {
    setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
}, []);

return currentTime;
};

const useGreeting = (time, language) => {
return useMemo(() => {
    const hour = time.getHours();
    const t = translations[language];
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
}, [time, language]);
};

// Configuration objects will be defined inside the component to use translations

// Meditation Timer Component
const MeditationTimer = ({ onBack }) => {
    const [duration, setDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const { theme } = useContext(AppContext);
    const currentTheme = themes[theme];

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
            setTimeLeft(time => {
            if (time <= 1) {
                setIsActive(false);
                setIsCompleted(true);
                return 0;
            }
            return time - 1;
            });
        }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startTimer = () => {
        setTimeLeft(duration * 60);
        setIsActive(true);
        setIsCompleted(false);
    };

    const stopTimer = () => {
        setIsActive(false);
        setTimeLeft(0);
        setIsCompleted(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} text-center`}>
        <button 
            onClick={onBack}
            className={`mb-4 ${currentTheme.text} hover:text-white transition-colors`}
        >
            ← Back to Games
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-8">🧘‍♀️ Meditation Timer</h3>
        
        {!isActive && !timeLeft && (
            <div className="mb-8">
            <label className="block text-white mb-4">Select Duration (minutes):</label>
            <div className="flex justify-center gap-4">
                {[3, 5, 10, 15, 20].map(min => (
                <button
                    key={min}
                    onClick={() => setDuration(min)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                    duration === min 
                        ? `bg-gradient-to-br ${currentTheme.secondary} text-white` 
                        : `bg-white/10 ${currentTheme.text} hover:bg-white/20`
                    }`}
                >
                    {min}m
                </button>
                ))}
            </div>
            </div>
        )}
        
        <div className={`w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br ${currentTheme.secondary} flex items-center justify-center text-white font-bold text-3xl transition-all duration-1000 ${
            isActive ? 'animate-pulse' : ''
        }`}>
            {timeLeft ? formatTime(timeLeft) : `${duration}:00`}
        </div>
        
        {isCompleted && (
            <div className="mb-6 p-4 bg-green-500/20 rounded-xl border border-green-400/30">
            <p className="text-green-300 text-lg">🎉 Meditation completed! Great job!</p>
            </div>
        )}
        
        <div className="space-y-4">
            {!isActive && !timeLeft && (
            <button
                onClick={startTimer}
                className={`px-8 py-3 bg-gradient-to-br ${currentTheme.secondary} hover:opacity-90 text-white rounded-xl font-medium transition-all`}
            >
                Start Meditation
            </button>
            )}
            
            {isActive && (
            <button
                onClick={() => setIsActive(false)}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all"
            >
                Pause
            </button>
            )}
            
            {timeLeft > 0 && !isActive && (
            <button
                onClick={() => setIsActive(true)}
                className={`px-8 py-3 bg-gradient-to-br ${currentTheme.secondary} hover:opacity-90 text-white rounded-xl font-medium transition-all mr-4`}
            >
                Resume
            </button>
            )}
            
            {timeLeft > 0 && (
            <button
                onClick={stopTimer}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
            >
                Stop
            </button>
            )}
        </div>
        </div>
    );
};

// Nature Sounds Component
const NatureSounds = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSound, setSelectedSound] = useState('');
    const [audio, setAudio] = useState(null);
    const { theme } = useContext(AppContext);
    const currentTheme = themes[theme];

    const sounds = [
        { id: 'rain', name: 'Rain', emoji: '🌧️', file: 'rain.mp3' },
        { id: 'forest', name: 'Forest', emoji: '🌲', file: 'forest.mp3' },
        { id: 'ocean', name: 'Ocean', emoji: '🌊', file: 'oceans.mp3' },
        { id: 'fire', name: 'Fireplace', emoji: '🔥', file: 'fire.mp3' }
    ];

    const playSound = (sound) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        
        if (selectedSound === sound.id && isPlaying) {
            setIsPlaying(false);
            return;
        }

        const newAudio = new Audio(`/src/assets/${sound.file}`);
        newAudio.loop = true;
        newAudio.volume = 0.5;
        newAudio.play();
        setAudio(newAudio);
        setSelectedSound(sound.id);
        setIsPlaying(true);
    };

    const stopSound = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        setIsPlaying(false);
        setSelectedSound('');
    };

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, [audio]);

    return (
        <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} text-center`}>
        <button 
            onClick={onBack}
            className={`mb-4 ${currentTheme.text} hover:text-white transition-colors`}
        >
            ← Back to Games
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-8">🌿 Nature Sounds</h3>
        <p className="text-white/80 mb-8">Choose a calming sound to relax and focus</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            {sounds.map((sound) => (
            <button
                key={sound.id}
                onClick={() => playSound(sound)}
                className={`p-6 rounded-2xl transition-all transform hover:scale-105 ${
                selectedSound === sound.id && isPlaying
                    ? `bg-gradient-to-br ${currentTheme.secondary} scale-105 shadow-lg`
                    : 'bg-white/10 hover:bg-white/20'
                }`}
            >
                <div className="text-4xl mb-2">{sound.emoji}</div>
                <div className="text-white font-medium">{sound.name}</div>
            </button>
            ))}
        </div>
        
        {isPlaying && (
            <div className="space-y-4">
            <div className="text-white/80">
                Now playing: {sounds.find(s => s.id === selectedSound)?.name}
            </div>
            <button
                onClick={stopSound}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
            >
                Stop Sound
            </button>
            </div>
        )}
        </div>
    );
};

// Stress Relief Game Component
const StressReliefGame = ({ onBack }) => {
    const [balloons, setBalloons] = useState([]);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const { theme } = useContext(AppContext);
    const currentTheme = themes[theme];

    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

    useEffect(() => {
        let interval;
        if (gameActive) {
        interval = setInterval(() => {
            setBalloons(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)],
                x: Math.random() * 80,
                y: 100
            }
            ].slice(-8)); // Keep max 8 balloons
        }, 1500);
        }
        return () => clearInterval(interval);
    }, [gameActive]);

    useEffect(() => {
        let moveInterval;
        if (gameActive) {
        moveInterval = setInterval(() => {
            setBalloons(prev => prev
            .map(balloon => ({ ...balloon, y: balloon.y - 2 }))
            .filter(balloon => balloon.y > -10)
            );
        }, 100);
        }
        return () => clearInterval(moveInterval);
    }, [gameActive]);

    const popBalloon = (id) => {
        setBalloons(prev => prev.filter(balloon => balloon.id !== id));
        setScore(prev => prev + 1);
    };

    const startGame = () => {
        setGameActive(true);
        setScore(0);
        setBalloons([]);
    };

    const stopGame = () => {
        setGameActive(false);
        setBalloons([]);
    };

    return (
        <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} text-center`}>
        <button 
            onClick={onBack}
            className={`mb-4 ${currentTheme.text} hover:text-white transition-colors`}
        >
            ← Back to Games
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-4">🎈 Pop the Balloons</h3>
        <p className="text-white/80 mb-6">Pop the rising balloons to relieve stress!</p>
        
        <div className="mb-4">
            <span className="text-white text-xl">Score: {score}</span>
        </div>
        
        <div className="relative bg-sky-200 rounded-2xl h-80 mb-6 overflow-hidden">
            {balloons.map(balloon => (
            <div
                key={balloon.id}
                className={`absolute w-12 h-16 ${balloon.color} rounded-full cursor-pointer transform hover:scale-110 transition-transform shadow-lg`}
                style={{ 
                left: `${balloon.x}%`, 
                bottom: `${balloon.y}%`,
                clipPath: 'ellipse(50% 60% at 50% 40%)'
                }}
                onClick={() => popBalloon(balloon.id)}
            >
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-600"></div>
            </div>
            ))}
            
            {!gameActive && balloons.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-600 text-lg">Click balloons to pop them!</div>
            </div>
            )}
        </div>
        
        <div className="space-y-4">
            {!gameActive ? (
            <button
                onClick={startGame}
                className={`px-8 py-3 bg-gradient-to-br ${currentTheme.secondary} hover:opacity-90 text-white rounded-xl font-medium transition-all`}
            >
                Start Game
            </button>
            ) : (
            <button
                onClick={stopGame}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
            >
                Stop Game
            </button>
            )}
        </div>
        </div>
    );
};

// Interactive Games Components
const BreathingExercise = ({ onBack }) => {
const [isActive, setIsActive] = useState(false);
const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
const [count, setCount] = useState(4);
const [cycle, setCycle] = useState(0);
const { theme } = useContext(AppContext);
const currentTheme = themes[theme];

useEffect(() => {
    let interval;
    if (isActive) {
    interval = setInterval(() => {
        setCount(prev => {
        if (prev <= 1) {
            if (phase === 'inhale') {
            setPhase('hold');
            return 4;
            } else if (phase === 'hold') {
            setPhase('exhale');
            return 4;
            } else {
            setPhase('inhale');
            setCycle(c => c + 1);
            return 4;
            }
        }
        return prev - 1;
        });
    }, 1000);
    }
    return () => clearInterval(interval);
}, [isActive, phase]);

const getInstruction = () => {
    switch(phase) {
    case 'inhale': return 'Breathe In...';
    case 'hold': return 'Hold...';
    case 'exhale': return 'Breathe Out...';
    default: return 'Ready to begin?';
    }
};

return (
    <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} text-center`}>
    <button 
        onClick={onBack}
        className={`mb-4 ${currentTheme.text} hover:text-white transition-colors`}
    >
        ← Back to Games
    </button>
    
    <h3 className="text-2xl font-bold text-white mb-8">Breathing Exercise</h3>
    
    <div className={`w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br ${currentTheme.secondary} flex items-center justify-center text-white font-bold text-2xl transition-transform duration-1000 ${
        isActive && phase === 'inhale' ? 'scale-125' : 
        isActive && phase === 'exhale' ? 'scale-75' : 'scale-100'
    }`}>
        {count}
    </div>
    
    <p className="text-xl text-white mb-6">{getInstruction()}</p>
    <p className={`${currentTheme.text} mb-8`}>Cycles completed: {cycle}</p>
    
    <div className="space-y-4">
        <button
        onClick={() => setIsActive(!isActive)}
        className={`px-8 py-3 rounded-xl font-medium transition-all ${
            isActive 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : `bg-gradient-to-r ${currentTheme.secondary} hover:opacity-90 text-white`
        }`}
        >
        {isActive ? 'Stop' : 'Start Breathing'}
        </button>
        
        {!isActive && (
        <button
            onClick={() => { setCount(4); setPhase('inhale'); setCycle(0); }}
            className={`ml-4 px-6 py-3 bg-white/20 hover:bg-white/30 ${currentTheme.text} rounded-xl transition-all`}
        >
            Reset
        </button>
        )}
    </div>
    </div>
);
};

const MoodTracker = ({ onBack }) => {
const [selectedMood, setSelectedMood] = useState('');
const [note, setNote] = useState('');
const [savedEntries, setSavedEntries] = useState([]);
const { theme } = useContext(AppContext);
const currentTheme = themes[theme];

const moods = [
    { emoji: '😊', label: 'Happy', color: 'from-green-400 to-green-500' },
    { emoji: '😌', label: 'Calm', color: 'from-emerald-400 to-emerald-500' },
    { emoji: '😔', label: 'Sad', color: 'from-blue-400 to-blue-500' },
    { emoji: '😰', label: 'Anxious', color: 'from-yellow-400 to-orange-500' },
    { emoji: '😴', label: 'Tired', color: 'from-purple-400 to-purple-500' },
    { emoji: '😤', label: 'Frustrated', color: 'from-red-400 to-red-500' }
];

const saveMood = () => {
    if (selectedMood) {
    const entry = {
        mood: selectedMood,
        note,
        timestamp: new Date().toLocaleString()
    };
    setSavedEntries(prev => [entry, ...prev].slice(0, 5));
    setSelectedMood('');
    setNote('');
    }
};

return (
    <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border}`}>
    <button 
        onClick={onBack}
        className={`mb-4 ${currentTheme.text} hover:text-white transition-colors`}
    >
        ← Back to Games
    </button>
    
    <h3 className="text-2xl font-bold text-white mb-8 text-center">How are you feeling?</h3>
    
    <div className="grid grid-cols-3 gap-4 mb-6">
        {moods.map((mood, index) => (
        <button
            key={index}
            onClick={() => setSelectedMood(mood.label)}
            className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
            selectedMood === mood.label 
                ? `bg-gradient-to-br ${mood.color} scale-105 shadow-lg` 
                : 'bg-white/10 hover:bg-white/20'
            }`}
        >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className="text-white text-sm">{mood.label}</div>
        </button>
        ))}
    </div>
    
    <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What's on your mind? (optional)"
        className={`w-full bg-white/10 ${currentTheme.border} rounded-2xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/40 mb-6`}
        rows={3}
    />
    
    <button
        onClick={saveMood}
        disabled={!selectedMood}
        className={`w-full bg-gradient-to-r ${currentTheme.secondary} hover:opacity-90 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-2xl font-medium transition-all disabled:cursor-not-allowed`}
    >
        Save Mood Entry
    </button>
    
    {savedEntries.length > 0 && (
        <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Recent Entries</h4>
        <div className="space-y-3">
            {savedEntries.map((entry, index) => (
            <div key={index} className={`bg-white/5 rounded-xl p-4 ${currentTheme.border}`}>
                <div className="flex justify-between items-start">
                <span className={`${currentTheme.text} font-medium`}>{entry.mood}</span>
                <span className="text-white/60 text-xs">{entry.timestamp}</span>
                </div>
                {entry.note && <p className="text-white/80 text-sm mt-2">{entry.note}</p>}
            </div>
            ))}
        </div>
        </div>
    )}
    </div>
);
};

const GratitudeJournal = ({ onBack }) => {
const [gratitudeText, setGratitudeText] = useState('');
const [entries, setEntries] = useState([]);
const { theme } = useContext(AppContext);
const currentTheme = themes[theme];

const addEntry = () => {
    if (gratitudeText.trim()) {
    const entry = {
        text: gratitudeText,
        date: new Date().toLocaleDateString()
    };
    setEntries(prev => [entry, ...prev].slice(0, 10));
    setGratitudeText('');
    }
};

return (
    <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border}`}>
    <button 
        onClick={onBack}
        className={`mb-4 ${currentTheme.text} hover:text-white transition-colors`}
    >
        ← Back to Games
    </button>
    
    <h3 className="text-2xl font-bold text-white mb-6 text-center">🌟 Gratitude Journal</h3>
    <p className="text-white/80 text-center mb-8">What are you grateful for today?</p>
    
    <div className="mb-6">
        <textarea
        value={gratitudeText}
        onChange={(e) => setGratitudeText(e.target.value)}
        placeholder="I'm grateful for..."
        className={`w-full bg-white/10 ${currentTheme.border} rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/40 mb-4`}
        rows={4}
        />
        <button
        onClick={addEntry}
        disabled={!gratitudeText.trim()}
        className={`w-full bg-gradient-to-r ${currentTheme.secondary} hover:opacity-90 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-2xl font-medium transition-all disabled:cursor-not-allowed`}
        >
        Add Gratitude Entry
        </button>
    </div>
    
    {entries.length > 0 && (
        <div>
        <h4 className="text-lg font-semibold text-white mb-4">Your Gratitude Collection</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto">
            {entries.map((entry, index) => (
            <div key={index} className={`bg-white/5 rounded-xl p-4 ${currentTheme.border}`}>
                <p className="text-white/90 mb-2">{entry.text}</p>
                <p className={`${currentTheme.text} text-xs`}>{entry.date}</p>
            </div>
            ))}
        </div>
        </div>
    )}
    </div>
);
};

// Component parts
const WelcomeSection = ({ user, greeting }) => {
    const { theme } = useContext(AppContext);
    const currentTheme = themes[theme];

    return (
    <div className={`bg-gradient-to-r ${currentTheme.primary}/80 backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} shadow-2xl`}>
        <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        Welcome Back, {user?.firstName || 'Friend'}! 🌿
        </h2>
        <p className="text-white/90 text-lg leading-relaxed">
        {greeting}! How are you feeling today? Your mental wellness journey continues here in your peaceful space.
        </p>
    </div>
    );
};

const QuickActionsGrid = ({ actions, onActionClick }) => {
    const { theme } = useContext(AppContext);
    const currentTheme = themes[theme];

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, index) => (
        <div
            key={index}
            className={`bg-gradient-to-br ${action.color} rounded-3xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group ${currentTheme.border}`}
            onClick={() => onActionClick(action.section)}
        >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {action.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
            <p className="text-white/90 leading-relaxed">{action.description}</p>
        </div>
        ))}
    </div>
    );
};

const WellnessTip = () => {
const { theme } = useContext(AppContext);
const currentTheme = themes[theme];

const tips = [
    "Take a moment to breathe deeply. Inhale peace, exhale stress. Remember, it's okay to take things one step at a time.",
    "Nature has a wonderful way of healing. Take a moment to appreciate the world around you.",
    "Progress, not perfection. Every small step towards wellness counts and deserves celebration.",
    "Your mental health is just as important as your physical health. Be gentle with yourself today.",
    "Like plants need water and sunlight, you need rest and self-care to flourish."
];

const [currentTip] = useState(tips[Math.floor(Math.random() * tips.length)]);

return (
    <div className={`bg-gradient-to-r ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} shadow-xl`}>
    <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">💡</span>
        <h3 className="text-xl font-bold text-white">Today's Wellness Tip</h3>
    </div>
    <p className="text-white/90 leading-relaxed italic">
        "{currentTip}"
    </p>
    </div>
);
};

const ChatInterface = () => {
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([
    { 
        id: 1, 
        text: "Hello! I'm your AI Psychology Companion. I'm here to listen and support you through whatever you're experiencing. How are you feeling today?", 
        type: 'bot', 
        timestamp: new Date().toISOString(),
        sentiment: { risk_level: 'low' }
    }
]);
const [isLoading, setIsLoading] = useState(false);
const [botStatus, setBotStatus] = useState({ risk_level: 'low', stage: 'companion' });
const [isVoiceMode, setIsVoiceMode] = useState(false);
const [isVoiceWidgetLoaded, setIsVoiceWidgetLoaded] = useState(false);

const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const currentMessage = message.trim();
    console.log('Sending message:', currentMessage);
    
    const userMessage = {
        id: Date.now(),
        text: currentMessage,
        type: 'user',
        timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: currentMessage })
        });

        if (!response.ok) {
            throw new Error('Failed to get response');
        }

        const data = await response.json();
        console.log('Received response:', data);
        
        const botMessage = {
            id: Date.now() + 1,
            text: data.response,
            type: 'bot',
            timestamp: data.timestamp || new Date().toISOString(),
            sentiment: data.sentiment || { risk_level: 'low' },
            stage: data.stage || 'companion'
        };

        setMessages(prev => [...prev, botMessage]);
        setBotStatus({ 
            risk_level: data.risk_level || 'low', 
            stage: data.stage || 'companion',
            message_count: data.message_count || 1
        });

    } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = {
            id: Date.now() + 1,
            text: "I'm having trouble connecting right now. Please make sure the chatbot server is running on localhost:5000. You can still type here and I'll respond when the connection is restored.",
            type: 'bot',
            timestamp: new Date().toISOString(),
            sentiment: { risk_level: 'low' }
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
};

const getRiskColor = (riskLevel) => {
    const colors = {
        'low': 'text-green-400',
        'moderate': 'text-yellow-400', 
        'high': 'text-orange-400',
        'severe': 'text-red-400'
    };
    return colors[riskLevel] || 'text-green-400';
};

const getRiskEmoji = (riskLevel) => {
    const emojis = {
        'low': '💚',
        'moderate': '💛',
        'high': '🧡', 
        'severe': '🔴'
    };
    return emojis[riskLevel] || '💚';
};

// Load ElevenLabs voice widget
useEffect(() => {
    const loadVoiceWidget = () => {
        if (!document.querySelector('script[src*="convai-widget-embed"]')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
            script.async = true;
            script.type = 'text/javascript';
            script.onload = () => {
                console.log('ElevenLabs script loaded successfully');
                setTimeout(() => {
                    setIsVoiceWidgetLoaded(true);
                    console.log('ElevenLabs widget ready');
                }, 1000);
            };
            script.onerror = (error) => {
                console.error('Failed to load ElevenLabs script:', error);
                setIsVoiceWidgetLoaded(false);
            };
            document.head.appendChild(script);
        } else {
            console.log('ElevenLabs script already loaded');
            setIsVoiceWidgetLoaded(true);
        }
    };
    
    if (isVoiceMode) {
        loadVoiceWidget();
    }
}, [isVoiceMode]);

const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
};

return (
    <div className="bg-gradient-to-br from-[#406246]/20 to-[#2d4532]/20 backdrop-blur-md rounded-3xl p-6 border border-green-400/30 h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <h2 className="text-2xl font-bold text-white">AI Psychology Companion</h2>
        </div>
        <div className="flex items-center gap-4">
            <button
                onClick={toggleVoiceMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isVoiceMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                title={isVoiceMode ? 'Switch to Text Chat' : 'Switch to Voice Chat'}
            >
                <span className="text-lg">
                    {isVoiceMode ? '💬' : '🎤'}
                </span>
                <span className="text-sm font-medium">
                    {isVoiceMode ? 'Text' : 'Voice'}
                </span>
            </button>
            <div className="flex items-center gap-2 text-sm">
                <span className="text-white/70">Status:</span>
                <span className={getRiskColor(botStatus.risk_level)}>
                    {getRiskEmoji(botStatus.risk_level)} {botStatus.stage}
                </span>
            </div>
        </div>
    </div>
    
    {/* Voice Mode - ElevenLabs Widget */}
    {isVoiceMode ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-green-900/20 rounded-2xl p-8 border border-green-500/20">
            <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎤</div>
                <h3 className="text-xl font-bold text-white mb-2">Voice Chat Mode</h3>
                <p className="text-green-200 mb-4">
                    {isVoiceWidgetLoaded 
                        ? "Click the microphone in the widget below to start talking" 
                        : "Loading your AI Psychology Companion voice interface..."
                    }
                </p>
                {!isVoiceWidgetLoaded && (
                    <div className="flex items-center justify-center gap-2 text-green-300">
                        <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting to voice service...</span>
                    </div>
                )}
            </div>
            
            {/* ElevenLabs ConvAI Widget */}
            <div className="voice-widget-container flex justify-center items-center" style={{ minHeight: '400px', width: '100%' }}>
                {isVoiceWidgetLoaded ? (
                    <div className="flex flex-col items-center justify-center w-full max-w-md">
                        <div className="flex justify-center items-center w-full">
                            <div 
                                dangerouslySetInnerHTML={{
                                    __html: '<elevenlabs-convai agent-id="agent_2601k4zg8j31fc0s31v13t52yf1n"></elevenlabs-convai>'
                                }}
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-green-200 text-sm mb-2">
                                🎤 Click the microphone button above to start talking
                            </p>
                            <p className="text-green-300/70 text-xs mb-2">
                                Make sure to allow microphone permissions when prompted
                            </p>
                            <button 
                                onClick={() => window.open('https://elevenlabs.io/convai/agent_2601k4zg8j31fc0s31v13t52yf1n', '_blank')}
                                className="text-green-400 hover:text-green-300 text-xs underline"
                            >
                                Test agent directly on ElevenLabs →
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-green-300">Loading voice interface...</p>
                            <p className="text-green-200/70 text-xs mt-2">
                                If this takes too long, try refreshing the page
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-green-200/80 text-sm mb-2">
                    🔒 Voice conversations are secure and private
                </p>
                <p className="text-green-200/60 text-xs">
                    Switch back to text mode anytime using the button above
                </p>
            </div>
        </div>
    ) : (
        /* Text Mode - Regular Chat Interface */
        <div className="bg-green-900/20 rounded-2xl p-4 flex-1 mb-4 overflow-y-auto space-y-3 border border-green-500/20">
            {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.type === 'user' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'bg-green-800/30 text-green-50 border border-green-500/30'
                }`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        {msg.type === 'bot' && msg.sentiment && (
                            <span className="text-xs">
                                {getRiskEmoji(msg.sentiment.risk_level)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-green-800/30 text-green-50 border border-green-500/30 px-4 py-2 rounded-2xl">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm">AI is thinking...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )}
    
    {/* Text Input - Only show in text mode */}
    {!isVoiceMode && (
        <>
        <div className="flex gap-3">
            <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-green-900/20 border border-green-400/30 rounded-2xl px-6 py-4 text-white placeholder-green-200/50 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-400/20 transition-all resize-none"
            rows="2"
            disabled={isLoading}
            />
            <button 
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-gradient-to-r from-[#406246] to-[#2d4532] hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
            {isLoading ? '...' : 'Send'}
            </button>
        </div>
        
        <div className="mt-4 text-xs text-green-200/60 text-center">
            <p>🔒 Your conversations are private and secure. In crisis situations, emergency resources will be provided.</p>
        </div>
        </>
    )}
    </div>
);
};

const WellnessGames = () => {
const [activeGame, setActiveGame] = useState(null);
const { theme, language } = useContext(AppContext);
const currentTheme = themes[theme];
const t = translations[language];

const games = [
    { 
    id: 'breathing', 
    title: t.breathingExercise, 
    description: 'Guided breathing for relaxation', 
    color: currentTheme.secondary, 
    icon: '🫁',
    component: BreathingExercise
    },
    { 
    id: 'mood', 
    title: t.moodTracker, 
    description: 'Log your daily emotions', 
    color: currentTheme.secondary, 
    icon: '😊',
    component: MoodTracker
    },
    { 
    id: 'gratitude', 
    title: t.gratitudeJournal, 
    description: 'Write what you\'re grateful for', 
    color: currentTheme.secondary, 
    icon: '📝',
    component: GratitudeJournal
    },
    { 
    id: 'meditation', 
    title: t.meditationTimer, 
    description: 'Timed mindfulness session', 
    color: currentTheme.secondary, 
    icon: '🧘‍♀️',
    component: MeditationTimer
    },
    { 
    id: 'nature', 
    title: t.natureSounds, 
    description: 'Calming background audio', 
    color: currentTheme.secondary, 
    icon: '🌿',
    component: NatureSounds
    },
    { 
    id: 'stress', 
    title: t.stressReliefGame, 
    description: 'Interactive stress relief activity', 
    color: currentTheme.secondary, 
    icon: '🎈',
    component: StressReliefGame
    }
];

if (activeGame) {
    const GameComponent = activeGame.component;
    return <GameComponent onBack={() => setActiveGame(null)} />;
}
return (
    <div className="space-y-8">
    <div className="flex items-center gap-3">
        <span className="text-3xl">🎮</span>
        <h2 className="text-3xl font-bold text-white">{t.games} & Activities</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
        <div 
            key={index} 
            className={`bg-gradient-to-br ${game.color} rounded-3xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl group ${currentTheme.border}`}
            onClick={() => game.component ? setActiveGame(game) : null}
        >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {game.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">{game.description}</p>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 font-medium">
            Play Now
            </button>
        </div>
        ))}
    </div>
    </div>
);
};

const BookingInterface = () => {
const [selectedProfessional, setSelectedProfessional] = useState('');
const [selectedDate, setSelectedDate] = useState('');
const [selectedTime, setSelectedTime] = useState('');
const [description, setDescription] = useState('');
const [sessionType, setSessionType] = useState('individual');

const professionals = [
    { name: 'Dr. Sarah Johnson', specialty: 'Anxiety & Depression', rating: '4.9', image: '👩‍⚕️', available: 'Today' },
    { name: 'Dr. Michael Chen', specialty: 'Stress Management', rating: '4.8', image: '👨‍⚕️', available: 'Tomorrow' },
    { name: 'Dr. Emily Davis', specialty: 'Relationship Counseling', rating: '4.9', image: '👩‍⚕️', available: 'This Week' }
];

const sessionTypes = [
    { id: 'individual', label: 'Individual Session', price: '$80', duration: '50 minutes' },
    { id: 'couple', label: 'Couples Session', price: '$120', duration: '60 minutes' },
    { id: 'group', label: 'Group Session', price: '$40', duration: '90 minutes' }
];

return (
    <div className="space-y-8">
    <div className="bg-gradient-to-r from-[#406246]/80 to-[#2d4532]/80 backdrop-blur-md rounded-3xl p-8 border border-green-400/30 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">📅</span>
        <h2 className="text-3xl font-bold text-white">Book a Session</h2>
        </div>
        
        {/* Session Type Selection */}
        <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Select Session Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionTypes.map((type) => (
            <div
                key={type.id}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                sessionType === type.id
                    ? 'border-green-400 bg-green-500/20'
                    : 'border-green-400/30 bg-green-900/20 hover:bg-green-800/30'
                }`}
                onClick={() => setSessionType(type.id)}
            >
                <h4 className="text-white font-semibold">{type.label}</h4>
                <p className="text-green-300">{type.price}</p>
                <p className="text-green-200 text-sm">{type.duration}</p>
            </div>
            ))}
        </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>👨‍⚕️</span>
            Available Professionals
            </h3>
            <div className="space-y-4">
            {professionals.map((doctor, index) => (
                <div 
                key={index} 
                className={`bg-green-900/20 rounded-2xl p-6 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    selectedProfessional === doctor.name 
                    ? 'border-green-400 bg-green-500/20 scale-105' 
                    : 'border-green-400/20 hover:border-green-400/40'
                }`}
                onClick={() => setSelectedProfessional(doctor.name)}
                >
                <div className="flex items-start gap-4">
                    <div className="text-3xl">{doctor.image}</div>
                    <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">{doctor.name}</h4>
                    <p className="text-green-300 mb-2">{doctor.specialty}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400 font-medium">{doctor.rating}/5.0</span>
                        </div>
                        <span className="text-green-400 text-sm bg-green-900/30 px-2 py-1 rounded">{doctor.available}</span>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        
        <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>📋</span>
            Schedule Appointment
            </h3>
            <div className="space-y-6">
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-green-900/20 border border-green-400/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-400/20 transition-all"
            />
            <select 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-green-900/20 border border-green-400/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-400/20 transition-all"
            >
                <option value="">Select Time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
            </select>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what you'd like to discuss..."
                className="w-full bg-green-900/20 border border-green-400/30 rounded-2xl px-6 py-4 text-white placeholder-green-200/50 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-400/20 h-32 resize-none transition-all"
            />
            <button 
                className="w-full bg-gradient-to-r from-[#406246] to-[#2d4532] hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedProfessional || !selectedDate || !selectedTime}
            >
                Book Appointment ({sessionTypes.find(t => t.id === sessionType)?.price})
            </button>
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

const ProgressDashboard = () => {
const [selectedPeriod, setSelectedPeriod] = useState('week');

const weeklyData = {
    activities: [
    { label: 'Chat Sessions', value: 5, icon: '💬', change: '+2' },
    { label: 'Meditation Minutes', value: 45, icon: '🧘', change: '+15' },
    { label: 'Wellness Games', value: 8, icon: '🎮', change: '+3' }
    ],
    mood: { trend: 'improving', percentage: 15, emoji: '😊' },
    streak: 7
};

const monthlyData = {
    activities: [
    { label: 'Chat Sessions', value: 18, icon: '💬', change: '+6' },
    { label: 'Meditation Minutes', value: 180, icon: '🧘', change: '+45' },
    { label: 'Wellness Games', value: 25, icon: '🎮', change: '+12' }
    ],
    mood: { trend: 'stable', percentage: 8, emoji: '😌' },
    streak: 21
};

const currentData = selectedPeriod === 'week' ? weeklyData : monthlyData;

return (
    <div className="space-y-8">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <span className="text-3xl">📊</span>
        <h2 className="text-3xl font-bold text-white">Your Wellness Progress</h2>
        </div>
        <div className="flex bg-green-900/30 rounded-2xl p-1 border border-green-400/30">
        <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-6 py-2 rounded-xl transition-all ${
            selectedPeriod === 'week' 
                ? 'bg-gradient-to-r from-[#406246] to-[#2d4532] text-white' 
                : 'text-green-300 hover:text-white'
            }`}
        >
            This Week
        </button>
        <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-6 py-2 rounded-xl transition-all ${
            selectedPeriod === 'month' 
                ? 'bg-gradient-to-r from-[#406246] to-[#2d4532] text-white' 
                : 'text-green-300 hover:text-white'
            }`}
        >
            This Month
        </button>
        </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Activities Card */}
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-3xl p-8 border border-green-400/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📈</span>
            <h3 className="text-xl font-semibold text-white">Activities</h3>
        </div>
        <div className="space-y-4">
            {currentData.activities.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-green-900/20 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-green-100 text-sm">{item.label}</span>
                </div>
                <div className="text-right">
                <span className="text-white font-bold text-xl">{item.value}</span>
                <span className="text-green-400 text-xs ml-2">{item.change}</span>
                </div>
            </div>
            ))}
        </div>
        </div>
        
        {/* Mood Trends */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-md rounded-3xl p-8 border border-emerald-400/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💚</span>
            <h3 className="text-xl font-semibold text-white">Mood Trends</h3>
        </div>
        <div className="text-center">
            <div className="text-6xl mb-4">{currentData.mood.emoji}</div>
            <p className="text-green-100 text-lg mb-2">Overall mood {currentData.mood.trend}!</p>
            <p className="text-green-400 font-semibold">+{currentData.mood.percentage}% from last {selectedPeriod}</p>
        </div>
        </div>
        
        {/* Streak Counter */}
        <div className="bg-gradient-to-br from-teal-600/20 to-green-600/20 backdrop-blur-md rounded-3xl p-8 border border-teal-400/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔥</span>
            <h3 className="text-xl font-semibold text-white">Wellness Streak</h3>
        </div>
        <div className="text-center">
            <div className="text-5xl font-bold text-orange-400 mb-2">{currentData.streak}</div>
            <p className="text-green-100">consecutive days</p>
            <p className="text-green-400 text-sm mt-2">Keep it up!</p>
        </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-gradient-to-br from-lime-600/20 to-emerald-600/20 backdrop-blur-md rounded-3xl p-8 border border-lime-400/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🏆</span>
            <h3 className="text-xl font-semibold text-white">Achievements</h3>
        </div>
        <div className="space-y-3">
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🥇</div>
            <p className="text-yellow-300 text-sm font-medium">{currentData.streak} Day Streak</p>
            </div>
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🌱</div>
            <p className="text-green-300 text-sm font-medium">Mindful Master</p>
            </div>
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">💙</div>
            <p className="text-blue-300 text-sm font-medium">Self-Care Hero</p>
            </div>
        </div>
        </div>
    </div>
    
    {/* Weekly Goal Progress */}
    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-3xl p-8 border border-green-400/30 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span>🎯</span>
        {selectedPeriod === 'week' ? 'Weekly' : 'Monthly'} Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { goal: 'Daily Check-ins', current: selectedPeriod === 'week' ? 5 : 18, target: selectedPeriod === 'week' ? 7 : 30 },
            { goal: 'Meditation Sessions', current: selectedPeriod === 'week' ? 3 : 12, target: selectedPeriod === 'week' ? 5 : 20 },
            { goal: 'Wellness Activities', current: selectedPeriod === 'week' ? 8 : 25, target: selectedPeriod === 'week' ? 10 : 35 }
        ].map((item, index) => {
            const percentage = (item.current / item.target) * 100;
            return (
            <div key={index} className="bg-green-900/20 rounded-2xl p-6 border border-green-500/20">
                <h4 className="text-white font-medium mb-4">{item.goal}</h4>
                <div className="flex justify-between text-sm text-green-300 mb-2">
                <span>{item.current}/{item.target}</span>
                <span>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full bg-green-900/30 rounded-full h-2">
                <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
                </div>
            </div>
            );
        })}
        </div>
    </div>
    </div>
);
};

const ResourcesSection = () => {
const [selectedCategory, setSelectedCategory] = useState('articles');

const categories = [
    { id: 'articles', label: 'Articles', icon: '📖' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'podcasts', label: 'Podcasts', icon: '🎧' },
    { id: 'books', label: 'Books', icon: '📚' }
];

const resources = {
    articles: [
    { title: '5 Breathing Techniques for Anxiety', author: 'Dr. Sarah Mitchell', time: '8 min read', category: 'Anxiety' },
    { title: 'Building Daily Mindfulness Habits', author: 'Mark Johnson', time: '12 min read', category: 'Mindfulness' },
    { title: 'The Science of Gratitude', author: 'Dr. Emily Chen', time: '15 min read', category: 'Positive Psychology' },
    { title: 'Managing Stress in Modern Life', author: 'Lisa Thompson', time: '10 min read', category: 'Stress Management' }
    ],
    videos: [
    { title: 'Guided Meditation for Beginners', creator: 'Mindful Space', duration: '15 min', views: '2.1M' },
    { title: 'Yoga for Mental Health', creator: 'Wellness Studio', duration: '25 min', views: '890K' },
    { title: 'Understanding Anxiety', creator: 'Mental Health Hub', duration: '18 min', views: '1.5M' },
    { title: 'Building Self-Compassion', creator: 'Dr. Amanda Lee', duration: '20 min', views: '756K' }
    ],
    podcasts: [
    { title: 'The Mental Health Toolkit', host: 'Dr. Michael Roberts', episodes: '45 episodes', rating: '4.8' },
    { title: 'Mindful Living', host: 'Sarah Green', episodes: '78 episodes', rating: '4.9' },
    { title: 'Anxiety Solutions', host: 'Dr. Jane Smith', episodes: '32 episodes', rating: '4.7' },
    { title: 'Wellness Wednesday', host: 'Team Wellness', episodes: '156 episodes', rating: '4.6' }
    ],
    books: [
    { title: 'The Anxiety and Worry Workbook', author: 'David A. Clark', rating: '4.5', genre: 'Self-Help' },
    { title: 'Mindfulness for Beginners', author: 'Jon Kabat-Zinn', rating: '4.7', genre: 'Mindfulness' },
    { title: 'The Happiness Project', author: 'Gretchen Rubin', rating: '4.4', genre: 'Personal Growth' },
    { title: 'Feeling Good', author: 'David D. Burns', rating: '4.6', genre: 'Psychology' }
    ]
};

return (
    <div className="space-y-8">
    <div className="flex items-center gap-3">
        <span className="text-3xl">📚</span>
        <h2 className="text-3xl font-bold text-white">Wellness Resources</h2>
    </div>
    
    {/* Category Selection */}
    <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
        <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
            selectedCategory === category.id
                ? 'bg-gradient-to-r from-[#406246] to-[#2d4532] text-white'
                : 'bg-green-900/20 text-green-300 hover:text-white hover:bg-green-800/30 border border-green-500/20'
            }`}
        >
            <span>{category.icon}</span>
            <span className="font-medium">{category.label}</span>
        </button>
        ))}
    </div>
    
    {/* Resources Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources[selectedCategory].map((resource, index) => (
        <div key={index} className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-3xl p-6 border border-green-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
            <div className="text-green-300 text-sm space-y-1">
            {selectedCategory === 'articles' && (
                <>
                <p>By {resource.author}</p>
                <div className="flex justify-between">
                    <span>{resource.time}</span>
                    <span className="bg-green-700/30 px-2 py-1 rounded text-xs">{resource.category}</span>
                </div>
                </>
            )}
            {selectedCategory === 'videos' && (
                <>
                <p>By {resource.creator}</p>
                <div className="flex justify-between">
                    <span>{resource.duration}</span>
                    <span>{resource.views} views</span>
                </div>
                </>
            )}
            {selectedCategory === 'podcasts' && (
                <>
                <p>Hosted by {resource.host}</p>
                <div className="flex justify-between">
                    <span>{resource.episodes}</span>
                    <span>⭐ {resource.rating}</span>
                </div>
                </>
            )}
            {selectedCategory === 'books' && (
                <>
                <p>By {resource.author}</p>
                <div className="flex justify-between">
                    <span className="bg-green-700/30 px-2 py-1 rounded text-xs">{resource.genre}</span>
                    <span>⭐ {resource.rating}</span>
                </div>
                </>
            )}
            </div>
            <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm transition-all">
            {selectedCategory === 'articles' ? 'Read Article' : 
            selectedCategory === 'videos' ? 'Watch Video' :
            selectedCategory === 'podcasts' ? 'Listen Now' : 'View Details'}
            </button>
        </div>
        ))}
    </div>
    </div>
);
};

const SettingsSection = () => {
const { theme, setTheme, language, setLanguage } = useContext(AppContext);
const [notifications, setNotifications] = useState({
    dailyReminder: true,
    sessionAlerts: true,
    progressUpdates: false,
    weeklyReport: true
});

const currentTheme = themes[theme];
const t = translations[language];

return (
    <div className="space-y-8">
    <div className="flex items-center gap-3">
        <span className="text-3xl">⚙️</span>
        <h2 className="text-3xl font-bold text-white">{t.settings}</h2>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} shadow-xl`}>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>🔔</span>
            Notifications
        </h3>
        <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className={`flex items-center justify-between p-4 bg-white/5 rounded-2xl ${currentTheme.border}`}>
                <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                className={`w-12 h-6 rounded-full transition-all ${
                    value ? `bg-gradient-to-r ${currentTheme.secondary}` : 'bg-gray-600'
                }`}
                >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
                </button>
            </div>
            ))}
        </div>
        </div>
        
        {/* Preferences */}
        <div className={`bg-gradient-to-br ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} shadow-xl`}>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>🎨</span>
            Preferences
        </h3>
        <div className="space-y-6">
            <div>
            <label className="block text-white mb-2">Theme</label>
            <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
            >
                <option value="green" className="bg-gray-800">Forest Green</option>
                <option value="blue" className="bg-gray-800">Ocean Blue</option>
                <option value="purple" className="bg-gray-800">Lavender Purple</option>
            </select>
            </div>
            
            <div>
            <label className="block text-white mb-2">Language</label>
            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
            >
                <option value="english" className="bg-gray-800">English</option>
                <option value="hindi" className="bg-gray-800">हिन्दी (Hindi)</option>
                <option value="tamil" className="bg-gray-800">தமிழ் (Tamil)</option>
                <option value="bengali" className="bg-gray-800">বাংলা (Bengali)</option>
                <option value="telugu" className="bg-gray-800">తెలుగు (Telugu)</option>
            </select>
            </div>
            
            <div>
            <label className="block text-white mb-2">Timezone</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/40">
                <option value="UTC-5" className="bg-gray-800">Eastern Time</option>
                <option value="UTC-6" className="bg-gray-800">Central Time</option>
                <option value="UTC-7" className="bg-gray-800">Mountain Time</option>
                <option value="UTC-8" className="bg-gray-800">Pacific Time</option>
            </select>
            </div>
        </div>
        </div>
    </div>
    
    {/* Account Settings */}
    <div className={`bg-gradient-to-r ${currentTheme.accent} backdrop-blur-md rounded-3xl p-8 ${currentTheme.border} shadow-xl`}>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span>👤</span>
        Account Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className={`bg-gradient-to-r ${currentTheme.secondary} hover:opacity-90 text-white py-3 px-6 rounded-2xl transition-all transform hover:scale-105`}>
            Update Profile
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-2xl transition-all transform hover:scale-105">
            Change Password
        </button>
        <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-2xl transition-all transform hover:scale-105">
            Export Data
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-2xl transition-all transform hover:scale-105">
            Delete Account
        </button>
        </div>
    </div>
    </div>
);
};

// Main Dashboard Component
const Dashboard = () => {
const [selectedSection, setSelectedSection] = useState('overview');
const [theme, setTheme] = useState('green');
const [language, setLanguage] = useState('english');
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const currentTime = useTime();
const greeting = useGreeting(currentTime, language);
const navigate = useNavigate();
const { user } = useUser();

const currentTheme = themes[theme];
const t = translations[language];

// Configuration objects with translations
const SIDEBAR_ITEMS = [
    { id: 'overview', label: t.overview, icon: '🏠' },
    { id: 'chatbot', label: t.chatbot, icon: '🤖' },
    { id: 'games', label: t.games, icon: '🎮' },
    { id: 'sessions', label: t.sessions, icon: '📅' },
    { id: 'progress', label: t.progress, icon: '📊' },
    { id: 'resources', label: t.resources, icon: '📚' },
    { id: 'settings', label: t.settings, icon: '⚙️' }
];

const QUICK_ACTIONS = [
    {
        title: t.startChat,
        description: t.talkToCounselor,
        icon: '💬',
        color: currentTheme.secondary,
        section: 'chatbot'
    },
    {
        title: t.playMindfulness,
        description: t.relaxWithGames,
        icon: '🧘',
        color: currentTheme.secondary,
        section: 'games'
    },
    {
        title: t.bookAppointment,
        description: t.scheduleWithPro,
        icon: '👨‍⚕️',
        color: currentTheme.secondary,
        section: 'sessions'
    },
    {
        title: t.viewProgress,
        description: t.checkWellnessJourney,
        icon: '📈',
        color: currentTheme.secondary,
        section: 'progress'
    }
];

const renderMainContent = () => {
    switch (selectedSection) {
    case 'overview':
        return (
        <div className="space-y-8">
            <WelcomeSection user={user} greeting={greeting} />
            <QuickActionsGrid 
            actions={QUICK_ACTIONS} 
            onActionClick={setSelectedSection} 
            />
            <WellnessTip />
        </div>
        );
    case 'chatbot':
        return <ChatInterface />;
    case 'games':
        return <WellnessGames />;
    case 'sessions':
        return <BookingInterface />;
    case 'progress':
        return <ProgressDashboard />;
    case 'resources':
        return <ResourcesSection />;
    case 'settings':
        return <SettingsSection />;
    default:
        return (
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-3xl p-12 border border-green-400/30 text-center shadow-2xl">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-green-100">This section is under development.</p>
        </div>
        );
    }
};

return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage }}>
    <div className={`w-full min-h-screen flex bg-gradient-to-br ${currentTheme.background} overflow-hidden`}>
        {/* Modern Sidebar - Desktop */}
        <div className="hidden md:flex w-72 bg-black/30 backdrop-blur-xl border-r border-white/20 flex-col shadow-2xl">
            {/* Logo/Header */}
            <div className="p-8 border-b border-white/20">
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                <img src={logo} alt="SafeSpace" className='w-10 h-10 object-contain' />
                </div>
                <div>
                <h1 className="text-2xl font-bold text-white">SafeSpace</h1>
                <p className="text-white/70 text-sm">Your Wellness Sanctuary</p>
                </div>
            </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
            <div className="space-y-3">
                {SIDEBAR_ITEMS.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setSelectedSection(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 group ${
                    selectedSection === item.id
                        ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg scale-105 border border-white/30`
                        : `text-white/70 ${currentTheme.hover} hover:text-white`
                    }`}
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                </button>
                ))}
            </div>
            </nav>

            {/* User Info */}
            <div className="p-6 border-t border-white/20">
            <div className={`flex items-center space-x-4 bg-white/5 rounded-2xl p-4 ${currentTheme.border}`}>
                <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-lg">
                    {(user?.firstName || 'U').charAt(0)}
                </span>
                </div>
                <div>
                <p className="text-white font-medium">{user?.firstName || 'User'}</p>
                <p className="text-white/60 text-sm">{currentTime.toLocaleDateString()}</p>
                </div>
            </div>
            </div>
        </div>

        {/* Mobile Sidebar Drawer */}
        {isSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="absolute inset-y-0 left-0 w-72 bg-black/80 backdrop-blur-xl border-r border-white/20 shadow-2xl p-6 overflow-y-auto">
                {/* Logo/Header */}
                <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                    <img src={logo} alt="SafeSpace" className='w-8 h-8 object-contain' />
                    </div>
                    <div>
                    <h1 className="text-xl font-bold text-white">SafeSpace</h1>
                    <p className="text-white/70 text-xs">Your Wellness Sanctuary</p>
                    </div>
                </div>
                </div>

                {/* Navigation */}
                <nav>
                <div className="space-y-3">
                    {SIDEBAR_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setSelectedSection(item.id); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                        selectedSection === item.id
                            ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg border border-white/30`
                            : `text-white/70 ${currentTheme.hover} hover:text-white`
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                    ))}
                </div>
                </nav>
            </div>
            </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Modern Header */}
            <header className="bg-black/20 backdrop-blur-xl border-b border-white/20 px-8 py-6 shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                    {SIDEBAR_ITEMS.find(item => item.id === selectedSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-white/70">
                    {greeting}, {user?.firstName || 'Friend'} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                </div>

                <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center rounded-xl p-3 text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <span className="sr-only">Open menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <UserButton 
                    appearance={{
                    elements: {
                        avatarBox: `w-12 h-12 rounded-full bg-gradient-to-r ${currentTheme.primary} border-2 border-white/30 shadow-lg`
                    }
                    }}
                />
                <button
                    onClick={() => navigate('/')}
                    className={`bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl transition-all duration-300 ${currentTheme.border} hover:border-white/50 transform hover:scale-105 font-medium shadow-lg`}
                >
                    Back to Home
                </button>
                </div>
            </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
            {renderMainContent()}
            </main>
        </div>
    </div>
    </AppContext.Provider>
);
};

export default Dashboard;
