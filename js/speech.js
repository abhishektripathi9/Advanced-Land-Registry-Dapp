/**
 * TalkRiva AI - Speech & Audio Controller
 * Manages Speech-to-Text (STT), Text-to-Speech (TTS), Web Audio chime synthesizer,
 * and the Riva Waveform Visualizer.
 */

class SpeechController {
  constructor({ onInterimText, onFinalSpeech, onSpeechStart, onSpeechEnd, onAIStartSpeaking, onAIEndSpeaking }) {
    this.onInterimText = onInterimText;
    this.onFinalSpeech = onFinalSpeech;
    this.onSpeechStart = onSpeechStart;
    this.onSpeechEnd = onSpeechEnd;
    this.onAIStartSpeaking = onAIStartSpeaking;
    this.onAIEndSpeaking = onAIEndSpeaking;

    this.isRecording = false;
    this.isSpeaking = false;
    this.speechSynthesisEnabled = true;
    this.speechRate = 0.98; // PW Talk Riva natural, energetic conversational speed
    this.speechPitch = 1.10; // Warm, attractive, lively female tone (not flat or robotic)
    this.activePartner = 'aria'; // Default to Aria (Female Voice)
    this.selectedVoice = null;
    this.voices = [];
    this.hindiRecognition = null;

    // Web Audio Context for synthesized UI sound effects
    this.audioCtx = null;

    // Speech Recognition initialization
    this.initSpeechRecognition();

    // Speech Synthesis initialization
    this.initSpeechSynthesis();

    // Canvas Visualizer initialization
    this.initVisualizer();
  }

  setLevel(level) {
    if (level === 'beginner') {
      this.speechRate = 0.82; // Clear and slow for beginners
    } else if (level === 'intermediate') {
      this.speechRate = 0.95; // Natural conversational clarity
    } else {
      this.speechRate = 1.05; // Fluent native speed
    }
  }

