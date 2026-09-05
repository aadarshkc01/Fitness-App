const API_URL = import.meta.env.VITE_API_URL;

export interface LogPayload {
  planSessionId: string;
  actualSets: number;
  actualReps: number;
  actualWeight: number;
  actualRpe: number;
}

export async function logSession(token: string, payload: LogPayload) {
  const res = await fetch(`${API_URL}/session-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to log session');
  return result.data;
}
