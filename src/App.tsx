
import React, { useState, useRef, useEffect } from 'react';
import { AppState, TranslationResult, HistoryItem, TranslationDirection, ActiveTab, TargetLanguage } from './types';
import { Avatar } from './components/Avatar';
import { TranslationCard } from './components/TranslationCard';
import { blobToBase64, playBase64Audio } from './services/audioUtils';
import { translateAudio, speakText } from './services/geminiService';
import { Mic, Square, RotateCcw, ArrowRightLeft, BookOpen, Languages, Star, Trophy, Volume2, X, Book, Heart, Globe } from 'lucide-react';

// --- ESSENTIAL ENGLISH SENTENCES (50) ---
const ENGLISH_PHRASES = [
  { fr: "Bonjour, comment allez-vous ?", en: "Hello, how are you?" },
  { fr: "Excusez-moi, parlez-vous anglais ?", en: "Excuse me, do you speak English?" },
  { fr: "Je ne comprends pas.", en: "I do not understand." },
  { fr: "Pouvez-vous répéter plus lentement ?", en: "Can you repeat more slowly?" },
  { fr: "Où sont les toilettes ?", en: "Where is the bathroom?" },
  { fr: "Combien ça coûte ?", en: "How much does this cost?" },
  { fr: "Je voudrais payer, s'il vous plaît.", en: "I would like to pay, please." },
  { fr: "L'addition, s'il vous plaît.", en: "The check, please." },
  { fr: "Acceptez-vous la carte de crédit ?", en: "Do you accept credit cards?" },
  { fr: "Je cherche un hôtel.", en: "I am looking for a hotel." },
  { fr: "J'ai une réservation.", en: "I have a reservation." },
  { fr: "Avez-vous une table pour deux ?", en: "Do you have a table for two?" },
  { fr: "Je voudrais commander de l'eau.", en: "I would like to order water." },
  { fr: "C'était délicieux, merci.", en: "It was delicious, thank you." },
  { fr: "Où est la gare ?", en: "Where is the train station?" },
  { fr: "Où est l'arrêt de bus ?", en: "Where is the bus stop?" },
  { fr: "Où est la station de métro ?", en: "Where is the subway station?" },
  { fr: "Où est l'aéroport ?", en: "Where is the airport?" },
  { fr: "Je voudrais un billet pour Paris.", en: "I would like a ticket to Paris." },
  { fr: "À quelle heure part le train ?", en: "What time does the train leave?" },
  { fr: "Pouvez-vous m'aider ?", en: "Can you help me?" },
  { fr: "Je suis perdu.", en: "I am lost." },
  { fr: "Pouvez-vous me montrer sur la carte ?", en: "Can you show me on the map?" },
  { fr: "C'est loin d'ici ?", en: "Is it far from here?" },
  { fr: "Je cherche une pharmacie.", en: "I am looking for a pharmacy." },
  { fr: "J'ai besoin d'un médecin.", en: "I need a doctor." },
  { fr: "Appelez la police !", en: "Call the police!" },
  { fr: "J'ai perdu mon passeport.", en: "I lost my passport." },
  { fr: "Où est le guichet automatique ?", en: "Where is the ATM?" },
  { fr: "Quel est le mot de passe du Wifi ?", en: "What is the Wifi password?" },
  { fr: "Je voudrais louer une voiture.", en: "I would like to rent a car." },
  { fr: "C'est à gauche.", en: "It is on the left." },
  { fr: "C'est à droite.", en: "It is on the right." },
  { fr: "C'est tout droit.", en: "It is straight ahead." },
  { fr: "Arrêtez-vous ici, s'il vous plaît.", en: "Stop here, please." },
  { fr: "Quelle heure est-il ?", en: "What time is it?" },
  { fr: "Quel temps fait-il ?", en: "What is the weather like?" },
  { fr: "Je suis végétarien.", en: "I am vegetarian." },
  { fr: "Je suis allergique aux arachides.", en: "I am allergic to peanuts." },
  { fr: "Puis-je essayer ceci ?", en: "Can I try this on?" },
  { fr: "C'est trop cher.", en: "It is too expensive." },
  { fr: "Avez-vous une autre couleur ?", en: "Do you have another color?" },
  { fr: "C'est ma première fois ici.", en: "It is my first time here." },
  { fr: "Pouvez-vous prendre une photo ?", en: "Can you take a photo?" },
  { fr: "Je viens de France.", en: "I come from France." },
  { fr: "Enchanté de faire votre connaissance.", en: "Nice to meet you." },
  { fr: "À bientôt !", en: "See you soon!" },
  { fr: "Bonne journée !", en: "Have a nice day!" },
  { fr: "Merci beaucoup pour votre aide.", en: "Thank you very much for your help." },
  { fr: "Désolé pour mon anglais.", en: "Sorry for my English." }
];

