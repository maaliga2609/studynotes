import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Note = {
  id: string;
  title: string;
  subject: "biology" | "chemistry" | "physics";
  description: string | null;
  tags: string[] | null;
  file_path: string;
  file_name: string;
  created_at: string;
  downloads: number;
};

export const SUBJECTS = ["biology", "chemistry", "physics"] as const;

export const SUBJECT_META: Record<
  string,
  { label: string; accent: string; tint: string; blurb: string }
> = {
  biology: {
    label: "Biology",
    accent: "var(--green)",
    tint: "var(--green-tint)",
    blurb: "Cells, systems, and the living world",
  },
  chemistry: {
    label: "Chemistry",
    accent: "var(--purple)",
    tint: "var(--purple-tint)",
    blurb: "Reactions, bonds, and the periodic table",
  },
  physics: {
    label: "Physics",
    accent: "var(--plum)",
    tint: "var(--plum-tint)",
    blurb: "Forces, energy, and the laws of motion",
  },
};

export function fileUrl(path: string) {
  return `${supabaseUrl}/storage/v1/object/public/notes/${path}`;
}
