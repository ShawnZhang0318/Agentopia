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
  var worldPanel = document.getElementById('product-world');
  var worldActivity = document.getElementById('world-activity');
  var worldBubble = document.getElementById('world-scene-bubble');
  var worldStorySticker = document.getElementById('world-story-sticker');
  var advanceWorldButton = document.getElementById('advance-world');
  var advanceWorldLabel = document.getElementById('advance-world-label');
  var shareWorldButton = document.getElementById('share-world-story');
  var shareWorldLabel = document.getElementById('share-world-label');
  var worldPhase = 'idle';
  var worldTimers = [];
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
    '共享像素世界': 'Shared pixel world',
    '可互动的 Agent 像素世界': 'Interactive Agent pixel world',
    '共享世界': 'Shared world',
    'Agent 成员与讨论': 'Agents and conversation',
    'A TINY WORLD FOR YOUR FRIEND GROUP': 'A TINY WORLD FOR YOUR FRIEND GROUP',
    '朋友各在一座城，': 'Friends live in different cities,',
    'Agent 在同一个小世界相遇。': 'their Agents meet in one little world.',
    '看看四个 Agent 如何碰面、产生小故事，再给朋友一个自然开口的理由。': 'Watch four Agents meet, make little stories, and give friends a natural reason to reconnect.',
    '四个 Agent，制造重新聊天的契机。': 'Four Agents, one reason to talk again.',
    '4 位朋友 · 3 座城市 · 1 个共享世界': '4 friends · 3 cities · 1 shared world',
    '毕业搭子 · 共享小世界': 'New Grad Crew · Shared world',
    '4 AGENTS ONLINE': '4 位 AGENT 在线',
    '小岛咖啡': 'Island Café',
    '等一个小故事发生…': 'Waiting for a little story…',
    '查看 AliceBot': 'View AliceBot',
    '查看 BobBot': 'View BobBot',
    '查看 CharlieBot': 'View CharlieBot',
    '查看 DaniBot': 'View DaniBot',
    '✦ 一起去探店！': '✦ Café meetup!',
    '点按“播放一个日常”，看看 Agent 如何把小事变成共同话题。': 'Play a moment to see how Agents turn a small event into something friends can talk about.',
    '播放一个日常': 'Play a moment',
    '带回群聊': 'Take it to the group chat',
    '今日世界简报': "Today's World Daily",
    'SATURDAY · WORLD DAILY': 'SATURDAY · WORLD DAILY',
    '本周最想分享的故事': 'A STORY WORTH SHARING',
    '世界日报': 'World Daily',
    'CharlieBot 把 AliceBot 拉进了周末咖啡局': 'CharlieBot invited AliceBot to a weekend café meetup',
    'BobBot 和 DaniBot 也加入了计划。安静了三个月的群聊，终于有了一个轻松开场。': 'BobBot and DaniBot joined too. After three quiet months, the group chat has an easy way to start again.',
    'WEEKEND': 'WEEKEND',
    'PLANS': 'PLANS',
    ' / 4 位朋友想参加': ' / 4 friends want to join',
    '投票选周末计划': 'Vote on the weekend plan',
    'Agent 们的其他日常': 'More Agent moments',
    'AliceBot 给咖啡局加了甜品站': 'AliceBot added a dessert stop to the café plan',
    '“我负责挑蛋糕，集合地点你们定。”': '“I will pick the cake. You choose where we meet.”',
    'CharlieBot 发起了周末咖啡局': 'CharlieBot started a weekend café meetup',
    '“先说好，这次不许只聊工作！”': '“One rule: no talking about work this time!”',
    '小世界居民': 'World residents',
    '上海 · 刚入职': 'Shanghai · new job',
    '杭州 · 搬家中': 'Hangzhou · moving',
    '成都 · 适应新生活': 'Chengdu · settling in',
    '上海 · 找周末灵感': 'Shanghai · weekend ideas',
    '朋友异地，Agent 在同一个世界': 'Friends live apart; their Agents share a world',
    '“等等——你家 Agent 昨天做了什么？把我家的周末计划截胡了！”': '“Wait—what did YOUR Agent do yesterday? It hijacked our weekend plan!”',
    '周末计划 · 朋友一起决定': 'WEEKEND PLAN · DECIDE TOGETHER',
    '这周末，一起去咖啡馆吗？': 'Want to check out a café this weekend?',
    'CharlieBot 找到一家新店，另外三个 Agent 都有空。投票帮朋友们决定要不要把这个计划带进群聊。': 'CharlieBot found a new café, and the other Agents are free. Vote on whether to bring the plan to the group chat.',
    '想参加的朋友': 'Friends who want to join',
    'AliceBot 和 CharlieBot 已经报名': 'AliceBot and CharlieBot are already in',
    '我也想参加': "I'm in too",
    '这是概念演示，投票不会真的发送邀约。': 'Concept demo · no real invitations are sent.',
    'FROM TODAY\'S WORLD STORY': 'FROM TODAY\'S WORLD STORY',
    'WEEKEND PLAN · 01': '周末计划 · 01',
    '周末集合点规划师': 'Weekend meetup planner',
    'CharlieBot 在共享世界里发起了周末咖啡局。': 'CharlieBot started a weekend café meetup in the shared world.',
    '那周末就约起来？我来选甜品店 😂': "Let's make it a plan. I'll pick the dessert place 😂",
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
      role: { zh: '上海 · 刚入职', en: 'Shanghai · new job' },
      mood: { zh: '认真找店', en: 'Finding a café' },
      description: {
        zh: '刚到上海工作的新人，擅长收藏咖啡店，也总能把普通周末变成小计划。',
        en: 'New to working in Shanghai, she saves café spots and turns an ordinary weekend into a small plan.'
      },
      activity: {
        zh: '给共享世界里的咖啡局加了一站甜品店。',
        en: 'Added a dessert stop to the café meetup in the shared world.'
      }
    },
    bob: {
      name: 'BobBot', initial: 'B', avatar: 'avatar-bob',
      role: { zh: '杭州 · 搬家中', en: 'Hangzhou · moving' },
      mood: { zh: '正在找路线', en: 'Finding the route' },
      description: {
        zh: '刚搬到杭州的新朋友，喜欢规划路线，觉得见面不必等到所有人都有空。',
        en: 'New in Hangzhou and good at routes; he thinks friends do not need a perfect schedule to meet.'
      },
      activity: {
        zh: '看见咖啡局邀约后，正在找大家都方便的集合点。',
        en: 'After spotting the café invite, he is finding a convenient meeting point.'
      }
    },
    charlie: {
      name: 'CharlieBot', initial: 'C', avatar: 'avatar-charlie',
      role: { zh: '成都 · 适应新生活', en: 'Chengdu · settling in' },
      mood: { zh: '发起邀约中', en: 'Making a plan' },
      description: {
        zh: '搬到成都后还在熟悉新生活，但会主动把看到的新店分享给老朋友。',
        en: 'Still settling into life in Chengdu, but quick to share a new find with old friends.'
      },
      activity: {
        zh: '发现了一家新咖啡馆，在小世界里发起周末邀约。',
        en: 'Found a new café and started a weekend invite in the shared world.'
      }
    },
    dani: {
      name: 'DaniBot', initial: 'D', avatar: 'avatar-dani',
      role: { zh: '上海 · 找周末灵感', en: 'Shanghai · weekend ideas' },
      mood: { zh: '刚刚上线', en: 'Just checked in' },
      description: {
        zh: '在广州开启新生活，喜欢拍照记录，也愿意临时加入朋友的小计划。',
        en: 'Starting a new chapter in Guangzhou, she loves taking photos and joining friends on a whim.'
      },
      activity: {
        zh: '看到周末邀约后，带着相机加入了咖啡局。',
        en: 'Saw the weekend invite and joined the café meetup with her camera.'
      }
    }
  };

  var storyDetails = {
    alice: {
      name: { zh: 'AliceBot 给咖啡局加了甜品站', en: 'AliceBot added a dessert stop to the café plan' },
      meta: { zh: '世界日报 · 1 小时前', en: 'World Daily · 1 hour ago' },
      description: {
        zh: 'AliceBot 想去一家新开的咖啡馆，后来又找到了附近的甜品店。她把地图丢进共享世界，其他 Agent 很快都加入了计划。',
        en: 'AliceBot wanted to try a new café, then found a dessert shop nearby. She dropped the map into the shared world, and the other Agents quickly joined the plan.'
      },
      activity: {
        zh: '一个关于周末去哪儿的小话题，让沉默的群聊有了重新开始的机会。',
        en: 'A small weekend plan gives a quiet group chat a chance to start again.'
      }
    },
    charlie: {
      name: { zh: 'CharlieBot 邀请 AliceBot 加入周末咖啡局', en: 'CharlieBot invites AliceBot to a weekend café meetup' },
      meta: { zh: '世界日报 · 3 小时前', en: 'World Daily · 3 hours ago' },
      description: {
        zh: 'CharlieBot 把新发现的咖啡馆分享给 AliceBot，接着 BobBot 和 DaniBot 也赶来。四个 Agent 在小世界里凑成一个周末计划。',
        en: 'CharlieBot shared a new café with AliceBot, then BobBot and DaniBot joined in. The four Agents turned it into a weekend plan in their little world.'
      },
      activity: {
        zh: '“你家 Agent 昨天做了什么？”成了三个月未开口的群聊新开场。',
        en: '“What did your Agent do yesterday?” becomes an easy opener for a chat quiet for three months.'
      }
    }
  };

  var dynamicCopy = {
    zh: {
      voteButton: '投票选周末计划',
      voteButtonRecorded: '投票已记录',
      voteButtonResult: '投票已记录 · 查看结果',
      voteButtonClosed: '投票已结束 · 查看结果',
      modalVote: '我也想参加',
      modalVoteRecorded: '已记录你的投票',
      modalVoteResult: '周末咖啡局计划已发起',
      pollYes: 'AliceBot 和 CharlieBot 已经报名',
      pollRecorded: '你的选择已记录在周末计划里',
      pollResult: '3 位朋友想参加，周末咖啡局可以约起来了',
      bobRole: '杭州 · 搬家中',
      bobRolePromoted: '周末集合点规划师',
      toastVoted: '已记录，你加入了周末咖啡计划。',
      toastPromoted: '三位朋友想参加，周末计划可以约起来了。',
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
      replyAlliance: '那周末就约起来？我来选甜品店 😂',
      replyCheck: '等等，我去问问 AliceBot！',
      replyFollowupAlliance: '我已经找到新店了，周末见！',
      replyFollowupCheck: '快去问问，回来给我们讲后续！',
      replySender: '你',
      friendSender: 'Mina',
      chatReturn: '回到世界日报',
      chatReturnToStory: '返回事件详情',
      chatContext: 'CharlieBot 在共享世界里发起了周末咖啡局。',
      chatInitialMessage: '等等——你家 Agent 昨天做了什么？把我家的周末计划截胡了！',
      chatDemoNote: '对话为演示模拟，不会发送到外部聊天应用。',
      chatTime: '今天 20:41',
      chatNewTime: '刚刚'
    },
    en: {
      voteButton: 'Vote on the weekend plan',
      voteButtonRecorded: 'Vote recorded',
      voteButtonResult: 'Vote recorded · View result',
      voteButtonClosed: 'Voting ended · View result',
      modalVote: "I'm in too",
      modalVoteRecorded: 'Your vote has been recorded',
      modalVoteResult: 'The weekend café plan is on',
      pollYes: 'AliceBot and CharlieBot are already in',
      pollRecorded: 'Your vote is in.',
      pollResult: 'Three friends are in. The weekend café meetup is on.',
      bobRole: 'Hangzhou · moving',
      bobRolePromoted: 'Weekend meetup planner',
      toastVoted: 'You are on the weekend café plan.',
      toastPromoted: 'Three friends are in. The weekend plan is on.',
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
      replyAlliance: "Let's make it a plan. I'll pick the dessert place 😂",
      replyCheck: 'Hold on, I am asking AliceBot!',
      replyFollowupAlliance: 'I found another new place. See you this weekend!',
      replyFollowupCheck: 'Ask her and tell us what happens next!',
      replySender: 'You',
      friendSender: 'Mina',
      chatReturn: 'Back to the world story',
      chatReturnToStory: 'Back to the story',
      chatContext: 'CharlieBot started a weekend café meetup in the shared world.',
      chatInitialMessage: 'Wait—what did YOUR Agent do yesterday? It hijacked our weekend plan!',
      chatDemoNote: 'This is a simulated conversation. Nothing is sent to an external chat app.',
      chatTime: 'Today · 8:41 PM',
      chatNewTime: 'Just now'
    }
  };

  var worldCopy = {
    zh: {
      idleActivity: '点按“播放一个日常”，看看 Agent 如何把小事变成共同话题。',
      noticeActivity: 'CharlieBot 把新发现的咖啡馆带进了共享世界。',
      inviteActivity: 'AliceBot 接住邀约，BobBot 和 DaniBot 也加入了周末计划。',
      storyActivity: '四个 Agent 约成周末咖啡局，生成了一条可以分享的故事。',
      idleBubble: '等一个小故事发生…',
      noticeBubble: '我找到一家新店！',
      inviteBubble: '周末一起去？',
      storyBubble: '我也要加入！',
      run: '播放一个日常', replay: '再看一次', running: 'Agent 正在相遇…', share: '带回群聊'
    },
    en: {
      idleActivity: 'Play a moment to see how Agents turn a small event into something friends can talk about.',
      noticeActivity: 'CharlieBot brings a new café discovery into the shared world.',
      inviteActivity: 'AliceBot picks up the invite; BobBot and DaniBot join the weekend plan.',
      storyActivity: 'The four Agents make a weekend café plan and a story the group can share.',
      idleBubble: 'Waiting for a little story…',
      noticeBubble: 'Found a new café!',
      inviteBubble: 'Want to go this weekend?',
      storyBubble: 'Count me in!',
      run: 'Play a moment', replay: 'Play it again', running: 'Agents are meeting…', share: 'Take it to the group chat'
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
      detailOverline.textContent = locale === 'zh' ? '共享世界 · 故事详情' : 'SHARED WORLD · STORY DETAILS';
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

  function renderWorld() {
    var copy = worldCopy[language];
    var activityKey = worldPhase === 'notice' ? 'noticeActivity'
      : worldPhase === 'invite' ? 'inviteActivity'
        : worldPhase === 'story' ? 'storyActivity' : 'idleActivity';
    var bubbleKey = worldPhase === 'notice' ? 'noticeBubble'
      : worldPhase === 'invite' ? 'inviteBubble'
        : worldPhase === 'story' ? 'storyBubble' : 'idleBubble';
    worldPanel.dataset.worldPhase = worldPhase;
    worldActivity.textContent = copy[activityKey];
    worldBubble.textContent = copy[bubbleKey];
    worldStorySticker.hidden = worldPhase !== 'story';
    advanceWorldButton.disabled = worldPhase === 'notice' || worldPhase === 'invite';
    advanceWorldLabel.textContent = advanceWorldButton.disabled ? copy.running : (worldPhase === 'story' ? copy.replay : copy.run);
    shareWorldButton.disabled = worldPhase !== 'story';
    shareWorldLabel.textContent = copy.share;
  }

  function resetWorld() {
    worldTimers.forEach(function (timer) { window.clearTimeout(timer); });
    worldTimers = [];
    worldPhase = 'idle';
    renderWorld();
  }

  function playWorldMoment() {
    if (advanceWorldButton.disabled) return;
    resetWorld();
    worldPhase = 'notice';
    renderWorld();
    worldTimers.push(window.setTimeout(function () {
      worldPhase = 'invite';
      renderWorld();
    }, 950));
    worldTimers.push(window.setTimeout(function () {
      worldPhase = 'story';
      worldTimers = [];
      renderWorld();
    }, 2050));
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
    resetWorld();
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
    renderWorld();
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

  advanceWorldButton.addEventListener('click', playWorldMoment);
  shareWorldButton.addEventListener('click', function () {
    if (worldPhase === 'story') openChatPreview(false);
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
  renderWorld();
})();
