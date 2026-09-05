import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Coach() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi — I'm your training coach. Ask me about form, exercise substitutions, or how you're progressing." },
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
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Coach chat is still being connected — check back soon.' }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell title="Coach Chat" subtitle="Grounded in your plan and training principles — RAG/AI backend not yet live.">
      <div className="chat-shell card">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>
          ))}
          {sending && <div className="chat-bubble assistant">Thinking…</div>}
        </div>
        <div className="chat-input-row">
          <input
            className="input"
            placeholder="Ask about form, substitutions, or your progress…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={sending}>Send</button>
        </div>
      </div>
    </AppShell>
  );
}
