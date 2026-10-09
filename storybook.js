(() => {
  const pages = Array.from(document.querySelectorAll('.story-page'));
  const previousButton = document.getElementById('previous-page');
  const nextButton = document.getElementById('next-page');
  const currentPageLabel = document.getElementById('current-page');
  const nextLabel = document.getElementById('next-label');
  const languageButton = document.getElementById('language-toggle');
  const fullscreenButton = document.getElementById('fullscreen-toggle');
  const stage = document.getElementById('book-stage');
  const progressDots = Array.from(document.querySelectorAll('[data-page-target]'));
  const storyToggle = document.getElementById('story-toggle');
  const storyExpansion = document.getElementById('story-expansion');
  const replyArea = document.getElementById('reply-area');
  const replyComplete = document.getElementById('reply-complete');
  const conversationThread = document.getElementById('conversation-thread');
  const groupActivity = document.getElementById('group-activity');
  const onlineLabel = document.querySelector('#online-indicator span');
  const replyCopy = {
    alliance: {
      en: 'Honestly, I missed you all more than the alliance 😅',
      zh: '说真的，比起午休联盟，我更想你们了 😅',
    },
    ask: {
      en: 'Please do. I need the full recruitment story 😂',
      zh: '快去问！我需要完整的挖人故事 😂',
    },
  };
  let currentIndex = 0;
  let language = 'en';
  let animating = false;
  let animationTimer;

  const labels = {
    en: {
      previous: 'Previous page',
      next: 'Next page',
      page: 'Go to page',
      turn: 'Turn the page',
      continue: 'See the group chat',
      replay: 'Replay the story',
      switchLanguage: 'Switch to Chinese',
      fullscreen: 'Toggle fullscreen',
      fullscreenExit: 'Exit fullscreen',
      readStory: 'Read the story',
      closeStory: 'Close the story',
      repliedActivity: 'Messages just now · the group is chatting',
      quietActivity: '4 friends · quiet for 3 months',
      repliedOnline: '4 friends · chatting',
      quietOnline: '4 friends',
      completion: 'The group is talking again.',
      you: 'You',
    },
    zh: {
      previous: '上一页',
      next: '下一页',
      page: '前往第',
      turn: '翻开下一页',
      continue: '看看群聊怎么接话',
      replay: '重播这个故事',
      switchLanguage: '切换到英文',
      fullscreen: '进入全屏',
      fullscreenExit: '退出全屏',
      readStory: '展开故事',
      closeStory: '收起故事',
      repliedActivity: '刚刚有新消息 · 群聊正在继续',
      quietActivity: '4 位朋友 · 群聊安静了 3 个月',
      repliedOnline: '4 位朋友 · 正在聊天',
      quietOnline: '4 位朋友',
      completion: '群聊重新热闹起来了。',
      you: '你',
    },
  };

  function setBilingualText(element, en, zh) {
    if (!element) return;
    element.dataset.en = en;
    element.dataset.zh = zh;
    element.textContent = language === 'en' ? en : zh;
  }

  function applyLanguage() {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
      element.textContent = language === 'en' ? element.dataset.en : element.dataset.zh;
    });
    const copy = labels[language];
    languageButton.textContent = language === 'en' ? '中' : 'EN';
    languageButton.setAttribute('aria-label', copy.switchLanguage);
    languageButton.title = copy.switchLanguage;
    previousButton.setAttribute('aria-label', copy.previous);
    nextButton.setAttribute('aria-label', currentIndex === pages.length - 1 ? copy.replay : copy.next);
    progressDots.forEach((dot, index) => {
      dot.setAttribute('aria-label', `${copy.page} ${index + 1}${language === 'en' ? '' : ' 页'}`);
    });
    storyToggle.setAttribute('aria-expanded', String(!storyExpansion.hidden));
    storyToggle.title = storyExpansion.hidden ? copy.readStory : copy.closeStory;
    if (document.fullscreenElement) {
      fullscreenButton.setAttribute('aria-label', copy.fullscreenExit);
      fullscreenButton.title = copy.fullscreenExit;
    } else {
      fullscreenButton.setAttribute('aria-label', copy.fullscreen);
      fullscreenButton.title = copy.fullscreen;
    }
    updateNavigationText();
  }

  function updateNavigationText() {
    const copy = labels[language];
    if (currentIndex === pages.length - 1) {
      nextLabel.dataset.en = labels.en.replay;
      nextLabel.dataset.zh = labels.zh.replay;
      nextLabel.textContent = copy.replay;
    } else if (currentIndex === 3) {
      nextLabel.dataset.en = labels.en.continue;
      nextLabel.dataset.zh = labels.zh.continue;
      nextLabel.textContent = copy.continue;
    } else {
      nextLabel.dataset.en = labels.en.turn;
      nextLabel.dataset.zh = labels.zh.turn;
      nextLabel.textContent = copy.turn;
    }
    previousButton.disabled = currentIndex === 0;
    nextButton.setAttribute('aria-label', currentIndex === pages.length - 1 ? copy.replay : copy.next);
    currentPageLabel.textContent = String(currentIndex + 1).padStart(2, '0');
    progressDots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle('active', active);
      if (active) dot.setAttribute('aria-current', 'page');
      else dot.removeAttribute('aria-current');
    });
  }

  function goToPage(targetIndex) {
    if (animating || targetIndex < 0 || targetIndex >= pages.length || targetIndex === currentIndex) return;
    const direction = targetIndex > currentIndex ? 'forward' : 'backward';
    const outgoing = pages[currentIndex];
    const incoming = pages[targetIndex];
    animating = true;
    window.clearTimeout(animationTimer);
    outgoing.classList.remove('active', 'turn-out-forward', 'turn-out-backward', 'turn-in-forward', 'turn-in-backward');
    outgoing.classList.add(`turn-out-${direction}`);
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.hidden = false;
    incoming.setAttribute('aria-hidden', 'false');
    incoming.classList.remove('turn-out-forward', 'turn-out-backward', 'turn-in-forward', 'turn-in-backward');
    incoming.classList.add('active', `turn-in-${direction}`);
    currentIndex = targetIndex;
    updateNavigationText();

    animationTimer = window.setTimeout(() => {
      outgoing.hidden = true;
      outgoing.classList.remove(`turn-out-${direction}`);
      incoming.classList.remove(`turn-in-${direction}`);
      animating = false;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 520);
  }

  function makeMessage({ sender, en, zh, outgoing = false }) {
    const message = document.createElement('div');
    message.className = `message dynamic-message ${outgoing ? 'message-outgoing' : 'message-incoming'}`;
    const senderLabel = document.createElement('span');
    senderLabel.className = 'message-sender';
    senderLabel.dataset.en = outgoing ? 'You' : 'Mina';
    senderLabel.dataset.zh = outgoing ? '你' : 'Mina';
    senderLabel.textContent = outgoing ? labels[language].you : sender;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.dataset.en = en;
    bubble.dataset.zh = zh;
    bubble.textContent = language === 'en' ? en : zh;
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = outgoing ? '8:42 PM' : '8:43 PM';
    message.append(senderLabel, bubble, time);
    return message;
  }

  function chooseReply(choice) {
    if (!replyArea || !replyArea.contains(choice)) return;
    const replyType = choice.dataset.reply;
    const selectedText = choice.querySelector('[data-en][data-zh]');
    const selected = {
      en: selectedText.dataset.en,
      zh: selectedText.dataset.zh,
    };
    const response = replyCopy[replyType] || replyCopy.alliance;
    conversationThread.append(
      makeMessage({ sender: labels[language].you, en: selected.en, zh: selected.zh, outgoing: true }),
      makeMessage({ sender: 'Mina', en: response.en, zh: response.zh }),
    );
    replyArea.hidden = true;
    replyComplete.hidden = false;
    setBilingualText(groupActivity, labels.en.repliedActivity, labels.zh.repliedActivity);
    setBilingualText(onlineLabel, labels.en.repliedOnline, labels.zh.repliedOnline);
    setBilingualText(document.getElementById('reply-complete-label'), labels.en.completion, labels.zh.completion);
  }

  function resetReply() {
    conversationThread.querySelectorAll('.dynamic-message').forEach((message) => message.remove());
    replyArea.hidden = false;
    replyComplete.hidden = true;
    setBilingualText(groupActivity, labels.en.quietActivity, labels.zh.quietActivity);
    setBilingualText(onlineLabel, labels.en.quietOnline, labels.zh.quietOnline);
  }

  function resetStory() {
    storyExpansion.hidden = true;
    storyToggle.setAttribute('aria-expanded', 'false');
    document.getElementById('story-toggle-label').textContent = labels[language].readStory;
    resetReply();
  }

  previousButton.addEventListener('click', () => goToPage(currentIndex - 1));
  nextButton.addEventListener('click', () => {
    if (currentIndex === pages.length - 1) {
      resetStory();
      goToPage(0);
    } else {
      goToPage(currentIndex + 1);
    }
  });
  progressDots.forEach((dot) => dot.addEventListener('click', () => goToPage(Number(dot.dataset.pageTarget))));
  languageButton.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    applyLanguage();
  });

  storyToggle.addEventListener('click', () => {
    storyExpansion.hidden = !storyExpansion.hidden;
    storyToggle.setAttribute('aria-expanded', String(!storyExpansion.hidden));
    const label = document.getElementById('story-toggle-label');
    label.textContent = storyExpansion.hidden ? labels[language].readStory : labels[language].closeStory;
    label.dataset.en = storyExpansion.hidden ? labels.en.readStory : labels.en.closeStory;
    label.dataset.zh = storyExpansion.hidden ? labels.zh.readStory : labels.zh.closeStory;
  });
  document.getElementById('report-continue').addEventListener('click', () => goToPage(4));
  document.querySelectorAll('[data-reply]').forEach((button) => button.addEventListener('click', () => chooseReply(button)));
  document.getElementById('reset-reply').addEventListener('click', resetReply);
  document.getElementById('replay-story').addEventListener('click', () => {
    resetStory();
    goToPage(0);
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      fullscreenButton.title = language === 'en' ? 'Fullscreen is unavailable in this browser' : '当前浏览器无法进入全屏';
    }
  });
  document.addEventListener('fullscreenchange', applyLanguage);

  window.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      if (currentIndex === pages.length - 1) {
        resetStory();
        goToPage(0);
      } else goToPage(currentIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goToPage(currentIndex - 1);
    } else if (event.key === 'Home') {
      goToPage(0);
    } else if (event.key === 'End') {
      goToPage(pages.length - 1);
    } else if (event.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen();
    }
  });

  updateNavigationText();
  applyLanguage();
  if (stage) stage.setAttribute('tabindex', '0');
})();
