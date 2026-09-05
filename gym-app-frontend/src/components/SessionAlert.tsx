import { useEffect, useState } from 'react';

/**
 * Listens for a global "session-replaced" browser event. The backend session-per-device
 * work (next pass) will dispatch this event whenever an API call returns the
 * SESSION_REPLACED error code — meaning this account logged in elsewhere on the
 * same device type and this session is no longer valid.
 *
 * Usage once wired: window.dispatchEvent(new CustomEvent('session-replaced', { detail: { deviceType: 'web' } }))
 */
export default function SessionAlert() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleReplaced(e: Event) {
      const detail = (e as CustomEvent).detail;
      setMessage(
        `You were logged out — this account was signed in from another ${detail?.deviceType || 'device'}.`
      );
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }, 3000);
    }
    window.addEventListener('session-replaced', handleReplaced);
    return () => window.removeEventListener('session-replaced', handleReplaced);
  }, []);

  if (!message) return null;

  return (
    <div className="session-alert">
      <span>⚠</span>
      <span>{message}</span>
    </div>
  );
}
