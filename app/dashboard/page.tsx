"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/");
      } else {
        setUser(data.session.user);
        fetchBookmarks(data.session.user.id);
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  const addBookmark = async () => {
    if (!title || !url) return alert("Fill both fields");

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setUrl("");
      fetchBookmarks(user.id);
    }
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div style={{ padding: 50 }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.welcomeText}>
  Welcome {user.email}
</h2>

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.form}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        <button style={styles.add} onClick={addBookmark}>
          Add
        </button>
      </div>

      <div style={styles.grid}>
        {bookmarks.map((b) => (
          <div key={b.id} style={styles.card}>
            <h4 style={{
  color: "#000",
  fontWeight: 700,
  marginBottom: 6
}}>
  {b.title}
</h4>
            <a
  href={b.url}
  target="_blank"
  style={{
    color: "#1d4ed8",   // darker blue
    wordBreak: "break-all"
  }}
>
  {b.url}
</a>

            <button
              style={styles.delete}
              onClick={() => deleteBookmark(b.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    padding: 40,
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 30,
  flexWrap: "wrap",
  gap: 10,
},

welcomeText: {
  wordBreak: "break-all",
  flex: 1,
  minWidth: 0,   // ⭐ important for flex overflow fix
},


  logout: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  form: {
    display: "flex",
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",                // ✅ stack inputs on mobile
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: "100%",                   // ✅ full width on mobile
    maxWidth: 250,                   // ✅ keeps desktop same
  },

  add: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 20,
  },

  card: {
  background: "white",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  color: "#000",              // ⭐ force black text inside card
},


  delete: {
    marginTop: 10,
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

