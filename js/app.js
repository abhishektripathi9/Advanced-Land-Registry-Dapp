/**
 * TalkRiva AI - Main Application Controller (Aria Real-Life Communication Edition)
 * Features:
 * 1. Multi-Step Diagnostic Portal (Name, Native Level, Main Goal, Profession Background)
 * 2. Persistent AI Memory Mind (Remembers Learner Profile, Extracted Facts, Grammar Slips)
 * 3. 7-Day Real-Life Communication Curriculum (First Impressions, SVO Anchor, Silent Pause, FORD, Diplomacy, Pitch, STAR Method)
 * 4. Interactive Lesson Viewer with Real-Life Tips, 5 Power Vocabs & Audio Pronunciation
 * 5. Interactive Practice for Every Lesson in Unique Black Glowing Room
 * 6. Strictly Female Voice (Aria) + Show Hint + Tap to Speak + Help Me Speak Stack
 * 7. Real-Time Mistake Detector with Visual Diff & Hindi Explanations
 */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new ConversationEngine();

  // App State
  const state = {
    userName: engine.memory.data.profile.name || '',
    userCity: engine.memory.data.profile.city || (typeof localStorage !== 'undefined' ? (localStorage.getItem('talkriva_user_city') || '') : ''),
    userLevel: engine.memory.data.profile.level || 'tooti-footi',
    userGoal: engine.memory.data.profile.goal || 'job-interview',
    userProfession: engine.memory.data.profile.profession || 'student',
    activeTab: 'lessons',
    vocabFilter: 'all',
    mcqFilter: 'all',
    mcqIndex: 0,
    mcqScore: 0,
    mcqStreak: 0,
    mcqAnswered: false,
    mode: 'casual',
    activeLessonDay: null,
    currentSelectedLesson: null,
    isRecording: false,
    isProcessing: false,
    mistakesCount: 0
  };

  // DOM Elements
  const dom = {
    // Screens
    portalScreen: document.getElementById('portal-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),
    talkAriaScreen: document.getElementById('talk-aria-screen'),

    // Portal Form & Returning Banner
    portalForm: document.getElementById('portal-form'),
    userNameInput: document.getElementById('user-name-input'),
    userCityInput: document.getElementById('user-city-input'),
    portalReturningBanner: document.getElementById('portal-returning-banner'),
    portalReturningName: document.getElementById('portal-returning-name'),
    portalReturningDetail: document.getElementById('portal-returning-detail'),
    portalQuickContinueBtn: document.getElementById('portal-quick-continue-btn'),

    // Dashboard Header & Badges
    dashUserDisplayName: document.getElementById('dash-user-display-name'),
    dashLevelBadge: document.getElementById('dash-level-badge'),
    dashGoalBadge: document.getElementById('dash-goal-badge'),
    dashCityBadge: document.getElementById('dash-city-badge'),
    ariaPersonalizedGreeting: document.getElementById('aria-personalized-greeting'),
    openMemoryModalBtn: document.getElementById('open-memory-modal-btn'),
    openMistakesFromDashBtn: document.getElementById('open-mistakes-from-dash-btn'),
    logoutPortalBtn: document.getElementById('logout-portal-btn'),

    // Dashboard Tabs (Separating Lessons Hub & AI Room)
    tabBtnLessons: document.getElementById('tab-btn-lessons'),
    tabBtnAi: document.getElementById('tab-btn-ai'),
    tabContentLessons: document.getElementById('tab-content-lessons'),
    tabContentAi: document.getElementById('tab-content-ai'),

    // Visual Vocabularies
    visualVocabsGrid: document.getElementById('visual-vocabs-grid'),
    vocabFilterPills: document.getElementById('vocab-filter-pills'),

    // Interactive MCQ Quiz Zone
    mcqFilterPills: document.getElementById('mcq-filter-pills'),
    mcqActiveCard: document.getElementById('mcq-active-card'),
    mcqCurrentNum: document.getElementById('mcq-current-num'),
    mcqTotalNum: document.getElementById('mcq-total-num'),
    mcqCatBadge: document.getElementById('mcq-cat-badge'),
    mcqScoreDisplay: document.getElementById('mcq-score-display'),
    mcqStreakDisplay: document.getElementById('mcq-streak-display'),
    mcqQuestionPrompt: document.getElementById('mcq-question-prompt'),
    mcqQuestionHindi: document.getElementById('mcq-question-hindi'),
    mcqOptionsGrid: document.getElementById('mcq-options-grid'),
    mcqFeedbackDrawer: document.getElementById('mcq-feedback-drawer'),
    mcqFeedbackStatus: document.getElementById('mcq-feedback-status'),
    mcqFeedbackExplanation: document.getElementById('mcq-feedback-explanation'),
    mcqTipText: document.getElementById('mcq-tip-text'),
    mcqListenCorrectBtn: document.getElementById('mcq-listen-correct-btn'),
    mcqNextBtn: document.getElementById('mcq-next-btn'),

    // AI Tab Gateway & Memory Snapshot
    aiTabMemoryGrid: document.getElementById('ai-tab-memory-grid'),
    openMemoryFromAiTab: document.getElementById('open-memory-from-ai-tab'),

    // Dashboard Curriculum
    curriculumLessonsList: document.getElementById('curriculum-lessons-list'),
    startRoadmapBtn: document.getElementById('start-roadmap-btn'),
    enterTalkRoomBtn: document.getElementById('enter-talk-room-btn'),

    // Talk Room Header
    backToDashboardBtn: document.getElementById('back-to-dashboard-btn'),
    ariaSpeedSelect: document.getElementById('aria-speed-select'),
    toggleAnalysisPanelBtn: document.getElementById('toggle-analysis-panel-btn'),
    toolMistakesBadge: document.getElementById('tool-mistakes-badge'),
    ariaSpeakingStatus: document.getElementById('aria-speaking-status'),
    rivaRoomMood: document.getElementById('riva-room-mood'),

    // Talk Room Stage
    hologramAvatarImg: document.getElementById('hologram-avatar-img'),
    hologramPulseRipple: document.getElementById('hologram-pulse-ripple'),
    roomVisualizerCanvas: document.getElementById('room-audio-visualizer-canvas'),
    roomChatStream: document.getElementById('room-chat-stream'),

    // Talk Room Controls (Show Hint -> Golden Mic -> Help Me Speak)
    roomLevelSelect: document.getElementById('room-level-select'),
    roomHintDrawer: document.getElementById('room-hint-drawer'),
    toggleHintBtn: document.getElementById('toggle-hint-btn'),
    closeRhBtn: document.getElementById('close-rh-btn'),
    rhTargetSentence: document.getElementById('rh-target-sentence'),
    rhAriaAskingText: document.getElementById('rh-aria-asking-text'),
    rhPhoneticGuide: document.getElementById('rh-phonetic-guide'),
    rhHindiMeaning: document.getElementById('rh-hindi-meaning'),
    rhListenBtn: document.getElementById('rh-listen-btn'),
    rhSpeakNowBtn: document.getElementById('rh-speak-now-btn'),

    roomInterimBox: document.getElementById('room-interim-box'),
    roomInterimText: document.getElementById('room-interim-text'),
    roomMicBtn: document.getElementById('room-mic-btn'),
    roomMicCaption: document.getElementById('room-mic-caption'),

    helpMeSpeakBtn: document.getElementById('help-me-speak-btn'),
    roomTextForm: document.getElementById('room-text-form'),
    roomTextInput: document.getElementById('room-text-input'),

    // Modal 4: Help Me Speak (Hindi to English)
    helpMeSpeakModal: document.getElementById('help-me-speak-modal'),
    closeHmsModal: document.getElementById('close-hms-modal'),
    hmsHindiMicBtn: document.getElementById('hms-hindi-mic-btn'),
    hmsMicLabel: document.getElementById('hms-mic-label'),
    hmsHindiInput: document.getElementById('hms-hindi-input'),
    hmsTranslateBtn: document.getElementById('hms-translate-btn'),
    hmsResEnglish: document.getElementById('hms-res-english'),
    hmsResPhonetic: document.getElementById('hms-res-phonetic'),
    hmsResHindi: document.getElementById('hms-res-hindi'),
    hmsActHearBtn: document.getElementById('hms-act-hear-btn'),
    hmsActSendBtn: document.getElementById('hms-act-send-btn'),

    // Mistake Drawer
    roomMistakeDrawer: document.getElementById('room-mistake-drawer'),
    closeRmdBtn: document.getElementById('close-rmd-btn'),
    rmdWrongText: document.getElementById('rmd-wrong-text'),
    rmdCorrectText: document.getElementById('rmd-correct-text'),
    rmdHindiExplanation: document.getElementById('rmd-hindi-explanation'),
    rmdNativeText: document.getElementById('rmd-native-text'),
    rmdListenNativeBtn: document.getElementById('rmd-listen-native-btn'),

    // Lesson Viewer Modal
    lessonViewerModal: document.getElementById('lesson-viewer-modal'),
    closeLessonModal: document.getElementById('close-lesson-modal'),
    lmDayBadge: document.getElementById('lm-day-badge'),
    lmLevelTag: document.getElementById('lm-level-tag'),
    lmTitle: document.getElementById('lm-title'),
    lmSummary: document.getElementById('lm-summary'),
    lmTipsList: document.getElementById('lm-tips-list'),
    lmVocabsGrid: document.getElementById('lm-vocabs-grid'),
    lmWrongPhrase: document.getElementById('lm-wrong-phrase'),
    lmCorrectPhrase: document.getElementById('lm-correct-phrase'),
    lmMistakeHindi: document.getElementById('lm-mistake-hindi'),
    lmPracticeGoal: document.getElementById('lm-practice-goal'),
    startLessonPracticeBtn: document.getElementById('start-lesson-practice-btn'),

    // Aria Memory Modal
    ariaMemoryModal: document.getElementById('aria-memory-modal'),
    closeMemoryModal: document.getElementById('close-memory-modal'),
    memUserName: document.getElementById('mem-user-name'),
    memLevelTag: document.getElementById('mem-level-tag'),
    memGoalTag: document.getElementById('mem-goal-tag'),
    memProfTag: document.getElementById('mem-prof-tag'),
    memNotesList: document.getElementById('mem-notes-list'),
    memSlipsList: document.getElementById('mem-slips-list'),
    memLessonsProgress: document.getElementById('mem-lessons-progress'),

    // Common Mistakes Modal
    mistakesLibModal: document.getElementById('mistakes-lib-modal'),
    closeMistakesModal: document.getElementById('close-mistakes-modal'),
    mistakesRulesGrid: document.getElementById('mistakes-rules-grid')
  };

  // Strictly Female Voice Controller (Aria)
  const speech = new SpeechController({
    onInterimText: (text) => {
      dom.roomInterimBox.classList.remove('hidden');
      dom.roomInterimText.textContent = text;
    },
    onFinalSpeech: (text) => {
      dom.roomInterimBox.classList.add('hidden');
      dom.roomInterimText.textContent = '';
      handleUserTurn(text);
    },
    onSpeechStart: () => {
      dom.roomMicBtn.classList.add('recording');
      dom.roomMicCaption.textContent = 'LISTENING... (बोलिए)';
      dom.ariaSpeakingStatus.textContent = 'Listening to your voice...';
    },
    onSpeechEnd: () => {
      dom.roomMicBtn.classList.remove('recording');
      dom.roomMicCaption.textContent = 'TAP TO SPEAK (बोलने के लिए दबाएं)';
      dom.ariaSpeakingStatus.textContent = 'Ready to listen · बोलिए';
    },
    onAIStartSpeaking: () => {
      dom.hologramPulseRipple.classList.add('speaking');
      dom.ariaSpeakingStatus.textContent = 'Aria is speaking...';
    },
    onAIEndSpeaking: () => {
      dom.hologramPulseRipple.classList.remove('speaking');
      dom.ariaSpeakingStatus.textContent = 'Your turn! Tap mic to speak.';
    }
  });

  // Ensure Aria only speaks with female voice at PW Talk Riva speed (0.98x) and attractive pitch (1.05)
  speech.setPartner('aria');
  speech.speechRate = 0.98;
  speech.speechPitch = 1.05;

  /* ========================================================================
   * SCREEN MANAGEMENT
   * ======================================================================== */
  function showScreen(screenId) {
    [dom.portalScreen, dom.dashboardScreen, dom.talkAriaScreen].forEach(s => s.classList.add('hidden'));
    if (screenId === 'portal') {
      dom.portalScreen.classList.remove('hidden');
    } else if (screenId === 'dashboard') {
      updateDashboardData();
      dom.dashboardScreen.classList.remove('hidden');
    } else if (screenId === 'talk') {
      dom.talkAriaScreen.classList.remove('hidden');
      startTalkRoomSession();
    }
  }

  /* ========================================================================
   * 1. PORTAL (REGISTRATION & ASSESSMENT)
   * ======================================================================== */
  dom.portalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = dom.userNameInput.value.trim();
    const city = (dom.userCityInput ? dom.userCityInput.value : (document.getElementById('user-city-input')?.value || '')).trim();

    const selectedLevelEl = document.querySelector('input[name="english-level"]:checked');
    const level = selectedLevelEl ? selectedLevelEl.value : 'tooti-footi';

    const selectedGoalEl = document.querySelector('input[name="english-goal"]:checked');
    const goal = selectedGoalEl ? selectedGoalEl.value : 'job-interview';

    const selectedProfEl = document.querySelector('input[name="user-profession"]:checked');
    const profession = selectedProfEl ? selectedProfEl.value : 'student';

    if (!name) return;

    state.userName = name;
    state.userCity = city;
    state.userLevel = level;
    state.userGoal = goal;
    state.userProfession = profession;

    engine.memory.updateProfile({ name, city, level, goal, profession });

    speech.playChime('success');
    showScreen('dashboard');
  });

  // Radio button active styling handlers
  document.querySelectorAll('.assessment-radio-label input').forEach(radio => {
    radio.addEventListener('change', () => {
      const groupName = radio.getAttribute('name');
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        r.closest('.assessment-radio-label').classList.remove('active');
      });
      radio.closest('.assessment-radio-label').classList.add('active');
    });
  });

  // Profession chips active styling handlers
  document.querySelectorAll('.prof-chip input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.prof-chip').forEach(c => c.classList.remove('active'));
      radio.closest('.prof-chip').classList.add('active');
    });
  });

  dom.logoutPortalBtn.addEventListener('click', () => {
    showScreen('portal');
  });

  // Portal Initial State Setup (Returning User Support)
  function initPortalState() {
    if (state.userName) {
      if (dom.portalReturningBanner) {
        dom.portalReturningBanner.classList.remove('hidden');
      }
      if (dom.portalReturningName) {
        dom.portalReturningName.textContent = state.userName;
      }
      if (dom.portalReturningDetail) {
        const goalNames = {
          'job-interview': 'Job Interview & Placements',
          'daily-chat': 'Daily Conversation',
          'overcome-fear': 'Overcoming Hesitation',
          'abroad-travel': 'Abroad Studies & Travel'
        };
        const levelNames = {
          'tooti-footi': 'Tooti-Footi English',
          'hesitant': 'Hesitant',
          'intermediate': 'Intermediate',
          'advanced': 'Advanced'
        };
        const locationText = state.userCity ? `${state.userCity} · ` : '';
        dom.portalReturningDetail.textContent = `Aapka data saved hai: ${locationText}${goalNames[state.userGoal] || state.userGoal} (${levelNames[state.userLevel] || state.userLevel})`;
      }
      if (dom.userNameInput) {
        dom.userNameInput.value = state.userName;
      }
      if (dom.userCityInput) {
        dom.userCityInput.value = state.userCity || engine.memory.data.profile.city || '';
      }

      // Check corresponding radio for level
      const levelRadio = document.querySelector(`input[name="english-level"][value="${state.userLevel}"]`);
      if (levelRadio) {
        document.querySelectorAll('input[name="english-level"]').forEach(r => r.closest('.assessment-radio-label')?.classList.remove('active'));
        levelRadio.checked = true;
        levelRadio.closest('.assessment-radio-label')?.classList.add('active');
      }

      // Check goal
      const goalRadio = document.querySelector(`input[name="english-goal"][value="${state.userGoal}"]`);
      if (goalRadio) {
        document.querySelectorAll('input[name="english-goal"]').forEach(r => r.closest('.assessment-radio-label')?.classList.remove('active'));
        goalRadio.checked = true;
        goalRadio.closest('.assessment-radio-label')?.classList.add('active');
      }

      // Check profession
      const profRadio = document.querySelector(`input[name="user-profession"][value="${state.userProfession}"]`);
      if (profRadio) {
        document.querySelectorAll('.prof-chip').forEach(c => c.classList.remove('active'));
        profRadio.checked = true;
        profRadio.closest('.prof-chip')?.classList.add('active');
      }
    }
  }

  if (dom.portalQuickContinueBtn) {
    dom.portalQuickContinueBtn.addEventListener('click', () => {
      speech.playChime('success');
      showScreen('dashboard');
    });
  }

  /* ========================================================================
   * 2. MAIN DASHBOARD TABS (SEPARATING LESSONS HUB & AI CONVERSATION ROOM)
   * ======================================================================== */
  function switchTab(tab) {
    state.activeTab = tab;
    if (tab === 'lessons') {
      if (dom.tabBtnLessons) dom.tabBtnLessons.classList.add('active');
      if (dom.tabBtnAi) dom.tabBtnAi.classList.remove('active');
      if (dom.tabContentLessons) dom.tabContentLessons.classList.remove('hidden');
      if (dom.tabContentAi) dom.tabContentAi.classList.add('hidden');
    } else {
      if (dom.tabBtnAi) dom.tabBtnAi.classList.add('active');
      if (dom.tabBtnLessons) dom.tabBtnLessons.classList.remove('active');
      if (dom.tabContentAi) dom.tabContentAi.classList.remove('hidden');
      if (dom.tabContentLessons) dom.tabContentLessons.classList.add('hidden');
      renderAiTabMemorySnapshot();
    }
  }

  if (dom.tabBtnLessons) {
    dom.tabBtnLessons.addEventListener('click', () => switchTab('lessons'));
  }
  if (dom.tabBtnAi) {
    dom.tabBtnAi.addEventListener('click', () => switchTab('ai'));
  }

  function updateDashboardData() {
    dom.dashUserDisplayName.textContent = state.userName || 'Learner';

    if (dom.dashCityBadge) {
      dom.dashCityBadge.textContent = state.userCity ? `📍 ${state.userCity}` : '📍 Chitkoot';
    }

    const levelDescriptions = {
      'tooti-footi': '🐣 Level 1: Tooti-Footi to Clear Speech',
      'hesitant': '💬 Level 2: Hesitation Removal & Natural Flow',
      'intermediate': '🌿 Level 3: Conversational Fluency & Confidence',
      'advanced': '🎯 Level 4: Advanced Professional & Interview Mastery'
    };
    dom.dashLevelBadge.textContent = levelDescriptions[state.userLevel] || '🐣 Beginner Level';

    const goalLabels = {
      'job-interview': '💼 Goal: Job Interview & Career',
      'daily-chat': '🗣️ Goal: Daily Real-Life Conversation',
      'overcome-fear': '⚡ Goal: Overcome Hesitation & Fear',
      'abroad-travel': '✈️ Goal: Abroad, Travel & Higher Studies'
    };
    dom.dashGoalBadge.textContent = goalLabels[state.userGoal] || '💼 Goal: Spoken English';

    const cityGreetingPart = state.userCity ? ` (${state.userCity})` : '';
    const greetings = {
      'tooti-footi': `"Hello ${state.userName}${cityGreetingPart}! बिल्कुल फ़िक्र मत कीजिए। आपका प्रोफाइल सेव हो गया है। हम टूटी-फूटी इंग्लिश से शुरू करेंगे, रोज़ Real-Life Practice करेंगे और आपको कैंपस प्लेसमेंट और दैनिक बातचीत में पूरे आत्मविश्वास से फ्लूएंट बनाएंगे।"`,
      'hesitant': `"Hello ${state.userName}${cityGreetingPart}! झिझकना छोड़ दीजिए—आरिया के साथ रोज़ बात करके और अभ्यास से आपकी हिचकिचाहट पूरी तरह खत्म हो जाएगी।"`,
      'intermediate': `"Hello ${state.userName}${cityGreetingPart}! चलिए आपकी वोकैबुलरी, डिप्लोमेटिक इंग्लिश और बातचीत की गति को नेटिव स्तर पर ले जाते हैं।"`,
      'advanced': `"Hello ${state.userName}${cityGreetingPart}! Let's master the STAR method, elevator pitch, and crack your interviews together."`
    };
    dom.ariaPersonalizedGreeting.textContent = greetings[state.userLevel] || greetings['tooti-footi'];

    renderVisualVocabs(state.vocabFilter);
    renderMCQQuestion();
    renderCurriculumList();
    renderAiTabMemorySnapshot();
  }

  /* ========================================================================
   * 2A. VISUAL VOCABULARIES (PHOTO + USE WORD IN SENTENCE + INTERVIEW TIP)
   * ======================================================================== */
  function renderVisualVocabs(filter = 'all') {
    if (!dom.visualVocabsGrid || !engine.visualVocabs) return;
    dom.visualVocabsGrid.innerHTML = '';

    const list = engine.visualVocabs.filter(v => filter === 'all' || v.category === filter);

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'visual-vocab-card';

      // Highlight the word in sentence
      const regex = new RegExp(`(${item.word})`, 'gi');
      const highlightedSentence = item.sentenceExample.replace(regex, '<strong>$1</strong>');

      card.innerHTML = `
        <div class="vvc-photo-wrapper">
          <img src="${item.image}" alt="${item.word}" class="vvc-photo" loading="lazy">
          <span class="vvc-category-tag">${item.categoryBadge}</span>
        </div>
        <div class="vvc-body">
          <div class="vvc-title-row">
            <div class="vvc-word-wrap">
              <span class="vvc-word">${item.word}</span>
              <span class="vvc-type">(${item.type})</span>
            </div>
            <button class="vvc-listen-word-btn" title="Listen pronunciation">🔊 Hear</button>
          </div>
          <div class="vvc-phonetic">🗣️ [${item.phonetic}]</div>
          <div class="vvc-hindi">🇮🇳 ${item.hindi}</div>
          <div class="vvc-def">${item.definition}</div>

          <!-- PROMINENT USE WORD IN THIS SENTENCE BOX DIRECTLY UNDER/ON PHOTO -->
          <div class="vvc-sentence-box">
            <div class="vvc-sentence-heading">
              <span>📝 Use Word to This Sentence (वाक्य में प्रयोग):</span>
            </div>
            <div class="vvc-sentence-en">${highlightedSentence}</div>
            <div class="vvc-sentence-hi">🇮🇳 ${item.sentenceHindi}</div>
            <div class="vvc-interview-tip">
              <span>💎</span>
              <div><strong>Interview Cracking Secret:</strong> ${item.interviewTip}</div>
            </div>
            <button class="vvc-listen-sentence-btn">🔊 Listen Full Sentence (वाक्य सुनें)</button>
          </div>
        </div>
      `;

      // Word pronunciation audio button
      card.querySelector('.vvc-listen-word-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        speech.speak(item.word);
      });

      // Full sentence audio button
      card.querySelector('.vvc-listen-sentence-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        speech.speak(item.sentenceExample);
      });

      dom.visualVocabsGrid.appendChild(card);
    });
  }

  // Vocab Category Filter Buttons
  document.querySelectorAll('.v-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.vocabFilter = btn.dataset.filter || 'all';
      renderVisualVocabs(state.vocabFilter);
    });
  });

  /* ========================================================================
   * 2B. INTERACTIVE MCQ PRACTICE ZONE (LESSON & VOCAB QUESTIONS)
   * ======================================================================== */
  function renderMCQQuestion() {
    if (!dom.mcqActiveCard || !engine.mcqQuestions) return;

    const list = engine.mcqQuestions.filter(q => state.mcqFilter === 'all' || q.category === state.mcqFilter);

    if (list.length === 0) {
      dom.mcqQuestionPrompt.textContent = 'No questions found in this category.';
      dom.mcqOptionsGrid.innerHTML = '';
      return;
    }

    if (state.mcqIndex >= list.length) {
      // Quiz complete screen
      dom.mcqQuestionPrompt.innerHTML = `🎉 Badhai ho! Aapne is category ke sabhi sawal pure kar liye!`;
      dom.mcqQuestionHindi.textContent = `Aapka Final Score: ${state.mcqScore} / ${list.length} | Highest Streak: 🔥 ${state.mcqStreak}`;
      dom.mcqOptionsGrid.innerHTML = `
        <button class="mcq-next-btn" id="mcq-restart-btn" style="grid-column: 1 / -1; padding: 14px; font-size: 0.95rem;">
          🔄 Restart Quiz (दोबारा अभ्यास करें)
        </button>
      `;
      dom.mcqFeedbackDrawer?.classList.add('hidden');
      document.getElementById('mcq-restart-btn')?.addEventListener('click', () => {
        state.mcqIndex = 0;
        state.mcqScore = 0;
        state.mcqStreak = 0;
        state.mcqAnswered = false;
        renderMCQQuestion();
      });
      return;
    }

    const currentQ = list[state.mcqIndex];
    state.mcqAnswered = false;

    // Update stats bar
    if (dom.mcqCurrentNum) dom.mcqCurrentNum.textContent = state.mcqIndex + 1;
    if (dom.mcqTotalNum) dom.mcqTotalNum.textContent = list.length;
    if (dom.mcqCatBadge) dom.mcqCatBadge.textContent = currentQ.categoryBadge;
    if (dom.mcqScoreDisplay) dom.mcqScoreDisplay.textContent = `${state.mcqScore} / ${list.length}`;
    if (dom.mcqStreakDisplay) dom.mcqStreakDisplay.textContent = `🔥 Streak: ${state.mcqStreak}`;

    // Update prompt & hindi hint
    if (dom.mcqQuestionPrompt) dom.mcqQuestionPrompt.textContent = currentQ.question;
    if (dom.mcqQuestionHindi) dom.mcqQuestionHindi.textContent = `🇮🇳 संदर्भ: ${currentQ.questionHindi}`;

    // Reset feedback
    dom.mcqFeedbackDrawer?.classList.add('hidden');

    // Render options
    dom.mcqOptionsGrid.innerHTML = '';
    const optionLetters = ['A', 'B', 'C', 'D'];

    currentQ.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'mcq-opt-btn';
      btn.innerHTML = `
        <span class="mcq-opt-letter">${optionLetters[idx]}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        if (state.mcqAnswered) return;
        state.mcqAnswered = true;

        const isCorrect = idx === currentQ.correct;
        const allBtns = dom.mcqOptionsGrid.querySelectorAll('.mcq-opt-btn');
        allBtns.forEach(b => b.classList.add('disabled'));

        if (isCorrect) {
          btn.classList.add('correct');
          state.mcqScore++;
          state.mcqStreak++;
          speech.playChime('success');
          if (dom.mcqFeedbackStatus) {
            dom.mcqFeedbackStatus.textContent = '🎉 बिल्कुल सही उत्तर! (Correct Answer!)';
            dom.mcqFeedbackStatus.className = 'mcq-feedback-status correct';
          }
        } else {
          btn.classList.add('wrong');
          if (allBtns[currentQ.correct]) {
            allBtns[currentQ.correct].classList.add('correct');
          }
          state.mcqStreak = 0;
          speech.playChime('gentle');
          if (dom.mcqFeedbackStatus) {
            dom.mcqFeedbackStatus.textContent = '❌ थोड़ा ध्यान दें! (Incorrect)';
            dom.mcqFeedbackStatus.className = 'mcq-feedback-status wrong';
          }
        }

        // Update score display
        if (dom.mcqScoreDisplay) dom.mcqScoreDisplay.textContent = `${state.mcqScore} / ${list.length}`;
        if (dom.mcqStreakDisplay) dom.mcqStreakDisplay.textContent = `🔥 Streak: ${state.mcqStreak}`;

        // Populate explanation & tip
        if (dom.mcqFeedbackExplanation) dom.mcqFeedbackExplanation.textContent = currentQ.explanation;
        if (dom.mcqTipText) dom.mcqTipText.textContent = currentQ.interviewTip;
        dom.mcqFeedbackDrawer?.classList.remove('hidden');

        // Setup audio listen button
        if (dom.mcqListenCorrectBtn) {
          dom.mcqListenCorrectBtn.onclick = () => {
            speech.speak(currentQ.sentenceAudio);
          };
        }
      });

      dom.mcqOptionsGrid.appendChild(btn);
    });
  }

  // Next Question Button
  if (dom.mcqNextBtn) {
    dom.mcqNextBtn.addEventListener('click', () => {
      state.mcqIndex++;
      renderMCQQuestion();
    });
  }

  // MCQ Category Filter Buttons
  document.querySelectorAll('.mcq-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mcq-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mcqFilter = btn.dataset.mcqFilter || 'all';
      state.mcqIndex = 0;
      state.mcqScore = 0;
      state.mcqStreak = 0;
      renderMCQQuestion();
    });
  });

  /* ========================================================================
   * 2C. 7-DAY REAL-LIFE CURRICULUM RENDERING
   * ======================================================================== */
  function renderCurriculumList() {
    if (!dom.curriculumLessonsList) return;
    dom.curriculumLessonsList.innerHTML = '';

    engine.lessonsCurriculum.forEach(lesson => {
      const isDone = engine.memory.isLessonDone(lesson.day);
      const card = document.createElement('div');
      card.className = `curriculum-lesson-card ${isDone ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="clc-header">
          <span class="clc-day-pill">Day ${lesson.day}</span>
          <span class="clc-level-tag">${lesson.level} · ${lesson.duration}</span>
        </div>
        <div class="clc-title">${lesson.title}</div>
        <div class="clc-tip-preview">💡 ${lesson.realLifeTips[0].title}</div>
        <div class="clc-meta-row">
          <span class="clc-vocabs-badge">📖 ${lesson.vocabularies.length} Vocabularies</span>
          <span class="clc-action-link">${isDone ? '✅ Mastered (दोबारा अभ्यास)' : 'Practice with Aria ➔'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        openLessonModal(lesson);
      });

      dom.curriculumLessonsList.appendChild(card);
    });
  }

  // Option 1 CTA: Open Day 1 Lesson
  if (dom.startRoadmapBtn) {
    dom.startRoadmapBtn.addEventListener('click', () => {
      const day1Lesson = engine.lessonsCurriculum[0];
      openLessonModal(day1Lesson);
    });
  }

  /* ========================================================================
   * 2D. AI VOICE ROOM GATEWAY & MEMORY SNAPSHOT (TAB 2)
   * ======================================================================== */
  function renderAiTabMemorySnapshot() {
    if (!dom.aiTabMemoryGrid) return;
    dom.aiTabMemoryGrid.innerHTML = '';

    const summary = engine.memory.getSummary();
    const pills = [
      `👤 Name: ${summary.profile.name || 'Learner'}`,
      `🐣 Current Level: ${summary.profile.level || 'tooti-footi'}`,
      `💼 Main Target: ${summary.profile.goal || 'job-interview'}`,
      `🎓 Background: ${summary.profile.profession || 'student'}`,
      `💬 Total Turns: ${summary.turnsCount} turns`
    ];

    if (summary.slips && summary.slips.length > 0) {
      pills.push(`⚠️ Focus Area: ${summary.slips[summary.slips.length - 1]}`);
    }

    if (summary.notes && summary.notes.length > 0) {
      pills.push(`📝 Memory Note: ${summary.notes[0]}`);
    }

    pills.forEach(text => {
      const pill = document.createElement('span');
      pill.className = 'amsc-pill';
      pill.textContent = text;
      dom.aiTabMemoryGrid.appendChild(pill);
    });
  }

  if (dom.openMemoryFromAiTab) {
    dom.openMemoryFromAiTab.addEventListener('click', () => {
      dom.openMemoryModalBtn.click();
    });
  }

  // AI Mode Selector Radio Buttons
  document.querySelectorAll('.ai-mode-option input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.ai-mode-option').forEach(o => o.classList.remove('active'));
      radio.closest('.ai-mode-option')?.classList.add('active');
      state.mode = radio.value;
    });
  });

  // Enter Voice Room with Aria CTA
  if (dom.enterTalkRoomBtn) {
    dom.enterTalkRoomBtn.addEventListener('click', () => {
      const selectedRadio = document.querySelector('input[name="dash-ai-mode"]:checked');
      state.mode = selectedRadio ? selectedRadio.value : 'casual';
      state.activeLessonDay = null;
      showScreen('talk');
    });
  }

  /* ========================================================================
   * 3. LESSON VIEWER MODAL
   * ======================================================================== */
  function openLessonModal(lesson) {
    state.currentSelectedLesson = lesson;

    dom.lmDayBadge.textContent = `Day ${lesson.day}`;
    dom.lmLevelTag.textContent = lesson.level;
    dom.lmTitle.textContent = lesson.title;
    dom.lmSummary.textContent = lesson.summary;

    // Render Real-Life Tips
    dom.lmTipsList.innerHTML = '';
    lesson.realLifeTips.forEach(tip => {
      const tipCard = document.createElement('div');
      tipCard.className = 'lm-tip-card';
      tipCard.innerHTML = `
        <div class="lm-tip-header">🌟 ${tip.title}</div>
        <div class="lm-tip-desc">${tip.desc}</div>
      `;
      dom.lmTipsList.appendChild(tipCard);
    });

    // Render 5 Vocabularies with audio pronunciation
    dom.lmVocabsGrid.innerHTML = '';
    lesson.vocabularies.forEach(v => {
      const vCard = document.createElement('div');
      vCard.className = 'lm-vocab-card';
      vCard.innerHTML = `
        <div class="lm-vc-top">
          <span class="lm-vc-word">${v.word} (${v.type})</span>
          <button class="lm-vc-audio-btn">🔊 Hear</button>
        </div>
        <div class="lm-vc-hindi">🗣️ ${v.phonetic} · 🇮🇳 ${v.hindi}</div>
        <div class="lm-vc-def">${v.def}</div>
        <div class="lm-vc-ex">"${v.ex}"</div>
      `;
      vCard.querySelector('.lm-vc-audio-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        speech.speak(v.word);
      });
      dom.lmVocabsGrid.appendChild(vCard);
    });

    // Render Mistake Box
    dom.lmWrongPhrase.textContent = `"${lesson.commonMistake.wrong}"`;
    dom.lmCorrectPhrase.textContent = `"${lesson.commonMistake.correct}"`;
    dom.lmMistakeHindi.textContent = lesson.commonMistake.hindi;

    // Render Practice Goal
    dom.lmPracticeGoal.textContent = lesson.practiceChallenge.goal;

    dom.lessonViewerModal.classList.remove('hidden');
  }

  dom.closeLessonModal.addEventListener('click', () => {
    dom.lessonViewerModal.classList.add('hidden');
  });

  // Launch Interactive Practice with Aria
  dom.startLessonPracticeBtn.addEventListener('click', () => {
    dom.lessonViewerModal.classList.add('hidden');
    if (state.currentSelectedLesson) {
      state.activeLessonDay = state.currentSelectedLesson.day;
      state.mode = 'lesson';
      showScreen('talk');
    }
  });

  /* ========================================================================
   * 4. ARIA'S MEMORY MODAL
   * ======================================================================== */
  dom.openMemoryModalBtn.addEventListener('click', () => {
    const memory = engine.memory.getSummary();

    dom.memUserName.textContent = memory.profile.name || 'Learner';
    dom.memLevelTag.textContent = `Level: ${memory.profile.level}`;
    dom.memGoalTag.textContent = `Goal: ${memory.profile.goal}`;
    dom.memProfTag.textContent = `Background: ${memory.profile.profession}`;

    // Memory notes
    dom.memNotesList.innerHTML = '';
    memory.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      dom.memNotesList.appendChild(li);
    });

    // Grammar slips being watched
    dom.memSlipsList.innerHTML = '';
    if (memory.slips.length === 0) {
      dom.memSlipsList.innerHTML = '<div style="font-size:0.78rem; color:var(--text-dim);">No recurring mistakes detected yet. Great job!</div>';
    } else {
      memory.slips.forEach(slip => {
        const item = document.createElement('div');
        item.className = 'mem-slip-item';
        item.textContent = `🎯 ${slip}`;
        dom.memSlipsList.appendChild(item);
      });
    }

    // Completed Lessons Progress
    dom.memLessonsProgress.innerHTML = '';
    for (let day = 1; day <= 7; day++) {
      const isDone = engine.memory.isLessonDone(day);
      const badge = document.createElement('span');
      badge.className = `mlp-badge ${isDone ? 'done' : ''}`;
      badge.textContent = `Day ${day} ${isDone ? '✅' : '⏳'}`;
      dom.memLessonsProgress.appendChild(badge);
    }

    dom.ariaMemoryModal.classList.remove('hidden');
  });

  dom.closeMemoryModal.addEventListener('click', () => {
    dom.ariaMemoryModal.classList.add('hidden');
  });

  /* ========================================================================
   * 5. TALK WITH RIVA ROOM (PW TALK REAL-LIFE EXPERIENCE)
   * ======================================================================== */
  function highlightCorrection(original, corrected) {
    if (!corrected) return escapeHtml(original);
    const origWords = original.trim().split(/\s+/);
    const corrWords = corrected.trim().replace(/[.?!]$/, '').split(/\s+/);

    const formatted = corrWords.map(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      const inOrig = origWords.some(ow => ow.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
      if (!inOrig) {
        return `<span class="corr-green">${escapeHtml(w)}</span>`;
      }
      return escapeHtml(w);
    }).join(' ');

    const lastChar = corrected.slice(-1);
    return formatted + (/[.?!]/.test(lastChar) ? lastChar : '.');
  }

  function startTalkRoomSession() {
    dom.roomChatStream.innerHTML = '';
    dom.roomMistakeDrawer?.classList.add('hidden');
    dom.roomHintDrawer?.classList.add('hidden');

    let starterText = "";
    let starterHindi = "";
    let starterEmotion = "🌸 Warm & Welcoming";

    // CASE A: Active Lesson Practice Session
    if (state.activeLessonDay) {
      const lesson = engine.lessonsCurriculum.find(l => l.day === parseInt(state.activeLessonDay, 10));
      if (lesson && lesson.practiceChallenge) {
        starterText = lesson.practiceChallenge.starterText;
        starterHindi = lesson.practiceChallenge.starterHindi;
        starterEmotion = "💡 Lesson Coach";
      }
    } else {
      // CASE B: Dynamic Free Conversational Session tailored to saved profile
      const dynamicStarter = engine.getDynamicStarter(state.userName, state.userLevel, state.userGoal, state.userCity, state.userProfession);
      starterText = dynamicStarter.text;
      starterHindi = dynamicStarter.hindi;
      starterEmotion = dynamicStarter.emotion || "🌸 Warm & Welcoming";
    }

    if (dom.rivaRoomMood) {
      dom.rivaRoomMood.textContent = starterEmotion;
    }

    appendRoomAIMessage(starterText, starterHindi, starterEmotion);
    speech.speak(starterText);

    // Update Initial Hint
    updateRoomHints(starterText, state.activeLessonDay);
  }

  dom.backToDashboardBtn.addEventListener('click', () => {
    speech.stopSpeaking();
    speech.stopListening();
    showScreen('dashboard');
  });

  // Level Selector (Beginner Level 2 ∨)
  if (dom.roomLevelSelect) {
    dom.roomLevelSelect.addEventListener('change', (e) => {
      state.userLevel = e.target.value;
      engine.memory.updateProfile({ level: e.target.value });
      speech.setLevel(e.target.value);
    });
  }

  // Speech Speed Select (0.98x default)
  dom.ariaSpeedSelect.addEventListener('change', (e) => {
    speech.setRate(e.target.value);
  });

  // Append AI message bubble in room (PW Talk Riva style with 文A and 🔊)
  function appendRoomAIMessage(text, hindiText = "", emotion = "🌸 Warm & Friendly") {
    const card = document.createElement('div');
    card.className = 'message-card ai-message';
    card.innerHTML = `
      <div class="message-text">
        <div class="ai-speech-header">
          <span class="riva-mood-pill">${escapeHtml(emotion)}</span>
        </div>
        <div class="ai-utterance-body">${escapeHtml(text)}</div>
        <div class="bubble-actions-row">
          ${hindiText ? `<button class="bubble-action-btn btn-trans" title="Hindi Translation">文A</button>` : ''}
          <button class="bubble-action-btn btn-audio" title="Listen to Riva">🔊</button>
        </div>
        ${hindiText ? `<div class="bubble-hindi-translation hidden">🇮🇳 हिंदी: "${escapeHtml(hindiText)}"</div>` : ''}
      </div>
    `;

    const transBtn = card.querySelector('.btn-trans');
    const transRow = card.querySelector('.bubble-hindi-translation');
    if (transBtn && transRow) {
      transBtn.addEventListener('click', () => {
        transRow.classList.toggle('hidden');
      });
    }

    const audioBtn = card.querySelector('.btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => speech.speak(text));
    }

    dom.roomChatStream.appendChild(card);
    dom.roomChatStream.scrollTop = dom.roomChatStream.scrollHeight;
  }

  // Append User message bubble in room (PW Talk style with 🔊 and 1 CORRECTION ⌃)
  function appendRoomUserMessage(text, analysis = null) {
    const card = document.createElement('div');
    card.className = 'message-card user-message';

    let correctionHtml = '';
    if (analysis && analysis.hasError) {
      const highlighted = highlightCorrection(text, analysis.corrected);
      correctionHtml = `
        <div class="bubble-correction-box">
          <div class="correction-header">
            <span>1 CORRECTION</span>
            <span class="correction-chevron">⌃</span>
          </div>
          <div class="correction-sentence">${highlighted}</div>
          <div class="bubble-actions-row">
            <button class="bubble-action-btn btn-corr-trans" title="Hindi Explanation">文A</button>
            <button class="bubble-action-btn btn-corr-audio" title="Listen Correct Pronunciation">🔊</button>
          </div>
          <div class="correction-hindi-exp hidden">
            🇮🇳 ${escapeHtml(analysis.hindiExplanation)}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="message-text">
        <div>${escapeHtml(text)}</div>
        <div class="bubble-actions-row">
          <button class="bubble-action-btn btn-user-audio" title="Listen">🔊</button>
        </div>
        ${correctionHtml}
      </div>
    `;

    card.querySelector('.btn-user-audio')?.addEventListener('click', () => speech.speak(text));

    const corrTransBtn = card.querySelector('.btn-corr-trans');
    const corrExpRow = card.querySelector('.correction-hindi-exp');
    if (corrTransBtn && corrExpRow) {
      corrTransBtn.addEventListener('click', () => {
        corrExpRow.classList.toggle('hidden');
      });
    }

    const corrAudioBtn = card.querySelector('.btn-corr-audio');
    if (corrAudioBtn && analysis) {
      corrAudioBtn.addEventListener('click', () => speech.speak(analysis.corrected));
    }

    dom.roomChatStream.appendChild(card);
    dom.roomChatStream.scrollTop = dom.roomChatStream.scrollHeight;
  }

  // Handle User's Turn
  async function handleUserTurn(rawText) {
    const text = rawText.trim();
    if (!text || state.isProcessing) return;

    state.isProcessing = true;
    dom.roomTextInput.value = '';
    dom.ariaSpeakingStatus.textContent = 'Riva is listening and preparing reply...';

    try {
      const result = await engine.processUserTurn({
        text,
        mode: state.mode,
        scenarioId: 'daily-life',
        partner: 'aria',
        level: state.userLevel,
        lessonDay: state.activeLessonDay
      });

      // Append user bubble with correction card attached
      appendRoomUserMessage(text, result.analysis);

      // Render Riva's expressive reply
      const aiEmotion = result.emotion || "🌸 Warm & Friendly";
      if (dom.rivaRoomMood) {
        dom.rivaRoomMood.textContent = aiEmotion;
      }
      appendRoomAIMessage(result.aiResponse, result.aiHindi, aiEmotion);
      speech.speak(result.aiResponse);

      // Update Mistake Drawer if mistakes were found
      if (result.analysis.hasError) {
        state.mistakesCount += 1;
        dom.toolMistakesBadge.textContent = state.mistakesCount;
        updateMistakeDrawer(result.analysis);
      }

      // Re-render dashboard curriculum progress if a lesson was completed
      if (state.activeLessonDay) {
        renderCurriculumList();
      }

      // Update Show Hint
      updateRoomHints(result.aiResponse, state.activeLessonDay);

    } catch (err) {
      console.error(err);
      appendRoomAIMessage("I heard you clearly! Let's keep practicing. Tell me what else is on your mind!");
    } finally {
      state.isProcessing = false;
    }
  }

  // Update Show Hint Content
  function updateRoomHints(aiMessage, lessonDay = null) {
    const guide = engine.generateHowToSpeakGuide(aiMessage, state.mode, lessonDay);

    if (dom.rhAriaAskingText) {
      dom.rhAriaAskingText.textContent = guide.whatAriaIsAsking || "आरिया के सवाल का सीधा जवाब नीचे दिया गया है:";
    }
    if (dom.rhTargetSentence) {
      dom.rhTargetSentence.textContent = `"${guide.targetText}"`;
    }
    if (dom.rhPhoneticGuide) {
      dom.rhPhoneticGuide.innerHTML = `🗣️ Pronounce as: <em>"${guide.phonetic}"</em>`;
    }
    if (dom.rhHindiMeaning) {
      dom.rhHindiMeaning.textContent = `🇮🇳 ${guide.hindi}`;
    }

    if (dom.rhListenBtn) {
      dom.rhListenBtn.onclick = () => speech.speak(guide.targetText);
    }
    if (dom.rhSpeakNowBtn) {
      dom.rhSpeakNowBtn.onclick = () => {
        handleUserTurn(guide.targetText);
        dom.roomHintDrawer?.classList.add('hidden');
      };
    }
  }

  // Update Mistake Drawer
  function updateMistakeDrawer(analysis) {
    dom.rmdWrongText.innerHTML = analysis.diffWrongHtml;
    dom.rmdCorrectText.innerHTML = analysis.diffCorrectHtml;
    dom.rmdHindiExplanation.textContent = analysis.hindiExplanation;
    dom.rmdNativeText.textContent = `"${analysis.nativeAlternative}"`;

    dom.rmdListenNativeBtn.onclick = () => {
      speech.speak(analysis.nativeAlternative);
    };
  }

  // Show Hint Toggle
  dom.toggleHintBtn.addEventListener('click', () => {
    dom.roomHintDrawer.classList.toggle('hidden');
  });
  dom.closeRhBtn.addEventListener('click', () => {
    dom.roomHintDrawer.classList.add('hidden');
  });

  // Tap to Speak (Golden Mic)
  dom.roomMicBtn.addEventListener('click', () => {
    speech.toggleListening();
  });

  // Text Fallback Submit
  dom.roomTextForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = dom.roomTextInput.value;
    if (val.trim()) handleUserTurn(val);
  });

  // Toggle Mistake Drawer
  dom.toggleAnalysisPanelBtn.addEventListener('click', () => {
    dom.roomMistakeDrawer.classList.toggle('hidden');
  });
  dom.closeRmdBtn.addEventListener('click', () => {
    dom.roomMistakeDrawer.classList.add('hidden');
  });

  /* ========================================================================
   * 5B. HELP ME SPEAK (HINDI TO ENGLISH TRANSLATION MODAL)
   * ======================================================================== */
  if (dom.helpMeSpeakBtn) {
    dom.helpMeSpeakBtn.addEventListener('click', () => {
      // Aria speaks encouragement: "Koi baat nahi! Hindi me bolo, main use English me translate kar dungi."
      speech.speak("Koi baat nahi! Hindi me bolo, main use English me translate kar dungi.");
      dom.helpMeSpeakModal.classList.remove('hidden');
      dom.hmsHindiInput.value = '';
      dom.hmsHindiInput.focus();
    });
  }

  if (dom.closeHmsModal) {
    dom.closeHmsModal.addEventListener('click', () => {
      speech.stopHindiListening();
      dom.helpMeSpeakModal.classList.add('hidden');
      if (dom.hmsHindiInput) dom.hmsHindiInput.value = '';
    });
  }

  let isHindiMicActive = false;
  if (dom.hmsHindiMicBtn) {
    dom.hmsHindiMicBtn.addEventListener('click', () => {
      if (isHindiMicActive) {
        speech.stopHindiListening();
        isHindiMicActive = false;
        dom.hmsHindiMicBtn.classList.remove('recording');
        dom.hmsMicLabel.textContent = 'Tap to speak in Hindi (हिंदी में बोलें)';
      } else {
        isHindiMicActive = true;
        dom.hmsHindiMicBtn.classList.add('recording');
        dom.hmsMicLabel.textContent = 'Listening to Hindi... बोलिए';
        speech.startHindiListening({
          onInterim: (text) => {
            dom.hmsHindiInput.value = text;
          },
          onFinal: (text) => {
            isHindiMicActive = false;
            dom.hmsHindiMicBtn.classList.remove('recording');
            dom.hmsMicLabel.textContent = 'Tap to speak in Hindi (हिंदी में बोलें)';
            dom.hmsHindiInput.value = text;
            executeHindiTranslation(text);
          },
          onError: () => {
            isHindiMicActive = false;
            dom.hmsHindiMicBtn.classList.remove('recording');
            dom.hmsMicLabel.textContent = 'Tap to speak in Hindi (हिंदी में बोलें)';
          },
          onEnd: () => {
            isHindiMicActive = false;
            dom.hmsHindiMicBtn.classList.remove('recording');
            dom.hmsMicLabel.textContent = 'Tap to speak in Hindi (हिंदी में बोलें)';
          }
        });
      }
    });
  }

  function executeHindiTranslation(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    const trans = engine.translateHindiToEnglish(trimmed);
    dom.hmsResEnglish.textContent = `"${trans.english}"`;
    dom.hmsResPhonetic.innerHTML = `🗣️ उच्चारण: <em>"${trans.phonetic}"</em>`;
    dom.hmsResHindi.innerHTML = `🇮🇳 आपका वाक्य: <span>${escapeHtml(trimmed)}</span>`;

    if (dom.hmsActHearBtn) {
      dom.hmsActHearBtn.onclick = () => {
        speech.speak(trans.english);
      };
    }

    if (dom.hmsActSendBtn) {
      dom.hmsActSendBtn.onclick = () => {
        speech.stopHindiListening();
        dom.helpMeSpeakModal.classList.add('hidden');
        if (dom.hmsHindiInput) dom.hmsHindiInput.value = '';
        if (dom.roomTextInput) dom.roomTextInput.value = '';
        handleUserTurn(trans.english);
      };
    }
  }

  if (dom.hmsTranslateBtn) {
    dom.hmsTranslateBtn.addEventListener('click', () => {
      executeHindiTranslation(dom.hmsHindiInput.value);
    });
  }

  if (dom.hmsHindiInput) {
    dom.hmsHindiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeHindiTranslation(dom.hmsHindiInput.value);
      }
    });
  }

  // Quick Chips
  document.querySelectorAll('.hms-sug-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const phrase = chip.getAttribute('data-phrase');
      if (phrase) {
        dom.hmsHindiInput.value = phrase;
        executeHindiTranslation(phrase);
      }
    });
  });

  /* ========================================================================
   * 6. COMMON MISTAKES LIBRARY MODAL
   * ======================================================================== */
  dom.openMistakesFromDashBtn.addEventListener('click', () => {
    renderMistakesLibrary();
    dom.mistakesLibModal.classList.remove('hidden');
  });
  dom.closeMistakesModal.addEventListener('click', () => {
    dom.mistakesLibModal.classList.add('hidden');
  });

  function renderMistakesLibrary() {
    dom.mistakesRulesGrid.innerHTML = '';
    engine.grammarRules.slice(0, 15).forEach(rule => {
      const item = document.createElement('div');
      item.className = 'mistake-rule-item';
      item.innerHTML = `
        <div class="mri-tag">${rule.tag}</div>
        <div class="mri-wrong">❌ ${rule.rule.split('.')[0]}</div>
        <div class="mri-correct">✅ Standard Rule Fix</div>
        <div class="mri-hindi">🇮🇳 ${rule.hindi}</div>
      `;
      dom.mistakesRulesGrid.appendChild(item);
    });
  }

  // Close modals on overlay backdrop click
  [dom.lessonViewerModal, dom.ariaMemoryModal, dom.mistakesLibModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });

  // Helper
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
  }

  // Audio Canvas Visualizer
  function startVisualizerAnimation() {
    const canvas = dom.roomVisualizerCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        let height = 4;
        if (dom.roomMicBtn.classList.contains('recording')) {
          height = 10 + Math.abs(Math.sin(t + i * 0.4)) * 26;
        } else if (dom.hologramPulseRipple.classList.contains('speaking')) {
          height = 8 + Math.abs(Math.cos(t * 1.5 + i * 0.5)) * 24;
        } else {
          height = 4 + Math.abs(Math.sin(t * 0.5 + i * 0.2)) * 6;
        }

        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(1, '#6366f1');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  startVisualizerAnimation();

  // Initial State Check (User Requirement: Registration Portal First)
  initPortalState();
  showScreen('portal');
});
