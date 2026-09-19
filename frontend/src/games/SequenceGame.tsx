import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Award,
  BarChart3,
  Check,
  Clock3,
  Eye,
  Globe2,
  Images,
  ListOrdered,
  Play,
  RotateCcw,
  Shuffle,
  Volume2,
} from "lucide-react";

import { saveGameSession, saveRecommendation } from "../services/api";

import {
  getLanguageOption,
  getStoredLanguage,
  saveLanguage,
  SUPPORTED_LANGUAGES,
} from "../i18n/languages";

import type { AppLanguage } from "../i18n/languages";

import "./SequenceGame.css";

/* =====================================================
   REAL GAME IMAGES
   ===================================================== */

import appleImg from "../assets/game-images/food/apple.jpg";
import bananaImg from "../assets/game-images/food/banana.jpg";
import mangoImg from "../assets/game-images/food/mango.jpg";
import strawberryImg from "../assets/game-images/food/strawberry.jpg";

import bookImg from "../assets/game-images/everyday/book.jpg";
import bottleImg from "../assets/game-images/everyday/bottle.jpg";
import penImg from "../assets/game-images/everyday/pen.jpg";
import walletImg from "../assets/game-images/everyday/wallet.jpg";

import chairImg from "../assets/game-images/household/chair.jpg";
import clockImg from "../assets/game-images/household/clock.jpg";
import keyImg from "../assets/game-images/household/key.jpg";
import umbrellaImg from "../assets/game-images/household/umbrella.jpg";

import dressImg from "../assets/game-images/clothing/dress.jpg";
import glassesImg from "../assets/game-images/clothing/glasses.jpg";
import hatImg from "../assets/game-images/clothing/hat.jpg";
import shoesImg from "../assets/game-images/clothing/shoes.jpg";

import flowerImg from "../assets/game-images/nature/flower.jpg";
import parkImg from "../assets/game-images/nature/park.jpg";
import plantImg from "../assets/game-images/nature/plant.jpg";
import treeImg from "../assets/game-images/nature/tree.jpg";

type Difficulty = "Easy" | "Medium" | "Hard";

type GamePhase =
  | "ready"
  | "memorize"
  | "answer"
  | "feedback"
  | "complete";

type GameItem = {
  id: string;
  label: string;
  image: string;
};

type DifficultyConfig = {
  sequenceLength: number;
  rounds: number;
  viewingSeconds: number;
};

/* =====================================================
   GAME DATA
   ===================================================== */

const GAME_ITEMS: GameItem[] = [
  { id: "apple", label: "Apple", image: appleImg },
  { id: "banana", label: "Banana", image: bananaImg },
  { id: "mango", label: "Mango", image: mangoImg },
  {
    id: "strawberry",
    label: "Strawberry",
    image: strawberryImg,
  },

  { id: "book", label: "Book", image: bookImg },
  { id: "bottle", label: "Bottle", image: bottleImg },
  { id: "pen", label: "Pen", image: penImg },
  { id: "wallet", label: "Wallet", image: walletImg },

  { id: "chair", label: "Chair", image: chairImg },
  { id: "clock", label: "Clock", image: clockImg },
  { id: "key", label: "Key", image: keyImg },
  {
    id: "umbrella",
    label: "Umbrella",
    image: umbrellaImg,
  },

  { id: "dress", label: "Dress", image: dressImg },
  {
    id: "glasses",
    label: "Glasses",
    image: glassesImg,
  },
  { id: "hat", label: "Hat", image: hatImg },
  { id: "shoes", label: "Shoes", image: shoesImg },

  { id: "flower", label: "Flower", image: flowerImg },
  { id: "park", label: "Park", image: parkImg },
  { id: "plant", label: "Plant", image: plantImg },
  { id: "tree", label: "Tree", image: treeImg },
];

const CONFIG: Record<Difficulty, DifficultyConfig> = {
  Easy: {
    sequenceLength: 3,
    rounds: 3,
    viewingSeconds: 4,
  },

  Medium: {
    sequenceLength: 4,
    rounds: 4,
    viewingSeconds: 3,
  },

  Hard: {
    sequenceLength: 5,
    rounds: 5,
    viewingSeconds: 3,
  },
};

/* =====================================================
   TRANSLATIONS
   ===================================================== */

