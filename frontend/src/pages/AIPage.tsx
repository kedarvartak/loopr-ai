import React, { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { Bot, User, Loader2, Send, Sparkles } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TransactionsMiniTable from '../components/TransactionsMiniTable';

interface IMessage {
  sender: 'user' | 'ai';
  content: {
    type: 'text' | 'data';
    data: any;
  };
}

const AIPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: IMessage = { 
      sender: 'user', 
      content: { type: 'text', data: { reply: input } } 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/ai/chat', { message: input });
      const aiMessage: IMessage = { sender: 'ai', content: data };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: IMessage = { 
        sender: 'ai', 
        content: { type: 'text', data: { reply: 'Sorry, I encountered an error processing your request. Please try again.' } }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMessageContent = (message: IMessage) => {
    if (message.content.type === 'data') {
      const { narrative, metrics, sample } = message.content.data;
      return (
        <div>
          <p className="mb-4">{narrative}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard label="Count" value={metrics.count} icon="count" />
            <MetricCard label="Total" value={`$${metrics.totalAmount.toFixed(2)}`} icon="total" />
            <MetricCard label="Average" value={`$${metrics.averageAmount.toFixed(2)}`} icon="average" />
          </div>
          <TransactionsMiniTable transactions={sample} />
        </div>
      );
    }
    // Default to rendering text content
    return message.content.data.reply;
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] bg-[var(--color-background)] text-[var(--color-text)]">
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-[var(--color-text-secondary)] mt-16">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold text-[var(--color-text)]">AI Financial Analyst</h1>
            <p className="mt-2">Ask me anything about your company's financial data.</p>
            <p className="text-xs mt-1">e.g., "What was our total revenue last month?"</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] flex-shrink-0">
                <Bot className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            )}
            <div className={`px-5 py-3 rounded-2xl max-w-2xl prose prose-sm dark:prose-invert prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0 ${msg.sender === 'user' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)]'}`}>
              {renderMessageContent(msg)}
            </div>
            {msg.sender === 'user' && (
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] flex-shrink-0">
                <User className="w-6 h-6 text-[var(--color-text)]" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] flex-shrink-0">
              <Bot className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div className="px-5 py-3 rounded-2xl bg-[var(--color-surface)] flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--color-text-secondary)]" />
            </div>
          </div>
        )}
      </main>
      <footer className="p-4 bg-[var(--color-background)]">
        <div>
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask the AI Analyst a question..."
              className="w-full p-4 pr-20 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-none min-h-[56px] custom-scrollbar"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--color-primary)] text-white disabled:bg-opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
           <p className="text-xs text-center text-gray-400 mt-2">
            Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Enter</kbd> to send, <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Shift + Enter</kbd> for a new line.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AIPage; 