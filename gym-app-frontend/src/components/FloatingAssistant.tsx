import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '../context/AuthContext';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function FloatingAssistant() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! Ask me about form, substitutions, or your progress.' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!input.trim() || !token) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/coach/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const result = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: result.data?.reply || result.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm still being connected to real coaching data — check back soon." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" className="fixed bottom-7 right-7 h-14 w-14 rounded-full shadow-lg z-50">
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 p-0 mr-7 mb-2">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Coach Assistant</p>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {m.content}
            </div>
          ))}
          {sending && <div className="bg-muted rounded-lg px-3 py-2 text-sm w-fit">Thinking…</div>}
        </div>
        <div className="flex gap-2 border-t p-3">
          <Input
            placeholder="Ask something…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button size="icon" onClick={handleSend} disabled={sending}><Send className="h-4 w-4" /></Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
