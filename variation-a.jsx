// English Mitra — your WhatsApp friend for spoken English practice.
// Warm, simple, local. For Hindi/Hinglish learners across India.

const VA_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#9a3412",
  "headline": "English Mitra",
  "italicWord": "Mitra",
  "subheadline": "Your WhatsApp friend for spoken English practice.",
  "copy": "Send a voice note and get simple feedback on grammar, vocabulary, fluency, clarity, and pronunciation.",
  "showHowItWorks": true,
  "showSituations": true,
  "showFeedback": true
}/*EDITMODE-END*/;

const VACtx = React.createContext(VA_DEFAULTS);

// ── Layout constants ────────────────────────────────
const PX_DESKTOP = 'clamp(32px, 5vw, 72px)';
const PX_MOBILE  = '24px';

const WA_NUMBER_DISPLAY = '+91 90419 26882';
const WA_LINK = 'https://wa.me/919041926882?text=Hi%20English%20Mitra%21%20I%20want%20to%20practise%20English.';
const WA_GREEN = '#25D366';
const WA_GREEN_DARK = '#128C7E';

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
        {tweaks.showHowItWorks && <VAHowItWorks />}
        {tweaks.showSituations && <VASituations />}
        {tweaks.showFeedback && <VAFeedback />}
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
    <input value={tweaks.headline} onChange={e => setKey('headline', e.target.value)} style={ttxt} />

    <TLabel>Italic accent word</TLabel>
    <input value={tweaks.italicWord} onChange={e => setKey('italicWord', e.target.value)} style={ttxt} />

    <TLabel>Subheadline</TLabel>
    <textarea value={tweaks.subheadline} onChange={e => setKey('subheadline', e.target.value)} style={ttxt} rows={2} />

    <TLabel>Hero copy</TLabel>
    <textarea value={tweaks.copy} onChange={e => setKey('copy', e.target.value)} style={ttxt} rows={3} />

    <TLabel>Sections</TLabel>
    {[
      ['showHowItWorks', 'How it works'],
      ['showSituations', 'Practice situations'],
      ['showFeedback', 'Feedback you get'],
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

// ── WhatsApp icon (simple, no logo trademark) ──────
const WAIcon = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.84.5 3.56 1.36 5.04L2 22l5.13-1.34A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.04 14.21c-.21.6-1.21 1.14-1.7 1.21-.43.07-.99.1-1.6-.1-.37-.12-.84-.27-1.45-.54-2.55-1.1-4.21-3.66-4.34-3.83-.13-.17-1.04-1.38-1.04-2.63 0-1.25.66-1.86.89-2.12.23-.25.5-.32.67-.32.17 0 .33.01.48.02.16.01.36-.06.57.43.21.5.71 1.74.77 1.86.06.13.1.27.02.43-.08.17-.12.27-.24.41-.12.13-.25.3-.36.4-.12.12-.25.25-.11.49.13.25.6.99 1.29 1.6.89.79 1.64 1.03 1.88 1.16.24.13.39.11.53-.06.13-.17.6-.7.76-.94.16-.25.32-.21.55-.12.22.08 1.4.66 1.64.78.24.12.4.18.45.27.07.12.07.69-.14 1.36z" fill={color}/>
  </svg>
);

// ── Nav ─────────────────────────────────────────────
const VANav = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const small = w < 480;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: `24px ${px}`, borderBottom: '1px solid rgba(26,22,19,0.12)',
      gap: 16,
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#1a1613', color: '#f5f1e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Source Serif 4", serif', fontStyle: 'italic',
          fontSize: 19, fontWeight: 500, flexShrink: 0,
        }}>M</div>
        <div style={{ fontSize: 19, letterSpacing: '-0.01em', fontWeight: 500, whiteSpace: 'nowrap' }}>English Mitra</div>
      </a>

      {!mobile && (
        <div style={{ display: 'flex', gap: 32, fontSize: 14, color: 'rgba(26,22,19,0.72)', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <button onClick={() => scrollTo('how-it-works')} style={navBtn}>How it works</button>
          <button onClick={() => scrollTo('situations')} style={navBtn}>Practice situations</button>
          <button onClick={() => scrollTo('feedback')} style={navBtn}>Feedback</button>
          <button onClick={() => scrollTo('contact')} style={navBtn}>Contact</button>
        </div>
      )}

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 13, padding: '10px 16px', fontWeight: 500,
          background: WA_GREEN, color: '#fff',
          borderRadius: 999,
          letterSpacing: '0.01em', textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
          boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
        }}
      >
        <WAIcon size={15} />
        {small ? 'WhatsApp' : 'Start on WhatsApp'}
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
  const t = React.useContext(VACtx);
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;

  return (
    <div style={{
      padding: `${mobile ? 56 : 88}px ${px} ${mobile ? 48 : 64}px`,
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1.1fr 1fr',
      gap: mobile ? 56 : 72,
      alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 12, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(26,22,19,0.6)',
          marginBottom: 28,
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: WA_GREEN, display: 'inline-block' }} />
          Spoken English practice on WhatsApp
        </div>
        <VAHeadline />
        <p style={{
          fontSize: mobile ? 22 : 28, lineHeight: 1.35, marginTop: 28, marginBottom: 0,
          maxWidth: 560, color: '#1a1613',
          fontFamily: '"Source Serif 4", serif',
          fontStyle: 'italic',
          fontWeight: 400,
        }}>
          {t.subheadline}
        </p>
        <p style={{
          fontSize: 18, lineHeight: 1.6, marginTop: 18, marginBottom: 0,
          maxWidth: 540, color: 'rgba(26,22,19,0.78)',
          fontFamily: '"Source Serif 4", serif',
        }}>
          {t.copy}
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 15, padding: '16px 28px', fontWeight: 500,
              background: WA_GREEN, color: '#fff',
              borderRadius: 6, letterSpacing: '0.01em',
              textDecoration: 'none',
              boxShadow: '0 6px 18px -8px rgba(37,211,102,0.6)',
            }}
          >
            <WAIcon size={18} />
            Start on WhatsApp
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, color: 'rgba(26,22,19,0.7)',
              textDecoration: 'none',
            }}
          >
            or message {WA_NUMBER_DISPLAY}
          </a>
        </div>
        <div style={{
          marginTop: 32, fontSize: 13,
          color: 'rgba(26,22,19,0.55)',
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '0.02em',
        }}>
          Hindi · Hinglish · English — speak in whatever feels easy.
        </div>
      </div>

      {!mobile && <VAChatWindow />}
    </div>
  );
};

