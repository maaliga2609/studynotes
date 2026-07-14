"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { supabase, Note, SUBJECT_META, SUBJECTS } from "@/lib/supabase";
import { NoteCard } from "@/components/NoteCard";

export default function SubjectPage() {
  const params = useParams();
  const subject = String(params.subject);
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "popular">("new");
  const [loading, setLoading] = useState(true);

  const valid = (SUBJECTS as readonly string[]).includes(subject);

  useEffect(() => {
    if (!valid) return;
    supabase
      .from("notes")
      .select("*")
      .eq("subject", subject)
      .then(({ data }) => {
        setNotes((data as Note[]) ?? []);
        setLoading(false);
      });
  }, [subject, valid]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = notes.filter(
      (n) =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        (n.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
    out = out.sort((a, b) =>
      sort === "popular"
        ? b.downloads - a.downloads
        : +new Date(b.created_at) - +new Date(a.created_at)
    );
    return out;
  }, [notes, query, sort]);

  if (!valid) return notFound();
  const m = SUBJECT_META[subject];

  return (
    <main className="container">
      <div style={{ padding: "40px 0 8px" }}>
        <Link href="/" className="back-link">
          ← All subjects
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
          <span
            className="subject-badge"
            style={{ background: m.accent, marginBottom: 0 }}
          />
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 34 }}>{m.label}</h1>
            <p style={{ color: "var(--ink-soft)" }}>{m.blurb}</p>
          </div>
        </div>
      </div>

      <div
        className="search"
        style={{ maxWidth: "100%", marginTop: 24, marginBottom: 24 }}
      >
        <input
          type="search"
          placeholder={`Search ${m.label.toLowerCase()} notes…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "new" | "popular")}
          style={{
            padding: "0 14px",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            background: "var(--paper-raised)",
            fontFamily: "var(--sans)",
          }}
        >
          <option value="new">Newest first</option>
          <option value="popular">Most downloaded</option>
        </select>
      </div>

      {loading ? (
        <div className="empty">Loading…</div>
      ) : list.length === 0 ? (
        <div className="empty">No {m.label.toLowerCase()} notes yet.</div>
      ) : (
        <div className="notes-grid">
          {list.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      )}
    </main>
  );
}
