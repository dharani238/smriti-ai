import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, Clock3, Globe2, Heart, Home, Play,
  RefreshCw, Sparkles, UsersRound, Volume2,
} from "lucide-react";
import { getFamilyMembers, saveGameSession, saveRecommendation } from "../services/api";
import {
  getLanguageOption, getStoredLanguage, saveLanguage, SUPPORTED_LANGUAGES,
} from "../i18n/languages";
import type { AppLanguage } from "../i18n/languages";
import "./FamilyFacesGame.css";

type RawFamilyMember = {
  _id?: string; id?: string; name?: string; relation?: string;
  relationship?: string; age?: number; photo?: string;
};
type FamilyMember = {
  id: string; name: string; relation: string; relationship?: string;
  age?: number; photo: string;
};
type Phase = "loading" | "ready" | "playing" | "feedback" | "complete" | "not-enough";
type Difficulty = "Easy" | "Medium" | "Hard";
type Round = { target: FamilyMember; options: FamilyMember[] };
type DifficultyConfig = { choices: number; rounds: number };

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  Easy: { choices: 3, rounds: 5 },
  Medium: { choices: 4, rounds: 6 },
  Hard: { choices: 5, rounds: 8 },
};

const T = {
  English: {
    activities:"Activities", subtitle:"Memory & daily wellbeing", eyebrow:"MY MEMORIES",
    title:"Family Faces", description:"Recognise familiar people using photographs shared with you.",
    loading:"Preparing your family memories", wait:"Please wait a moment.",
    needTitle:"More family photographs are needed",
    needText:"Family Faces needs at least 3 family members with photographs before the activity can begin. Your caregiver can add them to your family profile.",
    back:"Back to activities", personal:"PERSONAL ACTIVITY", readyTitle:"Who is this person?",
    readyText:"You will see a familiar photograph. Choose the person's name from the options below. Take as much time as you need.",
    choose:"Choose difficulty", people:"familiar people", noPressure:"No time pressure",
    start:"Start activity", round:"ROUND", correct:"CORRECT", time:"TIME", level:"LEVEL",
    recognise:"RECOGNISE THE PERSON", question:"Who is this person?", listen:"Listen",
    gentle:"Take your time and choose the name that feels familiar.",
    right:"That's right", okay:"That's okay", thisIs:"This is", your:"your",
    results:"See results", next:"Next person", complete:"ACTIVITY COMPLETE",
    completeTitle:"Family Faces complete", completeText:"You finished today's familiar-face activity.",
    accuracy:"Accuracy", difficulty:"Difficulty", playAgain:"Play again",
    saving:"Saving activity...", saved:"Activity saved", recommendationSaved:"Recommendation saved",
    adaptive:"ADAPTIVE RECOMMENDATION", nextLevel:"Next activity level", playNext:"Play next level",
    strongHard:"You performed strongly. Hard level will continue for the next activity.",
    strongIncrease:"You performed strongly, so the next activity will be a little more challenging.",
    maintain:"This level suits your current performance, so the next activity will stay at the same level.",
    easyContinue:"Easy level will continue so you can practise comfortably.",
    easier:"The next activity will be made a little easier for comfortable practice.",
  },
  Assamese: {
    activities:"কাৰ্যকলাপ", subtitle:"স্মৃতি আৰু দৈনিক সুস্থতা", eyebrow:"মোৰ স্মৃতিসমূহ",
    title:"পৰিয়ালৰ মুখ", description:"আপোনাৰ সৈতে ভাগ কৰা ছবিৰ সহায়ত চিনাকি মানুহক চিনাক্ত কৰক।",
    loading:"পৰিয়ালৰ স্মৃতি প্ৰস্তুত কৰা হৈছে", wait:"অনুগ্ৰহ কৰি অলপ অপেক্ষা কৰক।",
    needTitle:"আৰু পৰিয়ালৰ ছবি প্ৰয়োজন",
    needText:"এই কাৰ্যকলাপ আৰম্ভ কৰিবলৈ ছবিসহ কমেও ৩ জন পৰিয়ালৰ সদস্য প্ৰয়োজন। আপোনাৰ যত্নদাতাই সেইবোৰ যোগ কৰিব পাৰে।",
    back:"কাৰ্যকলাপলৈ উভতি যাওক", personal:"ব্যক্তিগত কাৰ্যকলাপ", readyTitle:"এইজন কোন?",
    readyText:"আপুনি এজন চিনাকি ব্যক্তিৰ ছবি দেখিব। তলৰ বিকল্পৰ পৰা তেওঁৰ নাম বাছনি কৰক। লাহে লাহে কৰক।",
    choose:"কঠিনতাৰ স্তৰ বাছনি কৰক", people:"জন চিনাকি মানুহ", noPressure:"সময়ৰ চাপ নাই",
    start:"কাৰ্যকলাপ আৰম্ভ কৰক", round:"ৰাউণ্ড", correct:"শুদ্ধ", time:"সময়", level:"স্তৰ",
    recognise:"ব্যক্তিজনক চিনাক্ত কৰক", question:"এইজন কোন?", listen:"শুনক",
    gentle:"লাহে লাহে চিনাকি নামটো বাছনি কৰক।",
    right:"শুদ্ধ", okay:"ঠিক আছে", thisIs:"এইজন", your:"আপোনাৰ",
    results:"ফলাফল চাওক", next:"পৰৱৰ্তী ব্যক্তি", complete:"কাৰ্যকলাপ সম্পূৰ্ণ",
    completeTitle:"পৰিয়ালৰ মুখ সম্পূৰ্ণ", completeText:"আপুনি আজিৰ চিনাকি-মুখৰ কাৰ্যকলাপ সম্পূৰ্ণ কৰিলে।",
    accuracy:"সঠিকতা", difficulty:"কঠিনতাৰ স্তৰ", playAgain:"আকৌ খেলক",
    saving:"কাৰ্যকলাপ সংৰক্ষণ কৰা হৈছে...", saved:"কাৰ্যকলাপ সংৰক্ষণ কৰা হৈছে",
    recommendationSaved:"পৰামৰ্শ সংৰক্ষণ কৰা হৈছে",
    adaptive:"অভিযোজিত পৰামৰ্শ", nextLevel:"পৰৱৰ্তী কাৰ্যকলাপৰ স্তৰ", playNext:"পৰৱৰ্তী স্তৰ খেলক",
    strongHard:"আপুনি ভাল প্ৰদৰ্শন কৰিছে। কঠিন স্তৰ অব্যাহত থাকিব।",
    strongIncrease:"আপুনি ভাল প্ৰদৰ্শন কৰিছে, সেয়ে পৰৱৰ্তী কাৰ্যকলাপ অলপ অধিক কঠিন হ'ব।",
    maintain:"বৰ্তমানৰ প্ৰদৰ্শনৰ বাবে একে স্তৰ অব্যাহত থাকিব।",
    easyContinue:"আৰামদায়ক অনুশীলনৰ বাবে সহজ স্তৰ অব্যাহত থাকিব।",
    easier:"আৰামদায়ক অনুশীলনৰ বাবে পৰৱৰ্তী কাৰ্যকলাপ অলপ সহজ হ'ব।",
  },
};

