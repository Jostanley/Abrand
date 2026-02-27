import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

 function ContentPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Check auth & fetch content
  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (!user || error) {
        alert("something wrong")
        navigate("/login");
        return;
      }

      setUser(user);

      const { data, error: contentError } = await supabase
        .from("contents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!contentError) {
        setContents(data);
      }

      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">My Content</h1>
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Content List */}
      {contents.length === 0 ? (
        <p className="text-gray-400">No content yet.</p>
      ) : (
        <div className="space-y-4">
          {contents.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4"
            >
              <p className="text-sm text-gray-400">
                {new Date(item.created_at).toLocaleString()}
              </p>

              <h2 className="font-semibold mt-2">Idea</h2>
              <p className="text-gray-300">{item.idea}</p>

              <h2 className="font-semibold mt-2">Output</h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {item.output}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ContentPage