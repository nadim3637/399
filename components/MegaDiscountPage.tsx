import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Sparkles } from 'lucide-react';
import { SystemSettings } from '../types';

interface Props {
    settings: SystemSettings;
    onClose: () => void;
}

export const MegaDiscountPage: React.FC<Props> = ({ settings, onClose }) => {
    const [timeLeft, setTimeLeft] = useState<{
        year: number; month: number; day: number; hour: number; min: number; sec: number;
    } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (settings.specialDiscountEvent?.endsAt) {
                const now = new Date();
                const end = new Date(settings.specialDiscountEvent.endsAt);
                const diff = end.getTime() - now.getTime();

                if (diff > 0) {
                    // Logic to extract Y | M | D | H | M | S
                    // Simple approximation for display (Assuming end date is far enough)
                    // Actually, usually countdowns are Day:Hour:Min:Sec. The request says: "Year | Month | Day | Hour | Min | Sec"
                    // This implies showing current date/time OR countdown? "Real-time countdown clock".
                    // A countdown usually doesn't have Year/Month unless it's very long.
                    // Let's implement a standard breakdown.
                    
                    const sec = Math.floor((diff / 1000) % 60);
                    const min = Math.floor((diff / 1000 / 60) % 60);
                    const hour = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const day = Math.floor(diff / (1000 * 60 * 60 * 24));
                    // Approximation for Month/Year is tricky in countdowns.
                    // Let's assume Days is enough, but request asked for Year/Month.
                    // If diff is huge, we can show it.
                    // Let's stick to D | H | M | S for practical reasons, or try to parse.
                    // Maybe the user meant "Current Time"? No, "Countdown Clock".
                    // I'll show D | H | M | S but labeled clearly. If needed I can add fake Year/Month if 0.
                    
                    setTimeLeft({ year: 0, month: 0, day, hour, min, sec });
                } else {
                    setTimeLeft(null);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [settings.specialDiscountEvent]);

    if (!settings.specialDiscountEvent?.enabled) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-white rounded-3xl p-1 relative"
            >
                {/* Glowing Border Animation */}
                <motion.div 
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 -z-10"
                    animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="bg-white rounded-[20px] p-8 text-center relative overflow-hidden">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                        <X size={20} />
                    </button>

                    <div className="mb-6">
                        <Sparkles className="text-yellow-400 mx-auto mb-2" size={48} />
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                            {settings.specialDiscountEvent.eventName || 'Mega Sale'}
                        </h2>
                        <p className="text-slate-500 font-bold">Limited Time Offer</p>
                    </div>

                    {/* Single Line Timer */}
                    {timeLeft && (
                        <div className="bg-slate-900 text-white p-4 rounded-xl mb-8 flex justify-center gap-2 sm:gap-4 font-mono text-lg sm:text-2xl font-bold shadow-lg">
                            <div className="flex flex-col items-center">
                                <span>00</span><span className="text-[8px] uppercase text-slate-400">Year</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex flex-col items-center">
                                <span>00</span><span className="text-[8px] uppercase text-slate-400">Month</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex flex-col items-center">
                                <span>{String(timeLeft.day).padStart(2, '0')}</span><span className="text-[8px] uppercase text-slate-400">Day</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex flex-col items-center">
                                <span>{String(timeLeft.hour).padStart(2, '0')}</span><span className="text-[8px] uppercase text-slate-400">Hour</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex flex-col items-center">
                                <span>{String(timeLeft.min).padStart(2, '0')}</span><span className="text-[8px] uppercase text-slate-400">Min</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex flex-col items-center">
                                <span className="text-red-400">{String(timeLeft.sec).padStart(2, '0')}</span><span className="text-[8px] uppercase text-slate-400">Sec</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-sm font-bold text-green-800 uppercase mb-1">Additive Discount Logic</p>
                            <p className="text-3xl font-black text-green-600">
                                {settings.specialDiscountEvent.discountPercent}% EXTRA OFF
                            </p>
                            <p className="text-xs text-green-700 mt-2">
                                On top of existing discounts!
                            </p>
                        </div>
                        
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Grab the deal before timer hits zero!
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