// ── Headline ─────────────────────────────────────
const VAHeadline = () => {
  const t = React.useContext(VACtx);
  const w = useWindowWidth();
  const fontSize = w < 480 ? 56 : w < 700 ? 72 : w < 900 ? 84 : 96;
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

// ── Chat window (hero visual) ───────────────────
const VAChatWindow = () => (
  <div style={{
    background: '#ece5d8', borderRadius: 8,
    border: '1px solid rgba(26,22,19,0.12)',
    display: 'flex', flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: '0 32px 60px -28px rgba(26,22,19,0.28)',
    height: 640, maxWidth: 420, marginLeft: 'auto', width: '100%',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '14px 18px', background: WA_GREEN_DARK, color: '#fff',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: '#f5f1e8', color: '#1a1613',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 19,
      }}>M</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>English Mitra</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>online</div>
      </div>
      <WAIcon size={18} />
    </div>

    <div style={{
      flex: 1, padding: '18px 14px',
      display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden',
      background: '#ece5d8',
      backgroundImage: 'radial-gradient(rgba(26,22,19,0.04) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      <ChatBubble from="bot">
        Namaste! I'm English Mitra. Send a voice note in English — about your day, your work, anything. Don't worry about mistakes.
      </ChatBubble>
      <ChatBubble from="user" voice duration="1:24" />
      <ChatBubble from="bot" card>
        <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 15, lineHeight: 1.4, color: '#1a1613', marginBottom: 10 }}>
          Easy to understand. Nice rhythm.
        </div>
        <div style={{ display: 'grid', rowGap: 6, marginBottom: 10 }}>
          {[
            ['Grammar', 'small fix'],
            ['Vocabulary', 'good'],
            ['Fluency', 'smooth'],
            ['Clarity', 'clear'],
            ['Pronunciation', 'sample below'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'rgba(26,22,19,0.72)' }}>{k}</span>
              <span style={{ color: '#1a1613', fontStyle: 'italic', fontFamily: '"Source Serif 4", serif' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 10, borderTop: '1px solid rgba(26,22,19,0.08)',
          fontSize: 12, lineHeight: 1.5, color: 'rgba(26,22,19,0.78)',
        }}>
          Try <b>"I went to the market"</b> instead of <b>"I gone to market"</b>.
        </div>
      </ChatBubble>
      <ChatBubble from="bot" voice duration="0:18" model />
    </div>

    <div style={{
      padding: '10px 14px', borderTop: '1px solid rgba(26,22,19,0.08)',
      background: '#f6f0e3',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 12, color: 'rgba(26,22,19,0.5)',
    }}>
      <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '8px 14px' }}>Message</div>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: WA_GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎤</div>
    </div>
  </div>
);

