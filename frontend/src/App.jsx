import { useState, useMemo } from 'react';
import { cardApi, quizApi } from './services/api';

// 同色系配色方案
const colorSchemes = [
  {
    name: '莫兰迪蓝',
    bgGradient: 'from-slate-100 via-blue-50 to-indigo-100',
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    primaryLight: 'bg-blue-50',
    primaryText: 'text-blue-600',
    primaryBorder: 'border-blue-500',
    ring: 'ring-blue-500',
    accent: 'from-blue-500 to-indigo-500',
    accentLight: 'from-blue-100 to-indigo-100',
    navBg: 'bg-white/80',
  },
  {
    name: '樱花粉',
    bgGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    primaryLight: 'bg-rose-50',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-500',
    ring: 'ring-rose-500',
    accent: 'from-rose-500 to-pink-500',
    accentLight: 'from-rose-100 to-pink-100',
    navBg: 'bg-white/80',
  },
  {
    name: '森林绿',
    bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
    primary: 'bg-emerald-500',
    primaryHover: 'hover:bg-emerald-600',
    primaryLight: 'bg-emerald-50',
    primaryText: 'text-emerald-600',
    primaryBorder: 'border-emerald-500',
    ring: 'ring-emerald-500',
    accent: 'from-emerald-500 to-teal-500',
    accentLight: 'from-emerald-100 to-teal-100',
    navBg: 'bg-white/80',
  },
  {
    name: '紫罗兰',
    bgGradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
    primary: 'bg-violet-500',
    primaryHover: 'hover:bg-violet-600',
    primaryLight: 'bg-violet-50',
    primaryText: 'text-violet-600',
    primaryBorder: 'border-violet-500',
    ring: 'ring-violet-500',
    accent: 'from-violet-500 to-purple-500',
    accentLight: 'from-violet-100 to-purple-100',
    navBg: 'bg-white/80',
  },
  {
    name: '暖阳橙',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryLight: 'bg-orange-50',
    primaryText: 'text-orange-600',
    primaryBorder: 'border-orange-500',
    ring: 'ring-orange-500',
    accent: 'from-orange-500 to-amber-500',
    accentLight: 'from-orange-100 to-amber-100',
    navBg: 'bg-white/80',
  },
  {
    name: '深海蓝',
    bgGradient: 'from-cyan-50 via-sky-50 to-blue-50',
    primary: 'bg-cyan-600',
    primaryHover: 'hover:bg-cyan-700',
    primaryLight: 'bg-cyan-50',
    primaryText: 'text-cyan-600',
    primaryBorder: 'border-cyan-600',
    ring: 'ring-cyan-500',
    accent: 'from-cyan-500 to-sky-500',
    accentLight: 'from-cyan-100 to-sky-100',
    navBg: 'bg-white/80',
  },
];

const tabColorMap = {
  cards: 0,
  quiz: 2,
  stats: 4,
};

