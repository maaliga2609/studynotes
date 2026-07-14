"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase, Note, SUBJECTS, SUBJECT_META } from "@/lib/supabase";
import { NoteCard } from "@/components/NoteCard";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotes((data as Note[]) ?? []);
        setLoading(false);
      });
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { biology: 0, chemistry: 0, physics: 0 };
    notes.forEach((n) => (c[n.subject] = (c[n.subject] ?? 0) + 1));
    return c;
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes.slice(0, 6);
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.description ?? "").toLowerCase().includes(q) ||
        (n.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [notes, query]);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Biology · Chemistry · Physics</p>
          <h1>
            A shared library of <em>science notes</em>, ready when you are.
          </h1>
          <p>
            Browse and download study notes by subject and topic. New notes are
            added regularly — search below or pick a subject to start.
          </p>
          <div className="search">
            <input
              type="search"
              placeholder="Search notes by title, topic, or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search notes"
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="section-head">
          <h2>Subjects</h2>
          <span>{notes.length} notes in the library</span>
        </div>
        <div className="subjects">
          {SUBJECTS.map((s) => {
            const m = SUBJECT_META[s];
            return (
              <Link key={s} href={`/subject/${s}`} className="subject-card">
                <span
                  className="subject-badge"
                  style={{ background: m.accent }}
                />
                <h3>{m.label}</h3>
                <p>{m.blurb}</p>
                <div className="subject-count" style={{ color: m.accent }}>
                  {counts[s]} note{counts[s] === 1 ? "" : "s"} →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="section-head">
          <h2>{query ? "Search results" : "Recently added"}</h2>
          <span>{filtered.length} shown</span>
        </div>

        {loading ? (
          <div className="empty">Loading notes…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            {query
              ? "No notes match that search yet."
              : "No notes uploaded yet — check back soon."}
          </div>
        ) : (
          <div className="notes-grid">
            {filtered.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
