import { getReleases } from '@/lib/releases';
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/lib/domains';
import type { Metadata } from 'next';
import Link from 'next/link';

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateStaticParams() {
  const releases = getReleases('en');
  return releases.map(r => ({ slug: slugify(r.title) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const releases = getReleases('en');
  const rel = releases.find(r => slugify(r.title) === slug);
  if (!rel) return { title: 'EXXODUS' };
  return {
    title: `${rel.title} — EXXODUS`,
    description: rel.thesis,
    openGraph: {
      title: `${rel.title} | EXXODUS`,
      description: rel.thesis,
    },
  };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const releases = getReleases('en');
  const rel = releases.find(r => slugify(r.title) === slug);
  const LOGO_URL = "https://devops.supernaturale.it/dir/exxodus/exodus%20logo.svg";

  if (!rel) return <div style={{background:'#0A1628',color:'#FFF9C4',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Not found</div>;

  const color = DOMAIN_COLORS[rel.domain];
  const domainLabel = DOMAIN_LABELS[rel.domain];

  return (
    <main style={{ background: '#0A1628', color: '#FFF9C4', minHeight: '100vh' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <Link href="/" style={{ color: '#8BC48A', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.3em', textDecoration: 'none', textTransform: 'uppercase', display: 'block', marginBottom: '3rem' }}>
          ← Back to EXXODUS
        </Link>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color, border: `1px solid ${color}50`, padding: '2px 8px' }}>
            {domainLabel}
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.05em', textTransform: 'uppercase', color: '#C8E6D5', lineHeight: 1, marginBottom: '0.5rem' }}>
          {rel.title}
        </h1>
        {rel.subtitle && (
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: `${color}80`, marginBottom: '2rem' }}>
            {rel.subtitle}
          </p>
        )}
        <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'rgba(255,249,196,0.8)', lineHeight: 1.6, borderLeft: `2px solid ${color}`, paddingLeft: '1.5rem', marginBottom: '3rem' }}>
          &quot;{rel.thesis}&quot;
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {rel.points.map((pt, i) => (
            <div key={i} style={{ border: `1px solid ${color}20`, padding: '1.5rem', background: `${color}05` }}>
              <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color, marginBottom: '0.5rem' }}>{pt.label}</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,249,196,0.6)', lineHeight: 1.6 }}>{pt.text}</p>
            </div>
          ))}
        </div>
        {rel.prerequisite && (
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: '2rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8BC48A', marginBottom: '0.5rem' }}>Unlocked by</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,249,196,0.4)', lineHeight: 1.6, fontStyle: 'italic' }}>{rel.prerequisite}</p>
          </div>
        )}
        <div style={{ marginTop: '4rem' }}>
          <img src={LOGO_URL} alt="EXXODUS" style={{ height: '16px', opacity: 0.3 }} />
        </div>
      </div>
    </main>
  );
}
