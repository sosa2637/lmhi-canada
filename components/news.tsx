"use client";
import { type Post } from "@/app/content";
import { FileText } from "lucide-react";
import { useState } from "react";
export default function News({ posts, en }: { posts: Post[]; en: boolean }) {
  const [filter, setFilter] = useState("all");
  const filtered = posts.filter((p) => filter === "all" || p.type === filter);
  return (
    <section className="section wrap">
      <div
        className="tabs"
        role="group"
        aria-label={en ? "Filter content" : "Filtrer les contenus"}
      >
        {[
          ["all", en ? "All" : "Tous"],
          ["project", en ? "Projects" : "Projets"],
          ["news", en ? "News" : "Actualités"],
        ].map(([v, l]) => (
          <button
            key={v}
            className={filter === v ? "selected" : ""}
            onClick={() => setFilter(v)}
            aria-pressed={filter === v}
          >
            {l}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="news-grid">
          {filtered.map((p) => (
            <article className="news" key={p.id}>
              <div className="news-meta">
                <span>
                  {p.type === "project"
                    ? en
                      ? "PROJECT"
                      : "PROJET"
                    : en
                      ? "NEWS"
                      : "ACTUALITÉ"}
                </span>
                <time>{p.date}</time>
              </div>
              <h2>{en ? p.titleEn : p.titleFr}</h2>
              <p>{en ? p.bodyEn : p.bodyFr}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FileText size={28} />
          <div>
            <h3>
              {en
                ? "Updates will appear here."
                : "Les prochaines publications apparaîtront ici."}
            </h3>
            <p>
              {en
                ? "No approved content is published in this category yet."
                : "Aucun contenu validé n’est encore publié dans cette catégorie."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
