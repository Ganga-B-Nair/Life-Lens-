import React, { useState, useEffect } from 'react';
import { Cat, MessageCircle, X } from 'lucide-react';
import { ContextCategory } from '../types';

interface SketchPetProps {
  context?: ContextCategory;
  isAnalyzing: boolean;
}

const TIPS: Record<string, string[]> = {
  Health: [
    "Drink some water while you read this!",
    "Shoulders relaxed? Jaw unclenched?",
    "A 5-minute walk does wonders.",
    "Health comes first, productivity second."
  ],
  Education: [
    "Try the Feynman technique: explain it simply.",
    "Take a break every 25 minutes.",
    "Flashcards are great for active recall.",
    "Don't just read, rewrite in your own words."
  ],
  Business: [
    "Focus on the highest leverage task.",
    "Clear communication saves time.",
    "Is this meeting necessary?",
    "Inbox zero feels great, but impact matters more."
  ],
  Planning: [
    "One thing at a time.",
    "Schedule your rest too.",
    "Top 3 priorities for tomorrow?",
    "Done is better than perfect."
  ],
  Accessibility: [
    "Clear text benefits everyone.",
    "Contrast matters!",
    "Structure helps screen readers.",
    "Simplicity is the ultimate sophistication."
  ],
  General: [
    "I'm ready to help you organize!",
    "Upload a messy note, I'll fix it.",
    "Need a summary? I'm on it.",
    "Take a deep breath."
  ]
};

export const SketchPet: React.FC<SketchPetProps> = ({ context, isAnalyzing }) => {
  const [message, setMessage] = useState("Hi! I'm your sketch buddy.");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isAnalyzing) {
      setMessage("Thinking... 🤔");
      setIsOpen(true);
      return;
    }

    if (context) {
      const tips = TIPS[context] || TIPS.General;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setMessage(randomTip);
      setIsOpen(true);
    }
  }, [context, isAnalyzing]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-white border-2 border-ink shadow-sketch hover:shadow-sketch-hover transition-all rounded-full z-50 group"
      >
        <Cat className="text-ink group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4 animate-bounce-in">
      <div className="relative bg-white border-2 border-ink p-4 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-sketch max-w-[200px]">
         <button 
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -left-2 bg-paper border border-ink rounded-full p-1 hover:bg-red-50 text-ink/50 hover:text-red-500"
        >
          <X size={12} />
        </button>
        <p className="text-sm font-body text-ink leading-tight">{message}</p>
        <div className="absolute -bottom-[2px] -right-[10px] w-4 h-4 bg-white border-b-2 border-r-2 border-ink rotate-45 transform origin-center"></div>
      </div>
      
      <div className="bg-white p-3 rounded-full border-2 border-ink shadow-sketch relative">
        <Cat size={32} className="text-ink" />
        {context === 'Health' && (
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border border-ink animate-pulse"></div>
        )}
      </div>
    </div>
  );
};