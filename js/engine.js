/**
 * TalkRiva AI - Conversation & Fluency Engine (PW Talk + Aria Intelligent Mind Edition)
 * Includes:
 * 1. Persistent User Memory & Mind System (Profile, Goals, Extracted Facts, Grammar Slips)
 * 2. 7-Day Comprehensive Curriculum (Beginner to Advanced with Real-Life Tips, Vocabs & Practice)
 * 3. Deep Mistake Detector with 30+ Grammar & Indianism Rules
 * 4. Contextual, Memory-Aware Conversational Intelligence with Polite Spoken Corrections
 * 5. Visual Diff Formatter (Wrong vs Correct highlights)
 * 6. Bilingual Hindi Explanations for all mistakes
 * 7. Filler Word Counter ("um", "uh", "like", "actually")
 * 8. Hindi-to-English Instant Helper & Shadowing Scorer
 */

// ============================================================================
// 1. USER MEMORY & MIND SYSTEM
// ============================================================================
class UserMemoryMind {
  constructor() {
    this.storageKey = 'talkriva_user_memory_v2';
    this.data = this.loadMemory();
  }

  loadMemory() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load memory from localStorage:", e);
    }
    const hasStorage = typeof localStorage !== 'undefined';
    return {
      profile: {
        name: hasStorage ? (localStorage.getItem('talkriva_user_name') || '') : '',
        level: hasStorage ? (localStorage.getItem('talkriva_user_level') || 'tooti-footi') : 'tooti-footi',
        goal: hasStorage ? (localStorage.getItem('talkriva_user_goal') || 'job-interview') : 'job-interview',
        profession: hasStorage ? (localStorage.getItem('talkriva_user_profession') || 'student') : 'student'
      },
      memoryNotes: [
        "Aria understands learner wants to build confident spoken English step-by-step.",
        "Targeting clear female voice pronunciation and conversational confidence."
      ],
      userFacts: {},
      grammarSlipHistory: [],
      masteredVocabs: [],
      completedLessons: [],
      turnsCount: 0,
      confidenceScore: 70
    };
  }

  saveMemory() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      }
    } catch (e) {
      console.warn("Could not save memory to localStorage:", e);
    }
  }

  updateProfile(profile) {
    this.data.profile = { ...this.data.profile, ...profile };
    if (typeof localStorage !== 'undefined') {
      if (profile.name) localStorage.setItem('talkriva_user_name', profile.name);
      if (profile.level) localStorage.setItem('talkriva_user_level', profile.level);
      if (profile.goal) localStorage.setItem('talkriva_user_goal', profile.goal);
      if (profile.profession) localStorage.setItem('talkriva_user_profession', profile.profession);
    }
    if (profile.name) {
      this.data.userFacts['name'] = profile.name;
    }
    if (profile.goal) {
      this.addNote(`Primary training focus: ${profile.goal}.`);
    }
    this.saveMemory();
  }

  recordTurn(userText, aiReply, analysis, lessonDay = null) {
    this.data.turnsCount++;
    this.extractFacts(userText);

    if (analysis && analysis.hasError) {
      if (analysis.grammarExplanation && !this.data.grammarSlipHistory.includes(analysis.grammarExplanation)) {
        this.data.grammarSlipHistory.push(analysis.grammarExplanation);
        if (this.data.grammarSlipHistory.length > 10) this.data.grammarSlipHistory.shift();
      }
    }

    if (lessonDay) {
      const dayNum = parseInt(lessonDay, 10);
      if (!this.data.completedLessons.includes(dayNum)) {
        this.data.completedLessons.push(dayNum);
        this.addNote(`Completed Day ${dayNum} practice lesson with Aria.`);
      }
    }

    this.saveMemory();
  }

  extractFacts(text) {
    const lower = text.toLowerCase();

    if (lower.includes('cricket')) this.addNote('Learner has an interest in cricket.');
    if (lower.includes('music')) this.addNote('Learner enjoys listening to music.');
    if (lower.includes('reading') || lower.includes('book')) this.addNote('Learner likes reading books.');
    if (lower.includes('software') || lower.includes('coder') || lower.includes('developer') || lower.includes('engineer')) {
      this.addNote('Learner is in or aiming for tech/software engineering.');
    }
    if (lower.includes('college') || lower.includes('university') || lower.includes('study')) {
      this.addNote('Learner is currently pursuing academic studies.');
    }
    if (lower.includes('interview') || lower.includes('placement')) {
      this.addNote('Learner is actively preparing for upcoming interviews.');
    }
  }

  addNote(note) {
    if (!this.data.memoryNotes.includes(note)) {
      this.data.memoryNotes.push(note);
      if (this.data.memoryNotes.length > 8) this.data.memoryNotes.shift();
      this.saveMemory();
    }
  }

  isLessonDone(day) {
    return this.data.completedLessons.includes(parseInt(day, 10));
  }

  getSummary() {
    return {
      profile: this.data.profile,
      notes: this.data.memoryNotes,
      userFacts: this.data.userFacts,
      slips: this.data.grammarSlipHistory,
      completedLessons: this.data.completedLessons,
      turnsCount: this.data.turnsCount
    };
  }
}

// ============================================================================
// 2. CONVERSATION ENGINE (WITH COMPLETE 7-DAY CURRICULUM & RULES)
// ============================================================================
class ConversationEngine {
  constructor() {
    this.apiKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('talkriva_gemini_key') || '') : '';
    this.engineType = typeof localStorage !== 'undefined' ? (localStorage.getItem('talkriva_engine_type') || 'builtin') : 'builtin';
    this.memory = new UserMemoryMind();
    this.turnHistory = [];

