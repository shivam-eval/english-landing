// Variation A — Premium editorial, warm ivory + ink
// Serif-forward, generous whitespace, editorial magazine feel.

const VA_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#9a3412",
  "headline": "Your students practice Speaking between classes.",
  "italicWord": "Speaking",
  "showMarquee": false,
  "showHowItWorks": true,
  "showRubric": true,
  "showInstitutes": true,
  "portraitCaption": "Riya, Band 6 target 7.5\nRecording a Part 2 cue card"
}/*EDITMODE-END*/;

const VACtx = React.createContext(VA_DEFAULTS);

// ── Responsive hook ─────────────────────────────────
const useWindowWidth = () => {
  const [w, setW] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
};

const VariationA = () => {
  const [tweaks, setTweaks] = React.useState(VA_DEFAULTS);
  const [panelOpen, setPanelOpen] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setPanelOpen(true);
      if (d.type === '__deactivate_edit_mode') setPanelOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(_) {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setKey = (k, v) => {
    setTweaks(t => ({ ...t, [k]: v }));
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*'); } catch(_) {}
  };

  return (
    <VACtx.Provider value={tweaks}>
      <div style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', background: '#f5f1e8', color: '#1a1613', width: '100%', minHeight: '100%', overflow: 'hidden', position: 'relative' }}>
        <VANav />
        <VAHero />
        {tweaks.showMarquee && <VAMarquee />}
        {tweaks.showHowItWorks && <VAHowItWorks />}
        {tweaks.showRubric && <VARubric />}
        {tweaks.showInstitutes && <VAInstitutes />}
        <VAContact />
        <VAFooter />
        {panelOpen && <VATweaksPanel tweaks={tweaks} setKey={setKey} onClose={() => setPanelOpen(false)} />}
      </div>
    </VACtx.Provider>
  );
};

// ── Tweaks panel ───────────────────────────────────
const VATweaksPanel = ({ tweaks, setKey, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 24, right: 24, width: 320,
    background: '#1a1613', color: '#f5f1e8',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: 20, borderRadius: 4, zIndex: 9999,
    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
    maxHeight: '80vh', overflow: 'auto',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(245,241,232,0.2)' }}>
      <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 18, fontStyle: 'italic' }}>Tweaks</div>
      <div onClick={onClose} style={{ cursor: 'pointer', fontSize: 18, opacity: 0.7 }}>×</div>
    </div>

    <TLabel>Accent color</TLabel>
    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
      {['#9a3412','#0f766e','#1e40af','#7c2d12','#713f12','#1a1613'].map(c => (
        <div key={c} onClick={() => setKey('accentColor', c)} style={{
          width: 28, height: 28, background: c, borderRadius: '50%', cursor: 'pointer',
          border: tweaks.accentColor === c ? '2px solid #f5f1e8' : '2px solid transparent',
          outline: tweaks.accentColor === c ? '1px solid rgba(245,241,232,0.3)' : 'none',
        }} />
      ))}
    </div>

    <TLabel>Headline</TLabel>
    <textarea value={tweaks.headline} onChange={e => setKey('headline', e.target.value)} style={ttxt} rows={3} />

    <TLabel>Italic accent word</TLabel>
    <input value={tweaks.italicWord} onChange={e => setKey('italicWord', e.target.value)} style={ttxt} />

    <TLabel>Portrait caption</TLabel>
    <textarea value={tweaks.portraitCaption} onChange={e => setKey('portraitCaption', e.target.value)} style={ttxt} rows={2} />

    <TLabel>Sections</TLabel>
    {[
      ['showMarquee', 'Pilot marquee'],
      ['showHowItWorks', 'How it works'],
      ['showRubric', 'Feedback rubric'],
      ['showInstitutes', 'Why institutes partner'],
    ].map(([k, l]) => (
      <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, padding: '6px 0', cursor: 'pointer' }}>
        <input type="checkbox" checked={!!tweaks[k]} onChange={e => setKey(k, e.target.checked)} />
        {l}
      </label>
    ))}
  </div>
);

