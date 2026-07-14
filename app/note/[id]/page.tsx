"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase, Note, SUBJECT_META, fileUrl } from "@/lib/supabase";

export default function NoteDetail() {
  const params = useParams();
  const id = String(params.id);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setNote((data as Note) ?? null);
        setLoading(false);
      });
  }, [id]);

  async function handleDownload() {
    if (!note) return;
    // increment counter (best-effort)
    await supabase
      .from("notes")
      .update({ downloads: note.downloads + 1 })
      .eq("id", note.id);
    setNote({ ...note, downloads: note.downloads + 1 });
    window.open(fileUrl(note.file_path), "_blank");
  }

  if (loading) return <div className="empty">Loading…</div>;
  if (!note)
    return (
      <div className="empty">
        Note not found. <Link href="/" className="back-link">Back home</Link>
      </div>
    );

  const m = SUBJECT_META[note.subject];
  const isPdf = note.file_name.toLowerCase().endsWith(".pdf");
  const url = fileUrl(note.file_path);

  return (
    <main className="container detail">
      <Link href={`/subject/${note.subject}`} className="back-link">
        ← Back to {m.label}
      </Link>

      <div className="detail-head" style={{ marginTop: 18 }}>
        <span className="tag" style={{ background: m.tint, color: m.accent }}>
          {m.label}
        </span>
        <h1>{note.title}</h1>
        {note.description && (
          <p style={{ color: "var(--ink-soft)", fontSize: 17 }}>
            {note.description}
          </p>
        )}
        <div className="detail-meta">
          <span>Added {new Date(note.created_at).toLocaleDateString()}</span>
          <span>{note.downloads} downloads</span>
          <span>{note.file_name}</span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button className="btn btn-green" onClick={handleDownload}>
            ↓ Download note
          </button>
          <a className="btn btn-ghost" href={url} target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
      </div>

      {isPdf ? (
        <div className="viewer">
          <iframe src={url} title={note.title} />
        </div>
      ) : (
        <div className="viewer">
          <img
            src={url}
            alt={note.title}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      )}
    </main>
  );
}
