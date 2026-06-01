import { useEffect, useState } from "react";

const MESSAGES = [
  { name: "Ravi", initial: "R", action: "from Bengaluru just donated ❤️", time: "Just now" },
  { name: "Priya", initial: "P", action: "joined as a volunteer 🤝", time: "2 min ago" },
  { name: "Anitha", initial: "A", action: "supported Vidya Vahini 📚", time: "5 min ago" },
  { name: "A Company", initial: "C", action: "started a CSR partnership 🏢", time: "12 min ago" },
  { name: "Suresh", initial: "S", action: "attended a health camp 🏥", time: "20 min ago" },
  { name: "Meena", initial: "M", action: "donated for a girl's scholarship 🎓", time: "30 min ago" },
];

const MAX_PER_SESSION = 5;

export default function SocialProofPopup() {
  const [msg, setMsg] = useState<typeof MESSAGES[number] | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = parseInt(sessionStorage.getItem("kss-sp-count") || "0", 10);
    setShown(stored);
    let count = stored;
    let active = true;
    let hideT: any, nextT: any;

    const show = () => {
      if (!active || count >= MAX_PER_SESSION) return;
      const m = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setMsg(m);
      count++;
      sessionStorage.setItem("kss-sp-count", String(count));
      hideT = setTimeout(() => setMsg(null), 5000);
      nextT = setTimeout(show, 30000);
    };

    const firstT = setTimeout(show, 8000);
    return () => {
      active = false;
      clearTimeout(firstT); clearTimeout(hideT); clearTimeout(nextT);
    };
  }, []);

  if (!msg) return null;
  return (
    <div className="kss-social-proof">
      <div className="kss-sp-avatar">{msg.initial}</div>
      <div className="kss-sp-text">
        <div className="kss-sp-name">{msg.name}</div>
        <div className="kss-sp-action">{msg.action}</div>
        <div className="kss-sp-time">{msg.time}</div>
      </div>
      <button className="kss-sp-close" onClick={() => setMsg(null)} aria-label="Dismiss">✕</button>
    </div>
  );
}