function App() {
  const [activeTab, setActiveTab] = useState('cards');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customColorIndex, setCustomColorIndex] = useState(null);

  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'intermediate',
    numQuestions: 1,
  });

  const currentScheme = useMemo(() => {
    const index = customColorIndex !== null ? customColorIndex : tabColorMap[activeTab];
    return colorSchemes[index % colorSchemes.length];
  }, [activeTab, customColorIndex]);

  const randomizeColor = () => {
    const randomIndex = Math.floor(Math.random() * colorSchemes.length);
    setCustomColorIndex(randomIndex);
  };

  const resetColor = () => {
    setCustomColorIndex(null);
  };

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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentScheme.bgGradient} transition-colors duration-500`}>
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentScheme.accent} flex items-center justify-center shadow-md`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">美术生RAG复习系统</h1>
              <p className="text-sm text-gray-500 mt-0.5">专注于绘画技法领域的智能学习助手</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1.5 rounded-full ${currentScheme.primaryLight} ${currentScheme.primaryText} font-medium`}>
              {currentScheme.name}
            </span>
            <button
              onClick={randomizeColor}
              className="p-2.5 rounded-xl bg-white shadow-md hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:rotate-180"
              title="随机切换颜色"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation - Pill Style */}
      <nav className="bg-white/50 backdrop-blur-xl border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 bg-gray-100/80 rounded-2xl p-1.5 w-fit">
            {[
              { key: 'cards', label: '复习卡片', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { key: 'quiz', label: '测验', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { key: 'stats', label: '统计', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); resetColor(); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? `bg-white shadow-md ${currentScheme.primaryText}`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'cards' && (
          <div className="space-y-8">
            {/* Generate Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentScheme.accent} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">生成复习卡片</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    绘画主题
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="例如: 素描中的明暗关系"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:${currentScheme.ring}/30 focus:border-current transition-all bg-white/80 text-gray-800 placeholder:text-gray-400`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    难度
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:${currentScheme.ring}/30 focus:border-current transition-all bg-white/80 text-gray-800`}
                  >
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    生成数量
                  </label>
                  <select
                    value={formData.numQuestions}
                    onChange={(e) => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:${currentScheme.ring}/30 focus:border-current transition-all bg-white/80 text-gray-800`}
                  >
                    <option value="1">1个问题</option>
                    <option value="2">2个问题</option>
                    <option value="3">3个问题</option>
                    <option value="4">4个问题</option>
                    <option value="5">5个问题</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`mt-6 px-8 py-3 bg-gradient-to-r ${currentScheme.accent} text-white rounded-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    生成中...
                  </span>
                ) : '生成卡片'}
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <CardItem key={index} card={card} scheme={currentScheme} index={index} />
              ))}
            </div>

            {cards.length === 0 && !loading && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-16 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${currentScheme.accentLight} flex items-center justify-center`}>
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">输入绘画主题，AI将为您生成复习卡片</p>
                <p className="text-gray-400 text-sm mt-2">支持素描、水彩、油画等多种绘画技法主题</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && <QuizView scheme={currentScheme} />}

        {activeTab === 'stats' && <StatsView scheme={currentScheme} />}
      </main>
    </div>
  );
}

