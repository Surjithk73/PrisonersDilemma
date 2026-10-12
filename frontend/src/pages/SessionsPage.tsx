import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSessions, deleteSession } from '@/lib/api';
import type { SessionSummary } from '@/types';

export default function SessionsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // prevent row click
    if (window.confirm('Delete this session? This cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteSession(id);
        setSessions(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete session');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
    }).format(d);
  };

  const formatPct = (val: number | null) => val !== null ? `${(val * 100).toFixed(0)}%` : 'N/A';

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <p className="text-neutral-500 animate-pulse">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Past Sessions</h2>
          <p className="text-neutral-400 mt-1">Review behavioural reports and game logs.</p>
        </div>
        <Link 
          to="/"
          className="inline-flex justify-center px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
        >
          New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed border-neutral-800 bg-neutral-950/50 rounded-2xl">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-lg font-medium text-neutral-300">No sessions yet.</p>
          <p className="text-neutral-500">Start a game to see results here.</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-950/80 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Participant</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Opponent Strategy</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Rounds</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Coop Rate</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {sessions.map(session => (
                  <tr 
                    key={session.id} 
                    onClick={() => navigate(`/report/${session.id}`)}
                    className="hover:bg-neutral-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-200">{session.participantName}</div>
                      <div className="text-xs text-neutral-500">Age: {session.participantAge}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      <span className="bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm">
                        {session.strategyName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {session.roundCount}
                    </td>
                    <td className="px-6 py-4 text-neutral-300 font-medium">
                      {formatPct(session.cooperationRate)}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-xs">
                      {formatDate(session.completedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => handleDelete(e, session.id)}
                        disabled={deletingId === session.id}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                        title="Delete Session"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