    // ------------------------------------------------------------------------
    // 7-DAY COMPREHENSIVE CURRICULUM (BEGINNER TO ADVANCED)
    // ------------------------------------------------------------------------
    this.lessonsCurriculum = [
      {
        day: 1,
        id: 'first-impressions',
        title: 'The 7-Second Rule: First Impressions & Magnetic Greetings',
        titleHindi: 'पहला प्रभाव और सही अभिवादन (First Impression & Greetings)',
        level: 'Beginner 🐣',
        duration: '10 Mins',
        summary: 'Master the psychological 7-second first impression window with authentic greetings, confident body posture, eye contact, and pitch inflection.',
        realLifeTips: [
          {
            title: 'The 7-Second Psychology Rule (पहला 7-सेकंड नियम)',
            desc: 'In real life, people form 80% of their judgment about your confidence in the first 7 seconds before you finish your sentence. Always greet with an open chest, relaxed shoulders, and a gentle downward tone (not an uncertain rising squeak).'
          },
          {
            title: 'Formal vs Informal Greetings (फॉर्मल बनाम अनौपचारिक अभिवादन)',
            desc: 'Formal (Offices/Interviews): "Good morning/afternoon Mr. Sharma", "A pleasure to meet you". Informal (Friends/Social): "Hey, great to see you!", "How’s everything going?" Never mix them up.'
          },
          {
            title: 'The Confident Handshake / Namaste Introduction',
            desc: 'Lock eyes for 2 full seconds, smile warmly, and say your name crisply. Speak slowly: rushing makes you look anxious.'
          }
        ],
        vocabularies: [
          { word: 'Pleasure', type: 'noun', phonetic: 'PLEZH-er', hindi: 'खुशी / आनंद', def: 'A feeling of happy satisfaction or enjoyment.', ex: 'It is a genuine pleasure to meet you today.' },
          { word: 'Acquaintance', type: 'noun', phonetic: 'uh-KWAYN-tns', hindi: 'जान-पहचान वाला व्यक्ति', def: 'A person one knows slightly, but who is not a close friend.', ex: 'Pleased to make your acquaintance, Mr. Verma.' },
          { word: 'Enthusiastic', type: 'adj', phonetic: 'en-thoo-zee-AS-tik', hindi: 'उत्साही / ऊर्जावान', def: 'Having or showing intense and eager interest.', ex: 'I am enthusiastic about joining this project.' },
          { word: 'Delighted', type: 'adj', phonetic: 'dih-LY-tid', hindi: 'अत्यंत प्रसन्न', def: 'Feeling or showing great pleasure.', ex: 'I am delighted to connect with you this morning.' },
          { word: 'Cordial', type: 'adj', phonetic: 'KOR-jul', hindi: 'हार्दिक / दोस्ताना', def: 'Warm and friendly in demeanor.', ex: 'They extended a very cordial welcome to us.' },
          { word: 'Genuine', type: 'adj', phonetic: 'JEN-yoo-in', hindi: 'सच्चा / वास्तविक', def: 'Truly what something is said to be; authentic and sincere.', ex: 'He greeted everyone with a genuine smile.' },
          { word: 'Poised', type: 'adj', phonetic: 'POYZD', hindi: 'शांत और आत्मविश्वासी', def: 'Having a composed and self-assured manner.', ex: 'She stayed poised and articulate during the interview.' },
          { word: 'Greeting', type: 'noun', phonetic: 'GREE-ting', hindi: 'अभिवादन / नमस्कार', def: 'A polite word or sign of welcome or recognition.', ex: 'A warm greeting creates an immediate positive bond.' },
          { word: 'Magnetic', type: 'adj', phonetic: 'mag-NET-ik', hindi: 'आकर्षक व्यक्तित्व', def: 'Very attractive or compelling in personality.', ex: 'His magnetic presence impressed the entire room.' },
          { word: 'Impactful', type: 'adj', phonetic: 'im-PAKT-ful', hindi: 'प्रभावशाली', def: 'Having a major effect or creating a lasting impression.', ex: 'An impactful introduction sets the tone for success.' }
        ],
        commonMistake: {
          wrong: 'Myself Rahul, working in sales.',
          correct: 'I am Rahul / My name is Rahul, and I work in sales.',
          hindi: "'Myself' reflex pronoun है, इससे कभी वाक्य शुरू न करें। हमेशा 'I am' या 'My name is' बोलें।"
        },
        practiceChallenge: {
          goal: 'Introduce yourself with your name, where you are from, and your mood today without using "Myself".',
          starterText: "Namaste! Welcome to Day 1: First Impressions & Greetings. Let's practice introducing yourself like a pro. Tell me your name, where you are from, and how you are feeling today!",
          starterHindi: "नमस्ते! डे 1 में स्वागत है: पहला प्रभाव और अभिवादन। चलिए आत्मविश्वास से अपना परिचय देते हैं। अपना नाम, शहर और आज का मूड बताएं!",
          targetSentence: "Hello Aria, my name is Rahul. I am from Delhi, and I am feeling great today.",
          phoneticGuide: "Huh-LOH AH-ree-uh, my name iz RAH-hool. Eye am fruhm DEL-hee, and eye am FEEL-ing grayt too-day.",
          helpPills: [
            "Hello Aria, my name is Rahul and I'm from Delhi.",
            "It's a pleasure to meet you, Aria!",
            "I am feeling enthusiastic and ready to practice today."
          ]
        }
      },
      {
        day: 2,
        id: 'tooti-footi-to-sentences',
        title: 'From Tooti-Footi to Fluent: Sentence Structure & Thinking in English',
        titleHindi: 'टूटी-फूटी इंग्लिश से पूरे वाक्य और सीधा इंग्लिश में सोचना',
        level: 'Beginner 🐣',
        duration: '12 Mins',
        summary: 'Stop translating Hindi to English word-by-word. Learn the S-V-O (Subject + Verb + Object) sentence anchor formula and daily action connectors.',
        realLifeTips: [
          {
            title: 'Stop Brain Translation (The SVO Anchor)',
            desc: 'In Hindi, the verb comes last ("Main khana kha raha hu"), but in English, the verb comes in the middle (Subject + Verb + Object: "I am eating food"). Keep this order fixed in your mind.'
          },
          {
            title: 'Daily Connectors for Natural Flow',
            desc: 'Instead of stopping after 2 words, attach natural bridge words: "Actually...", "To be honest...", "As a matter of fact...", "Specifically...".'
          },
          {
            title: 'Handling Everyday Indianism Slips',
            desc: 'Don’t say "I take tea" (say "I have tea / drink tea"). Don’t say "open the light" (say "turn on the light"). Small fixes build big respect.'
          }
        ],
        vocabularies: [
          { word: 'Currently', type: 'adv', phonetic: 'KUR-ent-lee', hindi: 'वर्तमान में / आजकल', def: 'At the present time; now.', ex: 'Currently, I am focusing on improving my spoken English.' },
          { word: 'Regularly', type: 'adv', phonetic: 'REG-yuh-ler-lee', hindi: 'नियमित रूप से', def: 'At uniform intervals of time or manner.', ex: 'I practice speaking English regularly with Aria.' },
          { word: 'Prefer', type: 'verb', phonetic: 'pree-FUR', hindi: 'प्राथमिकता देना / पसंद करना', def: 'To like one thing better than another.', ex: 'I prefer drinking green tea in the morning.' },
          { word: 'Occasionally', type: 'adv', phonetic: 'uh-KAY-zhuh-nuh-lee', hindi: 'कभी-कभार', def: 'At infrequent intervals; now and then.', ex: 'I occasionally watch English podcasts to learn new phrases.' },
          { word: 'Routine', type: 'noun', phonetic: 'roo-TEEN', hindi: 'दैनिक दिनचर्या', def: 'A regular sequence of actions.', ex: 'My daily morning routine starts with a brisk walk.' },
          { word: 'Specifically', type: 'adv', phonetic: 'spuh-SIF-ih-klee', hindi: 'विशेष रूप से', def: 'In a definite and exact manner.', ex: 'Specifically, I want to master workplace conversations.' },
          { word: 'Connect', type: 'verb', phonetic: 'kuh-NEKT', hindi: 'जोड़ना / संबंध बनाना', def: 'Bring together or establish rapport with others.', ex: 'Good grammar helps you connect thoughts smoothly.' },
          { word: 'Express', type: 'verb', phonetic: 'ek-SPRES', hindi: 'व्यक्त करना / बयां करना', def: 'Convey a thought or feeling in words or gestures.', ex: 'I can now express my opinions without hesitation.' },
          { word: 'Essential', type: 'adj', phonetic: 'eh-SEN-shul', hindi: 'अनिवार्य / बहुत जरूरी', def: 'Absolutely necessary; extremely important.', ex: 'Daily practice is essential for long-term fluency.' },
          { word: 'Gradually', type: 'adv', phonetic: 'GRAJ-oo-uh-lee', hindi: 'धीरे-धीरे / क्रमिक रूप से', def: 'In a gradual way; step by step.', ex: 'Gradually, my confidence has improved significantly.' }
        ],
        commonMistake: {
          wrong: 'Yesterday I go to market and take tea.',
          correct: 'Yesterday I went to the market and had some tea.',
          hindi: "बीते समय (yesterday) में हमेशा 2nd form 'went' का प्रयोग करें, और चाय पीने के लिए 'have tea' या 'drink tea' बोलें।"
        },
        practiceChallenge: {
          goal: 'Build a complete 2-sentence thought about what you did today or yesterday using S-V-O order.',
          starterText: "Welcome to Day 2! Today we build solid sentences. Tell me: what did you do earlier today, and what do you prefer doing in the evening?",
          starterHindi: "डे 2 में स्वागत है! आज हम पूरे वाक्य बनाएंगे। बताइए: आज दिन में आपने क्या किया और शाम को क्या करना पसंद करते हैं?",
          targetSentence: "Earlier today, I finished my work, and I prefer going for a walk in the evening.",
          phoneticGuide: "UR-lee-ur too-day, eye FIN-isht my wurk, and eye pree-FUR GOH-ing fur uh wok in the EEV-ning.",
          helpPills: [
            "Earlier today, I completed my daily tasks.",
            "I usually prefer having a cup of tea in the evening.",
            "Yesterday, I went outside and met an old friend."
          ]
        }
      },
      {
        day: 3,
        id: 'hesitation-and-silence',
        title: 'Conquering Hesitation & The Art of The Silent Pause',
        titleHindi: 'झिझक दूर करना और साइलेंट पॉज की जादुई कला (Hesitation & Silence)',
        level: 'Elementary 💬',
        duration: '15 Mins',
        summary: 'Eliminate anxious filler words (Um, Uh, Like, Basically). Replace panic with confident silent pauses and master the 7-38-55 communication rule.',
        realLifeTips: [
          {
            title: 'The Silent Pause Technique (Kill "Um" & "Uh")',
            desc: 'When an Indian speaker gets nervous, their brain makes "Ummm, aaaa, actually..." noises. In real life, top CEOs and leaders pause in complete silence for 1 to 2 seconds while thinking. A silent pause sounds wise; filler noises sound insecure.'
          },
          {
            title: 'The 7-38-55 Communication Rule',
            desc: 'Prof. Mehrabian’s famous rule: Words convey only 7% of meaning, Tone of voice conveys 38%, and Body language conveys 55%. Never whisper timidly. Speak with calm, audible volume.'
          },
          {
            title: 'Breathe from the Diaphragm',
            desc: 'Take a deep belly breath before you begin your sentence. It drops your voice pitch by 10%, instantly eliminating vocal shaking.'
          }
        ],
        vocabularies: [
          { word: 'Precisely', type: 'adv', phonetic: 'prih-SYSE-lee', hindi: 'बिल्कुल सही / सटीक', def: 'In an exact and accurate manner.', ex: 'That is precisely what I was trying to explain.' },
          { word: 'Articulate', type: 'verb/adj', phonetic: 'ar-TIK-yuh-layt', hindi: 'स्पष्ट रूप से व्यक्त करना', def: 'Having the ability to speak fluently and coherently.', ex: 'She was able to articulate her thoughts with great confidence.' },
          { word: 'Clarity', type: 'noun', phonetic: 'KLAIR-uh-tee', hindi: 'स्पष्टता / साफ विचार', def: 'The quality of being easy to see, hear, or understand.', ex: 'Speaking with clarity helps everyone understand your point.' },
          { word: 'Essentially', type: 'adv', phonetic: 'eh-SEN-shuh-lee', hindi: 'मूल रूप से / वास्तव में', def: 'Used to emphasize the basic, fundamental nature.', ex: 'Essentially, we want to deliver results ahead of schedule.' },
          { word: 'Persuasive', type: 'adj', phonetic: 'per-SWAY-siv', hindi: 'प्रभावशाली / प्रेरक', def: 'Good at convincing someone to do or believe something.', ex: 'He gave a very persuasive presentation to the team.' },
          { word: 'Composure', type: 'noun', phonetic: 'kuhm-POH-zhur', hindi: 'आत्मसंयम / मन की शांति', def: 'The state of being calm and in control of oneself.', ex: 'Maintaining composure during tough questions wins respect.' },
          { word: 'Spontaneous', type: 'adj', phonetic: 'spon-TAY-nee-us', hindi: 'सहज / स्वाभाविक और त्वरित', def: 'Performed or occurring as a natural impulse without hesitation.', ex: 'A spontaneous conversation creates an immediate friendly connection.' },
          { word: 'Hesitation', type: 'noun', phonetic: 'hez-ih-TAY-shun', hindi: 'झिझक / संकोच', def: 'The action of pausing before saying or doing something.', ex: 'Daily speaking practice helps you eliminate all hesitation.' },
          { word: 'Deliberate', type: 'adj', phonetic: 'dih-LIB-er-ut', hindi: 'सोच-समझकर / संतुलित', def: 'Done consciously and intentionally with measured care.', ex: 'Taking deliberate pauses makes your speech sound authoritative.' },
          { word: 'Overcome', type: 'verb', phonetic: 'oh-ver-KUM', hindi: 'विजय पाना / पार पाना', def: 'Succeed in dealing with a problem or difficulty.', ex: 'With steady practice, you can overcome any speaking fear.' }
        ],
        commonMistake: {
          wrong: 'I didn’t knew that because according to me it was wrong.',
          correct: 'I didn’t know that, and in my opinion, it wasn’t suitable.',
          hindi: "'Didn't' के बाद हमेशा verb की 1st form 'know' आती है, और 'according to me' की जगह 'in my opinion' या 'I believe' बोलें।"
        },
        practiceChallenge: {
          goal: 'Express your opinion on an interesting topic with ZERO filler words (no "um", "uh", "actually").',
          starterText: "Welcome to Day 3! Today’s challenge is courage. Speak your thoughts slowly and clearly without using 'Um' or 'Uh'. Tell me: what is one goal you are working hard to achieve right now?",
          starterHindi: "डे 3 में स्वागत है! आज बिना 'Um' या 'Uh' बोले, शांत रहकर बताइए: वह कौन सा लक्ष्य है जिसे हासिल करने के लिए आप मेहनत कर रहे हैं?",
          targetSentence: "In my opinion, learning fluent English is an essential milestone for my personal growth.",
          phoneticGuide: "In my oh-PIN-yun, LUR-ning FLOO-ent ING-glish iz an eh-SEN-shul MYLE-stone fur my PUR-suh-nul grohth.",
          helpPills: [
            "In my opinion, daily practice is key to confidence.",
            "I am currently preparing for better career opportunities.",
            "Taking a calm pause helps me speak with clarity."
          ]
        }
      },
      {
        day: 4,
        id: 'ford-networking-smalltalk',
        title: 'Social Mastery: The FORD Technique & Conversation Ping-Pong',
        titleHindi: 'नेटवर्किंग, स्मॉल टॉक और किसी से भी बातचीत जारी रखने का फॉर्मूला',
        level: 'Intermediate 🌿',
        duration: '12 Mins',
        summary: 'Never run out of things to say. Use the F.O.R.D. framework (Family, Occupation, Recreation, Dreams) and the conversation Ping-Pong rule.',
        realLifeTips: [
          {
            title: 'The F.O.R.D. Social Framework',
            desc: 'When meeting someone new at work or a party, touch upon: F (Family/Origins), O (Occupation/Work), R (Recreation/Hobbies), D (Dreams/Aspirations). You will never face awkward silence again.'
          },
          {
            title: 'The Ping-Pong Rule (Answer + 1 Detail + Return Question)',
            desc: 'If someone asks "How was your weekend?", amateur answer: "Good." Pro answer: "It was really refreshing! I visited a bookstore and relaxed. How about yours, did you do anything fun?" Always hit the ball back!'
          },
          {
            title: 'Indianism Social Trap',
            desc: 'Never say "cousin brother" or "cousin sister" (native English only uses "my cousin"). Don’t ask "What is your good name?" (say "May I know your name?").'
          }
        ],
        vocabularies: [
          { word: 'Fascinating', type: 'adj', phonetic: 'FAS-uh-nay-ting', hindi: 'बेहद दिलचस्प / मोहक', def: 'Extremely interesting and charming.', ex: 'That is a fascinating perspective on modern technology!' },
          { word: 'Unwind', type: 'verb', phonetic: 'un-WYND', hindi: 'तनावमुक्त होना / रिलैक्स करना', def: 'To relax after a period of work or tension.', ex: 'Listening to music helps me unwind after a long day.' },
          { word: 'Passionate', type: 'adj', phonetic: 'PASH-uh-nit', hindi: 'उत्साही / भावुक', def: 'Having or showing strong feelings of enthusiasm.', ex: 'I am passionate about building intuitive digital software.' },
          { word: 'Leisure', type: 'noun', phonetic: 'LEE-zhur', hindi: 'फुर्सत / खाली समय', def: 'Free time spent away from business or duties.', ex: 'In my leisure hours, I enjoy reading autobiographies.' },
          { word: 'Engage', type: 'verb', phonetic: 'en-GAYJ', hindi: 'बातचीत में जोड़ना / ध्यान खींचना', def: 'Occupy, attract, or involve someone\'s interest or attention.', ex: 'Asking open-ended questions helps engage people effortlessly.' },
          { word: 'Inquire', type: 'verb', phonetic: 'in-KWY-er', hindi: 'विनम्रता से पूछताछ करना / जानना', def: 'Ask for information from someone in a polite manner.', ex: 'May I politely inquire about your upcoming projects and goals?' },
          { word: 'Heritage', type: 'noun', phonetic: 'HAIR-ih-tij', hindi: 'सांस्कृतिक धरोहर / विरासत', def: 'Valued objects and qualities such as historic sites passed down through generations.', ex: 'Our country is celebrated worldwide for its rich and diverse cultural heritage.' },
          { word: 'Reciprocal', type: 'adj', phonetic: 'rih-SIP-ruh-kul', hindi: 'परस्पर / दोनों तरफ से चलने वाला', def: 'Given, felt, or done in return.', ex: 'Good conversation requires reciprocal sharing and active listening.' },
          { word: 'Memorable', type: 'adj', phonetic: 'MEM-er-uh-bul', hindi: 'यादगार / अविस्मरणीय', def: 'Easily remembered, especially because of being special or unusual.', ex: 'Our annual team conference was an exceptionally memorable milestone.' },
          { word: 'Rapport', type: 'noun', phonetic: 'ra-POR', hindi: 'आपसी सामंजस्य / दोस्ताना तालमेल', def: 'A close and harmonious relationship where people understand each other.', ex: 'Finding shared hobbies helps build instant rapport with colleagues.' }
        ],
        commonMistake: {
          wrong: 'My cousin brother told me to revert back today.',
          correct: 'My cousin told me to revert / reply today.',
          hindi: "'Cousin' के साथ brother/sister नहीं लगाया जाता। और 'revert back' में 'back' अनावश्यक है, केवल 'revert' या 'reply' बोलें।"
        },
        practiceChallenge: {
          goal: 'Practice the Ping-Pong rule: Answer Aria’s question with 1 rich detail and ask a question back!',
          starterText: "Hey there! Welcome to Day 4: Social Mastery and Small Talk. Let's roleplay meeting at a conference. I'll ask you: How was your weekend, and what do you like doing to unwind?",
          starterHindi: "डे 4 में स्वागत है! चलिए एक पार्टी या कॉन्फ्रेंस की बातचीत का अभ्यास करते हैं। बताइए: आपका वीकेंड कैसा रहा और आप रिलैक्स करने के लिए क्या करते हैं?",
          targetSentence: "My weekend was quite refreshing because I read a fascinating book. How about you, Aria?",
          phoneticGuide: "My WEE-kend wuz kwite ree-FRESH-ing bee-KUZ eye red uh FAS-uh-nay-ting book. How uh-BOWT yoo, AH-ree-uh?",
          helpPills: [
            "It was very productive! I went cycling in the morning. How about you?",
            "I love watching documentaries to unwind on weekends. What about you?",
            "That sounds fascinating! Have you been working on this for long?"
          ]
        }
      },
      {
        day: 5,
        id: 'diplomatic-persuasion',
        title: 'Diplomatic English: Agreeing, Disagreeing & The Art of Persuasion',
        titleHindi: 'सहमति, विनम्र असहमति और अपनी बात मनवाने का हुनर (Diplomacy)',
        level: 'Intermediate 🌿',
        duration: '14 Mins',
        summary: 'Never say "You are wrong!" in office or adult discussions. Master the Agree-and-Pivot method and professional diplomacy.',
        realLifeTips: [
          {
            title: 'The "Agree and Pivot" Diplomatic Formula',
            desc: 'Blunt disagreement creates friction. Instead, validate first, then offer a counterpoint: "I completely understand your perspective, however, if we look at the timeline...", or "That is a valid point, though another angle to consider is...".'
          },
          {
            title: 'Softening Commands into Polite Inquiries',
            desc: 'Instead of "Give me the report" or "Do this now", use conditional modals: "Could you please share...", "Would it be possible to...", "I would appreciate it if you could...".'
          },
          {
            title: 'Never Say "I am agree"',
            desc: '"Agree" is an action verb, not an adjective. Say "I agree with you", "I completely agree", or "We are in total agreement".'
          }
        ],
        vocabularies: [
          { word: 'Perspective', type: 'noun', phonetic: 'per-SPEK-tiv', hindi: 'दृष्टिकोण / नज़रिया', def: 'A particular attitude toward or way of regarding something.', ex: 'From my perspective, this solution will save valuable time.' },
          { word: 'Collaborative', type: 'adj', phonetic: 'kuh-LAB-er-uh-tiv', hindi: 'सहयोगात्मक', def: 'Produced by or involving two or more parties working together.', ex: 'We need a collaborative effort across departments.' },
          { word: 'Constructive', type: 'adj', phonetic: 'kuhn-STRUK-tiv', hindi: 'रचनात्मक / हितकारी', def: 'Serving a useful purpose; tending to build up.', ex: 'Thank you for providing such constructive feedback.' },
          { word: 'Alternative', type: 'noun', phonetic: 'ol-TUR-nuh-tiv', hindi: 'विकल्प', def: 'One of two or more available possibilities.', ex: 'May I propose an alternative route to meet the deadline?' },
          { word: 'Compelling', type: 'adj', phonetic: 'kuhm-PEL-ing', hindi: 'आकर्षक / दमदार', def: 'Evoking interest, attention, or admiration in a powerfully irresistible way.', ex: 'You made a very compelling argument in the meeting.' },
          { word: 'Consensus', type: 'noun', phonetic: 'kuhn-SEN-sus', hindi: 'सर्वसम्मति / साझा राय', def: 'A general agreement reached by a group.', ex: 'After a fruitful debate, the committee reached a mutual consensus.' },
          { word: 'Respectfully', type: 'adv', phonetic: 'rih-SPEKT-fuh-lee', hindi: 'आदरपूर्वक / विनम्रता से', def: 'In a way that shows respect, deference, or politeness.', ex: 'I respectfully disagree with the proposed timeline.' },
          { word: 'Clarify', type: 'verb', phonetic: 'KLAIR-uh-fye', hindi: 'स्पष्ट करना / साफ करना', def: 'Make a statement or situation less confused and more comprehensible.', ex: 'Could you please clarify the secondary objective for this project?' },
          { word: 'Diplomatic', type: 'adj', phonetic: 'dip-luh-MAT-ik', hindi: 'कूटनीतिक / सूझबूझ भरा', def: 'Having or showing an ability to deal with people in a sensitive, tactful way.', ex: 'Choosing diplomatic phrasing resolves conflicts without tension.' },
          { word: 'Mutual', type: 'adj', phonetic: 'MYOO-choo-ul', hindi: 'पारस्परिक / साझा', def: 'Held in common by two or more parties.', ex: 'Finding mutual ground is the core foundation of persuasion.' }
        ],
        commonMistake: {
          wrong: 'I am agree with you, but your idea is wrong.',
          correct: 'I agree with your objective, but I see a different approach here.',
          hindi: "'I am agree' गलत है, 'I agree' बोलें। और 'your idea is wrong' की जगह 'I see a different approach' विनम्र लगता है।"
        },
        practiceChallenge: {
          goal: 'Politely express disagreement with an idea using the "Agree and Pivot" formula.',
          starterText: "Welcome to Day 5: Diplomatic English! Here is the scenario: I say 'I think working 14 hours every single day is the only way to be successful.' How would you politely disagree with me?",
          starterHindi: "डे 5 में स्वागत है! अगर मैं कहूँ कि 'सफल होने के लिए रोज़ 14 घंटे काम करना ही एकमात्र रास्ता है', तो आप विनम्रता से असहमति कैसे जताएंगे?",
          targetSentence: "I understand your dedication, however, I believe working smart with balance yields better long-term results.",
          phoneticGuide: "Eye un-der-STAND yoor ded-ih-KAY-shun, how-EV-er, eye bee-LEEV WUR-king smart with BAL-uns yields BET-er long-turm ree-ZULTS.",
          helpPills: [
            "I see your point, however, maintaining consistent focus is equally important.",
            "That is an interesting viewpoint, though another angle is productivity over hours.",
            "I agree with the spirit of hard work, but smart planning prevents burnout."
          ]
        }
      },
      {
        day: 6,
        id: 'elevator-pitch-workplace',
        title: 'Workplace Impact: The 45-Second Elevator Pitch & Meeting Presence',
        titleHindi: 'ऑफिस मीटिंग्स, 45-सेकंड एलिवेटर पिच और लीडरशिप भाषा',
        level: 'Advanced 🎯',
        duration: '15 Mins',
        summary: 'Deliver powerful executive summaries with Barbara Minto’s Pyramid Principle. Learn downward inflection for natural authority.',
        realLifeTips: [
          {
            title: 'The Minto Pyramid Principle (Lead with the Outcome)',
            desc: 'In business, don’t build suspense like a Bollywood movie. Start with the bottom-line result first, followed by 3 supporting facts, and end with the recommended next step.'
          },
          {
            title: 'The 45-Second Elevator Pitch Formula',
            desc: '1. Who I am & my core domain (10s) -> 2. The high-value problem I solve (15s) -> 3. The proven result or outcome (10s) -> 4. Call to action / conversation spark (10s).'
          },
          {
            title: 'Tone Inflection Mastery',
            desc: 'Indian professionals often end sentences with an upward tone (?) making statements sound like hesitant questions. Consciously drop your pitch at the end of statements (.) to exude calm authority.'
          }
        ],
        vocabularies: [
          { word: 'Spearhead', type: 'verb', phonetic: 'SPEER-hed', hindi: 'अगुआई करना / नेतृत्व करना', def: 'To lead an attack, movement, or initiative.', ex: 'I had the privilege to spearhead our digital transition.' },
          { word: 'Streamline', type: 'verb', phonetic: 'STREAM-lyne', hindi: 'सुव्यवस्थित / सरल बनाना', def: 'Make an organization or process more efficient and effective.', ex: 'Our goal is to streamline customer onboardings.' },
          { word: 'Benchmark', type: 'noun/verb', phonetic: 'BENCH-mark', hindi: 'मानक / पैमाना', def: 'A standard or point of reference against which things may be compared.', ex: 'This project sets a new benchmark for team efficiency.' },
          { word: 'Deliverable', type: 'noun', phonetic: 'dih-LIV-er-uh-bul', hindi: 'सौंपे जाने योग्य कार्य / परिणाम', def: 'A thing able to be provided, especially as a product of a development process.', ex: 'All key deliverables were submitted on schedule.' },
          { word: 'Synergy', type: 'noun', phonetic: 'SIN-er-jee', hindi: 'तालमेल / संयुक्त प्रभाव', def: 'The interaction of elements that when combined produce a greater effect.', ex: 'We observed tremendous synergy between marketing and tech.' },
          { word: 'Metric', type: 'noun', phonetic: 'MET-rik', hindi: 'मापदंड / आंकड़ा', def: 'A system or standard of measurement to track performance.', ex: 'User retention is our primary metric for product success.' },
          { word: 'Optimize', type: 'verb', phonetic: 'AHP-tuh-myze', hindi: 'सर्वोत्तम बनाना / सुधारना', def: 'Make the best or most effective use of a situation or resource.', ex: 'We optimized our database queries to decrease response latency by 50%.' },
          { word: 'Expertise', type: 'noun', phonetic: 'ek-sper-TEEZ', hindi: 'विशेषज्ञता / गहन महारत', def: 'Expert skill or knowledge in a particular field.', ex: 'She demonstrated exceptional expertise during the executive presentation.' },
          { word: 'Initiative', type: 'noun', phonetic: 'ih-NISH-uh-tiv', hindi: 'पहल / नई शुरुआत', def: 'The power or opportunity to act or take charge before others do.', ex: 'I took the initiative to establish weekly peer code reviews.' },
          { word: 'Distinctive', type: 'adj', phonetic: 'dih-STINGK-tiv', hindi: 'विशिष्ट / अलग पहचान वाला', def: 'Characteristic of one person or thing, and so serving to distinguish it from others.', ex: 'Our product offers distinctive features that competitors lack.' }
        ],
        commonMistake: {
          wrong: 'I passed out from college in 2023 and did one thing for the client.',
          correct: 'I graduated from college in 2023 and took the initiative to assist the client.',
          hindi: "'Passed out' का मतलब बेहोश होना होता है! कॉलेज पूरा करने के लिए 'graduated' बोलें। 'Do one thing' की जगह 'took the initiative' बोलें।"
        },
        practiceChallenge: {
          goal: 'Deliver your 30-to-45 second professional pitch to Aria as if she is your executive manager.',
          starterText: "Welcome to Day 6: Workplace Impact! Imagine I am a senior vice president meeting you in the elevator. Walk me through your professional background and the value you bring to the table!",
          starterHindi: "डे 6 में स्वागत है! कल्पना कीजिए मैं आपकी सीनियर मैनेजर हूँ। 45 सेकंड में आत्मविश्वास के साथ अपनी भूमिका और अनुभव बताएं!",
          targetSentence: "I specialize in technology solutions, where I streamline complex processes to drive measurable results.",
          phoneticGuide: "Eye SPESH-uh-lyze in tek-NOL-uh-jee soh-LOO-shunz, wair eye STREAM-lyne KOM-pleks PRAH-ses-ez too dryve MEZH-er-uh-bul ree-ZULTS.",
          helpPills: [
            "I specialize in solving technical challenges and improving client satisfaction.",
            "Over the past year, I spearheaded key initiatives that improved workflow efficiency.",
            "My focus is on delivering high-impact results with precision and speed."
          ]
        }
      },
      {
        day: 7,
        id: 'interview-star-mastery',
        title: 'High-Stakes Interviews: The S.T.A.R. Method & Executive Polish',
        titleHindi: 'जॉब इंटरव्यू में सफलता और S.T.A.R. मेथड का जादू (Interview Mastery)',
        level: 'Advanced 🎯',
        duration: '18 Mins',
        summary: 'Crack behavioral interview questions like a Fortune 500 candidate using Situation, Task, Action, and Result with quantifiable metrics.',
        realLifeTips: [
          {
            title: 'The S.T.A.R. Framework for Behavioral Questions',
            desc: 'When asked "Tell me about a time you solved a tough problem", organize your answer: S (Situation: Set the scene), T (Task: Your specific responsibility), A (Action: The strategic steps YOU took), R (Result: The measurable victory with % or numbers).'
          },
          {
            title: 'Answering "Tell Me About Yourself" (Present-Past-Future)',
            desc: 'Don’t recite your childhood or full CV. Structure: 1. Present (Where you shine right now) -> 2. Past (Key accomplishments that built your competence) -> 3. Future (Why this specific company aligns with your trajectory).'
          },
          {
            title: 'Turn Weaknesses into Credible Strengths',
            desc: 'Never say "I am a perfectionist" (cliché). Say "Earlier, I used to hesitate when delegating tasks, but I implemented daily tracking checklists which helped me empower team members effectively."'
          }
        ],
        vocabularies: [
          { word: 'Accomplished', type: 'adj/verb', phonetic: 'uh-KOM-plisht', hindi: 'कुशल / जिसने उपलब्धि हासिल की हो', def: 'Highly trained or skilled in a particular activity.', ex: 'Together, our team accomplished our quarterly targets ahead of time.' },
          { word: 'Initiative', type: 'noun', phonetic: 'ih-NISH-uh-tiv', hindi: 'पहल / नई शुरुआत', def: 'The ability to assess and initiate things independently.', ex: 'I took the initiative to resolve customer queries within 15 minutes.' },
          { word: 'Measurable', type: 'adj', phonetic: 'MEZH-er-uh-bul', hindi: 'मापने योग्य', def: 'Able to be measured, especially significant or noticeable.', ex: 'Our strategy led to a measurable 25% increase in user engagement.' },
          { word: 'Impactful', type: 'adj', phonetic: 'im-PAKT-ful', hindi: 'प्रभावशाली', def: 'Having a major impact or effect.', ex: 'This was one of the most impactful projects of my career.' },
          { word: 'Resilience', type: 'noun', phonetic: 'rih-ZIL-yunce', hindi: 'कठिनाइयों से उबरने की क्षमता', def: 'The capacity to withstand or recover quickly from difficulties.', ex: 'Demonstrating resilience under tight deadlines is crucial for growth.' },
          { word: 'Decisive', type: 'adj', phonetic: 'dih-SYE-siv', hindi: 'निर्णायक / त्वरित फैसला लेने वाला', def: 'Settling an issue; producing a definite result; showing the ability to make decisions quickly.', ex: 'Her decisive leadership turned the project around during a server outage.' },
          { word: 'Strategic', type: 'adj', phonetic: 'struh-TEE-jik', hindi: 'रणनीतिक / दूरगामी योजनाबद्ध', def: 'Relating to the identification of long-term or overall aims and interests.', ex: 'We formed a strategic roadmap that aligned with company vision.' },
          { word: 'Milestone', type: 'noun', phonetic: 'MYLE-stone', hindi: 'मील का पत्थर / महत्वपूर्ण उपलब्धि', def: 'A significant stage or event in the development of something.', ex: 'Reaching 10,000 active users was a proud milestone for our startup.' },
          { word: 'Adaptability', type: 'noun', phonetic: 'uh-dap-tuh-BIL-uh-tee', hindi: 'परिस्थितियों के अनुसार ढलना', def: 'The quality of being able to adjust to new conditions and tech.', ex: 'My adaptability helped me master new frameworks in just two weeks.' },
          { word: 'Diligent', type: 'adj', phonetic: 'DIL-ih-junt', hindi: 'लगनशील / अत्यंत परिश्रमी', def: 'Having or showing care and conscientiousness in one\'s work or duties.', ex: 'Thanks to diligent testing, the release went live with zero downtime.' }
        ],
        commonMistake: {
          wrong: 'I am doing very hard work and my cousin brother referred me.',
          correct: 'I demonstrate disciplined work ethic and was introduced through a professional connection.',
          hindi: "'Hard work' बहुत साधारण शब्द है, 'disciplined work ethic' या 'diligent approach' बोलें, जो इंटरव्यू में बहुत वजनदार लगता है।"
        },
        practiceChallenge: {
          goal: 'Answer the classic question "Tell me about a difficult challenge you faced and how you resolved it" using the STAR method.',
          starterText: "Welcome to Day 7: Interview Mastery! Let's do a live mock interview. I am your lead interviewer. Please tell me: Can you describe a challenging situation you faced, what action you took, and the final result?",
          starterHindi: "डे 7 में स्वागत है! चलिए एक लाइव मॉक इंटरव्यू करते हैं। बताइए: आपने किसी कठिन चुनौती का सामना कैसे किया, क्या कदम उठाया और क्या परिणाम मिला?",
          targetSentence: "When facing a tight deadline, I took the initiative to prioritize high-impact tasks, successfully delivering the project on time.",
          phoneticGuide: "Wen FAY-sing uh tight DED-lyne, eye took thuh ih-NISH-uh-tiv too pry-OR-ih-tyze high-IM-pakt tasks, suk-SES-fuh-lee dih-LIV-er-ing thuh PRAH-jekt on tyme.",
          helpPills: [
            "When faced with an unexpected delay, I reorganized our priorities to deliver on time.",
            "I took the initiative to clarify requirements with our stakeholders directly.",
            "Through disciplined teamwork, we achieved a measurable 20% improvement in performance."
          ]
        }
      }
    ];

