import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Award,
  BarChart3,
  Check,
  Clock3,
  Eye,
  Globe2,
  Play,
  RotateCcw,
  Shuffle,
  Volume2,
  X,
} from "lucide-react";

import {
  saveGameSession,
  saveRecommendation,
} from "../services/api";

import {
  getLanguageOption,
  getStoredLanguage,
  saveLanguage,
  SUPPORTED_LANGUAGES,
} from "../i18n/languages";

import type {
  AppLanguage,
} from "../i18n/languages";

import "./FindFamiliarGame.css";

/* =========================================================
   EXISTING PROJECT IMAGES ONLY
   ========================================================= */

/* FOOD */

import appleImg from "../assets/game-images/food/apple.jpg";
import bananaImg from "../assets/game-images/food/banana.jpg";
import mangoImg from "../assets/game-images/food/mango.jpg";
import strawberryImg from "../assets/game-images/food/strawberry.jpg";

/* EVERYDAY */

import bookImg from "../assets/game-images/everyday/book.jpg";
import bottleImg from "../assets/game-images/everyday/bottle.jpg";
import penImg from "../assets/game-images/everyday/pen.jpg";
import walletImg from "../assets/game-images/everyday/wallet.jpg";

/* HOUSEHOLD */

import chairImg from "../assets/game-images/household/chair.jpg";
import clockImg from "../assets/game-images/household/clock.jpg";
import keyImg from "../assets/game-images/household/key.jpg";
import umbrellaImg from "../assets/game-images/household/umbrella.jpg";

/* CLOTHING */

import dressImg from "../assets/game-images/clothing/dress.jpg";
import glassesImg from "../assets/game-images/clothing/glasses.jpg";
import hatImg from "../assets/game-images/clothing/hat.jpg";
import shoesImg from "../assets/game-images/clothing/shoes.jpg";

/* NATURE */

import flowerImg from "../assets/game-images/nature/flower.jpg";
import parkImg from "../assets/game-images/nature/park.jpg";
import plantImg from "../assets/game-images/nature/plant.jpg";
import treeImg from "../assets/game-images/nature/tree.jpg";

/* =========================================================
   TYPES
   ========================================================= */

type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard";

type GamePhase =
  | "ready"
  | "playing"
  | "feedback"
  | "complete";

type GameItem = {
  id: string;
  label: string;
  image: string;
  category: string;
};

type DifficultyConfig = {
  choices: number;
  rounds: number;
};

/* =========================================================
   GAME ITEMS
   ========================================================= */

const GAME_ITEMS: GameItem[] = [
  {
    id: "apple",
    label: "Apple",
    image: appleImg,
    category: "food",
  },
  {
    id: "banana",
    label: "Banana",
    image: bananaImg,
    category: "food",
  },
  {
    id: "mango",
    label: "Mango",
    image: mangoImg,
    category: "food",
  },
  {
    id: "strawberry",
    label: "Strawberry",
    image: strawberryImg,
    category: "food",
  },

  {
    id: "book",
    label: "Book",
    image: bookImg,
    category: "everyday",
  },
  {
    id: "bottle",
    label: "Bottle",
    image: bottleImg,
    category: "everyday",
  },
  {
    id: "pen",
    label: "Pen",
    image: penImg,
    category: "everyday",
  },
  {
    id: "wallet",
    label: "Wallet",
    image: walletImg,
    category: "everyday",
  },

  {
    id: "chair",
    label: "Chair",
    image: chairImg,
    category: "home",
  },
  {
    id: "clock",
    label: "Clock",
    image: clockImg,
    category: "home",
  },
  {
    id: "key",
    label: "Key",
    image: keyImg,
    category: "everyday",
  },
  {
    id: "umbrella",
    label: "Umbrella",
    image: umbrellaImg,
    category: "everyday",
  },

  {
    id: "dress",
    label: "Dress",
    image: dressImg,
    category: "clothing",
  },
  {
    id: "glasses",
    label: "Glasses",
    image: glassesImg,
    category: "clothing",
  },
  {
    id: "hat",
    label: "Hat",
    image: hatImg,
    category: "clothing",
  },
  {
    id: "shoes",
    label: "Shoes",
    image: shoesImg,
    category: "clothing",
  },

  {
    id: "flower",
    label: "Flower",
    image: flowerImg,
    category: "nature",
  },
  {
    id: "park",
    label: "Park",
    image: parkImg,
    category: "nature",
  },
  {
    id: "plant",
    label: "Plant",
    image: plantImg,
    category: "nature",
  },
  {
    id: "tree",
    label: "Tree",
    image: treeImg,
    category: "nature",
  },
];

