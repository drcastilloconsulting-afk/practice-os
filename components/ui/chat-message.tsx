'use client';

import { motion } from 'framer-motion';
import { Bot, User, Check, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatOption {
  label: string;
  value: string;
  mitigation?: string;
}

interface ProposedMitigation {
  choice: string;
  mitigation: string;
}

interface ChatMessageProps {
  sender: 'ai' | 'user';
  text: string;
  isStreaming?: boolean;
  options?: ChatOption[];
  proposedMitigation?: ProposedMitigation;
  onSelectOption?: (option: ChatOption) => void;
  onAcceptMitigation?: () => void;
  onRejectMitigation?: () => void;
  timestamp?: string;
}

export function ChatMessage({
  sender,
  text,
  isStreaming = false,
  options,
  proposedMitigation,
  onSelectOption,
  onAcceptMitigation,
  onRejectMitigation,
  timestamp,
}: ChatMessageProps) {
  const isAi = sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
    >
      {/* AI avatar */}
      {isAi && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[75%] space-y-2 ${isAi ? '' : 'items-end'}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isAi
              ? 'bg-[#181C2E] border border-[rgba(99,102,241,0.12)] text-[#F1F5F9]'
              : 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white'
          }`}
        >
          <div className="prose prose-invert prose-sm max-w-none [&_p]:m-0 [&_ul]:mt-1 [&_ol]:mt-1 [&_li]:text-sm [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-black/20 [&_pre]:rounded [&_pre]:p-2 [&_pre]:mt-2">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
          {isStreaming && (
            <span className="inline-block w-[2px] h-[1em] bg-current align-text-bottom ml-0.5 animate-pulse" />
          )}
        </div>

        {/* Suggested Quick Reply Options */}
        {options && options.length > 0 && onSelectOption && (
          <div className="flex flex-wrap gap-2 pt-1">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onSelectOption(option)}
                className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-all"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Proposed Mitigation Interactive Panel */}
        {proposedMitigation && onAcceptMitigation && onRejectMitigation && (
          <div className="rounded-xl border border-violet-500/20 bg-[#131728] p-3 space-y-3 mt-2 shadow-sm animate-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Proposed Offset Strategy</span>
              <p className="text-xs font-semibold text-white">{proposedMitigation.choice}</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{proposedMitigation.mitigation}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onAcceptMitigation}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Accept Offset
              </button>
              <button
                onClick={onRejectMitigation}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          </div>
        )}

        {timestamp && (
          <p className={`text-[10px] text-[#64748B] ${isAi ? 'text-left' : 'text-right'}`}>
            {timestamp}
          </p>
        )}
      </div>

      {/* User avatar */}
      {!isAi && (
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}