  /* ------------------------------------------------------------------------
   * SOUND EFFECTS SYNTHESIZER (Web Audio API)
   * ------------------------------------------------------------------------ */
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playChime(type = 'start') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        // High pleasant ding
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'stop') {
        // Soft click-down
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        // Bright victory chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /* ------------------------------------------------------------------------
   * SPEECH RECOGNITION (STT)
   * ------------------------------------------------------------------------ */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API is not supported in this browser.");
      this.recognition = null;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.playChime('start');
      if (this.onSpeechStart) this.onSpeechStart();
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim && this.onInterimText) {
        this.onInterimText(interim);
      }

      if (final && this.onFinalSpeech) {
        this.onFinalSpeech(final);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      this.stopListening();
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.playChime('stop');
      if (this.onSpeechEnd) this.onSpeechEnd();
    };
  }

  startListening() {
    if (!this.recognition) {
      alert("Microphone speech recognition is not supported in this browser. Please type your message or use Google Chrome / Edge.");
      return;
    }

    // Stop TTS if speaking so user can talk
    this.stopSpeaking();

    try {
      this.recognition.start();
    } catch (err) {
      // Already running
      console.log("Recognition already active", err);
    }
  }

  stopListening() {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isRecording = false;
  }

  toggleListening() {
    if (this.isRecording) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  /* ------------------------------------------------------------------------
   * DEDICATED HINDI-TO-ENGLISH RECOGNITION (hi-IN)
   * ------------------------------------------------------------------------ */
  startHindiListening({ onInterim, onFinal, onError, onStart, onEnd }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError("Microphone recognition is not supported in this browser.");
      return null;
    }

    this.stopSpeaking();
    this.stopListening();
    this.stopHindiListening();

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'hi-IN'; // Explicitly recognize Hindi

    rec.onstart = () => {
      this.playChime('start');
      if (onStart) onStart();
    };

    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim && onInterim) onInterim(interim);
      if (final && onFinal) onFinal(final);
    };

    rec.onerror = (e) => {
      console.warn("Hindi recognition error:", e.error);
      if (onError) onError(e.error);
    };

    rec.onend = () => {
      this.playChime('stop');
      if (onEnd) onEnd();
    };

    try {
      rec.start();
      this.hindiRecognition = rec;
      return rec;
    } catch (err) {
      console.warn("Could not start Hindi recognition:", err);
      return null;
    }
  }

  stopHindiListening() {
    if (this.hindiRecognition) {
      try {
        this.hindiRecognition.stop();
      } catch (e) {}
      this.hindiRecognition = null;
    }
  }

  /* ------------------------------------------------------------------------
   * SPEECH SYNTHESIS (TTS)
   * ------------------------------------------------------------------------ */
  initSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
      console.warn("SpeechSynthesis is not supported.");
      return;
    }

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.updatePartnerVoice();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  setPartner(partner) {
    this.activePartner = partner;
    this.updatePartnerVoice();
  }

  setRate(rate) {
    this.speechRate = parseFloat(rate) || 1.0;
  }

  setPitch(pitch) {
    this.speechPitch = parseFloat(pitch) || 1.0;
  }

  toggleSpeechOutput() {
    this.speechSynthesisEnabled = !this.speechSynthesisEnabled;
    if (!this.speechSynthesisEnabled) {
      this.stopSpeaking();
    }
    return this.speechSynthesisEnabled;
  }

  updatePartnerVoice() {
    if (!this.voices || this.voices.length === 0) return;

    // Filter strictly to English voices
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    
    // Strict female filter: reject all male indicators
    const femaleVoices = englishVoices.filter(v => {
      const name = v.name.toLowerCase();
      const isMale = /male|david|george|alex|guy|ryan|daniel|rishi|christopher|mark|paul|james|richard|stefan|ravi/i.test(name) && !/female/i.test(name);
      return !isMale;
    });

    // Score voices: prioritize the sweetest, natural, most attractive female voices
    const scored = (femaleVoices.length > 0 ? femaleVoices : englishVoices).map(v => {
      const name = v.name.toLowerCase();
      let score = 0;
      if (name.includes('natural')) score += 50;
      if (name.includes('online')) score += 30;
      // Top natural female character voices
      if (name.includes('neerja')) score += 55; // Sweet Indian English Natural
      if (name.includes('sonia')) score += 52;  // Clear Indian English Natural
      if (name.includes('aria')) score += 48;   // Microsoft Aria Natural
      if (name.includes('jenny')) score += 45;  // Microsoft Jenny Natural
      if (name.includes('google uk english female')) score += 40;
      if (name.includes('google us english')) score += 35;
      if (name.includes('samantha')) score += 30; // iOS/macOS smooth female voice
      if (name.includes('victoria') || name.includes('karen')) score += 25;
      if (name.includes('heera') || name.includes('veena')) score += 20;
      if (name.includes('zira')) score += 10;
      if (name.includes('female')) score += 8;
      return { voice: v, score };
    });

    scored.sort((a, b) => b.score - a.score);
    this.selectedVoice = scored.length > 0 ? scored[0].voice : (femaleVoices[0] || englishVoices[0] || this.voices[0]);
  }

  speak(text, customRate = null) {
    if (!this.speechSynthesisEnabled || !('speechSynthesis' in window)) return;
    if (!text || text.trim() === '') return;

    // Clean markdown or unwanted tokens from speech string
    const cleanSpeechText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    
    // Check if speaking Hindi or Hinglish phrase
    const hasHindi = /[\u0900-\u097F]|koi baat nahi|hindi me bolo|translate kar dungi/i.test(cleanSpeechText);
    if (hasHindi && this.voices && this.voices.length > 0) {
      // Find authentic Hindi voice or Indian voice so Hindi sounds natural and sweet
      const hindiVoice = this.voices.find(v => v.lang.startsWith('hi')) ||
                         this.voices.find(v => /swara|madhur|kalpana|hemant|neerja|sonia/i.test(v.name)) ||
                         this.voices.find(v => v.lang === 'en-IN') ||
                         this.selectedVoice;
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = hindiVoice.lang || 'hi-IN';
      } else {
        utterance.voice = this.selectedVoice;
      }
    } else {
      utterance.voice = this.selectedVoice;
    }

    utterance.rate = customRate || this.speechRate;
    utterance.pitch = this.speechPitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onAIStartSpeaking) this.onAIStartSpeaking();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onAIEndSpeaking) this.onAIEndSpeaking();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      this.isSpeaking = false;
      if (this.onAIEndSpeaking) this.onAIEndSpeaking();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.onAIEndSpeaking) this.onAIEndSpeaking();
  }

  /* ------------------------------------------------------------------------
   * RIVA WAVEFORM VISUALIZER (Canvas 60fps Animation)
   * ------------------------------------------------------------------------ */
  initVisualizer() {
    this.canvas = document.getElementById('audio-visualizer-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.phase = 0;

    const render = () => {
      this.drawWaveform();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  drawWaveform() {
    if (!this.canvas || !this.ctx) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const isLive = this.isRecording || this.isSpeaking;

    // Base subtle line if idle, animated sine waves if speaking/recording
    ctx.lineWidth = 2.2;
    this.phase += isLive ? 0.08 : 0.02;

    const waveCount = 3;
    const colors = this.isRecording
      ? ['rgba(239, 68, 68, 0.8)', 'rgba(244, 63, 94, 0.5)', 'rgba(251, 113, 133, 0.3)']
      : this.isSpeaking
      ? ['rgba(6, 182, 212, 0.9)', 'rgba(99, 102, 241, 0.6)', 'rgba(168, 85, 247, 0.4)']
      : ['rgba(100, 116, 139, 0.3)', 'rgba(100, 116, 139, 0.15)', 'rgba(100, 116, 139, 0.08)'];

    for (let w = 0; w < waveCount; w++) {
      ctx.beginPath();
      ctx.strokeStyle = colors[w];

      const amplitude = isLive ? (w === 0 ? 14 : 9) : 2.5;
      const frequency = 0.025 + w * 0.01;
      const speedOffset = w * 1.5;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * frequency + this.phase + speedOffset) * amplitude * Math.sin((x / width) * Math.PI);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }
}

// Export for app usage
window.SpeechController = SpeechController;
