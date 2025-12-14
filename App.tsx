import React, { useState } from 'react';
import { Camera, Sparkles, Pencil, Loader2 } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { OutputDisplay } from './components/OutputDisplay';
import { SketchPet } from './components/SketchPet';
import { analyzeContent } from './services/geminiService';
import { FileData, OutputMode, ProcessingState } from './types';
import { MODE_OPTIONS } from './constants';

const App: React.FC = () => {
  // State
  const [text, setText] = useState('');
  const [file, setFile] = useState<FileData | null>(null);
  const [selectedMode, setSelectedMode] = useState<OutputMode>('summary');
  const [processing, setProcessing] = useState<ProcessingState>({
    isAnalyzing: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async () => {
    if (!text && !file) return;

    setProcessing({ isAnalyzing: true, error: null, result: null });

    try {
      const result = await analyzeContent(text, file, selectedMode);
      setProcessing({ isAnalyzing: false, error: null, result });
    } catch (err: any) {
      setProcessing({ 
        isAnalyzing: false, 
        error: err.message || "Something went wrong during analysis.", 
        result: null 
      });
    }
  };

  const reset = () => {
    setText('');
    setFile(null);
    setProcessing({ isAnalyzing: false, error: null, result: null });
  };

  return (
    <div className="min-h-screen pb-20 font-body text-ink selection:bg-yellow-200 selection:text-ink">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23391E10' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm border-b-2 border-ink/10">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <div className="border-2 border-ink p-2 rounded-lg bg-white shadow-sketch group-hover:shadow-sketch-hover transition-all transform group-hover:-rotate-2">
              <Camera size={24} className="text-ink" />
            </div>
            <span className="font-display text-3xl text-ink font-bold mt-2">LifeLens</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-ink/60 uppercase tracking-widest hidden sm:flex bg-white px-3 py-1 border border-ink/20 rounded-full">
            <Pencil size={14} />
            Sketchbook Edition
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-sm shadow-sketch border-2 border-ink p-6 relative">
               <div className="absolute -top-3 -left-3 bg-paper border-2 border-ink w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-sm z-10">1</div>
              <h2 className="font-display text-2xl text-ink mb-6 ml-2">Drop your thoughts</h2>
              <InputSection 
                text={text}
                setText={setText}
                file={file}
                setFile={setFile}
                isAnalyzing={processing.isAnalyzing}
              />
            </div>

            <div className="bg-white rounded-sm shadow-sketch border-2 border-ink p-6 relative">
              <div className="absolute -top-3 -left-3 bg-paper border-2 border-ink w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-sm z-10">2</div>
              <h2 className="font-display text-2xl text-ink mb-6 ml-2">How should I draw this?</h2>
              
              <div className="space-y-3">
                {MODE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedMode === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedMode(option.id)}
                      disabled={processing.isAnalyzing}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-sm border-2 text-left transition-all duration-200 group
                        ${isSelected
                          ? 'border-ink bg-paper shadow-sketch -translate-y-0.5' 
                          : 'border-ink/20 hover:border-ink hover:bg-white hover:shadow-sketch'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-full border-2 border-ink ${isSelected ? 'bg-ink text-paper' : 'bg-paper text-ink group-hover:scale-110 transition-transform'}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className={`font-bold text-lg leading-none mb-1 ${isSelected ? 'text-ink' : 'text-ink/80'}`}>
                          {option.label}
                        </p>
                        <p className="text-sm text-ink/50 leading-tight">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={(!text && !file) || processing.isAnalyzing}
              className={`
                w-full py-5 px-6 rounded-sm font-bold text-xl shadow-sketch border-2 border-ink
                flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]
                ${(!text && !file) || processing.isAnalyzing 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 shadow-none' 
                  : 'bg-white hover:bg-paper hover:shadow-sketch-hover text-ink'
                }
              `}
            >
              {processing.isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Sketching...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Analyze & Sketch
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 min-h-[600px]">
            {processing.result ? (
              <OutputDisplay result={processing.result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-sm border-2 border-dashed border-ink/20 p-8 text-center relative overflow-hidden">
                {/* Background Doodles */}
                <div className="absolute top-10 right-10 text-ink/5 opacity-50 transform rotate-12 pointer-events-none">
                  <Sparkles size={120} />
                </div>
                <div className="absolute bottom-10 left-10 text-ink/5 opacity-50 transform -rotate-12 pointer-events-none">
                  <Pencil size={120} />
                </div>

                {processing.error ? (
                   <div className="max-w-md text-red-800 bg-red-50 p-6 rounded-sm border-2 border-red-200 shadow-sketch">
                     <p className="font-display text-2xl mb-2">Oops!</p>
                     <p className="text-lg">{processing.error}</p>
                   </div>
                ) : (
                  <div className="relative z-10 max-w-lg">
                    <div className="w-24 h-24 mx-auto bg-paper rounded-full border-2 border-ink flex items-center justify-center mb-6 shadow-sketch transform -rotate-3">
                      <Pencil className="text-ink" size={48} />
                    </div>
                    <h3 className="font-display text-4xl text-ink mb-4">Your canvas is empty</h3>
                    <p className="text-xl text-ink/60 leading-relaxed mb-8">
                      Snap a photo of your messy notes, upload a PDF, or just type what's on your mind. <br/> I'll turn it into a beautiful plan.
                    </p>
                    
                    <div className="flex justify-center gap-4">
                        <div className="w-3 h-3 bg-ink/20 rounded-full animate-bounce delay-75"></div>
                        <div className="w-3 h-3 bg-ink/20 rounded-full animate-bounce delay-150"></div>
                        <div className="w-3 h-3 bg-ink/20 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* The Sketch Pet */}
      <SketchPet 
        context={processing.result?.context} 
        isAnalyzing={processing.isAnalyzing} 
      />
    </div>
  );
};

export default App;