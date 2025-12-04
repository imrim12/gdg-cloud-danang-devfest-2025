import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Submission } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { NeoCard, NeoButton, NeoBadge } from '../components/NeoUI';
import { ExternalLink, Heart, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const VotePage: React.FC = () => {
  const { userProfile, login } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
      setSubmissions(subs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (submission: Submission) => {
    if (!userProfile) {
        login();
        return;
    }
    
    // Cannot vote for your own submission
    if (submission.authorId === userProfile.uid) {
        setError("You cannot vote for your own submission!");
        setTimeout(() => setError(null), 3000);
        return;
    }

    setVotingId(submission.id);
    const subRef = doc(db, 'submissions', submission.id);
    const hasVoted = submission.voters?.includes(userProfile.uid);

    try {
      if (hasVoted) {
        // Unvote: remove user from voters and decrement voteCount
        await updateDoc(subRef, {
          voteCount: increment(-1),
          voters: arrayRemove(userProfile.uid)
        });
      } else {
        // Vote: add user to voters and increment voteCount
        await updateDoc(subRef, {
          voteCount: increment(1),
          voters: arrayUnion(userProfile.uid)
        });
      }
    } catch (err) {
      console.error("Vote failed", err);
      setError("Vote failed. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setVotingId(null);
    }
  };

  const hasVotedFor = (submission: Submission) => submission.voters?.includes(userProfile?.uid || '');

  if (loading) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-64 bg-gray-100 border-2 border-gray-200 animate-pulse"></div>
              ))}
          </div>
      )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Gallery
        </h1>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gdg-red text-white font-bold px-4 py-2 border-2 border-black shadow-neo flex items-center gap-2"
            >
                <AlertTriangle className="w-5 h-5" />
                {error}
            </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {submissions.map((sub) => (
          <NeoCard key={sub.id} className="flex flex-col h-full hover:border-gdg-blue transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
                <NeoBadge color="yellow">Votes: {sub.voteCount}</NeoBadge>
                {hasVotedFor(sub) && <NeoBadge color="green">Voted</NeoBadge>}
            </div>
            
            <h3 className="text-2xl font-black mb-2 leading-tight">{sub.title}</h3>
            <p className="text-sm font-bold text-gray-500 mb-4">by {sub.authorName}</p>
            
            <p className="mb-4 text-gray-700 flex-grow line-clamp-3">{sub.description}</p>
            
            <div className="bg-gray-50 p-3 border-2 border-gray-200 mb-6 text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="font-bold text-gray-400 select-none">$ </span>{sub.prompt}
            </div>

            <div className="flex gap-3 mt-auto">
                <a 
                    href={sub.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                >
                    <NeoButton variant="secondary" className="w-full text-sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                    </NeoButton>
                </a>
                <NeoButton 
                    variant={hasVotedFor(sub) ? 'secondary' : 'primary'}
                    className={`flex-1 ${sub.authorId === userProfile?.uid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleVote(sub)}
                    disabled={sub.authorId === userProfile?.uid}
                    isLoading={votingId === sub.id}
                >
                    <Heart className={`w-4 h-4 mr-2 ${hasVotedFor(sub) ? 'fill-black' : ''}`} />
                    {hasVotedFor(sub) ? 'Unvote' : 'Vote'}
                </NeoButton>
            </div>
          </NeoCard>
        ))}
        {submissions.length === 0 && (
            <div className="col-span-full text-center py-20 opacity-50">
                <h2 className="text-3xl font-black">NO SUBMISSIONS YET</h2>
                <p>Be the first to vibe.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;