import { useEffect, useState } from "react";

const PHRASES = [
  "Transforming lives since 1999...",
  "Reaching the Unreached...",
  "Education. Health. Empowerment.",
  "Seva for lasting change...",
  "Building a compassionate society...",
];

export default function TypewriterText({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(PHRASES[0]);
      return;
    }
    const phrase = PHRASES[phraseIdx];
    let timeout: any;
    if (!deleting && text === phrase) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
    } else {
      timeout = setTimeout(() => {
        setText(deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1));
      }, deleting ? 30 : 60);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIdx]);

  return (
    <span className={className} style={style}>
      {text}
      <span className="kss-typewriter-cursor">|</span>
    </span>
  );
}
