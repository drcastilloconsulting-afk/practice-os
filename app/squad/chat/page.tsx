'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Brain, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/components/ui/chat-message';
import { GlassCard } from '@/components/ui/glass-card';

interface ChatOption {
  label: string;
  value: string;
  mitigation?: string;
}

interface ProposedMitigation {
  choice: string;
  mitigation: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isStreaming?: boolean;
  options?: ChatOption[];
  proposedMitigation?: ProposedMitigation;
  timestamp?: string;
}

const INITIAL_SUGGESTIONS: ChatOption[] = [
  { label: '🍷 Weekend Wine (Friday/Saturday)', value: 'wine', mitigation: 'Extend weekend sleep target by 1 hour (8.5h) to clear load, and drink 1L electrolyte water buffer by 6:00 PM.' },
  { label: '⏰ No 5:00 AM Workouts', value: 'sleep', mitigation: 'Shift target workouts to 2x 10-minute Post-meal "walking snacks" immediately following lunch and dinner.' },
  { label: '🪑 Sitting for 9+ Hours Daily', value: 'sitting', mitigation: 'Integrate hourly 1-minute standing/stretching habits + Oura compliance checks.' },
  { label: '🥩 Late Client Dinners (Twice weekly)', value: 'dinner', mitigation: 'Pre-load dinner with trace mineral packet, and lock a 2-hour sleep buffer window post-dinner.' }
];

