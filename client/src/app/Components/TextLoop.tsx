import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TextLoop = ({ texts, interval = 2000 }: { texts: string[], interval?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <motion.h1
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 5, y: 0 }}
      exit={{ opacity: 5, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {texts[index]}
    </motion.h1>
  );
};

export default TextLoop;
