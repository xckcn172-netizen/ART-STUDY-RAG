import { useState } from 'react';
import { cardApi, quizApi } from './services/api';

// ── Icons ────────────────────────────────────────────────────
const I = {
  cards:    'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  quiz:     'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  stats:    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  plus:     'M12 6v6m0 0v6m0-6h6m-6 0H6',
  eye:      'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  check:    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  edit:     'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  lightbulb:'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  sparkle:  'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  palette:  'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  brain:    'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5',
  book:     'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  chevDown: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  x:        'M6 18L18 6M6 6l12 12',
  refresh:  'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182',
};

function Svg({ path, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
    </svg>
  );
}

function Spin({ className = 'w-4 h-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ── App Shell ────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('cards');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '', difficulty: 'intermediate', numQuestions: 1,
  });

  const handleGenerate = async () => {
    if (!formData.topic.trim()) { alert('请输入绘画主题'); return; }
    setLoading(true);
    try {
      const res = await cardApi.generateCards({
        topic: formData.topic, difficulty: formData.difficulty,
        num_questions: formData.numQuestions,
      });
      setCards(res.data);
    } catch { alert('生成失败，请重试'); }
    finally { setLoading(false); }
  };

  const navItems = [
    { key: 'cards', label: '复习卡片', icon: I.cards },
    { key: 'quiz',  label: '测验模式', icon: I.quiz },
    { key: 'stats', label: '学习统计', icon: I.stats },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#09090b] text-white flex">
      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-5%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[20%] w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px]" />
      </div>

      {/* ── Sidebar ── */}
      <aside className="relative z-10 w-[220px] shrink-0 border-r border-white/[0.06] flex flex-col bg-[#09090b]/90 backdrop-blur-xl">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Svg path={I.palette} className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-[13px] font-bold tracking-tight">美术生RAG</h1>
              <p className="text-[10px] text-zinc-500">AI-Powered Study</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex-1">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium px-2 mb-2">功能模块</p>
          {navItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 mb-1 ${
                activeTab === tab.key
                  ? 'bg-white/[0.08] text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
              }`}
            >
              <Svg path={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Sidebar footer - mini features */}
        <div className="px-4 py-4 border-t border-white/[0.06] space-y-3">
          {[
            { icon: I.brain, label: 'RAG知识库', color: 'text-violet-400' },
            { icon: I.sparkle, label: 'AI驱动', color: 'text-blue-400' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Svg path={f.icon} className={`w-3.5 h-3.5 ${f.color}`} />
              <span className="text-[11px] text-zinc-500">{f.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-zinc-600">系统在线</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 shrink-0 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#09090b]/60 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-200">
              {navItems.find(n => n.key === activeTab)?.label}
            </span>
            <span className="text-[11px] text-zinc-600">/</span>
            <span className="text-[11px] text-zinc-500">
              {activeTab === 'cards' ? 'AI智能生成复习卡片' : activeTab === 'quiz' ? '知识掌握度检测' : '学习数据分析'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center gap-1.5">
              <Svg path={I.sparkle} className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] text-zinc-400">RAG</span>
            </div>
          </div>
        </header>

        {/* Content - fills remaining viewport */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-[1100px] mx-auto">
            {activeTab === 'cards' && (
              <CardsTab formData={formData} setFormData={setFormData} cards={cards} loading={loading} handleGenerate={handleGenerate} />
            )}
            {activeTab === 'quiz' && <QuizView />}
            {activeTab === 'stats' && <StatsView />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Cards Tab ────────────────────────────────────────────────
function CardsTab({ formData, setFormData, cards, loading, handleGenerate }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-5 h-full" style={{ minHeight: 'calc(100vh - 88px)' }}>
      {/* Left: Form */}
      <div className="flex flex-col gap-5">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
              <Svg path={I.plus} className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <h3 className="text-[13px] font-semibold text-zinc-200">生成复习卡片</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">绘画主题</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="例如: 素描中的明暗关系"
                className="w-full px-3.5 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">难度</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none"
                >
                  <option value="beginner" className="bg-zinc-900">初级</option>
                  <option value="intermediate" className="bg-zinc-900">中级</option>
                  <option value="advanced" className="bg-zinc-900">高级</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">数量</label>
                <select
                  value={formData.numQuestions}
                  onChange={(e) => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none"
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-zinc-900">{n}题</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-violet-500 hover:to-blue-500 disabled:from-zinc-700 disabled:to-zinc-700 transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30"
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Spin /> 生成中...</span> : '生成卡片'}
          </button>
        </div>

        {/* Features list */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex-1">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-3">支持的绘画主题</p>
          <div className="grid grid-cols-2 gap-2">
            {['素描技法', '色彩理论', '构图原则', '水彩技法', '油画基础', '速写训练'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <div className="w-1 h-1 rounded-full bg-violet-500/60" />
                <span className="text-[12px] text-zinc-500">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cards */}
      <div className="flex flex-col">
        {cards.length === 0 && !loading ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl flex-1 flex flex-col items-center justify-center">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
              <Svg path={I.lightbulb} className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-zinc-400 text-sm font-medium mb-1">暂无复习卡片</p>
            <p className="text-zinc-600 text-xs">填写左侧表单生成</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: 'calc(100vh - 112px)' }}>
            {cards.map((card, index) => (
              <CardItem key={index} card={card} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Flashcard ────────────────────────────────────────────────
function CardItem({ card, index }) {
  const [flipped, setFlipped] = useState(false);

  const diffMap = {
    beginner:     { label: '初级', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    intermediate: { label: '中级', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    advanced:     { label: '高级', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };
  const diff = diffMap[card.difficulty] || diffMap.intermediate;

  return (
    <div
      className="group cursor-pointer animate-fadeIn"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`bg-white/[0.02] border border-white/[0.06] rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/5 ${flipped ? '!border-violet-500/20 !bg-white/[0.04]' : ''}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{card.topic}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${diff.cls}`}>{diff.label}</span>
          </div>
          {!flipped ? (
            <div>
              <div className="bg-white/[0.03] rounded-xl px-3.5 py-2.5 mb-2.5 border border-white/[0.04]">
                <p className="text-zinc-200 text-[13px] font-semibold leading-relaxed">{card.question}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Svg path={I.eye} className="w-3 h-3 text-zinc-600" />
                <span className="text-[10px] text-zinc-600 group-hover:text-violet-400 transition-colors">点击翻转</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-2.5">
                <Svg path={I.check} className="w-2.5 h-2.5 text-violet-400" />
                <span className="text-[10px] font-medium text-violet-400">答案</span>
              </div>
              <div className="bg-white/[0.03] rounded-xl px-3.5 py-2.5 border border-white/[0.04]">
                <p className="text-zinc-400 text-[13px] leading-relaxed">{card.answer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Quiz View ────────────────────────────────────────────────
function QuizView() {
  const [cards, setCards] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    try {
      setLoading(true);
      const cr = await cardApi.getCards({ limit: 10 });
      if (cr.data.length === 0) { alert('请先生成一些复习卡片'); setLoading(false); return; }
      setCards(cr.data);
      const qr = await quizApi.createQuiz({ num_cards: Math.min(5, cr.data.length) });
      setCurrentQuiz(qr.data);
      setUserAnswers(qr.data.card_ids.map((id) => ({ card_id: id, user_answer: '' })));
      setQuizResult(null);
    } catch { alert('开始测验失败'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!currentQuiz) return;
    if (userAnswers.some((a) => !a.user_answer.trim())) { alert('请回答所有问题'); return; }
    try {
      setLoading(true);
      const r = await quizApi.submitQuiz({ session_id: currentQuiz.id, answers: userAnswers });
      setQuizResult(r.data);
    } catch { alert('提交失败'); }
    finally { setLoading(false); }
  };

  // ── Start ──
  if (cards.length === 0 && !currentQuiz) {
    return (
      <div className="grid grid-cols-[1fr_1fr] gap-5" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
            <Svg path={I.quiz} className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200 mb-2">开始测验</h3>
          <p className="text-zinc-500 text-xs mb-6 text-center max-w-[240px] leading-relaxed">
            从现有卡片中随机抽取5张，检测绘画知识掌握程度
          </p>
          <button
            onClick={startQuiz}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:from-zinc-700 disabled:to-zinc-700 transition-all shadow-lg shadow-blue-600/20"
          >
            {loading ? <span className="flex items-center gap-2"><Spin /> 加载中...</span> : '开始测验'}
          </button>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-4">测验说明</p>
          <div className="space-y-3">
            {[
              { num: '01', title: '随机抽题', desc: '系统从已有卡片中随机抽取题目' },
              { num: '02', title: '自由作答', desc: '根据问题用自己的语言作答' },
              { num: '03', title: '智能评分', desc: 'AI对比答案给出分数和反馈' },
              { num: '04', title: '查看结果', desc: '详细展示每题得分与正确答案' },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[11px] font-bold text-violet-400/60 w-6 shrink-0">{s.num}</span>
                <div>
                  <p className="text-[12px] font-medium text-zinc-300">{s.title}</p>
                  <p className="text-[11px] text-zinc-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Results ──
  if (quizResult) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-[200px_1fr] gap-5">
          {/* Score */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col items-center justify-center">
            <span className="text-3xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {quizResult.score.toFixed(1)}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1">平均得分</span>
          </div>
          {/* Summary */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
            <div className="flex gap-6">
              <div>
                <p className="text-lg font-bold text-emerald-400">{quizResult.answers.filter(a => a.is_correct).length}</p>
                <p className="text-[10px] text-zinc-500">正确</p>
              </div>
              <div>
                <p className="text-lg font-bold text-rose-400">{quizResult.answers.filter(a => !a.is_correct).length}</p>
                <p className="text-[10px] text-zinc-500">待提高</p>
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-300">{quizResult.answers.length}</p>
                <p className="text-[10px] text-zinc-500">总题数</p>
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-600/20"
            >
              再来一次
            </button>
          </div>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-2 gap-3">
          {quizResult.answers.map((answer, index) => {
            const card = cards.find((c) => c.id === answer.card_id);
            const ok = answer.is_correct;
            return (
              <div key={index} className={`bg-white/[0.02] rounded-2xl p-4 border ${ok ? 'border-emerald-500/15' : 'border-rose-500/15'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${ok ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    #{index + 1}
                  </span>
                  <span className={`text-[11px] font-semibold ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {answer.score.toFixed(1)}分
                  </span>
                </div>
                <div className="bg-white/[0.03] rounded-lg px-3 py-2 mb-2 border border-white/[0.04]">
                  <p className="text-[12px] font-medium text-zinc-300">{card?.question}</p>
                </div>
                <div className="space-y-1">
                  <div className="bg-white/[0.02] rounded-lg px-2.5 py-1.5 border border-white/[0.04]">
                    <p className="text-[11px] text-zinc-500"><span className="text-zinc-600">你：</span>{answer.user_answer}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg px-2.5 py-1.5 border border-white/[0.04]">
                    <p className="text-[11px] text-zinc-500"><span className="text-zinc-600">答：</span>{card?.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Answering ──
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-5" style={{ minHeight: 'calc(100vh - 88px)' }}>
      {/* Questions list */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Svg path={I.edit} className="w-4 h-4 text-blue-400" />
            <h3 className="text-[13px] font-semibold text-zinc-200">答题中</h3>
          </div>
          <span className="text-[10px] text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
            {userAnswers.length} 题
          </span>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 188px)' }}>
          {userAnswers.map((answer, index) => {
            const card = cards.find((c) => c.id === answer.card_id);
            return (
              <div key={index} className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
                <div className="flex items-start gap-2.5 mb-2.5">
                  <span className="shrink-0 w-5 h-5 rounded bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                    {index + 1}
                  </span>
                  <p className="text-[12px] font-medium text-zinc-300 leading-relaxed">{card?.question}</p>
                </div>
                <textarea
                  value={answer.user_answer}
                  onChange={(e) => {
                    const a = [...userAnswers]; a[index].user_answer = e.target.value; setUserAnswers(a);
                  }}
                  placeholder="输入你的答案..."
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[13px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                  rows={2}
                />
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:from-zinc-700 disabled:to-zinc-700 transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? <span className="flex items-center justify-center gap-2"><Spin /> 提交中...</span> : '提交答案'}
        </button>
      </div>

      {/* Right: tips */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-4">答题提示</p>
        <div className="space-y-3">
          {[
            { t: '用自己的语言描述，不要照搬关键词' },
            { t: '包含具体的绘画技法术语会加分' },
            { t: '答案越详细，得分通常越高' },
            { t: '可以先在脑中组织语言再作答' },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-500/60 mt-1.5 shrink-0" />
              <p className="text-[12px] text-zinc-500 leading-relaxed">{tip.t}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <Svg path={I.lightbulb} className="w-3.5 h-3.5 text-amber-400/60" />
            <span className="text-[11px] font-medium text-zinc-400">评分机制</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            AI会将你的回答与标准答案进行语义对比，综合评估准确度、完整性和专业性，给出0-10分的评分。
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Stats View ───────────────────────────────────────────────
function StatsView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const r = await quizApi.getStats();
      setStats(r.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useState(() => { loadStats(); });

  if (loading) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <Spin className="w-8 h-8 text-zinc-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-[1fr_1fr] gap-5" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
          <Svg path={I.stats} className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-zinc-400 text-sm font-medium">暂无统计数据</p>
          <p className="text-zinc-600 text-xs mt-1">完成测验后即可查看</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-4">如何获得统计数据</p>
          <div className="space-y-4">
            {[
              { num: '01', t: '切换到复习卡片标签', d: '输入绘画主题生成复习卡片' },
              { num: '02', t: '切换到测验模式', d: '开始测验并认真作答' },
              { num: '03', t: '提交答案', d: 'AI将自动评分并记录成绩' },
              { num: '04', t: '回到统计页面', d: '查看你的学习数据和趋势' },
            ].map((s, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[11px] font-bold text-emerald-400/50 w-6">{s.num}</span>
                <div>
                  <p className="text-[12px] font-medium text-zinc-300">{s.t}</p>
                  <p className="text-[11px] text-zinc-600">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-5" style={{ minHeight: 'calc(100vh - 88px)' }}>
      {/* Left: stat cards + chart */}
      <div className="flex flex-col gap-4">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '完成测验', value: stats.total_quizzes, grad: 'from-violet-500/20 to-purple-500/20', c: 'text-violet-400', icon: I.book },
            { label: '平均得分', value: stats.average_score.toFixed(1), grad: 'from-emerald-500/20 to-teal-500/20', c: 'text-emerald-400', icon: I.stats },
            { label: '已学卡片', value: stats.total_cards_learned, grad: 'from-blue-500/20 to-cyan-500/20', c: 'text-blue-400', icon: I.cards },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-center hover:bg-white/[0.04] transition-all group">
              <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${s.grad} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Svg path={s.icon} className={`w-3.5 h-3.5 ${s.c}`} />
              </div>
              <p className={`text-xl font-black ${s.c}`}>{s.value}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Svg path={I.stats} className="w-4 h-4 text-emerald-400" />
              <span className="text-[13px] font-semibold text-zinc-200">成绩趋势</span>
            </div>
            <button onClick={loadStats} className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              <Svg path={I.refresh} className="w-3 h-3" /> 刷新
            </button>
          </div>
          {stats.recent_performance.length > 0 ? (
            <div className="h-[calc(100vh-380px)] min-h-[140px] flex items-end justify-between gap-2 bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
              {stats.recent_performance.map((score, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-[10px] font-bold text-zinc-500 mb-1">{score.toFixed(0)}</span>
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-violet-600/60 to-blue-500/60 hover:from-violet-500/80 hover:to-blue-400/80 transition-all min-w-[12px]"
                    style={{ height: `${Math.max(score, 5)}%` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.02] rounded-xl py-8 text-center border border-white/[0.04]">
              <p className="text-zinc-600 text-xs">暂无测验记录</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: insights */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-4">学习洞察</p>
        <div className="space-y-3">
          {stats.recent_performance.length > 0 && (
            <>
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <Svg path={I.stats} className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-medium text-zinc-300">最近表现</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {stats.average_score >= 7
                    ? '你的表现非常出色！继续保持良好的学习状态。'
                    : stats.average_score >= 4
                    ? '表现中等，建议多复习薄弱的知识点。'
                    : '还需要更多练习，试试从初级难度的卡片开始。'}
                </p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <Svg path={I.book} className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[11px] font-medium text-zinc-300">学习进度</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-zinc-500">已掌握卡片</span>
                    <span className="text-[10px] text-zinc-400">{stats.total_cards_learned} 张</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, stats.total_cards_learned * 5)}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <Svg path={I.sparkle} className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-medium text-zinc-300">学习建议</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              定期复习是巩固记忆的关键。建议每天花15-20分钟进行卡片复习和测验，效果最佳。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