/* =========================================================
   DIFFICULTY
   ========================================================= */

const CONFIG: Record<
  Difficulty,
  DifficultyConfig
> = {
  Easy: {
    choices: 4,
    rounds: 5,
  },

  Medium: {
    choices: 6,
    rounds: 6,
  },

  Hard: {
    choices: 8,
    rounds: 8,
  },
};

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
  English: {
    activities: "Activities",

    brandSubtitle:
      "Memory & Cognitive Support",

    eyebrow:
      "ATTENTION & RECOGNITION",

    title:
      "Find the Familiar",

    description:
      "Find a familiar everyday object from a group of photographs.",

    listenInstructions:
      "Listen to instructions",

    round:
      "Round",

    correct:
      "Correct",

    accuracy:
      "Accuracy",

    time:
      "Time",

    objectRecognition:
      "OBJECT RECOGNITION",

    findRequested:
      "Find the requested object",

    readyDescription:
      "You will see several familiar photographs. Read or listen to the object name, then tap the matching picture.",

    chooseDifficulty:
      "Choose difficulty",

    easy:
      "Easy",

    medium:
      "Medium",

    hard:
      "Hard",

    pictures:
      "pictures",

    toChoose:
      "to choose from",

    randomObjects:
      "Random objects",

    eachRound:
      "each round",

    rounds:
      "rounds",

    inActivity:
      "in this activity",

    startActivity:
      "Start activity",

    findThe:
      "Find the",

    tapPhoto:
      "Tap the photograph that matches the object above.",

    hearObject:
      "Hear object name",

    correctAnswer:
      "Correct. That is the",

    wrongStart:
      "That is",

    wrongMiddle:
      "The",

    wrongEnd:
      "is highlighted for you.",

    activityComplete:
      "ACTIVITY COMPLETE",

    completeTitle:
      "Find the Familiar complete",

    completedAll:
      "You completed all",

    recognitionRounds:
      "recognition rounds.",

    score:
      "Score",

    difficulty:
      "Difficulty",

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

    backActivities:
      "Activities",

    playNextLevel:
      "Play next level",

    newActivity:
      "New activity",

    listen:
      "Listen",

    reset:
      "Reset activity",

    speechReadyStart:
      "Find the Familiar. You are using",

    speechReadyMiddle:
      "difficulty. You will be asked to find a familiar object from several photographs.",

    speechFind:
      "Find the",

    speechCompleteStart:
      "Activity complete. Your accuracy was",

    speechCompleteMiddle:
      "percent. The recommended next level is",
  },

  Assamese: {
    activities:
      "কাৰ্যকলাপ",

    brandSubtitle:
      "স্মৃতি আৰু জ্ঞানীয় সহায়",

    eyebrow:
      "মনোযোগ আৰু চিনাক্তকৰণ",

    title:
      "চিনাকি বস্তু বিচাৰক",

    description:
      "কেইবাখনো ছবিৰ মাজৰ পৰা চিনাকি দৈনন্দিন বস্তুটো বিচাৰি উলিয়াওক।",

    listenInstructions:
      "নিৰ্দেশনা শুনক",

    round:
      "ৰাউণ্ড",

    correct:
      "শুদ্ধ",

    accuracy:
      "সঠিকতা",

    time:
      "সময়",

    objectRecognition:
      "বস্তু চিনাক্তকৰণ",

    findRequested:
      "কোৱা বস্তুটো বিচাৰক",

    readyDescription:
      "আপুনি কেইবাখনো চিনাকি বস্তুৰ ছবি দেখিব। বস্তুটোৰ নাম পঢ়ক বা শুনক, তাৰ পিছত মিল থকা ছবিখন বাছনি কৰক।",

    chooseDifficulty:
      "কঠিনতাৰ স্তৰ বাছনি কৰক",

    easy:
      "সহজ",

    medium:
      "মধ্যম",

    hard:
      "কঠিন",

    pictures:
      "খন ছবি",

    toChoose:
      "বাছনি কৰিবলৈ",

    randomObjects:
      "বিভিন্ন বস্তু",

    eachRound:
      "প্ৰতিটো ৰাউণ্ডত",

    rounds:
      "টা ৰাউণ্ড",

    inActivity:
      "এই কাৰ্যকলাপত",

    startActivity:
      "কাৰ্যকলাপ আৰম্ভ কৰক",

    findThe:
      "বিচাৰক:",

    tapPhoto:
      "ওপৰত উল্লেখ কৰা বস্তুটোৰ সৈতে মিল থকা ছবিখন বাছনি কৰক।",

    hearObject:
      "বস্তুটোৰ নাম শুনক",

    correctAnswer:
      "শুদ্ধ। এইটো",

    wrongStart:
      "এইটো",

    wrongMiddle:
      "শুদ্ধ বস্তুটো",

    wrongEnd:
      "আপোনাৰ বাবে দেখুওৱা হৈছে।",

    activityComplete:
      "কাৰ্যকলাপ সম্পূৰ্ণ",

    completeTitle:
      "চিনাকি বস্তু বিচৰা সম্পূৰ্ণ",

    completedAll:
      "আপুনি সকলো",

    recognitionRounds:
      "টা চিনাক্তকৰণ ৰাউণ্ড সম্পূৰ্ণ কৰিলে।",

    score:
      "স্ক'ৰ",

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

    backActivities:
      "কাৰ্যকলাপ",

    playNextLevel:
      "পৰৱৰ্তী স্তৰ খেলক",

    newActivity:
      "নতুন কাৰ্যকলাপ",

    listen:
      "শুনক",

    reset:
      "পুনৰ আৰম্ভ কৰক",

    speechReadyStart:
      "চিনাকি বস্তু বিচাৰক। আপুনি",

    speechReadyMiddle:
      "স্তৰ ব্যৱহাৰ কৰিছে। কেইবাখনো ছবিৰ মাজৰ পৰা চিনাকি বস্তুটো বিচাৰি উলিয়াওক।",

    speechFind:
      "বিচাৰক",

    speechCompleteStart:
      "কাৰ্যকলাপটো সম্পূৰ্ণ হৈছে। আপোনাৰ সঠিকতা আছিল",

    speechCompleteMiddle:
      "শতাংশ। পৰৱৰ্তী পৰামৰ্শ দিয়া স্তৰ হৈছে",
  },
};

