import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout';
import SubmitPage from './pages/SubmitPage';
import VotePage from './pages/VotePage';
import LeaderboardPage from './pages/LeaderboardPage';
import { NeoButton } from './components/NeoUI';
import { Code } from 'lucide-react';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            <div className="relative">
                <div className="absolute inset-0 bg-gdg-yellow blur-xl opacity-50 rounded-full animate-pulse"></div>
                <Code className="w-32 h-32 relative z-10 text-black" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                VIBE<br/>
                <span className="text-white bg-gdg-blue px-4 shadow-[8px_8px_0px_0px_#000]">CODING</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-bold max-w-2xl text-gray-800">
                GDG Cloud Da Nang Devfest 2025
            </p>
            
            <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] max-w-lg mx-auto transform rotate-1">
                <p className="font-mono text-sm md:text-base font-bold">
                    Build something cool with <span className="text-gdg-blue">Gemini</span>.
                    <br/>Share the prompt.
                    <br/>Win the vibe check.
                </p>
            </div>

            <div className="flex gap-4">
                <Link to="/vote">
                    <NeoButton size="lg" variant="primary">View Gallery</NeoButton>
                </Link>
                <Link to="/submit">
                    <NeoButton size="lg" variant="accent">Submit Project</NeoButton>
                </Link>
            </div>
        </div>
    )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path="submit" element={<SubmitPage />} />
            <Route path="vote" element={<VotePage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;