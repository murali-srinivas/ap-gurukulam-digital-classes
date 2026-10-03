import React,{useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,useLocation,useNavigate} from 'react-router-dom';
import './styles.css';
import {mathVideos} from './data/mathematics';
import {physicsVideos} from './data/physics';
import {socialVideos} from './data/social';
import Inauguration from './components/Inauguration';

const nav=[
  ['Home','/'],
  ['Mathematics','/mathematics'],
  ['Phy Science','/physics'],
  ['Bio Science','/biology'],
  ['Social','/social']
];

function Layout({children}){
  const loc=useLocation();
  const navg=useNavigate();
  useEffect(()=>{
    const mathPostMatch = loc.pathname.match(/^\/mathematics\/(\d+)$/);
    const phyPostMatch = loc.pathname.match(/^\/physics\/(\d+)$/);
    const socialPostMatch = loc.pathname.match(/^\/social\/(\d+)$/);

    if(mathPostMatch){
      const videoId = parseInt(mathPostMatch[1], 10);
      const video = mathVideos.find(v => v.id === videoId);
      if(video){
        document.title = `AP-GURUKULAM: ${video.title}`;
      } else {
        document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Mathematics';
      }
    } else if(phyPostMatch){
      const videoId = parseInt(phyPostMatch[1], 10);
      const video = physicsVideos.find(v => v.id === videoId);
      if(video){
        document.title = `AP-GURUKULAM: ${video.title}`;
      } else {
        document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Physical Science';
      }
    } else if(socialPostMatch){
      const videoId = parseInt(socialPostMatch[1], 10);
      const video = socialVideos.find(v => v.id === videoId);
      if(video){
        document.title = `AP-GURUKULAM: ${video.title}`;
      } else {
        document.title = 'AP-GURUKULAM-DIGITAL CLASSES: Social Studies';
      }
    } else if(loc.pathname==='/mathematics') {
      document.title='AP-GURUKULAM-DIGITAL CLASSES: Mathematics';
    } else if(loc.pathname==='/physics'||loc.pathname==='/p/phy-science.html') {
      document.title='AP-GURUKULAM-DIGITAL CLASSES: Physical Science';
    } else if(loc.pathname==='/biology'||loc.pathname==='/biological-science') {
      document.title='AP-GURUKULAM-DIGITAL CLASSES: Biological Science';
    } else if(loc.pathname==='/social'||loc.pathname==='/p/social.html') {
      document.title='AP-GURUKULAM-DIGITAL CLASSES: Social Studies';
    } else {
      document.title='AP-GURUKULAM-DIGITAL CLASSES';
    }
  },[loc.pathname]);

  return (
    <div className="site">
      <header>
        <div className="header-content">
          <img src="/ap-emblem.png" alt="AP Emblem" className="header-logo logo-left" onClick={()=>navg('/')} style={{ cursor: 'pointer' }} />
          <button className="brand" onClick={()=>navg('/')}>AP-GURUKULAM-DIGITAL CLASSES</button>
          <img src="/aptwreis-logo.png" alt="APTWREIS Logo" className="header-logo logo-right" onClick={()=>navg('/')} style={{ cursor: 'pointer' }} />
        </div>
      </header>

      <nav>
        {nav.map(([n,p])=>(
          <button 
            key={p} 
            className={loc.pathname===p || (p==='/mathematics' && loc.pathname.startsWith('/mathematics/')) || (p==='/physics' && loc.pathname.startsWith('/physics/')) || (p==='/social' && loc.pathname.startsWith('/social/')) ? 'active' : ''} 
            onClick={()=>navg(p)}
          >
            {n}
          </button>
        ))}
      </nav>
      <main>{children}</main>
      <footer>APTWREI Society (Gurukulam), Amaravati <span>•</span> Empowering Students Through Digital Learning</footer>
    </div>
  );
}

function Home(){
  const navg=useNavigate();
  return (
    <>
      <Inauguration />
      <section className="hero">
        <div className="badge">DIGITAL LEARNING PLATFORM</div>
        <h1>Welcome to Gurukulam Digital Classes</h1>
        <p>Digital learning resources for 10th Class students in Mathematics, Physical Science, Biological Science and Social Studies.</p>
        <div className="actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={()=>navg('/mathematics')}>Explore Mathematics →</button>
          <button onClick={()=>navg('/physics')} style={{ background: '#9f7f27' }}>Explore Physical Science →</button>
          <button onClick={()=>navg('/social')} style={{ background: '#007f9f' }}>Explore Social Studies →</button>
        </div>
        <div className="note">Biology page will be added when its Blogger content is migrated.</div>
      </section>
    </>
  );
}

