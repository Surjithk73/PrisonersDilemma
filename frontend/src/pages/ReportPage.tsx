import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import MetricCard from '@/components/MetricCard';
import { saveRecognition, getSession } from '@/lib/api';

export default function ReportPage() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState<any>(location.state);
  const [isLoading, setIsLoading] = useState(!location.state);
  const [error, setError] = useState<string | null>(null);
  const [savedRecognition, setSavedRecognition] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionData && sessionId && sessionId !== '0') {
      setIsLoading(true);
      getSession(Number(sessionId))
        .then(data => setSessionData(data))
        .catch(() => setError('Session not found'))
        .finally(() => setIsLoading(false));
    }
  }, [sessionId, sessionData]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        <Link to="/" className="text-blue-500 hover:underline">Return to Home</Link>
      </div>
    );
  }

  if (isLoading || !sessionData) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-neutral-500 animate-pulse">Loading report...</p>
      </div>
    );
  }

  const config = sessionData.config || sessionData.session || {};
  const rawReport = sessionData.report || {};
  const report = {
    cooperationRate: rawReport.cooperationRate ?? rawReport.cooperation_rate ?? null,
    conditionalCooperationRate: rawReport.conditionalCooperationRate ?? rawReport.conditional_cooperation_rate ?? null,
    retaliationIndex: rawReport.retaliationIndex ?? rawReport.retaliation_index ?? null,
    forgivenessIndex: rawReport.forgivenessIndex ?? rawReport.forgiveness_index ?? null,
    reciprocityCorrelation: rawReport.reciprocityCorrelation ?? rawReport.reciprocity_correlation ?? null,
    riskTakingTendency: rawReport.riskTakingTendency ?? rawReport.risk_taking_tendency ?? null,
    meanLatencyCMs: rawReport.meanLatencyCMs ?? rawReport.mean_latency_c_ms ?? null,
    sdLatencyCMs: rawReport.sdLatencyCMs ?? rawReport.sd_latency_c_ms ?? null,
    meanLatencyDMs: rawReport.meanLatencyDMs ?? rawReport.mean_latency_d_ms ?? null,
    sdLatencyDMs: rawReport.sdLatencyDMs ?? rawReport.sd_latency_d_ms ?? null,
    switchingRate: rawReport.switchingRate ?? rawReport.switching_rate ?? null,
  };

  // Formatters
  const formatPct = (val: number | null) => val !== null ? `${(val * 100).toFixed(1)}%` : 'N/A';
  const formatNum = (val: number | null) => val !== null ? val.toFixed(2) : 'N/A';

  const handleRecognition = async (answer: 'yes' | 'no') => {
    if (sessionId !== '0') {
      try {
        await saveRecognition(Number(sessionId), answer);
        setSavedRecognition(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSavedRecognition(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Analysis Report
          </span>
          <span className="text-neutral-500 text-sm">
            {sessionId !== '0' ? `Session #${sessionId}` : 'Local View (Unsaved)'}
          </span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white">Cognitive-Behavioural Profile</h2>
        <p className="text-lg text-neutral-400">
          Participant: <strong className="text-white">{config?.participantName || sessionData.session?.participantName}</strong> • 
          Opponent: <strong className="text-white">{config?.strategyName || sessionData.session?.strategyName}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Cooperation Rate" 
          value={formatPct(report.cooperationRate)} 
          description={report.cooperationRate > 0.5 ? "Predominantly cooperative play." : "Predominantly competitive play."} 
        />
        <MetricCard 
          title="Conditional Cooperation" 
          value={formatPct(report.conditionalCooperationRate)} 
          description="How often you cooperated immediately after your opponent cooperated." 
        />
        <MetricCard 
          title="Retaliation Index" 
          value={formatPct(report.retaliationIndex)} 
          description={report.retaliationIndex > 0.5 ? "Strong retaliatory pattern." : "Low tendency to punish defections."} 
        />
        <MetricCard 
          title="Forgiveness Index" 
          value={report.forgivenessIndex !== null ? `${formatNum(report.forgivenessIndex)} rounds` : 'N/A'} 
          description="Average rounds taken to return to cooperation after retaliating against a defection." 
        />
        <MetricCard 
          title="Reciprocity Correlation" 
          value={formatNum(report.reciprocityCorrelation)} 
          description="Pearson correlation between your play and your opponent's previous move." 
        />
        <MetricCard 
          title="Risk-Taking Tendency" 
          value={formatPct(report.riskTakingTendency)} 
          description={report.riskTakingTendency > 0.5 ? "Risk-tolerant — frequently cooperates despite exploitation." : "Cautious — rarely cooperates after being defected against."} 
        />
        <MetricCard 
          title="Response Latency (Coop)" 
          value={report.meanLatencyCMs !== null ? `${Math.round(report.meanLatencyCMs)} ms` : 'N/A'} 
          description="Average time taken to click Cooperate." 
        />
        <MetricCard 
          title="Response Latency (Defect)" 
          value={report.meanLatencyDMs !== null ? `${Math.round(report.meanLatencyDMs)} ms` : 'N/A'} 
          description="Average time taken to click Defect." 
        />
        <MetricCard 
          title="Switching Rate" 
          value={formatPct(report.switchingRate)} 
          description={report.switchingRate > 0.5 ? "Highly adaptive / reactive play." : "Highly consistent strategy."} 
        />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
        <h3 className="text-xl font-bold text-white">Strategy Recognition</h3>
        {savedRecognition || sessionData.session?.strategyIdentified ? (
          <div className="text-green-400 font-medium bg-green-400/10 py-3 rounded-lg border border-green-400/20">
            Response recorded. Thank you!
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-neutral-400">Were you able to identify the strategy you were playing against?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => handleRecognition('yes')}
                className="px-8 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
              >
                Yes
              </button>
              <button 
                onClick={() => handleRecognition('no')}
                className="px-8 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
              >
                No
              </button>
            </div>
            <div className="pt-2">
              <button onClick={() => setSavedRecognition(true)} className="text-sm text-neutral-500 hover:text-neutral-400 underline decoration-neutral-700 underline-offset-4">
                Skip question
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => navigate('/sessions')}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
        >
          View All Sessions
        </button>
      </div>
    </div>
  );
}
