"use client";

import { useEffect, useState } from "react";
import games from "./games.json";
import styles from "./page.module.css";
import GamesBillboard from "@/components/feature/GamesBillboard";

type GameItem = { id: string; name: string };
type GameSection = { id: string; title: string; items: GameItem[] };
const sections = games.sections as GameSection[];

function getItemsPerRowByWidth(w: number) {
  if (w < 840) return 3;
  if (w < 1280) return 4;
  return 7;
}

export default function GamesPage() {
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [itemsPerRow, setItemsPerRow] = useState(7);

  useEffect(() => {
    const update = () =>
      setItemsPerRow(getItemsPerRowByWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handlePrev = (key: string) => {
    setOffsets((prev) => {
      const cur = prev[key] ?? 0;
      const next = Math.max(cur - itemsPerRow, 0);
      return { ...prev, [key]: next };
    });
  };

  const handleNext = (key: string, total: number) => {
    setOffsets((prev) => {
      const cur = prev[key] ?? 0;
      const maxStart = Math.max(total - itemsPerRow, 0);
      const next = Math.min(cur + itemsPerRow, maxStart);
      return { ...prev, [key]: next };
    });
  };

  return (
    <main>
      <GamesBillboard />
      {sections.map((section) => {
        const items = section.items ?? [];
        const offset = offsets[section.id] ?? 0;

        // 버튼 disable 조건
        const canPrev = offset > 0;
        const canNext = offset + itemsPerRow < items.length;

        return (
          <section key={section.id} className={styles.section}>
            <div className={styles.title}>
              <div className={styles.titleText}>{section.title}</div>
            </div>

            <div className={styles.viewport}>
              <button
                className={`${styles.arrow} ${styles.left}`}
                onClick={() => handlePrev(section.id)}
                disabled={!canPrev}
                aria-label="이전"
              >
                <img src={`./assets/right-arrow.svg`} />
              </button>
              <div
                className={styles.track}
                style={{
                  transform: `translateX(calc(-${
                    (offset / itemsPerRow) * 100
                  }% - ${8 * (offset / itemsPerRow)}px))`,
                }}
              >
                {items.map((game) => (
                  <div
                    key={game.id}
                    className={styles.item}
                    style={{
                      // 한 화면에 itemsPerRow개 보이도록 폭을 계산
                      flexBasis: `calc((100% - ${
                        (itemsPerRow - 1) * 8
                      }px) / ${itemsPerRow})`,
                    }}
                  >
                    <div className={styles.wrapper}>
                      <img
                        className={styles.image}
                        src={`./assets/${game.id}.png`}
                        alt={game.name}
                        draggable={false}
                      />
                      <div className={styles.name}>{game.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`${styles.arrow} ${styles.right}`}
                onClick={() => handleNext(section.id, items.length)}
                disabled={!canNext}
                aria-label="다음"
              >
                <img src={`./assets/right-arrow.svg`} />
              </button>
            </div>
          </section>
        );
      })}
    </main>
  );
}
