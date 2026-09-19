import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, Clock3, Eye, Globe2, Heart, Home, Images,
  Play, RefreshCw, Sparkles, Volume2,
} from "lucide-react";
import { getMemories, saveGameSession, saveRecommendation } from "../services/api";
import {
  getLanguageOption, getStoredLanguage, saveLanguage, SUPPORTED_LANGUAGES,
} from "../i18n/languages";
import type { AppLanguage } from "../i18n/languages";
import "./PhotoRecallGame.css";

type RawMemory={_id?:string;id?:string;title?:string;description?:string;category?:string;photo?:string;createdAt?:string};
type Memory={id:string;title:string;description:string;category:string;photo:string;createdAt?:string};
type Phase="loading"|"ready"|"viewing"|"question"|"feedback"|"complete"|"not-ready";
type Difficulty="Easy"|"Medium"|"Hard";
type Round={target:Memory;options:Memory[]};
type DifficultyConfig={viewingSeconds:number;choices:number;rounds:number};
const DIFFICULTY_CONFIG:Record<Difficulty,DifficultyConfig>={
  Easy:{viewingSeconds:8,choices:3,rounds:3},Medium:{viewingSeconds:6,choices:4,rounds:4},Hard:{viewingSeconds:4,choices:4,rounds:5},
};
const T={
 English:{
  activities:"Activities",subtitle:"Memory & daily wellbeing",eyebrow:"MY MEMORIES",title:"Photo Recall",
  description:"Spend a moment with a familiar photograph and gently recall the memory connected to it.",
  loading:"Preparing your memories",loadingText:"SMRITI is looking for familiar photographs.",
  notReady:"Photo Recall isn't ready yet",notReadyText:"Photo Recall needs at least 3 personal memories with photographs. Your caregiver can add these memories for you.",
  back:"Back to activities",personal:"PERSONAL ACTIVITY",readyTitle:"Remember a familiar moment",
  readyText:"First, look carefully at a personal photograph. When the photograph is hidden, choose the memory you just saw.",
  choose:"Choose difficulty",memories:"photo memories",seconds:"seconds to look",noRush:"No need to rush",
  start:"Start activity",listenInstructions:"Listen to instructions",round:"ROUND",correct:"CORRECT",time:"TIME",level:"LEVEL",
  look:"LOOK CAREFULLY",rememberPhoto:"Remember this photograph",secondsWord:"seconds",
  gentle:"Take a moment to look at the people, place and details in this memory.",
  remember:"REMEMBER",question:"Which memory did you just see?",listen:"Listen",hidden:"Photograph hidden",
  chooseMemory:"Choose the memory you remember.",yourMemory:"YOUR MEMORY",right:"That's right",
  reminder:"A familiar reminder",saw:"This is the memory you saw.",results:"See results",next:"Next memory",
  complete:"ACTIVITY COMPLETE",completeTitle:"Photo Recall complete",
  completeText:"You spent time reconnecting with familiar photographs and personal memories.",
  accuracy:"Accuracy",difficulty:"Difficulty",playAgain:"Play again",saving:"Saving activity...",saved:"Activity saved",
  recommendationSaved:"Recommendation saved",adaptive:"ADAPTIVE RECOMMENDATION",nextLevel:"Next activity level",playNext:"Play next level",
  strongHard:"You performed strongly. Hard level will continue for the next activity.",
  strongIncrease:"You performed strongly, so the next activity will be a little more challenging.",
  maintain:"This level suits your current performance, so the next activity will stay at the same level.",
  easyContinue:"Easy level will continue so you can practise comfortably.",
  easier:"The next activity will be made a little easier for comfortable practice.",
 },
 Assamese:{
  activities:"কাৰ্যকলাপ",subtitle:"স্মৃতি আৰু দৈনিক সুস্থতা",eyebrow:"মোৰ স্মৃতিসমূহ",title:"ছবিৰ স্মৃতি",
  description:"এখন চিনাকি ছবি চাওক আৰু তাৰ সৈতে জড়িত স্মৃতিটো লাহে লাহে মনত পেলাওক।",
  loading:"আপোনাৰ স্মৃতিসমূহ প্ৰস্তুত কৰা হৈছে",loadingText:"SMRITI-এ চিনাকি ছবিসমূহ বিচাৰি আছে।",
  notReady:"ছবিৰ স্মৃতি এতিয়াও সাজু নহয়",notReadyText:"এই কাৰ্যকলাপৰ বাবে ছবিসহ কমেও ৩টা ব্যক্তিগত স্মৃতি প্ৰয়োজন। আপোনাৰ যত্নদাতাই এইবোৰ যোগ কৰিব পাৰে।",
  back:"কাৰ্যকলাপলৈ উভতি যাওক",personal:"ব্যক্তিগত কাৰ্যকলাপ",readyTitle:"এটা চিনাকি মুহূৰ্ত মনত পেলাওক",
  readyText:"প্ৰথমে ব্যক্তিগত ছবিখন ভালদৰে চাওক। ছবিখন লুকুওৱাৰ পিছত আপুনি দেখা স্মৃতিটো বাছনি কৰক।",
  choose:"কঠিনতাৰ স্তৰ বাছনি কৰক",memories:"টা ছবিৰ স্মৃতি",seconds:"ছেকেণ্ড চাবলৈ",noRush:"খৰখেদা নকৰিব",
  start:"কাৰ্যকলাপ আৰম্ভ কৰক",listenInstructions:"নিৰ্দেশনা শুনক",round:"ৰাউণ্ড",correct:"শুদ্ধ",time:"সময়",level:"স্তৰ",
  look:"ভালদৰে চাওক",rememberPhoto:"এই ছবিখন মনত ৰাখক",secondsWord:"ছেকেণ্ড",
  gentle:"এই স্মৃতিটোৰ মানুহ, ঠাই আৰু বিৱৰণসমূহ ভালদৰে চাওক।",
  remember:"মনত পেলাওক",question:"আপুনি অলপ আগতে কোনটো স্মৃতি দেখিছিল?",listen:"শুনক",hidden:"ছবিখন লুকুওৱা হৈছে",
  chooseMemory:"আপুনি মনত ৰখা স্মৃতিটো বাছনি কৰক।",yourMemory:"আপোনাৰ স্মৃতি",right:"শুদ্ধ",
  reminder:"এটা চিনাকি স্মৰণ",saw:"এইটোৱেই আপুনি দেখা স্মৃতি।",results:"ফলাফল চাওক",next:"পৰৱৰ্তী স্মৃতি",
  complete:"কাৰ্যকলাপ সম্পূৰ্ণ",completeTitle:"ছবিৰ স্মৃতি সম্পূৰ্ণ",
  completeText:"আপুনি চিনাকি ছবি আৰু ব্যক্তিগত স্মৃতিৰ সৈতে সময় কটালে।",
  accuracy:"সঠিকতা",difficulty:"কঠিনতাৰ স্তৰ",playAgain:"আকৌ খেলক",saving:"কাৰ্যকলাপ সংৰক্ষণ কৰা হৈছে...",saved:"কাৰ্যকলাপ সংৰক্ষণ কৰা হৈছে",
  recommendationSaved:"পৰামৰ্শ সংৰক্ষণ কৰা হৈছে",adaptive:"অভিযোজিত পৰামৰ্শ",nextLevel:"পৰৱৰ্তী কাৰ্যকলাপৰ স্তৰ",playNext:"পৰৱৰ্তী স্তৰ খেলক",
  strongHard:"আপুনি ভাল প্ৰদৰ্শন কৰিছে। কঠিন স্তৰ অব্যাহত থাকিব।",
  strongIncrease:"আপুনি ভাল প্ৰদৰ্শন কৰিছে, সেয়ে পৰৱৰ্তী কাৰ্যকলাপ অলপ অধিক কঠিন হ'ব।",
  maintain:"বৰ্তমানৰ প্ৰদৰ্শনৰ বাবে একে স্তৰ অব্যাহত থাকিব।",
  easyContinue:"আৰামদায়ক অনুশীলনৰ বাবে সহজ স্তৰ অব্যাহত থাকিব।",
  easier:"আৰামদায়ক অনুশীলনৰ বাবে পৰৱৰ্তী কাৰ্যকলাপ অলপ সহজ হ'ব।",
 }
};
function shuffleArray<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function getStoredPatientId(){try{const r=localStorage.getItem("user");return r?JSON.parse(r)?.patientId:undefined;}catch{return undefined;}}
function adaptive(current:Difficulty,a:number):Difficulty{if(a>=85)return current==="Easy"?"Medium":current==="Medium"?"Hard":"Hard";if(a>=50)return current;return current==="Hard"?"Medium":current==="Medium"?"Easy":"Easy";}
function reason(current:Difficulty,next:Difficulty,a:number){if(a>=85)return current==="Hard"?"Strong performance recorded. Hard difficulty is recommended to continue.":`Strong performance recorded. Difficulty is recommended to increase from ${current} to ${next}.`;if(a>=50)return`Current performance is suited to ${current}, so the same difficulty is recommended.`;if(current==="Easy")return"Easy difficulty is recommended to continue for comfortable practice.";return`A lower difficulty is recommended for comfortable practice, moving from ${current} to ${next}.`;}