function shuffleArray<T>(items:T[]) {
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function getStoredPatientId() {
  try { const raw=localStorage.getItem("user"); return raw ? JSON.parse(raw)?.patientId : undefined; }
  catch { return undefined; }
}
function getAdaptiveDifficulty(current:Difficulty, accuracy:number):Difficulty {
  if(accuracy>=85) return current==="Easy"?"Medium":current==="Medium"?"Hard":"Hard";
  if(accuracy>=50) return current;
  return current==="Hard"?"Medium":current==="Medium"?"Easy":"Easy";
}
function getReason(current:Difficulty,next:Difficulty,accuracy:number){
  if(accuracy>=85) return current==="Hard"
    ?"Strong performance recorded. Hard difficulty is recommended to continue."
    :`Strong performance recorded. Difficulty is recommended to increase from ${current} to ${next}.`;
  if(accuracy>=50) return `Current performance is suited to ${current}, so the same difficulty is recommended.`;
  if(current==="Easy") return "Easy difficulty is recommended to continue for comfortable practice.";
  return `A lower difficulty is recommended for comfortable practice, moving from ${current} to ${next}.`;
}

function FamilyFacesGame() {
  const navigate=useNavigate();
  const patientId=getStoredPatientId();
  const saveStarted=useRef(false);
  const [language,setLanguage]=useState<AppLanguage>(getStoredLanguage());
  const languageOption=getLanguageOption(language);
  const text=language==="Assamese"?T.Assamese:T.English;
  const [familyMembers,setFamilyMembers]=useState<FamilyMember[]>([]);
  const [difficulty,setDifficulty]=useState<Difficulty>("Easy");
  const [phase,setPhase]=useState<Phase>("loading");
  const [round,setRound]=useState<Round|null>(null);
  const [roundNumber,setRoundNumber]=useState(1);
  const [correctAnswers,setCorrectAnswers]=useState(0);
  const [attempts,setAttempts]=useState(0);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [wasCorrect,setWasCorrect]=useState(false);
  const [startTime,setStartTime]=useState<number|null>(null);
  const [elapsedSeconds,setElapsedSeconds]=useState(0);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [recommendationSaved,setRecommendationSaved]=useState(false);
  const [lastTargetId,setLastTargetId]=useState<string|null>(null);
  const config=DIFFICULTY_CONFIG[difficulty];

  useEffect(()=>{(async()=>{
    if(!patientId){setPhase("not-enough");return;}
    try{
      setPhase("loading");
      const response=await getFamilyMembers(patientId);
      const raw:RawFamilyMember[]=Array.isArray(response)?response:
        response&&Array.isArray(response.familyMembers)?response.familyMembers:[];
      const normalized=raw.map((m):FamilyMember|null=>{
        const id=m.id||m._id; const relation=m.relationship||m.relation||"family member";
        return id&&m.name&&m.photo?{id,name:m.name,relation,relationship:relation,age:m.age,photo:m.photo}:null;
      }).filter((m):m is FamilyMember=>m!==null);
      setFamilyMembers(normalized);
      setPhase(normalized.length>=3?"ready":"not-enough");
    }catch(e){console.error("Failed to load family members:",e);setPhase("not-enough");}
  })();},[patientId]);

  useEffect(()=>{
    if((phase!=="playing"&&phase!=="feedback")||!startTime)return;
    const id=window.setInterval(()=>setElapsedSeconds(Math.floor((Date.now()-startTime)/1000)),1000);
    return()=>window.clearInterval(id);
  },[phase,startTime]);

  const accuracy=useMemo(()=>attempts?Math.round(correctAnswers/attempts*100):0,[correctAnswers,attempts]);
  const recommendedNextDifficulty=useMemo(()=>getAdaptiveDifficulty(difficulty,accuracy),[difficulty,accuracy]);
  const adaptiveMessage=accuracy>=85?(difficulty==="Hard"?text.strongHard:text.strongIncrease):
    accuracy>=50?text.maintain:difficulty==="Easy"?text.easyContinue:text.easier;

  function createRound(excluded:string|null=lastTargetId):Round|null{
    if(familyMembers.length<3)return null;
    let candidates=familyMembers.filter(m=>m.id!==excluded); if(!candidates.length)candidates=familyMembers;
    const target=shuffleArray(candidates)[0]; if(!target)return null;
    const count=Math.min(DIFFICULTY_CONFIG[difficulty].choices,familyMembers.length);
    const options=shuffleArray([target,...shuffleArray(familyMembers.filter(m=>m.id!==target.id)).slice(0,count-1)]);
    return {target,options};
  }
  function resetResultState(){setSaved(false);setRecommendationSaved(false);setSaving(false);saveStarted.current=false;}
  function startGame(requested:Difficulty=difficulty){
    setDifficulty(requested);
    const old=difficulty; // create with current members; choice count is recalculated below if requested differs
    const count=Math.min(DIFFICULTY_CONFIG[requested].choices,familyMembers.length);
    let candidates=familyMembers; const target=shuffleArray(candidates)[0];
    if(!target){setPhase("not-enough");return;}
    const newRound={target,options:shuffleArray([target,...shuffleArray(familyMembers.filter(m=>m.id!==target.id)).slice(0,count-1)])};
    setCorrectAnswers(0);setAttempts(0);setRoundNumber(1);setElapsedSeconds(0);setSelectedId(null);
    setWasCorrect(false);resetResultState();setLastTargetId(newRound.target.id);setRound(newRound);
    setStartTime(Date.now());setPhase("playing"); void old;
  }
  function speak(value:string){
    if(!("speechSynthesis" in window))return; window.speechSynthesis.cancel();
    const msg=new SpeechSynthesisUtterance(value); msg.lang=languageOption.speechCode;msg.rate=.9;
    window.speechSynthesis.speak(msg);
  }
  function handleAnswer(member:FamilyMember){
    if(phase!=="playing"||!round)return;
    const correct=member.id===round.target.id;setSelectedId(member.id);setWasCorrect(correct);
    setAttempts(v=>v+1);if(correct)setCorrectAnswers(v=>v+1);setPhase("feedback");
    const rel=round.target.relationship||round.target.relation||"family member";
    speak(language==="Assamese"?`${round.target.name}, আপোনাৰ ${rel}।`:`This is ${round.target.name}, your ${rel}.`);
  }
  async function finish(finalCorrect:number,finalAttempts:number){
    if(!patientId||saveStarted.current)return; saveStarted.current=true;setSaving(true);
    const finalAccuracy=finalAttempts?Math.round(finalCorrect/finalAttempts*100):0;
    const next=getAdaptiveDifficulty(difficulty,finalAccuracy);
    try{
      await saveGameSession({patientId,gameName:"Family Faces",score:finalCorrect*10,totalQuestions:finalAttempts,accuracy:finalAccuracy,difficulty});
      setSaved(true);
      await saveRecommendation({patientId,gameName:"Family Faces",currentDifficulty:difficulty,recommendedDifficulty:next,reason:getReason(difficulty,next,finalAccuracy),accuracy:finalAccuracy});
      setRecommendationSaved(true);
    }catch(e){console.error("Failed to save Family Faces result:",e);saveStarted.current=false;}
    finally{setSaving(false);}
  }
  function continueGame(){
    if(!round)return;
    if(roundNumber>=config.rounds){setPhase("complete");void finish(correctAnswers,attempts);return;}
    const next=createRound(round.target.id);if(!next)return;
    setRoundNumber(v=>v+1);setSelectedId(null);setWasCorrect(false);setLastTargetId(next.target.id);setRound(next);setPhase("playing");
  }
  function restartGame(){if("speechSynthesis"in window)window.speechSynthesis.cancel();setRound(null);setRoundNumber(1);setCorrectAnswers(0);setAttempts(0);setSelectedId(null);setWasCorrect(false);setStartTime(null);setElapsedSeconds(0);setLastTargetId(null);resetResultState();setPhase("ready");}
  function formatTime(s:number){return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;}
  function changeLanguage(v:AppLanguage){if("speechSynthesis"in window)window.speechSynthesis.cancel();setLanguage(v);saveLanguage(v);}

  return <main className="family-faces-page">
    <header className="family-faces-header">
      <button type="button" className="family-faces-back" onClick={()=>navigate("/games")}><ArrowLeft size={20}/><span>{text.activities}</span></button>
      <button type="button" className="family-faces-brand" onClick={()=>navigate("/home")}><div className="family-faces-brand-mark">S</div><div><strong>SMRITI</strong><span>{text.subtitle}</span></div></button>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7}}><Globe2 size={17}/><select value={language} onChange={e=>changeLanguage(e.target.value as AppLanguage)}>{SUPPORTED_LANGUAGES.map(o=><option key={o.code} value={o.name}>{o.nativeName} — {o.name}</option>)}</select></div>
      <button type="button" className="family-faces-home" onClick={()=>navigate("/home")} aria-label="Home"><Home size={20}/></button>
    </header>
    <div className="family-faces-content">
      <section className="family-faces-title"><span className="family-faces-eyebrow">{text.eyebrow}</span><h1>{text.title}</h1><p>{text.description}</p></section>

      {phase==="loading"&&<section className="family-faces-panel centered-panel"><UsersRound size={42}/><h2>{text.loading}</h2><p>{text.wait}</p></section>}
      {phase==="not-enough"&&<section className="family-faces-panel centered-panel"><div className="family-large-icon"><UsersRound size={40}/></div><h2>{text.needTitle}</h2><p>{text.needText}</p><button type="button" className="family-primary-button" onClick={()=>navigate("/games")}><ArrowLeft size={19}/>{text.back}</button></section>}

      {phase==="ready"&&<section className="family-faces-panel ready-panel">
        <div className="family-ready-icon"><Heart size={34}/></div><span className="family-panel-eyebrow">{text.personal}</span><h2>{text.readyTitle}</h2><p>{text.readyText}</p>
        <div className="family-difficulty-section"><span>{text.choose}</span><div className="family-difficulty-options">{(["Easy","Medium","Hard"] as Difficulty[]).map(level=><button type="button" key={level} className={difficulty===level?"difficulty-option difficulty-selected":"difficulty-option"} onClick={()=>setDifficulty(level)}>{language==="Assamese"?(level==="Easy"?"সহজ":level==="Medium"?"মধ্যম":"কঠিন"):level}</button>)}</div></div>
        <div className="family-ready-info"><span><UsersRound size={18}/>{familyMembers.length} {text.people}</span><span><Clock3 size={18}/>{text.noPressure}</span></div>
        <button type="button" className="family-primary-button" onClick={()=>startGame(difficulty)}><Play size={19} fill="currentColor"/>{text.start}</button>
      </section>}

      {(phase==="playing"||phase==="feedback")&&round&&<>
        <section className="family-game-status"><div><span>{text.round}</span><strong>{roundNumber} / {config.rounds}</strong></div><div><span>{text.correct}</span><strong>{correctAnswers}</strong></div><div><span>{text.time}</span><strong>{formatTime(elapsedSeconds)}</strong></div><div><span>{text.level}</span><strong>{difficulty}</strong></div></section>
        <section className="family-question-panel">
          <div className="family-question-heading"><div><span className="family-panel-eyebrow">{text.recognise}</span><h2>{text.question}</h2></div><button type="button" className="family-listen-button" onClick={()=>speak(text.question)}><Volume2 size={19}/>{text.listen}</button></div>
          <div className="family-target-photo"><img src={round.target.photo} alt="Familiar person"/></div><p className="family-gentle-note">{text.gentle}</p>
          <div className="family-answer-grid">{round.options.map(member=>{const target=member.id===round.target.id, selected=member.id===selectedId;let c="family-answer-button";if(phase==="feedback"){if(target)c+=" family-answer-correct";else if(selected)c+=" family-answer-wrong";}return <button type="button" key={member.id} className={c} disabled={phase==="feedback"} onClick={()=>handleAnswer(member)}>{member.name}</button>;})}</div>
          {phase==="feedback"&&<div className={wasCorrect?"family-feedback family-feedback-correct":"family-feedback"}><div className="family-feedback-icon">{wasCorrect?<CheckCircle2 size={27}/>:<Heart size={27}/>}</div><div className="family-feedback-copy"><strong>{wasCorrect?text.right:text.okay}</strong><p>{text.thisIs} <b>{round.target.name}</b>, {text.your} <b>{round.target.relationship||round.target.relation||"family member"}</b>.</p></div><button type="button" className="family-continue-button" onClick={continueGame}>{roundNumber>=config.rounds?text.results:text.next}</button></div>}
        </section>
      </>}

      {phase==="complete"&&<section className="family-faces-panel completion-panel">
        <div className="completion-heart"><Heart size={38}/></div><span className="family-panel-eyebrow">{text.complete}</span><h2>{text.completeTitle}</h2><p>{text.completeText}</p>
        <div className="family-results-grid"><div><span>{text.correct}</span><strong>{correctAnswers} / {attempts}</strong></div><div><span>{text.accuracy}</span><strong>{accuracy}%</strong></div><div><span>{text.time}</span><strong>{formatTime(elapsedSeconds)}</strong></div><div><span>{text.difficulty}</span><strong>{difficulty}</strong></div></div>
        <div style={{marginTop:22,padding:"18px 20px",borderRadius:14,background:"#f4f7f2",textAlign:"left"}}><span style={{fontSize:12,fontWeight:800,color:"#8c6a17"}}>{text.adaptive}</span><strong style={{display:"block",margin:"6px 0",color:"#123d31"}}>{text.nextLevel}: {recommendedNextDifficulty}</strong><p style={{margin:0}}>{adaptiveMessage}</p></div>
        <div className="completion-actions"><button type="button" className="family-secondary-button" onClick={restartGame}><RefreshCw size={18}/>{text.playAgain}</button><button type="button" className="family-primary-button" onClick={()=>startGame(recommendedNextDifficulty)}><Sparkles size={18}/>{text.playNext}</button><button type="button" className="family-secondary-button" onClick={()=>navigate("/games")}>{text.back}</button></div>
        {saving&&<span className="family-save-status">{text.saving}</span>}{saved&&<span className="family-save-status">{text.saved}</span>}{recommendationSaved&&<span className="family-save-status">{text.recommendationSaved}</span>}
      </section>}
    </div>
  </main>;
}
export default FamilyFacesGame;