const translations = {
  English: {
    activities: "Activities",
    brandSubtitle: "Memory & daily wellbeing",

    eyebrow: "MEMORY & ATTENTION",
    title: "Picture Sequence",

    description:
      "Remember a short sequence of familiar photographs, then select them again in the same order.",

    listenInstructions: "Listen to instructions",

    round: "Round",
    correct: "Correct",
    accuracy: "Accuracy",
    time: "Time",

    pictureSequence: "PICTURE SEQUENCE",

    rememberOrder: "Remember the order",

    readyDescription:
      "You will see a group of familiar photographs. Look at them carefully and remember the order from left to right.",

    chooseDifficulty: "Choose difficulty",

    easy: "Easy",
    medium: "Medium",
    hard: "Hard",

    pictures: "pictures",
    eachSequence: "in each sequence",

    seconds: "seconds",
    second: "second",
    toRemember: "to remember",

    rounds: "rounds",
    inActivity: "in this activity",

    startActivity: "Start activity",

    rememberThisOrder: "Remember this order",

    memorizeDescription:
      "Look from left to right. Try to remember which picture comes first, second and next.",

    remaining: "remaining",

    memoryTip:
      "Take your time and notice each picture.",

    selectInOrder:
      "Select the pictures in order",

    answerDescription:
      "Tap the picture that came first, then the second, and continue until the sequence is complete.",

    correctKeepGoing:
      "Correct. Keep going.",

    correctPictureStart:
      "The correct picture here was",

    correctPictureEnd:
      "Keep going.",

    excellent:
      "Excellent. You remembered the whole sequence.",

    goodEffort:
      "Good effort. Take a moment to review the correct order.",

    correctOrderWas:
      "The correct order was:",

    nextRound:
      "The next round will begin automatically.",

    complete: "ACTIVITY COMPLETE",

    completeTitle:
      "Picture Sequence complete",

    completedAll:
      "You have completed all",

    score: "Score",
    difficulty: "Difficulty",

    saved:
      "Activity saved to your progress.",

    adaptiveRecommendation:
      "ADAPTIVE RECOMMENDATION",

    nextLevel:
      "Next activity level",

    strongHard:
      "You performed strongly. Hard level will continue for the next activity.",

    strongIncrease:
      "You performed strongly, so the next activity will be a little more challenging.",

    maintain:
      "This level suits your current performance, so the next activity will stay at the same level.",

    easyContinue:
      "Easy level will continue so you can practise comfortably.",

    easier:
      "The next activity will be made a little easier for comfortable practice.",

    playNextLevel:
      "Play next level",

    listen: "Listen",

    resetActivity:
      "Reset activity",

    speechTitle:
      "Picture Sequence. Remember the pictures in the order shown.",

    speechReadyStart:
      "You are on",

    speechDifficulty:
      "difficulty.",

    speechRemember:
      "You will remember",

    speechPictures:
      "pictures at a time.",

    speechMemorize:
      "Look carefully at the pictures and remember their order.",

    speechAnswer:
      "Select the pictures in the same order you saw them.",

    speechComplete:
      "The activity is complete. Your accuracy was",

    speechPercent:
      "percent. The recommended next level is",
  },

  Assamese: {
    activities: "কাৰ্যকলাপসমূহ",

    brandSubtitle:
      "স্মৃতি আৰু দৈনিক সুস্থতা",

    eyebrow:
      "স্মৃতি আৰু মনোযোগ",

    title:
      "ছবিৰ ক্ৰম",

    description:
      "চিনাকি ছবিৰ এটা সৰু ক্ৰম মনত ৰাখক, তাৰ পিছত একে ক্ৰমত ছবিসমূহ পুনৰ বাছনি কৰক।",

    listenInstructions:
      "নিৰ্দেশনা শুনক",

    round: "ৰাউণ্ড",
    correct: "শুদ্ধ",
    accuracy: "সঠিকতা",
    time: "সময়",

    pictureSequence:
      "ছবিৰ ক্ৰম",

    rememberOrder:
      "ক্ৰমটো মনত ৰাখক",

    readyDescription:
      "আপুনি কেইখনমান চিনাকি ছবি দেখিব। ছবিসমূহ ভালদৰে চাওক আৰু বাওঁফালৰ পৰা সোঁফাললৈ ক্ৰমটো মনত ৰাখক।",

    chooseDifficulty:
      "কঠিনতাৰ স্তৰ বাছনি কৰক",

    easy: "সহজ",
    medium: "মধ্যম",
    hard: "কঠিন",

    pictures: "খন ছবি",
    eachSequence:
      "প্ৰতিটো ক্ৰমত",

    seconds: "ছেকেণ্ড",
    second: "ছেকেণ্ড",
    toRemember:
      "মনত ৰাখিবলৈ",

    rounds: "টা ৰাউণ্ড",
    inActivity:
      "এই কাৰ্যকলাপত",

    startActivity:
      "কাৰ্যকলাপ আৰম্ভ কৰক",

    rememberThisOrder:
      "এই ক্ৰমটো মনত ৰাখক",

    memorizeDescription:
      "বাওঁফালৰ পৰা সোঁফাললৈ চাওক। কোনখন ছবি প্ৰথম, দ্বিতীয় আৰু তাৰ পিছত আহিছে মনত ৰাখিবলৈ চেষ্টা কৰক।",

    remaining: "বাকী",

    memoryTip:
      "লাহে লাহে কৰক আৰু প্ৰতিখন ছবি ভালদৰে লক্ষ্য কৰক।",

    selectInOrder:
      "ছবিসমূহ ক্ৰম অনুসৰি বাছনি কৰক",

    answerDescription:
      "প্ৰথমে অহা ছবিখন বাছনি কৰক, তাৰ পিছত দ্বিতীয়খন বাছনি কৰক আৰু ক্ৰমটো সম্পূৰ্ণ নোহোৱালৈকে আগবাঢ়ক।",

    correctKeepGoing:
      "শুদ্ধ। আগবাঢ়ি যাওক।",

    correctPictureStart:
      "ইয়াত শুদ্ধ ছবিখন আছিল",

    correctPictureEnd:
      "আগবাঢ়ি যাওক।",

    excellent:
      "খুব ভাল। আপুনি সম্পূৰ্ণ ক্ৰমটো মনত ৰাখিছে।",

    goodEffort:
      "ভাল চেষ্টা। শুদ্ধ ক্ৰমটো এবাৰ পুনৰ চাওক।",

    correctOrderWas:
      "শুদ্ধ ক্ৰমটো আছিল:",

    nextRound:
      "পৰৱৰ্তী ৰাউণ্ডটো স্বয়ংক্ৰিয়ভাৱে আৰম্ভ হ'ব।",

    complete:
      "কাৰ্যকলাপ সম্পূৰ্ণ",

    completeTitle:
      "ছবিৰ ক্ৰম সম্পূৰ্ণ",

    completedAll:
      "আপুনি সকলো",

    score: "স্ক'ৰ",
    difficulty:
      "কঠিনতাৰ স্তৰ",

    saved:
      "কাৰ্যকলাপটো আপোনাৰ অগ্ৰগতিত সংৰক্ষণ কৰা হৈছে।",

    adaptiveRecommendation:
      "অভিযোজিত পৰামৰ্শ",

    nextLevel:
      "পৰৱৰ্তী কাৰ্যকলাপৰ স্তৰ",

    strongHard:
      "আপুনি ভাল প্ৰদৰ্শন কৰিছে। পৰৱৰ্তী কাৰ্যকলাপতো কঠিন স্তৰ অব্যাহত থাকিব।",

    strongIncrease:
      "আপুনি ভাল প্ৰদৰ্শন কৰিছে, সেয়ে পৰৱৰ্তী কাৰ্যকলাপটো অলপ অধিক কঠিন হ'ব।",

    maintain:
      "এই স্তৰটো আপোনাৰ বৰ্তমানৰ প্ৰদৰ্শনৰ বাবে উপযুক্ত, সেয়ে পৰৱৰ্তী কাৰ্যকলাপতো একে স্তৰ থাকিব।",

    easyContinue:
      "আপুনি আৰামদায়কভাৱে অনুশীলন কৰিব পৰাকৈ সহজ স্তৰ অব্যাহত থাকিব।",

    easier:
      "আৰামদায়ক অনুশীলনৰ বাবে পৰৱৰ্তী কাৰ্যকলাপটো অলপ সহজ কৰা হ'ব।",

    playNextLevel:
      "পৰৱৰ্তী স্তৰ খেলক",

    listen: "শুনক",

    resetActivity:
      "কাৰ্যকলাপ পুনৰ আৰম্ভ কৰক",

    speechTitle:
      "ছবিৰ ক্ৰম। দেখুওৱা ক্ৰম অনুসৰি ছবিসমূহ মনত ৰাখক।",

    speechReadyStart:
      "আপুনি",

    speechDifficulty:
      "স্তৰত আছে।",

    speechRemember:
      "আপুনি এবাৰত",

    speechPictures:
      "খন ছবি মনত ৰাখিব।",

    speechMemorize:
      "ছবিসমূহ ভালদৰে চাওক আৰু সিহঁতৰ ক্ৰমটো মনত ৰাখক।",

    speechAnswer:
      "আপুনি যি ক্ৰমত ছবিসমূহ দেখিছিল, একে ক্ৰমত ছবিসমূহ বাছনি কৰক।",

    speechComplete:
      "কাৰ্যকলাপটো সম্পূৰ্ণ হৈছে। আপোনাৰ সঠিকতা আছিল",

    speechPercent:
      "শতাংশ। পৰৱৰ্তী পৰামৰ্শ দিয়া স্তৰ হৈছে",
  },
};