function PhotoRecallGame(){
 const navigate=useNavigate(),patientId=getStoredPatientId(),saveStarted=useRef(false);
 const [language,setLanguage]=useState<AppLanguage>(getStoredLanguage()),languageOption=getLanguageOption(language),text=language==="Assamese"?T.Assamese:T.English;
 const [memories,setMemories]=useState<Memory[]>([]),[difficulty,setDifficulty]=useState<Difficulty>("Easy"),[phase,setPhase]=useState<Phase>("loading");
 const [round,setRound]=useState<Round|null>(null),[roundNumber,setRoundNumber]=useState(1),[viewingTime,setViewingTime]=useState(0);
 const [correctAnswers,setCorrectAnswers]=useState(0),[attempts,setAttempts]=useState(0);
 const [wasCorrect,setWasCorrect]=useState(false),[startTime,setStartTime]=useState<number|null>(null),[elapsedSeconds,setElapsedSeconds]=useState(0);
 const [saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[recommendationSaved,setRecommendationSaved]=useState(false),[lastTargetId,setLastTargetId]=useState<string|null>(null);
 const config=DIFFICULTY_CONFIG[difficulty];

 useEffect(()=>{(async()=>{if(!patientId){setPhase("not-ready");return;}try{setPhase("loading");const response=await getMemories(patientId);const raw:RawMemory[]=Array.isArray(response)?response:response&&Array.isArray(response.memories)?response.memories:[];const n=raw.map((m):Memory|null=>{const id=m.id||m._id;return id&&m.title&&m.description&&m.photo?{id,title:m.title,description:m.description,category:m.category||"Personal Memory",photo:m.photo,createdAt:m.createdAt}:null;}).filter((m):m is Memory=>m!==null);setMemories(n);setPhase(n.length>=3?"ready":"not-ready");}catch(e){console.error("Failed to load memories:",e);setPhase("not-ready");}})();},[patientId]);
 useEffect(()=>{if(!startTime||["ready","loading","not-ready","complete"].includes(phase))return;const id=window.setInterval(()=>setElapsedSeconds(Math.floor((Date.now()-startTime)/1000)),1000);return()=>window.clearInterval(id);},[startTime,phase]);
 useEffect(()=>{if(phase!=="viewing")return;if(viewingTime<=0){setPhase("question");return;}const id=window.setTimeout(()=>setViewingTime(v=>v-1),1000);return()=>window.clearTimeout(id);},[phase,viewingTime]);
 const accuracy=useMemo(()=>attempts?Math.round(correctAnswers/attempts*100):0,[correctAnswers,attempts]);
 const nextDifficulty=useMemo(()=>adaptive(difficulty,accuracy),[difficulty,accuracy]);
 const adaptiveMessage=accuracy>=85?(difficulty==="Hard"?text.strongHard:text.strongIncrease):accuracy>=50?text.maintain:difficulty==="Easy"?text.easyContinue:text.easier;
 function formatTime(s:number){return`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;}
 function speak(v:string){if(!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const m=new SpeechSynthesisUtterance(v);m.lang=languageOption.speechCode;m.rate=.9;window.speechSynthesis.speak(m);}
 function createRound(excluded:string|null=lastTargetId,requested:Difficulty=difficulty):Round|null{if(memories.length<3)return null;let targets=memories.filter(m=>m.id!==excluded);if(!targets.length)targets=memories;const target=shuffleArray(targets)[0];if(!target)return null;const count=Math.min(DIFFICULTY_CONFIG[requested].choices,memories.length);return{target,options:shuffleArray([target,...shuffleArray(memories.filter(m=>m.id!==target.id)).slice(0,count-1)])};}
 function resetSave(){setSaving(false);setSaved(false);setRecommendationSaved(false);saveStarted.current=false;}
 function startGame(requested:Difficulty=difficulty){const r=createRound(null,requested);if(!r){setPhase("not-ready");return;}setDifficulty(requested);setCorrectAnswers(0);setAttempts(0);setRoundNumber(1);setWasCorrect(false);setElapsedSeconds(0);resetSave();setLastTargetId(r.target.id);setRound(r);setViewingTime(DIFFICULTY_CONFIG[requested].viewingSeconds);setStartTime(Date.now());setPhase("viewing");}
 function handleAnswer(memory:Memory){if(phase!=="question"||!round)return;const ok=memory.id===round.target.id;setWasCorrect(ok);setAttempts(v=>v+1);if(ok)setCorrectAnswers(v=>v+1);setPhase("feedback");speak(`${round.target.title}. ${round.target.description}`);}
 async function finish(finalCorrect:number,finalAttempts:number){if(!patientId||saveStarted.current)return;saveStarted.current=true;setSaving(true);const a=finalAttempts?Math.round(finalCorrect/finalAttempts*100):0,n=adaptive(difficulty,a);try{await saveGameSession({patientId,gameName:"Photo Recall",score:finalCorrect*10,totalQuestions:finalAttempts,accuracy:a,difficulty});setSaved(true);await saveRecommendation({patientId,gameName:"Photo Recall",currentDifficulty:difficulty,recommendedDifficulty:n,reason:reason(difficulty,n,a),accuracy:a});setRecommendationSaved(true);}catch(e){console.error("Failed to save Photo Recall result:",e);saveStarted.current=false;}finally{setSaving(false);}}
 function continueGame(){if(!round)return;if(roundNumber>=config.rounds){setPhase("complete");void finish(correctAnswers,attempts);return;}const n=createRound(round.target.id);if(!n)return;setRoundNumber(v=>v+1);setWasCorrect(false);setLastTargetId(n.target.id);setRound(n);setViewingTime(config.viewingSeconds);setPhase("viewing");}
 function restartGame(){if("speechSynthesis"in window)window.speechSynthesis.cancel();setRound(null);setRoundNumber(1);setCorrectAnswers(0);setAttempts(0);setWasCorrect(false);setStartTime(null);setElapsedSeconds(0);setLastTargetId(null);resetSave();setPhase("ready");}
 function changeLanguage(v:AppLanguage){if("speechSynthesis"in window)window.speechSynthesis.cancel();setLanguage(v);saveLanguage(v);}
 const levelLabel=(d:Difficulty)=>language==="Assamese"?(d==="Easy"?"সহজ":d==="Medium"?"মধ্যম":"কঠিন"):d;

 return <main className="photo-recall-page">
  <header className="photo-recall-header"><button type="button" className="photo-recall-back" onClick={()=>navigate("/games")}><ArrowLeft size={20}/>{text.activities}</button><button type="button" className="photo-recall-brand" onClick={()=>navigate("/home")}><div className="photo-recall-brand-mark">S</div><div><strong>SMRITI</strong><span>{text.subtitle}</span></div></button><div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7}}><Globe2 size={17}/><select value={language} onChange={e=>changeLanguage(e.target.value as AppLanguage)}>{SUPPORTED_LANGUAGES.map(o=><option key={o.code} value={o.name}>{o.nativeName} — {o.name}</option>)}</select></div><button type="button" className="photo-recall-home" onClick={()=>navigate("/home")} aria-label="Home"><Home size={20}/></button></header>
  <div className="photo-recall-content">
   <section className="photo-recall-title"><span className="photo-recall-eyebrow">{text.eyebrow}</span><h1>{text.title}</h1><p>{text.description}</p></section>
   {phase==="loading"&&<section className="photo-recall-panel photo-recall-centered"><Images size={42}/><h2>{text.loading}</h2><p>{text.loadingText}</p></section>}
   {phase==="not-ready"&&<section className="photo-recall-panel photo-recall-centered"><div className="photo-recall-large-icon"><Images size={40}/></div><span className="photo-recall-panel-eyebrow">{text.title}</span><h2>{text.notReady}</h2><p>{text.notReadyText}</p><button type="button" className="photo-recall-primary" onClick={()=>navigate("/games")}><ArrowLeft size={19}/>{text.back}</button></section>}
   {phase==="ready"&&<section className="photo-recall-panel photo-recall-ready"><div className="photo-recall-large-icon"><Heart size={38}/></div><span className="photo-recall-panel-eyebrow">{text.personal}</span><h2>{text.readyTitle}</h2><p>{text.readyText}</p><div className="photo-recall-difficulty"><span>{text.choose}</span><div className="photo-recall-difficulty-options">{(["Easy","Medium","Hard"]as Difficulty[]).map(l=><button type="button" key={l} className={difficulty===l?"photo-difficulty-button photo-difficulty-selected":"photo-difficulty-button"} onClick={()=>setDifficulty(l)}>{levelLabel(l)}</button>)}</div></div><div className="photo-recall-ready-info"><span><Images size={18}/>{memories.length} {text.memories}</span><span><Clock3 size={18}/>{config.viewingSeconds} {text.seconds}</span><span><Heart size={18}/>{text.noRush}</span></div><div className="photo-recall-ready-actions"><button type="button" className="photo-recall-primary" onClick={()=>startGame(difficulty)}><Play size={19} fill="currentColor"/>{text.start}</button><button type="button" className="photo-recall-secondary" onClick={()=>speak(text.readyText)}><Volume2 size={19}/>{text.listenInstructions}</button></div></section>}
   {(["viewing","question","feedback"] as Phase[]).includes(phase)&&round&&<section className="photo-recall-status"><div><span>{text.round}</span><strong>{roundNumber} / {config.rounds}</strong></div><div><span>{text.correct}</span><strong>{correctAnswers}</strong></div><div><span>{text.time}</span><strong>{formatTime(elapsedSeconds)}</strong></div><div><span>{text.level}</span><strong>{levelLabel(difficulty)}</strong></div></section>}
   {phase==="viewing"&&round&&<section className="photo-recall-game-panel"><div className="photo-recall-game-heading"><div><span className="photo-recall-panel-eyebrow">{text.look}</span><h2>{text.rememberPhoto}</h2></div><div className="photo-recall-countdown"><Eye size={19}/><strong>{viewingTime}</strong><span>{text.secondsWord}</span></div></div><div className="photo-recall-photo"><img src={round.target.photo} alt={round.target.title}/></div><p className="photo-recall-gentle-note">{text.gentle}</p></section>}
   {phase==="question"&&round&&<section className="photo-recall-game-panel"><div className="photo-recall-game-heading"><div><span className="photo-recall-panel-eyebrow">{text.remember}</span><h2>{text.question}</h2></div><button type="button" className="photo-recall-listen" onClick={()=>speak(text.question)}><Volume2 size={19}/>{text.listen}</button></div><div className="photo-recall-hidden-photo"><Images size={44}/><strong>{text.hidden}</strong><span>{text.chooseMemory}</span></div><div className="photo-recall-options">{round.options.map(m=><button type="button" key={m.id} className="photo-recall-option" onClick={()=>handleAnswer(m)}>{m.title}</button>)}</div></section>}
   {phase==="feedback"&&round&&<section className="photo-recall-game-panel"><div className="photo-recall-game-heading"><div><span className="photo-recall-panel-eyebrow">{text.yourMemory}</span><h2>{round.target.title}</h2></div><button type="button" className="photo-recall-listen" onClick={()=>speak(`${round.target.title}. ${round.target.description}`)}><Volume2 size={19}/>{text.listen}</button></div><div className="photo-recall-feedback-layout"><div className="photo-recall-feedback-photo"><img src={round.target.photo} alt={round.target.title}/></div><div className="photo-recall-feedback-copy"><div className={wasCorrect?"photo-recall-feedback-message photo-recall-feedback-correct":"photo-recall-feedback-message"}>{wasCorrect?<CheckCircle2 size={24}/>:<Heart size={24}/>}<div><strong>{wasCorrect?text.right:text.reminder}</strong><span>{text.saw}</span></div></div><span className="photo-recall-memory-category">{round.target.category}</span><h3>{round.target.title}</h3><p>{round.target.description}</p><button type="button" className="photo-recall-primary photo-recall-next" onClick={continueGame}>{roundNumber>=config.rounds?text.results:text.next}</button></div></div></section>}
   {phase==="complete"&&<section className="photo-recall-panel photo-recall-complete"><div className="photo-recall-large-icon"><Heart size={38}/></div><span className="photo-recall-panel-eyebrow">{text.complete}</span><h2>{text.completeTitle}</h2><p>{text.completeText}</p><div className="photo-recall-results"><div><span>{text.correct}</span><strong>{correctAnswers} / {attempts}</strong></div><div><span>{text.accuracy}</span><strong>{accuracy}%</strong></div><div><span>{text.time}</span><strong>{formatTime(elapsedSeconds)}</strong></div><div><span>{text.difficulty}</span><strong>{levelLabel(difficulty)}</strong></div></div><div style={{marginTop:22,padding:"18px 20px",borderRadius:14,background:"#f4f7f2",textAlign:"left"}}><span style={{fontSize:12,fontWeight:800,color:"#8c6a17"}}>{text.adaptive}</span><strong style={{display:"block",margin:"6px 0",color:"#123d31"}}>{text.nextLevel}: {levelLabel(nextDifficulty)}</strong><p style={{margin:0}}>{adaptiveMessage}</p></div><div className="photo-recall-complete-actions"><button type="button" className="photo-recall-secondary" onClick={restartGame}><RefreshCw size={19}/>{text.playAgain}</button><button type="button" className="photo-recall-primary" onClick={()=>startGame(nextDifficulty)}><Sparkles size={18}/>{text.playNext}</button><button type="button" className="photo-recall-secondary" onClick={()=>navigate("/games")}>{text.back}</button></div>{saving&&<span className="photo-recall-save-status">{text.saving}</span>}{saved&&<span className="photo-recall-save-status">{text.saved}</span>}{recommendationSaved&&<span className="photo-recall-save-status">{text.recommendationSaved}</span>}</section>}
  </div>
 </main>;
}
export default PhotoRecallGame;
