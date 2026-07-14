"use client";

import { useState } from "react";
import { supabase, SUBJECTS, SUBJECT_META } from "@/lib/supabase";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");

  const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

  if (!authed) {
    return (
      <div className="form-wrap">
        <h1>Upload access</h1>
        <p className="lead">Enter the passcode to add notes to the library.</p>
        <div className="field">
          <label>Passcode</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && pw === ADMIN_PW) setAuthed(true);
            }}
          />
        </div>
        <button
          className="btn btn-purple"
          onClick={() => {
            if (pw === ADMIN_PW) setAuthed(true);
          }}
        >
          Unlock
        </button>
        {pw && pw !== ADMIN_PW && (
          <p className="notice notice-err" style={{ marginTop: 14 }}>
            That passcode doesn&apos;t match.
          </p>
        )}
      </div>
    );
  }

  return <UploadForm />;
}

function UploadForm() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>("biology");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit() {
    if (!title.trim() || !file) {
      setStatus("err");
      setMsg("A title and a file are both required.");
      return;
    }
    setStatus("saving");
    setMsg("");

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${subject}/${Date.now()}_${safe}`;

    const { error: upErr } = await supabase.storage
      .from("notes")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setStatus("err");
      setMsg(`Upload failed: ${upErr.message}`);
      return;
    }

    const { error: dbErr } = await supabase.from("notes").insert({
      title: title.trim(),
      subject,
      description: description.trim() || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      file_path: path,
      file_name: file.name,
    });

    if (dbErr) {
      setStatus("err");
      setMsg(`Saved file but record failed: ${dbErr.message}`);
      return;
    }

    setStatus("ok");
    setMsg("Note published. It’s live on the site now.");
    setTitle("");
    setDescription("");
    setTags("");
    setFile(null);
    (document.getElementById("file-input") as HTMLInputElement).value = "";
  }

  return (
    <div className="form-wrap">
      <h1>Add a note</h1>
      <p className="lead">Upload a PDF or image. It goes live immediately.</p>

      {status === "ok" && <div className="notice notice-ok">{msg}</div>}
      {status === "err" && <div className="notice notice-err">{msg}</div>}

      <div className="field">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Photosynthesis — light &amp; dark reactions"
        />
      </div>

      <div className="field">
        <label>Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {SUBJECT_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short summary of what the note covers."
        />
      </div>

      <div className="field">
        <label>Tags (comma-separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="cell biology, chapter 4, exam"
        />
      </div>

      <div className="field">
        <label>File (PDF or image)</label>
        <input
          id="file-input"
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <button
        className="btn btn-green"
        onClick={submit}
        disabled={status === "saving"}
      >
        {status === "saving" ? "Publishing…" : "Publish note"}
      </button>
    </div>
  );
}