/* =====================================================
   ASSAMESE ITEM LABELS
   ===================================================== */

const itemNamesAssamese: Record<string, string> = {
  apple: "আপেল",
  banana: "কল",
  mango: "আম",
  strawberry: "ষ্ট্ৰবেৰী",

  book: "কিতাপ",
  bottle: "বটল",
  pen: "কলম",
  wallet: "মানিবেগ",

  chair: "চকী",
  clock: "ঘড়ী",
  key: "চাবি",
  umbrella: "ছাতি",

  dress: "পোছাক",
  glasses: "চশমা",
  hat: "টুপি",
  shoes: "জোতা",

  flower: "ফুল",
  park: "উদ্যান",
  plant: "গছপুলি",
  tree: "গছ",
};

/* =====================================================
   HELPERS
   ===================================================== */

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [copy[i], copy[randomIndex]] = [
      copy[randomIndex],
      copy[i],
    ];
  }

  return copy;
}

/* =====================================================
   ADAPTIVE DIFFICULTY
   ===================================================== */

function getAdaptiveDifficulty(
  currentDifficulty: Difficulty,
  accuracy: number
): Difficulty {
  if (accuracy >= 85) {
    if (currentDifficulty === "Easy") {
      return "Medium";
    }

    if (currentDifficulty === "Medium") {
      return "Hard";
    }

    return "Hard";
  }

  if (accuracy >= 50) {
    return currentDifficulty;
  }

  if (currentDifficulty === "Hard") {
    return "Medium";
  }

  if (currentDifficulty === "Medium") {
    return "Easy";
  }

  return "Easy";
}

function getRecommendationReason(
  currentDifficulty: Difficulty,
  recommendedDifficulty: Difficulty,
  accuracy: number
): string {
  if (accuracy >= 85) {
    if (currentDifficulty === "Hard") return "Strong performance at the highest difficulty. Continue at Hard level.";
    return `Strong performance with ${accuracy}% accuracy. Increase difficulty from ${currentDifficulty} to ${recommendedDifficulty}.`;
  }
  if (accuracy >= 50) return `Current performance is appropriate for this level with ${accuracy}% accuracy. Maintain ${currentDifficulty} difficulty.`;
  if (currentDifficulty === "Easy") return `Accuracy was ${accuracy}%. Continue at Easy level for comfortable practice.`;
  return `Accuracy was ${accuracy}%. Reduce difficulty from ${currentDifficulty} to ${recommendedDifficulty} for comfortable practice.`;
}

