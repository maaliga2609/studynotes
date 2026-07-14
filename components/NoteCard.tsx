import Link from "next/link";
import { Note, SUBJECT_META } from "@/lib/supabase";

export function NoteCard({ note }: { note: Note }) {
  const m = SUBJECT_META[note.subject];
  return (
    <Link href={`/note/${note.id}`} className="note-card">
      <div className="note-top">
        <span className="tag" style={{ background: m.tint, color: m.accent }}>
          {m.label}
        </span>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          {note.downloads} downloads
        </span>
      </div>
      <h3>{note.title}</h3>
      {note.description && <p className="note-desc">{note.description}</p>}
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.slice(0, 4).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="note-meta">
        <span>{new Date(note.created_at).toLocaleDateString()}</span>
        <span className="back-link">Open →</span>
      </div>
    </Link>
  );
}
