'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, CheckCircle2, Lock, Clock, Star, ChevronRight, Award, RefreshCw } from 'lucide-react';

const MODULES = [
  {
    id: 1, title: 'Consultation & Sales Excellence', category: 'Sales', duration: '45 min',
    lessons: 8, completed: 8, required: true,
    description: 'Master the art of converting consultations to treatment plans without feeling pushy.',
    staff: [
      { name: 'NP Williams', progress: 100, passed: true, score: 92 },
      { name: 'RN Chen',     progress: 100, passed: true, score: 88 },
    ],
  },
  {
    id: 2, title: 'Hormone Optimization Protocols', category: 'Clinical', duration: '60 min',
    lessons: 12, completed: 12, required: true,
    description: 'Complete HRT protocols for men and women — dosing, monitoring, and patient education.',
    staff: [
      { name: 'NP Williams', progress: 100, passed: true, score: 95 },
      { name: 'RN Chen',     progress: 75,  passed: false, score: null },
    ],
  },
  {
    id: 3, title: 'Peptide Therapy & Injectable Safety', category: 'Clinical', duration: '30 min',
    lessons: 6, completed: 6, required: true,
    description: 'Safe administration of peptides, reconstitution, storage, and patient instruction.',
    staff: [
      { name: 'NP Williams', progress: 50,  passed: false, score: null },
      { name: 'RN Chen',     progress: 100, passed: true,  score: 90 },
    ],
  },
  {
    id: 4, title: 'HIPAA & Patient Privacy Compliance', category: 'Compliance', duration: '20 min',
    lessons: 4, completed: 4, required: true,
    description: 'Annual HIPAA training with completion certificate for compliance records.',
    staff: [
      { name: 'NP Williams', progress: 100, passed: true, score: 100 },
      { name: 'RN Chen',     progress: 100, passed: true, score: 98 },
    ],
  },
  {
    id: 5, title: 'Retail & Product Upsell Techniques', category: 'Sales', duration: '25 min',
    lessons: 5, completed: 0, required: false,
    description: 'How to naturally recommend supplements and retail products without being pushy.',
    staff: [
      { name: 'NP Williams', progress: 0, passed: false, score: null },
      { name: 'RN Chen',     progress: 0, passed: false, score: null },
    ],
  },
];

const catColor = (c: string) => c === 'Clinical' ? 'badge-os' : c === 'Sales' ? 'badge-violet' : c === 'Compliance' ? 'badge-green' : 'badge-gray';

