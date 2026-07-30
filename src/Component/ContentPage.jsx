import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ContentPage() {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user || error) {
        navigate("/login");
        return;
      }

      const { data, error: contentError } = await supabase
        .from("contents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!contentError) setContents(data || []);
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[#27272a]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/createContent')}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#27272a] hover:bg-[#18181b] transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="text-base font-semibold">My Content</h1>
          </div>
          <span className="text-xs text-zinc-500">{contents.length} item{contents.length !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {contents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-[#18181b] border border-[#27272a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-1">No content yet</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Generate your first piece of on-brand content.
            </p>
            <button onClick={() => navigate('/createContent')} className="btn-primary px-6 py-2.5">
              Create content
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                    <p className="text-sm font-medium text-zinc-300">{item.idea}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.output, item.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      copied === item.id
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white'
                    }`}
                  >
                    {copied === item.id ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#09090b] rounded-lg p-4 border border-[#27272a]">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{item.output}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ContentPage;
