import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export default function FadeImage({ src, alt, className = "", loading = "lazy" }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onLoad={() => setLoaded(true)}
    />
  );
}
