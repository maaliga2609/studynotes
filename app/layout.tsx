import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyNotes — Biology, Chemistry & Physics",
  description: "A shared library of biology, chemistry, and physics notes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="container nav-inner">
            <Link href="/" className="brand">
              <span className="brand-mark">Study<b>Notes</b></span>
              <span className="brand-sub">Science Library</span>
            </Link>
            <div>
              <Link href="/" className="nav-link">Browse</Link>
              <Link href="/admin" className="nav-link">Upload</Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="footer">
          <div className="container">
            StudyNotes · A shared library for biology, chemistry &amp; physics.
          </div>
        </footer>
      </body>
    </html>
  );
}