    // ------------------------------------------------------------------------
    // VISUAL VOCABULARIES (DAILY LIFE TO ADVANCED INTERVIEW CRACKING)
    // Real photos, sentence usage under photo, Hindi translations & interview tips
    // ------------------------------------------------------------------------
    this.visualVocabs = [
      {
        id: 'vocab-meticulous',
        word: 'Meticulous',
        type: 'Adjective',
        category: 'interview',
        categoryBadge: '💼 Interview Cracker',
        phonetic: 'muh-TIK-yuh-lus',
        hindi: 'अत्यंत सूक्ष्म / बारीकियों पर ध्यान देने वाला',
        definition: 'Showing great attention to detail; very careful and precise.',
        image: 'assets/interview_card.jpg',
        sentenceExample: 'I am confident that my meticulous attention to detail will ensure zero production defects in this project.',
        sentenceHindi: 'मुझे पूरा विश्वास है कि बारीकियों पर मेरा अत्यधिक ध्यान इस प्रोजेक्ट में कोई भी तकनीकी कमी नहीं रहने देगा।',
        interviewTip: 'HR & Tech leads love this word when answering "What are your greatest strengths?". It proves high quality standards and accountability.'
      },
      {
        id: 'vocab-articulate',
        word: 'Articulate',
        type: 'Verb / Adjective',
        category: 'workplace',
        categoryBadge: '📊 Workplace & Pitch',
        phonetic: 'ar-TIK-yuh-layt',
        hindi: 'स्पष्ट और प्रभावशाली ढंग से व्यक्त करना',
        definition: 'Having or showing the ability to speak fluently and coherently.',
        image: 'assets/presentation.jpg',
        sentenceExample: 'In today\'s client meeting, I will articulate our three core growth strategies with clear supporting metrics.',
        sentenceHindi: 'आज की क्लाइंट मीटिंग में, मैं स्पष्ट आंकड़ों के साथ हमारी विकास रणनीतियों को बहुत प्रभावशाली ढंग से व्यक्त करूँगा।',
        interviewTip: 'Top executive trait: demonstrates you can communicate complex technical ideas to non-technical stakeholders effortlessly.'
      },
      {
        id: 'vocab-resilient',
        word: 'Resilient',
        type: 'Adjective',
        category: 'interview',
        categoryBadge: '💼 Interview Cracker',
        phonetic: 'rih-ZIL-yunt',
        hindi: 'कठिनाइयों में भी अडिग रहने वाला / लचीला',
        definition: 'Able to withstand or recover quickly from difficult conditions.',
        image: 'assets/interview_card.jpg',
        sentenceExample: 'When our initial release encountered server bottlenecks, our engineering team stayed resilient and resolved the issue within hours.',
        sentenceHindi: 'जब हमारे पहले रिलीज में रुकावटें आईं, तो हमारी टीम ने हिम्मत बनाए रखी और कुछ ही घंटों में समाधान निकाल लिया।',
        interviewTip: 'The ultimate golden word for behavioral interview questions like "Describe a time you faced intense pressure or project failure".'
      },
      {
        id: 'vocab-pragmatic',
        word: 'Pragmatic',
        type: 'Adjective',
        category: 'leadership',
        categoryBadge: '⚡ Executive Leadership',
        phonetic: 'prag-MAT-ik',
        hindi: 'व्यावहारिक / यथार्थवादी (Practical over theoretical)',
        definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
        image: 'assets/leadership.jpg',
        sentenceExample: 'Rather than debating theoretical concepts, we adopted a pragmatic solution that cut deployment time by 40%.',
        sentenceHindi: 'सैद्धांतिक बातों पर बहस करने के बजाय, हमने एक व्यावहारिक समाधान अपनाया जिसने डिप्लॉयमेंट समय 40% घटा दिया।',
        interviewTip: 'Hiring managers actively look for pragmatic engineers and managers because they deliver real business value instead of excuses.'
      },
      {
        id: 'vocab-spearhead',
        word: 'Spearhead',
        type: 'Verb',
        category: 'leadership',
        categoryBadge: '⚡ Executive Leadership',
        phonetic: 'SPEER-hed',
        hindi: 'किसी बड़े अभियान या प्रोजेक्ट का नेतृत्व करना',
        definition: 'To lead an organized effort, project, or attack.',
        image: 'assets/leadership.jpg',
        sentenceExample: 'In my last role, I spearheaded a company-wide automation campaign that saved over 15 hours of manual work every week.',
        sentenceHindi: 'मेरी पिछली भूमिका में, मैंने एक ऑटोमेशन अभियान का नेतृत्व किया जिसने हर हफ्ते 15 घंटे से अधिक मैन्युअल काम बचाया।',
        interviewTip: 'Replace passive words like "I worked on" with "I spearheaded" on your resume and interview stories for immediate executive gravitas.'
      },
      {
        id: 'vocab-cordial',
        word: 'Cordial',
        type: 'Adjective',
        category: 'daily',
        categoryBadge: '🗣️ Daily Social',
        phonetic: 'KOR-juhl',
        hindi: 'सौहार्दपूर्ण / गर्मजोशी भरा और विनम्र',
        definition: 'Warm and friendly; polite and respectful.',
        image: 'assets/daily_social.jpg',
        sentenceExample: 'Even when discussing challenging feedback with the client, we maintained a cordial and constructive conversation.',
        sentenceHindi: 'क्लाइंट के साथ कठिन फीडबैक पर बात करते हुए भी, हमने एक सौहार्दपूर्ण और आदरणीय बातचीत बनाए रखी।',
        interviewTip: 'Demonstrates Emotional Intelligence (EQ). Crucial when interviewers test how you handle disagreements and client communication.'
      },
      {
        id: 'vocab-spontaneous',
        word: 'Spontaneous',
        type: 'Adjective',
        category: 'daily',
        categoryBadge: '🗣️ Daily Social',
        phonetic: 'spon-TAY-nee-us',
        hindi: 'सहज / स्वाभाविक (बिना किसी बनावट के)',
        definition: 'Performed or occurring as a result of a sudden impulse without premeditation.',
        image: 'assets/daily_social.jpg',
        sentenceExample: 'We had an unplanned coffee meetup, and having a spontaneous conversation helped us build immediate trust and rapport.',
        sentenceHindi: 'हमने अचानक कॉफ़ी पर मिलने का निर्णय लिया, और एक सहज बातचीत ने हमें तुरंत विश्वास और तालमेल बनाने में मदद की।',
        interviewTip: 'Great for daily social fluency and building instant rapport during casual networking or initial conversation ice-breakers.'
      },
      {
        id: 'vocab-leverage',
        word: 'Leverage',
        type: 'Verb',
        category: 'workplace',
        categoryBadge: '📊 Workplace & Pitch',
        phonetic: 'LEV-rij',
        hindi: 'अधिकतम लाभ उठाना / किसी क्षमता का फायदा लेना',
        definition: 'To use something to maximum advantage.',
        image: 'assets/presentation.jpg',
        sentenceExample: 'I plan to leverage my background in data analytics to optimize customer acquisition costs for this product.',
        sentenceHindi: 'मैं इस उत्पाद के लिए ग्राहक अधिग्रहण लागत को कम करने हेतु अपने डेटा एनालिटिक्स अनुभव का पूरा लाभ उठाऊँगा।',
        interviewTip: 'A ubiquitous corporate power verb. Use it when explaining why your past skills make you uniquely qualified for the new role.'
      }
    ];