/* =========================================================
   ASSAMESE ITEM NAMES
   ========================================================= */

const itemNamesAssamese: Record<
  string,
  string
> = {
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

/* =========================================================
   HELPERS
   ========================================================= */

function shuffleArray<T>(
  items: T[]
): T[] {
  const copy = [...items];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (i + 1)
      );

    [
      copy[i],
      copy[randomIndex],
    ] = [
      copy[randomIndex],
      copy[i],
    ];
  }

  return copy;
}

function getPatientId() {
  try {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (!storedUser) {
      return undefined;
    }

    return JSON.parse(
      storedUser
    )?.patientId;
  } catch {
    return undefined;
  }
}

/* =========================================================
   ADAPTIVE DIFFICULTY
   ========================================================= */

function getAdaptiveDifficulty(
  currentDifficulty: Difficulty,
  accuracy: number
): Difficulty {
  if (accuracy >= 85) {
    if (
      currentDifficulty ===
      "Easy"
    ) {
      return "Medium";
    }

    if (
      currentDifficulty ===
      "Medium"
    ) {
      return "Hard";
    }

    return "Hard";
  }

  if (accuracy >= 50) {
    return currentDifficulty;
  }

  if (
    currentDifficulty ===
    "Hard"
  ) {
    return "Medium";
  }

  if (
    currentDifficulty ===
    "Medium"
  ) {
    return "Easy";
  }

  return "Easy";
}

