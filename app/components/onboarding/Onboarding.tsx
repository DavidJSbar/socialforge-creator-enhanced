"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Onboarding() {
  const [complete, setComplete] = useState(false);
  const [step, setStep] = useState(0);
  const steps = [{icon: "🚀", title: "Welcome", desc: "Manage all social accounts"}, {icon: "🔗", title: "Connect", desc: "Link your accounts", action: "Connect", link: "/dashboard"}, {icon: "✍️", title: "Create", desc: "Write your first post", action: "Create", link: "/create"}, {icon: "📊", title: "Analytics", desc: "Track success", action: "View", link: "/analytics"}];
  return (<AnimatePresence>{!complete && (<motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"><motion.div key={step} className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700"><div className="text-6xl mb-4">{steps[step].icon}</div><h2 className="text-2xl font-bold text-white mb-2">{steps[step].title}</h2><p className="text-slate-300 mb-8">{steps[step].desc}</p><div className="flex gap-2 mb-6">{steps.map((_,i)=>(<div key={i} className={`h-2 flex-1 rounded-full ${i<=step?"bg-indigo-600":"bg-slate-700"}`}/>))}</div><div className="flex gap-3">{step>0&&(<button onClick={()=>setStep(step-1)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg">Back</button>)}{step<steps.length-1&&(<button onClick={()=>setStep(step+1)} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Next</button>)}{step===steps.length-1&&(<button onClick={()=>setComplete(true)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">Done</button>)}</div></motion.div></motion.div>)}</AnimatePresence>);
}
