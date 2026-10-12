import type { SessionConfig, Round, Report, SessionSummary } from '../types';

const API_BASE = 'http://localhost:3001/api';

export const saveSession = async (session: SessionConfig, rounds: Round[], report: Report): Promise<{ sessionId: number }> => {
  const res = await fetch(`${API_BASE}/sessions/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session, rounds, report })
  });
  if (!res.ok) throw new Error('Failed to save session');
  return res.json();
};

export const getSessions = async (): Promise<SessionSummary[]> => {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
};

export const getSession = async (id: number): Promise<any> => {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
};

export const saveRecognition = async (id: number, answer: 'yes' | 'no'): Promise<void> => {
  const res = await fetch(`${API_BASE}/sessions/${id}/recognition`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer })
  });
  if (!res.ok) throw new Error('Failed to save recognition');
};

export const deleteSession = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/sessions/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete session');
};