export default function SquadChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `👋 **Welcome to the UA Onboarding & Habit Negotiator.** 

I am your physiological protocol co-designer. My goal is to negotiate lifestyle compromises and find biological workarounds (offsets) for your schedule constraints, rather than forcing unrealistic regimes. 

What constraints or habits are we negotiating today? Choose a suggestion below or type your own.`,
      options: INITIAL_SUGGESTIONS
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  // Handle Quick suggestion selection
  const handleSelectOption = async (option: ChatOption) => {
    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: `Let's discuss my constraint: ${option.label}.`
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    // Prepare message history
    const history = [
      { role: 'user' as const, content: `Let's discuss my constraint: ${option.label}. I need a mitigation strategy.` }
    ];

    try {
      const response = await fetch('/api/ua-squad/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          subscriberContext: {
            habits: [],
            cohortRank: '#5 in Ages 30-45'
          }
        })
      });

      if (!response.body) throw new Error('Response body missing');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiText = '';

      const aiMsgId = Math.random().toString();
      setMessages((prev) => [...prev, { id: aiMsgId, sender: 'ai', text: '', isStreaming: true }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          aiText += chunk;

          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: aiText } : msg))
          );
        }
      }

      // Parse structured [MITIGATION] block
      const mitigationRegex = /\[MITIGATION\]([\s\S]*?)\[\/MITIGATION\]/;
      const match = aiText.match(mitigationRegex);
      
      let proposedMitigation: ProposedMitigation | undefined;
      let cleanedText = aiText;

      if (match && match[1]) {
        try {
          proposedMitigation = JSON.parse(match[1].trim());
          cleanedText = aiText.replace(mitigationRegex, '').trim();
        } catch (jsonErr) {
          console.error('Error parsing mitigation JSON block:', jsonErr);
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: cleanedText,
                isStreaming: false,
                proposedMitigation: proposedMitigation ? {
                  choice: proposedMitigation.choice,
                  mitigation: proposedMitigation.mitigation
                } : undefined
              }
            : msg
        )
      );

    } catch (err) {
      console.error('Error selecting option:', err);
      // Fallback to static client mitigation if API fails
      if (option.mitigation) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'ai',
            text: `Here is a custom mitigation offset for your constraint: **${option.label}**.`,
            proposedMitigation: {
              choice: option.label,
              mitigation: option.mitigation || ''
            }
          }
        ]);
      }
    } finally {
      setIsAiResponding(false);
    }
  };

  // Persist accepted mitigation to DB
  const handleAcceptMitigation = async (proposed: ProposedMitigation, messageId: string) => {
    try {
      const res = await fetch('/api/ua-squad/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: 'test',
          habitName: proposed.choice,
          description: `Mitigation strategy for ${proposed.choice}`,
          targetMetric: 'CNI Score optimization',
          mitigationStrategy: proposed.mitigation,
          isSelfReported: true
        })
      });

      const result = await res.json();
      if (result.success) {
        // Remove the interactive accept panel from this message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, proposedMitigation: undefined } : msg
          )
        );

        // Append success message
        const confirmationMsg: Message = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `✅ **Offset Accepted & Applied.** I have updated your daily check-lists and active leaderboard tracking protocol.

You can view and check off this offset on your **Protocol** tab. Is there any other constraint we should negotiate?`,
          options: INITIAL_SUGGESTIONS
        };
        setMessages((prev) => [...prev, confirmationMsg]);
      }
    } catch (err) {
      console.error('Failed to accept mitigation:', err);
    }
  };

  // Reject mitigation proposal
  const handleRejectMitigation = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, proposedMitigation: undefined } : msg
      )
    );

    const feedbackMsg: Message = {
      id: Math.random().toString(),
      sender: 'ai',
      text: `Understood, let's try something different. Tell me more about what parts of that strategy wouldn't fit your day-to-day schedule, and we can find another offset.`,
      options: INITIAL_SUGGESTIONS
    };
    setMessages((prev) => [...prev, feedbackMsg]);
  };

  // Handle custom text message submission
  const handleCustomSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal('');

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    // Prepare message history
    const history = messages.map((m) => ({
      role: m.sender === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.text,
    }));
    history.push({ role: 'user', content: userText });

    try {
      const response = await fetch('/api/ua-squad/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          subscriberContext: {
            habits: [],
            cohortRank: '#5 in Ages 30-45'
          }
        })
      });

      if (!response.body) throw new Error('Response body missing');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiText = '';

      const aiMsgId = Math.random().toString();
      setMessages((prev) => [...prev, { id: aiMsgId, sender: 'ai', text: '', isStreaming: true }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          aiText += chunk;

          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: aiText } : msg))
          );
        }
      }

      // Parse structured [MITIGATION] block
      const mitigationRegex = /\[MITIGATION\]([\s\S]*?)\[\/MITIGATION\]/;
      const match = aiText.match(mitigationRegex);
      
      let proposedMitigation: ProposedMitigation | undefined;
      let cleanedText = aiText;

      if (match && match[1]) {
        try {
          proposedMitigation = JSON.parse(match[1].trim());
          cleanedText = aiText.replace(mitigationRegex, '').trim();
        } catch (jsonErr) {
          console.error('Error parsing mitigation JSON block:', jsonErr);
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: cleanedText,
                isStreaming: false,
                proposedMitigation: proposedMitigation ? {
                  choice: proposedMitigation.choice,
                  mitigation: proposedMitigation.mitigation
                } : undefined
              }
            : msg
        )
      );

    } catch (err) {
      console.error('Error sending custom message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: 'I apologize, I had trouble connecting to my physiological core. Please check your Anthropic API connection in your environment.'
        }
      ]);
    } finally {
      setIsAiResponding(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080B15]">
      
      {/* Dynamic Header */}
      <div className="p-4 border-b border-white/5 bg-[#0F1221]/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Brain className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-bold text-sm block">Habit Negotiator</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Claude Haiku 3.5 Core
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            isStreaming={msg.isStreaming}
            options={msg.options}
            proposedMitigation={msg.proposedMitigation}
            onSelectOption={handleSelectOption}
            onAcceptMitigation={
              msg.proposedMitigation
                ? () => handleAcceptMitigation(msg.proposedMitigation!, msg.id)
                : undefined
            }
            onRejectMitigation={() => handleRejectMitigation(msg.id)}
          />
        ))}

        {isAiResponding && (
          <div className="flex items-center gap-2 text-xs text-[#64748B] p-2 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Co-designer is writing strategy...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Form Footer */}
      <form onSubmit={handleCustomSend} className="p-4 border-t border-white/5 bg-[#0F1221]/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a constraint (e.g. 'I fly every 2 weeks')"
            className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-4 py-3 text-sm text-white placeholder-[#64748B] transition-all"
            disabled={isAiResponding}
          />
          <button
            type="submit"
            className="btn bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-xl px-4 flex items-center justify-center transition-all disabled:opacity-50"
            disabled={isAiResponding || !inputVal.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
}
