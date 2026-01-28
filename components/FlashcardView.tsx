import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

interface FlashcardProps {
    mistakes: { question: string, correct: string, explanation?: string }[];
    onClose: () => void;
}

const generateAiImage = async (prompt: string): Promise<string> => {
    // Mock AI Image Generation
    // In a real app, this would call DALL-E or Gemini Pro Vision
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(prompt.slice(0, 20))}...`);
        }, 1500);
    });
};

export const FlashcardView: React.FC<FlashcardProps> = ({ mistakes, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(false);

    const currentCard = mistakes[currentIndex];

    useEffect(() => {
        setIsFlipped(false);
        setImageUrl(null);
        // Auto-generate image for the question concept
        if (currentCard) {
            setLoadingImage(true);
            generateAiImage(currentCard.question)
                .then(url => {
                    setImageUrl(url);
                    setLoadingImage(false);
                });
        }
    }, [currentIndex, currentCard]);

    const handleNext = () => {
        if (currentIndex < mistakes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (!currentCard) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 text-white">
                    <div className="flex items-center gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
                            {currentIndex + 1} / {mistakes.length}
                        </span>
                        <h3 className="font-bold text-lg">Revision Deck</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Card Container */}
                <div className="relative aspect-[3/4] w-full perspective-1000">
                    <motion.div
                        className="w-full h-full relative preserve-3d cursor-pointer"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        onClick={handleFlip}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front (Question) */}
                        <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden border-4 border-slate-100">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-10 -mt-10"></div>
                            
                            <div className="relative z-10">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Question</h4>
                                <p className="text-xl font-black text-slate-800 leading-relaxed">
                                    {currentCard.question}
                                </p>
                            </div>

                            {/* AI Image Area */}
                            <div className="flex-1 my-6 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative group">
                                {loadingImage ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Sparkles className="text-blue-400 animate-pulse" />
                                        <p className="text-[10px] text-slate-400 font-bold animate-pulse">Generating AI Visual...</p>
                                    </div>
                                ) : imageUrl ? (
                                    <img src={imageUrl} alt="AI Visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <ImageIcon className="text-slate-300" size={32} />
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                    <Sparkles size={10} /> AI Generated
                                </div>
                            </div>

                            <div className="text-center text-slate-400 text-xs font-bold animate-pulse">
                                Tap to Flip
                            </div>
                        </div>

                        {/* Back (Answer) */}
                        <div 
                            className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 shadow-2xl flex flex-col justify-center text-white border-4 border-white/20"
                            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                        >
                            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Correct Answer</h4>
                            <p className="text-2xl font-black mb-6 leading-tight">
                                {currentCard.correct}
                            </p>
                            
                            {currentCard.explanation && (
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                    <h5 className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Explanation</h5>
                                    <p className="text-sm font-medium opacity-90 leading-relaxed">
                                        {currentCard.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center mt-8 gap-4">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentIndex === 0}
                        className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        <ChevronLeft className="text-white" size={24} />
                    </button>

                    <button 
                        onClick={() => {
                            setIsFlipped(false);
                            setTimeout(() => setIsFlipped(true), 100);
                        }}
                        className="p-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 hover:scale-110 transition-transform active:scale-95"
                    >
                        <RotateCcw className="text-white" size={24} />
                    </button>

                    <button 
                        onClick={handleNext} 
                        disabled={currentIndex === mistakes.length - 1}
                        className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        <ChevronRight className="text-white" size={24} />
                    </button>
                </div>

            </div>
        </div>
    );
};
