import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import './styles.css';
import { mathVideos } from './data/mathematics';
import { physicsVideos } from './data/physics';
import { socialVideos } from './data/social';
import Inauguration from './components/Inauguration';

/* ── helpers ── */
const getChapters = (videos) => ['All', ...Array.from(new Set(videos.map(v => v.chapter)))];

/* ── Dropdown Nav config ── */
const navConfig = [
  { label: 'Home', path: '/', chapters: [] },
  { label: 'Mathematics', path: '/mathematics', chapters: getChapters(mathVideos) },
  { label: 'Phy Science', path: '/physics', chapters: getChapters(physicsVideos) },
  { label: 'Bio Science', path: '/biology', chapters: [] },
  { label: 'Social', path: '/social', chapters: getChapters(socialVideos) },
  { label: 'Gurukulam Magazine', path: '/magazine', chapters: [] },
];

/* ── Nav with dropdowns ── */
function NavBar() {
  const loc = useLocation();
  const navg = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) =>
    loc.pathname === path ||
    (path !== '/' && loc.pathname.startsWith(path + '/'));

  return (
    <nav ref={navRef}>
      {navConfig.map(({ label, path, chapters }) => {
        const hasDropdown = chapters.length > 1;
        return (
          <div
            key={path}
            className="nav-item"
            onMouseEnter={() => hasDropdown && setOpenMenu(path)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              className={isActive(path) ? 'active' : ''}
              onClick={() => { navg(path); setOpenMenu(null); }}
            >
              {label}
              {hasDropdown && <span className="nav-arrow">{openMenu === path ? '▲' : '▼'}</span>}
            </button>

            {hasDropdown && openMenu === path && (
              <div className="nav-dropdown">
                {chapters.map(ch => (
                  <button
                    key={ch}
                    className="nav-dropdown-item"
                    onClick={() => {
                      navg(ch === 'All' ? path : `${path}?chapter=${encodeURIComponent(ch)}`);
                      setOpenMenu(null);
                    }}
                  >
                    {ch === 'All' ? '📚 All Chapters' : `📖 ${ch}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ── Chapter Filter Pills ── */
function ChapterFilter({ chapters, active, onChange }) {
  return (
    <div className="chapter-filter">
      {chapters.map(ch => (
        <button
          key={ch}
          className={`chapter-pill${active === ch ? ' active' : ''}`}
          onClick={() => onChange(ch)}
        >
          {ch}
        </button>
      ))}
    </div>
  );
}

/* ── Layout ── */
function Layout({ children }) {
  const loc = useLocation();
  const navg = useNavigate();

  useEffect(() => {
    const mathPostMatch = loc.pathname.match(/^\/mathematics\/(\d+)$/);
    const phyPostMatch = loc.pathname.match(/^\/physics\/(\d+)$/);
    const socialPostMatch = loc.pathname.match(/^\/social\/(\d+)$/);

    if (mathPostMatch) {
      const v = mathVideos.find(v => v.id === parseInt(mathPostMatch[1], 10));
      document.title = v ? `AP-GURUKULAM: ${v.title}` : 'AP-GURUKULAM-DIGITAL CLASSES: Mathematics';
    } else if (phyPostMatch) {
      const v = physicsVideos.find(v => v.id === parseInt(phyPostMatch[1], 10));
      document.title = v ? `AP-GURUKULAM: ${v.title}` : 'AP-GURUKULAM-DIGITAL CLASSES: Physical Science';
    } else if (socialPostMatch) {
      const v = socialVideos.find(v => v.id === parseInt(socialPostMatch[1], 10));
      document.title = v ? `AP-GURUKULAM: ${v.title}` : 'AP-GURUKULAM-DIGITAL CLASSES: Social Studies';
    } else if (loc.pathname === '/mathematics') {
      document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Mathematics';
    } else if (loc.pathname === '/physics' || loc.pathname === '/p/phy-science.html') {
      document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Physical Science';
    } else if (loc.pathname === '/biology' || loc.pathname === '/biological-science') {
      document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Biological Science';
    } else if (loc.pathname === '/social' || loc.pathname === '/p/social.html') {
      document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Social Studies';
    } else {
      document.title = 'AP-GURUKULAM-DIGITAL CLASSES';
    }
  }, [loc.pathname]);

  return (
    <div className="site">
      <header>
        <div className="header-content">
          <img src="/ap-emblem.png" alt="AP Emblem" className="header-logo logo-left" onClick={() => navg('/')} style={{ cursor: 'pointer' }} />
          <button className="brand" onClick={() => navg('/')}>AP-GURUKULAM-DIGITAL CLASSES</button>
          <img src="/aptwreis-logo.png" alt="APTWREIS Logo" className="header-logo logo-right" onClick={() => navg('/')} style={{ cursor: 'pointer' }} />
        </div>
      </header>

      <NavBar />
      <main>{children}</main>
      <footer>APTWREI Society (Gurukulam), Amaravati <span>•</span> Empowering Students Through Digital Learning</footer>
    </div>
  );
}

/* ── Video grid shared component ── */
function VideoGrid({ videos, basePath, subject }) {
  const loc = useLocation();
  const navg = useNavigate();
  const searchParams = new URLSearchParams(loc.search);
  const chapterParam = searchParams.get('chapter') || 'All';

  const chapters = getChapters(videos);
  const [activeChapter, setActiveChapter] = useState(
    chapters.includes(chapterParam) ? chapterParam : 'All'
  );

  useEffect(() => {
    const ch = new URLSearchParams(loc.search).get('chapter') || 'All';
    setActiveChapter(chapters.includes(ch) ? ch : 'All');
  }, [loc.search]);

  const handleChapterChange = (ch) => {
    setActiveChapter(ch);
    navg(ch === 'All' ? basePath : `${basePath}?chapter=${encodeURIComponent(ch)}`);
  };

  const filtered = activeChapter === 'All' ? videos : videos.filter(v => v.chapter === activeChapter);

  // Group by chapter for display
  const grouped = filtered.reduce((acc, v) => {
    (acc[v.chapter] = acc[v.chapter] || []).push(v);
    return acc;
  }, {});

  return (
    <>
      <ChapterFilter chapters={chapters} active={activeChapter} onChange={handleChapterChange} />

      {Object.entries(grouped).map(([chapter, vids], gi) => (
        <div key={chapter} className="chapter-group">
          <div className="chapter-heading">
            <span className="chapter-icon">📖</span>
            <h2>{chapter}</h2>
            <span className="chapter-count">{vids.length} video{vids.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid">
            {vids.map((v, i) => {
              const globalIndex = videos.findIndex(x => x.id === v.id);
              return (
                <article className="video-card" key={v.id}>
                  <div className="number">{String(globalIndex + 1).padStart(2, '0')}</div>
                  <div>
                    <h2 style={{ cursor: 'pointer' }} onClick={() => navg(`${basePath}/${v.id}`)}>
                      {v.title}
                    </h2>
                    <p>10th Class • {subject}</p>
                    <div className="card-actions">
                      <button className="watch" onClick={() => navg(`${basePath}/${v.id}`)}>
                        ▶ Watch Video
                      </button>
                      <a href={v.drive} target="_blank" rel="noreferrer">↗ Open Drive</a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Home ── */
function Home() {
  const navg = useNavigate();
  return (
    <>
      <Inauguration />
      <section className="hero">
        <div className="badge">DIGITAL LEARNING PLATFORM</div>
        <h1>Welcome to Gurukulam Digital Classes</h1>
        <p>Digital learning resources for 10th Class students in Mathematics, Physical Science, Biological Science and Social Studies.</p>
        <div className="actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navg('/mathematics')}>Explore Mathematics →</button>
          <button onClick={() => navg('/physics')} style={{ background: '#9f7f27' }}>Explore Physical Science →</button>
          <button onClick={() => navg('/social')} style={{ background: '#007f9f' }}>Explore Social Studies →</button>
        </div>
        <div className="note">Biology page will be added when its Blogger content is migrated.</div>
      </section>
    </>
  );
}

/* ── Mathematics ── */
function Mathematics() {
  return (
    <>
      <section className="pagehead">
        <span>CLASS 10</span>
        <h1>MATHEMATICS VIDEOS</h1>
        <p>Learn • Understand • Excel</p>
      </section>
      <VideoGrid videos={mathVideos} basePath="/mathematics" subject="Mathematics" />
    </>
  );
}

/* ── Physical Science ── */
function PhysicalScience() {
  return (
    <>
      <section className="pagehead">
        <span>CLASS 10</span>
        <h1>PHYSICAL SCIENCE VIDEOS</h1>
        <p>Explore • Experiment • Excel</p>
      </section>
      <VideoGrid videos={physicsVideos} basePath="/physics" subject="Physical Science" />
    </>
  );
}

/* ── Social Studies ── */
function SocialStudies() {
  return (
    <>
      <section className="pagehead">
        <span>CLASS 10</span>
        <h1>SOCIAL STUDIES VIDEOS</h1>
        <p>Explore • Discover • Transform</p>
      </section>
      <VideoGrid videos={socialVideos} basePath="/social" subject="Social Studies" />
    </>
  );
}

/* ── Post Detail shared ── */
function PostDetail({ videos, basePath, subject, badgeLabel }) {
  const navg = useNavigate();
  const loc = useLocation();
  const match = loc.pathname.match(/\/(\d+)$/);
  const id = match ? parseInt(match[1], 10) : null;
  const videoIndex = videos.findIndex(v => v.id === id);
  const video = videos[videoIndex];

  if (!video) {
    return (
      <section className="placeholder">
        <h1>Video Not Found</h1>
        <p>The requested video lesson could not be found.</p>
        <button className="back-btn" onClick={() => navg(basePath)}>← Back to List</button>
      </section>
    );
  }

  const embedUrl = video.drive ? video.drive.replace(/\/view(\?.*)?$/, '/preview') : '';
  const prevVideo = videoIndex > 0 ? videos[videoIndex - 1] : null;
  const nextVideo = videoIndex < videos.length - 1 ? videos[videoIndex + 1] : null;

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={() => navg(basePath)}>← Back to {subject} Videos</button>

      <div className="post-header">
        <span className="badge">{badgeLabel}</span>
        <div className="chapter-tag">📖 {video.chapter}</div>
        <h1>{video.title}</h1>
        <p>Lesson {String(video.id).padStart(2, '0')} of {videos.length} • Digital Class Resource</p>
      </div>

      <div className="video-container">
        <iframe src={embedUrl} title={video.title} allow="autoplay; encrypted-media; fullscreen" allowFullScreen></iframe>
      </div>

      <div className="post-footer-actions">
        <a
          href={video.drive}
          target="_blank"
          rel="noreferrer"
          className="watch"
          style={{ padding: '11px 20px', borderRadius: '999px', background: '#8d005f', color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ↗ Open in Google Drive
        </a>
        <div className="nav-buttons">
          <button disabled={!prevVideo} onClick={() => prevVideo && navg(`${basePath}/${prevVideo.id}`)}>← Previous Lesson</button>
          <button disabled={!nextVideo} onClick={() => nextVideo && navg(`${basePath}/${nextVideo.id}`)}>Next Lesson →</button>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ name }) {
  return (
    <section className="placeholder">
      <div className="badge">COMING LATER</div>
      <h1>{name}</h1>
      <p>The {name} page is reserved for the content migration. Its lessons, videos and links can be added without changing the site structure.</p>
    </section>
  );
}

/* ── Gurukulam Magazine ── */
function GurukulamMagazine() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', minHeight: '80vh' }}>
      <section className="pagehead" style={{ marginBottom: '24px', width: '100%', maxWidth: '960px' }}>
        <span>APTWREI SOCIETY</span>
        <h1>📰 GURUKULAM MAGAZINE</h1>
        <p>Monthly publication featuring student achievements, academic articles &amp; school events</p>
      </section>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <a
          href="/gurukulam-magazine.pdf"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '10px 22px', borderRadius: '999px',
            background: '#8d005f', color: '#fff',
            textDecoration: 'none', fontWeight: '700', fontSize: '14px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 14px rgba(141,0,95,0.35)'
          }}
        >
          ↗ Open in New Tab
        </a>
        <a
          href="/gurukulam-magazine.pdf"
          download="Gurukulam-Magazine.pdf"
          style={{
            padding: '10px 22px', borderRadius: '999px',
            background: '#ffffff', color: '#1a1a2e',
            textDecoration: 'none', fontWeight: '700', fontSize: '14px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '2px solid #8d005f',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
          }}
        >
          ⬇ Download PDF
        </a>
      </div>

      <div style={{
        width: '100%', maxWidth: '960px', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a2e'
      }}>
        <iframe
          src="/gurukulam-magazine.pdf"
          title="Gurukulam Magazine"
          width="100%"
          height="820px"
          style={{ display: 'block', border: 'none' }}
        />
      </div>
    </div>
  );
}

/* ── App / Router ── */
function App() {
  const loc = useLocation();
  const p = loc.pathname;

  const mathPostMatch = p.match(/^\/mathematics\/(\d+)$/);
  const phyPostMatch = p.match(/^\/physics\/(\d+)$/);
  const socialPostMatch = p.match(/^\/social\/(\d+)$/);

  let content;
  if (p === '/' || p === '') {
    content = <Home />;
  } else if (mathPostMatch) {
    content = <PostDetail videos={mathVideos} basePath="/mathematics" subject="Mathematics" badgeLabel="10TH CLASS • MATHEMATICS" />;
  } else if (p === '/mathematics' || p === '/p/blog-page_18.html') {
    content = <Mathematics />;
  } else if (phyPostMatch) {
    content = <PostDetail videos={physicsVideos} basePath="/physics" subject="Physical Science" badgeLabel="10TH CLASS • PHYSICAL SCIENCE" />;
  } else if (p === '/physics' || p === '/p/phy-science.html') {
    content = <PhysicalScience />;
  } else if (socialPostMatch) {
    content = <PostDetail videos={socialVideos} basePath="/social" subject="Social Studies" badgeLabel="10TH CLASS • SOCIAL STUDIES" />;
  } else if (p === '/social' || p === '/p/social.html') {
    content = <SocialStudies />;
  } else if (p === '/biology' || p === '/biological-science') {
    content = <Placeholder name="Biological Science" />;
  } else if (p === '/magazine') {
    content = <GurukulamMagazine />;
  } else {
    content = <Placeholder name="Social Studies" />;
  }

  return <Layout>{content}</Layout>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
