import { useState, useMemo } from 'react';
import { cardApi, quizApi } from './services/api';

// ── Shared icons as inline SVGs ──────────────────────────────
const Icons = {
  cards: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  quiz: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  stats: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  plus: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  lightbulb: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  sparkle: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  palette: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  brain: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.322 2.322a3 3 0 01-1.023.644l-1.904.764a1.5 1.5 0 01-1.502 0l-1.904-.764a3 3 0 01-1.023-.644L5 14.5m14 0V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.5',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
};

function SvgIcon({ path, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
    </svg>
  );
}

function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ── Main App ─────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('cards');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'intermediate',
    numQuestions: 1,
  });

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('请输入绘画主题');
      return;
    }
    setLoading(true);
    try {
      const response = await cardApi.generateCards({
        topic: formData.topic,
        difficulty: formData.difficulty,
        num_questions: formData.numQuestions,
      });
      setCards(response.data);
    } catch (error) {
      console.error('Error generating cards:', error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { key: 'cards', label: '复习卡片', icon: Icons.cards, desc: 'AI智能生成' },
    { key: 'quiz', label: '测验模式', icon: Icons.quiz, desc: '知识检测' },
    { key: 'stats', label: '学习统计', icon: Icons.chart, desc: '数据分析' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* ── Ambient glow background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* ── Top Bar ── */}
        <header className="border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <SvgIcon path={Icons.palette} className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">美术生RAG复习系统</h1>
                <p className="text-[10px] text-zinc-500 -mt-0.5">AI-Powered Art Study</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
              {navItems.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === tab.key
                      ? 'bg-white/[0.1] text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <SvgIcon path={tab.icon} className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-zinc-500">在线</span>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 mb-6">
            <SvgIcon path={Icons.sparkle} className="w-3.5 h-3.5 text-violet-400" />
            基于RAG检索增强生成的智能学习系统
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              让AI成为你的
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              绘画私教
            </span>
          </h2>
          <p className="text-zinc-500 text-base max-w-lg mx-auto leading-relaxed">
            输入绘画主题，AI将为你生成个性化复习卡片与测验，深度掌握素描、水彩、油画等核心技法
          </p>
        </section>

        {/* ── Features Grid (small, always visible) ── */}
        <section className="max-w-6xl mx-auto px-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Icons.brain, title: '智能卡片生成', desc: '基于RAG技术，从知识库检索相关内容，AI自动生成复习卡片', gradient: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet-400' },
              { icon: Icons.quiz, title: '自适应测验', desc: '随机抽题、智能评分，精准定位知识薄弱环节', gradient: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
              { icon: Icons.chart, title: '学习数据追踪', desc: '可视化成绩趋势，量化学习进度与效果', gradient: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <SvgIcon path={feature.icon} className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-1.5">{feature.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Content Area ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          {activeTab === 'cards' && (
            <CardsTab formData={formData} setFormData={setFormData} cards={cards} setCards={setCards} loading={loading} setLoading={setLoading} handleGenerate={handleGenerate} />
          )}
          {activeTab === 'quiz' && <QuizView />}
          {activeTab === 'stats' && <StatsView />}
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.04] py-8 text-center">
          <p className="text-xs text-zinc-600">美术生RAG复习系统 · Powered by AI & RAG</p>
        </footer>
      </div>
    </div>
  );
}

