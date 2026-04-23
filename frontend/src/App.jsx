import { useState } from 'react';
import { cardApi, quizApi } from './services/api';

const I = {
  cards:'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  quiz:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  stats:'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  plus:'M12 6v6m0 0v6m0-6h6m-6 0H6',
  eye:'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  check:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  edit:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  lightbulb:'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  sparkle:'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  palette:'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  brain:'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5',
  book:'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  refresh:'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182',
};

function Svg({path,className='w-5 h-5'}) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path}/></svg>;
}
function Spin({className='w-4 h-4'}) {
  return <svg className={`animate-spin ${className}`} viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>;
}

// ── App ──────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('cards');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ topic:'', difficulty:'intermediate', numQuestions:1 });

  const handleGenerate = async () => {
    if (!formData.topic.trim()) { alert('请输入绘画主题'); return; }
    setLoading(true);
    try {
      const r = await cardApi.generateCards({ topic:formData.topic, difficulty:formData.difficulty, num_questions:formData.numQuestions });
      setCards(r.data);
    } catch { alert('生成失败'); } finally { setLoading(false); }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#09090b] text-white flex">
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none"><div className="absolute -top-48 -left-24 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]"/><div className="absolute -bottom-32 right-[20%] w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]"/></div>

      {/* ── Sidebar ── */}
      <aside className="relative z-10 w-52 shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center shadow-lg shadow-violet-500/20"><Svg path={I.palette} className="w-3.5 h-3.5 text-white"/></div>
            <div><p className="text-xs font-bold">美术生RAG</p><p className="text-[9px] text-zinc-600">AI Study</p></div>
          </div>
        </div>
        <nav className="p-2 flex-1">
          {[
            {key:'cards',label:'复习卡片',icon:I.cards},
            {key:'quiz',label:'测验模式',icon:I.quiz},
            {key:'stats',label:'学习统计',icon:I.stats},
          ].map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all mb-0.5 ${activeTab===t.key?'bg-violet-500/15 text-violet-300':'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'}`}>
              <Svg path={t.icon} className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center gap-1.5"><Svg path={I.brain} className="w-3 h-3 text-violet-400/60"/><span className="text-[10px] text-zinc-600">RAG知识库</span></div>
          <div className="flex items-center gap-1.5"><Svg path={I.sparkle} className="w-3 h-3 text-violet-400/60"/><span className="text-[10px] text-zinc-600">AI驱动</span></div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-violet-500"/><span className="text-[10px] text-zinc-600">在线</span></div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <div className="h-10 shrink-0 border-b border-white/[0.06] flex items-center px-5 gap-3">
          <span className="text-xs font-semibold text-zinc-300">{activeTab==='cards'?'复习卡片':activeTab==='quiz'?'测验模式':'学习统计'}</span>
          <span className="text-[10px] text-zinc-700">|</span>
          <span className="text-[10px] text-zinc-500">{activeTab==='cards'?'生成与管理':activeTab==='quiz'?'知识检测':'数据分析'}</span>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          {activeTab==='cards' && <CardsTab formData={formData} setFormData={setFormData} cards={cards} loading={loading} handleGenerate={handleGenerate}/>}
          {activeTab==='quiz' && <QuizView/>}
          {activeTab==='stats' && <StatsView/>}
        </div>
      </div>
    </div>
  );
}

// ── Cards Tab ────────────────────────────────────────────────
function CardsTab({formData,setFormData,cards,loading,handleGenerate}) {
  return (
    <div className="h-full flex gap-4">
      <div className="w-[340px] shrink-0 flex flex-col gap-3">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center"><Svg path={I.plus} className="w-3 h-3 text-violet-400"/></div>
            <span className="text-xs font-semibold text-zinc-200">生成卡片</span>
          </div>
          <div className="space-y-2.5">
            <input type="text" value={formData.topic} onChange={e=>setFormData({...formData,topic:e.target.value})} placeholder="绘画主题，如：素描明暗关系"
              className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all"/>
            <div className="grid grid-cols-2 gap-2">
              <select value={formData.difficulty} onChange={e=>setFormData({...formData,difficulty:e.target.value})}
                className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500/40 transition-all appearance-none">
                <option value="beginner" className="bg-zinc-900">初级</option>
                <option value="intermediate" className="bg-zinc-900">中级</option>
                <option value="advanced" className="bg-zinc-900">高级</option>
              </select>
              <select value={formData.numQuestions} onChange={e=>setFormData({...formData,numQuestions:parseInt(e.target.value)})}
                className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500/40 transition-all appearance-none">
                {[1,2,3,4,5].map(n=><option key={n} value={n} className="bg-zinc-900">{n}题</option>)}
              </select>
            </div>
            <button onClick={handleGenerate} disabled={loading}
              className="w-full py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-500 disabled:bg-zinc-700 transition-all">
              {loading?<span className="flex items-center justify-center gap-1.5"><Spin className="w-3 h-3"/>生成中...</span>:'生成卡片'}
            </button>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex-1">
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2">支持主题</p>
          <div className="grid grid-cols-2 gap-1.5">
            {['素描技法','色彩理论','构图原则','水彩技法','油画基础','速写训练'].map((t,i)=>(
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.02] rounded border border-white/[0.04]">
                <div className="w-1 h-1 rounded-full bg-violet-500/50"/><span className="text-[10px] text-zinc-600">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">复习卡片 ({cards.length})</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {cards.length===0&&!loading?(
            <div className="h-full flex flex-col items-center justify-center bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <Svg path={I.lightbulb} className="w-8 h-8 text-zinc-700 mb-2"/>
              <p className="text-xs text-zinc-500">填写左侧表单生成卡片</p>
            </div>
          ):cards.map((card,i)=><CardItem key={i} card={card} index={i}/>)}
        </div>
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────
function CardItem({card,index}) {
  const [flipped,setFlipped]=useState(false);
  const dm={beginner:{l:'初级',c:'bg-violet-500/10 text-violet-400 border-violet-500/20'},intermediate:{l:'中级',c:'bg-violet-500/15 text-violet-300 border-violet-500/30'},advanced:{l:'高级',c:'bg-violet-500/20 text-violet-200 border-violet-400/30'}};
  const d=dm[card.difficulty]||dm.intermediate;
  return (
    <div className="group cursor-pointer" onClick={()=>setFlipped(!flipped)}>
      <div className={`bg-white/[0.02] border rounded-xl transition-all hover:bg-white/[0.04] hover:-translate-y-px hover:shadow-lg hover:shadow-violet-500/5 ${flipped?'border-violet-500/25 bg-white/[0.04]':'border-white/[0.06]'}`}>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-zinc-600 uppercase tracking-wider">{card.topic}</span>
            <span className={`text-[9px] px-1.5 py-px rounded-full border font-medium ${d.c}`}>{d.l}</span>
          </div>
          {!flipped?(
            <div>
              <div className="bg-white/[0.03] rounded-lg px-3 py-2 mb-2 border border-white/[0.04]">
                <p className="text-xs text-zinc-200 font-medium leading-relaxed">{card.question}</p>
              </div>
              <div className="flex items-center gap-1"><Svg path={I.eye} className="w-2.5 h-2.5 text-zinc-600"/><span className="text-[9px] text-zinc-600 group-hover:text-violet-400 transition-colors">点击翻转</span></div>
            </div>
          ):(
            <div>
              <div className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-violet-500/10 border border-violet-500/20 mb-2">
                <Svg path={I.check} className="w-2.5 h-2.5 text-violet-400"/><span className="text-[9px] font-medium text-violet-400">答案</span>
              </div>
              <div className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
                <p className="text-xs text-zinc-400 leading-relaxed">{card.answer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Quiz ─────────────────────────────────────────────────────
function QuizView() {
  const [cards,setCards]=useState([]);
  const [currentQuiz,setCurrentQuiz]=useState(null);
  const [userAnswers,setUserAnswers]=useState([]);
  const [quizResult,setQuizResult]=useState(null);
  const [loading,setLoading]=useState(false);

  const startQuiz=async()=>{
    try{setLoading(true);const cr=await cardApi.getCards({limit:10});
    if(!cr.data.length){alert('请先生成卡片');setLoading(false);return;}
    setCards(cr.data);const qr=await quizApi.createQuiz({num_cards:Math.min(5,cr.data.length)});
    setCurrentQuiz(qr.data);setUserAnswers(qr.data.card_ids.map(id=>({card_id:id,user_answer:''})));setQuizResult(null);
    }catch{alert('失败');}finally{setLoading(false);}
  };
  const handleSubmit=async()=>{
    if(!currentQuiz)return;if(userAnswers.some(a=>!a.user_answer.trim())){alert('请回答所有问题');return;}
    try{setLoading(true);const r=await quizApi.submitQuiz({session_id:currentQuiz.id,answers:userAnswers});setQuizResult(r.data);}catch{alert('提交失败');}finally{setLoading(false);}
  };

  if(!cards.length&&!currentQuiz) return (
    <div className="h-full grid grid-cols-2 gap-4">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center">
        <Svg path={I.quiz} className="w-8 h-8 text-violet-400 mb-3"/>
        <p className="text-sm font-semibold text-zinc-200 mb-1">开始测验</p>
        <p className="text-[11px] text-zinc-500 mb-5">随机抽取5张卡片检测掌握度</p>
        <button onClick={startQuiz} disabled={loading}
          className="px-6 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-500 disabled:bg-zinc-700 transition-all">
          {loading?<span className="flex items-center gap-1.5"><Spin className="w-3 h-3"/>加载中</span>:'开始测验'}
        </button>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-3">测验流程</p>
        <div className="space-y-3">
          {[{n:'01',t:'随机抽题',d:'从已有卡片中随机抽取'},{n:'02',t:'自由作答',d:'用自己的语言描述'},{n:'03',t:'AI评分',d:'语义对比给出分数'},{n:'04',t:'查看结果',d:'详细得分与正确答案'}].map((s,i)=>(
            <div key={i} className="flex gap-2.5"><span className="text-[10px] font-bold text-violet-400/50 w-5">{s.n}</span><div><p className="text-[11px] font-medium text-zinc-300">{s.t}</p><p className="text-[10px] text-zinc-600">{s.d}</p></div></div>
          ))}
        </div>
      </div>
    </div>
  );

  if(quizResult) return (
    <div className="h-full flex flex-col gap-3">
      <div className="grid grid-cols-[180px_1fr] gap-3">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-violet-400">{quizResult.score.toFixed(1)}</span>
          <span className="text-[9px] text-zinc-500 mt-0.5">平均分</span>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 flex items-center justify-between">
          <div className="flex gap-5">
            <div><p className="text-base font-bold text-violet-400">{quizResult.answers.filter(a=>a.is_correct).length}</p><p className="text-[9px] text-zinc-500">正确</p></div>
            <div><p className="text-base font-bold text-zinc-400">{quizResult.answers.filter(a=>!a.is_correct).length}</p><p className="text-[9px] text-zinc-500">待提高</p></div>
            <div><p className="text-base font-bold text-zinc-300">{quizResult.answers.length}</p><p className="text-[9px] text-zinc-500">总题数</p></div>
          </div>
          <button onClick={startQuiz} className="px-4 py-1.5 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-500 transition-all">再来一次</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 content-start">
        {quizResult.answers.map((a,i)=>{
          const c=cards.find(x=>x.id===a.card_id);
          return (
            <div key={i} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.06]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] font-bold px-1 py-px rounded border bg-violet-500/10 text-violet-400 border-violet-500/20">#{i+1}</span>
                <span className="text-[10px] font-semibold text-violet-400">{a.score.toFixed(1)}分</span>
              </div>
              <div className="bg-white/[0.03] rounded px-2.5 py-1.5 mb-1.5 border border-white/[0.04]"><p className="text-[11px] text-zinc-300">{c?.question}</p></div>
              <div className="space-y-1">
                <div className="bg-white/[0.02] rounded px-2 py-1 border border-white/[0.04]"><p className="text-[10px] text-zinc-500"><span className="text-zinc-600">你：</span>{a.user_answer}</p></div>
                <div className="bg-white/[0.02] rounded px-2 py-1 border border-white/[0.04]"><p className="text-[10px] text-zinc-500"><span className="text-zinc-600">答：</span>{c?.answer}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-full grid grid-cols-2 gap-4">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2"><Svg path={I.edit} className="w-3.5 h-3.5 text-violet-400"/><span className="text-xs font-semibold text-zinc-200">答题中</span></div>
          <span className="text-[9px] text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{userAnswers.length}题</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {userAnswers.map((a,i)=>{
            const c=cards.find(x=>x.id===a.card_id);
            return (
              <div key={i} className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                <div className="flex items-start gap-2 mb-2">
                  <span className="shrink-0 w-4 h-4 rounded bg-violet-500/15 flex items-center justify-center text-[9px] font-bold text-violet-400">{i+1}</span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">{c?.question}</p>
                </div>
                <textarea value={a.user_answer} onChange={e=>{const x=[...userAnswers];x[i].user_answer=e.target.value;setUserAnswers(x);}}
                  placeholder="输入答案..." className="w-full px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all resize-none" rows={2}/>
              </div>
            );
          })}
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="mt-3 w-full py-2 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-500 disabled:bg-zinc-700 transition-all shrink-0">
          {loading?<span className="flex items-center justify-center gap-1.5"><Spin className="w-3 h-3"/>提交中</span>:'提交答案'}
        </button>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-3">答题提示</p>
        <div className="space-y-2">
          {[{t:'用自己语言描述，避免照搬'},{t:'包含专业术语会加分'},{t:'答案越详细得分越高'},{t:'先构思再动笔'}].map((tip,i)=>(
            <div key={i} className="flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-violet-500/50 mt-1.5 shrink-0"/><p className="text-[11px] text-zinc-500">{tip.t}</p></div>
          ))}
        </div>
        <div className="mt-4 bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-1"><Svg path={I.lightbulb} className="w-3 h-3 text-violet-400/60"/><span className="text-[10px] text-zinc-400">评分机制</span></div>
          <p className="text-[10px] text-zinc-600 leading-relaxed">AI对比你的回答与标准答案的语义相似度，综合评估准确度、完整性和专业性，给出0-10分。</p>
        </div>
      </div>
    </div>
  );
}

// ── Stats ────────────────────────────────────────────────────
function StatsView() {
  const [stats,setStats]=useState(null);
  const [loading,setLoading]=useState(false);
  const loadStats=async()=>{try{setLoading(true);const r=await quizApi.getStats();setStats(r.data);}catch(e){console.error(e);}finally{setLoading(false);}};
  useState(()=>{loadStats();});

  if(loading) return <div className="h-full flex items-center justify-center"><Spin className="w-6 h-6 text-violet-400"/></div>;

  if(!stats) return (
    <div className="h-full grid grid-cols-2 gap-4">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center">
        <Svg path={I.stats} className="w-8 h-8 text-zinc-700 mb-2"/><p className="text-xs text-zinc-400">暂无数据</p><p className="text-[10px] text-zinc-600">完成测验后查看</p>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-3">获取数据步骤</p>
        {[{n:'01',t:'生成复习卡片'},{n:'02',t:'完成一次测验'},{n:'03',t:'查看统计数据'}].map((s,i)=>(
          <div key={i} className="flex gap-2 mb-2"><span className="text-[10px] font-bold text-violet-400/50 w-5">{s.n}</span><p className="text-[11px] text-zinc-500">{s.t}</p></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            {l:'完成测验',v:stats.total_quizzes,ic:I.book},
            {l:'平均分',v:stats.average_score.toFixed(1),ic:I.stats},
            {l:'已学卡片',v:stats.total_cards_learned,ic:I.cards},
          ].map((s,i)=>(
            <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-center group hover:bg-white/[0.04] transition-all">
              <div className="w-7 h-7 mx-auto rounded-lg bg-violet-500/15 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Svg path={s.ic} className="w-3 h-3 text-violet-400"/>
              </div>
              <p className="text-lg font-black text-violet-400">{s.v}</p>
              <p className="text-[9px] text-zinc-500">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Svg path={I.stats} className="w-3.5 h-3.5 text-violet-400"/><span className="text-xs font-semibold text-zinc-200">成绩趋势</span></div>
            <button onClick={loadStats} className="text-[9px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"><Svg path={I.refresh} className="w-2.5 h-2.5"/>刷新</button>
          </div>
          {stats.recent_performance.length>0?(
            <div className="flex-1 flex items-end justify-between gap-1.5 bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
              {stats.recent_performance.map((s,i)=>(
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-[9px] font-bold text-zinc-500 mb-1">{s.toFixed(0)}</span>
                  <div className="w-full rounded bg-gradient-to-t from-violet-600/50 to-violet-400/50 hover:from-violet-500/70 hover:to-violet-300/70 transition-all" style={{height:`${Math.max(s,5)}%`}}/>
                </div>
              ))}
            </div>
          ):<div className="flex-1 flex items-center justify-center"><p className="text-[10px] text-zinc-600">暂无记录</p></div>}
        </div>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col">
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-3">学习洞察</p>
        <div className="space-y-2.5 flex-1">
          <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
            <div className="flex items-center gap-1.5 mb-1"><Svg path={I.stats} className="w-3 h-3 text-violet-400"/><span className="text-[10px] font-medium text-zinc-300">表现评估</span></div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">{stats.average_score>=7?'表现优秀，继续保持！':stats.average_score>=4?'中等水平，建议加强薄弱点。':'需要更多练习，从初级开始。'}</p>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
            <div className="flex items-center gap-1.5 mb-2"><Svg path={I.book} className="w-3 h-3 text-violet-400"/><span className="text-[10px] font-medium text-zinc-300">学习进度</span></div>
            <div className="flex justify-between mb-1"><span className="text-[9px] text-zinc-500">已掌握</span><span className="text-[9px] text-zinc-400">{stats.total_cards_learned}张</span></div>
            <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{width:`${Math.min(100,stats.total_cards_learned*5)}%`}}/></div>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
            <div className="flex items-center gap-1.5 mb-1"><Svg path={I.sparkle} className="w-3 h-3 text-violet-400"/><span className="text-[10px] font-medium text-zinc-300">建议</span></div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">每天15-20分钟复习效果最佳，坚持卡片复习和测验。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