function Mathematics(){
  const navg=useNavigate();
  return (
    <>
      <section className="pagehead">
        <span>CLASS 10</span>
        <h1>MATHEMATICS VIDEOS</h1>
        <p>Learn • Understand • Excel</p>
      </section>
      <div className="grid">
        {mathVideos.map((v,i)=>(
          <article className="video-card" key={v.id}>
            <div className="number">{String(i+1).padStart(2,'0')}</div>
            <div>
              <h2 style={{ cursor: 'pointer' }} onClick={()=>navg(`/mathematics/${v.id}`)}>
                {v.title}
              </h2>
              <p>10th Class • Mathematics</p>
              <div className="card-actions">
                <button className="watch" onClick={()=>navg(`/mathematics/${v.id}`)}>
                  ▶ Watch Video
                </button>
                <a href={v.drive} target="_blank" rel="noreferrer">↗ Open Drive</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function MathPostDetail({ id }){
  const navg = useNavigate();
  const videoIndex = mathVideos.findIndex(v => v.id === id);
  const video = mathVideos[videoIndex];

  if(!video){
    return (
      <section className="placeholder">
        <h1>Video Not Found</h1>
        <p>The requested mathematics video lesson could not be found.</p>
        <button className="back-btn" onClick={()=>navg('/mathematics')}>
          ← Back to Mathematics List
        </button>
      </section>
    );
  }

  const embedUrl = video.drive ? video.drive.replace(/\/view(\?.*)?$/, '/preview') : '';
  const prevVideo = videoIndex > 0 ? mathVideos[videoIndex - 1] : null;
  const nextVideo = videoIndex < mathVideos.length - 1 ? mathVideos[videoIndex + 1] : null;

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={()=>navg('/mathematics')}>
        ← Back to Mathematics Videos
      </button>

      <div className="post-header">
        <span className="badge">10TH CLASS • MATHEMATICS</span>
        <h1>{video.title}</h1>
        <p>Lesson {String(video.id).padStart(2,'0')} of {mathVideos.length} • Digital Class Resource</p>
      </div>

      <div className="video-container">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      <div className="post-footer-actions">
        <a 
          href={video.drive} 
          target="_blank" 
          rel="noreferrer" 
          className="watch"
          style={{
            padding: '11px 20px',
            borderRadius: '999px',
            background: '#8d005f',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ↗ Open in Google Drive
        </a>

        <div className="nav-buttons">
          <button 
            disabled={!prevVideo} 
            onClick={()=>prevVideo && navg(`/mathematics/${prevVideo.id}`)}
          >
            ← Previous Lesson
          </button>
          <button 
            disabled={!nextVideo} 
            onClick={()=>nextVideo && navg(`/mathematics/${nextVideo.id}`)}
          >
            Next Lesson →
          </button>
        </div>
      </div>
    </div>
  );
}

function PhysicalScience(){
  const navg=useNavigate();
  return (
    <>
      <section className="pagehead">
        <span>CLASS 10</span>
        <h1>PHYSICAL SCIENCE VIDEOS</h1>
        <p>Explore • Experiment • Excel</p>
      </section>
      <div className="grid">
        {physicsVideos.map((v,i)=>(
          <article className="video-card" key={v.id}>
            <div className="number">{String(i+1).padStart(2,'0')}</div>
            <div>
              <h2 style={{ cursor: 'pointer' }} onClick={()=>navg(`/physics/${v.id}`)}>
                {v.title}
              </h2>
              <p>10th Class • Physical Science</p>
              <div className="card-actions">
                <button className="watch" onClick={()=>navg(`/physics/${v.id}`)}>
                  ▶ Watch Video
                </button>
                <a href={v.drive} target="_blank" rel="noreferrer">↗ Open Drive</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function PhysicsPostDetail({ id }){
  const navg = useNavigate();
  const videoIndex = physicsVideos.findIndex(v => v.id === id);
  const video = physicsVideos[videoIndex];

  if(!video){
    return (
      <section className="placeholder">
        <h1>Video Not Found</h1>
        <p>The requested physical science video lesson could not be found.</p>
        <button className="back-btn" onClick={()=>navg('/physics')}>
          ← Back to Physical Science List
        </button>
      </section>
    );
  }

  const embedUrl = video.drive ? video.drive.replace(/\/view(\?.*)?$/, '/preview') : '';
  const prevVideo = videoIndex > 0 ? physicsVideos[videoIndex - 1] : null;
  const nextVideo = videoIndex < physicsVideos.length - 1 ? physicsVideos[videoIndex + 1] : null;

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={()=>navg('/physics')}>
        ← Back to Physical Science Videos
      </button>

      <div className="post-header">
        <span className="badge">10TH CLASS • PHYSICAL SCIENCE</span>
        <h1>{video.title}</h1>
        <p>Lesson {String(video.id).padStart(2,'0')} of {physicsVideos.length} • Digital Class Resource</p>
      </div>

      <div className="video-container">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      <div className="post-footer-actions">
        <a 
          href={video.drive} 
          target="_blank" 
          rel="noreferrer" 
          className="watch"
          style={{
            padding: '11px 20px',
            borderRadius: '999px',
            background: '#8d005f',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ↗ Open in Google Drive
        </a>

        <div className="nav-buttons">
          <button 
            disabled={!prevVideo} 
            onClick={()=>prevVideo && navg(`/physics/${prevVideo.id}`)}
          >
            ← Previous Lesson
          </button>
          <button 
            disabled={!nextVideo} 
            onClick={()=>nextVideo && navg(`/physics/${nextVideo.id}`)}
          >
            Next Lesson →
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialStudies(){
  const navg=useNavigate();
  return (
    <>
      <section className="pagehead">
        <span>CLASS 10</span>
        <h1>SOCIAL STUDIES VIDEOS</h1>
        <p>Explore • Discover • Transform</p>
      </section>
      <div className="grid">
        {socialVideos.map((v,i)=>(
          <article className="video-card" key={v.id}>
            <div className="number">{String(i+1).padStart(2,'0')}</div>
            <div>
              <h2 style={{ cursor: 'pointer' }} onClick={()=>navg(`/social/${v.id}`)}>
                {v.title}
              </h2>
              <p>10th Class • Social Studies</p>
              <div className="card-actions">
                <button className="watch" onClick={()=>navg(`/social/${v.id}`)}>
                  ▶ Watch Video
                </button>
                <a href={v.drive} target="_blank" rel="noreferrer">↗ Open Drive</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function SocialPostDetail({ id }){
  const navg = useNavigate();
  const videoIndex = socialVideos.findIndex(v => v.id === id);
  const video = socialVideos[videoIndex];

  if(!video){
    return (
      <section className="placeholder">
        <h1>Video Not Found</h1>
        <p>The requested social studies video lesson could not be found.</p>
        <button className="back-btn" onClick={()=>navg('/social')}>
          ← Back to Social Studies List
        </button>
      </section>
    );
  }

  const embedUrl = video.drive ? video.drive.replace(/\/view(\?.*)?$/, '/preview') : '';
  const prevVideo = videoIndex > 0 ? socialVideos[videoIndex - 1] : null;
  const nextVideo = videoIndex < socialVideos.length - 1 ? socialVideos[videoIndex + 1] : null;

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={()=>navg('/social')}>
        ← Back to Social Studies Videos
      </button>

      <div className="post-header">
        <span className="badge">10TH CLASS • SOCIAL STUDIES</span>
        <h1>{video.title}</h1>
        <p>Lesson {String(video.id).padStart(2,'0')} of {socialVideos.length} • Digital Class Resource</p>
      </div>

      <div className="video-container">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      <div className="post-footer-actions">
        <a 
          href={video.drive} 
          target="_blank" 
          rel="noreferrer" 
          className="watch"
          style={{
            padding: '11px 20px',
            borderRadius: '999px',
            background: '#8d005f',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ↗ Open in Google Drive
        </a>

        <div className="nav-buttons">
          <button 
            disabled={!prevVideo} 
            onClick={()=>prevVideo && navg(`/social/${prevVideo.id}`)}
          >
            ← Previous Lesson
          </button>
          <button 
            disabled={!nextVideo} 
            onClick={()=>nextVideo && navg(`/social/${nextVideo.id}`)}
          >
            Next Lesson →
          </button>
        </div>
      </div>
    </div>
  );
}

function Placeholder({name}){
  return <section className="placeholder"><div className="badge">COMING LATER</div><h1>{name}</h1><p>The {name} page is reserved for the content migration. Its lessons, videos and links can be added without changing the site structure.</p></section>;
}

function App(){
  const loc=useLocation();
  const p=loc.pathname;
  const mathPostMatch = p.match(/^\/mathematics\/(\d+)$/);
  const phyPostMatch = p.match(/^\/physics\/(\d+)$/);
  const socialPostMatch = p.match(/^\/social\/(\d+)$/);

  let content;
  if(p==='/'||p===''){
    content=<Home/>;
  }else if(mathPostMatch){
    const videoId = parseInt(mathPostMatch[1], 10);
    content=<MathPostDetail id={videoId}/>;
  }else if(p==='/mathematics'||p==='/p/blog-page_18.html'){
    content=<Mathematics/>;
  }else if(phyPostMatch){
    const videoId = parseInt(phyPostMatch[1], 10);
    content=<PhysicsPostDetail id={videoId}/>;
  }else if(p==='/physics'||p==='/p/phy-science.html'){
    content=<PhysicalScience/>;
  }else if(socialPostMatch){
    const videoId = parseInt(socialPostMatch[1], 10);
    content=<SocialPostDetail id={videoId}/>;
  }else if(p==='/social'||p==='/p/social.html'){
    content=<SocialStudies/>;
  }else if(p==='/biology'||p==='/biological-science'){
    content=<Placeholder name="Biological Science"/>;
  }else{
    content=<Placeholder name="Social Studies"/>;
  }
  return <Layout>{content}</Layout>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);






