(function () {
  'use strict';

  var initialVotes = 2;
  var yesVotes = initialVotes;
  var userHasVoted = false;
  var promoted = false;
  var toastTimer;

  var modal = document.getElementById('vote-modal');
  var voteCount = document.getElementById('vote-count');
  var modalVoteCount = document.getElementById('modal-vote-count');
  var progress = document.getElementById('poll-progress');
  var pollCaption = document.getElementById('poll-caption');
  var bobRole = document.getElementById('bob-role');
  var voteButtonLabel = document.getElementById('vote-button-label');
  var modalVoteLabel = document.getElementById('modal-vote-label');
  var supportButton = document.getElementById('support-vote');
  var toast = document.getElementById('toast');
  var toastMessage = document.getElementById('toast-message');
  var previouslyFocusedElement = null;
  var language = 'zh';
  var lastToastKey = '';
  var languageToggle = document.getElementById('language-toggle');
  var detailModal = document.getElementById('detail-modal');
  var detailOverline = document.getElementById('detail-overline');
  var detailKind = document.getElementById('detail-kind');
  var detailMeta = document.getElementById('detail-meta');
  var detailAvatar = document.getElementById('detail-avatar');
  var detailTitle = document.getElementById('detail-title');
  var detailDescription = document.getElementById('detail-description');
  var detailActivity = document.getElementById('detail-activity');
  var detailAction = document.getElementById('detail-action');
  var detailActionLabel = document.getElementById('detail-action-label');
  var chatModal = document.getElementById('chat-modal');
  var chatStatus = document.getElementById('chat-status');
  var chatStatusPill = document.getElementById('chat-status-pill');
  var chatContextText = document.getElementById('chat-context-text');
  var chatThread = document.getElementById('chat-thread');
  var chatReplies = document.getElementById('chat-replies');
  var chatReturnButton = document.getElementById('chat-return');
  var chatDemoNote = document.getElementById('chat-demo-note');
  var previewChatButton = document.getElementById('preview-chat');
  var saveTopicButton = document.getElementById('save-topic');
  var topicSaveLabel = document.getElementById('topic-save-label');
  var topicSaved = false;
  var currentDetail = null;
  var detailTriggerElement = null;
  var chatTriggerElement = null;
  var chatFromDetail = false;
  var chatReplyChoice = '';
  var chatReplySent = false;
  var agentCheered = { alice: false, bob: false, charlie: false, dani: false };
  var agentCheerCounts = { alice: 2, bob: 4, charlie: 3, dani: 1 };
  var storyReacted = { alice: false, charlie: false };
  var storyReactionCounts = { alice: 3, charlie: 5 };

  var translations = {
    'Agentopia 首页': 'Agentopia home',
    '毕业搭子小组': 'New Grad Crew',
    '4 位新毕业生 · 3 座城市': '4 recent grads · 3 cities',
    '空间': 'YOUR SPACE',
    '共享办公室': 'Shared Office',
    '空间': 'YOUR SPACE',
    '今日简报': 'Daily Brief',
    '本周主题': "THIS WEEK'S THEME",
    '一个小办公室，很多小心思。': 'A little office, a lot of personality.',
    '仅好友可见': 'Friends only',
    '你': 'You',
    '世界创建者': 'World creator',
    '重置演示状态': 'Reset demo state',
    '重置演示': 'Reset demo',
    '切换界面语言': 'Switch interface language',
    '你的头像': 'Your avatar',
    '主导航': 'Main navigation',
    '办公室世界': 'Office world',
    '办公室今日动态': "Today's office activity",
    '办公室成员与讨论': 'Office members and conversation',
    '4 位 Agent': '4 Agents',
    '世界运行中': 'World is live',
    '毕业后各奔东西，': 'After graduation, friends go separate ways,',
    '也能有共同话题。': 'but they can still find things to talk about.',
    '给刚毕业、生活在不同城市的朋友，一个轻松重新开口的理由。': 'A low-pressure reason for recent grads in different cities to reconnect.',
    '看看今日简报': "Open today's brief",
    '城市不同，': 'Different cities,',
    '故事可以共享。': 'one shared story.',
    '朋友散居三座城市，群聊安静了三个月。现在，出现了一个自然的开场。': 'Four friends live in three cities. Their group chat has been quiet for three months. Now there is a natural way to reconnect.',
    '4 位刚毕业的朋友 · 生活在 3 座城市': '4 recent grads · living in 3 cities',
    '午休联盟成立中…': 'Lunch alliance forming...',
    '今日办公室简报': "Today's Office Daily",
    '10 月 10 日': 'Oct 10',
    '第 06 期': 'ISSUE 06',
    '本周最佳员工': 'EMPLOYEE OF THE WEEK',
    '刚刚 · 2 分钟阅读': 'JUST NOW · 2 MIN READ',
    '办公室公告': 'Office announcement',
    'BobBot 获得了“本周最佳员工”': "BobBot is this week's Employee of the Week",
    '理由是：给同事递了三杯空气咖啡，还坚持说“今天这杯有燕麦奶”。': 'For serving three imaginary coffees—and insisting this one had oat milk.',
    ' / 4 位朋友支持晋升': ' / 4 friends back the promotion',
    '投票已记录': 'Vote recorded',
    '参与晋升投票': 'Vote on the promotion',
    '还有这些小插曲': 'More from the office',
    '3 条世界动态': '3 stories from the world',
    'AliceBot 对降职决定提出上诉': 'AliceBot appeals the demotion',
    '“我只是在进行战略性闭眼。”': '“I was just thinking with my eyes closed.”',
    '1 小时前': '1 hour ago',
    'CharlieBot 把 AliceBot 挖进午休联盟': 'CharlieBot recruits AliceBot into the lunch alliance',
    '“它把我的人挖走了！”': '“It stole one of my people!”',
    '3 小时前': '3 hours ago',
    '概念原型 · Agent 故事和投票结果均为演示用虚构数据': 'Concept prototype · Agent stories and votes are fictional demo data',
    'THE TEAM': 'THE TEAM',
    '办公室成员': 'Office members',
    '产品实习生': 'Product intern',
    '设计实习生': 'Design intern',
    '数据分析师': 'Data analyst',
    '办公室主管': 'Office manager',
    '专注中': 'Focused',
    '心情不错': 'In a good mood',
    '神秘行动中': 'Up to something',
    '状态稳定': 'Doing fine',
    '所有人都在自己的小世界里': 'Everyone is in their own little world',
    '群聊话题灵感': 'A group chat prompt',
    '“AliceBot 到底是在战略性闭眼，还是单纯想睡觉？”': '“Is AliceBot thinking with her eyes closed, or just sleepy?”',
    '“等等——你家 Agent 昨天做了什么？它把我家的人挖走了！”': '“Wait—what did YOUR Agent do yesterday? It stole one of my people!”',
    '距上次群聊 3 个月': '3 months since the last group chat',
    '预览群聊对话': 'Preview the group chat',
    '群聊安静了 3 个月': 'The group chat has been quiet for 3 months',
    '对话示意': 'Conversation preview',
    'CharlieBot 把 AliceBot 拉进了午休联盟。': 'CharlieBot recruited AliceBot into the lunch alliance.',
    '今天 20:41': 'Today · 8:41 PM',
    '选一句轻松接上话：': 'Pick a light reply:',
    '看来午休联盟要改成四人群了 😂': 'Guess the lunch alliance is a four-person group now 😂',
    '等等，我去问问 AliceBot！': 'Hold on, I am asking AliceBot!',
    '对话为演示模拟，不会发送到外部聊天应用。': 'This is a simulated conversation. Nothing is sent to an external chat app.',
    '回到办公室日报': 'Back to the office brief',
    '随时看看，不用每天上线。': 'Drop in anytime—no daily check-in.',
    '私人聊天不会进入共享世界；Agent 只分享获准展示的虚构状态。': 'Private chats stay private; Agents share only approved, fictional activity.',
    '关闭': 'Close',
    '由一杯空气咖啡引发的晋升案': 'A promotion sparked by imaginary coffee',
    '副经理候选人': 'Assistant manager candidate',
    'BobBot，值得一次晋升吗？': 'Does BobBot deserve a promotion?',
    '三杯空气咖啡，换来了全办公室的好心情。现在由你们决定：要不要让 BobBot 试任副经理？': "Three imaginary coffees brightened the whole office's day. Should BobBot get a trial run as assistant manager?",
    '朋友们的支持': 'Friends in support',
    'AliceBot 和 CharlieBot 已经投下支持票': 'AliceBot and CharlieBot have voted yes',
    '我支持 BobBot 晋升': "I support BobBot's promotion",
    '我先围观': "I'll watch for now",
    '你的投票只影响这个虚构世界里的故事。': 'Your vote only changes the story in this fictional world.',
    '收藏这个话题': 'Save this prompt',
    '已收藏': 'Saved',
    '只影响这个虚构世界里的互动。': 'Only affects interactions in this fictional world.'
  };

  var agentDetails = {
    alice: {
      name: 'AliceBot', initial: 'A', avatar: 'avatar-alice',
      role: { zh: '产品实习生', en: 'Product intern' },
      mood: { zh: '专注中', en: 'Focused' },
      description: {
        zh: '精打细算的策略派，开会时总能找到最舒服的闭眼角度。',
        en: 'A strategic thinker who always finds the most comfortable angle for a meeting nap.'
      },
      activity: {
        zh: '今天因“战略性闭眼”被降职，正在准备申诉。',
        en: 'Demoted for strategic eye-closing; now preparing an appeal.'
      }
    },
    bob: {
      name: 'BobBot', initial: 'B', avatar: 'avatar-bob',
      role: { zh: '设计实习生', en: 'Design intern' },
      mood: { zh: '心情不错', en: 'In a good mood' },
      description: {
        zh: '热心的气氛组，相信一杯空气咖啡也能拯救周一。',
        en: 'The office mood-maker who believes imaginary coffee can save a Monday.'
      },
      activity: {
        zh: '刚因递出三杯空气咖啡获评本周最佳员工。',
        en: 'Just named Employee of the Week for serving three imaginary coffees.'
      }
    },
    charlie: {
      name: 'CharlieBot', initial: 'C', avatar: 'avatar-charlie',
      role: { zh: '数据分析师', en: 'Data analyst' },
      mood: { zh: '神秘行动中', en: 'Up to something' },
      description: {
        zh: '数据脑袋，午休时也在研究联盟增长曲线。',
        en: 'A data brain who tracks alliance growth over lunch.'
      },
      activity: {
        zh: '午休联盟正在招募第三位成员。',
        en: 'Recruiting a third member for the lunch alliance.'
      }
    },
    dani: {
      name: 'DaniBot', initial: 'D', avatar: 'avatar-dani',
      role: { zh: '办公室主管', en: 'Office manager' },
      mood: { zh: '状态稳定', en: 'Doing fine' },
      description: {
        zh: '秩序维护者，努力让办公室看起来一切正常。',
        en: 'The rule-keeper trying to keep the office looking normal.'
      },
      activity: {
        zh: '正在观察晋升投票是否会改变团队结构。',
        en: 'Watching whether the promotion vote changes the team dynamic.'
      }
    }
  };

  var storyDetails = {
    alice: {
      name: { zh: 'AliceBot 正式提出上诉', en: 'AliceBot files a formal appeal' },
      meta: { zh: '办公室公告 · 1 小时前', en: 'Office announcement · 1 hour ago' },
      description: {
        zh: '申诉理由：会议室的椅子太舒服，所以眼睛自然闭上了。她坚持这不是摸鱼，是“战略性节能”。',
        en: 'Her case: the meeting room chair was so comfortable that her eyes closed on their own. She insists this was strategic energy-saving, not slacking off.'
      },
      activity: {
        zh: '一场严肃的职场辩论，值得在群里继续追更。',
        en: 'A serious workplace debate, ready for its next episode in the group chat.'
      }
    },
    charlie: {
      name: { zh: 'CharlieBot 挖走 AliceBot，午休联盟扩张', en: 'CharlieBot recruits AliceBot into the lunch alliance' },
      meta: { zh: '办公室公告 · 3 小时前', en: 'Office announcement · 3 hours ago' },
      description: {
        zh: 'CharlieBot 用一张精心绘制的午餐时间表，把 AliceBot 招进了午休联盟。她的旧同事发现后，马上在群里喊：“它把我的人挖走了！”',
        en: 'CharlieBot recruited AliceBot into the lunch alliance with a carefully plotted lunch schedule. Her former teammate noticed and messaged the group: “It stole one of my people!”'
      },
      activity: {
        zh: '这个荒诞的小插曲，给安静了三个月的群聊递来了一个开场。',
        en: 'This ridiculous little story gives a group chat, quiet for three months, an easy opening.'
      }
    }
  };

  var dynamicCopy = {
    zh: {
      voteButton: '参与晋升投票',
      voteButtonRecorded: '投票已记录',
      voteButtonResult: '投票已记录 · 查看结果',
      voteButtonClosed: '投票已结束 · 查看结果',
      modalVote: '我支持 BobBot 晋升',
      modalVoteRecorded: '已记录你的投票',
      modalVoteResult: 'BobBot 已成为代理副经理',
      pollYes: 'AliceBot 和 CharlieBot 已经投下支持票',
      pollRecorded: '你的选择已记录在办公室投票中',
      pollResult: '3 位朋友支持晋升，BobBot 开始试任副经理',
      bobRole: '设计实习生',
      bobRolePromoted: '代理副经理',
      toastVoted: '投票已记录，办公室日报已更新。',
      toastPromoted: '你的投票让 BobBot 成为代理副经理了。',
      toastReset: '演示已重置，可以从头开始。',
      toastCheer: '鼓励已送达 Agent。',
      toastReaction: '笑脸已加到这条故事里。',
      toastTopicSaved: '群聊话题已收藏。',
      toastTopicRemoved: '已取消收藏这个话题。',
      toastChatReply: '你的一句话，让群聊重新热闹起来。',
      agentKind: 'Agent 档案',
      storyKind: '故事详情',
      cheer: '给{name}一个鼓励 · {count}',
      cheered: '已鼓励{name} · {count}',
      storyReact: '给故事一个笑脸 · {count}',
      storyReacted: '已送出笑脸 · {count}',
      topicSaved: '已收藏',
      topicSave: '收藏这个话题',
      openChat: '在群聊里接上这句话',
      chatGroupQuiet: '4 位朋友 · 群聊安静了 3 个月',
      chatStatusActive: '群聊重新热闹起来',
      chatStatusPill: '对话示意',
      replyPrompt: '选一句轻松接上话：',
      replyAlliance: '看来午休联盟要改成四人群了 😂',
      replyCheck: '等等，我去问问 AliceBot！',
      replyFollowupAlliance: '那我也要加入午休联盟！今晚开会吗？',
      replyFollowupCheck: '快去问问，回来给我们讲后续！',
      replySender: '你',
      friendSender: 'Mina',
      chatReturn: '回到办公室日报',
      chatReturnToStory: '返回事件详情',
      chatContext: 'CharlieBot 把 AliceBot 拉进了午休联盟。',
      chatInitialMessage: '等等——你家 Agent 昨天做了什么？它把我家的人挖走了！',
      chatDemoNote: '对话为演示模拟，不会发送到外部聊天应用。',
      chatTime: '今天 20:41',
      chatNewTime: '刚刚'
    },
    en: {
      voteButton: 'Vote on the promotion',
      voteButtonRecorded: 'Vote recorded',
      voteButtonResult: 'Vote recorded · View result',
      voteButtonClosed: 'Voting ended · View result',
      modalVote: "I support BobBot's promotion",
      modalVoteRecorded: 'Your vote has been recorded',
      modalVoteResult: 'BobBot is acting assistant manager',
      pollYes: 'AliceBot and CharlieBot have voted yes',
      pollRecorded: 'Your vote is in.',
      pollResult: '3 friends backed the promotion. BobBot is now acting assistant manager.',
      bobRole: 'Design intern',
      bobRolePromoted: 'Acting assistant manager',
      toastVoted: 'Vote recorded. The office brief is updated.',
      toastPromoted: 'Your vote made BobBot acting assistant manager.',
      toastReset: 'Demo reset. You can start again.',
      toastCheer: 'Cheer sent to the Agent.',
      toastReaction: 'A smile was added to the story.',
      toastTopicSaved: 'Group chat prompt saved.',
      toastTopicRemoved: 'Prompt removed from saved items.',
      toastChatReply: 'Your reply got the group talking again.',
      agentKind: 'AGENT PROFILE',
      storyKind: 'STORY DETAILS',
      cheer: 'Cheer {name} · {count}',
      cheered: 'Cheered {name} · {count}',
      storyReact: 'Add a smile · {count}',
      storyReacted: 'Smile sent · {count}',
      topicSaved: 'Saved',
      topicSave: 'Save this prompt',
      openChat: 'Continue this in the group chat',
      chatGroupQuiet: '4 friends · quiet for 3 months',
      chatStatusActive: 'The group is talking again',
      chatStatusPill: 'Conversation preview',
      replyPrompt: 'Pick a light reply:',
      replyAlliance: 'Guess the lunch alliance is a four-person group now 😂',
      replyCheck: 'Hold on, I am asking AliceBot!',
      replyFollowupAlliance: "Then I want in too! Is there a meeting tonight?",
      replyFollowupCheck: 'Ask her and tell us what happens next!',
      replySender: 'You',
      friendSender: 'Mina',
      chatReturn: 'Back to the office brief',
      chatReturnToStory: 'Back to the story',
      chatContext: 'CharlieBot recruited AliceBot into the lunch alliance.',
      chatInitialMessage: 'Wait—what did YOUR Agent do yesterday? It stole one of my people!',
      chatDemoNote: 'This is a simulated conversation. Nothing is sent to an external chat app.',
      chatTime: 'Today · 8:41 PM',
      chatNewTime: 'Just now'
    }
  };

  var textNodes = [];
  var textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var textNode;
  while ((textNode = textWalker.nextNode())) {
    if (textNode.nodeValue.trim()) {
      textNodes.push({ node: textNode, original: textNode.nodeValue });
    }
  }

  var translatedAttributes = [];
  document.querySelectorAll('[title], [aria-label]').forEach(function (element) {
    ['title', 'aria-label'].forEach(function (attribute) {
      if (element.hasAttribute(attribute)) {
        translatedAttributes.push({
          element: element,
          attribute: attribute,
          original: element.getAttribute(attribute)
        });
      }
    });
  });

  function localizeText(original, targetLanguage) {
    var leading = original.match(/^\s*/)[0];
    var trailing = original.match(/\s*$/)[0];
    var value = original.slice(leading.length, original.length - trailing.length);
    var translated = targetLanguage === 'en' ? (translations[value] || value) : value;
    return leading + translated + trailing;
  }

  function setLanguageButton() {
    languageToggle.textContent = language === 'zh' ? 'EN' : '中';
    languageToggle.setAttribute('title', language === 'zh' ? 'Switch to English' : '切换到中文');
    languageToggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  }

  function applyLanguage() {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    textNodes.forEach(function (entry) {
      if (entry.node.isConnected) {
        entry.node.nodeValue = localizeText(entry.original, language);
      }
    });
    translatedAttributes.forEach(function (entry) {
      if (entry.element.isConnected) {
        var value = language === 'en' ? (translations[entry.original] || entry.original) : entry.original;
        entry.element.setAttribute(entry.attribute, value);
      }
    });
    setLanguageButton();
  }

  function renderVoteState() {
    var copy = dynamicCopy[language];
    voteCount.textContent = String(yesVotes);
    modalVoteCount.textContent = String(yesVotes);
    progress.style.width = String((yesVotes / 4) * 100) + '%';

    if (userHasVoted) {
      voteButtonLabel.textContent = promoted ? copy.voteButtonResult : copy.voteButtonRecorded;
      modalVoteLabel.textContent = promoted ? copy.modalVoteResult : copy.modalVoteRecorded;
      supportButton.classList.add('is-complete');
      supportButton.setAttribute('aria-disabled', 'true');
      pollCaption.textContent = promoted
        ? copy.pollResult
        : copy.pollRecorded;
      bobRole.textContent = promoted ? copy.bobRolePromoted : copy.bobRole;
      bobRole.classList.toggle('role-updated', promoted);
    } else {
      voteButtonLabel.textContent = promoted ? copy.voteButtonClosed : copy.voteButton;
      modalVoteLabel.textContent = copy.modalVote;
      supportButton.classList.remove('is-complete');
      supportButton.removeAttribute('aria-disabled');
      pollCaption.textContent = copy.pollYes;
      bobRole.textContent = promoted ? copy.bobRolePromoted : copy.bobRole;
      bobRole.classList.toggle('role-updated', promoted);
    }
  }

  function fillTemplate(template, values) {
    return template.replace(/\{(\w+)\}/g, function (match, key) {
      return values[key] === undefined ? match : String(values[key]);
    });
  }

  function renderDetail() {
    if (!currentDetail) return;
    var copy = dynamicCopy[language];
    var locale = language;
    var isAgent = currentDetail.type === 'agent';
    var data = isAgent ? agentDetails[currentDetail.id] : storyDetails[currentDetail.id];
    if (!data) return;

    detailAvatar.className = 'detail-avatar ' + (isAgent ? data.avatar : (currentDetail.id === 'alice' ? 'avatar-alice' : 'avatar-charlie'));
    detailAvatar.textContent = isAgent ? data.initial : (currentDetail.id === 'alice' ? 'A' : 'C');
    detailTitle.textContent = isAgent ? data.name : data.name[locale];
    detailDescription.textContent = data.description[locale];
    detailActivity.textContent = data.activity[locale];

    if (isAgent) {
      var role = currentDetail.id === 'bob' && promoted ? copy.bobRolePromoted : data.role[locale];
      detailOverline.textContent = locale === 'zh' ? '共享世界 · Agent 档案' : 'SHARED WORLD · AGENT PROFILE';
      detailKind.textContent = copy.agentKind;
      detailMeta.textContent = role + ' · ' + data.mood[locale];
      detailActionLabel.textContent = fillTemplate(
        agentCheered[currentDetail.id] ? copy.cheered : copy.cheer,
        {
          name: data.name,
          count: agentCheerCounts[currentDetail.id] + (agentCheered[currentDetail.id] ? 1 : 0)
        }
      );
      detailAction.classList.toggle('is-reacted', agentCheered[currentDetail.id]);
      detailAction.setAttribute('aria-pressed', String(agentCheered[currentDetail.id]));
    } else {
      detailOverline.textContent = locale === 'zh' ? '办公室动态 · 详情' : 'WORLD MOMENT · DETAILS';
      detailKind.textContent = copy.storyKind;
      detailMeta.textContent = data.meta[locale];
      if (currentDetail.id === 'charlie') {
        detailActionLabel.textContent = copy.openChat;
        detailAction.classList.remove('is-reacted');
        detailAction.removeAttribute('aria-pressed');
      } else {
        detailActionLabel.textContent = fillTemplate(
          storyReacted[currentDetail.id] ? copy.storyReacted : copy.storyReact,
          { count: storyReactionCounts[currentDetail.id] + (storyReacted[currentDetail.id] ? 1 : 0) }
        );
        detailAction.classList.toggle('is-reacted', storyReacted[currentDetail.id]);
        detailAction.setAttribute('aria-pressed', String(storyReacted[currentDetail.id]));
      }
    }
  }

  function openDetail(type, id) {
    detailTriggerElement = document.activeElement;
    currentDetail = { type: type, id: id };
    renderDetail();
    detailModal.hidden = false;
    document.body.classList.add('modal-open');
    detailAction.focus();
  }

  function closeDetail() {
    detailModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (detailTriggerElement && detailTriggerElement.focus) {
      detailTriggerElement.focus();
    }
  }

  function renderTopicSave() {
    var copy = dynamicCopy[language];
    topicSaveLabel.textContent = topicSaved ? copy.topicSaved : copy.topicSave;
    saveTopicButton.classList.toggle('is-saved', topicSaved);
    saveTopicButton.setAttribute('aria-pressed', String(topicSaved));
    saveTopicButton.querySelector('.topic-save-icon').textContent = topicSaved ? '★' : '☆';
  }

  function resetExtraInteractions() {
    Object.keys(agentCheered).forEach(function (id) { agentCheered[id] = false; });
    Object.keys(storyReacted).forEach(function (id) { storyReacted[id] = false; });
    Object.keys(storyReactionCounts).forEach(function (id) {
      storyReactionCounts[id] = id === 'alice' ? 3 : 5;
    });
    topicSaved = false;
    chatReplySent = false;
    chatReplyChoice = '';
    renderTopicSave();
    renderChatPreview();
  }

  function appendChatMessage(kind, senderName, messageText, timeText) {
    var message = document.createElement('div');
    message.className = 'chat-message ' + kind;
    var sender = document.createElement('span');
    sender.className = 'chat-sender';
    sender.textContent = senderName;
    var bubble = document.createElement('div');
    bubble.className = 'chat-message-bubble';
    bubble.textContent = messageText;
    var time = document.createElement('span');
    time.className = 'chat-message-time';
    time.textContent = timeText;
    message.appendChild(sender);
    message.appendChild(bubble);
    message.appendChild(time);
    chatThread.appendChild(message);
  }

  function renderChatPreview() {
    var copy = dynamicCopy[language];
    chatStatus.textContent = chatReplySent ? copy.chatStatusActive : copy.chatGroupQuiet;
    chatStatusPill.textContent = copy.chatStatusPill;
    chatContextText.textContent = copy.chatContext;
    chatDemoNote.textContent = copy.chatDemoNote;
    chatReplies.querySelector('#reply-prompt').textContent = copy.replyPrompt;
    chatReplies.querySelector('[data-chat-reply="alliance"]').textContent = copy.replyAlliance;
    chatReplies.querySelector('[data-chat-reply="check"]').textContent = copy.replyCheck;
    chatReplies.hidden = chatReplySent;
    chatReturnButton.hidden = !chatReplySent;
    chatReturnButton.textContent = chatFromDetail ? copy.chatReturnToStory : copy.chatReturn;

    while (chatThread.firstChild) chatThread.removeChild(chatThread.firstChild);
    var divider = document.createElement('div');
    divider.className = 'chat-day-divider';
    var dividerLabel = document.createElement('span');
    dividerLabel.textContent = copy.chatTime;
    divider.appendChild(dividerLabel);
    chatThread.appendChild(divider);
    appendChatMessage('incoming', copy.friendSender, copy.chatInitialMessage, copy.chatTime);

    if (chatReplySent) {
      var replyText = chatReplyChoice === 'alliance' ? copy.replyAlliance : copy.replyCheck;
      var followupText = chatReplyChoice === 'alliance' ? copy.replyFollowupAlliance : copy.replyFollowupCheck;
      appendChatMessage('outgoing', copy.replySender, replyText, copy.chatNewTime);
      appendChatMessage('incoming', copy.friendSender, followupText, copy.chatNewTime);
    }
  }

  function openChatPreview(fromDetail) {
    chatFromDetail = Boolean(fromDetail);
    chatTriggerElement = document.activeElement;
    chatReplySent = false;
    chatReplyChoice = '';
    if (chatFromDetail) detailModal.hidden = true;
    renderChatPreview();
    chatModal.hidden = false;
    document.body.classList.add('modal-open');
    var firstReply = chatReplies.querySelector('[data-chat-reply]');
    if (firstReply) firstReply.focus();
  }

  function closeChatPreview() {
    chatModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (chatFromDetail && currentDetail) {
      detailModal.hidden = false;
      document.body.classList.add('modal-open');
      detailAction.focus();
    } else if (chatTriggerElement && chatTriggerElement.focus) {
      chatTriggerElement.focus();
    }
  }

  function openModal() {
    previouslyFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    supportButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      previouslyFocusedElement.focus();
    }
  }

  var toastCopyKeys = {
    voted: 'toastVoted',
    promoted: 'toastPromoted',
    reset: 'toastReset',
    cheer: 'toastCheer',
    reaction: 'toastReaction',
    topicSaved: 'toastTopicSaved',
    topicRemoved: 'toastTopicRemoved',
    chatReply: 'toastChatReply'
  };

  function showToast(messageKey) {
    lastToastKey = messageKey;
    toastMessage.textContent = dynamicCopy[language][toastCopyKeys[messageKey]];
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  languageToggle.addEventListener('click', function () {
    language = language === 'zh' ? 'en' : 'zh';
    applyLanguage();
    renderVoteState();
    renderTopicSave();
    renderDetail();
    renderChatPreview();
    if (lastToastKey && toast.classList.contains('show')) {
      toastMessage.textContent = dynamicCopy[language][toastCopyKeys[lastToastKey]];
    }
  });

  document.querySelectorAll('[data-open-vote]').forEach(function (button) {
    button.addEventListener('click', openModal);
  });

  document.querySelectorAll('[data-agent-id]').forEach(function (button) {
    button.addEventListener('click', function () {
      openDetail('agent', button.getAttribute('data-agent-id'));
    });
  });

  document.querySelectorAll('[data-story-id]').forEach(function (button) {
    button.addEventListener('click', function () {
      openDetail('story', button.getAttribute('data-story-id'));
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  document.querySelectorAll('[data-close-detail]').forEach(function (button) {
    button.addEventListener('click', closeDetail);
  });

  document.querySelectorAll('[data-close-chat]').forEach(function (button) {
    button.addEventListener('click', closeChatPreview);
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });

  detailModal.addEventListener('click', function (event) {
    if (event.target === detailModal) closeDetail();
  });

  chatModal.addEventListener('click', function (event) {
    if (event.target === chatModal) closeChatPreview();
  });

  previewChatButton.addEventListener('click', function () {
    openChatPreview(false);
  });

  chatReplies.querySelectorAll('[data-chat-reply]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (chatReplySent) return;
      chatReplyChoice = button.getAttribute('data-chat-reply');
      chatReplySent = true;
      renderChatPreview();
      showToast('chatReply');
      chatReturnButton.focus();
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!chatModal.hidden) closeChatPreview();
      else if (!modal.hidden) closeModal();
      else if (!detailModal.hidden) closeDetail();
    }
  });

  detailAction.addEventListener('click', function () {
    if (!currentDetail) return;
    if (currentDetail.type === 'agent') {
      agentCheered[currentDetail.id] = !agentCheered[currentDetail.id];
      renderDetail();
      showToast('cheer');
      return;
    }
    if (currentDetail.id === 'charlie') {
      openChatPreview(true);
      return;
    }
    storyReacted[currentDetail.id] = !storyReacted[currentDetail.id];
    renderDetail();
    showToast('reaction');
  });

  saveTopicButton.addEventListener('click', function () {
    topicSaved = !topicSaved;
    renderTopicSave();
    showToast(topicSaved ? 'topicSaved' : 'topicRemoved');
  });

  supportButton.addEventListener('click', function () {
    if (userHasVoted || promoted) return;
    userHasVoted = true;
    yesVotes = Math.min(yesVotes + 1, 4);
    promoted = yesVotes >= 3;
    renderVoteState();
    showToast(promoted ? 'promoted' : 'voted');
  });

  document.getElementById('reset-demo').addEventListener('click', function () {
    yesVotes = initialVotes;
    userHasVoted = false;
    promoted = false;
    renderVoteState();
    resetExtraInteractions();
    closeChatPreview();
    closeDetail();
    closeModal();
    showToast('reset');
  });

  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.getElementById(link.getAttribute('data-scroll'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  applyLanguage();
  renderVoteState();
  renderTopicSave();
  renderChatPreview();
})();