export default function TrainingPage() {
  const [active, setActive] = useState<typeof MODULES[0] | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const submitQuiz = async () => {
    setLoadingFeedback(true);
    await new Promise(r => setTimeout(r, 1000));
    setQuizFeedback('✅ Good answer! You correctly identified that testosterone pellet dosing for women typically ranges from 50–100mg depending on symptoms, labs (total T, free T, SHBG), and clinical response. The monitoring schedule at 4 weeks post-insertion is appropriate. One addition: always document the lot number and expiration date of the pellet in the procedure note.');
    setLoadingFeedback(false);
  };

  const overallCompletion = Math.round(MODULES.reduce((a, m) => a + (m.completed / m.lessons * 100), 0) / MODULES.length);

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(217,70,239,0.3)' }}>
            <Brain className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">AI Staff Training</h1>
            <p className="text-[#64748B] text-sm">Interactive AI scenarios · Automated certification · 50% faster onboarding</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Overall Completion', value: `${overallCompletion}%`, icon: Award,        color: 'text-fuchsia-400' },
            { label: 'Modules Complete',   value: '3/5',                   icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Staff Certified',    value: '4/6',                   icon: Brain,        color: 'text-violet-400' },
            { label: 'Avg Quiz Score',     value: '93%',                   icon: Star,         color: 'text-amber-400' },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
              <k.icon className={`w-5 h-5 ${k.color} mb-3`} />
              <div className="kpi-value text-3xl mb-0.5">{k.value}</div>
              <div className="kpi-label text-xs">{k.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Module list */}
          <div className="lg:col-span-3 space-y-3">
            {MODULES.map((mod, i) => (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div onClick={() => setActive(active?.id === mod.id ? null : mod)}
                  className={`glass-card p-5 cursor-pointer hover:border-fuchsia-500/20 transition-all ${active?.id === mod.id ? 'border-fuchsia-500/30' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`badge ${catColor(mod.category)} text-[10px]`}>{mod.category}</span>
                        {mod.required && <span className="badge badge-rose text-[10px]">Required</span>}
                        <span className="text-[11px] text-[#64748B] flex items-center gap-1"><Clock className="w-3 h-3" />{mod.duration}</span>
                      </div>
                      <h3 className="font-display font-semibold text-sm mb-1">{mod.title}</h3>
                      <p className="text-[#64748B] text-xs">{mod.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-xs text-[#64748B]">{mod.completed}/{mod.lessons} lessons</div>
                      <div className="progress-bar w-20">
                        <div className={`progress-fill ${mod.completed === mod.lessons ? 'progress-fill-green' : mod.completed > 0 ? '' : 'bg-white/10'}`}
                          style={{ width: `${(mod.completed / mod.lessons) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {active?.id === mod.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-white/5">
                      <div className="space-y-2 mb-3">
                        {mod.staff.map(s => (
                          <div key={s.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-fuchsia-500/15 flex items-center justify-center text-[10px] font-bold text-fuchsia-400">
                                {s.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-xs text-[#94A3B8]">{s.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="progress-bar w-16"><div className={`progress-fill ${s.passed ? 'progress-fill-green' : s.progress > 0 ? '' : 'bg-white/10'}`} style={{ width: `${s.progress}%` }} /></div>
                              {s.passed
                                ? <span className="badge badge-green text-[10px]">Passed {s.score}%</span>
                                : s.progress > 0 ? <span className="badge badge-amber text-[10px]">In Progress</span>
                                : <span className="badge badge-gray text-[10px]">Not Started</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setQuizMode(true)} className="btn-primary text-xs py-2 gap-1">
                        <Play className="w-3.5 h-3.5" />Launch AI Quiz
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Quiz panel */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-fuchsia-400" />
              <h2 className="font-display font-semibold text-base">AI Scenario Quiz</h2>
            </div>
            {!quizMode ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B]">
                <Brain className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Select a module and click "Launch AI Quiz" to start an interactive scenario session</p>
                <p className="text-xs mt-1 opacity-70">AI evaluates answers and gives clinical feedback</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="surface-card p-4 mb-3">
                  <p className="text-xs font-semibold text-fuchsia-400 mb-2">CLINICAL SCENARIO</p>
                  <p className="text-sm text-[#F1F5F9] leading-relaxed">
                    A 48-year-old female patient presents requesting testosterone pellet therapy. She reports low energy, decreased libido, and difficulty losing weight. Her baseline Total T is 18 ng/dL and Free T is 1.2 pg/mL.
                    <br /><br />
                    <strong>What is the appropriate starting pellet dose, and when would you schedule her first follow-up?</strong>
                  </p>
                </div>
                <textarea value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)}
                  placeholder="Type your clinical answer here..."
                  className="input-field flex-1 min-h-[100px] resize-none text-sm mb-3" />
                {quizFeedback && (
                  <div className="surface-card p-4 mb-3 text-xs text-[#94A3B8] leading-relaxed border-emerald-500/20"
                    style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                    {quizFeedback}
                  </div>
                )}
                <button onClick={submitQuiz} disabled={!quizAnswer.trim() || loadingFeedback} className="btn-primary justify-center text-sm py-2">
                  {loadingFeedback ? <><RefreshCw className="w-4 h-4 animate-spin" />Evaluating...</> : <><CheckCircle2 className="w-4 h-4" />Submit Answer</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