const TLabel = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,241,232,0.6)', marginBottom: 6, marginTop: 12 }}>{children}</div>
);
const ttxt = {
  width: '100%', boxSizing: 'border-box', background: 'rgba(245,241,232,0.08)',
  border: '1px solid rgba(245,241,232,0.15)', color: '#f5f1e8',
  fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13,
  padding: '8px 10px', borderRadius: 2, resize: 'vertical',
  marginBottom: 4,
};

// ── Nav ─────────────────────────────────────────────
const VANav = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? '28px' : '64px';

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: `28px ${px}`, borderBottom: '1px solid rgba(26,22,19,0.12)',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#1a1613', color: '#f5f1e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Source Serif 4", serif', fontStyle: 'italic',
          fontSize: 17, fontWeight: 500, flexShrink: 0,
        }}>V</div>
        <div style={{ fontSize: 18, letterSpacing: '-0.01em', fontWeight: 500 }}>Voice Evaluation</div>
      </a>

      {!mobile && (
        <div style={{ display: 'flex', gap: 36, fontSize: 14, color: 'rgba(26,22,19,0.72)', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <button onClick={() => scrollTo('how-it-works')} style={navBtn}>How it works</button>
          <button onClick={() => scrollTo('for-institutes')} style={navBtn}>For institutes</button>
          <button onClick={() => scrollTo('contact')} style={navBtn}>Contact</button>
        </div>
      )}

      <a
        href="mailto:shivam@voiceeval.com?subject=Pilot%20enquiry"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 13, padding: '9px 18px',
          border: '1px solid #1a1613', borderRadius: 2,
          letterSpacing: '0.02em', textDecoration: 'none', color: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        Book a pilot →
      </a>
    </nav>
  );
};

const navBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14,
  color: 'rgba(26,22,19,0.72)', padding: 0,
};

// ── Hero ────────────────────────────────────────────
const VAHero = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? '28px' : '64px';

  return (
    <div style={{
      padding: `80px ${px} 40px`,
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1.1fr 1fr',
      gap: mobile ? 48 : 80,
      alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 12, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(26,22,19,0.6)',
          marginBottom: 28,
        }}>
          A practice companion for IELTS coaching institutes
        </div>
        <VAHeadline />
        <p style={{
          fontSize: 19, lineHeight: 1.55, marginTop: 32,
          maxWidth: 520, color: 'rgba(26,22,19,0.75)',
          fontFamily: '"Source Serif 4", serif',
        }}>
          A WhatsApp companion that sits alongside your classroom teaching.
          Students send a voice note, receive instant band-style feedback in
          their preferred language, and hear model pronunciation. You see
          every attempt on a lightweight dashboard.
        </p>
        <div style={{ display: 'flex', gap: 20, marginTop: 44, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="mailto:shivam@voiceeval.com?subject=Pilot%20enquiry"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, padding: '16px 28px',
              background: '#1a1613', color: '#f5f1e8',
              borderRadius: 2, letterSpacing: '0.01em',
              textDecoration: 'none', display: 'inline-block',
            }}
          >
            Write to shivam@voiceeval.com
          </a>
          <a
            href="https://wa.me/919041926882?text=Hi%2C%20I%27m%20interested%20in%20a%20pilot"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, color: 'rgba(26,22,19,0.72)',
              textDecoration: 'none',
            }}
          >
            or WhatsApp +91 90419 26882
          </a>
        </div>
      </div>

      {!mobile && <VAHeroSplit />}
    </div>
  );
};

// ── Headline ─────────────────────────────────────
const VAHeadline = () => {
  const t = React.useContext(VACtx);
  const w = useWindowWidth();
  const fontSize = w < 600 ? 52 : w < 900 ? 64 : 84;
  const parts = t.headline.split(t.italicWord);
  return (
    <h1 style={{ fontSize, lineHeight: 0.98, letterSpacing: '-0.035em', margin: 0, fontWeight: 400 }}>
      {parts.length > 1 ? (
        <>
          {parts[0]}
          <em style={{ fontStyle: 'italic', color: t.accentColor }}>{t.italicWord}</em>
          {parts.slice(1).join(t.italicWord)}
        </>
      ) : t.headline}
    </h1>
  );
};

