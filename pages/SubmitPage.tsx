import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, writeBatch, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { NeoButton, NeoCard, NeoInput, NeoTextarea } from '../components/NeoUI';
import { Sparkles, AlertCircle, LogIn, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmitPage: React.FC = () => {
  const { userProfile, loading, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prompt: '',
    link: '',
    authorPhotoURL: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;
  
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <NeoCard className="max-w-md w-full bg-white text-center p-8">
            <div className="flex justify-center mb-6">
                <div className="bg-gdg-red p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-full">
                     <Lock className="w-8 h-8 text-white" />
                </div>
            </div>
            <h2 className="text-3xl font-black mb-2 uppercase">Login Required</h2>
            <p className="text-gray-600 font-bold mb-8">You need to sign in to submit your vibe check.</p>
            <NeoButton onClick={login} variant="primary" size="lg" className="w-full">
                <LogIn className="w-5 h-5 mr-2" />
                Login with Google
            </NeoButton>
        </NeoCard>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.description || !formData.prompt || !formData.link || !formData.authorPhotoURL) {
      setError('All fields are required!');
      return;
    }

    if (!validateUrl(formData.link)) {
        setError('Please enter a valid Project URL (include http:// or https://)');
        return;
    }

    if (!validateUrl(formData.authorPhotoURL)) {
        setError('Please enter a valid Thumbnail URL (include http:// or https://)');
        return;
    }

    setSubmitting(true);

    try {
      const submissionRef = doc(db, 'submissions', userProfile.uid);
      
      // Check if there's an existing submission with voters
      const existingDoc = await getDoc(submissionRef);
      const oldVoters: string[] = existingDoc.exists() ? (existingDoc.data()?.voters || []) : [];

      // Use batch to update submission and clean up old voters' history
      const batch = writeBatch(db);

      // Set the new/updated submission
      batch.set(submissionRef, {
        title: formData.title,
        description: formData.description,
        prompt: formData.prompt,
        link: formData.link,
        authorId: userProfile.uid,
        authorName: userProfile.displayName || 'Anonymous',
        authorPhotoURL: formData.authorPhotoURL,
        voteCount: 0,
        voters: [],
        createdAt: serverTimestamp(),
      });

      // Remove this submission ID from all old voters' votedSubmissionIds
      for (const odVoterId of oldVoters) {
        const voterRef = doc(db, 'users', odVoterId);
        batch.update(voterRef, {
          votedSubmissionIds: arrayRemove(userProfile.uid)
        });
      }

      await batch.commit();

      setSuccess(true);
      setTimeout(() => {
        navigate('/vote');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                className="mb-8"
            >
                <Sparkles className="w-24 h-24 text-gdg-yellow" />
            </motion.div>
            <h2 className="text-4xl font-black mb-4 text-center">SUBMISSION RECEIVED!</h2>
            <p className="text-xl font-bold text-gray-500 mb-8">Get ready to vibe...</p>
            <div className="w-full max-w-md bg-black h-4 rounded-full overflow-hidden border-2 border-black">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-gdg-green"
                />
            </div>
            <p className="mt-2 text-sm font-bold">Redirecting to gallery...</p>
        </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gdg-blue text-white inline-block px-4 py-2 border-4 border-black shadow-neo-lg transform -rotate-1">
          SUBMIT PROJECT
        </h1>
        <p className="text-lg font-bold mt-4">Show us what you built with Gemini.</p>
      </div>

      <NeoCard className="relative bg-white">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-gdg-red/20 border-2 border-gdg-red text-gdg-red p-3 mb-6 font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
          )}

          <NeoInput 
            label="Project Title"
            name="title"
            placeholder="e.g. Vibe Generator 3000"
            value={formData.title}
            onChange={handleChange}
          />

          <NeoTextarea 
            label="Description"
            name="description"
            placeholder="What does it do? How does it vibe?"
            value={formData.description}
            onChange={handleChange}
          />

          <NeoTextarea 
            label="The Vibe Prompt"
            name="prompt"
            placeholder="Share the prompt you used..."
            value={formData.prompt}
            onChange={handleChange}
            className="font-mono text-sm bg-yellow-50"
          />

          <NeoInput 
            label="Project Link (AI Studio / Web)"
            name="link"
            placeholder="https://..."
            value={formData.link}
            onChange={handleChange}
          />

          <div className="mb-4">
            <NeoInput 
              label="AI generated thumbnail image about your project"
              name="authorPhotoURL"
              placeholder="https://i.ibb.co/..."
              value={formData.authorPhotoURL}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Tip: You can upload images for free at <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-gdg-blue underline font-bold">imgbb.com</a>. After uploading, select "HTML full linked" and copy the URL inside the <code className="bg-gray-100 px-1">src="..."</code> attribute.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <NeoButton 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto"
                isLoading={submitting}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Launch It
            </NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  );
};

export default SubmitPage;