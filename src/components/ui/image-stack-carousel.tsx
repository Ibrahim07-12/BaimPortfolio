"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface ImageStackCard {
  id: string;
  image: StaticImageData;
  alt: string;
}

interface ImageStackCarouselProps {
  cards: ImageStackCard[];
  label: string;
}

export default function ImageStackCarousel({ cards, label }: ImageStackCarouselProps) {
  const [cardList, setCardList] = useState(cards);
  const [selectedCard, setSelectedCard] = useState<ImageStackCard | null>(null);

  useEffect(() => {
    if (!selectedCard) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCard(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedCard]);

  const sendToBack = (id: string) => {
    setCardList((current) => {
      const index = current.findIndex((card) => card.id === id);
      if (index < 0) return current;
      return [...current.slice(index + 1), ...current.slice(0, index + 1)];
    });
  };

  const handleDragEnd = (id: string, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 100) {
      sendToBack(id);
    }
  };

  return (
    <>
      <div className="image-stack-carousel" aria-label={`${label} photo carousel`}>
        <div className="image-stack-canvas">
          {cardList.map((card, index) => {
            const isFront = index === 0;
            return (
              <motion.button
                key={card.id}
                type="button"
                className="image-stack-card"
                aria-label={`${card.alt}. Double click to view full size.`}
                onDoubleClick={() => isFront && setSelectedCard(card)}
                onKeyDown={(event) => {
                  if (isFront && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    setSelectedCard(card);
                  }
                }}
                drag={isFront}
                dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                dragElastic={0.45}
                onDragEnd={(_, info) => handleDragEnd(card.id, info)}
                animate={{
                  rotate: index * 3.5,
                  scale: 1 - index * 0.045,
                  x: index * 5,
                  y: index * -4,
                }}
                initial={false}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                style={{ zIndex: cardList.length - index }}
                whileHover={isFront ? { scale: 1.025 } : undefined}
                tabIndex={isFront ? 0 : -1}
              >
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  loading="eager"
                  sizes="(max-width: 760px) 90vw, 48vw"
                  className="image-stack-photo"
                />
                {isFront && <span className="image-stack-hint">Double-click to enlarge</span>}
              </motion.button>
            );
          })}
        </div>
        <p className="image-stack-caption">Drag to browse · {cards.length} photos</p>
      </div>

      {selectedCard && (
          <div
            className="image-viewer-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedCard(null);
            }}
          >
            <motion.div
              className="image-viewer"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedCard.alt} full-size photo`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                className="image-viewer-close"
                aria-label="Close full-size photo"
                onClick={() => setSelectedCard(null)}
              >
                <X aria-hidden="true" />
              </button>
              <Image
                src={selectedCard.image}
                alt={selectedCard.alt}
                width={selectedCard.image.width}
                height={selectedCard.image.height}
                sizes="100vw"
                className="image-viewer-photo"
                priority
              />
              <p>{selectedCard.alt} · {selectedCard.image.width} × {selectedCard.image.height}</p>
            </motion.div>
          </div>
      )}
    </>
  );
}
