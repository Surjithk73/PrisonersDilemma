import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ReportPage from './pages/ReportPage';
import SessionsPage from './pages/SessionsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-blue-500/30">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-blue-500 transition-colors">
                IPD
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-100 group-hover:text-white transition-colors">
                Cognitive Lab
              </span>
            </Link>
            <nav>
              <Link 
                to="/sessions" 
                className="text-sm font-medium text-neutral-400 hover:text-white px-4 py-2 rounded-md hover:bg-neutral-900 transition-all"
              >
                Past Sessions
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full mx-auto relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/report/:sessionId" element={<ReportPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