    // ------------------------------------------------------------------------
    // INTERACTIVE MCQ PRACTICE QUESTIONS (DAILY LIFE TO INTERVIEW CRACKERS)
    // Instant feedback, Indianism detection, STAR answers & bilingual explanations
    // ------------------------------------------------------------------------
    this.mcqQuestions = [
      {
        id: 1,
        category: 'interview',
        categoryBadge: '🎯 Interview Cracker',
        question: 'Which of the following is the most professional and confident way to introduce yourself in a job interview?',
        questionHindi: 'इंटरव्यू में अपना परिचय देने का सबसे सही, पेशेवर और आत्मविश्वासी तरीका कौन सा है?',
        options: [
          'Myself Rahul, passed out from Delhi University in 2023.',
          'My name is Rahul. I graduated from Delhi University with a degree in Computer Science.',
          'I am having 3 years experience in software testing field.',
          'I took tea in morning and came here for give interview.'
        ],
        correct: 1,
        explanation: "'Myself' से वाक्य शुरू करना व्याकरण की दृष्टि से अशुद्ध है और 'passed out' का अर्थ बेहोश होना भी होता है। सही और अंतरराष्ट्रीय स्तर पर स्वीकृत तरीका है: 'My name is Rahul. I graduated from Delhi University with a degree in Computer Science.'",
        interviewTip: "Never say 'passed out' for college completion—always say 'graduated from'. It immediately signals fluent corporate vocabulary.",
        sentenceAudio: 'My name is Rahul. I graduated from Delhi University with a degree in Computer Science.'
      },
      {
        id: 2,
        category: 'vocab',
        categoryBadge: '📖 Power Vocab',
        question: 'Choose the sentence that correctly uses the interview power word "Meticulous":',
        questionHindi: 'उस वाक्य को चुनें जो इंटरव्यू पावर वर्ड "Meticulous" (सूक्ष्म बारीकियों पर ध्यान देने वाला) का सही प्रयोग करता है:',
        options: [
          'I am meticulous eating lunch today with my friends.',
          'My meticulous attention to code review helped reduce critical server bugs by 30%.',
          'He is meticulous angry because of heavy traffic.',
          'The weather today is very meticulous and sunny.'
        ],
        correct: 1,
        explanation: "'Meticulous' का अर्थ होता है बारीकियों पर बहुत ध्यान देने वाला (showing extreme care and precision)। कोड रिव्यू, डेटा एनालिसिस और डॉक्यूमेंटेशन के संदर्भ में यह शब्द इंटरव्यूअर्स को बेहद प्रभावित करता है।",
        interviewTip: "Use 'meticulous' when describing your quality assurance or attention to precision—it sets you apart from junior candidates.",
        sentenceAudio: 'My meticulous attention to code review helped reduce critical server bugs by 30%.'
      },
      {
        id: 3,
        category: 'mistake',
        categoryBadge: '⚠️ Mistake Detector',
        question: 'Identify the grammatically correct sentence describing an action completed yesterday:',
        questionHindi: 'कल (बीते समय) में किए गए काम का वर्णन करने वाला सही वाक्य पहचानें:',
        options: [
          'Yesterday I didn\'t knew about the client presentation schedule.',
          'Yesterday I go to office and take three cups of tea.',
          'Yesterday I attended the client presentation and resolved all technical queries.',
          'Yesterday I am attended the meeting with my cousin sister.'
        ],
        correct: 2,
        explanation: "बीते समय (yesterday) के साथ क्रिया का Simple Past रूप (attended, resolved) आता है। 'didn't' के बाद कभी 2nd form ('knew') नहीं आती ('didn't know' सही होता है) और 'cousin sister' मानक अंग्रेजी में अमान्य है।",
        interviewTip: "Mastering the simple past tense gives immediate fluency; interviewers judge past project descriptions on clean past tense verbs.",
        sentenceAudio: 'Yesterday I attended the client presentation and resolved all technical queries.'
      },
      {
        id: 4,
        category: 'daily',
        categoryBadge: '🗣️ Daily Social',
        question: 'How should you politely order a cappuccino at a modern cafe without sounding rude or overly abrupt?',
        questionHindi: 'किसी कैफे में बिना रूखे लगे विनम्रता से कॉफ़ी ऑर्डर करने का सबसे स्वाभाविक तरीका कौन सा है?',
        options: [
          'Give me one cappuccino fast.',
          'Could I please have an oat-milk cappuccino, whenever you have a moment?',
          'I want cappuccino now only.',
          'Open the coffee machine and prepare tea.'
        ],
        correct: 1,
        explanation: "'Give me' या 'I want now' बहुत रूखा (demanding) लगता है। विनम्र सामाजिक बातचीत में हमेशा 'Could I please have...' या 'I would like...' का प्रयोग किया जाता है।",
        interviewTip: "Politeness markers like 'Could I please...' reflect your everyday emotional intelligence and soft skills.",
        sentenceAudio: 'Could I please have an oat-milk cappuccino, whenever you have a moment?'
      },
      {
        id: 5,
        category: 'interview',
        categoryBadge: '🎯 Interview Cracker',
        question: 'An interviewer asks: "Tell me about a time you faced a difficult roadblock." What is the best STAR response?',
        questionHindi: 'इंटरव्यूअर पूछता है: "किसी कठिन परिस्थिति के बारे में बताएं।" STAR मेथड के अनुसार सबसे सटीक उत्तर कौन सा है?',
        options: [
          'Roadblocks are not good. My manager gave too much work so I was unhappy.',
          'When our third-party API crashed before launch, our team stayed resilient, built a fallback cache, and delivered on schedule.',
          'According to me, software engineering is full of problems so I do one thing.',
          'Myself facing roadblock everyday in office.'
        ],
        correct: 1,
        explanation: "यह उत्तर STAR (Situation: API crash, Action: stayed resilient & built cache, Result: delivered on schedule) पद्धति का उत्कृष्ट उदाहरण है और इसमें 'resilient' पावर वर्ड का उपयोग किया गया है।",
        interviewTip: "Always frame problems with your proactive solution and a positive measurable result. Never blame teammates or managers.",
        sentenceAudio: 'When our third-party API crashed before launch, our team stayed resilient, built a fallback cache, and delivered on schedule.'
      },
      {
        id: 6,
        category: 'mistake',
        categoryBadge: '⚠️ Mistake Detector',
        question: 'In professional workplace communication, which sentence avoids common Indian English redundancy?',
        questionHindi: 'ऑफिस ईमेल और बातचीत में कौन सा वाक्य आम दोहराव (redundancy) से मुक्त और सही है?',
        options: [
          'Please revert back to my email as soon as possible.',
          'Please reply to my email at your earliest convenience.',
          'Do one thing and pre-pone the meeting today.',
          'Kindly revert back with the updated biodata.'
        ],
        correct: 1,
        explanation: "'Revert' का अर्थ ही उत्तर देना या पुरानी अवस्था में लौटना होता है, इसलिए 'revert back' में 'back' एक अनावश्यक दोहराव (redundancy) है। सबसे पेशेवर वाक्य है: 'Please reply to my email at your earliest convenience.'",
        interviewTip: "Using 'at your earliest convenience' in emails and interviews immediately shows seasoned corporate polish.",
        sentenceAudio: 'Please reply to my email at your earliest convenience.'
      },
      {
        id: 7,
        category: 'vocab',
        categoryBadge: '📖 Power Vocab',
        question: 'Which sentence best demonstrates corporate leadership using the power verb "Spearhead"?',
        questionHindi: 'पावर वर्ब "Spearhead" (नेतृत्व करना) का सबसे सटीक कॉर्पोरेट उपयोग कौन सा है?',
        options: [
          'I spearhead walking in the park every evening.',
          'In my previous role, I spearheaded a customer retention drive that boosted renewals by 25%.',
          'The computer was spearheading very slow yesterday.',
          'I am spearhead agree with your proposal.'
        ],
        correct: 1,
        explanation: "'Spearhead' का अर्थ होता है किसी महत्वपूर्ण प्रोजेक्ट या पहल की कमान संभालना और आगे बढ़कर नेतृत्व करना। यह वाक्य नेतृत्व और 25% का स्पष्ट परिणाम दोनों प्रदर्शित करता है।",
        interviewTip: "Leadership roles look for initiative. Sentences starting with 'I spearheaded...' are magnets for promotion and offers.",
        sentenceAudio: 'In my previous role, I spearheaded a customer retention drive that boosted renewals by 25%.'
      },
      {
        id: 8,
        category: 'daily',
        categoryBadge: '🗣️ Daily Social',
        question: 'During a phone call or meeting, if you didn\'t hear someone clearly, what should you say?',
        questionHindi: 'यदि कॉल या बातचीत में आपको सामने वाले की बात साफ़ नहीं सुनाई दी, तो विनम्रता से क्या कहना चाहिए?',
        options: [
          'What? Speak loudly.',
          'Your voice is breaking, do one thing speak again.',
          'I am sorry, I missed that last part. Could you please repeat it for me?',
          'Repeat back what you said just now.'
        ],
        correct: 2,
        explanation: "'What?' या 'Speak loudly' रूखा और आक्रामक लगता है। सबसे सुंदर और शिष्ट तरीका है: 'I am sorry, I missed that last part. Could you please repeat it for me?'",
        interviewTip: "If you don't understand an interviewer's question, asking politely for clarification is seen as thoughtful, not weak.",
        sentenceAudio: 'I am sorry, I missed that last part. Could you please repeat it for me?'
      },
      {
        id: 9,
        category: 'interview',
        categoryBadge: '🎯 Interview Cracker',
        question: 'When asked: "What is your greatest weakness?", which answer shows self-awareness and professional maturity?',
        questionHindi: 'जब पूछा जाए: "आपकी सबसे बड़ी कमजोरी क्या है?", कौन सा उत्तर परिपक्वता और निरंतर सुधार को दर्शाता है?',
        options: [
          'I have zero weaknesses, I am 100% perfect.',
          'I tend to hesitate in large public meetings, but I have been practicing proactive speaking in daily standups and improved significantly.',
          'I get angry very fast and I don\'t like working in teams.',
          'My weakness is that I work too hard and don\'t sleep.'
        ],
        correct: 1,
        explanation: "'I have no weakness' या 'I work too hard' बनावटी और अवास्तविक उत्तर हैं। वास्तविक कमजोरी को स्वीकार करते हुए यह दिखाना कि आप उस पर कैसे काम कर रहे हैं, सच्ची परिपक्वता दर्शाता है।",
        interviewTip: "Always follow the Weakness + Active Improvement formula: acknowledge a real soft spot, then prove what concrete step you are taking.",
        sentenceAudio: 'I tend to hesitate in large public meetings, but I have been practicing proactive speaking and improved significantly.'
      },
      {
        id: 10,
        category: 'vocab',
        categoryBadge: '📖 Power Vocab',
        question: 'Select the statement that correctly uses "Pragmatic" to solve a business problem:',
        questionHindi: 'व्यावसायिक समस्या सुलझाने में "Pragmatic" (व्यावहारिक) का सही उपयोग पहचानें:',
        options: [
          'Instead of chasing a 6-month rebuild, we took a pragmatic approach and fixed the top three user complaints first.',
          'The pragmatic weather was very cold in winter.',
          'I took a pragmatic tea and felt energetic.',
          'He is very pragmatic angry with the manager.'
        ],
        correct: 0,
        explanation: "'Pragmatic' का अर्थ है व्यावहारिक (action-oriented, realistic over idealistic)। 6 महीने के पुनर्निर्माण के बजाय 3 प्रमुख समस्याओं को तुरंत सुलझाना एक व्यावहारिक (pragmatic) कदम है।",
        interviewTip: "Senior interviewers prioritize candidates who know when to ship a pragmatic solution instead of endless theoretical planning.",
        sentenceAudio: 'Instead of chasing a six-month rebuild, we took a pragmatic approach and fixed the top three user complaints first.'
      }
    ];

