import { useEffect } from "react";
import { Link } from "react-router-dom";

const Alumni = () => {
  useEffect(() => {
    document.title = "Alumni | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Alumni network – success stories connected in six steps.");
  }, []);

  const stories = [
    { name: "Chris P.", note: "Closed a sale in 3 degrees – crispy results." },
    { name: "Savannah B.", note: "From Freshman to Dean in two intros." },
    { name: "Jordan K.", note: "Six degrees? Needed only four." },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-[hsl(var(--brand-academic))] text-background py-12 md:py-16">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl text-accent">Alumni</h1>
          <p className="mt-2 opacity-90 italic">Keep it sizzlin’ after graduation.</p>
        </div>
      </section>
      <section className="container py-10 grid gap-6 md:grid-cols-3">
        {stories.map((a) => (
          <article key={a.name} className="rounded-xl border bg-card p-5 shadow-elegant">
            <h3 className="font-display text-xl text-[hsl(var(--brand-academic))]">{a.name}</h3>
            <p className="mt-2 text-muted-foreground">{a.note}</p>
          </article>
        ))}
      </section>
      <div className="container pb-10"><Link to="/" className="story-link">Return to Campus</Link></div>
    </main>
  );
};

export default Alumni;