/* =====================================================
   COMPONENT
   ===================================================== */

function SequenceGame() {
  const navigate = useNavigate();

  /* =====================================================
     USER
     ===================================================== */

  let user: any = null;

  try {
    const storedUser = localStorage.getItem("user");

    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  const patientId = user?.patientId;

  /* =====================================================
     LANGUAGE
     ===================================================== */

  const [language, setLanguage] =
    useState<AppLanguage>(
      getStoredLanguage()
    );

  const languageOption =
    getLanguageOption(language);

  const text =
    language === "Assamese"
      ? translations.Assamese
      : translations.English;

  const handleLanguageChange = (
    selectedLanguage: AppLanguage
  ) => {
    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setLanguage(selectedLanguage);
    saveLanguage(selectedLanguage);
  };

  const getDifficultyLabel = (
    level: Difficulty
  ) => {
    if (level === "Easy") {
      return text.easy;
    }

    if (level === "Medium") {
      return text.medium;
    }

    return text.hard;
  };

  const getItemLabel = (
    item: GameItem
  ) => {
    if (
      language === "Assamese"
    ) {
      return (
        itemNamesAssamese[item.id] ||
        item.label
      );
    }

    return item.label;
  };

  /* =====================================================
     GAME STATE
     ===================================================== */

  const [difficulty, setDifficulty] =
    useState<Difficulty>("Easy");

  const [phase, setPhase] =
    useState<GamePhase>("ready");

  const [sequence, setSequence] =
    useState<GameItem[]>([]);

  const [options, setOptions] =
    useState<GameItem[]>([]);

  const [selectedItems, setSelectedItems] =
    useState<GameItem[]>([]);

  const [round, setRound] =
    useState(1);

  const [
    correctAnswers,
    setCorrectAnswers,
  ] = useState(0);

  const [attempts, setAttempts] =
    useState(0);

  const [countdown, setCountdown] =
    useState(
      CONFIG.Easy.viewingSeconds
    );

  const [
    elapsedSeconds,
    setElapsedSeconds,
  ] = useState(0);

  const [feedback, setFeedback] =
    useState("");

  const [
    lastRoundIds,
    setLastRoundIds,
  ] = useState<string[]>([]);

  const [saved, setSaved] =
    useState(false);

  const [recommendationSaved, setRecommendationSaved] =
    useState(false);

  const saveStarted = useRef(false);

  const timerStarted =
    useRef(false);

  const config =
    CONFIG[difficulty];

  /* =====================================================
     ACCURACY
     ===================================================== */

  const accuracy =
    useMemo(() => {
      if (attempts === 0) {
        return 0;
      }

      return Math.round(
        (correctAnswers /
          attempts) *
          100
      );
    }, [
      correctAnswers,
      attempts,
    ]);

  const recommendedNextDifficulty =
    useMemo(() => {
      return getAdaptiveDifficulty(
        difficulty,
        accuracy
      );
    }, [
      difficulty,
      accuracy,
    ]);

  const adaptiveMessage =
    useMemo(() => {
      if (accuracy >= 85) {
        if (
          difficulty === "Hard"
        ) {
          return text.strongHard;
        }

        return text.strongIncrease;
      }

      if (accuracy >= 50) {
        return text.maintain;
      }

      if (
        difficulty === "Easy"
      ) {
        return text.easyContinue;
      }

      return text.easier;
    }, [
      accuracy,
      difficulty,
      language,
      text.strongHard,
      text.strongIncrease,
      text.maintain,
      text.easyContinue,
      text.easier,
    ]);

  /* =====================================================
     ACTIVITY TIMER
     ===================================================== */

  useEffect(() => {
    if (
      phase === "ready" ||
      phase === "complete"
    ) {
      return;
    }

    timerStarted.current = true;

    const timer =
      window.setInterval(() => {
        setElapsedSeconds(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [phase]);

  /* =====================================================
     MEMORIZATION COUNTDOWN
     ===================================================== */

  useEffect(() => {
    if (
      phase !== "memorize"
    ) {
      return;
    }

    setCountdown(
      config.viewingSeconds
    );

    const countdownTimer =
      window.setInterval(() => {
        setCountdown(
          (previous) => {
            if (
              previous <= 1
            ) {
              window.clearInterval(
                countdownTimer
              );

              setOptions(
                shuffleArray(
                  sequence
                )
              );

              setSelectedItems(
                []
              );

              setPhase(
                "answer"
              );

              return 0;
            }

            return (
              previous - 1
            );
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(
        countdownTimer
      );
    };
  }, [
    phase,
    sequence,
    config.viewingSeconds,
  ]);

  /* =====================================================
     CREATE ROUND
     ===================================================== */

  const createRound = () => {
    const freshItems =
      GAME_ITEMS.filter(
        (item) =>
          !lastRoundIds.includes(
            item.id
          )
      );

    const source =
      freshItems.length >=
      config.sequenceLength
        ? freshItems
        : GAME_ITEMS;

    const newSequence =
      shuffleArray(source).slice(
        0,
        config.sequenceLength
      );

    setSequence(
      newSequence
    );

    setLastRoundIds(
      newSequence.map(
        (item) =>
          item.id
      )
    );

    setSelectedItems([]);
    setOptions([]);
    setFeedback("");

    setPhase("memorize");
  };

  /* =====================================================
     START ACTIVITY
     ===================================================== */

  const startActivity = () => {
    setRound(1);
    setCorrectAnswers(0);
    setAttempts(0);
    setElapsedSeconds(0);
    setFeedback("");
    setSaved(false);
    setRecommendationSaved(false);
    saveStarted.current = false;
    setLastRoundIds([]);

    timerStarted.current = true;

    const newSequence =
      shuffleArray(
        GAME_ITEMS
      ).slice(
        0,
        config.sequenceLength
      );

    setSequence(
      newSequence
    );

    setLastRoundIds(
      newSequence.map(
        (item) =>
          item.id
      )
    );

    setSelectedItems([]);
    setOptions([]);

    setPhase("memorize");
  };

  /* =====================================================
     START ADAPTIVE NEXT ACTIVITY
     ===================================================== */

  const startAdaptiveActivity =
    () => {
      const nextDifficulty =
        recommendedNextDifficulty;

      const nextConfig =
        CONFIG[
          nextDifficulty
        ];

      setDifficulty(
        nextDifficulty
      );

      setRound(1);
      setCorrectAnswers(0);
      setAttempts(0);
      setElapsedSeconds(0);
      setFeedback("");
      setSaved(false);
    setRecommendationSaved(false);
    saveStarted.current = false;
      setLastRoundIds([]);

      timerStarted.current =
        true;

      const newSequence =
        shuffleArray(
          GAME_ITEMS
        ).slice(
          0,
          nextConfig.sequenceLength
        );

      setSequence(
        newSequence
      );

      setLastRoundIds(
        newSequence.map(
          (item) =>
            item.id
        )
      );

      setSelectedItems([]);
      setOptions([]);

      setCountdown(
        nextConfig.viewingSeconds
      );

      setPhase("memorize");
    };

  /* =====================================================
     RESET ACTIVITY
     ===================================================== */

  const resetActivity = () => {
    setPhase("ready");

    setSequence([]);
    setOptions([]);
    setSelectedItems([]);

    setRound(1);

    setCorrectAnswers(0);
    setAttempts(0);

    setElapsedSeconds(0);

    setFeedback("");

    setLastRoundIds([]);

    setSaved(false);
    setRecommendationSaved(false);
    saveStarted.current = false;

    timerStarted.current =
      false;
  };

  /* =====================================================
     SELECT IMAGE
     ===================================================== */

  const handleSelect = (
    item: GameItem
  ) => {
    if (
      phase !== "answer"
    ) {
      return;
    }

    if (
      selectedItems.some(
        (selected) =>
          selected.id ===
          item.id
      )
    ) {
      return;
    }

    const position =
      selectedItems.length;

    const expectedItem =
      sequence[position];

    const isCorrect =
      item.id ===
      expectedItem.id;

    const nextAttempts =
      attempts + 1;

    const nextCorrect =
      correctAnswers +
      (isCorrect ? 1 : 0);

    setAttempts(
      nextAttempts
    );

    setCorrectAnswers(
      nextCorrect
    );

    const updatedSelection = [
      ...selectedItems,
      item,
    ];

    setSelectedItems(
      updatedSelection
    );

    if (isCorrect) {
      setFeedback(
        text.correctKeepGoing
      );
    } else {
      setFeedback(
        `${text.correctPictureStart} ${getItemLabel(
          expectedItem
        )}. ${text.correctPictureEnd}`
      );
    }

    if (
      updatedSelection.length ===
      sequence.length
    ) {
      setPhase(
        "feedback"
      );

      const roundIsPerfect =
        updatedSelection.every(
          (
            selected,
            index
          ) =>
            selected.id ===
            sequence[index].id
        );

      if (roundIsPerfect) {
        setFeedback(
          text.excellent
        );
      } else {
        setFeedback(
          text.goodEffort
        );
      }

      window.setTimeout(
        () => {
          if (
            round >=
            config.rounds
          ) {
            setPhase(
              "complete"
            );
          } else {
            setRound(
              (previous) =>
                previous + 1
            );

            createRound();
          }
        },
        2200
      );
    }
  };

  /* =====================================================
     SAVE COMPLETE SESSION + RECOMMENDATION
     ===================================================== */

  useEffect(() => {
    if (phase !== "complete" || saveStarted.current) {
      return;
    }

    if (!patientId) {
      console.warn(
        "No patientId found. Picture Sequence result was not saved."
      );
      return;
    }

    const finalAccuracy =
      attempts === 0
        ? 0
        : Math.round((correctAnswers / attempts) * 100);

    const currentDifficulty = difficulty;
    const nextDifficulty = getAdaptiveDifficulty(
      currentDifficulty,
      finalAccuracy
    );

    const recommendationReason = getRecommendationReason(
      currentDifficulty,
      nextDifficulty,
      finalAccuracy
    );

    saveStarted.current = true;

    const saveCompletedActivity = async () => {
      let sessionSucceeded = false;
      let recommendationSucceeded = false;

      try {
        await saveGameSession({
          patientId,
          gameName: "Picture Sequence",
          score: correctAnswers * 10,
          totalQuestions: attempts,
          accuracy: finalAccuracy,
          difficulty: currentDifficulty,
        });

        sessionSucceeded = true;
        setSaved(true);
        console.log("Picture Sequence session saved successfully");
      } catch (error) {
        console.error(
          "Failed to save Picture Sequence session:",
          error
        );
      }

      try {
        await saveRecommendation({
          patientId,
          gameName: "Picture Sequence",
          currentDifficulty,
          recommendedDifficulty: nextDifficulty,
          reason: recommendationReason,
          accuracy: finalAccuracy,
        });

        recommendationSucceeded = true;
        setRecommendationSaved(true);
        console.log(
          "Picture Sequence recommendation saved successfully"
        );
      } catch (error) {
        console.error(
          "Failed to save Picture Sequence recommendation:",
          error
        );
      }

      if (!sessionSucceeded && !recommendationSucceeded) {
        saveStarted.current = false;
      }
    };

    void saveCompletedActivity();
  }, [
    phase,
    patientId,
    correctAnswers,
    attempts,
    difficulty,
  ]);

  /* =====================================================
     SPEECH
     ===================================================== */

  const speakInstructions =
    () => {
      if (
        !(
          "speechSynthesis" in
          window
        )
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      let speechText =
        text.speechTitle;

      if (
        phase === "ready"
      ) {
        if (
          language ===
          "Assamese"
        ) {
          speechText +=
            ` ${text.speechReadyStart} ${getDifficultyLabel(
              difficulty
            )} ${text.speechDifficulty} ` +
            `${text.speechRemember} ${config.sequenceLength} ${text.speechPictures}`;
        } else {
          speechText +=
            ` ${text.speechReadyStart} ${getDifficultyLabel(
              difficulty
            )} ${text.speechDifficulty} ` +
            `${text.speechRemember} ${config.sequenceLength} ${text.speechPictures}`;
        }
      } else if (
        phase === "memorize"
      ) {
        speechText +=
          ` ${text.speechMemorize}`;
      } else if (
        phase === "answer"
      ) {
        speechText +=
          ` ${text.speechAnswer}`;
      } else if (
        phase === "complete"
      ) {
        speechText +=
          ` ${text.speechComplete} ${accuracy} ${text.speechPercent} ${getDifficultyLabel(
            recommendedNextDifficulty
          )}.`;
      }

      const utterance =
        new SpeechSynthesisUtterance(
          speechText
        );

      utterance.lang =
        languageOption.speechCode;

      utterance.rate =
        0.85;

      utterance.pitch =
        1;

      const voices =
        window.speechSynthesis.getVoices();

      const requestedCode =
        languageOption.speechCode.toLowerCase();

      const requestedBase =
        requestedCode.split(
          "-"
        )[0];

      const matchingVoice =
        voices.find(
          (voice) =>
            voice.lang.toLowerCase() ===
            requestedCode
        ) ||
        voices.find(
          (voice) =>
            voice.lang
              .toLowerCase()
              .split("-")[0] ===
            requestedBase
        );

      if (matchingVoice) {
        utterance.voice =
          matchingVoice;
      }

      window.speechSynthesis.speak(
        utterance
      );
    };

  /* =====================================================
     FORMAT TIME
     ===================================================== */

  const formatTime = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main className="sequence-page">

      {/* HEADER */}

      <header className="sequence-header">

        <button
          type="button"
          className="sequence-back"
          onClick={() =>
            navigate(
              "/games"
            )
          }
        >
          <ArrowLeft
            size={20}
          />

          <span>
            {text.activities}
          </span>
        </button>

        <button
          type="button"
          className="sequence-brand"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <span className="sequence-brand-mark">
            S
          </span>

          <span className="sequence-brand-copy">
            <strong>
              SMRITI
            </strong>

            <small>
              {
                text.brandSubtitle
              }
            </small>
          </span>
        </button>

        {/* LANGUAGE SELECTOR */}

        <div
          style={{
            marginLeft:
              "auto",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "7px",

            padding:
              "8px 11px",

            border:
              "1px solid rgba(23, 76, 60, 0.18)",

            borderRadius:
              "10px",

            background:
              "#ffffff",
          }}
        >
          <Globe2
            size={17}
          />

          <select
            aria-label="Select language"
            value={
              language
            }
            onChange={(
              event
            ) =>
              handleLanguageChange(
                event.target
                  .value as AppLanguage
              )
            }
            style={{
              border:
                "none",

              outline:
                "none",

              background:
                "transparent",

              color:
                "#174c3c",

              fontWeight:
                700,

              cursor:
                "pointer",
            }}
          >
            {SUPPORTED_LANGUAGES.map(
              (
                option
              ) => (
                <option
                  key={
                    option.code
                  }
                  value={
                    option.name
                  }
                >
                  {
                    option.nativeName
                  }{" "}
                  —{" "}
                  {
                    option.name
                  }
                </option>
              )
            )}
          </select>
        </div>
      </header>

      <div className="sequence-content">

        {/* TITLE */}

        <section className="sequence-title-area">

          <div>
            <span className="sequence-eyebrow">
              {
                text.eyebrow
              }
            </span>

            <h1>
              {text.title}
            </h1>

            <p>
              {
                text.description
              }
            </p>
          </div>

          <button
            type="button"
            className="sequence-listen"
            onClick={
              speakInstructions
            }
          >
            <Volume2
              size={20}
            />

            <span>
              {
                text.listenInstructions
              }
            </span>
          </button>
        </section>

        {/* STATS */}

        <section className="sequence-stats">

          <div className="sequence-stat">
            <ListOrdered
              size={20}
            />

            <div>
              <span>
                {text.round}
              </span>

              <strong>
                {Math.min(
                  round,
                  config.rounds
                )}{" "}
                /{" "}
                {
                  config.rounds
                }
              </strong>
            </div>
          </div>

          <div className="sequence-stat">
            <Check
              size={20}
            />

            <div>
              <span>
                {text.correct}
              </span>

              <strong>
                {
                  correctAnswers
                }
              </strong>
            </div>
          </div>

          <div className="sequence-stat">
            <BarChart3
              size={20}
            />

            <div>
              <span>
                {
                  text.accuracy
                }
              </span>

              <strong>
                {accuracy}%
              </strong>
            </div>
          </div>

          <div className="sequence-stat">
            <Clock3
              size={20}
            />

            <div>
              <span>
                {text.time}
              </span>

              <strong>
                {
                  formatTime(
                    elapsedSeconds
                  )
                }
              </strong>
            </div>
          </div>
        </section>

        {/* MAIN GAME */}

        <section className="sequence-game-card">

          {/* READY */}

          {phase ===
            "ready" && (
            <div className="sequence-ready">

              <div className="sequence-large-icon">
                <Images
                  size={36}
                />
              </div>

              <span className="sequence-small-label">
                {
                  text.pictureSequence
                }
              </span>

              <h2>
                {
                  text.rememberOrder
                }
              </h2>

              <p>
                {
                  text.readyDescription
                }
              </p>

              <div className="sequence-difficulty">

                <span>
                  {
                    text.chooseDifficulty
                  }
                </span>

                <div className="sequence-difficulty-buttons">
                  {(
                    [
                      "Easy",
                      "Medium",
                      "Hard",
                    ] as Difficulty[]
                  ).map(
                    (
                      level
                    ) => (
                      <button
                        key={
                          level
                        }
                        type="button"
                        className={
                          difficulty ===
                          level
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setDifficulty(
                            level
                          )
                        }
                      >
                        {
                          getDifficultyLabel(
                            level
                          )
                        }
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="sequence-ready-info">

                <div>
                  <Images
                    size={20}
                  />

                  <span>
                    <strong>
                      {
                        config.sequenceLength
                      }{" "}
                      {
                        text.pictures
                      }
                    </strong>

                    <small>
                      {
                        text.eachSequence
                      }
                    </small>
                  </span>
                </div>

                <div>
                  <Clock3
                    size={20}
                  />

                  <span>
                    <strong>
                      {
                        config.viewingSeconds
                      }{" "}
                      {
                        text.seconds
                      }
                    </strong>

                    <small>
                      {
                        text.toRemember
                      }
                    </small>
                  </span>
                </div>

                <div>
                  <ListOrdered
                    size={20}
                  />

                  <span>
                    <strong>
                      {
                        config.rounds
                      }{" "}
                      {
                        text.rounds
                      }
                    </strong>

                    <small>
                      {
                        text.inActivity
                      }
                    </small>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="sequence-primary-button"
                onClick={
                  startActivity
                }
              >
                <Play
                  size={18}
                  fill="currentColor"
                />

                {
                  text.startActivity
                }
              </button>
            </div>
          )}

          {/* MEMORIZE */}

          {phase ===
            "memorize" && (
            <div className="sequence-play-area">

              <div className="sequence-phase-heading">

                <div className="sequence-phase-icon">
                  <Eye
                    size={25}
                  />
                </div>

                <div>
                  <span>
                    {
                      text.round
                    }{" "}
                    {round}
                  </span>

                  <h2>
                    {
                      text.rememberThisOrder
                    }
                  </h2>

                  <p>
                    {
                      text.memorizeDescription
                    }
                  </p>
                </div>
              </div>

              <div className="sequence-countdown">
                <Clock3
                  size={19}
                />

                <span>
                  {countdown}{" "}
                  {countdown === 1
                    ? text.second
                    : text.seconds}{" "}
                  {
                    text.remaining
                  }
                </span>
              </div>

              <div
                className={`sequence-images sequence-images-${sequence.length}`}
              >
                {sequence.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="sequence-image-card"
                      key={
                        item.id
                      }
                    >
                      <div className="sequence-number">
                        {index +
                          1}
                      </div>

                      <img
                        src={
                          item.image
                        }
                        alt={
                          getItemLabel(
                            item
                          )
                        }
                      />

                      <span>
                        {
                          getItemLabel(
                            item
                          )
                        }
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="sequence-memory-tip">
                <Eye
                  size={18}
                />

                <span>
                  {
                    text.memoryTip
                  }
                </span>
              </div>
            </div>
          )}

          {/* ANSWER */}

          {phase ===
            "answer" && (
            <div className="sequence-play-area">

              <div className="sequence-phase-heading">

                <div className="sequence-phase-icon">
                  <ListOrdered
                    size={25}
                  />
                </div>

                <div>
                  <span>
                    {
                      text.round
                    }{" "}
                    {round}
                  </span>

                  <h2>
                    {
                      text.selectInOrder
                    }
                  </h2>

                  <p>
                    {
                      text.answerDescription
                    }
                  </p>
                </div>
              </div>

              <div className="sequence-answer-progress">
                {sequence.map(
                  (
                    _,
                    index
                  ) => {
                    const selected =
                      selectedItems[
                        index
                      ];

                    return (
                      <div
                        className={`sequence-answer-slot ${
                          selected
                            ? "filled"
                            : ""
                        }`}
                        key={
                          index
                        }
                      >
                        <span>
                          {index +
                            1}
                        </span>

                        {selected ? (
                          <img
                            src={
                              selected.image
                            }
                            alt={
                              getItemLabel(
                                selected
                              )
                            }
                          />
                        ) : (
                          <strong>
                            ?
                          </strong>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              <div
                className={`sequence-options sequence-options-${options.length}`}
              >
                {options.map(
                  (
                    item
                  ) => {
                    const selected =
                      selectedItems.some(
                        (
                          selectedItem
                        ) =>
                          selectedItem.id ===
                          item.id
                      );

                    return (
                      <button
                        type="button"
                        key={
                          item.id
                        }
                        className={`sequence-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        disabled={
                          selected
                        }
                        onClick={() =>
                          handleSelect(
                            item
                          )
                        }
                      >
                        <img
                          src={
                            item.image
                          }
                          alt={
                            getItemLabel(
                              item
                            )
                          }
                        />

                        <span>
                          {
                            getItemLabel(
                              item
                            )
                          }
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {feedback && (
                <div className="sequence-feedback">
                  <Check
                    size={19}
                  />

                  <span>
                    {
                      feedback
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK */}

          {phase ===
            "feedback" && (
            <div className="sequence-play-area">

              <div className="sequence-feedback-result">

                <div className="sequence-large-icon">
                  <Check
                    size={36}
                  />
                </div>

                <h2>
                  {feedback}
                </h2>

                <p>
                  {
                    text.correctOrderWas
                  }
                </p>

                <div className="sequence-review">
                  {sequence.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          item.id
                        }
                        className="sequence-review-item"
                      >
                        <span>
                          {index +
                            1}
                        </span>

                        <img
                          src={
                            item.image
                          }
                          alt={
                            getItemLabel(
                              item
                            )
                          }
                        />

                        <strong>
                          {
                            getItemLabel(
                              item
                            )
                          }
                        </strong>
                      </div>
                    )
                  )}
                </div>

                <small>
                  {
                    text.nextRound
                  }
                </small>
              </div>
            </div>
          )}

          {/* COMPLETE */}

          {phase ===
            "complete" && (
            <div className="sequence-complete">

              <div className="sequence-complete-icon">
                <Award
                  size={40}
                />
              </div>

              <span className="sequence-small-label">
                {
                  text.complete
                }
              </span>

              <h2>
                {
                  text.completeTitle
                }
              </h2>

              <p>
                {
                  text.completedAll
                }{" "}
                {
                  config.rounds
                }{" "}
                {
                  text.rounds
                }.
              </p>

              <div className="sequence-complete-stats">

                <div>
                  <strong>
                    {
                      correctAnswers *
                      10
                    }
                  </strong>

                  <span>
                    {
                      text.score
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {accuracy}%
                  </strong>

                  <span>
                    {
                      text.accuracy
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      getDifficultyLabel(
                        difficulty
                      )
                    }
                  </strong>

                  <span>
                    {
                      text.difficulty
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      formatTime(
                        elapsedSeconds
                      )
                    }
                  </strong>

                  <span>
                    {
                      text.time
                    }
                  </span>
                </div>
              </div>

              {saved && (
                <div
                  style={{
                    marginTop:
                      "18px",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    gap:
                      "8px",

                    fontWeight:
                      700,

                    color:
                      "#245c48",
                  }}
                >
                  <Check
                    size={18}
                  />

                  {
                    text.saved
                  }
                </div>
              )}

              {/* ADAPTIVE RECOMMENDATION */}

              <div
                style={{
                  marginTop:
                    "22px",

                  marginBottom:
                    "22px",

                  padding:
                    "18px 20px",

                  borderRadius:
                    "14px",

                  background:
                    "#f4f7f2",

                  textAlign:
                    "left",
                }}
              >
                <span
                  style={{
                    display:
                      "block",

                    marginBottom:
                      "5px",

                    fontSize:
                      "12px",

                    fontWeight:
                      800,

                    letterSpacing:
                      "0.08em",

                    color:
                      "#8c6a17",
                  }}
                >
                  {
                    text.adaptiveRecommendation
                  }
                </span>

                <strong
                  style={{
                    display:
                      "block",

                    marginBottom:
                      "7px",

                    fontSize:
                      "18px",

                    color:
                      "#123d31",
                  }}
                >
                  {
                    text.nextLevel
                  }
                  :{" "}
                  {
                    getDifficultyLabel(
                      recommendedNextDifficulty
                    )
                  }
                </strong>

                <p
                  style={{
                    margin: 0,
                    lineHeight:
                      1.6,
                  }}
                >
                  {
                    adaptiveMessage
                  }
                </p>

                {recommendationSaved && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#245c48",
                    }}
                  >
                    <Check size={16} />
                    Recommendation saved
                  </div>
                )}
              </div>

              <div className="sequence-complete-actions">

                <button
                  type="button"
                  className="sequence-secondary-button"
                  onClick={() =>
                    navigate(
                      "/games"
                    )
                  }
                >
                  <ArrowLeft
                    size={18}
                  />

                  {
                    text.activities
                  }
                </button>

                <button
                  type="button"
                  className="sequence-primary-button"
                  onClick={
                    startAdaptiveActivity
                  }
                >
                  <Shuffle
                    size={18}
                  />

                  {
                    text.playNextLevel
                  }
                </button>
              </div>
            </div>
          )}
        </section>

        {/* BOTTOM CONTROLS */}

        {phase !==
          "ready" &&
          phase !==
            "complete" && (
            <div className="sequence-bottom-actions">

              <button
                type="button"
                onClick={
                  speakInstructions
                }
              >
                <Volume2
                  size={18}
                />

                {
                  text.listen
                }
              </button>

              <button
                type="button"
                onClick={
                  resetActivity
                }
              >
                <RotateCcw
                  size={18}
                />

                {
                  text.resetActivity
                }
              </button>
            </div>
          )}
      </div>
    </main>
  );
}

export default SequenceGame;