const ChatBubble = ({ from, voice, duration, model, card, children }) => {
  const isUser = from === 'user';
  const bg = isUser ? '#d9f4cc' : '#ffffff';
  const align = isUser ? 'flex-end' : 'flex-start';
  return (
    <div style={{ alignSelf: align, maxWidth: '88%' }}>
      <div style={{
        background: bg, padding: voice ? '10px 12px' : (card ? '14px 16px' : '10px 14px'),
        borderRadius: isUser ? '10px 10px 2px 10px' : '2px 10px 10px 10px',
        fontSize: 13, lineHeight: 1.5, color: '#1a1613',
        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      }}>
        {voice ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: isUser ? WA_GREEN : '#1a1613', color: '#fff',
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
          <div style={{ fontSize: 10, color: 'rgba(26,22,19,0.55)', marginTop: 6, letterSpacing: '0.08em' }}>
            SAMPLE PRONUNCIATION
          </div>
        )}
      </div>
    </div>
  );
};

// ── How it works ────────────────────────────────────
const VAHowItWorks = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;
  const cols = w < 600 ? '1fr' : w < 900 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';

  return (
    <section id="how-it-works" style={{ padding: `${mobile ? 72 : 96}px ${px}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
        <h2 style={{ fontSize: mobile ? 40 : 56, margin: 0, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>
          How it <em style={{ fontStyle: 'italic', color: '#9a3412' }}>works.</em>
        </h2>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, color: 'rgba(26,22,19,0.65)', maxWidth: 360, lineHeight: 1.6 }}>
          No app to download. No login. Open WhatsApp, send a message, start practising.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 2, border: '1px solid rgba(26,22,19,0.12)', background: 'rgba(26,22,19,0.12)' }}>
        {[
          { n: '01', t: 'Say hi', d: 'Tap the WhatsApp button on this page. A simple "Hi" gets you started — no forms, no signup.' },
          { n: '02', t: 'Pick a topic', d: 'Mitra suggests a topic — your day, a job interview question, a phone call. Or pick your own.' },
          { n: '03', t: 'Send a voice note', d: 'Speak in English the way you would normally. One minute is enough. Mistakes are welcome.' },
          { n: '04', t: 'Get simple feedback', d: 'Within seconds, friendly feedback in your language. Plus a sample pronunciation to copy.' },
        ].map((s) => (
          <div key={s.n} style={{ background: '#f5f1e8', padding: '36px 28px 32px', minHeight: 240 }}>
            <div style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 14, color: '#9a3412', marginBottom: 28 }}>{s.n}</div>
            <div style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.15 }}>{s.t}</div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, lineHeight: 1.6, color: 'rgba(26,22,19,0.72)' }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Real-life practice situations ───────────────────
const VASituations = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;
  const cols = w < 600 ? '1fr' : w < 900 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  const items = [
    { n: 'I',   t: 'Daily life',   d: 'Order food, ask for directions, talk to your neighbours, manage simple errands in English.' },
    { n: 'II',  t: 'At work',      d: 'Speak up in meetings, talk to colleagues, share a daily update without freezing.' },
    { n: 'III', t: 'Job interviews', d: '"Tell me about yourself." "Why this role?" Practise the questions you\'ll actually be asked.' },
    { n: 'IV',  t: 'Phone calls',  d: 'Customer calls, support callbacks, talking to a client without losing your thread.' },
    { n: 'V',   t: 'Confident conversation', d: 'Small talk, introductions, asking questions. Build the habit one voice note at a time.' },
  ];

  return (
    <section id="situations" style={{ padding: `${mobile ? 72 : 96}px ${px}`, background: '#ece5d8', borderTop: '1px solid rgba(26,22,19,0.12)', borderBottom: '1px solid rgba(26,22,19,0.12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
        <h2 style={{ fontSize: mobile ? 40 : 56, margin: 0, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, maxWidth: 700 }}>
          Practise for <em style={{ fontStyle: 'italic', color: '#9a3412' }}>real life.</em>
        </h2>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, color: 'rgba(26,22,19,0.65)', maxWidth: 360, lineHeight: 1.6 }}>
          Speak about the situations you actually face — at work, on calls, in interviews, in everyday conversations.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 2, border: '1px solid rgba(26,22,19,0.12)', background: 'rgba(26,22,19,0.12)' }}>
        {items.map((s) => (
          <div key={s.n} style={{ background: '#f5f1e8', padding: '36px 28px 36px', minHeight: 220 }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 18, color: '#9a3412', flexShrink: 0 }}>{s.n}.</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2 }}>{s.t}</div>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, lineHeight: 1.6, color: 'rgba(26,22,19,0.72)' }}>{s.d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Feedback you get ────────────────────────────────
const VAFeedback = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;

  const dimensions = [
    { l: 'Grammar',       d: 'Small fixes for tense, articles, agreement.' },
    { l: 'Vocabulary',    d: 'Better words for what you mean. Phrases people use.' },
    { l: 'Fluency',       d: 'How smoothly you speak — pauses, fillers, rhythm.' },
    { l: 'Clarity',       d: 'How easy you are to follow.' },
    { l: 'Pronunciation', d: 'Specific words and sounds, with a model audio to copy.' },
  ];

  return (
    <section id="feedback" style={{ padding: `${mobile ? 72 : 96}px ${px}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1.3fr', gap: mobile ? 48 : 80, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,22,19,0.55)', marginBottom: 24 }}>
            Feedback you get
          </div>
          <h2 style={{ fontSize: mobile ? 40 : 56, margin: 0, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
            Five simple<br />things to <em style={{ fontStyle: 'italic', color: '#9a3412' }}>look at.</em>
          </h2>
          <p style={{ fontFamily: '"Source Serif 4", serif', fontSize: 17, lineHeight: 1.6, color: 'rgba(26,22,19,0.75)', marginTop: 28, maxWidth: 380 }}>
            No scores. No jargon. Just what's working, what to try next, and a sample to copy when pronunciation is the problem.
          </p>
        </div>

        <div style={{ background: '#f5f1e8', padding: mobile ? 24 : 36, border: '1px solid rgba(26,22,19,0.12)', borderRadius: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid rgba(26,22,19,0.12)', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)' }}>YOUR VOICE NOTE</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontStyle: 'italic', fontSize: 17, marginTop: 6 }}>About my morning at work</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)' }}>LENGTH</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 22, marginTop: 4 }}>1:24</div>
            </div>
          </div>

          <div style={{ display: 'grid', rowGap: 14, marginBottom: 24 }}>
            {dimensions.map((c) => (
              <div key={c.l} style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '160px 1fr', gap: mobile ? 4 : 24, alignItems: 'baseline' }}>
                <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 18, color: '#1a1613' }}>
                  {c.l}
                </div>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, lineHeight: 1.55, color: 'rgba(26,22,19,0.72)' }}>
                  {c.d}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 16 : 24, paddingTop: 20, borderTop: '1px solid rgba(26,22,19,0.12)' }}>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(26,22,19,0.55)', marginBottom: 8 }}>✓ WHAT WENT WELL</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 15, lineHeight: 1.5, color: 'rgba(26,22,19,0.85)' }}>
                Steady pace, easy to follow, confident answers.
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, letterSpacing: '0.12em', color: '#9a3412', marginBottom: 8 }}>→ TRY NEXT</div>
              <div style={{ fontFamily: '"Source Serif 4", serif', fontSize: 15, lineHeight: 1.5, color: 'rgba(26,22,19,0.85)' }}>
                Say "I went to the market" instead of "I gone to market". Sample audio sent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Contact ─────────────────────────────────────────
