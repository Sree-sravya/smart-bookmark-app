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
      
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.welcomeText}>
          Welcome {user.email}
        </h2>

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Form */}
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

      {/* Bookmarks */}
      <div style={styles.grid}>
        {bookmarks.map((b) => (
          <div key={b.id} style={styles.card}>
            <h4 style={styles.title}>{b.title}</h4>

            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {b.url}
            </a>

            <div style={styles.deleteContainer}>
              <button
                style={styles.delete}
                onClick={() => deleteBookmark(b.id)}
              >
                Delete
              </button>
            </div>
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
    flexDirection: "column",
    gap: 12,
    marginBottom: 30,
  },

  welcomeText: {
    color: "#000",
    fontWeight: 700,
    wordBreak: "break-all",
  },

  logout: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: 6,
    cursor: "pointer",
    width: "100%",
    fontWeight: 600,
  },

  form: {
    display: "flex",
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: "100%",
    maxWidth: 250,
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
    color: "#000",
  },

  title: {
    color: "#000",
    fontWeight: 700,
    marginBottom: 6,
  },

  link: {
    color: "#1d4ed8",
    wordBreak: "break-all",
  },

  deleteContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 12,
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};
