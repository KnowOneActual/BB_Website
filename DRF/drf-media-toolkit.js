document.addEventListener('DOMContentLoaded', () => {
  // --- Tab switching logic ---
  const navButtons = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.tab-panel');

  function switchTab(tabId) {
    panels.forEach((panel) => {
      panel.classList.remove('active');
    });
    navButtons.forEach((btn) => {
      btn.classList.remove('active');
    });

    const activePanel = document.getElementById(tabId);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    const activeBtn = Array.from(navButtons).find((btn) => btn.getAttribute('data-tab') === tabId);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  // Bind sidebar nav clicks
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // --- Web Audio Context setup ---
  let audioCtx = null;
  let toneOscillator = null;
  let toneGainNode = null;
  let activeNoiseSource = null;
  let activeNoiseGain = null;
  let activeChannelNode = null;
  let microphoneStream = null;
  let micSource = null;
  let micAnalyser = null;
  let vuAnimationId = null;

  const audioInitAlert = document.getElementById('audio-init-alert');

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioInitAlert) {
        audioInitAlert.style.display = 'none';
      }
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Any user interaction will activate the Web Audio Context
  document.body.addEventListener('click', initAudio, { once: false });

  // --- Waveform Tone Generator logic ---
  let currentWaveType = 'sine';
  const labelWaveType = document.getElementById('lbl-wavetype');
  const waveTypeButtons = document.querySelectorAll('[data-wavetype]');
  const rangeFreq = document.getElementById('range-freq');
  const labelFreq = document.getElementById('lbl-freq');
  const freqPresetButtons = document.querySelectorAll('[data-freq]');
  const rangeVolume = document.getElementById('range-volume');
  const labelVolume = document.getElementById('lbl-volume');
  const btnToggleTone = document.getElementById('btn-toggle-tone');

  function setWaveType(type) {
    currentWaveType = type;
    waveTypeButtons.forEach((badge) => {
      if (badge.getAttribute('data-wavetype') === type) {
        badge.classList.add('active');
      } else {
        badge.classList.remove('active');
      }
    });
    if (labelWaveType) {
      labelWaveType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    }
    if (toneOscillator) {
      toneOscillator.type = type;
    }
  }

  waveTypeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setWaveType(btn.getAttribute('data-wavetype'));
    });
  });

  function updateFrequency(val) {
    if (labelFreq) {
      labelFreq.textContent = val + ' Hz';
    }
    if (toneOscillator) {
      toneOscillator.frequency.setValueAtTime(val, audioCtx.currentTime);
    }
  }

  if (rangeFreq) {
    rangeFreq.addEventListener('input', (e) => {
      updateFrequency(e.target.value);
    });
  }

  function setFrequencyPreset(val) {
    if (rangeFreq) {
      rangeFreq.value = val;
    }
    updateFrequency(val);
  }

  freqPresetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setFrequencyPreset(parseInt(btn.getAttribute('data-freq'), 10));
    });
  });

  function updateVolume(val) {
    if (labelVolume) {
      labelVolume.textContent = val + '%';
    }
    const gain = val / 100;
    if (toneGainNode) {
      toneGainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
    }
    if (activeNoiseGain) {
      activeNoiseGain.gain.setValueAtTime(gain, audioCtx.currentTime);
    }
  }

  if (rangeVolume) {
    rangeVolume.addEventListener('input', (e) => {
      updateVolume(e.target.value);
    });
  }

  function toggleTone() {
    initAudio();

    if (toneOscillator) {
      // Stop tone
      toneOscillator.stop();
      toneOscillator.disconnect();
      toneOscillator = null;
      if (btnToggleTone) {
        btnToggleTone.textContent = '▶ Start Tone';
        btnToggleTone.classList.remove('btn-danger');
        btnToggleTone.classList.add('btn-primary');
      }
    } else {
      // Stop any other active signal first
      stopAllSignals();

      toneOscillator = audioCtx.createOscillator();
      toneGainNode = audioCtx.createGain();

      toneOscillator.type = currentWaveType;
      const freqVal = rangeFreq ? rangeFreq.value : 1000;
      toneOscillator.frequency.setValueAtTime(freqVal, audioCtx.currentTime);

      const volVal = rangeVolume ? rangeVolume.value : 50;
      const volume = volVal / 100;
      toneGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

      toneOscillator.connect(toneGainNode);
      toneGainNode.connect(audioCtx.destination);

      toneOscillator.start();
      if (btnToggleTone) {
        btnToggleTone.textContent = '■ Stop Tone';
        btnToggleTone.classList.remove('btn-primary');
        btnToggleTone.classList.add('btn-danger');
      }
    }
  }

  if (btnToggleTone) {
    btnToggleTone.addEventListener('click', toggleTone);
  }

  // --- Noise & Calibration routing logic ---
  const btnNoisePink = document.getElementById('btn-noise-pink');
  const btnNoiseWhite = document.getElementById('btn-noise-white');
  const btnChannelLeft = document.getElementById('btn-channel-left');
  const btnChannelRight = document.getElementById('btn-channel-right');
  const btnPhasePolarity = document.getElementById('btn-phase-polarity');

  function stopAllSignals() {
    if (toneOscillator) {
      toneOscillator.stop();
      toneOscillator.disconnect();
      toneOscillator = null;
      if (btnToggleTone) {
        btnToggleTone.textContent = '▶ Start Tone';
        btnToggleTone.classList.remove('btn-danger');
        btnToggleTone.classList.add('btn-primary');
      }
    }

    if (activeNoiseSource) {
      activeNoiseSource.stop();
      activeNoiseSource.disconnect();
      activeNoiseSource = null;
      if (btnNoisePink) btnNoisePink.classList.remove('btn-danger');
      if (btnNoiseWhite) btnNoiseWhite.classList.remove('btn-danger');
    }

    if (activeChannelNode) {
      activeChannelNode.stop();
      activeChannelNode.disconnect();
      activeChannelNode = null;
      if (btnChannelLeft) btnChannelLeft.classList.remove('btn-danger');
      if (btnChannelRight) btnChannelRight.classList.remove('btn-danger');
    }

    if (phaseIntervalId) {
      clearInterval(phaseIntervalId);
      phaseIntervalId = null;
    }
    if (phaseOscLeft) {
      try {
        phaseOscLeft.stop();
      } catch (_e) {}
      phaseOscLeft.disconnect();
      phaseOscLeft = null;
    }
    if (phaseOscRight) {
      try {
        phaseOscRight.stop();
      } catch (_e) {}
      phaseOscRight.disconnect();
      phaseOscRight = null;
    }
    if (btnPhasePolarity) {
      btnPhasePolarity.classList.remove('btn-danger');
      btnPhasePolarity.textContent = 'Check Speaker Polarity Phase';
    }
  }

  function toggleNoise(noiseType) {
    initAudio();

    if (activeNoiseSource) {
      stopAllSignals();
    } else {
      stopAllSignals();

      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (noiseType === 'white') {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        if (btnNoiseWhite) btnNoiseWhite.classList.add('btn-danger');
      } else if (noiseType === 'pink') {
        // Voss-McCartney Pink Noise algorithm
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
          output[i] = pink * 0.11; // normalization scale factor
        }
        if (btnNoisePink) btnNoisePink.classList.add('btn-danger');
      }

      activeNoiseSource = audioCtx.createBufferSource();
      activeNoiseSource.buffer = noiseBuffer;
      activeNoiseSource.loop = true;

      activeNoiseGain = audioCtx.createGain();
      const volVal = rangeVolume ? rangeVolume.value : 50;
      const volume = volVal / 100;
      activeNoiseGain.gain.setValueAtTime(volume, audioCtx.currentTime);

      activeNoiseSource.connect(activeNoiseGain);
      activeNoiseGain.connect(audioCtx.destination);

      activeNoiseSource.start();
    }
  }

  if (btnNoisePink) {
    btnNoisePink.addEventListener('click', () => toggleNoise('pink'));
  }
  if (btnNoiseWhite) {
    btnNoiseWhite.addEventListener('click', () => toggleNoise('white'));
  }

  function testChannel(channel) {
    initAudio();

    if (activeChannelNode) {
      stopAllSignals();
    } else {
      stopAllSignals();

      activeChannelNode = audioCtx.createOscillator();
      activeChannelNode.type = 'sine';
      activeChannelNode.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz Reference

      const gainNode = audioCtx.createGain();
      const volVal = rangeVolume ? rangeVolume.value : 50;
      const volume = volVal / 100;
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

      const panner = audioCtx.createStereoPanner();
      panner.pan.setValueAtTime(channel === 'left' ? -1 : 1, audioCtx.currentTime);

      activeChannelNode.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(audioCtx.destination);

      activeChannelNode.start();
      if (channel === 'left') {
        if (btnChannelLeft) btnChannelLeft.classList.add('btn-danger');
      } else {
        if (btnChannelRight) btnChannelRight.classList.add('btn-danger');
      }
    }
  }

  if (btnChannelLeft) {
    btnChannelLeft.addEventListener('click', () => testChannel('left'));
  }
  if (btnChannelRight) {
    btnChannelRight.addEventListener('click', () => testChannel('right'));
  }

  // Speaker Phase Polarity check
  let phaseOscLeft = null;
  let phaseOscRight = null;
  let phaseIntervalId = null;
  let isPhaseAlternateIn = true;

  function togglePhasePolarityCheck() {
    initAudio();

    if (phaseOscLeft) {
      stopAllSignals();
    } else {
      stopAllSignals();

      const volVal = rangeVolume ? rangeVolume.value : 50;
      const volume = volVal / 100;
      const merger = audioCtx.createChannelMerger(2);

      // Create left oscillator
      phaseOscLeft = audioCtx.createOscillator();
      phaseOscLeft.frequency.setValueAtTime(440, audioCtx.currentTime);
      const gainLeft = audioCtx.createGain();
      gainLeft.gain.setValueAtTime(volume, audioCtx.currentTime);
      phaseOscLeft.connect(gainLeft);
      gainLeft.connect(merger, 0, 0); // connect to left stereo output channel

      // Create right oscillator
      phaseOscRight = audioCtx.createOscillator();
      phaseOscRight.frequency.setValueAtTime(440, audioCtx.currentTime);
      const gainRight = audioCtx.createGain();
      gainRight.gain.setValueAtTime(volume, audioCtx.currentTime);
      phaseOscRight.connect(gainRight);
      gainRight.connect(merger, 0, 1); // connect to right stereo output channel

      merger.connect(audioCtx.destination);

      phaseOscLeft.start();
      phaseOscRight.start();

      if (btnPhasePolarity) {
        btnPhasePolarity.classList.add('btn-danger');
        btnPhasePolarity.textContent = '■ Stop Polarity Check [IN PHASE]';
      }
      isPhaseAlternateIn = true;

      phaseIntervalId = setInterval(() => {
        if (isPhaseAlternateIn) {
          // Switch to Out-of-Phase (Invert right channel gain polarity)
          gainRight.gain.setValueAtTime(-volume, audioCtx.currentTime);
          if (btnPhasePolarity) {
            btnPhasePolarity.textContent = '■ Stop Polarity Check [OUT OF PHASE]';
          }
          isPhaseAlternateIn = false;
        } else {
          // Switch back to In-Phase
          gainRight.gain.setValueAtTime(volume, audioCtx.currentTime);
          if (btnPhasePolarity) {
            btnPhasePolarity.textContent = '■ Stop Polarity Check [IN PHASE]';
          }
          isPhaseAlternateIn = true;
        }
      }, 3000);
    }
  }

  if (btnPhasePolarity) {
    btnPhasePolarity.addEventListener('click', togglePhasePolarityCheck);
  }

  // --- Fullscreen Display Calibration patterns ---
  const fullscreenContainer = document.getElementById('fullscreen-canvas-container');
  const calCanvas = document.getElementById('cal-canvas');
  let calCtx = null;
  if (calCanvas) {
    calCtx = calCanvas.getContext('2d');
  }
  let activePattern = null;
  let calAnimationId = null;
  let rgbCycleIndex = 0;

  function resizeCalCanvas() {
    if (calCanvas) {
      calCanvas.width = window.innerWidth;
      calCanvas.height = window.innerHeight;
    }
  }

  window.addEventListener('resize', () => {
    if (fullscreenContainer && fullscreenContainer.style.display === 'block') {
      resizeCalCanvas();
      drawPattern();
    }
  });

  function drawPattern() {
    if (!calCtx || !calCanvas) return;

    if (calAnimationId) {
      cancelAnimationFrame(calAnimationId);
      calAnimationId = null;
    }

    const w = calCanvas.width;
    const h = calCanvas.height;

    if (activePattern === 'white') {
      calCtx.fillStyle = 'white';
      calCtx.fillRect(0, 0, w, h);
    } else if (activePattern === 'black') {
      calCtx.fillStyle = 'black';
      calCtx.fillRect(0, 0, w, h);
    } else if (activePattern === 'rgb') {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      calCtx.fillStyle = colors[rgbCycleIndex];
      calCtx.fillRect(0, 0, w, h);

      // Slow loop rotation
      setTimeout(() => {
        if (activePattern === 'rgb') {
          rgbCycleIndex = (rgbCycleIndex + 1) % 3;
          drawPattern();
        }
      }, 2000);
    } else if (activePattern === 'convergence') {
      calCtx.fillStyle = 'black';
      calCtx.fillRect(0, 0, w, h);

      // 1. Grid lines (120px apart)
      calCtx.strokeStyle = '#475569'; // slate-600
      calCtx.lineWidth = 1;
      for (let x = 120; x < w; x += 120) {
        calCtx.beginPath();
        calCtx.moveTo(x, 0);
        calCtx.lineTo(x, h);
        calCtx.stroke();
      }
      for (let y = 120; y < h; y += 120) {
        calCtx.beginPath();
        calCtx.moveTo(0, y);
        calCtx.lineTo(w, y);
        calCtx.stroke();
      }

      // 2. White outer border (Overscan check)
      calCtx.strokeStyle = 'white';
      calCtx.lineWidth = 4;
      calCtx.strokeRect(2, 2, w - 4, h - 4);

      // 3. Center crosshair (Red)
      calCtx.strokeStyle = '#ef4444';
      calCtx.lineWidth = 2;
      calCtx.beginPath();
      calCtx.moveTo(w / 2, 0);
      calCtx.lineTo(w / 2, h);
      calCtx.stroke();
      calCtx.beginPath();
      calCtx.moveTo(0, h / 2);
      calCtx.lineTo(w, h / 2);
      calCtx.stroke();

      // 4. Center Aspect Ratio Circle (Red, radius 300px scaled to 1080p height)
      const centerCircleRadius = 300 * (h / 1080);
      calCtx.beginPath();
      calCtx.arc(w / 2, h / 2, centerCircleRadius, 0, 2 * Math.PI);
      calCtx.stroke();

      // 5. Corner focus targets (Red, radius 100px)
      const cornerOffset = 240 * (h / 1080);
      const focusRadius = 100 * (h / 1080);
      const corners = [
        [cornerOffset, cornerOffset],
        [w - cornerOffset, cornerOffset],
        [cornerOffset, h - cornerOffset],
        [w - cornerOffset, h - cornerOffset],
      ];

      corners.forEach(([cx, cy]) => {
        calCtx.strokeStyle = '#ef4444';
        calCtx.lineWidth = 2;
        calCtx.beginPath();
        calCtx.arc(cx, cy, focusRadius, 0, 2 * Math.PI);
        calCtx.stroke();

        calCtx.beginPath();
        calCtx.moveTo(cx - focusRadius - 20, cy);
        calCtx.lineTo(cx + focusRadius + 20, cy);
        calCtx.stroke();
        calCtx.beginPath();
        calCtx.moveTo(cx, cy - focusRadius - 20);
        calCtx.lineTo(cx, cy + focusRadius + 20);
        calCtx.stroke();

        // Cross coordinate markers
        calCtx.fillStyle = 'white';
        calCtx.font = "12px 'Inter', monospace";
        calCtx.textAlign = 'center';
        calCtx.fillText(`(${Math.round(cx)}, ${Math.round(cy)})`, cx, cy + 5);
      });

      // Center Card label details
      calCtx.fillStyle = 'black';
      calCtx.fillRect(w / 2 - 250, h / 2 - 80, 500, 160);
      calCtx.strokeStyle = '#ef4444';
      calCtx.lineWidth = 2;
      calCtx.strokeRect(w / 2 - 250, h / 2 - 80, 500, 160);

      calCtx.fillStyle = 'white';
      calCtx.font = "bold 24px 'Poppins', sans-serif";
      calCtx.textAlign = 'center';
      calCtx.fillText('CONVERGENCE & ALIGNMENT TEST', w / 2, h / 2 - 30);
      calCtx.font = "16px 'Inter', sans-serif";
      calCtx.fillStyle = '#8a8d93';
      calCtx.fillText(`${w} x ${h} | Aspect Ratio: ${(w / h).toFixed(2)}:1`, w / 2, h / 2 + 5);
      calCtx.fillStyle = '#ef4444';
      calCtx.fillText('If center circle is not round, scaling is distorted.', w / 2, h / 2 + 40);
    } else if (activePattern === 'legibility') {
      calCtx.fillStyle = 'white';
      calCtx.fillRect(0, 0, w, h);

      // Title header
      calCtx.fillStyle = '#0f172a';
      calCtx.fillRect(0, 0, w, 120);

      calCtx.fillStyle = 'white';
      calCtx.textAlign = 'center';
      calCtx.font = "bold 28px 'Poppins', sans-serif";
      calCtx.fillText('SCREEN SHARE LEGIBILITY & COMPRESSION TEST', w / 2, 55);
      calCtx.font = "16px 'Inter', sans-serif";
      calCtx.fillStyle = '#8a8d93';
      calCtx.fillText(
        'Evaluate font sizes, contrast levels, and chroma sub-sampling compression (4:2:0 visual artifacts).',
        w / 2,
        90,
      );

      // Column 1: Typography sizes
      const colW = (w - 80) / 3;
      const colY = 150;
      const colH = h - 180;

      calCtx.textAlign = 'left';
      calCtx.fillStyle = '#334155';
      calCtx.fillRect(30, colY, colW, 40);
      calCtx.fillStyle = 'white';
      calCtx.font = "bold 16px 'Poppins', sans-serif";
      calCtx.fillText('TYPOGRAPHY & FONT SIZES', 50, colY + 25);

      calCtx.strokeStyle = '#cbd5e1';
      calCtx.lineWidth = 1;
      calCtx.strokeRect(30, colY, colW, colH);

      let textY = colY + 70;
      const fontSizes = [6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 32];
      calCtx.fillStyle = 'black';
      fontSizes.forEach((fs) => {
        calCtx.font = `${fs}px 'Inter', sans-serif`;
        calCtx.fillText(`Font ${fs}pt: Pack my box with five dozen liquor jugs.`, 45, textY);
        textY += Math.max(fs + 14, 22);
      });

      // Column 2: Chroma sub-sampling
      const col2X = 30 + colW + 10;
      calCtx.fillStyle = '#334155';
      calCtx.fillRect(col2X, colY, colW, 40);
      calCtx.fillStyle = 'white';
      calCtx.font = "bold 16px 'Poppins', sans-serif";
      calCtx.fillText('CHROMA SUB-SAMPLING (4:2:0 vs 4:4:4)', col2X + 20, colY + 25);
      calCtx.strokeRect(col2X, colY, colW, colH);

      // Red on Black Box
      calCtx.fillStyle = 'black';
      calCtx.fillRect(col2X + 15, colY + 60, colW - 30, 180);
      calCtx.textAlign = 'center';
      calCtx.fillStyle = '#ef4444'; // Red
      calCtx.font = "bold 18px 'Poppins', sans-serif";
      calCtx.fillText('RED ON BLACK TEXT SAMPLES', col2X + colW / 2, colY + 100);
      calCtx.font = "12px 'Inter', sans-serif";
      calCtx.fillText('If this red text is heavily pixelated or smudged,', col2X + colW / 2, colY + 135);
      calCtx.fillText('your software/hardware is applying 4:2:0 chroma sub-sampling.', col2X + colW / 2, colY + 160);
      calCtx.fillStyle = '#10b981'; // Green
      calCtx.fillText('Green on black does not suffer from sub-sampling filters.', col2X + colW / 2, colY + 195);

      // Blue on Black Box
      calCtx.fillStyle = 'black';
      calCtx.fillRect(col2X + 15, colY + 260, colW - 30, 100);
      calCtx.fillStyle = '#3b82f6'; // Blue
      calCtx.font = "bold 14px 'Poppins', sans-serif";
      calCtx.fillText('BLUE ON BLACK COMPRESSION CHECK', col2X + colW / 2, colY + 300);
      calCtx.font = "12px 'Inter', sans-serif";
      calCtx.fillText('Blue highlights are compressed similarly to red signals.', col2X + colW / 2, colY + 335);

      // Low Contrast Test
      calCtx.textAlign = 'left';
      calCtx.fillStyle = 'black';
      calCtx.font = "bold 14px 'Poppins', sans-serif";
      calCtx.fillText('Low Contrast legibility scale:', col2X + 20, colY + 390);

      const contrasts = [
        ['90% Contrast (Standard)', '#1e293b', 14],
        ['70% Contrast (Medium)', '#64748b', 12],
        ['50% Contrast (Lower)', '#94a3b8', 10],
        ['30% Contrast (Low / Hard)', '#cbd5e1', 8],
        ['15% Contrast (Limit)', '#e2e8f0', 6],
      ];
      let contrastY = colY + 415;
      contrasts.forEach(([lbl, color, size]) => {
        calCtx.fillStyle = color;
        calCtx.font = `${size}px 'Inter', sans-serif`;
        calCtx.fillText(lbl, col2X + 20, contrastY);
        contrastY += 24;
      });

      // Column 3: Scaling & Line Patterns
      const col3X = 30 + 2 * colW + 20;
      calCtx.fillStyle = '#334155';
      calCtx.fillRect(col3X, colY, colW, 40);
      calCtx.fillStyle = 'white';
      calCtx.font = "bold 16px 'Poppins', sans-serif";
      calCtx.fillText('FINE LINES & DETAIL TARGETS', col3X + 20, colY + 25);
      calCtx.strokeRect(col3X, colY, colW, colH);

      let col3Y = colY + 60;
      calCtx.fillStyle = 'black';
      calCtx.font = "bold 14px 'Poppins', sans-serif";
      calCtx.fillText('1px horizontal lines (1px spacing):', col3X + 20, col3Y + 15);

      calCtx.strokeStyle = 'black';
      calCtx.lineWidth = 1;
      for (let ly = col3Y + 30; ly < col3Y + 60; ly += 2) {
        calCtx.beginPath();
        calCtx.moveTo(col3X + 20, ly);
        calCtx.lineTo(col3X + colW - 20, ly);
        calCtx.stroke();
      }

      col3Y += 80;
      calCtx.fillText('2px horizontal lines (2px spacing):', col3X + 20, col3Y + 15);
      calCtx.lineWidth = 2;
      for (let ly = col3Y + 30; ly < col3Y + 70; ly += 4) {
        calCtx.beginPath();
        calCtx.moveTo(col3X + 20, ly);
        calCtx.lineTo(col3X + colW - 20, ly);
        calCtx.stroke();
      }

      col3Y += 90;
      calCtx.fillText('Concentric Moiré Targets:', col3X + 20, col3Y + 15);
      calCtx.lineWidth = 1;
      const cX = col3X + colW / 2;
      const cY = col3Y + 120;
      for (let r = 10; r < 90; r += 4) {
        calCtx.beginPath();
        calCtx.arc(cX, cY, r, 0, 2 * Math.PI);
        calCtx.stroke();
      }

      calCtx.fillStyle = '#64748b';
      calCtx.textAlign = 'center';
      calCtx.font = "12px 'Inter', sans-serif";
      calCtx.fillText('Waves or circular shadows (Moiré) indicate scaling artifacts.', cX, col3Y + 230);
    } else if (activePattern === 'colorbars') {
      // Draw SMPTE Color Bars
      const colors = [
        '#ffffff', // White
        '#f59e0b', // Yellow
        '#06b6d4', // Cyan
        '#10b981', // Green
        '#d946ef', // Magenta
        '#ef4444', // Red
        '#3b82f6', // Blue
      ];

      // Top 75% height color blocks
      const blockW = w / 7;
      const barH = h * 0.75;
      for (let i = 0; i < 7; i++) {
        calCtx.fillStyle = colors[i];
        calCtx.fillRect(i * blockW, 0, blockW, barH);
      }

      // Lower 25% alignment block (reversed color sequence & grey scale)
      const lowerY = barH;
      const lowerH = h * 0.25;
      const alignmentColors = [
        '#3b82f6', // Blue
        '#090d16', // Dark
        '#d946ef', // Magenta
        '#020617', // Black
        '#06b6d4', // Cyan
        '#f8fafc', // White
        '#ffffff', // Pure White
      ];
      for (let i = 0; i < 7; i++) {
        calCtx.fillStyle = alignmentColors[i];
        calCtx.fillRect(i * blockW, lowerY, blockW, lowerH);
      }
    }
  }

  function launchCalibration(pattern) {
    activePattern = pattern;
    resizeCalCanvas();
    if (fullscreenContainer) {
      fullscreenContainer.style.display = 'block';

      // Enter browser fullscreen mode
      if (fullscreenContainer.requestFullscreen) {
        fullscreenContainer.requestFullscreen();
      } else if (fullscreenContainer.webkitRequestFullscreen) {
        fullscreenContainer.webkitRequestFullscreen();
      }
    }

    drawPattern();

    // Bind ESC key handler
    document.addEventListener('keydown', handleEscKey);
  }

  function handleEscKey(e) {
    if (e.key === 'Escape') {
      exitCalibration();
    }
  }

  function exitCalibration() {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (fullscreenContainer) {
      fullscreenContainer.style.display = 'none';
    }
    if (calAnimationId) {
      cancelAnimationFrame(calAnimationId);
      calAnimationId = null;
    }
    document.removeEventListener('keydown', handleEscKey);
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      exitCalibration();
    }
  });

  // Bind Calibration pattern item clicks
  const calItems = document.querySelectorAll('.cal-item');
  calItems.forEach((item) => {
    item.addEventListener('click', () => {
      const pattern = item.getAttribute('data-pattern');
      if (pattern) {
        launchCalibration(pattern);
      }
    });
  });

  // --- WebRTC Camera & Microphone Diagnostics logic ---
  const selectCamera = document.getElementById('select-camera');
  const selectMic = document.getElementById('select-mic');
  const btnRefreshDevices = document.getElementById('btn-refresh-devices');
  const labelVuDb = document.getElementById('lbl-vu-db');
  const vuBarFill = document.getElementById('vu-bar-fill');

  function loadMediaDevices() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        // Stream initialized successfully, close it (we just wanted permissions)
        stream.getTracks().forEach((track) => track.stop());

        // Enumerate devices
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          if (selectCamera) {
            selectCamera.innerHTML = '<option value="">Choose camera...</option>';
          }
          if (selectMic) {
            selectMic.innerHTML = '<option value="">Choose microphone...</option>';
          }

          devices.forEach((device) => {
            if (device.kind === 'videoinput') {
              const opt = document.createElement('option');
              opt.value = device.deviceId;
              opt.textContent = device.label || `Camera ${selectCamera ? selectCamera.length : ''}`;
              if (selectCamera) selectCamera.appendChild(opt);
            } else if (device.kind === 'audioinput') {
              const opt = document.createElement('option');
              opt.value = device.deviceId;
              opt.textContent = device.label || `Microphone ${selectMic ? selectMic.length : ''}`;
              if (selectMic) selectMic.appendChild(opt);
            }
          });
        });
      })
      .catch((err) => {
        console.error('Permissions failed: ', err);
        alert('Microphone/Camera permission is required for hardware diagnostics.');
      });
  }

  function startCameraDiagnostics(deviceId) {
    const videoEl = document.getElementById('video-preview-el');

    if (window.cameraStreamTrack) {
      window.cameraStreamTrack.stop();
      window.cameraStreamTrack = null;
    }

    if (!deviceId) {
      if (videoEl) videoEl.srcObject = null;
      return;
    }

    const constraints = {
      video: { deviceId: { exact: deviceId } },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        window.cameraStreamTrack = stream.getVideoTracks()[0];
        if (videoEl) videoEl.srcObject = stream;
      })
      .catch((err) => {
        console.error('Camera start error: ', err);
      });
  }

  if (selectCamera) {
    selectCamera.addEventListener('change', (e) => {
      startCameraDiagnostics(e.target.value);
    });
  }

  function drawVuMeter() {
    if (!micAnalyser) return;

    const bufferLength = micAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    micAnalyser.getByteFrequencyData(dataArray);

    // Calculate RMS/average level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;

    // Map 0-255 average to dB scale
    // 0 -> -60dB, 255 -> 0dB
    const pct = average / 255;
    const db = pct > 0 ? Math.round(20 * Math.log10(pct)) : -60;

    const dbLabel = db <= -60 ? '-inf dB' : `${db} dB`;
    if (labelVuDb) {
      labelVuDb.textContent = dbLabel;
    }

    // VU bar fill: map db range (-40 to 0) to 0% to 100%
    let barWidth = 0;
    if (db > -40) {
      barWidth = ((db + 40) / 40) * 100;
    }
    if (vuBarFill) {
      vuBarFill.style.width = `${Math.min(barWidth, 100)}%`;
    }

    vuAnimationId = requestAnimationFrame(drawVuMeter);
  }

  function startMicrophoneDiagnostics(deviceId) {
    initAudio();

    if (microphoneStream) {
      microphoneStream.getTracks().forEach((track) => track.stop());
      microphoneStream = null;
    }
    if (micSource) {
      micSource.disconnect();
      micSource = null;
    }
    if (vuAnimationId) {
      cancelAnimationFrame(vuAnimationId);
      vuAnimationId = null;
    }

    if (!deviceId) {
      if (labelVuDb) labelVuDb.textContent = '-inf dB';
      if (vuBarFill) vuBarFill.style.width = '0%';
      return;
    }

    const constraints = {
      audio: { deviceId: { exact: deviceId } },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        microphoneStream = stream;
        micSource = audioCtx.createMediaStreamSource(stream);
        micAnalyser = audioCtx.createAnalyser();
        micAnalyser.fftSize = 256;

        micSource.connect(micAnalyser);
        drawVuMeter();
      })
      .catch((err) => {
        console.error('Microphone start error: ', err);
      });
  }

  if (selectMic) {
    selectMic.addEventListener('change', (e) => {
      startMicrophoneDiagnostics(e.target.value);
    });
  }

  if (btnRefreshDevices) {
    btnRefreshDevices.addEventListener('click', loadMediaDevices);
  }

  // --- Checklist functionality ---
  const btnChkMtr = document.getElementById('btn-chk-mtr');
  const btnChkEvent = document.getElementById('btn-chk-event');
  const chkGroupMtr = document.getElementById('chk-group-mtr');
  const chkGroupEvent = document.getElementById('chk-group-event');
  const btnResetChecklists = document.getElementById('btn-reset-checklists');
  const btnGenerateReport = document.getElementById('btn-generate-report');
  const btnCloseReport = document.getElementById('btn-close-report');
  const btnCopyReport = document.getElementById('btn-copy-report');
  const reportModal = document.getElementById('report-modal-el');
  const reportTextOutput = document.getElementById('report-text-output');

  function switchChecklist(type) {
    if (btnChkMtr) btnChkMtr.classList.remove('active');
    if (btnChkEvent) btnChkEvent.classList.remove('active');
    if (chkGroupMtr) chkGroupMtr.style.display = 'none';
    if (chkGroupEvent) chkGroupEvent.style.display = 'none';

    if (type === 'mtr') {
      if (btnChkMtr) btnChkMtr.classList.add('active');
      if (chkGroupMtr) chkGroupMtr.style.display = 'flex';
    } else {
      if (btnChkEvent) btnChkEvent.classList.add('active');
      if (chkGroupEvent) chkGroupEvent.style.display = 'flex';
    }
  }

  if (btnChkMtr) {
    btnChkMtr.addEventListener('click', () => switchChecklist('mtr'));
  }
  if (btnChkEvent) {
    btnChkEvent.addEventListener('click', () => switchChecklist('event'));
  }

  function toggleCheckItem(itemEl, checkboxId) {
    const chk = document.getElementById(checkboxId);
    if (!chk) return;
    chk.checked = !chk.checked;

    if (chk.checked) {
      itemEl.classList.add('checked');
    } else {
      itemEl.classList.remove('checked');
    }
    saveCheckState();
  }

  // Bind checklist items click
  const checklistItems = document.querySelectorAll('.checklist-item');
  checklistItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Find the checkbox inside
      const chk = item.querySelector('input[type="checkbox"]');
      if (chk) {
        // If they clicked on the checkbox itself, stop duplicate trigger
        if (e.target === chk) {
          if (chk.checked) {
            item.classList.add('checked');
          } else {
            item.classList.remove('checked');
          }
          saveCheckState();
        } else {
          toggleCheckItem(item, chk.id);
        }
      }
    });
  });

  function saveCheckState() {
    const states = {};
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach((chk) => {
      states[chk.id] = chk.checked;
    });
    localStorage.setItem('av_checklist_states', JSON.stringify(states));
  }

  function loadChecklistStates() {
    const statesStr = localStorage.getItem('av_checklist_states');
    if (statesStr) {
      try {
        const states = JSON.parse(statesStr);
        Object.keys(states).forEach((id) => {
          const chk = document.getElementById(id);
          if (chk) {
            chk.checked = states[id];
            const itemEl = chk.closest('.checklist-item');
            if (itemEl) {
              if (chk.checked) {
                itemEl.classList.add('checked');
              } else {
                itemEl.classList.remove('checked');
              }
            }
          }
        });
      } catch (e) {
        console.error('Failed to parse checklist states', e);
      }
    }
  }

  function clearChecklistStates() {
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach((chk) => {
      chk.checked = false;
      const item = chk.closest('.checklist-item');
      if (item) item.classList.remove('checked');
    });
    localStorage.removeItem('av_checklist_states');
  }

  if (btnResetChecklists) {
    btnResetChecklists.addEventListener('click', clearChecklistStates);
  }

  function generateChecklistReport() {
    const output = [];
    const d = new Date();
    output.push('==================================================');
    output.push('        AV VERIFICATION COMPLIANCE REPORT         ');
    output.push(` Date/Time : ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`);
    output.push(' Room Name : Boardroom / Conference Room Delta    ');
    output.push('==================================================');
    output.push('');

    output.push('Daily Teams/Zoom Rooms Checks:');
    const mtrItems = [
      ['mtr-1', 'Tablet controller powered & charging'],
      ['mtr-2', 'Mic mute synchronization to physical DSP mute LEDs'],
      ['mtr-3', 'Speaker playback test clear'],
      ['mtr-4', 'Camera preview & PTZ coordinate verification'],
      ['mtr-5', 'HDMI/USB-C tabletop cable & retractor inspection'],
    ];
    mtrItems.forEach(([id, text]) => {
      const chk = document.getElementById(id);
      const status = chk && chk.checked ? '[PASS]' : '[FAIL/PENDING]';
      output.push(`  ${status.padEnd(15)} : ${text}`);
    });
    output.push('');

    output.push('Pre-Event Production Checks:');
    const eventItems = [
      ['event-1', 'Sightlines check & floor safety cables taped'],
      ['event-2', 'Lapel & wireless microphone battery thresholds'],
      ['event-3', 'Acoustic room walk-test (RF & EQ response)'],
      ['event-4', 'Presenter laptop AC connection & Focus Assist mode'],
      ['event-5', 'Confidence monitor output routing view'],
    ];
    eventItems.forEach(([id, text]) => {
      const chk = document.getElementById(id);
      const status = chk && chk.checked ? '[PASS]' : '[FAIL/PENDING]';
      output.push(`  ${status.padEnd(15)} : ${text}`);
    });

    output.push('');
    output.push('==================================================');
    output.push(' Report compiled by: AV Technician On Duty        ');
    output.push('==================================================');

    if (reportTextOutput) {
      reportTextOutput.value = output.join('\n');
    }
    if (reportModal) {
      reportModal.style.display = 'flex';
    }
  }

  if (btnGenerateReport) {
    btnGenerateReport.addEventListener('click', generateChecklistReport);
  }

  function closeReportModal() {
    if (reportModal) {
      reportModal.style.display = 'none';
    }
  }

  if (btnCloseReport) {
    btnCloseReport.addEventListener('click', closeReportModal);
  }

  function copyReportText() {
    if (reportTextOutput) {
      reportTextOutput.select();
      document.execCommand('copy');
      alert('Verification report copied to clipboard!');
    }
  }

  if (btnCopyReport) {
    btnCopyReport.addEventListener('click', copyReportText);
  }

  // --- AV Sync / Latency Tester Sweep logic ---
  let isSyncRunning = false;
  const syncCanvas = document.getElementById('sync-tester-canvas');
  let syncCtx = null;
  if (syncCanvas) {
    syncCtx = syncCanvas.getContext('2d');
  }
  let syncTesterAnimationId = null;
  let syncDelayMs = 0; // simulated audio delay offset
  let syncStartFrameTime = 0;

  const btnToggleSync = document.getElementById('btn-toggle-sync');
  const btnResetSync = document.getElementById('btn-reset-sync');
  const labelSyncDelay = document.getElementById('lbl-sync-delay');
  const rangeSyncDelay = document.getElementById('range-sync-delay');

  function updateSyncDelay(val) {
    syncDelayMs = parseInt(val, 10);
    if (labelSyncDelay) {
      labelSyncDelay.textContent = `${val > 0 ? '+' : ''}${val} ms`;
    }
  }

  if (rangeSyncDelay) {
    rangeSyncDelay.addEventListener('input', (e) => {
      updateSyncDelay(e.target.value);
    });
  }

  function toggleSyncTester() {
    initAudio();

    if (isSyncRunning) {
      isSyncRunning = false;
      if (btnToggleSync) {
        btnToggleSync.textContent = '▶ Run Sync Sweep';
        btnToggleSync.classList.remove('btn-danger');
        btnToggleSync.classList.add('btn-primary');
      }
      if (syncTesterAnimationId) {
        cancelAnimationFrame(syncTesterAnimationId);
        syncTesterAnimationId = null;
      }
    } else {
      stopAllSignals();
      isSyncRunning = true;
      if (btnToggleSync) {
        btnToggleSync.textContent = '■ Stop Sync Sweep';
        btnToggleSync.classList.remove('btn-primary');
        btnToggleSync.classList.add('btn-danger');
      }
      syncStartFrameTime = performance.now();
      drawSyncFrame();
    }
  }

  if (btnToggleSync) {
    btnToggleSync.addEventListener('click', toggleSyncTester);
  }

  function resetSyncTester() {
    if (isSyncRunning) {
      toggleSyncTester();
    }
    updateSyncDelay(0);
    if (rangeSyncDelay) {
      rangeSyncDelay.value = 0;
    }

    if (syncCtx && syncCanvas) {
      // Clear canvas
      syncCtx.fillStyle = '#060910';
      syncCtx.fillRect(0, 0, syncCanvas.width, syncCanvas.height);
      drawSyncSkeleton(syncCanvas.width / 2);
    }
  }

  if (btnResetSync) {
    btnResetSync.addEventListener('click', resetSyncTester);
  }

  function drawSyncSkeleton(markerX) {
    if (!syncCtx || !syncCanvas) return;

    const w = syncCanvas.width;

    // Draw center sync target box
    syncCtx.strokeStyle = '#2a3042'; // var(--border)
    syncCtx.lineWidth = 1;
    syncCtx.strokeRect(w / 2 - 120, 15, 240, 50);

    syncCtx.fillStyle = '#8a8d93';
    syncCtx.font = "bold 12px 'Poppins', sans-serif";
    syncCtx.textAlign = 'center';
    syncCtx.fillText('SYNC TARGET', w / 2, 45);

    // Draw track container
    const trackY = 140;
    const trackW = 460;
    const trackStart = w / 2 - trackW / 2;

    syncCtx.fillStyle = '#02060c';
    syncCtx.fillRect(trackStart - 5, trackY - 20, trackW + 10, 40);
    syncCtx.strokeStyle = '#2a3042';
    syncCtx.strokeRect(trackStart - 5, trackY - 20, trackW + 10, 40);

    // Draw tick markers
    // Scale: 230 pixels = 500 ms (0.46 px = 1 ms)
    const pxPerMs = 230 / 500;
    for (let offset = -500; offset <= 500; offset += 100) {
      const tx = w / 2 + offset * pxPerMs;
      const isCenter = offset === 0;

      syncCtx.strokeStyle = isCenter ? '#10b981' : '#2a3042';
      syncCtx.lineWidth = isCenter ? 2 : 1;

      syncCtx.beginPath();
      syncCtx.moveTo(tx, trackY - (isCenter ? 15 : 8));
      syncCtx.lineTo(tx, trackY + (isCenter ? 15 : 8));
      syncCtx.stroke();

      if (offset % 200 === 0 || isCenter) {
        syncCtx.fillStyle = isCenter ? '#34d399' : '#8a8d93';
        syncCtx.font = "9px 'Inter', monospace";
        syncCtx.fillText(isCenter ? '0 ms' : `${offset > 0 ? '+' : ''}${offset}`, tx, trackY + 25);
      }
    }

    // Draw Marker
    if (typeof markerX === 'number') {
      syncCtx.fillStyle = '#ff6b6b';
      syncCtx.fillRect(markerX - 4, trackY - 15, 8, 30);
      syncCtx.strokeStyle = 'white';
      syncCtx.lineWidth = 1;
      syncCtx.strokeRect(markerX - 4, trackY - 15, 8, 30);
    }
  }

  // Keyboard shortcut listener for spacebar sync sweep
  document.addEventListener('keydown', (e) => {
    const syncTab = document.getElementById('tab-sync');
    if (e.code === 'Space' && syncTab && syncTab.classList.contains('active')) {
      e.preventDefault();
      toggleSyncTester();
    }
  });

  let lastBeepTime = 0;

  function drawSyncFrame() {
    if (!isSyncRunning || !syncCtx || !syncCanvas) return;

    const w = syncCanvas.width;
    const h = syncCanvas.height;
    const now = performance.now();

    // Loop cycle is exactly 1 second (1000 ms)
    const elapsed = (now - syncStartFrameTime) % 1000;

    // Sweep marker coordinate
    const markerOffsetMs = elapsed - 500;
    const pxPerMs = 230 / 500;
    const markerX = w / 2 + markerOffsetMs * pxPerMs;

    // Flash frame triggers at 500ms
    const isFlashFrame = Math.abs(elapsed - 500) < 16.7;

    // Render background
    syncCtx.fillStyle = isFlashFrame ? '#155e75' : '#060910';
    syncCtx.fillRect(0, 0, w, h);

    if (isFlashFrame) {
      // Flash box
      syncCtx.fillStyle = 'white';
      syncCtx.fillRect(w / 2 - 120, 15, 240, 50);
      syncCtx.fillStyle = 'black';
      syncCtx.font = "bold 16px 'Poppins', sans-serif";
      syncCtx.textAlign = 'center';
      syncCtx.fillText('FLASH SYNC!', w / 2, 45);
    } else {
      drawSyncSkeleton(markerX);
    }

    // Audio click trigger with offset
    const targetBeepTime = 500 + syncDelayMs;
    const timeDiff = elapsed - targetBeepTime;
    if (timeDiff >= 0 && timeDiff < 50 && now - lastBeepTime > 500) {
      triggerSyncBeep();
      lastBeepTime = now;
    }

    // Sweep text summary
    syncCtx.fillStyle = '#8a8d93';
    syncCtx.font = "10px 'Inter', sans-serif";
    syncCtx.textAlign = 'center';
    syncCtx.fillText(`Tester Frame Sweep | Offset Delay: ${syncDelayMs} ms`, w / 2, h - 15);

    syncTesterAnimationId = requestAnimationFrame(drawSyncFrame);
  }

  function triggerSyncBeep() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1 kHz Reference beep

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // --- Initialization execution ---
  loadMediaDevices();
  loadChecklistStates();

  // Initial draw of sync tester skeleton
  if (syncCanvas) {
    resetSyncTester();
  }
});
