import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BrandSetup = () => {
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

/**

Load existing brand profile from Supabase
*/

const loadBrandProfile = async () => {
  setLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to access this page');
      return;
    }

    const { data, error } = await supabase
      .from('brandProfiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      alert("No brand profile found");
    } else {
      setFormData({
        niche: data.niche || '',
        tone: data.tone || 'casual',
        beliefs: data.core_beliefs || ['', '', ''],
        bannedWords: data.banned_words || '',
      });

      // ✅ Correct place to alert
    
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
const newBeliefs = formData.beliefs.filter((_, i) => i !== index);
setFormData(prev => ({ ...prev, beliefs: newBeliefs }));
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
    .map(word => word.trim().toLowerCase())  
    .filter(word => word !== '');  

  const brandProfile = {  
    user_id: user.id,  
    niche: formData.niche.trim(),  
    tone: formData.tone ,  
    core_beliefs: filteredBeliefs,  
    banned_words: bannedWordsArray,  
    updated_at: new Date().toISOString(),  
    version: 1  
  };  

  // Save to Supabase (upsert for create/update)  
  const { error } = await supabase  
    .from('brandProfiles')  
    .upsert(brandProfile, { onConflict: ['user_id'] });  

  if (error) throw error;  

  setSuccess('Brand profile saved successfully! ✓');  
  setTimeout(() => setSuccess(''), 3000);  

  // Optionally update localStorage for instant UI  

} catch (err) {  
  console.error('Error saving brand profile:', err);  
  setError(err.message || 'Failed to save brand profile. Please try again.');  
} finally {  
  setSaving(false);  
}

};

if (loading) {
return (
<div className="min-h-screen bg-[#0f0f0f]  flex items-center justify-center">
<div className="text-center">
<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
<p className="text-white text-lg">Loading your brand profile...</p>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-[#0f0f0f]  py-8 px-4 sm:px-6 lg:px-8">
<div className="max-w-2xl mx-auto">
<div className="bg-[#0f0f0f]  rounded-lg shadow-md p-8">

<div className="mb-8">  
        <h1 className="text-3xl font-bold text-white mb-2">Brand Setup</h1>  
        <p className="text-white">Define your brand identity so AI can generate consistent content</p>  
      </div>  

      {error && (  
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">  
          <p className="text-sm text-red-700">{error}</p>  
        </div>  
      )}  

      {success && (  
        <div className="mb-6 bg-[#0f0f0f]  border-l-4 border-green-500 p-4 rounded">  
          <p className="text-sm text-green-700">{success}</p>  
        </div>  
      )}  

      <form onSubmit={handleSubmit} className="space-y-6">  

        <div>  
          <label htmlFor="niche" className="block text-sm font-medium text-white mb-2">  
            Niche <span className="text-red-500">*</span>  
          </label>  
          <input  
            type="text"  
            id="niche"  
            name="niche"  
            value={formData.niche}  
            onChange={handleInputChange}  
            placeholder="e.g., sustainable drinkware for outdoor enthusiasts"  
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white text-white outline-none transition"  
          />  
          <p className="mt-2 text-sm text-white">Who you serve and what you offer in one sentence</p>  
        </div>  

        <div>  
          <label htmlFor="tone" className="block text-sm font-medium text-white mb-2">  
            Brand Tone <span className="text-red-500">*</span>  
          </label>  
          <select  
            id="tone"  
            name="tone"  
            value={formData.tone}  
            onChange={handleInputChange}  
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white text-white outline-none transition bg-[#0f0f0f] "  
          >  
            <option value="casual">Casual</option>  
            <option value="professional">Professional</option>  
            <option value="friendly">Friendly</option>  
            <option value="authoritative">Authoritative</option>  
            <option value="playful">Playful</option>  
            <option value="inspiring">Inspiring</option>  
          </select>  
        </div>  

        <div>  
          <label className="block text-sm font-medium text-white mb-2">  
            Core Beliefs <span className="text-red-500">*</span>  
          </label>  
          <p className="text-sm text-white mb-3">What does your brand stand for? Add 2-5 beliefs.</p>  

          <div className="space-y-3">  
            {formData.beliefs.map((belief, index) => (  
              <div key={index} className="flex gap-2">  
                <input  
                  type="text"  
                  value={belief}  
                  onChange={(e) => handleBeliefChange(index, e.target.value)}  
                  placeholder={`Belief ${index + 1}`}  
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white text-white outline-none transition"  
                />  
                {formData.beliefs.length > 1 && (  
                  <button  
                    type="button"  
                    onClick={() => removeBeliefField(index)}  
                    className="px-4 py-3 bg-[#0f0f0f]  text-red-600 rounded-lg hover:bg-red-100 transition font-medium"  
                  >  
                    ✕  
                  </button>  
                )}  
              </div>  
            ))}  
          </div>  

          {formData.beliefs.length < 10 && (  
            <button  
              type="button"  
              onClick={addBeliefField}  
              className="mt-3 px-4 py-2  bg-[#0f0f0f] text-white rounded-lg hover:bg-gray-200 transition text-sm font-medium"  
            >  
              + Add Another Belief  
            </button>  
          )}  
        </div>  

        <div>  
          <label htmlFor="bannedWords" className="block text-sm font-medium text-white mb-2">  
            Banned Words <span className="text-gray-400 text-xs font-normal">(optional)</span>  
          </label>  
          <input  
            type="text"  
            id="bannedWords"  
            name="bannedWords"  
            value={formData.bannedWords}  
            onChange={handleInputChange}  
            placeholder="e.g., cheap, revolutionary, game-changer"  
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white text-white outline-none transition"  
          />  
          <p className="mt-2 text-sm text-white">Comma-separated words to avoid in generated content</p>  
        </div>  

        <div className="pt-4">  
          <button  
            type="submit"  
            disabled={saving}  
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${  
              saving  
                ? 'bg-blue-400 cursor-not-allowed'  
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'  
            }`}  
          >  
            {saving ? 'Saving...' : 'Save Brand Profile'}  
          </button>  
        </div>  

      </form>  
    </div>  
  </div>  
</div>

);
};

export default BrandSetup;
