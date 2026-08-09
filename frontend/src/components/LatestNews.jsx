import { ArrowUpRight } from "lucide-react";
import "../styles/sections.css";

/* Placeholder posts — swap for real ones once the blog/CMS is wired up. */
const POSTS = [
  {
    tag: "Industry",
    title: "How India's pharma distribution is going digital",
    date: "Coming soon",
  },
  {
    tag: "Company",
    title: "Wellness CureCare expands its partner network",
    date: "Coming soon",
  },
  {
    tag: "Guide",
    title: "What hospitals should look for in a trade partner",
    date: "Coming soon",
  },
];

export default function LatestNews() {
  return (
    <section className="section news">
      <div className="container">
        <p className="eyebrow">Insights</p>
        <h2 className="section__title">Latest News &amp; Blog</h2>

        <div className="news__grid">
          {POSTS.map((post) => (
            <article key={post.title} className="news__card">
              <span className="news__tag">{post.tag}</span>
              <h3>{post.title}</h3>
              <div className="news__meta">
                <span>{post.date}</span>
                <ArrowUpRight size={16} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
