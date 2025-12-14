import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResponse, ContextCategory } from '../types';
import { Activity, Briefcase, GraduationCap, Calendar, Accessibility, Sparkles, Eye } from 'lucide-react';

interface OutputDisplayProps {
  result: AnalysisResponse;
}

const ContextIcon: React.FC<{ context: ContextCategory }> = ({ context }) => {
  switch (context) {
    case 'Health': return <Activity className="w-6 h-6" />;
    case 'Business': return <Briefcase className="w-6 h-6" />;
    case 'Education': return <GraduationCap className="w-6 h-6" />;
    case 'Planning': return <Calendar className="w-6 h-6" />;
    case 'Accessibility': return <Accessibility className="w-6 h-6" />;
    default: return <Sparkles className="w-6 h-6" />;
  }
};

const ContextColors: Record<ContextCategory, string> = {
  Health: 'bg-red-50 text-red-800 border-red-200',
  Education: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  Business: 'bg-blue-50 text-blue-800 border-blue-200',
  Planning: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Accessibility: 'bg-amber-50 text-amber-800 border-amber-200',
  General: 'bg-gray-50 text-gray-800 border-gray-200',
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ result }) => {
  // const badgeColor = ContextColors[result.context] || ContextColors.General;

  return (
    <div className="animate-fade-in space-y-8 relative">
       {/* Tape at the top */}
       <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-yellow-100/80 rotate-[-1deg] backdrop-blur-sm z-10 border border-yellow-200/50 shadow-sm opacity-90"></div>

      {/* Visual Reasoning Section */}
      <div className="bg-white rounded-sm shadow-sketch border-2 border-ink p-6 transform -rotate-1 transition-transform hover:rotate-0">
        <div className="flex items-center gap-3 mb-3 border-b-2 border-ink/10 pb-2 border-dashed">
          <Eye className="text-ink w-6 h-6" />
          <h3 className="font-display text-2xl text-ink">What I See</h3>
        </div>
        <p className="font-body text-lg text-ink/80 italic leading-relaxed">
          "{result.visual_summary}"
        </p>
      </div>

      {/* Main Output Card */}
      <div className="bg-white rounded-sm shadow-sketch border-2 border-ink overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b-2 border-ink/10 bg-paper">
           <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-4xl text-ink mb-2">{result.title}</h2>
                <div className="flex items-center gap-2 text-ink/60 font-body">
                   <ContextIcon context={result.context} />
                   <span className="text-lg">{result.reasoning}</span>
                </div>
              </div>
              <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-sm font-bold border-2 border-ink/20 shadow-sm uppercase tracking-wider transform rotate-2 ${ContextColors[result.context]}`}>
                {result.context}
              </span>
           </div>
        </div>

        {/* Content Body */}
        <div className="p-8 prose prose-lg prose-slate max-w-none font-body text-ink">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="font-display text-3xl mb-4 mt-6 text-ink" {...props} />,
              h2: ({node, ...props}) => <h2 className="font-display text-2xl mb-3 mt-5 text-ink border-b border-ink/20 pb-1" {...props} />,
              h3: ({node, ...props}) => <h3 className="font-bold text-xl mb-2 mt-4 text-ink" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-ink bg-yellow-100/50 px-1 rounded-sm" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 marker:text-ink/50" {...props} />,
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-6 border-2 border-ink rounded-sm shadow-sm">
                  <table className="min-w-full divide-y-2 divide-ink" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => <thead className="bg-paper" {...props} />,
              th: ({node, ...props}) => <th className="px-6 py-3 text-left text-sm font-bold text-ink uppercase tracking-wider border-b-2 border-ink" {...props} />,
              td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-base text-ink border-r border-ink/10 last:border-r-0" {...props} />,
              code: ({node, inline, className, children, ...props}: any) => {
                 return !inline ? (
                   <div className="bg-paper border-2 border-ink rounded-sm p-4 overflow-x-auto text-sm font-mono my-4 shadow-inner">
                     <code className={className} {...props}>{children}</code>
                   </div>
                 ) : (
                   <code className="bg-paper border border-ink/20 px-1 py-0.5 rounded text-sm font-mono text-ink" {...props}>{children}</code>
                 )
              },
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-ink/30 pl-4 italic text-ink/70 my-4" {...props} />
              )
            }}
          >
            {result.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};