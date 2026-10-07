"use client";
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
}) {
  return (
    <section className={"page-hero " + (image ? "with-image" : "")}>
      {image && <img src={image} alt="" />}
      <div className="page-hero-shade" />
      <div className="wrap">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