// ── Cards Tab ────────────────────────────────────────────────
function CardsTab({ formData, setFormData, cards, loading, handleGenerate }) {
  return (
    <div className="space-y-6">
      {/* Generate Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
            <SvgIcon path={Icons.plus} className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">生成复习卡片</h3>
            <p className="text-[11px] text-zinc-500">输入绘画主题，AI将自动生成复习内容</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">绘画主题</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="例如: 素描中的明暗关系"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">难度</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none"
            >
              <option value="beginner" className="bg-zinc-900">初级</option>
              <option value="intermediate" className="bg-zinc-900">中级</option>
              <option value="advanced" className="bg-zinc-900">高级</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">数量</label>
            <select
              value={formData.numQuestions}
              onChange={(e) => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none"
            >
              {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-zinc-900">{n}个问题</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-5 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-violet-500 hover:to-blue-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 transition-all duration-300 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          {loading ? <span className="flex items-center gap-2"><Spinner /> 生成中...</span> : '生成卡片'}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <CardItem key={index} card={card} index={index} />
        ))}
      </div>

      {cards.length === 0 && !loading && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
            <SvgIcon path={Icons.lightbulb} className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 font-medium mb-1">输入绘画主题，AI将为你生成复习卡片</p>
          <p className="text-zinc-600 text-xs">支持素描、水彩、油画、构图等多种绘画技法</p>
        </div>
      )}
    </div>
  );
}

// ── Flashcard ────────────────────────────────────────────────
function CardItem({ card, index }) {
  const [flipped, setFlipped] = useState(false);

  const diffMap = {
    beginner: { label: '初级', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    intermediate: { label: '中级', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    advanced: { label: '高级', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };
  const diff = diffMap[card.difficulty] || diffMap.intermediate;

  return (
    <div
      className="group cursor-pointer animate-fadeIn"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`bg-white/[0.02] border border-white/[0.06] rounded-2xl min-h-[220px] transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/5 ${flipped ? 'border-violet-500/20 bg-white/[0.04]' : ''}`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] text-zinc-600 uppercase tracking-wider">{card.topic}</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${diff.cls}`}>
              {diff.label}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            {!flipped ? (
              <div>
                <div className="bg-white/[0.03] rounded-xl px-4 py-3 mb-4 border border-white/[0.04]">
                  <p className="text-zinc-200 font-semibold leading-relaxed">{card.question}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center">
                    <SvgIcon path={Icons.eye} className="w-2.5 h-2.5 text-zinc-500" />
                  </div>
                  <span className="text-[11px] text-zinc-500 group-hover:text-violet-400 transition-colors">点击翻转查看答案</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
                  <SvgIcon path={Icons.check} className="w-3 h-3 text-violet-400" />
                  <span className="text-[11px] font-medium text-violet-400">答案</span>
                </div>
                <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.04]">
                  <p className="text-zinc-400 text-sm leading-relaxed">{card.answer}</p>
                </div>
              </div>
            )}
          </div>
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
      const cardsResponse = await cardApi.getCards({ limit: 10 });
      if (cardsResponse.data.length === 0) {
        alert('请先生成一些复习卡片');
        setLoading(false);
        return;
      }
      setCards(cardsResponse.data);
      const quizResponse = await quizApi.createQuiz({ num_cards: Math.min(5, cardsResponse.data.length) });
      setCurrentQuiz(quizResponse.data);
      setUserAnswers(quizResponse.data.card_ids.map((id) => ({ card_id: id, user_answer: '' })));
      setQuizResult(null);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('开始测验失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuiz) return;
    if (userAnswers.some((a) => !a.user_answer.trim())) {
      alert('请回答所有问题');
      return;
    }
    try {
      setLoading(true);
      const response = await quizApi.submitQuiz({ session_id: currentQuiz.id, answers: userAnswers });
      setQuizResult(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('提交失败');
    } finally {
      setLoading(false);
    }
  };

  // ── Start screen ──
  if (cards.length === 0 && !currentQuiz) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
          <SvgIcon path={Icons.quiz} className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-200 mb-2">开始测验</h3>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">从现有卡片中随机抽取5张，检测你对绘画知识的掌握程度</p>
        <button
          onClick={startQuiz}
          disabled={loading}
          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:from-zinc-700 disabled:to-zinc-700 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          {loading ? <span className="flex items-center gap-2"><Spinner /> 加载中...</span> : '开始测验'}
        </button>
      </div>
    );
  }

  // ── Results ──
  if (quizResult) {
    return (
      <div className="space-y-5">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center">
          <h3 className="text-sm font-semibold text-zinc-300 mb-5 uppercase tracking-wider">测验结果</h3>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-white/[0.06] mb-3">
            <span className="text-3xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {quizResult.score.toFixed(1)}
            </span>
          </div>
          <p className="text-zinc-500 text-xs">平均得分</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizResult.answers.map((answer, index) => {
            const card = cards.find((c) => c.id === answer.card_id);
            const correct = answer.is_correct;
            return (
              <div
                key={index}
                className={`bg-white/[0.02] rounded-2xl p-5 border transition-all ${
                  correct ? 'border-emerald-500/20' : 'border-rose-500/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    correct ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className={`text-[11px] font-semibold ${correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {answer.score.toFixed(1)} 分
                  </span>
                </div>
                <div className="bg-white/[0.03] rounded-lg px-3.5 py-2.5 mb-3 border border-white/[0.04]">
                  <p className="text-sm font-medium text-zinc-300">{card?.question}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04]">
                    <p className="text-xs text-zinc-500"><span className="text-zinc-600">你的回答：</span>{answer.user_answer}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04]">
                    <p className="text-xs text-zinc-500"><span className="text-zinc-600">正确答案：</span>{card?.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={startQuiz}
            className="px-8 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-violet-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
          >
            再来一次
          </button>
        </div>
      </div>
    );
  }

  // ── Answering ──
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
          <SvgIcon path={Icons.edit} className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">答题中</h3>
          <p className="text-[11px] text-zinc-500">认真作答每一道题</p>
        </div>
        <span className="ml-auto text-[11px] text-zinc-600 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
          {userAnswers.length} 道题
        </span>
      </div>

      <div className="space-y-4">
        {userAnswers.map((answer, index) => {
          const card = cards.find((c) => c.id === answer.card_id);
          return (
            <div key={index} className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.04]">
              <div className="flex items-start gap-3 mb-3">
                <span className="shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-[11px] font-bold text-blue-400">
                  {index + 1}
                </span>
                <div className="bg-white/[0.03] rounded-lg px-3.5 py-2 flex-1 border border-white/[0.04]">
                  <p className="text-sm font-medium text-zinc-300">{card?.question}</p>
                </div>
              </div>
              <textarea
                value={answer.user_answer}
                onChange={(e) => {
                  const newAnswers = [...userAnswers];
                  newAnswers[index].user_answer = e.target.value;
                  setUserAnswers(newAnswers);
                }}
                placeholder="输入你的答案..."
                className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                rows={3}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:from-zinc-700 disabled:to-zinc-700 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
      >
        {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> 提交中...</span> : '提交答案'}
      </button>
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
      const response = await quizApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => { loadStats(); });

  if (loading) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
        <Spinner className="w-8 h-8 mx-auto text-zinc-600" />
        <p className="text-zinc-500 mt-4 text-sm">加载中...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
          <SvgIcon path={Icons.chart} className="w-8 h-8 text-zinc-600" />
        </div>
        <p className="text-zinc-400 font-medium mb-1">暂无统计数据</p>
        <p className="text-zinc-600 text-xs">完成测验后即可查看学习统计</p>
      </div>
    );
  }

  const statItems = [
    { label: '完成测验', value: stats.total_quizzes, gradient: 'from-violet-500/20 to-purple-500/20', text: 'text-violet-400', icon: Icons.book },
    { label: '平均得分', value: stats.average_score.toFixed(1), gradient: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400', icon: Icons.chart },
    { label: '已学卡片', value: stats.total_cards_learned, gradient: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400', icon: Icons.cards },
  ];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {statItems.map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group">
            <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <SvgIcon path={stat.icon} className={`w-4 h-4 ${stat.text}`} />
            </div>
            <p className={`text-2xl font-black ${stat.text} mb-0.5`}>{stat.value}</p>
            <p className="text-[11px] text-zinc-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <SvgIcon path={Icons.chart} className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">最近表现</h3>
        </div>

        {stats.recent_performance.length > 0 ? (
          <div className="h-48 flex items-end justify-between gap-2 bg-white/[0.02] rounded-xl p-5 border border-white/[0.04]">
            {stats.recent_performance.map((score, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <span className="text-[11px] font-bold text-zinc-500 mb-1.5">{score.toFixed(0)}</span>
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-violet-600/60 to-blue-500/60 hover:from-violet-500/80 hover:to-blue-400/80 transition-all duration-300 min-w-[16px]"
                  style={{ height: `${Math.max(score, 6)}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.02] rounded-xl px-5 py-8 text-center border border-white/[0.04]">
            <p className="text-zinc-600 text-xs">暂无测验记录</p>
          </div>
        )}

        <button
          onClick={loadStats}
          className="mt-5 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
        >
          刷新统计
        </button>
      </div>
    </div>
  );
}

export default App;