function getRecommendationReason(
  currentDifficulty: Difficulty,
  recommendedDifficulty: Difficulty,
  accuracy: number
) {
  if (accuracy >= 85) {
    if (currentDifficulty === "Hard") {
      return "Strong performance recorded. Hard difficulty is recommended to continue.";
    }
    return `Strong performance recorded. Difficulty is recommended to increase from ${currentDifficulty} to ${recommendedDifficulty}.`;
  }

  if (accuracy >= 50) {
    return `Current performance is suited to ${currentDifficulty}, so the same difficulty is recommended.`;
  }

  if (currentDifficulty === "Easy") {
    return "Easy difficulty is recommended to continue for comfortable practice.";
  }

  return `A lower difficulty is recommended for comfortable practice, moving from ${currentDifficulty} to ${recommendedDifficulty}.`;
}

/* =========================================================
   COMPONENT
   ========================================================= */

function FindFamiliarGame() {
  const navigate =
    useNavigate();

  const saveStarted =
    useRef(false);

  /* =======================================================
     LANGUAGE
     ======================================================= */

  const [
    language,
    setLanguage,
  ] = useState<AppLanguage>(
    getStoredLanguage()
  );

  const languageOption =
    getLanguageOption(
      language
    );

  const text =
    language === "Assamese"
      ? translations.Assamese
      : translations.English;

  function handleLanguageChange(
    selectedLanguage: AppLanguage
  ) {
    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }

    setLanguage(
      selectedLanguage
    );

    saveLanguage(
      selectedLanguage
    );
  }

  function getItemName(
    item: GameItem
  ) {
    if (
      language ===
      "Assamese"
    ) {
      return (
        itemNamesAssamese[
          item.id
        ] || item.label
      );
    }

    return item.label;
  }

  function getDifficultyLabel(
    level: Difficulty
  ) {
    if (level === "Easy") {
      return text.easy;
    }

    if (
      level === "Medium"
    ) {
      return text.medium;
    }

    return text.hard;
  }

  /* =======================================================
     GAME STATE
     ======================================================= */

  const [
    difficulty,
    setDifficulty,
  ] =
    useState<Difficulty>(
      "Easy"
    );

  const [
    phase,
    setPhase,
  ] =
    useState<GamePhase>(
      "ready"
    );

  const [
    round,
    setRound,
  ] =
    useState(1);

  const [
    target,
    setTarget,
  ] =
    useState<GameItem | null>(
      null
    );

  const [
    options,
    setOptions,
  ] =
    useState<GameItem[]>(
      []
    );

  const [
    selectedId,
    setSelectedId,
  ] =
    useState<string | null>(
      null
    );

  const [
    correctAnswers,
    setCorrectAnswers,
  ] =
    useState(0);

  const [
    attempts,
    setAttempts,
  ] =
    useState(0);

  const [
    elapsedSeconds,
    setElapsedSeconds,
  ] =
    useState(0);

  const [
    feedback,
    setFeedback,
  ] =
    useState("");

  const [
    lastTargetId,
    setLastTargetId,
  ] =
    useState<string | null>(
      null
    );

  const [
    saved,
    setSaved,
  ] =
    useState(false);

  const [
    recommendationSaved,
    setRecommendationSaved,
  ] =
    useState(false);

  const config =
    CONFIG[difficulty];

  /* =======================================================
     ACCURACY
     ======================================================= */

  const accuracy =
    useMemo(() => {
      if (
        attempts === 0
      ) {
        return 0;
      }

      return Math.round(
        (
          correctAnswers /
          attempts
        ) * 100
      );
    }, [
      correctAnswers,
      attempts,
    ]);

  /* =======================================================
     ADAPTIVE RECOMMENDATION
     ======================================================= */

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
          difficulty ===
          "Hard"
        ) {
          return text.strongHard;
        }

        return text.strongIncrease;
      }

      if (accuracy >= 50) {
        return text.maintain;
      }

      if (
        difficulty ===
        "Easy"
      ) {
        return text.easyContinue;
      }

      return text.easier;
    }, [
      accuracy,
      difficulty,
      text.strongHard,
      text.strongIncrease,
      text.maintain,
      text.easyContinue,
      text.easier,
    ]);

  /* =======================================================
     TIMER
     ======================================================= */

  useEffect(() => {
    if (
      phase === "ready" ||
      phase === "complete"
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setElapsedSeconds(
            (previous) =>
              previous + 1
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [phase]);

  /* =======================================================
     CREATE ROUND
     ======================================================= */

  function createRound(
    currentDifficulty:
      Difficulty = difficulty,
    excludedTargetId:
      string | null =
      lastTargetId
  ) {
    const currentConfig =
      CONFIG[
        currentDifficulty
      ];

    let possibleTargets =
      GAME_ITEMS.filter(
        (item) =>
          item.id !==
          excludedTargetId
      );

    if (
      possibleTargets.length ===
      0
    ) {
      possibleTargets =
        GAME_ITEMS;
    }

    const shuffledTargets =
      shuffleArray(
        possibleTargets
      );

    const newTarget =
      shuffledTargets[0];

    if (!newTarget) {
      return;
    }

    let distractors:
      GameItem[] = [];

    /*
     * Hard mode intentionally
     * includes more visually /
     * semantically related
     * categories where possible.
     */

    if (
      currentDifficulty ===
      "Hard"
    ) {
      const sameCategory =
        shuffleArray(
          GAME_ITEMS.filter(
            (item) =>
              item.id !==
                newTarget.id &&
              item.category ===
                newTarget.category
          )
        );

      distractors =
        sameCategory.slice(
          0,
          Math.min(
            3,
            currentConfig.choices -
              1
          )
        );
    }

    const usedIds =
      new Set([
        newTarget.id,
        ...distractors.map(
          (item) =>
            item.id
        ),
      ]);

    const remaining =
      shuffleArray(
        GAME_ITEMS.filter(
          (item) =>
            !usedIds.has(
              item.id
            )
        )
      );

    const remainingNeeded =
      currentConfig.choices -
      1 -
      distractors.length;

    distractors = [
      ...distractors,
      ...remaining.slice(
        0,
        remainingNeeded
      ),
    ];

    const newOptions =
      shuffleArray([
        newTarget,
        ...distractors,
      ]);

    setTarget(
      newTarget
    );

    setOptions(
      newOptions
    );

    setSelectedId(
      null
    );

    setFeedback("");

    setLastTargetId(
      newTarget.id
    );

    setPhase(
      "playing"
    );
  }

  /* =======================================================
     START ACTIVITY
     ======================================================= */

  function startActivity(
    requestedDifficulty:
      Difficulty = difficulty
  ) {
    setDifficulty(
      requestedDifficulty
    );

    setRound(1);

    setCorrectAnswers(0);

    setAttempts(0);

    setElapsedSeconds(0);

    setFeedback("");

    setLastTargetId(null);

    setSaved(false);
    setRecommendationSaved(false);

    setSelectedId(null);

    saveStarted.current =
      false;

    createRound(
      requestedDifficulty,
      null
    );
  }

  /* =======================================================
     START ADAPTIVE ACTIVITY
     ======================================================= */

  function startAdaptiveActivity() {
    startActivity(
      recommendedNextDifficulty
    );
  }

  /* =======================================================
     ANSWER
     ======================================================= */

  function handleAnswer(
    item: GameItem
  ) {
    if (
      phase !== "playing" ||
      !target
    ) {
      return;
    }

    setSelectedId(
      item.id
    );

    const isCorrect =
      item.id ===
      target.id;

    setAttempts(
      (previous) =>
        previous + 1
    );

    if (isCorrect) {
      setCorrectAnswers(
        (previous) =>
          previous + 1
      );

      if (
        language ===
        "Assamese"
      ) {
        setFeedback(
          `${text.correctAnswer} ${getItemName(
            target
          )}।`
        );
      } else {
        setFeedback(
          `${text.correctAnswer} ${getItemName(
            target
          )}.`
        );
      }
    } else {
      if (
        language ===
        "Assamese"
      ) {
        setFeedback(
          `${text.wrongStart} ${getItemName(
            item
          )}। ${text.wrongMiddle} ${getItemName(
            target
          )} ${text.wrongEnd}`
        );
      } else {
        setFeedback(
          `${text.wrongStart} ${getItemName(
            item
          )}. ${text.wrongMiddle} ${getItemName(
            target
          )} ${text.wrongEnd}`
        );
      }
    }

    setPhase(
      "feedback"
    );

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

          createRound(
            difficulty,
            target.id
          );
        }
      },
      1900
    );
  }

  /* =======================================================
     RESET
     ======================================================= */

  function resetActivity() {
    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }

    setPhase(
      "ready"
    );

    setRound(1);

    setTarget(null);

    setOptions([]);

    setSelectedId(null);

    setCorrectAnswers(0);

    setAttempts(0);

    setElapsedSeconds(0);

    setFeedback("");

    setLastTargetId(null);

    setSaved(false);
    setRecommendationSaved(false);

    saveStarted.current =
      false;
  }

  /* =======================================================
     CHANGE DIFFICULTY
     ======================================================= */

  function changeDifficulty(
    level: Difficulty
  ) {
    setDifficulty(
      level
    );

    setPhase(
      "ready"
    );

    setRound(1);

    setTarget(null);

    setOptions([]);

    setSelectedId(null);

    setCorrectAnswers(0);

    setAttempts(0);

    setElapsedSeconds(0);

    setFeedback("");

    setLastTargetId(null);

    setSaved(false);
    setRecommendationSaved(false);

    saveStarted.current =
      false;
  }

  /* =======================================================
     SAVE SESSION
     ======================================================= */

  useEffect(() => {
    if (
      phase !==
        "complete" ||
      saved ||
      saveStarted.current
    ) {
      return;
    }

    const patientId =
      getPatientId();

    if (!patientId) {
      console.warn(
        "No patientId found. Find the Familiar session was not saved."
      );

      return;
    }

    saveStarted.current =
      true;

    async function saveResult() {
      try {
        /*
         * Keep backend values
         * in English so caregiver
         * analytics remain consistent.
         */

        await saveGameSession({
          patientId,

          gameName:
            "Find the Familiar",

          score:
            correctAnswers *
            10,

          totalQuestions:
            attempts,

          accuracy,

          difficulty,
        });

        setSaved(true);

        await saveRecommendation({
          patientId,
          gameName: "Find the Familiar",
          currentDifficulty: difficulty,
          recommendedDifficulty: recommendedNextDifficulty,
          reason: getRecommendationReason(
            difficulty,
            recommendedNextDifficulty,
            accuracy
          ),
          accuracy,
        });

        setRecommendationSaved(true);

        console.log(
          "Find the Familiar session and recommendation saved successfully"
        );
      } catch (error) {
        console.error(
          "Failed to save Find the Familiar session:",
          error
        );

        saveStarted.current =
          false;
      }
    }

    void saveResult();
  }, [
    phase,
    saved,
    correctAnswers,
    attempts,
    accuracy,
    difficulty,
    recommendedNextDifficulty,
  ]);

  /* =======================================================
     SPEECH
     ======================================================= */

  function speakInstructions() {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    let speechText = "";

    if (
      phase === "ready"
    ) {
      speechText =
        `${text.speechReadyStart} ` +
        `${getDifficultyLabel(
          difficulty
        )} ` +
        `${text.speechReadyMiddle}`;
    } else if (
      (
        phase === "playing" ||
        phase === "feedback"
      ) &&
      target
    ) {
      speechText =
        `${text.speechFind} ` +
        `${getItemName(
          target
        )}.`;
    } else if (
      phase === "complete"
    ) {
      speechText =
        `${text.speechCompleteStart} ` +
        `${accuracy} ` +
        `${text.speechCompleteMiddle} ` +
        `${getDifficultyLabel(
          recommendedNextDifficulty
        )}.`;
    }

    const speech =
      new SpeechSynthesisUtterance(
        speechText
      );

    speech.lang =
      languageOption.speechCode;

    speech.rate = 0.85;

    speech.pitch = 1;

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

    if (
      matchingVoice
    ) {
      speech.voice =
        matchingVoice;
    }

    window.speechSynthesis.speak(
      speech
    );
  }

  /* =======================================================
     FORMAT TIME
     ======================================================= */

  function formatTime(
    seconds: number
  ) {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remaining =
      seconds % 60;

    return `${minutes}:${remaining
      .toString()
      .padStart(
        2,
        "0"
      )}`;
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <main className="familiar-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="familiar-header">

        <button
          type="button"
          className="familiar-back"
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
            {
              text.activities
            }
          </span>
        </button>

        <button
          type="button"
          className="familiar-brand"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <span className="familiar-brand-mark">
            S
          </span>

          <span className="familiar-brand-copy">
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

      <div className="familiar-content">

        {/* =================================================
            TITLE
            ================================================= */}

        <section className="familiar-title">

          <div>

            <span className="familiar-eyebrow">
              {
                text.eyebrow
              }
            </span>

            <h1>
              {
                text.title
              }
            </h1>

            <p>
              {
                text.description
              }
            </p>

          </div>

          <button
            type="button"
            className="familiar-listen"
            onClick={
              speakInstructions
            }
          >
            <Volume2
              size={20}
            />

            {
              text.listenInstructions
            }
          </button>

        </section>

        {/* =================================================
            STATS
            ================================================= */}

        <section className="familiar-stats">

          <div className="familiar-stat">

            <Eye
              size={20}
            />

            <div>
              <span>
                {
                  text.round
                }
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

          <div className="familiar-stat">

            <Check
              size={20}
            />

            <div>
              <span>
                {
                  text.correct
                }
              </span>

              <strong>
                {
                  correctAnswers
                }
              </strong>
            </div>

          </div>

          <div className="familiar-stat">

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
                {
                  accuracy
                }
                %
              </strong>
            </div>

          </div>

          <div className="familiar-stat">

            <Clock3
              size={20}
            />

            <div>
              <span>
                {
                  text.time
                }
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

        {/* =================================================
            GAME CARD
            ================================================= */}

        <section className="familiar-game-card">

          {/* ===============================================
              READY
              =============================================== */}

          {phase ===
            "ready" && (
            <div className="familiar-ready">

              <div className="familiar-main-icon">
                <Eye
                  size={36}
                />
              </div>

              <span className="familiar-small-label">
                {
                  text.objectRecognition
                }
              </span>

              <h2>
                {
                  text.findRequested
                }
              </h2>

              <p>
                {
                  text.readyDescription
                }
              </p>

              <div className="familiar-difficulty">

                <span>
                  {
                    text.chooseDifficulty
                  }
                </span>

                <div>
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
                        type="button"
                        key={
                          level
                        }
                        className={
                          difficulty ===
                          level
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          changeDifficulty(
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

              <div className="familiar-ready-info">

                <div>
                  <Eye
                    size={20}
                  />

                  <span>
                    <strong>
                      {
                        config.choices
                      }{" "}
                      {
                        text.pictures
                      }
                    </strong>

                    <small>
                      {
                        text.toChoose
                      }
                    </small>
                  </span>
                </div>

                <div>
                  <Shuffle
                    size={20}
                  />

                  <span>
                    <strong>
                      {
                        text.randomObjects
                      }
                    </strong>

                    <small>
                      {
                        text.eachRound
                      }
                    </small>
                  </span>
                </div>

                <div>
                  <Award
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
                className="familiar-primary"
                onClick={() =>
                  startActivity(
                    difficulty
                  )
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

          {/* ===============================================
              PLAYING / FEEDBACK
              =============================================== */}

          {(
            phase ===
              "playing" ||
            phase ===
              "feedback"
          ) &&
            target && (
              <div className="familiar-playing">

                <div className="familiar-question">

                  <span>
                    {
                      text.round
                    }{" "}
                    {
                      round
                    }
                  </span>

                  <h2>
                    {
                      text.findThe
                    }{" "}
                    <strong>
                      {
                        getItemName(
                          target
                        )
                      }
                    </strong>
                  </h2>

                  <p>
                    {
                      text.tapPhoto
                    }
                  </p>

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
                      text.hearObject
                    }
                  </button>

                </div>

                <div
                  className={`familiar-options familiar-options-${config.choices}`}
                >
                  {options.map(
                    (
                      item
                    ) => {
                      const isTarget =
                        item.id ===
                        target.id;

                      const isSelected =
                        item.id ===
                        selectedId;

                      let stateClass =
                        "";

                      if (
                        phase ===
                        "feedback"
                      ) {
                        if (
                          isTarget
                        ) {
                          stateClass =
                            "correct";
                        } else if (
                          isSelected
                        ) {
                          stateClass =
                            "incorrect";
                        }
                      }

                      return (
                        <button
                          type="button"
                          key={
                            item.id
                          }
                          className={`familiar-option ${stateClass}`}
                          disabled={
                            phase ===
                            "feedback"
                          }
                          onClick={() =>
                            handleAnswer(
                              item
                            )
                          }
                        >
                          <div className="familiar-photo">

                            <img
                              src={
                                item.image
                              }
                              alt={
                                getItemName(
                                  item
                                )
                              }
                            />

                            {phase ===
                              "feedback" &&
                              isTarget && (
                                <span className="familiar-result-icon correct-icon">
                                  <Check
                                    size={
                                      19
                                    }
                                  />
                                </span>
                              )}

                            {phase ===
                              "feedback" &&
                              isSelected &&
                              !isTarget && (
                                <span className="familiar-result-icon wrong-icon">
                                  <X
                                    size={
                                      19
                                    }
                                  />
                                </span>
                              )}

                          </div>

                          <span>
                            {
                              getItemName(
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
                  <div
                    className={`familiar-feedback ${
                      selectedId ===
                      target.id
                        ? "success"
                        : "gentle-error"
                    }`}
                  >
                    {selectedId ===
                    target.id ? (
                      <Check
                        size={19}
                      />
                    ) : (
                      <Eye
                        size={19}
                      />
                    )}

                    <span>
                      {
                        feedback
                      }
                    </span>
                  </div>
                )}

              </div>
            )}

          {/* ===============================================
              COMPLETE
              =============================================== */}

          {phase ===
            "complete" && (
            <div className="familiar-complete">

              <div className="familiar-complete-icon">
                <Award
                  size={40}
                />
              </div>

              <span className="familiar-small-label">
                {
                  text.activityComplete
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
                  text.recognitionRounds
                }
              </p>

              <div className="familiar-complete-stats">

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
                    {
                      accuracy
                    }
                    %
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
                <p
                  style={{
                    margin:
                      "18px 0 0",
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap:
                      "7px",
                    color:
                      "#23664d",
                    fontWeight:
                      700,
                  }}
                >
                  <Check
                    size={18}
                  />

                  {
                    text.saved
                  }
                </p>
              )}

              {recommendationSaved && (
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#23664d",
                    fontWeight: 700,
                  }}
                >
                  <Check size={18} /> Recommendation saved
                </p>
              )}

              {/* ===========================================
                  ADAPTIVE RECOMMENDATION
                  =========================================== */}

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

              </div>

              <div className="familiar-complete-actions">

                <button
                  type="button"
                  className="familiar-secondary"
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
                    text.backActivities
                  }
                </button>

                <button
                  type="button"
                  className="familiar-primary"
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

        {/* =================================================
            BOTTOM CONTROLS
            ================================================= */}

        {phase !==
          "ready" &&
          phase !==
            "complete" && (
            <div className="familiar-bottom">

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
                  text.reset
                }
              </button>

            </div>
          )}

      </div>

    </main>
  );
}

export default FindFamiliarGame;