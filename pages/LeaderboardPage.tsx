import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Submission } from '../types';
import { NeoCard } from '../components/NeoUI';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const [leaders, setLeaders] = useState<Submission[]>([]);

  useEffect(() => {
    // Get top 50
    const q = query(collection(db, 'submissions'), orderBy('voteCount', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
      setLeaders(subs);
    });
    return () => unsubscribe();
  }, []);

  const getRankStyle = (index: number) => {
      if (index === 0) return "border-gdg-yellow bg-gdg-yellow/10 scale-105 z-10";
      if (index === 1) return "border-gray-400 bg-gray-100";
      if (index === 2) return "border-orange-400 bg-orange-50";
      return "border-black bg-white";
  }

  const getIcon = (index: number) => {
      if (index === 0) return <Crown className="w-6 h-6 text-gdg-yellow fill-black" />;
      if (index === 1) return <Medal className="w-6 h-6 text-gray-500" />;
      if (index === 2) return <Medal className="w-6 h-6 text-orange-600" />;
      return <span className="font-black text-xl w-6 text-center text-gray-300">#</span>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black uppercase text-stroke-sm text-transparent bg-clip-text bg-gradient-to-r from-gdg-blue via-gdg-red to-gdg-yellow animate-gradient-x mb-2" style={{ WebkitTextStroke: '2px black' }}>
            Leaderboard
        </h1>
        <p className="text-xl font-bold bg-black text-white inline-block px-4 py-1 transform -rotate-2">
            Who has the best vibe?
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
            {leaders.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className={`
                        relative flex items-center gap-4 p-4 border-b-4 border-r-4 border-l-2 border-t-2 
                        ${getRankStyle(index)} transition-all
                    `}>
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
                            {index < 3 ? getIcon(index) : <span className="font-black text-xl">{index + 1}</span>}
                        </div>

                        <div className="flex-grow min-w-0">
                            <h3 className="text-xl font-black truncate">{sub.title}</h3>
                            <p className="text-sm font-bold text-gray-500 truncate">by {sub.authorName}</p>
                        </div>

                        <div className="flex-shrink-0 text-right">
                            <div className="text-2xl font-black text-gdg-blue">
                                {sub.voteCount}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wide">Votes</div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>

        {leaders.length === 0 && (
             <NeoCard className="text-center py-10 opacity-50">
                <p className="font-bold text-xl">Waiting for votes to roll in...</p>
             </NeoCard>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;