// --- ESSENTIAL THAI SENTENCES (50) ---
const THAI_PHRASES = [
  { fr: "Bonjour", th: "Sawasdee khrap/kha", phonetic: "Sa-wat-dee" },
  { fr: "Merci", th: "Khob khun khrap/kha", phonetic: "Khop-khun" },
  { fr: "Oui / Non", th: "Chai / Mai chai", phonetic: "Chai / Mai-chai" },
  { fr: "Excusez-moi", th: "Khor thot khrap/kha", phonetic: "Kor-tot" },
  { fr: "Je ne comprends pas", th: "Mai khao jai", phonetic: "Mai kao-jai" },
  { fr: "Combien ça coûte ?", th: "Raka thao rai?", phonetic: "Ra-ka tao-rai?" },
  { fr: "Où sont les toilettes ?", th: "Hong nam yoo tee nai?", phonetic: "Hong-nam yoo tee-nai?" },
  { fr: "L'addition s'il vous plaît", th: "Khep tang duai", phonetic: "Kep-tang duay" },
  { fr: "C'est délicieux", th: "Aroi mak", phonetic: "A-roi mak" },
  { fr: "Pas épicé s'il vous plaît", th: "Mai phet", phonetic: "Mai pet" },
  { fr: "Je voudrais de l'eau", th: "Khor nam plao", phonetic: "Kor nam-plao" },
  { fr: "Aidez-moi", th: "Chuay duai", phonetic: "Chuay duay" },
  { fr: "Où est l'hôtel ?", th: "Rong raem yoo tee nai?", phonetic: "Rong-rem yoo tee-nai?" },
  { fr: "À droite", th: "Liao khwa", phonetic: "Liao kwa" },
  { fr: "À gauche", th: "Liao sai", phonetic: "Liao sai" },
  { fr: "Tout droit", th: "Trong pai", phonetic: "Trong pai" },
  { fr: "Stop ici", th: "Yoot tee nee", phonetic: "Yoot tee nee" },
  { fr: "Aéroport", th: "Sanam bin", phonetic: "Sa-nam bin" },
  { fr: "Gare", th: "Sathani rot fai", phonetic: "Sa-ta-ni rot-fai" },
  { fr: "Marché", th: "Talad", phonetic: "Ta-lad" },
  { fr: "Pharmacie", th: "Ran khai ya", phonetic: "Ran kai-ya" },
  { fr: "Hôpital", th: "Rong phayaban", phonetic: "Rong pa-ya-ban" },
  { fr: "Je suis perdu", th: "Chan long tang", phonetic: "Chan long tang" },
  { fr: "Pouvez-vous baisser le prix ?", th: "Lot noi dai mai?", phonetic: "Lot noy dai mai?" },
  { fr: "Je ne veux pas", th: "Mai ao", phonetic: "Mai ao" },
  { fr: "Je m'appelle...", th: "Chan chue...", phonetic: "Chan cheu..." },
  { fr: "Comment vous appelez-vous ?", th: "Khun chue arai?", phonetic: "Khun cheu a-rai?" },
  { fr: "Enchanté", th: "Yin dee tee dai roo jak", phonetic: "Yin-dee tee dai roo-jak" },
  { fr: "Au revoir", th: "La gon", phonetic: "La gon" },
  { fr: "Bonne nuit", th: "Fun dee", phonetic: "Fan dee" },
  { fr: "J'ai faim", th: "Hiu khao", phonetic: "Hiu kao" },
  { fr: "J'ai soif", th: "Hiu nam", phonetic: "Hiu nam" },
  { fr: "Chaud", th: "Ron", phonetic: "Ron" },
  { fr: "Froid", th: "Nao", phonetic: "Nao" },
  { fr: "Médecin", th: "Mor", phonetic: "Mor" },
  { fr: "Police", th: "Tam ruat", phonetic: "Tam-ruat" },
  { fr: "Danger", th: "Antarai", phonetic: "An-ta-rai" },
  { fr: "Interdit", th: "Ham", phonetic: "Ham" },
  { fr: "Ouvert", th: "Poet", phonetic: "Pert" },
  { fr: "Fermé", th: "Pit", phonetic: "Pit" },
  { fr: "Aujourd'hui", th: "Wan nee", phonetic: "Wan nee" },
  { fr: "Demain", th: "Phrung nee", phonetic: "Prung nee" },
  { fr: "Hier", th: "Muea wan", phonetic: "Meua wan" },
  { fr: "Un", th: "Nueng", phonetic: "Neung" },
  { fr: "Deux", th: "Song", phonetic: "Song" },
  { fr: "Trois", th: "Sam", phonetic: "Sam" },
  { fr: "Joli / Beau", th: "Suay / Lor", phonetic: "Suay / Lor" },
  { fr: "Amusant", th: "Sanuk", phonetic: "Sa-nook" },
  { fr: "Je t'aime", th: "Chan rak khun", phonetic: "Chan rak khun" },
  { fr: "Bonne chance", th: "Chok dee", phonetic: "Chok dee" }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('TRANSLATE');
  
  // Language & Direction State
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('EN');
  const [direction, setDirection] = useState<TranslationDirection>('FR_EN');
  
  const [showDictionary, setShowDictionary] = useState(false);
  
  // History & Favorites State
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'FAVORITES'>('ALL');
  
  const [currentTranslation, setCurrentTranslation] = useState<TranslationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Handle Target Language Switch (EN <-> TH)
  const switchTargetLanguage = (lang: TargetLanguage) => {
    if (state !== AppState.IDLE) return;
    setTargetLanguage(lang);
    // Reset direction to default source (French) for the new target
    setDirection(lang === 'EN' ? 'FR_EN' : 'FR_TH');
    setCurrentTranslation(null);
  };

  const toggleDirection = () => {
    if (state !== AppState.IDLE) return;
    if (targetLanguage === 'EN') {
        setDirection(prev => prev === 'FR_EN' ? 'EN_FR' : 'FR_EN');
    } else {
        setDirection(prev => prev === 'FR_TH' ? 'TH_FR' : 'FR_TH');
    }
    setCurrentTranslation(null);
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setState(AppState.RECORDING);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Veuillez autoriser l'accès au micro.");
      setState(AppState.IDLE);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordingStop = async () => {
    setState(AppState.PROCESSING);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    try {
      const base64Audio = await blobToBase64(audioBlob);
      
      // 1. Translate
      const result = await translateAudio(base64Audio, 'audio/webm', direction);
      
      // 2. Get TTS Audio (but don't play yet)
      const textToSpeak = (result.targetLanguage === 'Thai' && result.phonetic) ? result.phonetic : result.translatedText;
      const ttsAudio = await speakText(textToSpeak);

      // 3. UPDATE UI IMMEDIATELY
      const fullResult = { ...result, audioData: ttsAudio };
      setCurrentTranslation(fullResult);

      setHistory(prev => [{ 
        ...fullResult, 
        id: Date.now().toString(), 
        timestamp: Date.now(),
        isFavorite: false
      }, ...prev]);

      // 4. Play Audio
      setState(AppState.SPEAKING);
      await playBase64Audio(ttsAudio);
      
      setState(AppState.IDLE);
    } catch (err: any) {
      console.error("Processing error:", err);
      // Show actual error message to user
      setError(err.message || "Une erreur s'est produite. Réessayez.");
      setState(AppState.ERROR);
      // Keep error visible longer so you can read it
      setTimeout(() => setState(AppState.IDLE), 5000);
    }
  };

  const handleMicClick = () => {
    if (state === AppState.IDLE || state === AppState.ERROR) {
      startRecording();
    } else if (state === AppState.RECORDING) {
      stopRecording();
    }
  };

  const handlePlayAudio = async (base64Audio?: string) => {
    if (!base64Audio || (state !== AppState.IDLE && state !== AppState.SPEAKING)) return;
    try {
      setState(AppState.SPEAKING);
      await playBase64Audio(base64Audio);
      setState(AppState.IDLE);
    } catch (e) {
      console.error("Playback error", e);
      setState(AppState.IDLE);
    }
  };

  // Function to restore a history item to the main card view
  const handleRestoreHistory = (item: HistoryItem) => {
    if(state !== AppState.IDLE) return;
    setCurrentTranslation(item);
    // Optional: Scroll to top to see the card
    const mainContainer = document.querySelector('.overflow-y-auto');
    if(mainContainer) mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredHistory = historyFilter === 'ALL' 
    ? history 
    : history.filter(h => h.isFavorite);

  const currentDictionary = targetLanguage === 'EN' ? ENGLISH_PHRASES : THAI_PHRASES;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-hidden sm:rounded-[2.5rem] sm:h-[90vh] sm:border-[8px] sm:border-slate-900">
      
      {/* --- TOP HEADER WITH TABS --- */}
      <header className="flex-none bg-white border-b border-slate-100 pb-2 pt-6 px-6 z-20">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">M</div>
              <h1 className="text-lg font-bold text-slate-800">Marcelo's Trip</h1>
           </div>
           
           {/* LANGUAGE MODE SWITCHER */}
           <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
              <button 
                onClick={() => switchTargetLanguage('EN')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${targetLanguage === 'EN' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:bg-slate-200'}`}
              >
                 <span className="text-base">🇬🇧</span> 
                 <span className="text-xs font-bold hidden sm:inline">English</span>
              </button>
              <button 
                onClick={() => switchTargetLanguage('TH')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${targetLanguage === 'TH' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:bg-slate-200'}`}
              >
                 <span className="text-base">🇹🇭</span>
                 <span className="text-xs font-bold hidden sm:inline">Thai</span>
              </button>
           </div>
        </div>

        {/* Top Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('TRANSLATE')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'TRANSLATE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
            >
              {targetLanguage === 'EN' ? 'TRANSLATE' : 'TRIP'}
            </button>
            <button 
              onClick={() => setActiveTab('LEARN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'LEARN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
            >
              LEARN
            </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {activeTab === 'TRANSLATE' && (
          <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-28">
            
            {/* Direction Switcher (In-flow) */}
            <div className="flex justify-center mt-4 px-6">
              <button 
                  onClick={toggleDirection}
                  disabled={state !== AppState.IDLE}
                  className={`w-full max-w-xs flex items-center justify-between px-4 py-2 rounded-full border shadow-sm transition-all ${state !== AppState.IDLE ? 'opacity-50 cursor-not-allowed' : 'bg-white border-slate-200 active:scale-95'}`}
                >
                  <span className={`font-bold text-xs transition-colors ${direction.startsWith('FR') ? 'text-indigo-600' : 'text-slate-400'}`}>French (Input)</span>
                  <div className="bg-slate-100 p-1.5 rounded-full">
                     <ArrowRightLeft size={14} className="text-slate-500" />
                  </div>
                  <span className={`font-bold text-xs transition-colors ${!direction.startsWith('FR') ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {targetLanguage === 'EN' ? 'English' : 'Thai'} (Input)
                  </span>
                </button>
            </div>

            <div className="px-6 pt-2">
              {/* Avatar Section */}
              <div className="flex-none py-4 flex justify-center">
                 <Avatar state={state} />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center mb-4 animate-bounce border border-red-200 font-bold shadow-sm">
                  {error}
                </div>
              )}

              {/* Processing State */}
              {state === AppState.PROCESSING && (
                  <div className="text-center mt-8 animate-pulse">
                      <p className="text-slate-400 text-sm font-medium">Marcelo is thinking...</p>
                  </div>
              )}

              {/* Current Translation Result */}
              {currentTranslation && state !== AppState.RECORDING && state !== AppState.PROCESSING && (
                  <TranslationCard 
                    data={currentTranslation} 
                    onPlay={() => handlePlayAudio(currentTranslation.audioData)}
                    isPlaying={state === AppState.SPEAKING}
                  />
              )}

              {/* Empty State */}
              {!currentTranslation && state === AppState.IDLE && (
                <div className="text-center mt-6 mb-8">
                   {direction.startsWith('FR') ? (
                    <>
                       <p className="text-slate-400 text-sm mb-2">Speak <span className="font-bold text-slate-600">French</span> to translate.</p>
                    </>
                   ) : (
                    <>
                       <p className="text-slate-400 text-sm mb-2">Speak <span className="font-bold text-slate-600">{targetLanguage === 'EN' ? 'English' : 'Thai'}</span> to help locals.</p>
                    </>
                   )}
                </div>
              )}

              {/* History & Favorites Section */}
              <div className="mt-8 border-t border-slate-100 pt-6 pb-8">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                          {historyFilter === 'ALL' ? (
                            <><RotateCcw size={12} /> Recent History</>
                          ) : (
                            <><Star size={12} className="text-amber-400 fill-amber-400" /> Favorites</>
                          )}
                      </h3>
                      
                      {/* History Filter Toggles */}
                      <div className="flex bg-slate-100 rounded-lg p-0.5">
                          <button 
                            onClick={() => setHistoryFilter('ALL')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${historyFilter === 'ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setHistoryFilter('FAVORITES')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${historyFilter === 'FAVORITES' ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            Favorites
                          </button>
                      </div>
                  </div>

                  <div className="space-y-3">
                      {filteredHistory.length === 0 && (
                        <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                           <p className="text-slate-400 text-sm italic">
                             {historyFilter === 'FAVORITES' 
                               ? "No favorites yet. Star a phrase to save it!" 
                               : "Your conversation history will appear here."}
                           </p>
                        </div>
                      )}
                      {filteredHistory.map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => handleRestoreHistory(item)}
                            className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center gap-3 group transition-all hover:border-indigo-200 cursor-pointer hover:bg-indigo-50/30"
                          >
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-slate-400 uppercase">{item.sourceLanguage} → {item.targetLanguage}</span>
                                  </div>
                                  <div className="text-slate-700 font-medium text-sm mb-1 truncate">{item.sourceText}</div>
                                  <div className="text-sm text-indigo-600 font-medium border-l-2 border-indigo-200 pl-2 truncate">
                                      {/* Show phonetic in history preview if available for better recall */}
                                      {item.phonetic ? `${item.translatedText} (${item.phonetic})` : item.translatedText}
                                  </div>
                              </div>
                              
                              <div className="flex flex-col gap-1">
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayAudio(item.audioData);
                                    }}
                                    disabled={state !== AppState.IDLE && state !== AppState.SPEAKING}
                                    className="w-8 h-8 rounded-full bg-slate-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors z-10"
                                    title="Play Audio"
                                  >
                                    <Volume2 size={14} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(item.id);
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${item.isFavorite ? 'bg-amber-50 text-amber-400' : 'bg-slate-50 text-slate-300 hover:text-amber-400'}`}
                                  >
                                    <Heart size={14} className={item.isFavorite ? 'fill-amber-400' : ''} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'LEARN' && (
          <div className="flex flex-col h-full overflow-y-auto p-6 bg-slate-50">
             <header className="flex-none pb-6 pt-2">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Daily Progress</h2>
                <p className="text-slate-400 text-sm">
                    {targetLanguage === 'EN' ? 'Master English with Marcelo' : 'Learn Thai Essentials'}
                </p>
             </header>

             <div className="space-y-4">
                {/* Daily Progress */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-indigo-100 text-xs font-bold uppercase">Daily Goal</p>
                        <p className="text-2xl font-bold">Day 4</p>
                      </div>
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Trophy size={20} className="text-yellow-300" />
                      </div>
                   </div>
                   <div className="w-full bg-black/20 rounded-full h-2 mb-2">
                      <div className="bg-white h-2 rounded-full w-3/4"></div>
                   </div>
                   <p className="text-xs text-indigo-100">75% of today's goal completed</p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:border-indigo-200 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-3">
                         <BookOpen size={20} />
                      </div>
                      <h3 className="font-bold text-slate-700 text-sm">Daily Lesson</h3>
                      <p className="text-xs text-slate-400 mt-1">Grammar basics</p>
                   </div>
                   <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:border-indigo-200 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-3">
                         <Star size={20} />
                      </div>
                      <h3 className="font-bold text-slate-700 text-sm">Vocabulary</h3>
                      <p className="text-xs text-slate-400 mt-1">Travel words</p>
                   </div>
                </div>
                
                {/* Coming Soon */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center mt-4">
                  <p className="text-slate-400 text-sm">More exercises coming soon...</p>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* --- FLOATING CONTROLS --- */}
      {activeTab === 'TRANSLATE' && (
        <div className="absolute bottom-6 left-0 right-0 px-6 flex items-end justify-between z-30 pointer-events-none">
           
           {/* Left Spacer */}
           <div className="w-12"></div>

           {/* Center Mic Button */}
           <button
              onClick={handleMicClick}
              disabled={state === AppState.PROCESSING || state === AppState.SPEAKING}
              className={`
                pointer-events-auto
                relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300
                ${state === AppState.RECORDING 
                  ? 'bg-red-500 text-white scale-110 ring-4 ring-red-200' 
                  : state === AppState.PROCESSING || state === AppState.SPEAKING
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 ring-4 ring-indigo-100'}
              `}
            >
              {state === AppState.RECORDING ? (
                  <Square fill="currentColor" size={28} />
              ) : (
                  <Mic size={32} strokeWidth={2.5} />
              )}
              
              {state === AppState.RECORDING && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
              )}
            </button>

            {/* Right Dictionary Button */}
            <div className="w-12 h-12 pointer-events-auto">
               <button 
                onClick={() => setShowDictionary(true)}
                className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all"
               >
                 <Book size={20} />
               </button>
            </div>
        </div>
      )}

      {/* --- MINI DICTIONARY MODAL --- */}
      {showDictionary && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
           <div className="bg-white w-full h-[80%] sm:h-[70%] sm:w-[90%] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-slide-up">
              <div className="flex-none p-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                     <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Book size={18} className="text-indigo-500" /> Mini Dictionary
                     </h3>
                     <p className="text-xs text-slate-400 flex items-center gap-1">
                        {targetLanguage === 'EN' ? '🇬🇧 English' : '🇹🇭 Thai'} Essentials
                     </p>
                  </div>
                  <button onClick={() => setShowDictionary(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                     <X size={20} />
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 gap-2">
                     {currentDictionary.map((phrase: any, index: number) => (
                        <div key={index} className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-colors">
                           <span className="font-medium text-slate-700 mb-1">{phrase.fr}</span>
                           <div className="flex items-center gap-2 text-sm flex-wrap">
                              <ArrowRightLeft size={12} className="text-slate-300 flex-shrink-0" />
                              {targetLanguage === 'EN' ? (
                                <span className="font-bold text-indigo-600">{phrase.en}</span>
                              ) : (
                                <div className="flex flex-col">
                                   <span className="font-bold text-indigo-600">{phrase.th}</span>
                                   <span className="text-xs text-slate-400 italic">{phrase.phonetic}</span>
                                </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;