function CardItem({ card, scheme, index }) {
  const [flipped, setFlipped] = useState(false);

  const difficultyConfig = {
    beginner: { label: '初级', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    intermediate: { label: '中级', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    advanced: { label: '高级', color: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  };

  const diff = difficultyConfig[card.difficulty] || difficultyConfig.intermediate;

  return (
    <div
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-md shadow-gray-200/50 border border-white/60 min-h-[280px] transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-white/80 ${flipped ? 'ring-2 ring-gray-200' : ''}`}>
        <div className="p-7 h-full flex flex-col">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${diff.dot}`}></span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{card.topic}</span>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${diff.color}`}>
              {diff.label}
            </span>
          </div>

          {/* Card Content */}
          <div className="flex-1">
            {!flipped ? (
              <div className="animate-fadeIn">
                <p className="text-gray-800 font-bold text-lg leading-relaxed mb-4">{card.question}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${scheme.accentLight} flex items-center justify-center`}>
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className={`text-sm ${scheme.primaryText} font-medium`}>点击翻转查看答案</span>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${scheme.accentLight} mb-4`}>
                  <svg className={`w-3.5 h-3.5 ${scheme.primaryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-xs font-semibold ${scheme.primaryText}`}>答案</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-[15px]">{card.answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizView({ scheme }) {
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
      setUserAnswers(
        quizResponse.data.card_ids.map((id) => ({ card_id: id, user_answer: '' }))
      );
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

    const hasEmptyAnswers = userAnswers.some((a) => !a.user_answer.trim());
    if (hasEmptyAnswers) {
      alert('请回答所有问题');
      return;
    }

    try {
      setLoading(true);
      const response = await quizApi.submitQuiz({
        session_id: currentQuiz.id,
        answers: userAnswers,
      });
      setQuizResult(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('提交失败');
    } finally {
      setLoading(false);
    }
  };

  if (cards.length === 0 && !currentQuiz) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-16 text-center max-w-lg mx-auto">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${scheme.accentLight} flex items-center justify-center`}>
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-800">开始测验</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">测验将从现有卡片中随机抽取5张进行测试<br />检测你对绘画知识的掌握程度</p>
        <button
          onClick={startQuiz}
          disabled={loading}
          className={`px-10 py-3 bg-gradient-to-r ${scheme.accent} text-white rounded-2xl disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium`}
        >
          {loading ? '加载中...' : '开始测验'}
        </button>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="space-y-6">
        {/* Score Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-10 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6">测验结果</h2>
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br ${scheme.accentLight} mb-4`}>
            <span className={`text-4xl font-black ${scheme.primaryText}`}>{quizResult.score.toFixed(1)}</span>
          </div>
          <p className="text-gray-500">平均得分</p>
        </div>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizResult.answers.map((answer, index) => {
            const card = cards.find((c) => c.id === answer.card_id);
            return (
              <div
                key={index}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  answer.is_correct
                    ? 'bg-emerald-50/80 border-emerald-200 shadow-md shadow-emerald-100/50'
                    : 'bg-rose-50/80 border-rose-200 shadow-md shadow-rose-100/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    answer.is_correct ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className={`text-xs font-semibold ${answer.is_correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {answer.score.toFixed(1)} 分
                  </span>
                </div>
                <p className="font-semibold mb-3 text-gray-800">{card?.question}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-500">你的回答:</span> {answer.user_answer}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-500">正确答案:</span> {card?.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={startQuiz}
            className={`px-10 py-3 bg-gradient-to-r ${scheme.accent} text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium`}
          >
            再来一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${scheme.accent} flex items-center justify-center`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">答题中</h2>
          <span className="text-sm text-gray-400 ml-auto">{userAnswers.length} 道题</span>
        </div>

        <div className="space-y-6">
          {userAnswers.map((answer, index) => {
            const card = cards.find((c) => c.id === answer.card_id);
            return (
              <div key={index} className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <span className={`shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${scheme.accent} flex items-center justify-center text-white text-xs font-bold`}>
                    {index + 1}
                  </span>
                  <p className="font-semibold text-gray-800 pt-0.5">{card?.question}</p>
                </div>
                <textarea
                  value={answer.user_answer}
                  onChange={(e) => {
                    const newAnswers = [...userAnswers];
                    newAnswers[index].user_answer = e.target.value;
                    setUserAnswers(newAnswers);
                  }}
                  placeholder="输入你的答案..."
                  className={`w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:${scheme.ring}/30 focus:border-current transition-all bg-white/80 text-gray-800 placeholder:text-gray-400 resize-none`}
                  rows={3}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-8 w-full py-3.5 bg-gradient-to-r ${scheme.accent} text-white rounded-2xl disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium text-lg`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              提交中...
            </span>
          ) : '提交答案'}
        </button>
      </div>
    </div>
  );
}

function StatsView({ scheme }) {
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

  useState(() => {
    loadStats();
  });

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-16 text-center">
        <svg className="animate-spin w-8 h-8 mx-auto text-gray-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 mt-4">加载中...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-16 text-center">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${scheme.accentLight} flex items-center justify-center`}>
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">暂无统计数据</p>
        <p className="text-gray-400 text-sm mt-2">完成测验后即可查看学习统计</p>
      </div>
    );
  }

  const statCards = [
    { label: '完成测验次数', value: stats.total_quizzes, gradient: 'from-blue-500 to-indigo-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: '平均得分', value: stats.average_score.toFixed(1), gradient: 'from-emerald-500 to-teal-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: '已学习卡片数', value: stats.total_cards_learned, gradient: 'from-violet-500 to-purple-500', lightBg: 'bg-violet-50', textColor: 'text-violet-600', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-7 hover:shadow-xl transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-5 shadow-md`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <p className={`text-4xl font-black ${stat.textColor} mb-1`}>{stat.value}</p>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-white/60 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${scheme.accent} flex items-center justify-center`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">最近表现</h3>
        </div>

        {stats.recent_performance.length > 0 ? (
          <div className="h-56 flex items-end justify-between gap-3 bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
            {stats.recent_performance.map((score, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-gray-500 mb-2">{score.toFixed(0)}</span>
                <div
                  className={`w-full rounded-xl bg-gradient-to-t ${scheme.accent} transition-all duration-500 hover:opacity-80 min-w-[28px]`}
                  style={{ height: `${Math.max(score, 8)}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">暂无测验记录</p>
          </div>
        )}

        <button
          onClick={loadStats}
          className={`mt-6 w-full py-3.5 bg-gradient-to-r ${scheme.accent} text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium`}
        >
          刷新统计
        </button>
      </div>
    </div>
  );
}

export default App;
