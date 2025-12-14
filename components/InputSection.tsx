import React, { useCallback, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Paperclip } from 'lucide-react';
import { FileData } from '../types';

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  file: FileData | null;
  setFile: (file: FileData | null) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  text,
  setText,
  file,
  setFile,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      
      setFile({
        base64: base64Data,
        mimeType: selectedFile.type,
        name: selectedFile.name
      });
    };
    reader.readAsDataURL(selectedFile);
  }, [setFile]);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Tape Effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 rotate-1 backdrop-blur-sm z-10 border border-white/20 shadow-sm"></div>
        
        <textarea
          disabled={isAnalyzing}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Jot down your notes, thoughts, or questions..."
          className="w-full h-40 p-6 rounded-sm bg-white border-2 border-ink/10 focus:border-ink focus:ring-0 focus:shadow-sketch outline-none transition-all resize-none text-ink text-lg placeholder:text-ink/40 font-body leading-relaxed"
          style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 32px', lineHeight: '32px', paddingTop: '0px' }}
        />
      </div>

      <div 
        onClick={isAnalyzing ? undefined : triggerFileUpload}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-sm p-6 transition-all duration-200
          flex flex-col items-center justify-center gap-2
          ${file 
            ? 'border-ink bg-white shadow-sketch' 
            : 'border-ink/20 hover:border-ink hover:bg-white hover:shadow-sketch'
          }
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />

        {file ? (
          <div className="flex items-center gap-4 w-full px-4">
            <div className="p-3 bg-paper rounded-full border border-ink/20 text-ink">
              {file.mimeType.includes('image') ? <ImageIcon size={24} /> : <FileText size={24} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-ink truncate font-body text-lg">{file.name}</p>
              <p className="text-sm text-ink/60 uppercase">{file.mimeType.split('/')[1]}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="p-2 hover:bg-red-50 rounded-full transition-colors text-ink/40 hover:text-red-500"
            >
              <X size={24} />
            </button>
          </div>
        ) : (
          <>
            <div className="p-3 bg-paper rounded-full border-2 border-ink/10 group-hover:border-ink group-hover:scale-110 transition-all text-ink/40 group-hover:text-ink">
              <Paperclip size={28} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-ink group-hover:underline decoration-wavy decoration-ink/30">Attach Image or PDF</p>
              <p className="text-sm text-ink/50">I'll have a look at it!</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};