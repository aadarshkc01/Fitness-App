const API_URL = import.meta.env.VITE_API_URL;

export async function generatePlan(token: string) {
  const res = await fetch(`${API_URL}/plans/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to generate plan');
  return result.data;
}

export async function getMyPlan(token: string) {
  const res = await fetch(`${API_URL}/plans/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch plan');
  const result = await res.json();
  return result.data;
}