// ── Portrait placeholder ─────────────────────────
const VAPortrait = () => {
  const t = React.useContext(VACtx);
  return (
    <div style={{
      flex: 1, borderRadius: 4, overflow: 'hidden',
      background: 'repeating-linear-gradient(135deg, #e8e0cf 0px, #e8e0cf 12px, #ddd3bd 12px, #ddd3bd 24px)',
      position: 'relative', border: '1px solid rgba(26,22,19,0.08)',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 300 580" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="vaPortGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9b892" />
            <stop offset="1" stopColor="#8c7a5a" />
          </linearGradient>
        </defs>
        <path d="M 40 580 Q 40 430 150 390 Q 260 430 260 580 Z" fill="url(#vaPortGrad)" opacity="0.55" />
        <circle cx="150" cy="320" r="70" fill="url(#vaPortGrad)" opacity="0.6" />
        <path d="M 82 300 Q 90 245 150 240 Q 215 245 218 305 Q 210 275 150 272 Q 95 275 82 300 Z" fill="#5a4a33" opacity="0.65" />
        <rect x="205" y="340" width="28" height="46" rx="4" fill="#1a1613" opacity="0.75" />
        <rect x="208" y="344" width="22" height="34" rx="2" fill="#f5f1e8" opacity="0.3" />
        <path d="M 242 355 Q 252 362 242 369" stroke="#9a3412" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 250 348 Q 266 362 250 376" stroke="#9a3412" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M 258 340 Q 280 362 258 384" stroke="#9a3412" strokeWidth="1.5" fill="none" opacity="0.3" />
      </svg>
      <div style={{
        position: 'absolute', bottom: 28, left: 28, right: 28,
        fontFamily: '"Source Serif 4", serif', fontSize: 14, fontStyle: 'italic',
        color: 'rgba(26,22,19,0.8)', background: 'rgba(245,241,232,0.88)',
        padding: '12px 16px', borderRadius: 2, whiteSpace: 'pre-line',
        backdropFilter: 'blur(4px)',
      }}>
        {t.portraitCaption}
      </div>
      <div style={{
        position: 'absolute', top: 20, left: 20,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(26,22,19,0.4)', letterSpacing: '0.14em',
      }}>
        FIG. 01 / STUDENT
      </div>
    </div>
  );
};

const VAHeroSplit = () => (
  <div style={{ position: 'relative', height: 620, display: 'flex', gap: 16 }}>
    <VAPortrait />
    <VAChatWindow />
  </div>
);

const VAChatWindow = () => (
  <div style={{
    flex: 1, background: '#ece5d8', borderRadius: 4,
    border: '1px solid rgba(26,22,19,0.1)',
    display: 'flex', flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: '0 24px 48px -24px rgba(26,22,19,0.2)',
  }}>
    <div style={{
      padding: '14px 18px', background: '#f6f0e3',
      borderBottom: '1px solid rgba(26,22,19,0.08)',
      borderRadius: '4px 4px 0 0',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#1a1613', color: '#f5f1e8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 17,
      }}>V</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1613' }}>Voice Evaluation</div>
        <div style={{ fontSize: 11, color: '#22c55e' }}>● online</div>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(26,22,19,0.5)', letterSpacing: '0.08em' }}>WHATSAPP</div>
    </div>

    <div style={{ flex: 1, padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
      <ChatBubble from="bot">Part 2 cue card. <i>Describe a place you visited recently.</i> You'll have 2 minutes. Record when ready.</ChatBubble>
      <ChatBubble from="user" voice duration="1:42" />
      <ChatBubble from="bot" card>
        <div style={{ fontSize: 11, color: 'rgba(26,22,19,0.55)', letterSpacing: '0.1em', marginBottom: 6 }}>ESTIMATED BAND</div>
        <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 28, lineHeight: 1, marginBottom: 10 }}>6.5</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(26,22,19,0.78)' }}>
          Fluent delivery, natural pace. Stress the word <b>"extraordinary"</b> on the second syllable. Hear the sample below.
        </div>
      </ChatBubble>
      <ChatBubble from="bot" voice duration="0:28" model />
    </div>

    <div style={{
      padding: '10px 14px', borderTop: '1px solid rgba(26,22,19,0.08)',
      background: '#f6f0e3', borderRadius: '0 0 4px 4px',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 12, color: 'rgba(26,22,19,0.5)',
    }}>
      <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '8px 14px' }}>Message</div>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎤</div>
    </div>
  </div>
);

