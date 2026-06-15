import { useEffect, useState } from "react";

const HREF =
  "https://wa.me/919845487509?text=" +
  encodeURIComponent("Hi, I want to know more about Keshava Seva Samiti");

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="kss-wa-btn"
      data-show={show ? "1" : "0"}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden="true">
        <path d="M19.11 17.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.27.5 1.7.64.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM16 5.33A10.66 10.66 0 0 0 6.93 21.5L5.33 26.67l5.31-1.57A10.66 10.66 0 1 0 16 5.33zm0 19.45c-1.65 0-3.27-.44-4.68-1.28l-.34-.2-3.15.93.93-3.07-.22-.35a8.78 8.78 0 1 1 7.46 3.97z" />
      </svg>
      <style>{`
        .kss-wa-btn {
          position: fixed; bottom: 24px; right: 24px;
          width: 56px; height: 56px; border-radius: 50%;
          background: #25D366; display: grid; place-items: center;
          box-shadow: 0 8px 24px rgba(37,211,102,0.45);
          z-index: 9998;
          transform: translateY(80px); opacity: 0;
          transition: transform 500ms ease-out, opacity 500ms ease-out, box-shadow 200ms;
        }
        .kss-wa-btn[data-show="1"] { transform: translateY(0); opacity: 1; }
        .kss-wa-btn:hover { box-shadow: 0 12px 30px rgba(37,211,102,0.6); }
        .kss-wa-btn::before {
          content: ""; position: absolute; inset: 0; border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(37,211,102,0.55);
          animation: kss-wa-pulse 4s ease-out infinite;
        }
        @keyframes kss-wa-pulse {
          0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.55); }
          70% { box-shadow: 0 0 0 18px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @media (max-width: 768px) { .kss-wa-btn { bottom: 80px; } }
        @media (prefers-reduced-motion: reduce) {
          .kss-wa-btn { transition: none; transform: none; opacity: 1; }
          .kss-wa-btn::before { animation: none; }
        }
      `}</style>
    </a>
  );
}
