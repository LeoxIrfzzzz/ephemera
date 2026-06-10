/**
 * Ephemera - The Silent Network
 * Application Engine & Local State Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize synthesizers
  const audio = new window.EphemeraAudio();
  
  // DOM Selection
  const typewriterInput = document.getElementById('typewriterInput');
  const charCount = document.getElementById('charCount');
  const carriageLever = document.getElementById('carriageLever');
  const paperSheet = document.getElementById('paperSheet');
  const platenKnob = document.getElementById('platenKnob');
  
  // Control Panel DOM
  const muteToggle = document.getElementById('muteToggle');
  const ambientSelect = document.getElementById('ambientSelect');
  const volumeSlider = document.getElementById('volumeSlider');
  const ambientSlider = document.getElementById('ambientSlider');
  const crtToggle = document.getElementById('crtToggle');
  const themeToggle = document.getElementById('themeToggle');
  
  // Sandbox Simulator DOM
  const timeWarpSlider = document.getElementById('timeWarpSlider');
  const timeWarpLabel = document.getElementById('timeWarpLabel');
  const resetWarpBtn = document.getElementById('resetWarpBtn');
  
  // Feed DOM
  const thoughtFeed = document.getElementById('thoughtFeed');
  const activeThoughtsCount = document.getElementById('activeThoughtsCount');
  const emptyState = document.getElementById('emptyState');
  const clearStorageLink = document.getElementById('clearStorageLink');
  const statusClock = document.getElementById('statusClock');
  
  // State variables
  let posts = [];
  let isMuted = false;
  let isAmbientOn = false;
  let hasWarnedMargin = false; // flag to only play warning chime once per submission
  
  // 1. Initialise clock display in header
  function updateSystemClock() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    statusClock.innerText = `SYS.ACTIVE: ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  setInterval(updateSystemClock, 1000);
  updateSystemClock();

  // 2. Mock Data seed (loads if localStorage is empty to show decay states immediately)
  const seedPosts = [
    {
      id: "seed-1",
      content: "We write our secrets on running water, hoping someone reads them before they fade into the stream.",
      timestamp: Date.now() - (2.5 * 60 * 60 * 1000) // 2.5 hours ago (Fresh Ink)
    },
    {
      id: "seed-2",
      content: "Does anyone else listen to the rain outside and feel completely separated from the digital noise? There is an immense warmth in this silence.",
      timestamp: Date.now() - (11.5 * 60 * 60 * 1000) // 11.5 hours ago (Partially Faded)
    },
    {
      id: "seed-3",
      content: "I wanted to tell you how much I missed you. But now I'll just leave it here, on this digital carbon paper, to disintegrate quietly overnight.",
      timestamp: Date.now() - (19.8 * 60 * 60 * 1000) // ~20 hours ago (Heavily Decayed, Blur active)
    },
    {
      id: "seed-4",
      content: "The typewriter holds the ghost of every keystroke, but this screen forgets everything by tomorrow. A perfect confessional.",
      timestamp: Date.now() - (23.6 * 60 * 60 * 1000) // ~23.5 hours ago (Almost vanished, near ghost status)
    }
  ];

  // 3. Load database from LocalStorage
  function loadDatabase() {
    try {
      const stored = localStorage.getItem('ephemera_thoughts');
      if (stored) {
        posts = JSON.parse(stored);
      } else {
        posts = [...seedPosts];
        saveDatabase();
      }
    } catch (e) {
      console.error("Local storage access failed, starting in-memory:", e);
      posts = [...seedPosts];
    }
  }

  function saveDatabase() {
    try {
      localStorage.setItem('ephemera_thoughts', JSON.stringify(posts));
    } catch (e) {
      console.warn("Could not save to local storage:", e);
    }
  }

  // Helper to get character length of the current line being typed
  function getCursorLineLength() {
    const text = typewriterInput.value;
    const selectionEnd = typewriterInput.selectionEnd;
    const textBeforeCursor = text.substring(0, selectionEnd);
    const lines = textBeforeCursor.split('\n');
    return lines[lines.length - 1].length;
  }

  // Spawn organic ink splatters on typing
  function spawnInkSplatter() {
    const isCarbon = document.documentElement.getAttribute('data-theme') !== 'parchment';
    // Dark espresso ink vs dark sepia ink
    const inkColor = isCarbon ? 'rgba(35, 24, 16, 0.75)' : 'rgba(97, 90, 82, 0.75)';

    const ink = document.createElement('span');
    ink.className = 'ink-splatter';
    
    // Random size between 1.5px and 4px
    const size = 1.5 + Math.random() * 2.5;
    
    // Position randomly on the paper area (mostly around the typing area)
    const x = 10 + Math.random() * 80; // percent
    const y = 30 + Math.random() * 110; // px
    
    // Organic irregular blob shape using border-radius
    const r1 = 40 + Math.random() * 30;
    const r2 = 40 + Math.random() * 30;
    const r3 = 40 + Math.random() * 30;
    const r4 = 40 + Math.random() * 30;
    
    ink.style.left = `${x}%`;
    ink.style.top = `${y}px`;
    ink.style.width = `${size}px`;
    ink.style.height = `${size}px`;
    ink.style.backgroundColor = inkColor;
    ink.style.borderRadius = `${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r3}% ${100-r4}%`;
    
    paperSheet.appendChild(ink);
    
    // Clean up from DOM after fade animation is finished
    setTimeout(() => {
      ink.remove();
    }, 7000);
  }

  // 4. Typing keyboard audio integration
  typewriterInput.addEventListener('keydown', (e) => {
    // Check if audio needs to initialize on user interaction
    audio.init();

    // Limit characters
    const currentLength = typewriterInput.value.length;


    // Play sound based on keystroke
    if (e.key === 'Backspace') {
      audio.playBackspace();
    } else if (e.key === 'Spacebar' || e.key === ' ') {
      audio.playSpace();
    } else if (e.key === 'Enter') {
      // Create new line on Shift+Enter, or submit on normal Enter
      if (e.shiftKey) {
        audio.playCarriageReturn();
      } else if (currentLength > 0) {
        e.preventDefault();
        submitThought();
      }
    } else if (e.key.length === 1) {
      audio.playKey();
      
      // Random ink spray splatter (8% chance per key strike)
      if (Math.random() < 0.08) {
        spawnInkSplatter();
      }
      
      // Automatic mechanical typewriter bell warning at 68 characters on the line
      const currentLineLen = getCursorLineLength();
      if (currentLineLen === 68) {
        audio.playBell();
      }
    }
  });

  // Map physical key presses to virtual keycap animations
  window.addEventListener('keydown', (e) => {
    if (document.activeElement !== typewriterInput) return;
    
    let keyName = e.key.toLowerCase();
    if (e.key === ' ') keyName = ' ';
    
    let keycap = null;
    if (keyName === 'enter') {
      keycap = document.querySelector('.keycap[data-key="enter"]');
    } else if (keyName === 'backspace') {
      keycap = document.querySelector('.keycap[data-key="backspace"]');
    } else {
      keycap = document.querySelector(`.keycap[data-key="${keyName}"]`);
    }

    if (keycap) {
      keycap.classList.add('key-pressed');
    }
  });

  window.addEventListener('keyup', (e) => {
    let keyName = e.key.toLowerCase();
    if (e.key === ' ') keyName = ' ';
    
    let keycap = null;
    if (keyName === 'enter') {
      keycap = document.querySelector('.keycap[data-key="enter"]');
    } else if (keyName === 'backspace') {
      keycap = document.querySelector('.keycap[data-key="backspace"]');
    } else {
      keycap = document.querySelector(`.keycap[data-key="${keyName}"]`);
    }

    if (keycap) {
      keycap.classList.remove('key-pressed');
    }
  });

  // Connect virtual keycap clicks to typing inputs
  const keycaps = document.querySelectorAll('.keycap');
  keycaps.forEach(keycap => {
    keycap.addEventListener('mousedown', (e) => {
      e.preventDefault(); // prevent losing focus on main text area
      audio.init();

      const keyVal = keycap.getAttribute('data-key');
      const currentLength = typewriterInput.value.length;

      // Animate the key press
      keycap.classList.add('key-pressed');

      if (keyVal === 'backspace') {
        audio.playBackspace();
        if (currentLength > 0) {
          typewriterInput.value = typewriterInput.value.slice(0, -1);
          typewriterInput.dispatchEvent(new Event('input'));
        }
      } else if (keyVal === 'enter') {
        if (currentLength > 0) {
          submitThought();
        }
      } else if (keyVal === ' ') {
        audio.playSpace();
        if (currentLength < 280) {
          typewriterInput.value += ' ';
          typewriterInput.dispatchEvent(new Event('input'));
        }
      } else {
        audio.playKey();
        if (currentLength < 280) {
          typewriterInput.value += keyVal;
          typewriterInput.dispatchEvent(new Event('input'));
          
          if (Math.random() < 0.08) {
            spawnInkSplatter();
          }

          const currentLineLen = getCursorLineLength();
          if (currentLineLen === 68) {
            audio.playBell();
          }
        }
      }

      // Keep focus in the input area
      typewriterInput.focus();
    });

    keycap.addEventListener('mouseup', () => {
      keycap.classList.remove('key-pressed');
    });

    keycap.addEventListener('mouseleave', () => {
      keycap.classList.remove('key-pressed');
    });
  });


  // Handle character count reactive styling
  typewriterInput.addEventListener('input', () => {
    const length = typewriterInput.value.length;
    charCount.innerText = `${length} / 280`;
    
    if (length < 265) {
      hasWarnedMargin = false; // Reset margin warning if user deleted characters
    }

    if (length >= 270) {
      charCount.style.color = '#c0392b';
    } else {
      charCount.style.color = 'var(--paper-ink-dim)';
    }
  });

  // Submit thought sequence
  function submitThought() {
    const content = typewriterInput.value.trim();
    if (!content) return;

    // Trigger submissions animations and carriage return audio
    audio.playCarriageReturn();
    
    // Animate carriage lever and paper feed
    carriageLever.classList.add('lever-return');
    paperSheet.classList.add('paper-feed-animation');
    
    // Store post
    const newPost = {
      id: 'thought-' + Date.now() + Math.random().toString(36).substr(2, 5),
      content: content,
      timestamp: Date.now()
    };


    // Add to beginning of thoughts feed
    posts.unshift(newPost);
    saveDatabase();
    
    // Clean inputs
    typewriterInput.value = '';
    charCount.innerText = '0 / 280';
    charCount.style.color = 'var(--paper-ink-dim)';
    hasWarnedMargin = false;

    // Clean up carriage lever animations
    setTimeout(() => {
      carriageLever.classList.remove('lever-return');
    }, 400);

    // Fade paper back down to look like fresh sheet feeding in
    setTimeout(() => {
      paperSheet.classList.remove('paper-feed-animation');
      renderFeed();
    }, 600);
  }

  // Bind submit button lever
  carriageLever.addEventListener('click', () => {
    submitThought();
  });

  // Roll platen knob visual animation
  platenKnob.addEventListener('click', () => {
    audio.init();
    audio.playSpace();
    platenKnob.style.transform = `rotate(${Math.random() * 90 + 30}deg)`;
  });

  // 5. Render Feed with precise organic decay filters
  function renderFeed() {
    // Read Sandbox time warp modifier (offset in hours)
    const warpShiftHours = parseFloat(timeWarpSlider.value);
    const timeWarpMs = warpShiftHours * 60 * 60 * 1000;
    
    const simulatedNow = Date.now() + timeWarpMs;
    
    // Load resonated states
    const resonatedMap = JSON.parse(localStorage.getItem('ephemera_resonated') || '{}');
    
    // Filter active posts (survived under 24 hours of simulated time, accounting for resonance)
    const activePosts = posts.filter(post => {
      const resonanceOffset = resonatedMap[post.id] ? (3 * 60 * 60 * 1000) : 0;
      const ageMs = simulatedNow - post.timestamp - resonanceOffset;
      const ageHours = ageMs / (1000 * 60 * 60);
      return ageHours < 24 && ageHours >= 0; // Filter expired or future posts
    });

    // Handle empty feed states
    if (activePosts.length === 0) {
      thoughtFeed.innerHTML = '';
      emptyState.style.display = 'block';
      activeThoughtsCount.innerText = '0 active thoughts';
      return;
    }

    emptyState.style.display = 'none';
    activeThoughtsCount.innerText = `${activePosts.length} active thought${activePosts.length === 1 ? '' : 's'}`;

    // Clear feed container
    thoughtFeed.innerHTML = '';
    
    activePosts.forEach(post => {
      const resonanceOffset = resonatedMap[post.id] ? (3 * 60 * 60 * 1000) : 0;
      const ageMs = simulatedNow - post.timestamp - resonanceOffset;
      const ageHours = ageMs / (1000 * 60 * 60);
      const remainingFraction = Math.max(0, 1 - (ageHours / 24));
      
      // Compute styles based on decay fraction
      const opacity = (remainingFraction * 0.92) + 0.08;
      const blur = (1 - remainingFraction) * 2.2;
      const letterSpacing = (1 - remainingFraction) * 0.06;
      
      // Create card elements
      const card = document.createElement('article');
      card.className = 'thought-card';
      card.id = post.id;
      
      const contentEl = document.createElement('p');
      contentEl.className = 'thought-text';
      contentEl.innerText = post.content;
      
      // Apply custom inline decay styles
      contentEl.style.opacity = opacity;
      contentEl.style.filter = `blur(${blur.toFixed(2)}px)`;
      contentEl.style.letterSpacing = `${letterSpacing.toFixed(3)}em`;
      
      // Metadata section
      const metaEl = document.createElement('div');
      metaEl.className = 'thought-meta';
      
      // Time remaining readout
      const hoursLeft = 24 - ageHours;
      let timeText = '';
      if (hoursLeft >= 1) {
        const h = Math.floor(hoursLeft);
        const m = Math.floor((hoursLeft - h) * 60);
        timeText = `${h}h ${m}m remaining`;
      } else {
        const mins = Math.floor(hoursLeft * 60);
        timeText = `${mins}m remaining`;
      }
      
      const timeSpan = document.createElement('span');
      timeSpan.innerText = timeText;
      timeSpan.style.opacity = (remainingFraction * 0.6) + 0.4;
      
      // Visual indicator bar
      const barContainer = document.createElement('div');
      barContainer.className = 'decay-bar-container';
      
      const bar = document.createElement('div');
      bar.className = 'decay-bar';
      bar.style.width = `${(remainingFraction * 100).toFixed(1)}%`;
      
      if (remainingFraction < 0.166) {
        bar.classList.add('decay-urgent');
      }
      
      barContainer.appendChild(bar);

      // Resonate Button (Breathe Life)
      const hasResonated = resonatedMap[post.id];
      const resonateBtn = document.createElement('button');
      resonateBtn.className = 'resonate-btn';
      resonateBtn.innerText = hasResonated ? '[resonated]' : '[resonate]';
      if (hasResonated) resonateBtn.disabled = true;
      resonateBtn.setAttribute('data-id', post.id);
      
      resonateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = e.target.getAttribute('data-id');
        
        // Play crystal chime sound
        audio.playResonance();
        
        // Add ripple animation to card
        const targetCard = document.getElementById(pId);
        if (targetCard) {
          targetCard.classList.add('resonate-ripple');
        }
        
        // Store resonated ID
        resonatedMap[pId] = true;
        localStorage.setItem('ephemera_resonated', JSON.stringify(resonatedMap));
        
        // Refresh feed after swell animation finishes
        setTimeout(() => {
          renderFeed();
        }, 1000);
      });
      
      metaEl.appendChild(resonateBtn);
      metaEl.appendChild(timeSpan);
      metaEl.appendChild(barContainer);
      
      card.appendChild(contentEl);
      card.appendChild(metaEl);
      thoughtFeed.appendChild(card);
    });
  }

  // 6. Settings Controls handlers

  // Key Sound Mute
  muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    audio.isMuted = isMuted;
    if (isMuted) {
      muteToggle.classList.remove('active');
      muteToggle.innerText = 'OFF';
    } else {
      muteToggle.classList.add('active');
      muteToggle.innerText = 'ON';
      audio.playKey();
    }
  });

  // Ambient Sound Cycling Selector
  let ambientChannel = 'off'; // 'off', 'rain', 'hearth', 'wind'
  
  ambientSelect.addEventListener('click', () => {
    audio.init();
    
    if (ambientChannel === 'off') {
      ambientChannel = 'rain';
      ambientSelect.innerText = 'RAIN';
      ambientSelect.classList.add('active');
      ambientSlider.disabled = false;
      audio.toggleAmbient(true, 'rain');
    } else if (ambientChannel === 'rain') {
      ambientChannel = 'hearth';
      ambientSelect.innerText = 'HEARTH';
      ambientSelect.classList.add('active');
      ambientSlider.disabled = false;
      audio.toggleAmbient(true, 'hearth');
    } else if (ambientChannel === 'hearth') {
      ambientChannel = 'wind';
      ambientSelect.innerText = 'WIND';
      ambientSelect.classList.add('active');
      ambientSlider.disabled = false;
      audio.toggleAmbient(true, 'wind');
    } else {
      ambientChannel = 'off';
      ambientSelect.innerText = 'OFF';
      ambientSelect.classList.remove('active');
      ambientSlider.disabled = true;
      audio.toggleAmbient(false);
    }
  });

  // Master click-clack volume slider
  volumeSlider.addEventListener('input', (e) => {
    audio.setVolume(parseFloat(e.target.value));
  });

  // Master ambient volume slider
  ambientSlider.addEventListener('input', (e) => {
    audio.setAmbientVolume(parseFloat(e.target.value));
  });

  // CRT Screen filter toggle
  crtToggle.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-crt') === 'true';
    document.documentElement.setAttribute('data-crt', !active);
    
    if (!active) {
      crtToggle.classList.add('active');
      crtToggle.innerText = 'ACTIVE';
    } else {
      crtToggle.classList.remove('active');
      crtToggle.innerText = 'OFF';
    }
  });

  // Theme Toggle (Parchment vs Carbon)
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'carbon' ? 'parchment' : 'carbon';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerText = newTheme.toUpperCase();
    
    // Play a mechanical sound to celebrate transition
    audio.init();
    audio.playBell();
  });

  // 7. Time Warp Sandbox logic
  timeWarpSlider.addEventListener('input', (e) => {
    const hours = parseFloat(e.target.value);
    timeWarpLabel.innerText = `Simulated Shift: +${hours.toFixed(1)} hours`;
    renderFeed();
  });

  resetWarpBtn.addEventListener('click', () => {
    timeWarpSlider.value = 0;
    timeWarpLabel.innerText = `Simulated Shift: +0.0 hours`;
    audio.init();
    audio.playSpace();
    renderFeed();
  });

  // Clear archive memory linkage
  clearStorageLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to clear your local memory? This will restore initial seed thoughts.")) {
      localStorage.removeItem('ephemera_thoughts');
      localStorage.removeItem('ephemera_resonated');
      posts = [...seedPosts];
      saveDatabase();
      timeWarpSlider.value = 0;
      timeWarpLabel.innerText = `Simulated Shift: +0.0 hours`;
      audio.init();
      audio.playBell();
      renderFeed();
    }
  });

  // Initialize App
  loadDatabase();
  renderFeed();

  // Run a continuous render check every 5 seconds to decay in real-time
  setInterval(() => {
    renderFeed();
  }, 5000);

  // 8. Drifting Feathers Canvas Particle System
  const canvas = document.getElementById('featherCanvas');
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class FeatherParticle {
    constructor(isInitial = false) {
      this.reset(isInitial);
    }

    reset(isInitial = false) {
      // Choose left side (first 18%) or right side (last 18%)
      const isLeft = Math.random() < 0.5;
      this.x = isLeft 
        ? Math.random() * canvas.width * 0.18 
        : canvas.width * 0.82 + Math.random() * canvas.width * 0.18;
      
      // If initial spawn, distribute across the screen height, otherwise spawn above screen
      this.y = isInitial 
        ? Math.random() * canvas.height 
        : -50 - Math.random() * 150;
      
      this.size = 25 + Math.random() * 25;
      this.speedY = 0.3 + Math.random() * 0.4;
      this.phase = Math.random() * 100;
      this.driftSpeed = 0.005 + Math.random() * 0.01;
      this.driftWidth = 10 + Math.random() * 15;
      this.angle = (Math.random() - 0.5) * 0.8;
      this.rotSpeed = (Math.random() - 0.5) * 0.005;
      this.opacity = 0.08 + Math.random() * 0.18;
    }

    update() {
      this.y += this.speedY;
      
      // Sinusoidal horizontal waving motion
      this.phase += this.driftSpeed;
      this.x += Math.sin(this.phase) * 0.3;
      
      // Slowly rotate
      this.angle += this.rotSpeed;

      // Reset if it goes off screen
      if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
        this.reset(false);
      }
    }

    draw() {
      // Dynamic color check depending on monochrome theme
      const isCarbon = document.documentElement.getAttribute('data-theme') !== 'parchment';
      const color = isCarbon ? '234, 229, 216' : '125, 113, 98'; // Cream vs Sepia

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = `rgba(${color}, 1)`;
      ctx.lineWidth = 1.0;

      // Draw feather quill stem (rachis)
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.quadraticCurveTo(this.size * 0.07, 0, 0, this.size / 2);
      ctx.stroke();

      // Draw barbs (soft feathers vanes)
      const barbs = 16;
      for (let i = 0; i < barbs; i++) {
        const t = i / barbs;
        const py = -this.size / 2 + t * this.size;
        const px = this.size * 0.05 * Math.sin(t * Math.PI);
        const barbLen = this.size * 0.24 * Math.sin(t * Math.PI);

        // Left barb
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px - barbLen, py - this.size * 0.04, px - barbLen * 0.85, py - this.size * 0.09);
        ctx.stroke();

        // Right barb
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px + barbLen, py - this.size * 0.04, px + barbLen * 0.85, py - this.size * 0.09);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Spawn initial set of feathers
  const particles = [];
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new FeatherParticle(true));
  }

  // Main animation loop
  function animateFeathers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animateFeathers);
  }
  
  animateFeathers();
});

