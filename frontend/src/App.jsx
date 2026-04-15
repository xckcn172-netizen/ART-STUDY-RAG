import { useState, useMemo } from 'react';
import { cardApi, quizApi } from './services/api';

// 同色系配色方案
const colorSchemes = [
  {
    name: '莫兰迪蓝',
    bg: 'bg-slate-50',
    bgGradient: 'from-slate-100 to-blue-100',
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    primaryLight: 'bg-blue-50',
    primaryText: 'text-blue-600',
    primaryBorder: 'border-blue-500',
    cardBg: 'bg-white',
    navBg: 'bg-white/90',
  },
  {
    name: '樱花粉',
    bg: 'bg-rose-50',
    bgGradient: 'from-rose-50 to-pink-100',
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    primaryLight: 'bg-rose-50',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-500',
    cardBg: 'bg-white',
    navBg: 'bg-white/90',
  },
  {
    name: '森林绿',
    bg: 'bg-emerald-50',
    bgGradient: 'from-emerald-50 to-green-100',
    primary: 'bg-emerald-500',
    primaryHover: 'hover:bg-emerald-600',
    primaryLight: 'bg-emerald-50',
    primaryText: 'text-emerald-600',
    primaryBorder: 'border-emerald-500',
    cardBg: 'bg-white',
    navBg: 'bg-white/90',
  },
  {
    name: '紫罗兰',
    bg: 'bg-violet-50',
    bgGradient: 'from-violet-50 to-purple-100',
    primary: 'bg-violet-500',
    primaryHover: 'hover:bg-violet-600',
    primaryLight: 'bg-violet-50',
    primaryText: 'text-violet-600',
    primaryBorder: 'border-violet-500',
    cardBg: 'bg-white',
    navBg: 'bg-white/90',
  },
  {
    name: '暖阳橙',
    bg: 'bg-orange-50',
    bgGradient: 'from-orange-50 to-amber-100',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryLight: 'bg-orange-50',
    primaryText: 'text-orange-600',
    primaryBorder: 'border-orange-500',
    cardBg: 'bg-white',
    navBg: 'bg-white/90',
  },
  {
    name: '深海蓝',
    bg: 'bg-cyan-50',
    bgGradient: 'from-cyan-50 to-sky-100',
    primary: 'bg-cyan-600',
    primaryHover: 'hover:bg-cyan-700',
    primaryLight: 'bg-cyan-50',
    primaryText: 'text-cyan-600',
    primaryBorder: 'border-cyan-600',
    cardBg: 'bg-white',
    navBg: 'bg-white/90',
  },
];

