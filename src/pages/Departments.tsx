import { useEffect } from "react";
import { Link } from "react-router-dom";

const Departments = () => {
  useEffect(() => {
    document.title = "Departments | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Departments – explore faculties where networking becomes net worth.");
  }, []);

  const depts = [
    { name: "School of Commerce", pun: "Where every path forks… to Bacon." },
    { name: "School of Technology", pun: "Merge requests approved in 6 commits." },
    { name: "School of Arts", pun: "Six brushstrokes to Bacon." },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-[hsl(var(--brand-academic))] text-background py-12 md:py-16">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl text-accent">Departments</h1>
          <p className="mt-2 opacity-90 italic">Pick a major, minor in Bacon.</p>
        </div>
      </section>
      <section className="container py-10 grid gap-6 md:grid-cols-3">
        {depts.map((d) => (
          <article key={d.name} className="rounded-xl border bg-card p-5 shadow-elegant">
            <h3 className="font-display text-xl text-[hsl(var(--brand-academic))]">{d.name}</h3>
            <p className="mt-2 text-muted-foreground">{d.pun}</p>
          </article>
        ))}
      </section>
      <div className="container pb-10"><Link to="/" className="story-link">Return to Campus</Link></div>
    </main>
  );
};

export default Departments;