const ChatBubble = ({ from, voice, duration, model, card, children }) => {
  const isUser = from === 'user';
  const bg = isUser ? '#d9f4cc' : '#ffffff';
  const align = isUser ? 'flex-end' : 'flex-start';
  return (
    <div style={{ alignSelf: align, maxWidth: '82%' }}>
      <div style={{
        background: bg, padding: voice ? '10px 12px' : (card ? '14px 16px' : '10px 14px'),
        borderRadius: isUser ? '8px 8px 2px 8px' : '2px 8px 8px 8px',
        fontSize: 13, lineHeight: 1.45, color: '#1a1613',
        boxShadow: '0 1px 1px rgba(0,0,0,0.04)',
      }}>
        {voice ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: isUser ? '#25D366' : '#1a1613', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}>▶</div>
            <svg width="120" height="20" viewBox="0 0 120 20">
              {[...Array(30)].map((_, i) => {
                const h = 4 + ((i * 7) % 14);
                return <rect key={i} x={i * 4} y={(20 - h) / 2} width="2" height={h} fill={isUser ? '#1a7f3a' : '#6b5d48'} opacity="0.7"/>;
              })}
            </svg>
            <div style={{ fontSize: 11, color: 'rgba(26,22,19,0.55)' }}>{duration}</div>
          </div>
        ) : children}
        {model && (
          <div style={{ fontSize: 10, color: 'rgba(26,22,19,0.5)', marginTop: 6, letterSpacing: '0.08em' }}>
            MODEL PRONUNCIATION SAMPLE
          </div>
        )}
      </div>
    </div>
  );
};

// ── Marquee strip ───────────────────────────────────
const VAMarquee = () => (
  <div style={{
    padding: '28px 64px', borderTop: '1px solid rgba(26,22,19,0.12)', borderBottom: '1px solid rgba(26,22,19,0.12)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
    fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, color: 'rgba(26,22,19,0.65)',
    letterSpacing: '0.05em',
  }}>
    <span>IN PILOT WITH</span>
    <span style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 16 }}>Agarwal IELTS</span>
    <span style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 16 }}>Kanan Coaching</span>
    <span style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 16 }}>Prep Avenue</span>
    <span>3 COACHING CENTERS · NORTH INDIA</span>
  </div>
);