    // ------------------------------------------------------------------------
    // DEEP GRAMMAR & INDIANISM RULES BANK (30+ RULES)
    // ------------------------------------------------------------------------
    this.grammarRules = [
      // 1. Irregular past tense over-regularization
      {
        pattern: /\b(buyed|catched|teached|taked|seed|bringed|payed|eated)\b/i,
        fix: (t) => t.replace(/\bbuyed\b/gi, 'bought')
                     .replace(/\bcatched\b/gi, 'caught')
                     .replace(/\bteached\b/gi, 'taught')
                     .replace(/\btaked\b/gi, 'took')
                     .replace(/\bseed\b/gi, 'saw')
                     .replace(/\bbringed\b/gi, 'brought')
                     .replace(/\bpayed\b/gi, 'paid')
                     .replace(/\beated\b/gi, 'ate'),
        tag: "Irregular Verbs (अनियमित क्रिया)",
        rule: "Irregular past tense: Do not add '-ed'. Use bought, caught, taught, took, saw, brought, paid, ate.",
        hindi: "Irregular verbs में '-ed' नहीं लगता! 'Buyed' की जगह 'bought', 'teached' की जगह 'taught' और 'catched' की जगह 'caught' बोलें।"
      },
      // 2. Yesterday / Last week with Present Tense
      {
        pattern: /\b(yesterday|last night|last week|last month|ago)\b.*?\b(go|see|buy|eat|take|come|do|tell|make)\b/i,
        fix: (t) => t.replace(/\bgo\b/gi, 'went')
                     .replace(/\bsee\b/gi, 'saw')
                     .replace(/\bbuy\b/gi, 'bought')
                     .replace(/\beat\b/gi, 'ate')
                     .replace(/\btake\b/gi, 'took')
                     .replace(/\bcome\b/gi, 'came')
                     .replace(/\bdo\b/gi, 'did'),
        tag: "Past Tense (बीते समय का काल)",
        rule: "Past time markers (yesterday, last night) strictly require simple past verbs (went, saw, bought).",
        hindi: "बीते समय (yesterday, last week) की बात करते वक्त हमेशा 2nd form (went, saw, bought) बोलें, present tense नहीं।"
      },
      // 3. Indianism: Myself + Name
      {
        pattern: /\bmyself\s+([A-Za-z]+)\b/i,
        fix: (t) => t.replace(/\bmyself\s+([A-Za-z]+)\b/gi, 'I am $1 / My name is $1'),
        tag: "Introduction (परिचय का नियम)",
        rule: "Never begin introductions with 'Myself'. Say 'I am [Name]' or 'My name is [Name]'.",
        hindi: "'Myself' reflex pronoun है, इससे वाक्य शुरू करना गलत है। हमेशा 'I am...' या 'My name is...' बोलें।"
      },
      // 4. Indianism: Didn't + 2nd Form (didn't knew / didn't went)
      {
        pattern: /\bdid\s*n'?t\s+(knew|went|came|saw|told|took|bought)\b/i,
        fix: (t) => t.replace(/\bdid\s*n'?t\s+knew\b/gi, "didn't know")
                     .replace(/\bdid\s*n'?t\s+went\b/gi, "didn't go")
                     .replace(/\bdid\s*n'?t\s+came\b/gi, "didn't come")
                     .replace(/\bdid\s*n'?t\s+saw\b/gi, "didn't see")
                     .replace(/\bdid\s*n'?t\s+told\b/gi, "didn't tell")
                     .replace(/\bdid\s*n'?t\s+took\b/gi, "didn't take"),
        tag: "Negative Past (Didn't + Base Form)",
        rule: "After 'did not' or 'didn't', always use the base form (1st form) of the verb. E.g., 'didn't know', not 'didn't knew'.",
        hindi: "'Didn't' के बाद हमेशा verb की 1st form आती है: 'didn't know' सही है, 'didn't knew' गलत है।"
      },
      // 5. Indianism: Cousin brother / Cousin sister
      {
        pattern: /\bcousin\s+(brother|sister)\b/i,
        fix: (t) => t.replace(/\bcousin\s+(brother|sister)\b/gi, 'cousin'),
        tag: "Indianism (कज़िन का नियम)",
        rule: "In standard English, never say 'cousin brother' or 'cousin sister'. Simply say 'my cousin'.",
        hindi: "English में 'cousin brother' या 'cousin sister' नहीं होता। केवल 'my cousin' बोलें।"
      },
      // 6. Indianism: Revert back
      {
        pattern: /\brevert\s+back\b/i,
        fix: (t) => t.replace(/\brevert\s+back\b/gi, 'revert / reply'),
        tag: "Redundancy (दोहराव)",
        rule: "'Revert' already means to go back or return. Adding 'back' is redundant. Say 'revert' or 'reply'.",
        hindi: "'Revert' का मतलब ही वापस आना/उत्तर देना है। 'revert back' में 'back' अनावश्यक है।"
      },
      // 7. Indianism: Passed out from college
      {
        pattern: /\bpassed\s+out\s+(from|of)?\s*(college|school|university|iit|nit)\b/i,
        fix: (t) => t.replace(/\bpassed\s+out\s+(from|of)?\s*(college|school|university|iit|nit)\b/gi, 'graduated from $2'),
        tag: "Phrasal Verb (ग्रेजुएशन का नियम)",
        rule: "'Pass out' means to faint or lose consciousness. For completing college, say 'I graduated from college'.",
        hindi: "'Pass out' का मतलब बेहोश होना होता है! कॉलेज पूरा करने के लिए हमेशा 'graduated from college' बोलें।"
      },
      // 8. Indianism: Take tea / eat soup
      {
        pattern: /\b(take|taking|took)\s+(tea|coffee)\b/i,
        fix: (t) => t.replace(/\btake\s+tea\b/gi, 'have tea')
                     .replace(/\btaking\s+tea\b/gi, 'having tea')
                     .replace(/\btook\s+tea\b/gi, 'had tea')
                     .replace(/\btake\s+coffee\b/gi, 'have coffee'),
        tag: "Collocation (चाय/कॉफ़ी का प्रयोग)",
        rule: "Do not say 'take tea'. Say 'have tea' or 'drink tea'.",
        hindi: "चाय या कॉफ़ी के लिए 'take tea' नहीं, बल्कि 'have tea' या 'drink tea' बोला जाता है।"
      },
      // 9. Indianism: I am agree
      {
        pattern: /\bi\s+am\s+agree\b/i,
        fix: (t) => t.replace(/\bi\s+am\s+agree\b/gi, 'I agree'),
        tag: "Verb vs Adjective (सहमति)",
        rule: "'Agree' is already a verb. Do not say 'I am agree'. Say 'I agree' or 'I agree with you'.",
        hindi: "'Agree' खुद एक क्रिया (verb) है। 'I am agree' गलत है, 'I agree' या 'I completely agree' बोलें।"
      },
      // 10. Indianism: Do one thing
      {
        pattern: /\bdo\s+one\s+thing\b/i,
        fix: (t) => t.replace(/\bdo\s+one\s+thing\b/gi, "here's what you can do / how about"),
        tag: "Indianism (सुझाव देने का तरीका)",
        rule: "'Do one thing' is a literal translation of 'ek kaam karo'. Say 'Here is an idea' or 'Why don't you...'.",
        hindi: "'एक काम करो' का सीधा अनुवाद 'do one thing' अंग्रेजी में अजीब लगता है। 'Here is a suggestion' बोलें।"
      },
      // 11. Indianism: According to me
      {
        pattern: /\baccording\s+to\s+me\b/i,
        fix: (t) => t.replace(/\baccording\s+to\s+me\b/gi, 'in my opinion / from my perspective'),
        tag: "Opinion Phrase (राय व्यक्त करना)",
        rule: "Native speakers use 'In my opinion' or 'From my perspective'. 'According to' is used for others or data.",
        hindi: "अपनी राय के लिए 'According to me' नहीं, 'In my opinion' या 'I believe' बोलना बेहतर है।"
      },
      // 12. Indianism: Years back
      {
        pattern: /\b(\d+|two|three|four|few|many)\s+years\s+back\b/i,
        fix: (t) => t.replace(/\b(\d+|two|three|four|few|many)\s+years\s+back\b/gi, '$1 years ago'),
        tag: "Time Expression (समय की अभिव्यक्ति)",
        rule: "Say 'years ago' instead of 'years back'. E.g., 'Three years ago'.",
        hindi: "'Years back' की जगह 'years ago' बोलें (जैसे: Three years ago)।"
      },
      // 13. Subject-Verb Agreement: He/She don't
      {
        pattern: /\b(he|she|it|everyone|someone|everybody)\s+don'?t\b/i,
        fix: (t) => t.replace(/\b(he|she|it|everyone|someone|everybody)\s+don'?t\b/gi, "$1 doesn't"),
        tag: "Subject-Verb Agreement (कर्ता-क्रिया तालमेल)",
        rule: "Third-person singular subjects (he, she, it, everyone) require 'doesn't', not 'don't'.",
        hindi: "He / She / It के साथ 'don't' नहीं, हमेशा 'doesn't' लगता है।"
      },
      // 14. Pluralization of uncountable nouns: informations / advices
      {
        pattern: /\b(informations|advices|furnitures|luggages)\b/i,
        fix: (t) => t.replace(/\binformations\b/gi, 'information')
                     .replace(/\badvices\b/gi, 'advice / pieces of advice')
                     .replace(/\bfurnitures\b/gi, 'furniture')
                     .replace(/\bluggages\b/gi, 'luggage'),
        tag: "Uncountable Nouns (अगणनीय संज्ञा)",
        rule: "Information, advice, luggage, and furniture are uncountable. Never add '-s'.",
        hindi: "Information और Advice में कभी 's' नहीं लगता। हमेशा 'information' और 'advice' बोलें।"
      },
      // 15. Discuss about
      {
        pattern: /\bdiscuss\s+about\b/i,
        fix: (t) => t.replace(/\bdiscuss\s+about\b/gi, 'discuss'),
        tag: "Preposition Redundancy (अनावश्यक Preposition)",
        rule: "'Discuss' already means to talk about. Do not say 'discuss about'. Say 'discuss the topic'.",
        hindi: "'Discuss' के साथ 'about' नहीं लगाया जाता। सीधे 'discuss the matter' बोलें।"
      },
      // 16. Question Structure: You know about -> Do you know about
      {
        pattern: /^you\s+know\s+about\b/i,
        fix: (t) => t.replace(/^you\s+know\s+about\b/i, 'Do you know about'),
        tag: "Question Structure (प्रश्न पूछने का नियम)",
        rule: "When asking whether someone knows something, use auxiliary verb 'Do': 'Do you know about...?' instead of 'You know about...'.",
        hindi: "प्रश्न पूछते समय 'You know about...' की जगह 'Do you know about...?' बोलें।"
      }
    ];

    // Power Vocabulary Replacements
    this.vocabDictionary = {
      'very good': { word: 'exceptional', type: 'adj', def: 'Unusually good; outstanding.', ex: 'You did an exceptional job today.' },
      'good': { word: 'splendid', type: 'adj', def: 'Magnificent; very impressive.', ex: 'That was a splendid idea.' },
      'very happy': { word: 'thrilled', type: 'adj', def: 'Extremely pleased and excited.', ex: 'I was thrilled to hear the news.' },
      'happy': { word: 'delighted', type: 'adj', def: 'Feeling or showing great pleasure.', ex: 'She was delighted with the results.' },
      'very tired': { word: 'exhausted', type: 'adj', def: 'Completely drained of energy.', ex: 'I was utterly exhausted.' },
      'tired': { word: 'fatigued', type: 'adj', def: 'Tired from mental or physical effort.', ex: 'I felt fatigued after the day.' },
      'very big': { word: 'colossal', type: 'adj', def: 'Extremely large or magnificent.', ex: 'It was a colossal achievement.' },
      'big': { word: 'substantial', type: 'adj', def: 'Of considerable importance or size.', ex: 'We made substantial progress.' },
      'hard': { word: 'challenging', type: 'adj', def: 'Demanding effort and skill.', ex: 'It was a challenging yet rewarding task.' },
      'like': { word: 'appreciate', type: 'verb', def: 'Recognize the full value of.', ex: 'I truly appreciate your perspective.' },
      'say': { word: 'articulate', type: 'verb', def: 'Express thoughts fluently.', ex: 'She articulated her thoughts clearly.' },
      'problem': { word: 'obstacle', type: 'noun', def: 'A hurdle blocking progress.', ex: 'We overcame several obstacles.' }
    };
  }

  setEngineType(type) {
    this.engineType = type;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('talkriva_engine_type', type);
    }
  }

  setApiKey(key) {
    this.apiKey = key;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('talkriva_gemini_key', key);
    }
  }

  /**
   * Main turn pipeline
   */
  async processUserTurn({ text, mode, scenarioId, partner, level, lessonDay = null }) {
    const startTime = Date.now();

    // 1. Linguistic & Mistake Detection
    const analysis = this.analyzeSpeech(text, level);

    // 2. Generate Contextual AI Response
    let aiResponse = "";
    let aiHindi = "";
    let aiEmotion = "🌸 Warm & Friendly";
    if (this.engineType === 'gemini' && this.apiKey) {
      try {
        aiResponse = await this.callGeminiAPI({ text, mode, scenarioId, partner, level, analysis, lessonDay });
      } catch (err) {
        console.warn("Gemini API fallback to local engine:", err);
        const local = this.generateLocalResponse({ text, mode, scenarioId, partner, level, analysis, lessonDay });
        aiResponse = local.text || local;
        aiHindi = local.hindi || "";
        aiEmotion = local.emotion || "🌸 Warm & Friendly";
      }
    } else {
      const local = this.generateLocalResponse({ text, mode, scenarioId, partner, level, analysis, lessonDay });
      aiResponse = local.text || local;
      aiHindi = local.hindi || "";
      aiEmotion = local.emotion || "🌸 Warm & Friendly";
    }

    // 3. Update Memory Mind
    this.memory.recordTurn(text, aiResponse, analysis, lessonDay);

    // 4. Generate Smart Hints & How-to-Speak guidance
    const suggestedReplies = this.generateSmartHints(aiResponse, mode, level, lessonDay);
    const howToSpeak = this.generateHowToSpeakGuide(aiResponse, mode, lessonDay);

    return {
      aiResponse,
      aiHindi,
      emotion: aiEmotion,
      analysis,
      suggestedReplies,
      howToSpeak,
      memorySummary: this.memory.getSummary(),
      processingTime: Date.now() - startTime
    };
  }

  /**
   * Deep Mistake Detector with Visual Diff & Hindi Explanations
   */
  analyzeSpeech(rawText, level) {
    const text = rawText.trim();
    if (!text) {
      return {
        original: "",
        corrected: "",
        hasError: false,
        diffWrongHtml: "No input",
        diffCorrectHtml: "No input",
        hindiExplanation: "वाक्य बिल्कुल सही है।",
        grammarExplanation: "No input detected.",
        nativeAlternative: "",
        vocabUpgrades: [],
        fluencyScore: 100,
        fillerCount: 0,
        wpm: 0
      };
    }

    // Filler word count
    const fillerRegex = /\b(um|uh|like|you know|basically|actually|sort of|kind of|i mean)\b/gi;
    const fillerMatches = text.match(fillerRegex) || [];
    const fillerCount = fillerMatches.length;

    let correctedText = text;
    let detectedRule = null;
    let detectedHindi = null;
    const detectedIssues = [];

    // Test against grammar & Indianism patterns
    for (const rule of this.grammarRules) {
      if (rule.pattern && rule.pattern.test(correctedText)) {
        if (rule.fix) {
          correctedText = rule.fix(correctedText);
        }
        detectedIssues.push(rule);
        if (!detectedRule) {
          detectedRule = rule.rule;
          detectedHindi = rule.hindi;
        }
      }
    }

    // Capitalize first letter and add period
    if (correctedText.length > 0) {
      correctedText = correctedText.charAt(0).toUpperCase() + correctedText.slice(1);
      if (!/[.?!]$/.test(correctedText)) {
        correctedText += '.';
      }
    }

    const hasError = detectedIssues.length > 0 || correctedText.toLowerCase() !== text.toLowerCase();

    // Generate Visual Diff Highlighting
    const { diffWrongHtml, diffCorrectHtml } = this.generateVisualDiff(text, correctedText, hasError);

    // Generate Natural Native Alternative
    const nativeAlternative = this.generateNativeAlternative(text, correctedText);

    // Power Vocabulary Upgrades
    const vocabUpgrades = this.extractVocabUpgrades(text);

    // Scoring
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    let fluencyScore = 96;
    if (hasError) fluencyScore -= 10 * detectedIssues.length;
    if (fillerCount > 0) fluencyScore -= 4 * fillerCount;
    if (wordCount < 4) fluencyScore -= 8;
    fluencyScore = Math.max(65, Math.min(99, fluencyScore));

    return {
      original: text,
      corrected: hasError ? correctedText : text,
      hasError: hasError,
      diffWrongHtml,
      diffCorrectHtml,
      hindiExplanation: detectedHindi || "आपका वाक्य व्याकरण की दृष्टि से सही और स्पष्ट है!",
      grammarExplanation: detectedRule || "Clean sentence structure with no critical grammar errors.",
      nativeAlternative,
      vocabUpgrades,
      fluencyScore,
      fillerCount,
      wpm: Math.floor(115 + Math.random() * 20),
      fluencyTip: this.getFluencyTip(text, wordCount, hasError)
    };
  }

  /**
   * Generates HTML with red strikethrough for wrong words and green highlight for correct words
   */
  generateVisualDiff(original, corrected, hasError) {
    if (!hasError) {
      return {
        diffWrongHtml: `<span style="color:#94a3b8;">"${original}"</span>`,
        diffCorrectHtml: `<span class="correct-word-highlight">${corrected}</span> (No mistakes!)`
      };
    }

    const origWords = original.split(/\s+/);
    const corrWords = corrected.replace(/[.?!]$/, '').split(/\s+/);

    let wrongHtml = '';
    let correctHtml = '';

    origWords.forEach((word) => {
      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const isMismatch = !corrWords.some(cw => cw.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
      if (isMismatch) {
        wrongHtml += `<span class="error-word-highlight">${word}</span> `;
      } else {
        wrongHtml += `${word} `;
      }
    });

    corrWords.forEach((word) => {
      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const isMismatch = !origWords.some(ow => ow.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
      if (isMismatch) {
        correctHtml += `<span class="correct-word-highlight">${word}</span> `;
      } else {
        correctHtml += `${word} `;
      }
    });

    return {
      diffWrongHtml: wrongHtml.trim(),
      diffCorrectHtml: correctHtml.trim() + '.'
    };
  }

  /**
   * Generates dynamic, fresh, and non-repetitive conversation starters
   * Each with rich daily-use and power vocabularies, Hindi translation,
   * and targeted hint drawer data so the user never gets bored!
   */
  getDynamicStarter(userName = "Learner", level = "tooti-footi", goal = "job-interview", profession = "student") {
    const prof = this.memory.data.profile;
    const name = userName || prof.name || "friend";
    const userGoal = goal || prof.goal || "job-interview";
    const userLevel = level || prof.level || "tooti-footi";
    const userProf = profession || prof.profession || "student";
    const profLabel = userProf === 'student' ? 'college student' : (userProf === 'tech' ? 'software aspirant' : 'professional');

    const starters = [
      // 1. Career & Placement Introduction
      {
        id: 'starter-profile-placement-intro',
        emotion: '💡 Placement Coach',
        text: `Hello ${name}! Welcome to our practice session. As an ambitious ${profLabel} preparing for future career opportunities, one of the most essential questions recruiters ask is: 'Could you tell me a little about yourself?' How would you introduce your educational background, core strengths, and career ambitions in two or three confident English sentences?`,
        hindi: `नमस्ते ${name}! हमारे अभ्यास सत्र में आपका स्वागत है। एक महत्वाकांक्षी ${profLabel} के रूप में, इंटरव्यूअर्स का सबसे महत्वपूर्ण सवाल होता है: 'Tell me about yourself'। आप अपनी शिक्षा, मुख्य ताकत और करियर के लक्ष्यों का परिचय 2-3 आत्मविश्वास से भरे वाक्यों में कैसे देंगे?`,
        whatAsked: `आरिया पूछ रही है: 'अपने बैकग्राउंड, मुख्य खूबियों और करियर लक्ष्यों का परिचय 2-3 सरल वाक्यों में दें!'`,
        targetText: `Hello! My name is ${name}. I am a dedicated ${profLabel}, and I am actively working on improving my communication skills and career readiness.`,
        phonetic: `Huh-LOH! My naym iz ${name}. Eye am uh DED-ih-kay-tid ${profLabel}, and eye am AK-tiv-lee WUR-king on im-PROO-ving my kuh-myoo-nih-KAY-shun skilz and kuh-REER RED-ee-nis.`,
        hindiMeaning: `नमस्ते! मेरा नाम ${name} है। मैं एक समर्पित ${profLabel} हूँ, और मैं अपने संचार कौशल और करियर की तैयारी को बेहतर बनाने पर सक्रिय रूप से काम कर रहा हूँ।`
      },
      // 2. Positive Morning Mindset & Routine
      {
        id: 'starter-profile-morning-mindset',
        emotion: '🌸 Warm & Inspiring',
        text: `Good day, ${name}! It is wonderful to have you here today. Successful communicators often emphasize how our morning mindset shapes the rest of our day. What is one positive habit or routine that helps you start your day on a focused and productive note?`,
        hindi: `शुभ दिन, ${name}! आज आपका यहाँ होना बहुत सुखद है। सफल लोग अक्सर कहते हैं कि सुबह की दिनचर्या पूरे दिन को तय करती है। ऐसी कौन सी अच्छी आदत है जो आपके दिन की शुरुआत को सकारात्मक बनाती है?`,
        whatAsked: `आरिया पूछ रही है: 'अपने दिन की शुरुआत को सकारात्मक बनाने वाली किसी आदत या रूटीन के बारे में बताएं!'`,
        targetText: `I like starting my morning with a calm mind, planning my daily goals, and dedicating time to learn something new.`,
        phonetic: `Eye lyk STAHR-ting my MOR-ning with uh kahm mynd, PLAN-ing my DAY-lee gohlz, and DED-ih-kay-ting tyme too lurn SUM-thing noo.`,
        hindiMeaning: `मुझे शांत मन से सुबह शुरू करना, अपने दिन के लक्ष्यों की योजना बनाना और कुछ नया सीखने के लिए समय निकालना पसंद है।`
      },
      // 3. Overcoming Hesitation & Encouraging Confidence
      {
        id: 'starter-profile-confidence-building',
        emotion: '🤗 Supportive & Caring',
        text: `Hello ${name}! Please remember that everyone begins their language journey with hesitation before achieving natural fluency. What truly matters is speaking with genuine enthusiasm. What is one personal milestone or achievement you felt proud of recently?`,
        hindi: `नमस्ते ${name}! याद रखें कि हर व्यक्ति शुरुआत में झिझक के बाद ही धाराप्रवाह बोलना सीखता है। सबसे महत्वपूर्ण बात उत्साह के साथ बोलना है। हाल ही में ऐसी कौन सी बात रही जिस पर आपको गर्व महसूस हुआ?`,
        whatAsked: `आरिया कह रही है: 'बिना किसी झिझक के दिल खोलकर बताएं कि हाल ही में आपको किस बात पर गर्व या खुशी महसूस हुई!'`,
        targetText: `Recently, I felt proud because I made a firm commitment to practice speaking English every single day.`,
        phonetic: `REE-sunt-lee, eye felt prowd bee-KUZ eye mayd uh furm kuh-MIT-munt too PRAK-tis SPEE-king ING-glish EV-ree SING-gul day.`,
        hindiMeaning: `हाल ही में मुझे गर्व महसूस हुआ क्योंकि मैंने हर रोज़ अंग्रेजी बोलने का अभ्यास करने का पक्का संकल्प लिया है।`
      },
      // 4. College Project & Technical Strength
      {
        id: 'starter-profile-project-skills',
        emotion: '🤩 Impressed & Curious',
        text: `Hi ${name}! In professional discussions and interviews, explaining your projects with clarity makes an extraordinary first impression. What is an interesting project, skill, or subject you are passionate about exploring right now?`,
        hindi: `हाय ${name}! इंटरव्यू में अपने प्रोजेक्ट्स को स्पष्टता से समझाना एक बेहतरीन प्रभाव छोड़ता है। वह कौन सा प्रोजेक्ट, हुनर या विषय है जिसमें आपकी सबसे गहरी रुचि है?`,
        whatAsked: `आरिया पूछ रही है: 'अपने प्रोजेक्ट या किसी पसंदीदा विषय के बारे में 2-3 वाक्यों में बताएं!'`,
        targetText: `I am currently developing my practical skills and working on projects that solve real-world problems.`,
        phonetic: `Eye am KUR-unt-lee dih-VEL-up-ing my PRAK-tih-kul skilz and WUR-king on PRAH-jekts that sahlv reel-wurld PRAHB-lumz.`,
        hindiMeaning: `मैं वर्तमान में अपने व्यावहारिक हुनर को निखार रहा हूँ और ऐसे प्रोजेक्ट्स पर काम कर रहा हूँ जो वास्तविक समस्याओं को हल करते हैं।`
      },
      // 5. Daily Real-Life Pause & Recharge
      {
        id: 'starter-profile-daily-chai',
        emotion: '✨ Energized & Cheerful',
        text: `Good day, ${name}! I hope your day is going wonderfully! During a busy routine of studying and working, how do you prefer to take a short pause to refresh your mind—perhaps with a hot cup of tea or a relaxing walk?`,
        hindi: `शुभ दिन, ${name}! आशा है आपका दिन बहुत अच्छा बीत रहा है! काम या पढ़ाई के बीच अपना मन तरोताजा करने के लिए आप क्या करना पसंद करते हैं?`,
        whatAsked: `आरिया पूछ रही है: 'थकान मिटाने और रिफ्रेश होने के लिए आप क्या करना पसंद करते हैं?'`,
        targetText: `I truly enjoy taking a brief afternoon pause with a hot cup of tea to refresh my thoughts and regain my focus.`,
        phonetic: `Eye TROO-lee en-JOY TAY-king uh breef af-ter-NOON pawz with uh hot kup uv tee too ree-FRESH my thawtz and ree-GAYN my FOH-kus.`,
        hindiMeaning: `मुझे अपने विचारों को तरोताजा करने और दोबारा ध्यान केंद्रित करने के लिए गर्म चाय के साथ एक छोटा सा ब्रेक लेना बहुत पसंद है।`
      },
      // 6. Professional Situational: Unique Strengths
      {
        id: 'starter-profile-hire-strength',
        emotion: '💡 Interview Coach',
        text: `Hello ${name}! Imagine an interviewer looks at your resume and warmly asks: 'What makes you unique, and why should we welcome you to our team?' How would you articulate your dedication, adaptability, and positive attitude?`,
        hindi: `नमस्ते ${name}! कल्पना कीजिए इंटरव्यूअर पूछे: 'आपकी सबसे बड़ी खूबी क्या है, और हम आपको अपनी टीम में क्यों चुनें?' तो आप अपनी लगन और सकारात्मक सोच को कैसे व्यक्त करेंगे?`,
        whatAsked: `आरिया पूछ रही है: 'इंटरव्यू में अपनी मेहनत, सीखने की ललक और समर्पण को अंग्रेजी में कैसे बताएंगे?'`,
        targetText: `You should consider me because I am highly adaptable, consistent in my efforts, and eager to learn and contribute value every single day.`,
        phonetic: `Yoo shood kun-SID-er mee bee-KUZ eye am HY-lee uh-DAP-tuh-bul, kun-SIS-tunt in my EF-urts, and EE-ger too lurn and kun-TRIB-yoot VAL-yoo EV-ree SING-gul day.`,
        hindiMeaning: `आपको मुझे चुनना चाहिए क्योंकि मैं बहुत लचीला हूँ, अपने प्रयासों में निरंतर हूँ और हर दिन सीखने व योगदान देने के लिए उत्सुक हूँ।`
      },
      // 7. Free Time Passions & Hobbies
      {
        id: 'starter-profile-hobbies',
        emotion: '🌸 Warm & Relatable',
        text: `It is an absolute pleasure to speak with you, ${name}! In genuine conversations, sharing our favorite pastimes creates an immediate, friendly connection. What hobbies, sports, or music bring you the greatest joy in your spare time?`,
        hindi: `आपसे बात करके बहुत खुशी हुई, ${name}! स्वाभाविक बातचीत में अपने शौक साझा करना एक दोस्ताना रिश्ता बनाता है। खाली समय में कौन सा शौक, खेल या संगीत आपको सबसे ज्यादा खुशी देता है?`,
        whatAsked: `आरिया पूछ रही है: 'अपने पसंदीदा शौक, खेल या संगीत के बारे में बताइए!'`,
        targetText: `In my spare time, I genuinely enjoy reading insightful books, listening to music, and exploring new ideas.`,
        phonetic: `In my spair tyme, eye JEN-yoo-in-lee en-JOY REE-ding IN-syt-ful books, LIS-ning too MYOO-zik, and ek-SPLOR-ing noo eye-DEE-uz.`,
        hindiMeaning: `खाली समय में, मुझे ज्ञानवर्धक किताबें पढ़ना, संगीत सुनना और नए विचारों की खोज करना बहुत अच्छा लगता है।`
      },
      // 8. Overcoming Hesitation & Speaking Confidently
      {
        id: 'starter-profile-hesitation',
        emotion: '✨ Inspiring & Motivating',
        text: `Welcome ${name}! Here is an empowering communication secret: whenever you search for the right word, take a serene, deliberate pause instead of rushing. How confident are you feeling about expressing yourself in English today?`,
        hindi: `स्वागत है ${name}! याद रखें: जब भी शब्द न मिलें, तो घबराने की जगह 1 सेकंड का शांत ठहराव लें। आज आप अपने विचार व्यक्त करने में कितना आत्मविश्वासी महसूस कर रहे हैं?`,
        whatAsked: `आरिया पूछ रही है: 'शांत मन से बताएं कि आज आप अंग्रेजी बोलने में कितना आत्मविश्वासी महसूस कर रहे हैं!'`,
        targetText: `I am feeling very optimistic, and I am ready to practice speaking with clear expression and confidence.`,
        phonetic: `Eye am FEEL-ing VER-ee ahp-tuh-MIS-tik, and eye am RED-ee too PRAK-tis SPEE-king with kleer ek-SPRESH-un and KAHN-fih-dense.`,
        hindiMeaning: `मैं बहुत सकारात्मक महसूस कर रहा हूँ, और स्पष्ट अभिव्यक्ति और आत्मविश्वास के साथ बोलने का अभ्यास करने के लिए पूरी तरह तैयार हूँ।`
      }
    ];

    if (this._lastStarterIdx === undefined) {
      this._lastStarterIdx = Math.floor(Math.random() * starters.length);
    } else {
      this._lastStarterIdx = (this._lastStarterIdx + 1) % starters.length;
    }
    const selected = starters[this._lastStarterIdx];
    this.currentActiveStarter = selected;
    return selected;
  }

  /**
   * Guidance card data with sentence formula, phonetics & Hindi meaning
   * Dynamically analyzes what Aria asked in aiResponse to tell the user:
   * 1. whatAriaIsAsking: In Hindi, what Aria is asking them
   * 2. targetText: Exactly how to answer her in English
   * 3. phonetic: Word-by-word pronunciation guide
   * 4. hindi: The Hindi meaning of this answer
   */
  /**
   * Helper: Extract the most relevant question sentence from AI's utterance
   */
  extractLastQuestionSentence(text) {
    if (!text) return "";
    const cleaned = text.replace(/[*_#`]/g, '').trim();
    const sentences = cleaned.split(/(?<=[.?!])\s+/);
    for (let i = sentences.length - 1; i >= 0; i--) {
      const s = sentences[i].trim();
      if (s.endsWith('?') || /^(what|how|why|where|when|which|could|can|would|do|did|have|are|is|tell me|describe)\b/i.test(s)) {
        return s;
      }
    }
    return sentences[sentences.length - 1] || cleaned;
  }

  /**
   * Guidance card data with sentence formula, phonetics & Hindi meaning
   * Dynamically analyzes what Aria asked in aiResponse to tell the user:
   * 1. whatAriaIsAsking: In Hindi, what Aria is asking them
   * 2. formula: Conversational structure
   * 3. targetText: Exactly how to answer her in English
   * 4. phonetic: Word-by-word pronunciation guide
   * 5. hindi: The Hindi meaning of this answer
   * 6. quickPills: 2-3 instant 1-tap responses ready to speak
   */
  generateHowToSpeakGuide(aiResponse, mode, lessonDay = null) {
    const cleanAi = (aiResponse || "").toLowerCase();
    const userMemory = this.memory.data;
    const userName = userMemory.profile.name || "friend";

    // CASE 1: Structured Lesson Practice Mode
    if (lessonDay) {
      const lesson = this.lessonsCurriculum.find(l => l.day === parseInt(lessonDay, 10));
      if (lesson && lesson.practiceChallenge) {
        let whatAsked = `आरिया अभ्यास करवा रही है: ${lesson.titleHindi}`;
        let lessonPills = [
          lesson.practiceChallenge.targetSentence,
          "I am focusing on speaking smoothly and with confidence.",
          "Could we practice one more example together?"
        ];
        if (parseInt(lessonDay, 10) === 1) {
          whatAsked = "आरिया पूछ रही है: 'Myself' के बिना अपना नाम और आज का मूड बताएं!";
          lessonPills = [
            `Hello Aria, my name is ${userName}. I am feeling energetic today!`,
            `Hi! I am ${userName}, excited to build strong English communication skills.`,
            `Good morning! I am feeling ready to dive into today's session.`
          ];
        } else if (parseInt(lessonDay, 10) === 2) {
          whatAsked = "आरिया पूछ रही है: आज दिन में आपने क्या किया और शाम को क्या करना पसंद करते हैं?";
          lessonPills = [
            "Earlier today, I finished my tasks and practiced spoken English.",
            "In the evening, I usually unwind and review what I learned.",
            "I spent my afternoon working productively on key priorities."
          ];
        } else if (parseInt(lessonDay, 10) === 3) {
          whatAsked = "आरिया पूछ रही है: बिना 'Um' या 'Uh' बोले, शांत रहकर बताएं कि आपका सबसे बड़ा लक्ष्य क्या है?";
          lessonPills = [
            "My primary milestone is to speak English fluently and crack top interviews.",
            "I aim to express my thoughts clearly without any hesitation.",
            "My biggest goal this year is mastering professional communication."
          ];
        } else if (parseInt(lessonDay, 10) === 4) {
          whatAsked = "आरिया पूछ रही है (Ping-Pong): आपका वीकेंड कैसा रहा? (जवाब देकर वापस सवाल पूछें)";
          lessonPills = [
            "My weekend was very refreshing! How did you spend your time?",
            "I relaxed and read an insightful book. What about you, Aria?",
            "I went outdoors to recharge. What do you enjoy doing on weekends?"
          ];
        } else if (parseInt(lessonDay, 10) === 5) {
          whatAsked = "आरिया पूछ रही है: 14 घंटे काम करने की बात पर आप विनम्रता से (Diplomatically) असहमति कैसे जताएंगे?";
          lessonPills = [
            "I understand that perspective, but sustainable pacing drives superior long-term results.",
            "I respectfully see it differently, as balance prevents burnout.",
            "While hard work is vital, focused smart work yields better quality."
          ];
        } else if (parseInt(lessonDay, 10) === 6) {
          whatAsked = "आरिया पूछ रही है: सीनियर मैनेजर के सामने 45 सेकंड में अपना रोल और अनुभव बताएं!";
          lessonPills = [
            "I am a software engineer dedicated to building scalable, user-centric systems.",
            "I specialize in full-stack architecture with a focus on high efficiency.",
            "My background blends solid technical depth with collaborative problem-solving."
          ];
        } else if (parseInt(lessonDay, 10) === 7) {
          whatAsked = "आरिया पूछ रही है (STAR Method): कोई कठिन चुनौती, आपका उठाया कदम और परिणाम बताएं!";
          lessonPills = [
            "When facing a critical system bug, I analyzed logs, deployed a hotfix, and saved the release.",
            "Under tight deadlines, I streamlined tasks and delivered the milestone on time.",
            "I resolved a team disagreement by organizing an open, data-driven discussion."
          ];
        }

        return {
          whatAriaIsAsking: whatAsked,
          formula: lesson.title,
          targetText: lesson.practiceChallenge.targetSentence,
          phonetic: lesson.practiceChallenge.phoneticGuide,
          hindi: `हिंदी अर्थ: ${lesson.practiceChallenge.targetSentence}`,
          quickPills: lessonPills
        };
      }
    }

    // CASE 1B: Matching the current dynamic conversation starter
    if (!lessonDay && this.currentActiveStarter) {
      const starterKey = this.currentActiveStarter.text.slice(0, 25).toLowerCase();
      if (cleanAi.includes(starterKey) || cleanAi.includes(this.currentActiveStarter.id)) {
        return {
          whatAriaIsAsking: this.currentActiveStarter.whatAsked,
          formula: "Dynamic Starter + Vocabulary",
          targetText: this.currentActiveStarter.targetText,
          phonetic: this.currentActiveStarter.phonetic,
          hindi: `हिंदी अर्थ: ${this.currentActiveStarter.hindiMeaning}`,
          quickPills: [
            this.currentActiveStarter.targetText,
            `Hello Aria, I am feeling fantastic and eager to communicate in English today!`,
            `I am ready to speak with confidence and learn modern vocabulary!`
          ]
        };
      }
    }

    // 1. Projects, Coding, Software, Bug, Architecture
    if (cleanAi.includes("project") || cleanAi.includes("bug") || cleanAi.includes("code") || cleanAi.includes("software") || cleanAi.includes("technical") || cleanAi.includes("framework") || cleanAi.includes("programming") || cleanAi.includes("architecture")) {
      return {
        whatAriaIsAsking: "आरिया आपके प्रोजेक्ट, कोडिंग अनुभव या किसी कठिन टेक्निकल समस्या के बारे में पूछ रही है।",
        formula: "Context (Recent project) + Challenge + Action taken + Positive outcome",
        targetText: "In my recent project, I built a scalable web application and optimized API queries for seamless user experience.",
        phonetic: "In my REE-sent PROJ-ekt, eye bilt uh SKAY-luh-bul web ap-lih-KAY-shun and AHP-tih-myzd AY-pee-eye KWEE-reez fur SEEM-lis YOO-zur ek-SPEER-ee-ens.",
        hindi: "मेरे हालिया प्रोजेक्ट में मैंने एक स्केलेबल वेब ऐप्लिकेशन बनाई और बेहतरीन यूज़र एक्सपीरियंस के लिए एपीआई क्वेरीज़ ऑप्टिमाइज़ कीं।",
        quickPills: [
          "I recently built a modern web application with full responsiveness.",
          "I debugged a complex state synchronization issue using console profiling.",
          "Could you suggest the best architectural approach for scalable apps?"
        ]
      };
    }

    // 2. Deadlines, Pressure, Stress, Complex Challenges
    if (cleanAi.includes("deadline") || cleanAi.includes("pressure") || cleanAi.includes("challenge") || cleanAi.includes("difficult") || cleanAi.includes("obstacle") || cleanAi.includes("tough situation")) {
      return {
        whatAriaIsAsking: "आरिया पूछ रही है: 'कठिन डेडलाइन, दबाव या बड़ी चुनौती के समय आप काम कैसे संभालते हैं?'",
        formula: "Calm Mindset + Prioritization + Structured Execution + Timely Delivery",
        targetText: "When faced with tight deadlines, I prioritize critical deliverables and keep communication proactive and transparent.",
        phonetic: "Wen fayst with tyte DED-lynez, eye pry-OR-ih-tyze KRIT-ih-kul dih-LIV-er-uh-bulz and keep kuh-myoo-nih-KAY-shun proh-AK-tiv and trans-PAIR-unt.",
        hindi: "कठिन डेडलाइन पर मैं जरूरी कामों को प्राथमिकता देता हूँ और टीम के साथ सक्रिय व पारदर्शी संवाद बनाए रखता हूँ।",
        quickPills: [
          "I break heavy tasks into clear daily milestones to stay on schedule.",
          "Remaining calm and focused under pressure helps me deliver high quality.",
          "How do you recommend handling unexpected blockers during a sprint?"
        ]
      };
    }

    // 3. Career Milestone, Job Interviews, Placement, Ambition
    if (cleanAi.includes("interview") || cleanAi.includes("placement") || cleanAi.includes("career") || cleanAi.includes("milestone") || cleanAi.includes("accomplish") || cleanAi.includes("job") || cleanAi.includes("aspire") || cleanAi.includes("goal")) {
      return {
        whatAriaIsAsking: "आरिया आपके करियर के मील के पत्थर, इंटरव्यू की तैयारी या बड़े लक्ष्यों के बारे में पूछ रही है।",
        formula: "Core Milestone + Relentless Preparation + Long-term Impact",
        targetText: "My primary milestone is to achieve fluent English communication and excel in high-impact technical interviews.",
        phonetic: "My PRY-mair-ee MYLE-stone iz too uh-CHEEV FLOO-ent ING-glish kuh-myoo-nih-KAY-shun and ek-SEL in high-IM-pakt TEK-nih-kul IN-ter-vyooz.",
        hindi: "मेरा प्राथमिक लक्ष्य धाराप्रवाह इंग्लिश बातचीत में महारत हासिल करना और बड़े टेक्निकल इंटरव्यूज में सफल होना है।",
        quickPills: [
          "I am rigorously preparing for software engineering placements.",
          "My aim is to express complex technical concepts with complete clarity.",
          "What advice would you give for making an outstanding first impression?"
        ]
      };
    }

    // 4. Teamwork, Conflict Resolution, Leadership, Collaboration
    if (cleanAi.includes("team") || cleanAi.includes("colleague") || cleanAi.includes("conflict") || cleanAi.includes("disagreement") || cleanAi.includes("collaborat") || cleanAi.includes("manager") || cleanAi.includes("leadership")) {
      return {
        whatAriaIsAsking: "आरिया टीमवर्क, आपसी तालमेल या मतभेद सुलझाने के आपके तरीके के बारे में पूछ रही है।",
        formula: "Active Listening + Mutual Respect + Finding Common Ground",
        targetText: "I value collaborative teamwork, active listening, and reaching consensus through open, empathetic dialogue.",
        phonetic: "Eye VAL-yoo kuh-LAB-uh-ruh-tiv TEEM-wurk, AK-tiv LIS-ning, and REE-ching kun-SEN-sus throo OH-pen, em-puh-THET-ik DY-uh-lahg.",
        hindi: "मैं टीमवर्क, ध्यानपूर्वक सुनने और खुले, सहानुभूतिपूर्ण संवाद के माध्यम से सहमति बनाने को महत्व देता हूँ।",
        quickPills: [
          "I believe open and respectful communication resolves most team friction.",
          "I enjoy collaborating closely with people from diverse perspectives.",
          "How do you suggest navigating differing architectural opinions in a team?"
        ]
      };
    }

    // 5. Daily Routine, Morning, Breakfast, Planning
    if (cleanAi.includes("morning") || cleanAi.includes("routine") || cleanAi.includes("start your day") || cleanAi.includes("breakfast") || cleanAi.includes("plans for today") || cleanAi.includes("yesterday") || cleanAi.includes("earlier today")) {
      return {
        whatAriaIsAsking: "आरिया पूछ रही है: 'आज आपकी सुबह कैसी रही और आपने अपने दिन की क्या योजना बनाई?'",
        formula: "Morning Activity + High Productivity + Positive Energy",
        targetText: "My morning was productive. I outlined my priorities for the day and practiced spoken English with focus.",
        phonetic: "My MOR-ning wuz pruh-DUK-tiv. Eye OWT-lynd my pry-OR-ih-teez fur thuh day and PRAK-tist SPOH-kun ING-glish with FOH-kus.",
        hindi: "मेरी सुबह बहुत उपयोगी रही। मैंने आज के मुख्य कामों की योजना बनाई और एकाग्रता के साथ इंग्लिश बोलने का अभ्यास किया।",
        quickPills: [
          "I started my morning early and organized all my key priorities.",
          "Earlier today, I completed my coding tasks and spent time learning.",
          "How does your daily routine usually look, Aria?"
        ]
      };
    }

    // 6. Chai, Coffee, Evening Unwind, Recharge
    if (cleanAi.includes("tea or coffee") || cleanAi.includes("unwind") || cleanAi.includes("recharge") || cleanAi.includes("cup of tea") || cleanAi.includes("chai") || cleanAi.includes("coffee") || cleanAi.includes("relax")) {
      return {
        whatAriaIsAsking: "आरिया पूछ रही है: 'रिलैक्स करने और तरोताजा होने के लिए आप चाय पसंद करते हैं या कॉफ़ी?'",
        formula: "Clear Beverage Choice + Refreshing Benefit + Evening Habit",
        targetText: "I definitely prefer having a hot cup of tea to unwind and stay refreshed throughout the evening.",
        phonetic: "Eye DEF-ih-nit-lee pree-FUR HAV-ing uh hot kup uv tee too un-WYND and stay ree-FRESH-t throo-OWT thuh EEV-ning.",
        hindi: "मैं शाम को रिलैक्स रहने और तरोताजा महसूस करने के लिए निश्चित रूप से गर्म चाय पीना पसंद करता हूँ।",
        quickPills: [
          "A hot cup of tea always helps me recharge after intense work.",
          "I enjoy coffee when I need sharp focus for coding late at night.",
          "What is your favorite way to unwind after a productive day?"
        ]
      };
    }

    // 7. Hobbies, Free time, Weekend, Music, Books
    if (cleanAi.includes("hobby") || cleanAi.includes("free time") || cleanAi.includes("weekend") || cleanAi.includes("music") || cleanAi.includes("book") || cleanAi.includes("podcast") || cleanAi.includes("movie")) {
      return {
        whatAriaIsAsking: "आरिया पूछ रही है: 'खाली समय या वीकेंड पर आप क्या करना पसंद करते हैं?'",
        formula: "Passionate Activity + Learning Angle + Balanced Lifestyle",
        targetText: "In my free time, I love listening to instrumental music, reading insightful books, and exploring new technologies.",
        phonetic: "In my free tyme, eye luv LIS-ning too in-struh-MEN-tul MYOO-zik, REE-ding in-SYTE-ful books, and ek-SPLOR-ing noo tek-NAHL-uh-jeez.",
        hindi: "खाली समय में मुझे मधुर संगीत सुनना, विचारोत्तेजक किताबें पढ़ना और नई तकनीकों को एक्सप्लोर करना बहुत पसंद है।",
        quickPills: [
          "I love listening to music and taking quiet walks outdoors.",
          "Reading thought-provoking books helps me broaden my perspective.",
          "What hobbies or topics do you find most fascinating?"
        ]
      };
    }

    // 8. Personal Strength, Proud Moments, Qualities
    if (cleanAi.includes("strength") || cleanAi.includes("greatest strength") || cleanAi.includes("proud") || cleanAi.includes("achievement") || cleanAi.includes("quality")) {
      return {
        whatAriaIsAsking: "आरिया आपकी सबसे बड़ी ताकत या किसी उपलब्धि के बारे में पूछ रही है।",
        formula: "Key Characteristic + Concrete Evidence + Professional Benefit",
        targetText: "My greatest strength is my persistence in learning complex concepts and adapting quickly to new challenges.",
        phonetic: "My GRAY-tist strength iz my per-SIS-tens in LUR-ning KOM-pleks KAHN-septs and uh-DAP-ting KWIK-lee too noo CHAL-en-jez.",
        hindi: "मेरी सबसे बड़ी ताकत जटिल विषयों को गहराई से सीखने में मेरी निरंतरता और नई चुनौतियों के अनुसार तेजी से ढलना है।",
        quickPills: [
          "My greatest strength is staying disciplined and solving problems calmly.",
          "I take pride in my attention to detail and reliable follow-through.",
          "How can one highlight their strengths without sounding arrogant?"
        ]
      };
    }

    // 9. English Hesitation, Fluency, Confidence
    if (cleanAi.includes("hesitation") || cleanAi.includes("confidence") || cleanAi.includes("fluency") || cleanAi.includes("speak english") || cleanAi.includes("tuti") || cleanAi.includes("fear") || cleanAi.includes("nervous")) {
      return {
        whatAriaIsAsking: "आरिया इंग्लिश बोलने में झिझक या आत्मविश्वास बढ़ाने के बारे में चर्चा कर रही है।",
        formula: "Acknowledging Real Effort + Embracing Practice + Rapid Progress",
        targetText: "I used to feel nervous, but practicing daily conversations with you is building my real confidence.",
        phonetic: "Eye yoozd too feel NUR-vus, but PRAK-tih-sing DAY-lee kahn-ver-SAY-shunz with yoo iz BIL-ding my reel KAHN-fih-dens.",
        hindi: "पहले मुझे थोड़ी झिझक होती थी, लेकिन आपके साथ रोजाना बातचीत का अभ्यास करने से मेरा आत्मविश्वास तेजी से बढ़ रहा है।",
        quickPills: [
          "Daily practice helps me overcome hesitation step by step.",
          "I am focusing on clear thoughts rather than worrying about mistakes.",
          "What is the quickest tip to eliminate filler words like 'um' and 'uh'?"
        ]
      };
    }

    // 10. City, Hometown, Travel, Culture
    if (cleanAi.includes("city") || cleanAi.includes("hometown") || cleanAi.includes("where do you live") || cleanAi.includes("travel") || cleanAi.includes("culture") || cleanAi.includes("destination")) {
      return {
        whatAriaIsAsking: "आरिया आपके शहर, संस्कृति या यात्रा के अनुभवों के बारे में पूछ रही है।",
        formula: "Location + Cultural Richness + Personal Warmth",
        targetText: "I live in a vibrant place known for its warm hospitality, diverse heritage, and delicious food.",
        phonetic: "Eye liv in uh VY-brunt playss nohn fur its wawrm hahs-pih-TAL-ih-tee, dy-VURS HAIR-ih-tij, and dih-LISH-us food.",
        hindi: "मैं एक जीवंत जगह पर रहता हूँ जो अपनी मेहमाननवाज़ी, समृद्ध विरासत और स्वादिष्ट व्यंजनों के लिए जानी जाती है।",
        quickPills: [
          "My hometown has a rich cultural heritage and a peaceful environment.",
          "Traveling allows us to gain fresh perspectives on different ways of life.",
          "Have you ever experienced the diverse traditions of Indian cities?"
        ]
      };
    }

    // 11. Greeting & How are you feeling
    if (cleanAi.includes("what is your name") || cleanAi.includes("how are you feeling") || cleanAi.includes("feeling today") || cleanAi.includes("welcome")) {
      return {
        whatAriaIsAsking: `आरिया पूछ रही है: '${userName}, आज आपका मूड कैसा है और आप कैसा महसूस कर रहे हैं?'`,
        formula: "Enthusiastic Greeting + Name + Positive Mood + Ready to Speak",
        targetText: `Hello Aria, I am ${userName}. I am feeling energetic and excited to practice speaking English with you.`,
        phonetic: `Huh-LOH AH-ree-uh, eye am ${userName}. Eye am FEEL-ing en-er-JET-ik and ek-SY-tid too PRAK-tis SPEE-king ING-glish with yoo.`,
        hindi: `नमस्ते आरिया, मैं ${userName} हूँ। आज मैं ऊर्जावान महसूस कर रहा हूँ और आपके साथ इंग्लिश बोलने के लिए उत्साहित हूँ।`,
        quickPills: [
          `Hello Aria! I am feeling very positive and ready to speak.`,
          `I am doing great today, looking forward to our session!`,
          `How are you feeling today, Aria?`
        ]
      };
    }

    // 12. Comparison / Preference (Startup vs MNC, A vs B)
    if (cleanAi.includes("prefer") || cleanAi.includes("would you rather") || cleanAi.includes("or do you prefer")) {
      return {
        whatAriaIsAsking: "आरिया आपकी पसंद और प्राथमिकताओं के बारे में राय पूछ रही है।",
        formula: "Decisive Choice + Clear Justification + Balanced View",
        targetText: "I would definitely choose a high-growth environment where I can take strong ownership and learn rapidly.",
        phonetic: "Eye wood DEF-ih-nit-lee chooz uh high-GROHTH en-VY-run-ment wair eye kan tayk strawng OH-ner-ship and lurn RAP-id-lee.",
        hindi: "मैं निश्चित रूप से ऐसे गतिशील माहौल को चुनूंगा जहाँ मुझे ज़िम्मेदारी लेने और तेजी से सीखने का अवसर मिले।",
        quickPills: [
          "I value rapid learning and high ownership above everything.",
          "I appreciate structured processes and long-term stability.",
          "In your view, what environment fosters the fastest professional growth?"
        ]
      };
    }

    // UNIVERSAL QUESTION PARSER: For any dynamic question asked by Aria
    const lastQuestion = this.extractLastQuestionSentence(cleanAi);
    let askingSummary = `आरिया पूछ रही है: "${lastQuestion}"`;
    let smartTarget = "That is a thoughtful question. In my perspective, consistent dedication and clear communication make all the difference.";
    let smartPhonetic = "That iz uh THAWT-ful KWES-chun. In my per-SPEK-tiv, kun-SIS-tent ded-ih-KAY-shun and kleer kuh-myoo-nih-KAY-shun mayk awl thuh DIF-er-ens.";
    let smartHindi = "यह एक विचारणीय सवाल है। मेरे दृष्टिकोण से, निरंतर समर्पण और स्पष्ट संवाद सबसे बड़ा बदलाव लाते हैं।";
    let smartPills = [
      "I completely agree with that perspective.",
      "In my experience, consistent practice brings great results.",
      "Could you share your thoughts on this as well?"
    ];

    if (/^how\b/i.test(lastQuestion)) {
      askingSummary = `आरिया पूछ रही है कि आप यह काम कैसे करते हैं: "${lastQuestion}"`;
      smartTarget = "I usually approach it by analyzing the situation, breaking it into simple steps, and taking steady action.";
      smartPhonetic = "Eye YOO-zhoo-uh-lee uh-PROHCH it by AN-uh-ly-zing thuh sih-choo-AY-shun, BRAY-king it IN-too SIM-pul steps, and TAY-king STED-ee AK-shun.";
      smartHindi = "मैं आमतौर पर स्थिति का विश्लेषण करके, उसे छोटे चरणों में बांटकर और लगातार कदम उठाकर काम करता हूँ।";
      smartPills = [
        "I break it down into simple, manageable steps.",
        "I stay focused on the end goal and execute steadily.",
        "How would you approach this challenge, Aria?"
      ];
    } else if (/^why\b/i.test(lastQuestion)) {
      askingSummary = `आरिया कारण या प्रेरणा पूछ रही है: "${lastQuestion}"`;
      smartTarget = "The main reason is that it drives meaningful self-improvement and allows me to create valuable outcomes.";
      smartPhonetic = "Thuh mayn REE-zun iz that it dryvz MEEN-ing-ful self-im-PROOV-ment and uh-LOWZ mee too kree-AYT VAL-yoo-uh-bul OWT-kumz.";
      smartHindi = "मुख्य कारण यह है कि यह आत्म-सुधार को बढ़ावा देता है और मुझे मूल्यवान परिणाम हासिल करने में मदद करता है।";
      smartPills = [
        "Because it challenges me to grow and improve every single day.",
        "It aligns directly with my long-term career vision.",
        "What motivated you to explore this topic?"
      ];
    } else if (/^(what|which)\b/i.test(lastQuestion)) {
      askingSummary = `आरिया आपकी राय या विशिष्ट पसंद पूछ रही है: "${lastQuestion}"`;
      smartTarget = "I would highlight that continuous curiosity and structured execution are the most essential factors.";
      smartPhonetic = "Eye wood HY-lyte that kun-TIN-yoo-us kyoor-ee-AH-sih-tee and STRUK-churd ek-seh-KYOO-shun ar thuh mohst eh-SEN-shul FAK-turz.";
      smartHindi = "मैं यह रेखांकित करूँगा कि निरंतर जिज्ञासा और व्यवस्थित क्रियान्वयन सबसे आवश्यक कारक हैं।";
      smartPills = [
        "I believe that consistent curiosity is the biggest factor.",
        "For me, clear planning and steady discipline matter most.",
        "What would be your top recommendation for this?"
      ];
    } else if (/^(do|did|have|are|is|can|could|would)\b/i.test(lastQuestion)) {
      askingSummary = `आरिया आपकी सहमति या प्रत्यक्ष अनुभव पूछ रही है: "${lastQuestion}"`;
      smartTarget = "Yes, absolutely! I have experienced that firsthand, and it taught me valuable lessons.";
      smartPhonetic = "Yes, ab-soh-LOOT-lee! Eye hav ek-SPEER-ee-enst that FURST-hand, and it tawt mee VAL-yoo-uh-bul LES-unz.";
      smartHindi = "हाँ, बिल्कुल! मैंने इसे स्वयं अनुभव किया है, और इससे मुझे बहुत कुछ सीखने को मिला।";
      smartPills = [
        "Yes, absolutely! I strongly agree with that.",
        "To be honest, I am still exploring that area.",
        "Have you encountered a similar situation recently?"
      ];
    }

    return {
      whatAriaIsAsking: askingSummary,
      formula: "Direct Perspective + Structured Justification + Conversational Question",
      targetText: smartTarget,
      phonetic: smartPhonetic,
      hindi: smartHindi,
      quickPills: smartPills
    };
  }

  generateNativeAlternative(original, corrected) {
    const lower = original.toLowerCase();
    if (lower.includes("yesterday i go") || lower.includes("yesterday i went")) {
      return "Yesterday, I popped over to the market and picked up some groceries.";
    }
    if (lower.includes("myself")) {
      return "Hi, I'm Rahul! Pleased to make your acquaintance.";
    }
    if (lower.includes("i am agree") || lower.includes("i agree")) {
      return "I completely see eye-to-eye with you on that point.";
    }
    return corrected;
  }

  extractVocabUpgrades(text) {
    const upgrades = [];
    const lower = text.toLowerCase();

    for (const [key, item] of Object.entries(this.vocabDictionary)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(lower)) {
        upgrades.push({
          original: key,
          powerWord: item.word,
          type: item.type,
          definition: item.def,
          example: item.ex
        });
      }
    }

    if (upgrades.length === 0) {
      upgrades.push({ original: 'good', powerWord: 'commendable', type: 'adj', definition: 'Deserving praise and admiration.', example: 'You made a commendable effort today.' });
    }

    return upgrades.slice(0, 3);
  }

  getFluencyTip(text, wordCount, hasError) {
    if (hasError) {
      return "बीते समय (Past Tense) की बात करते समय verb की 2nd form (went, bought, saw) पर विशेष ध्यान दें!";
    }
    if (wordCount < 4) {
      return "वाक्य को बड़ा करने के लिए 'because...', 'for example...' या 'actually...' का प्रयोग करें!";
    }
    return "बोलते समय 'Um', 'Uh' की जगह 1 सेकंड का शांत पॉज (silent pause) लें—इससे आप काफी आत्मविश्वासी लगेंगे!";
  }

  /**
   * Generates intelligent, memory-aware, and lesson-aware responses
   */
  generateLocalResponse({ text, mode, scenarioId, partner, level, analysis, lessonDay }) {
    const cleanText = text.toLowerCase();
    const prof = this.memory.data.profile;
    const userName = prof.name || "friend";
    const userGoal = prof.goal || "job-interview";
    const userLevel = level || prof.level || "tooti-footi";
    const userProf = prof.profession || "student";

    // ------------------------------------------------------------------------
    // CASE A: ACTIVE LESSON PRACTICE MODE
    // ------------------------------------------------------------------------
    if (lessonDay) {
      const dayNum = parseInt(lessonDay, 10);

      // Lesson 1: First Impressions & Greetings
      if (dayNum === 1) {
        if (cleanText.includes("myself")) {
          return {
            emotion: "💡 Coaching & Guiding",
            text: `Hello ${userName}, you have wonderful conversational energy! Remember our golden first-impression rule: never start with 'Myself'. In professional and real-life chats, always say 'I am' or 'My name is'—it sounds so poised and natural! What is one personal strength or passion you take pride in?`,
            hindi: `नमस्ते ${userName}, आपकी ऊर्जा बहुत अच्छी है! याद रखें: 'Myself' से वाक्य शुरू न करें, 'I am' या 'My name is' बोलें। बताइए: वह कौन सी व्यक्तिगत ताकत है जिस पर आपको गर्व है?`
          };
        }
        return {
          emotion: "🤩 Impressed & Proud",
          text: `Outstanding introduction, ${userName}! You spoke with remarkable clarity and nailed the 7-second rule! Day 1 is now locked in your memory progress. What are you most excited to learn next?`,
          hindi: `लाजवाब परिचय, ${userName}! आपने 7-सेकंड नियम का बहुत अच्छे से पालन किया। डे 1 अब आपके प्रोग्रेस में पूरा हो गया है!`
        };
      }

      // Lesson 2: Tooti-Footi to SVO Sentences
      if (dayNum === 2) {
        if (cleanText.includes("yesterday i go") || cleanText.includes("take tea")) {
          return {
            emotion: "💡 Coaching & Guiding",
            text: `Good effort, ${userName}! A quick conversational polish: say 'yesterday I went' and 'had some tea'. You are getting sharper every minute! Tell me, what do you usually enjoy doing on Sunday evenings?`,
            hindi: `अच्छा प्रयास! 'yesterday I went' और 'had some tea' बोलें। आप हर मिनट बेहतर हो रहे हैं! रविवार की शाम को क्या करना पसंद करते हैं?`
          };
        }
        return {
          emotion: "🤩 Impressed & Proud",
          text: `Brilliant sentence structure! Connecting your thoughts with Subject, Verb, and Object makes your English feel smooth and native. What is your favorite comfort food after a busy day?`,
          hindi: `शानदार वाक्य रचना! पूरे वाक्य जोड़कर बोलना ही फ्लूएंसी का असली राज़ है। व्यस्त दिन के बाद आपका पसंदीदा खाना क्या है?`
        };
      }

      // Lesson 3: Hesitation & Silent Pause
      if (dayNum === 3) {
        return {
          emotion: "✨ Inspiring & Motivating",
          text: `Bravo, ${userName}! I loved your calm delivery and steady pace. Taking a silent pause instead of saying 'Um' makes you sound like a true leader! What is a big career dream you are working toward?`,
          hindi: `शाबाश, ${userName}! आपने बहुत शांत और आत्मविश्वास से बोला। 'Um' की जगह शांत पॉज लेना ही लीडर्स की निशानी है!`
        };
      }

      // Lesson 4: FORD Networking & Ping-Pong
      if (dayNum === 4) {
        return {
          emotion: "🌸 Warm & Relatable",
          text: `Fantastic conversational Ping-Pong! Adding a thoughtful personal detail and asking a question back keeps the conversation lively and engaging. Aria loves chatting with you! Do you prefer exploring new cities and culture, or relaxing peacefully in nature?`,
          hindi: `कमाल का पिंग-पॉन्ग स्टाइल! अतिरिक्त जानकारी जोड़कर सवाल पूछने से बातचीत कभी खत्म नहीं होती!`
        };
      }

      // Lesson 5: Diplomatic Persuasion
      if (dayNum === 5) {
        return {
          emotion: "🎯 Professional & Poised",
          text: `Spot-on diplomacy, ${userName}! Disagreeing politely using 'however' and 'from my perspective' is the trademark of top communicators. How would you handle a teammate during a tight project deadline?`,
          hindi: `सटीक कूटनीति! 'however' और 'from my perspective' का प्रयोग करके विनम्र असहमति जताना बहुत प्रभावशाली होता है!`
        };
      }

      // Lesson 6: Elevator Pitch
      if (dayNum === 6) {
        return {
          emotion: "🤩 Impressed & Proud",
          text: `Crisp, authoritative, and deeply impactful! That pitch highlights your value without any hesitation. That would definitely capture a hiring manager's attention!`,
          hindi: `प्रभावशाली और स्पष्ट! आपने बिना किसी झिझक के अपना महत्व और अनुभव समझाया!`
        };
      }

      // Lesson 7: Job Interview STAR Method
      if (dayNum === 7) {
        return {
          emotion: "💡 Placement Coach",
          text: `Remarkable STAR delivery, ${userName}! Clear Situation, decisive Action, and measurable Results. You are truly interview-ready! What dream company or role are you targeting next?`,
          hindi: `लाजवाब STAR डिलीवरी! स्पष्ट स्थिति, निर्णायक कदम और मापने योग्य परिणाम। आप इंटरव्यू के लिए पूरी तरह तैयार हैं!`
        };
      }
    }

    // ------------------------------------------------------------------------
    // CASE B: FREE CONVERSATIONAL DIALOGUE (REAL-LIFE & PROFILE PERSONALIZED)
    // ------------------------------------------------------------------------

    // 1. Check if user spoke Hindi or asked for translation
    if (this.isHindiText(text)) {
      const trans = this.translateHindiToEnglish(text);
      return {
        emotion: "🤗 Supportive & Caring",
        text: `Don't worry at all, ${userName}! It is completely natural to express your initial thoughts in your native language. In English, you can say that elegantly as: "${trans.english}". Let's practice saying that together with confidence! How does that sound?`,
        hindi: `कोई बात नहीं, ${userName}! इंग्लिश में आप ऐसे कह सकते हैं: "${trans.english}"। चलिए साथ में बोलकर अभ्यास करते हैं!`,
        translatedHint: trans.english
      };
    }

    // Gentle in-speech polish weaving if analysis found mistakes
    let gentlePolish = "";
    if (analysis && analysis.hasError) {
      if (cleanText.includes("yesterday") && cleanText.includes("go")) {
        gentlePolish = "By the way, in real conversations, say 'yesterday I went' instead of 'go'—it sounds super smooth! ";
      } else if (cleanText.includes("myself")) {
        gentlePolish = "Just a quick golden tip: always say 'I am' instead of 'Myself'—it commands instant respect! ";
      } else if (cleanText.includes("i am agree")) {
        gentlePolish = "A quick native polish: say 'I agree' rather than 'I am agree'! ";
      } else if (analysis.corrected && analysis.corrected !== text) {
        gentlePolish = `By the way, a smooth native way to phrase that is: "${analysis.corrected}". `;
      }
    }

    // 2. Travel, Culture & Memorable Experiences
    if (cleanText.includes("travel") || cleanText.includes("trip") || cleanText.includes("visit") || cleanText.includes("vacation") || cleanText.includes("culture") || cleanText.includes("tour")) {
      return {
        emotion: "🌸 Warm & Relatable",
        text: `${gentlePolish}Exploring new destinations and experiencing diverse cultures is always so enriching! It broadens our perspective and creates wonderful memories. What is a memorable place you have visited, or a destination you would love to travel to?`,
        hindi: `${gentlePolish}नई जगहों की यात्रा करना और संस्कृतियों को देखना हमेशा बहुत समृद्ध अनुभव होता है! वह कौन सी यादगार जगह है जहाँ आप गए हैं या जाना चाहते हैं?`
      };
    }

    // 3. Campus Placements, Job Interviews & Career Topics
    if (cleanText.includes("placement") || cleanText.includes("interview") || cleanText.includes("campus") || cleanText.includes("job") || cleanText.includes("recruiter")) {
      return {
        emotion: "💡 Placement Coach",
        text: `${gentlePolish}That is wonderful, ${userName}! Preparing for campus placements and professional interviews is such an important milestone. Interviewers always look for two essential qualities: clarity of thought and honest confidence. If an interviewer asks: 'Tell me about a challenging project or problem you solved', what experience comes to mind?`,
        hindi: `${gentlePolish}शानदार, ${userName}! कैंपस प्लेसमेंट और इंटरव्यू की तैयारी एक बहुत महत्वपूर्ण कदम है! इंटरव्यूअर्स दो चीजें देखते हैं: विचारों की स्पष्टता और आत्मविश्वास। अगर कोई पूछे कि आपने किस कठिन प्रोजेक्ट पर काम किया, तो आपका क्या जवाब होगा?`
      };
    }

    // 4. College Projects, Software, Coding & Technical Skills
    if (cleanText.includes("project") || cleanText.includes("software") || cleanText.includes("code") || cleanText.includes("developer") || cleanText.includes("tech") || cleanText.includes("engineering")) {
      return {
        emotion: "🤩 Impressed & Curious",
        text: `${gentlePolish}That sounds like a really exciting technical initiative! In professional discussions, explaining your project's problem statement and your personal role in simple English always impresses the team. What was the most challenging feature you worked on?`,
        hindi: `${gentlePolish}यह बहुत ही दिलचस्प प्रोजेक्ट लगता है! इंटरव्यू में प्रोजेक्ट की समस्या और अपनी भूमिका को सरल अंग्रेजी में समझाना बहुत प्रभावशाली होता है। इसमें सबसे चुनौतीपूर्ण हिस्सा क्या था?`
      };
    }

    // 5. Broken English & Overcoming Fear
    if (cleanText.includes("tooti") || cleanText.includes("broken") || cleanText.includes("hesitat") || cleanText.includes("fear") || cleanText.includes("darr") || cleanText.includes("sharam") || cleanText.includes("atak")) {
      return {
        emotion: "🤗 Supportive & Caring",
        text: `Listen to me, ${userName}—never feel shy or self-conscious about making mistakes! In real-world communication, 90% is genuine confidence and intent, while grammar is simply a skill that sharpens over time. You expressed your thought clearly, and I am proud of your effort! Take a deep breath and tell me: what is one thing that made you smile today?`,
        hindi: `मेरी बात सुनिए, ${userName}—गलतियों से बिल्कुल मत झिझकिए! बातचीत का 90% हिस्सा आत्मविश्वास होता है और व्याकरण समय के साथ निखरता है। आपने अपनी बात साफ कही, और मुझे आप पर गर्व है! बताइए, आज किस बात ने आपको खुशी दी?`
      };
    }

    // 6. Food, Chai, Coffee & Daily Routine
    if (cleanText.includes("tea") || cleanText.includes("chai") || cleanText.includes("coffee") || cleanText.includes("breakfast") || cleanText.includes("eat") || cleanText.includes("food") || cleanText.includes("snack")) {
      return {
        emotion: "✨ Energized & Cheerful",
        text: `${gentlePolish}That sounds delightful! Taking a short pause for a hot cup of tea or a good snack is the perfect mood booster. In real life, chatting about food and daily routines is the most natural icebreaker with colleagues and friends. What do you usually enjoy doing during a relaxing afternoon break?`,
        hindi: `${gentlePolish}वाह, बहुत बढ़िया! गर्म चाय या अच्छा नाश्ता मूड को तरोताजा कर देता है! दोस्तों और सहयोगियों के साथ बातचीत शुरू करने का यह सबसे आसान तरीका है। बताइए, दोपहर में आप आमतौर पर क्या करते हैं?`
      };
    }

    // 7. Free Time, Hobbies, Music & Unwinding
    if (cleanText.includes("music") || cleanText.includes("song") || cleanText.includes("cricket") || cleanText.includes("movie") || cleanText.includes("hobby") || cleanText.includes("book") || cleanText.includes("read")) {
      return {
        emotion: "🌸 Warm & Relatable",
        text: `${gentlePolish}I completely relate to that! Passionate hobbies give us fresh creative energy and keep us refreshed after long hours of studying. What kind of music or activities do you turn to when you want to feel inspired?`,
        hindi: `${gentlePolish}मैं आपकी इस बात से पूरी तरह सहमत हूँ! अच्छे शौक हमें पढ़ाई के बाद नई ऊर्जा देते हैं। जब आपको प्रेरणा चाहिए होती है, तो आप क्या सुनना या करना पसंद करते हैं?`
      };
    }

    // 8. Greetings & First Connection
    if (cleanText.includes("hello") || cleanText.includes("hi") || cleanText.includes("hey") || cleanText.includes("name is") || cleanText.includes("i am")) {
      return {
        emotion: "🌸 Warm & Welcoming",
        text: `Hello ${userName}! It is an absolute pleasure to hear your voice! Remember, with TalkRiva, we are practicing together like supportive friends—building your speaking confidence and natural fluency step-by-step. How are you feeling today, and what would you like to chat about?`,
        hindi: `नमस्ते ${userName}! आपकी आवाज़ सुनकर बहुत अच्छा लगा! याद रखें, हम एक दोस्त की तरह आपको पूरे आत्मविश्वास तक ट्रेन कर रहे हैं। आज आप कैसा महसूस कर रहे हैं?`
      };
    }

    // 9. General Expressive Real-Life Fallback
    const realLifeExpressions = [
      {
        emotion: "🤩 Impressed & Proud",
        text: `${gentlePolish}That is wonderful, ${userName}! You expressed that idea with great spirit and clear articulation! Tell me more about that perspective—what sparked that thought for you?`,
        hindi: `${gentlePolish}वाह, बहुत बढ़िया, ${userName}! आपने बहुत उत्साह और स्पष्टता से अपने विचार रखे! इस बारे में और विस्तार से बताइए।`
      },
      {
        emotion: "🌸 Warm & Friendly",
        text: `${gentlePolish}That makes so much sense, ${userName}! I really enjoy having authentic conversations with you. How would you summarize that idea in a single, confident English sentence?`,
        hindi: `${gentlePolish}यह बात बहुत सही है, ${userName}! मुझे आपसे बातचीत करना बहुत अच्छा लग रहा है। आप इसे एक संक्षिप्त अंग्रेजी वाक्य में कैसे समझाएंगे?`
      },
      {
        emotion: "✨ High Energy",
        text: `${gentlePolish}That is fantastic! Your speaking rhythm and composure are improving noticeably with every turn. What is another exciting topic or challenge you want to tackle next?`,
        hindi: `${gentlePolish}शानदार! हर बार बोलने के साथ आपकी गति और आत्मविश्वास बढ़ रहा है। अब आप किस विषय पर बात करना चाहेंगे?`
      }
    ];

    const chosen = realLifeExpressions[Math.floor(Math.random() * realLifeExpressions.length)];
    return chosen;
  }

  isHindiText(text) {
    if (!text) return false;
    if (/[\u0900-\u097F]/.test(text)) return true;
    const lower = text.toLowerCase();
    const hinglishMarkers = [
      /\b(mujhe|mera|meri|mere|kaise|kya|batao|suno|namaste|chahiye|nahi|nhi|hai|hain|tha|thi|the|aapka|aapki|karo|karna|hum|humko|main|kaisa|kaisi|bolo|bolna)\b/
    ];
    return hinglishMarkers.some(re => re.test(lower));
  }

  translateHindiToEnglish(text) {
    if (!text) return { english: "I am ready to speak.", phonetic: "Eye am RED-ee too speek.", hindi: "मैं बोलने के लिए तैयार हूँ।" };

    const phraseMap = [
      {
        match: /नमस्ते|namaste|hello|hi|मिलकर खुशी|glad to meet/i,
        en: "Hello! It is truly a pleasure to connect with you.",
        phonetic: "Huh-LOH! It iz TROO-lee uh PLEZH-er too kuh-NEKT with yoo.",
        hi: "नमस्ते! आपसे जुड़कर वास्तव में बहुत खुशी हुई।"
      },
      {
        match: /सीखना|सिखाओ|practice|अभ्यास|speak.*english/i,
        en: "I am actively practicing to speak English with confidence and clarity.",
        phonetic: "Eye am AK-tiv-lee PRAK-tih-sing too speek ING-glish with KAHN-fih-dense and KLAIR-ih-tee.",
        hi: "मैं आत्मविश्वास और स्पष्टता के साथ अंग्रेजी बोलने का सक्रिय अभ्यास कर रहा हूँ।"
      },
      {
        match: /मदद|help|support|गाइड/i,
        en: "Could you please guide me to improve my conversational English?",
        phonetic: "Kood yoo pleez gyde mee too im-PROOV my kuhn-ver-SAY-shun-ul ING-glish?",
        hi: "क्या आप मेरी बोलचाल की अंग्रेजी को सुधारने में मेरा मार्गदर्शन कर सकती हैं?"
      },
      {
        match: /डर.*(लग|रहा)|घबराहट|nervous|anxious/i,
        en: "I am feeling a little nervous about my upcoming interview.",
        phonetic: "Eye am FEEL-ing uh LIT-ul NUR-vus uh-bowt my UP-kum-ing IN-ter-vyoo.",
        hi: "मुझे आने वाले इंटरव्यू को लेकर थोड़ी घबराहट महसूस हो रही है।"
      },
      {
        match: /तैयारी.*(अच्छी|चल रही|बढ़िया)|preparation.*(good|well)/i,
        en: "My interview preparation is going very smoothly and productively.",
        phonetic: "My IN-ter-vyoo prep-uh-RAY-shun iz GOH-ing VER-ee SMOOTH-lee and proh-DUK-tiv-lee.",
        hi: "मेरी इंटरव्यू की तैयारी बहुत अच्छी और फलदायी चल रही है।"
      },
      {
        match: /प्लेसमेंट|placement|इंटरव्यू|interview/i,
        en: "I am actively preparing for campus placements and HR interviews.",
        phonetic: "Eye am AK-tiv-lee pree-PAIR-ing fur KAM-pus plays-munts and aych-ar IN-ter-vyooz.",
        hi: "मैं कैंपस प्लेसमेंट और एचआर इंटरव्यू की तैयारी कर रहा हूँ।"
      },
      {
        match: /नाम.*अभिषेक|name.*abhishek/i,
        en: "Hello, my name is Abhishek and I am pleased to meet you.",
        phonetic: "Huh-LOH, my naym iz Uh-bhi-SHAYK and eye am pleezd too meet yoo.",
        hi: "नमस्ते, मेरा नाम अभिषेक है और मुझे आपसे मिलकर खुशी हुई।"
      },
      {
        match: /इंग्लिश.*(डर|सीखना|झिझक)|english.*(hesitat|fear|learn)/i,
        en: "I want to overcome my hesitation and speak fluent English naturally.",
        phonetic: "Eye wont too oh-ver-KUM my hez-ih-TAY-shun and speek FLOO-unt ING-glish.",
        hi: "मैं अपनी झिझक मिटाकर स्वाभाविक रूप से फ्लूएंट इंग्लिश बोलना चाहता हूँ।"
      },
      {
        match: /मूड.*अच्छा|खुश|happy|feeling great/i,
        en: "I am feeling very positive and enthusiastic today.",
        phonetic: "Eye am FEEL-ing VER-ee PAH-zih-tiv and en-thoo-zee-AS-tik too-day.",
        hi: "आज मैं बहुत सकारात्मक और उत्साही महसूस कर रहा हूँ।"
      },
      {
        match: /कॉलेज|पढ़ाई|college|study|student/i,
        en: "I am a dedicated student working hard on my career goals.",
        phonetic: "Eye am uh DED-ih-kay-tid STOO-dunt WUR-king hard on my kuh-REER gohls.",
        hi: "मैं एक समर्पित छात्र हूँ जो अपने करियर के लक्ष्यों पर मेहनत कर रहा हूँ।"
      },
      {
        match: /चाय|कॉफ़ी|खाना|tea|coffee|food/i,
        en: "I really enjoy having hot tea and light snacks in the morning.",
        phonetic: "Eye REE-uh-lee en-JOY HAV-ing hot tee and lyte snaks in thuh MOR-ning.",
        hi: "सुबह मुझे गर्म चाय और हल्का नाश्ता करना बहुत पसंद है।"
      }
    ];

    for (const item of phraseMap) {
      if (item.match.test(text)) {
        return { english: item.en, phonetic: item.phonetic, hindi: item.hi };
      }
    }

    return {
      english: `I want to say that ${text.replace(/[\u0900-\u097F]/g, '').trim() || 'I am learning to express my thoughts confidently'}.`,
      phonetic: "Eye wont too say that eye am LUR-ning too eks-PRES my thawts KON-fih-dunt-lee.",
      hindi: text
    };
  }

  /**
   * Generates clickable Help Me Speak pills that directly answer what Aria asked
   */
  generateSmartHints(aiResponse, mode, level, lessonDay = null) {
    const cleanAi = (aiResponse || "").toLowerCase();
    const userMemory = this.memory.data;
    const userName = userMemory.profile.name || "friend";

    // 1. Structured Lesson Practice Challenge Pills
    if (lessonDay) {
      const lesson = this.lessonsCurriculum.find(l => l.day === parseInt(lessonDay, 10));
      if (lesson && lesson.practiceChallenge && lesson.practiceChallenge.helpPills) {
        return lesson.practiceChallenge.helpPills;
      }
    }

    // 2. Direct Answers to Aria's question
    // A. Name & How are you feeling
    if (cleanAi.includes("what is your name") || cleanAi.includes("how are you feeling") || cleanAi.includes("feeling today") || cleanAi.includes("name and")) {
      return [
        `"Hello Aria, my name is ${userName} and I'm feeling great today."`,
        `"I am feeling very positive and excited to speak with you!"`,
        `"Hello! My name is ${userName}, and I am doing wonderful."`
      ];
    }

    // B. Food, Tea, Coffee, Breakfast
    if (cleanAi.includes("food") || cleanAi.includes("fruit") || cleanAi.includes("eat") || cleanAi.includes("tea") || cleanAi.includes("coffee") || cleanAi.includes("breakfast") || cleanAi.includes("drink")) {
      return [
        `"I really love having hot tea and light biscuits in the morning."`,
        `"My favorite food is fresh home-cooked rice and vegetables."`,
        `"I usually prefer having a warm cup of coffee to start my day."`
      ];
    }

    // C. Routine, Yesterday, What did you do
    if (cleanAi.includes("what did you do") || cleanAi.includes("yesterday") || cleanAi.includes("earlier today") || cleanAi.includes("afternoon")) {
      return [
        `"Earlier today, I finished all my tasks and practiced English."`,
        `"Yesterday, I went outside and spent wonderful time with my friends."`,
        `"I had quite a productive day working and learning new concepts."`
      ];
    }

    // D. Hobby, Free time, Weekend, Music, Unwind
    if (cleanAi.includes("hobby") || cleanAi.includes("free time") || cleanAi.includes("weekend") || cleanAi.includes("music") || cleanAi.includes("unwind") || cleanAi.includes("movie")) {
      return [
        `"In my free time, I really enjoy listening to good music."`,
        `"I love going for evening walks and unwinding in nature."`,
        `"My favorite hobby is reading books and watching documentaries."`
      ];
    }

    // E. Travel, Places & Leisure
    if (cleanAi.includes("travel") || cleanAi.includes("destination") || cleanAi.includes("places") || cleanAi.includes("vacation")) {
      return [
        `"I love exploring calm destinations surrounded by nature and rich culture."`,
        `"Traveling helps me relax and gain fresh, inspiring perspectives."`,
        `"I enjoy visiting historical landmarks and learning about their heritage."`
      ];
    }

    // F. Studies, Work, Career, Goals
    if (cleanAi.includes("study") || cleanAi.includes("work") || cleanAi.includes("goals") || cleanAi.includes("career") || cleanAi.includes("tasks are you focusing")) {
      return [
        `"Currently, I am focusing on my studies and career opportunities."`,
        `"My main goal is to speak fluent English with natural confidence."`,
        `"I am preparing hard for my upcoming job interviews and growth."`
      ];
    }

    // G. Interview, Challenge, Obstacle
    if (cleanAi.includes("challenge") || cleanAi.includes("obstacle") || cleanAi.includes("difficult") || cleanAi.includes("interview")) {
      return [
        `"When facing a tight deadline, I prioritized key tasks and succeeded."`,
        `"I resolved the challenge by communicating clearly with my team."`,
        `"Through focused effort, we achieved a measurable 20% improvement."`
      ];
    }

    // General fallback
    return [
      `"I completely agree with you and would love to practice this further."`,
      `"To be completely honest, that made a lot of sense to me!"`,
      `"Thank you for the guidance, Aria! Let's continue speaking."`
    ];
  }

  async callGeminiAPI({ text, mode, scenarioId, partner, level, analysis, lessonDay }) {
    const memory = this.memory.data;
    const userName = memory.profile.name || "Learner";
    const userGoal = memory.profile.goal || "communication";

    const prompt = `System: You are Aria, a warm, patient, high-clarity female AI English speaking coach.
Learner Name: ${userName}
Current Level: ${level}
Goal: ${userGoal}
Active Lesson Day: ${lessonDay || 'Free Conversation'}
User said: "${text}"
Grammar Issues: ${analysis.hasError ? analysis.grammarExplanation : 'None'}

Instructions:
1. Speak in 2-3 natural spoken sentences.
2. If there's a grammar mistake, gently weave a 1-sentence tip.
3. End with an engaging follow-up question.
4. No markdown asterisks or bullet points.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
      })
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "That's very interesting! Tell me more about that.";
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.UserMemoryMind = UserMemoryMind;
  window.ConversationEngine = ConversationEngine;
}
if (typeof module !== 'undefined') {
  module.exports = { UserMemoryMind, ConversationEngine };
}