// 为每个tab分配不同的配色方案索引
const tabColorMap = {
  cards: 0,  // 莫兰迪蓝
  quiz: 2,   // 森林绿
  stats: 4,  // 暖阳橙
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

  // 获取当前配色方案
  const currentScheme = useMemo(() => {
    const index = customColorIndex !== null ? customColorIndex : tabColorMap[activeTab];
    return colorSchemes[index % colorSchemes.length];
  }, [activeTab, customColorIndex]);

  // 随机切换颜色
  const randomizeColor = () => {
    const randomIndex = Math.floor(Math.random() * colorSchemes.length);
    setCustomColorIndex(randomIndex);
  };

  // 重置为默认颜色
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
    <div className={`min-h-screen bg-gradient-to-br ${currentScheme.bgGradient}`}>
      {/* Header */}
      <header className={`${currentScheme.navBg} backdrop-blur-sm shadow-sm border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">美术生RAG复习系统</h1>
            <p className="text-gray-600 mt-1">专注于绘画技法领域的智能学习助手</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">主题: {currentScheme.name}</span>
            <button
              onClick={randomizeColor}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
              title="随机切换颜色"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${currentScheme.navBg} backdrop-blur-sm border-b`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => { setActiveTab('cards'); resetColor(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'cards'
                  ? `${currentScheme.primaryBorder} ${currentScheme.primaryText}`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              复习卡片
            </button>
            <button
              onClick={() => { setActiveTab('quiz'); resetColor(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'quiz'
                  ? `${currentScheme.primaryBorder} ${currentScheme.primaryText}`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              测验
            </button>
            <button
              onClick={() => { setActiveTab('stats'); resetColor(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'stats'
                  ? `${currentScheme.primaryBorder} ${currentScheme.primaryText}`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              统计
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'cards' && (
          <div>
            {/* Generate Form */}
            <div className={`${currentScheme.cardBg} rounded-2xl shadow-lg p-6 mb-8 border border-gray-100`}>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">生成复习卡片</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    绘画主题
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="例如: 素描中的明暗关系"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    难度
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-all"
                  >
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生成数量
                  </label>
                  <select
                    value={formData.numQuestions}
                    onChange={(e) => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-all"
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
                className={`mt-4 w-full md:w-auto px-6 py-2.5 ${currentScheme.primary} text-white rounded-lg ${currentScheme.primaryHover} disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                {loading ? '生成中...' : '生成卡片'}
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <CardItem key={index} card={card} scheme={currentScheme} />
              ))}
            </div>

            {cards.length === 0 && !loading && (
              <div className={`text-center py-16 ${currentScheme.cardBg} rounded-2xl shadow-md border border-gray-100`}>
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-gray-500">输入绘画主题，AI将为您生成复习卡片</p>
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

function CardItem({ card, scheme }) {
  const [flipped, setFlipped] = useState(false);

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-800',
    intermediate: 'bg-amber-100 text-amber-800',
    advanced: 'bg-rose-100 text-rose-800',
  };

  return (
    <div
      className={`${scheme.cardBg} rounded-2xl shadow-lg cursor-pointer min-h-64 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="p-6 h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-medium text-gray-500">{card.topic}</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full ${difficultyColors[card.difficulty]}`}>
            {card.difficulty === 'beginner' ? '初级' : card.difficulty === 'intermediate' ? '中级' : '高级'}
          </span>
        </div>

        {!flipped ? (
          <div>
            <p className="text-gray-800 font-semibold mb-2">问: {card.question}</p>
            <p className={`text-sm ${scheme.primaryText}`}>点击查看答案</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-800 font-semibold mb-2">答:</p>
            <p className="text-gray-700 leading-relaxed">{card.answer}</p>
          </div>
        )}
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
      // Get cards first
      const cardsResponse = await cardApi.getCards({ limit: 10 });
      if (cardsResponse.data.length === 0) {
        alert('请先生成一些复习卡片');
        setLoading(false);
        return;
      }

      setCards(cardsResponse.data);

      // Create quiz with random 5 cards
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
      <div className={`${scheme.cardBg} rounded-2xl shadow-lg p-8 text-center border border-gray-100`}>
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">开始测验</h2>
        <p className="text-gray-600 mb-4">测验将从现有卡片中随机抽取5张进行测试</p>
        <button
          onClick={startQuiz}
          disabled={loading}
          className={`px-8 py-2.5 ${scheme.primary} text-white rounded-lg ${scheme.primaryHover} disabled:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg`}
        >
          {loading ? '加载中...' : '开始测验'}
        </button>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className={`${scheme.cardBg} rounded-2xl shadow-lg p-8 border border-gray-100`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">测验结果</h2>
        <div className="text-center mb-8">
          <p className={`text-6xl font-bold ${scheme.primaryText}`}>{quizResult.score.toFixed(1)}</p>
          <p className="text-gray-600 mt-2">平均得分</p>
        </div>

        <div className="space-y-4">
          {quizResult.answers.map((answer, index) => {
            const card = cards.find((c) => c.id === answer.card_id);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  answer.is_correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <p className="font-semibold mb-2 text-gray-800">{card?.question}</p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">你的回答:</span> {answer.user_answer}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">正确答案:</span> {card?.answer}
                </p>
                <p className="text-sm mt-2">
                  <span className={`font-medium ${answer.is_correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                    得分: {answer.score.toFixed(1)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={startQuiz}
          className={`mt-8 w-full px-6 py-2.5 ${scheme.primary} text-white rounded-lg ${scheme.primaryHover} transition-all duration-300 shadow-md hover:shadow-lg`}
        >
          再来一次
        </button>
      </div>
    );
  }

  return (
    <div className={`${scheme.cardBg} rounded-2xl shadow-lg p-8 border border-gray-100`}>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">测验</h2>

      <div className="space-y-6">
        {userAnswers.map((answer, index) => {
          const card = cards.find((c) => c.id === answer.card_id);
          return (
            <div key={index} className="border-b border-gray-200 pb-4">
              <p className="font-semibold mb-2 text-gray-800">{card?.question}</p>
              <textarea
                value={answer.user_answer}
                onChange={(e) => {
                  const newAnswers = [...userAnswers];
                  newAnswers[index].user_answer = e.target.value;
                  setUserAnswers(newAnswers);
                }}
                placeholder="输入你的答案..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-all"
                rows={3}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-6 w-full px-6 py-2.5 ${scheme.primary} text-white rounded-lg ${scheme.primaryHover} disabled:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg`}
      >
        {loading ? '提交中...' : '提交答案'}
      </button>
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
      <div className={`${scheme.cardBg} rounded-2xl shadow-lg p-8 text-center border border-gray-100`}>
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`${scheme.cardBg} rounded-2xl shadow-lg p-8 text-center border border-gray-100`}>
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-500">暂无统计数据</p>
      </div>
    );
  }

  return (
    <div className={`${scheme.cardBg} rounded-2xl shadow-lg p-8 border border-gray-100`}>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">学习统计</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${scheme.primaryLight} rounded-xl p-6 text-center border border-gray-100`}>
          <p className={`text-3xl font-bold ${scheme.primaryText}`}>{stats.total_quizzes}</p>
          <p className="text-gray-600 mt-1">完成测验次数</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-3xl font-bold text-emerald-600">{stats.average_score.toFixed(1)}</p>
          <p className="text-gray-600 mt-1">平均得分</p>
        </div>
        <div className="bg-violet-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-3xl font-bold text-violet-600">{stats.total_cards_learned}</p>
          <p className="text-gray-600 mt-1">已学习卡片数</p>
        </div>
      </div>

      <h3 className="font-semibold mb-4 text-gray-800">最近表现</h3>
      {stats.recent_performance.length > 0 ? (
        <div className="h-64 flex items-end justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
          {stats.recent_performance.map((score, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`${scheme.primary} rounded-t transition-all duration-300 hover:opacity-80`}
                style={{ width: '30px', height: `${score}%` }}
              />
              <p className="text-xs mt-2 text-gray-600">{score.toFixed(0)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">暂无测验记录</p>
      )}

      <button
        onClick={loadStats}
        className={`mt-6 w-full px-6 py-2.5 ${scheme.primary} text-white rounded-lg ${scheme.primaryHover} transition-all duration-300 shadow-md hover:shadow-lg`}
      >
        刷新统计
      </button>
    </div>
  );
}

export default App;