const VAContact = () => {
  const w = useWindowWidth();
  const mobile = w < 900;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;
  const headingSize = w < 600 ? 40 : mobile ? 56 : 76;

  return (
    <section id="contact" style={{ padding: `${mobile ? 80 : 120}px ${px}`, background: '#1a1613', color: '#f5f1e8' }}>
      <div style={{ maxWidth: 880 }}>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,241,232,0.55)', marginBottom: 24 }}>
          Start today
        </div>
        <h2 style={{ fontSize: headingSize, margin: 0, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 0.98 }}>
          Send your first<br />voice note. <em style={{ fontStyle: 'italic', color: '#f59e0b' }}>That's it.</em>
        </h2>
        <p style={{ fontFamily: '"Source Serif 4", serif', fontSize: mobile ? 18 : 20, lineHeight: 1.55, marginTop: 28, maxWidth: 600, color: 'rgba(245,241,232,0.78)' }}>
          One minute of speaking. A few seconds of feedback. Speak in Hindi, Hinglish, or English — whatever feels comfortable. No app, no signup.
        </p>
        <div style={{ display: 'flex', gap: 20, marginTop: 44, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 16, padding: '18px 30px', fontWeight: 500,
              background: WA_GREEN, color: '#fff',
              borderRadius: 6, letterSpacing: '0.01em',
              textDecoration: 'none',
            }}
          >
            <WAIcon size={20} />
            Start on WhatsApp
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: '"Source Serif 4", serif',
              fontSize: 20, color: '#f5f1e8',
              textDecoration: 'none',
              opacity: 0.85,
            }}
          >
            {WA_NUMBER_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
};

const VAFooter = () => {
  const w = useWindowWidth();
  const mobile = w < 700;
  const px = mobile ? PX_MOBILE : PX_DESKTOP;
  return (
    <footer style={{
      padding: `28px ${px}`, background: '#1a1613',
      color: 'rgba(245,241,232,0.55)',
      borderTop: '1px solid rgba(245,241,232,0.12)',
      fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12,
      display: 'flex', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12, letterSpacing: '0.06em',
    }}>
      <div>© 2026 ENGLISH MITRA</div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>SPOKEN ENGLISH PRACTICE · MADE IN INDIA</span>
        <a href="privacy.html" style={{ color: 'inherit', textDecoration: 'none' }}>PRIVACY</a>
      </div>
    </footer>
  );
};

window.VariationA = VariationA;
