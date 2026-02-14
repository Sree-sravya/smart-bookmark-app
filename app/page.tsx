"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  if (loading) return <div style={{ padding: 50 }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Smart Bookmark</h1>
        <button style={styles.button} onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#4f46e5",
  },
  card: {
    background: "white",
    padding: 40,
    borderRadius: 10,
  },
  button: {
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