// ── How it works ────────────────────────────────────
const VAHowItWorks = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? '28px' : '64px';
  const cols = w < 600 ? '1fr' : w < 900 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';

  return (
    <section id="how-it-works" style={{ padding: `96px ${px}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
        <h2 style={{ fontSize: mobile ? 40 : 56, margin: 0, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>
          How it works <em style={{ fontStyle: 'italic', color: '#9a3412' }}>in a day</em>
        </h2>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, color: 'rgba(26,22,19,0.6)', maxWidth: 320, lineHeight: 1.55 }}>
          No new app. No logins. Students already live on WhatsApp and simply
          start chatting with a number you share in class.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 2, border: '1px solid rgba(26,22,19,0.12)', background: 'rgba(26,22,19,0.12)' }}>
        {[
          { n: '01', t: 'Onboard', d: 'Student sends "Hi" on WhatsApp. Bot asks name, preferred language (Hindi, Tamil, Hinglish…), target band, test date.' },
          { n: '02', t: 'Prompt', d: 'Bot sends an IELTS Speaking prompt from Part 1, 2 or 3, rotated across topics like work, travel, technology, health.' },
          { n: '03', t: 'Respond', d: 'Student records a voice note on WhatsApp. Audio is transcribed via Sarvam STT and evaluated against the IELTS rubric.' },
          { n: '04', t: 'Feedback', d: 'Within seconds, band-style feedback arrives in their language. If pronunciation is weak, a model audio sample is sent to imitate.' },
        ].map((s) => (
          <div key={s.n} style={{ background: '#f5f1e8', padding: '36px 28px 32px', minHeight: 240 }}>
            <div style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 13, color: '#9a3412', marginBottom: 28 }}>{s.n}</div>
            <div style={{ fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 14 }}>{s.t}</div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, lineHeight: 1.6, color: 'rgba(26,22,19,0.72)' }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Rubric ──────────────────────────────────────────
const VARubric = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? '28px' : '64px';

  return (
    <section style={{ padding: `96px ${px}`, background: '#ece5d8', borderTop: '1px solid rgba(26,22,19,0.12)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1.3fr', gap: mobile ? 48 : 80, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,22,19,0.55)', marginBottom: 24 }}>
            What students get
          </div>
          <h2 style={{ fontSize: mobile ? 40 : 56, margin: 0, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
            Feedback that<br />mirrors the<br /><em style={{ fontStyle: 'italic', color: '#9a3412' }}>examiner.</em>
          </h2>
          <p style={{ fontFamily: '"Source Serif 4", serif', fontSize: 17, lineHeight: 1.55, color: 'rgba(26,22,19,0.72)', marginTop: 28, maxWidth: 380 }}>
            Every voice note is scored against the four official IELTS Speaking
            criteria. Strengths, improvements, and a corrected phrase are returned
            in the student's preferred language.
          </p>
        </div>

        <div style={{ background: '#f5f1e8', padding: mobile ? 24 : 40, border: '1px solid rgba(26,22,19,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 24, borderBottom: '1px solid rgba(26,22,19,0.12)', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)' }}>SUBMISSION · PART 2</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 17, marginTop: 6 }}>Describe a place you visited recently.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)' }}>EST. BAND</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 42, lineHeight: 1, marginTop: 2 }}>6.5</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
            {[
              { l: 'Fluency', v: 7 },
              { l: 'Lexical', v: 6 },
              { l: 'Grammar', v: 6 },
              { l: 'Pronunciation', v: 5 },
            ].map((c) => (
              <div key={c.l}>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)', textTransform: 'uppercase' }}>{c.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                  <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 28 }}>{c.v}</div>
                  <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: 'rgba(26,22,19,0.45)' }}>/9</div>
                </div>
                <div style={{ height: 2, background: 'rgba(26,22,19,0.1)', marginTop: 8 }}>
                  <div style={{ height: '100%', width: `${(c.v / 9) * 100}%`, background: '#9a3412' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 24, borderTop: '1px solid rgba(26,22,19,0.12)' }}>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)', marginBottom: 10 }}>✓ WHAT WENT WELL</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 14, lineHeight: 1.5, color: 'rgba(26,22,19,0.82)' }}>
                Natural pace, clear structure, confident use of past tense markers.
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: '#9a3412', marginBottom: 10 }}>→ IMPROVE</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 14, lineHeight: 1.5, color: 'rgba(26,22,19,0.82)' }}>
                Stress on "extraordinary" on the second syllable. Model audio sent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Why institutes partner ─────────────────────────
const VAInstitutes = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? '28px' : '64px';
  const cols = mobile ? '1fr' : 'repeat(2, 1fr)';

  return (
    <section id="for-institutes" style={{ padding: `96px ${px}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 64, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ fontSize: mobile ? 44 : 64, margin: 0, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 0.98, maxWidth: 720 }}>
          Why coaching<br />institutes <em style={{ fontStyle: 'italic', color: '#9a3412' }}>partner</em> with us.
        </h2>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: 'rgba(26,22,19,0.55)', letterSpacing: '0.1em' }}>
          04 REASONS
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 2, background: 'rgba(26,22,19,0.12)', border: '1px solid rgba(26,22,19,0.12)' }}>
        {[
          { n: 'I', t: 'Extends your classroom, doesn\'t replace it.', d: 'Students get unlimited speaking reps between your classes. Your curriculum and pacing stay yours; we just add the practice loop.' },
          { n: 'II', t: 'Zero friction for students.', d: 'No app install, no login. Students already use WhatsApp every day and simply message a number you hand out in class.' },
          { n: 'III', t: 'Feedback in their language.', d: 'Hindi, Tamil, Telugu, Bengali, Hinglish, English. Feedback arrives in whatever language the student is most comfortable in.' },
          { n: 'IV', t: 'A lightweight dashboard for teachers.', d: 'See who practiced, which questions they attempted, and where they\'re stuck, without leaving Google Sheets.' },
        ].map((r) => (
          <div key={r.n} style={{ background: '#f5f1e8', padding: '40px 36px 44px' }}>
            <div style={{ display: 'flex', gap: 28 }}>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 20, color: '#9a3412', marginTop: 4 }}>
                {r.n}.
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 14 }}>{r.t}</div>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, lineHeight: 1.6, color: 'rgba(26,22,19,0.72)' }}>{r.d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Contact ─────────────────────────────────────────
const VAContact = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? '28px' : '64px';
  const headingSize = w < 600 ? 44 : mobile ? 60 : 84;

  return (
    <section id="contact" style={{ padding: `120px ${px}`, background: '#1a1613', color: '#f5f1e8' }}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,241,232,0.55)', marginBottom: 28 }}>
          Start a pilot
        </div>
        <h2 style={{ fontSize: headingSize, margin: 0, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 0.98 }}>
          Run a free pilot<br />with your next<br /><em style={{ fontStyle: 'italic', color: '#f59e0b' }}>cohort of students.</em>
        </h2>
        <p style={{ fontFamily: '"Source Serif 4", serif', fontSize: 20, lineHeight: 1.55, marginTop: 32, maxWidth: 620, color: 'rgba(245,241,232,0.75)' }}>
          Two weeks. No cost. We onboard your students, hand you the dashboard,
          and you decide whether it belongs in your program.
        </p>
        <div style={{ display: 'flex', gap: 48, marginTop: 56, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'rgba(245,241,232,0.5)', marginBottom: 8 }}>EMAIL</div>
            <a href="mailto:shivam@voiceeval.com?subject=Pilot%20enquiry" style={{ fontFamily: '"Source Serif 4", serif', fontSize: 26, color: '#f5f1e8', textDecoration: 'none' }}>
              shivam@voiceeval.com
            </a>
          </div>
          <div style={{ width: 1, height: 60, background: 'rgba(245,241,232,0.2)', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'rgba(245,241,232,0.5)', marginBottom: 8 }}>WHATSAPP</div>
            <a href="https://wa.me/919041926882?text=Hi%2C%20I%27m%20interested%20in%20a%20pilot" target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Source Serif 4", serif', fontSize: 26, color: '#f5f1e8', textDecoration: 'none' }}>
              +91 90419 26882
            </a>
          </div>
          <div style={{ width: 1, height: 60, background: 'rgba(245,241,232,0.2)', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'rgba(245,241,232,0.5)', marginBottom: 8 }}>FOUNDER</div>
            <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 26 }}>Shivam Gupta</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VAFooter = () => (
  <footer style={{ padding: '28px 64px', background: '#1a1613', color: 'rgba(245,241,232,0.5)', borderTop: '1px solid rgba(245,241,232,0.12)', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, letterSpacing: '0.06em' }}>
    <div>© 2026 VOICE EVALUATION</div>
    <div>MADE FOR IELTS COACHING INSTITUTES · INDIA</div>
  </footer>
);

window.VariationA = VariationA;
