import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const fetchGeminiAI = async (query, imageBlob) => {
  // Call backend proxy for Gemini AI
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await response.json();
  const answer = data?.answer || 'No answer found.';
  // For demo, use a placeholder image
  const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : 'https://source.unsplash.com/400x200/?farm,agriculture';
  return { answer, imageUrl };
};

const ExpertAdvice = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [imageBlob, setImageBlob] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query, imgBlob) => {
    setSearch(query);
    setImageBlob(imgBlob);
    setLoading(true);
    try {
      const res = await fetchGeminiAI(query, imgBlob);
      if (!res.answer || res.answer === 'No answer found.') {
        setResult({
          ...res,
          answer: 'Sorry, no answer was found. Please rephrase your question or try again.'
        });
      } else {
        setResult(res);
      }
    } catch (err) {
      setResult({
        answer: 'Error connecting to Gemini AI. Please check your API key and try again.',
        imageUrl: imgBlob ? URL.createObjectURL(imgBlob) : ''
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in" style={{background: 'radial-gradient(circle at 60% 40%, #e0ffe0 0%, #e0f7fa 60%, #fffbe6 100%)'}}>
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg border border-green-200 animate-pop-in mt-16 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 px-4 py-2 rounded-lg font-bold border bg-green-200 hover:bg-green-300 text-green-800 shadow-lg transition-all duration-300 animate-slide-in"
        >
          Back
        </button>
        <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in mb-8 text-center">Expert Advice (Gemini AI)</h2>
        <SearchBar
          placeholder="Ask any farming question..."
          onSearch={handleSearch}
          enableMic={true}
          enableCamera={true}
          enableStorage={true}
          className="mb-8"
        />
        {loading && <div className="text-center text-lg text-blue-600 animate-fade-in">Loading answer...</div>}
        {result && (
          <div className="flex flex-col items-center gap-6 animate-pop-in mt-8">
            {result.imageUrl && (
              <img src={result.imageUrl} alt="Gemini AI result" className="rounded-xl shadow-lg w-full max-w-md border border-green-200 animate-fade-in" />
            )}
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 rounded-xl p-6 shadow-xl border border-green-200 animate-pop-in w-full max-w-md">
              <h3 className="text-2xl font-extrabold text-green-700 mb-2">Gemini AI Answer</h3>
              <p className="text-gray-900 text-lg font-medium">{result.answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertAdvice;
