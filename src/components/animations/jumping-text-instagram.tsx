import { motion } from "motion/react";

const splitText = (text: string, word = false) => {
  if (word) {
    return String(text).split(/(?:\b)/u);
  }
  return String(text).split(/(?:)/u);
};

export default function JumpingTextInstagram({
  text = "This is a jumping text effect",
  mode = "word",
  className,
}: {
  text: string;
  className?: string;
  mode?: "word" | "character";
}) {
  const isWordMode = mode === "word";
  const nodes = splitText(text, isWordMode);
  return (
    <span className={className} key={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {nodes.map((node, index) => (
          <motion.span
            key={index}
            initial={{
              y: 30,
              rotate: -30,
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotate: 0,
            }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              type: "spring",
              damping: 10,
              mass: 2,
              delay: (isWordMode ? 0.05 : 0.01) * index,
            }}
            className="jumping-text-piece inline-block origin-center"
          >
            {node === " " ? "\u00A0" : node}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
