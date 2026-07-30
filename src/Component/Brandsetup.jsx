import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const TONE_OPTIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'playful', label: 'Playful' },
  { value: 'inspiring', label: 'Inspiring' },
];

const BrandSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    niche: '',
    tone: 'casual',
    beliefs: ['', '', ''],
    bannedWords: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBrandProfile();
  }, []);

  const loadBrandProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('brandProfiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          niche: data.niche || '',
          tone: data.tone || 'casual',
          beliefs: data.core_beliefs?.length ? data.core_beliefs : ['', '', ''],
          bannedWords: Array.isArray(data.banned_words)
            ? data.banned_words.join(', ')
            : data.banned_words || '',
        });
      }
    } catch (err) {
      console.error('Error loading brand profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBeliefChange = (index, value) => {
    const newBeliefs = [...formData.beliefs];
    newBeliefs[index] = value;
    setFormData(prev => ({ ...prev, beliefs: newBeliefs }));
  };

  const addBeliefField = () => {
    if (formData.beliefs.length < 10) {
      setFormData(prev => ({ ...prev, beliefs: [...prev.beliefs, ''] }));
    }
  };

  const removeBeliefField = (index) => {
    if (formData.beliefs.length > 1) {
      setFormData(prev => ({ ...prev, beliefs: prev.beliefs.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to save');

      if (!formData.niche.trim()) throw new Error('Niche is required');

      const filteredBeliefs = formData.beliefs.map(b => b.trim()).filter(b => b !== '');
      if (filteredBeliefs.length === 0) throw new Error('At least one core belief is required');

      const bannedWordsArray = formData.bannedWords
        .split(',')
        .map(w => w.trim().toLowerCase())
        .filter(w => w !== '');

      const { error } = await supabase
        .from('brandProfiles')
        .upsert({
          user_id: user.id,
          niche: formData.niche.trim(),
          tone: formData.tone,
          core_beliefs: filteredBeliefs,
          banned_words: bannedWordsArray,
          updated_at: new Date().toISOString(),
          version: 1,
        }, { onConflict: ['user_id'] });

      if (error) throw error;

      setSuccess('Brand profile saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save brand profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-indigo-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-zinc-400 text-sm">Loading your brand profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/createContent')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white"/>
            </svg>
          </div>
          <span className="font-semibold text-sm">Abrand AI</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Brand Setup</h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Define your brand identity so AI can generate perfectly consistent content.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Niche */}
          <div className="card">
            <label htmlFor="niche" className="block text-sm font-medium mb-1">
              Niche <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">Who you serve and what you offer in one sentence</p>
            <input
              type="text"
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleInputChange}
              placeholder="e.g., sustainable drinkware for outdoor enthusiasts"
              className="input-field"
            />
          </div>

          {/* Tone */}
          <div className="card">
            <label htmlFor="tone" className="block text-sm font-medium mb-1">
              Brand Tone <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">The voice and personality of your brand</p>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tone: option.value }))}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    formData.tone === option.value
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                      : 'bg-transparent border-[#27272a] text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Beliefs */}
          <div className="card">
            <label className="block text-sm font-medium mb-1">
              Core Beliefs <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-4">What does your brand stand for? Add 2–5 beliefs.</p>
            <div className="space-y-3">
              {formData.beliefs.map((belief, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={belief}
                    onChange={(e) => handleBeliefChange(index, e.target.value)}
                    placeholder={`Belief ${index + 1}`}
                    className="input-field flex-1"
                  />
                  {formData.beliefs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBeliefField(index)}
                      className="w-10 h-10 mt-0.5 flex items-center justify-center bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {formData.beliefs.length < 10 && (
              <button
                type="button"
                onClick={addBeliefField}
                className="mt-3 flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add another belief
              </button>
            )}
          </div>

          {/* Banned Words */}
          <div className="card">
            <label htmlFor="bannedWords" className="block text-sm font-medium mb-1">
              Banned Words{" "}
              <span className="text-zinc-500 text-xs font-normal">(optional)</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">Comma-separated words to avoid in generated content</p>
            <input
              type="text"
              id="bannedWords"
              name="bannedWords"
              value={formData.bannedWords}
              onChange={handleInputChange}
              placeholder="e.g., cheap, revolutionary, game-changer"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-3 text-base"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving...
              </span>
            ) : "Save Brand Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandSetup;
