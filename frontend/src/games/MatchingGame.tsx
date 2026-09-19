import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Award,
  BarChart3,
  Check,
  Clock3,
  Globe2,
  Lightbulb,
  MousePointerClick,
  Play,
  RotateCcw,
  Shuffle,
  Volume2,
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

import type { AppLanguage } from "../i18n/languages";

import "./MatchingGame.css";

// FOOD
import appleImg from "../assets/game-images/food/apple.jpg";
import bananaImg from "../assets/game-images/food/banana.jpg";
import mangoImg from "../assets/game-images/food/mango.jpg";
import strawberryImg from "../assets/game-images/food/strawberry.jpg";

// HOUSEHOLD
import chairImg from "../assets/game-images/household/chair.jpg";
import clockImg from "../assets/game-images/household/clock.jpg";
import keyImg from "../assets/game-images/household/key.jpg";
import umbrellaImg from "../assets/game-images/household/umbrella.jpg";

// NATURE
import flowerImg from "../assets/game-images/nature/flower.jpg";
import parkImg from "../assets/game-images/nature/park.jpg";
import plantImg from "../assets/game-images/nature/plant.jpg";
import treeImg from "../assets/game-images/nature/tree.jpg";

// CLOTHING
import dressImg from "../assets/game-images/clothing/dress.jpg";
import glassesImg from "../assets/game-images/clothing/glasses.jpg";
import hatImg from "../assets/game-images/clothing/hat.jpg";
import shoesImg from "../assets/game-images/clothing/shoes.jpg";

// EVERYDAY
import bookImg from "../assets/game-images/everyday/book.jpg";
import bottleImg from "../assets/game-images/everyday/bottle.jpg";
import penImg from "../assets/game-images/everyday/pen.jpg";
import walletImg from "../assets/game-images/everyday/wallet.jpg";

type Difficulty = "Easy" | "Medium" | "Hard";

type GameItem = {
  id: string;
  name: string;
  image: string;
};

type Card = GameItem & {
  cardId: string;
  matched: boolean;
};

const GAME_ITEMS: GameItem[] = [
  { id: "apple", name: "Apple", image: appleImg },
  { id: "banana", name: "Banana", image: bananaImg },
  { id: "mango", name: "Mango", image: mangoImg },
  { id: "strawberry", name: "Strawberry", image: strawberryImg },

  { id: "chair", name: "Chair", image: chairImg },
  { id: "clock", name: "Clock", image: clockImg },
  { id: "key", name: "Key", image: keyImg },
  { id: "umbrella", name: "Umbrella", image: umbrellaImg },

  { id: "flower", name: "Flower", image: flowerImg },
  { id: "park", name: "Park", image: parkImg },
  { id: "plant", name: "Plant", image: plantImg },
  { id: "tree", name: "Tree", image: treeImg },

  { id: "dress", name: "Dress", image: dressImg },
  { id: "glasses", name: "Glasses", image: glassesImg },
  { id: "hat", name: "Hat", image: hatImg },
  { id: "shoes", name: "Shoes", image: shoesImg },

  { id: "book", name: "Book", image: bookImg },
  { id: "bottle", name: "Bottle", image: bottleImg },
  { id: "pen", name: "Pen", image: penImg },
  { id: "wallet", name: "Wallet", image: walletImg },
];

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    pairs: number;
    cards: number;
  }
> = {
  Easy: {
    pairs: 3,
    cards: 6,
  },
  Medium: {
    pairs: 6,
    cards: 12,
  },
  Hard: {
    pairs: 8,
    cards: 16,
  },
};

const translations = {
  English: {
    brandSubtitle: "Memory & Cognitive Support",
    backActivities: "Back to Activities",
    eyebrow: "MEMORY & RECALL",
    title: "Find the matching pairs",
    intro:
      "Look carefully at the pictures and find all the matching pairs. There is no need to rush — take your time.",
    tip: "Tip",
    tipText:
      "Try to remember both the picture and where you saw it.",
    score: "Score",
    attempts: "Attempts",
    time: "Time",
    accuracy: "Accuracy",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    cards: "cards",
    newGame: "New Game",
    ready: "Ready for your activity?",
    readyText:
      "Press Start Activity when you are ready. Your timer will begin then.",
    startActivity: "Start Activity",
    hiddenCard: "Hidden memory card",
    reset: "Reset",
    howToPlay: "How to play",
    step1: "Select one card to reveal its picture.",
    step2:
      "Select another card and see whether the pictures match.",
    step3:
      "Find every matching pair to complete the activity.",
    listenInstructions: "Listen to instructions",
    calmMessage:
      "Take your time. There is no penalty for a wrong match.",
    speechInstructions:
      "Find the matching pairs. Select two cards at a time. If the pictures match, they will stay open. Take your time.",
    complete: "ACTIVITY COMPLETE",
    wellDone: "Well done",
    foundAllStart: "You found all",
    foundAllEnd: "matching pairs.",
    saved: "Activity saved to your progress.",
    adaptiveRecommendation: "ADAPTIVE RECOMMENDATION",
    nextLevel: "Next activity level",
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
    backActivitiesBottom: "Back to Activities",
    playAnother: "Play Another",
    goHome: "Go to patient home",
  },

  Assamese: {
    brandSubtitle: "স্মৃতি আৰু জ্ঞানীয় সহায়",
    backActivities: "কাৰ্যকলাপলৈ উভতি যাওক",
    eyebrow: "স্মৃতি আৰু মনত পেলোৱা",
    title: "মিল থকা যোৰ বিচাৰক",
    intro:
      "ছবিসমূহ ভালদৰে চাওক আৰু সকলো মিল থকা যোৰ বিচাৰি উলিয়াওক। খৰখেদা কৰাৰ প্ৰয়োজন নাই — লাহে লাহে কৰক।",
    tip: "পৰামৰ্শ",
    tipText:
      "ছবিখন আৰু আপুনি ছবিখন ক'ত দেখিছিল দুয়োটাই মনত ৰাখিবলৈ চেষ্টা কৰক।",
    score: "স্ক'ৰ",
    attempts: "চেষ্টা",
    time: "সময়",
    accuracy: "সঠিকতা",
    difficulty: "কঠিনতাৰ স্তৰ",
    easy: "সহজ",
    medium: "মধ্যম",
    hard: "কঠিন",
    cards: "খন কাৰ্ড",
    newGame: "নতুন খেল",
    ready: "কাৰ্যকলাপৰ বাবে সাজু নে?",
    readyText:
      "আপুনি সাজু হ'লে কাৰ্যকলাপ আৰম্ভ কৰক বুটামটো টিপক। তেতিয়াই সময় গণনা আৰম্ভ হ'ব।",
    startActivity: "কাৰ্যকলাপ আৰম্ভ কৰক",
    hiddenCard: "লুকাই থকা স্মৃতি কাৰ্ড",
    reset: "পুনৰ আৰম্ভ কৰক",
    howToPlay: "কেনেকৈ খেলিব",
    step1: "ছবিখন চাবলৈ এখন কাৰ্ড বাছনি কৰক।",
    step2:
      "আন এখন কাৰ্ড বাছনি কৰি দুয়োখন ছবি মিলিছে নে চাওক।",
    step3:
      "কাৰ্যকলাপ সম্পূৰ্ণ কৰিবলৈ সকলো মিল থকা যোৰ বিচাৰি উলিয়াওক।",
    listenInstructions: "নিৰ্দেশনা শুনক",
    calmMessage:
      "লাহে লাহে কৰক। ভুল যোৰ বাছনি কৰিলে কোনো শাস্তি নাই।",
    speechInstructions:
      "মিল থকা যোৰ বিচাৰক। এবাৰত দুখন কাৰ্ড বাছনি কৰক। ছবি দুখন মিলিলে সেইবোৰ খোলা থাকিব। লাহে লাহে কৰক।",
    complete: "কাৰ্যকলাপ সম্পূৰ্ণ",
    wellDone: "খুব ভাল",
    foundAllStart: "আপুনি সকলো",
    foundAllEnd: "টা মিল থকা যোৰ বিচাৰি পাইছে।",
    saved:
      "কাৰ্যকলাপটো আপোনাৰ অগ্ৰগতিত সংৰক্ষণ কৰা হৈছে।",
    adaptiveRecommendation: "অভিযোজিত পৰামৰ্শ",
    nextLevel: "পৰৱৰ্তী কাৰ্যকলাপৰ স্তৰ",
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
    backActivitiesBottom: "কাৰ্যকলাপলৈ উভতি যাওক",
    playAnother: "আন এটা খেলক",
    goHome: "হোমলৈ যাওক",
  },
};

const itemNamesAssamese: Record<string, string> = {
  apple: "আপেল",
  banana: "কল",
  mango: "আম",
  strawberry: "ষ্ট্ৰবেৰী",
  chair: "চকী",
  clock: "ঘড়ী",
  key: "চাবি",
  umbrella: "ছাতি",
  flower: "ফুল",
  park: "উদ্যান",
  plant: "গছপুলি",
  tree: "গছ",
  dress: "পোছাক",
  glasses: "চশমা",
  hat: "টুপি",
  shoes: "জোতা",
  book: "কিতাপ",
  bottle: "বটল",
  pen: "কলম",
  wallet: "মানিবেগ",
};

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

function createBoard(items: GameItem[]): Card[] {
  const doubledCards: Card[] = items.flatMap((item) => [
    {
      ...item,
      cardId: `${item.id}-a`,
      matched: false,
    },
    {
      ...item,
      cardId: `${item.id}-b`,
      matched: false,
    },
  ]);

  return shuffleArray(doubledCards);
}

function getStoredPatientId(): string | undefined {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return undefined;
    }

    const user = JSON.parse(storedUser);

    return user?.patientId;
  } catch {
    return undefined;
  }
}

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

/*
  Keep the stored reason in English so caregiver analytics
  and backend data stay language-independent.
*/
function getRecommendationReason(
  currentDifficulty: Difficulty,
  recommendedDifficulty: Difficulty,
  accuracy: number
): string {
  if (accuracy >= 85) {
    if (currentDifficulty === "Hard") {
      return "Strong performance at the highest difficulty. Continue at Hard level.";
    }

    return `Strong performance with ${accuracy}% accuracy. Increase difficulty from ${currentDifficulty} to ${recommendedDifficulty}.`;
  }

  if (accuracy >= 50) {
    return `Current performance is appropriate for this level with ${accuracy}% accuracy. Maintain ${currentDifficulty} difficulty.`;
  }

  if (currentDifficulty === "Easy") {
    return `Accuracy was ${accuracy}%. Continue at Easy level for comfortable practice.`;
  }

  return `Accuracy was ${accuracy}%. Reduce difficulty from ${currentDifficulty} to ${recommendedDifficulty} for comfortable practice.`;
}

function MatchingGame() {
  const navigate = useNavigate();

  /* =====================================================
     LANGUAGE
     ===================================================== */

  const [language, setLanguage] = useState<AppLanguage>(
    getStoredLanguage()
  );

  const languageOption = getLanguageOption(language);

  const text =
    language === "Assamese"
      ? translations.Assamese
      : translations.English;

  const handleLanguageChange = (
    selectedLanguage: AppLanguage
  ) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setLanguage(selectedLanguage);
    saveLanguage(selectedLanguage);
  };

  const getDifficultyLabel = (level: Difficulty) => {
    if (level === "Easy") {
      return text.easy;
    }

    if (level === "Medium") {
      return text.medium;
    }

    return text.hard;
  };

  const getItemName = (item: GameItem) => {
    if (language === "Assamese") {
      return itemNamesAssamese[item.id] || item.name;
    }

    return item.name;
  };

  /* =====================================================
     GAME STATE
     ===================================================== */

  const [difficulty, setDifficulty] =
    useState<Difficulty>("Medium");

  const initialItemsRef = useRef<GameItem[]>(
    shuffleArray(GAME_ITEMS).slice(
      0,
      DIFFICULTY_CONFIG.Medium.pairs
    )
  );

  const [selectedItems, setSelectedItems] =
    useState<GameItem[]>(initialItemsRef.current);

  const [cards, setCards] = useState<Card[]>(() =>
    createBoard(initialItemsRef.current)
  );

  const [selectedCards, setSelectedCards] =
    useState<string[]>([]);

  const [attempts, setAttempts] = useState(0);

  const [matchedPairs, setMatchedPairs] = useState(0);

  const [time, setTime] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);

  const [gameCompleted, setGameCompleted] =
    useState(false);

  const [locked, setLocked] = useState(false);

  const [resultSaved, setResultSaved] = useState(false);

  const [recommendationSaved, setRecommendationSaved] =
    useState(false);

  const previousItemIds = useRef<string[]>([]);

  /*
    This prevents React development StrictMode or a rerender
    from saving the same completed result more than once.
  */
  const saveStarted = useRef(false);

  const pairCount =
    DIFFICULTY_CONFIG[difficulty].pairs;

  const score = matchedPairs * 10;

  const accuracy = useMemo(() => {
    if (attempts === 0) {
      return 0;
    }

    return Math.round(
      (matchedPairs / attempts) * 100
    );
  }, [matchedPairs, attempts]);

  const recommendedNextDifficulty = useMemo(() => {
    return getAdaptiveDifficulty(
      difficulty,
      accuracy
    );
  }, [difficulty, accuracy]);

  const adaptiveMessage = useMemo(() => {
    if (accuracy >= 85) {
      if (difficulty === "Hard") {
        return text.strongHard;
      }

      return text.strongIncrease;
    }

    if (accuracy >= 50) {
      return text.maintain;
    }

    if (difficulty === "Easy") {
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

  const formatTime = (secondsValue: number) => {
    const minutes = Math.floor(secondsValue / 60);
    const seconds = secondsValue % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const chooseItems = (
    requestedDifficulty: Difficulty
  ): GameItem[] => {
    const requiredPairs =
      DIFFICULTY_CONFIG[requestedDifficulty].pairs;

    const unusedItems = GAME_ITEMS.filter(
      (item) =>
        !previousItemIds.current.includes(item.id)
    );

    let chosenItems: GameItem[];

    if (unusedItems.length >= requiredPairs) {
      chosenItems = shuffleArray(unusedItems).slice(
        0,
        requiredPairs
      );
    } else {
      const firstSelection =
        shuffleArray(unusedItems);

      const remainingItems = GAME_ITEMS.filter(
        (item) =>
          !firstSelection.some(
            (selectedItem) =>
              selectedItem.id === item.id
          )
      );

      chosenItems = [
        ...firstSelection,
        ...shuffleArray(remainingItems),
      ].slice(0, requiredPairs);
    }

    previousItemIds.current = chosenItems.map(
      (item) => item.id
    );

    return chosenItems;
  };

  const resetGameState = () => {
    setSelectedCards([]);
    setAttempts(0);
    setMatchedPairs(0);
    setTime(0);

    setGameStarted(false);
    setGameCompleted(false);
    setLocked(false);

    setResultSaved(false);
    setRecommendationSaved(false);

    saveStarted.current = false;
  };

  const createNewGame = (
    requestedDifficulty: Difficulty = difficulty
  ) => {
    const items = chooseItems(requestedDifficulty);

    setSelectedItems(items);
    setCards(createBoard(items));

    resetGameState();
  };

  const handleDifficultyChange = (
    newDifficulty: Difficulty
  ) => {
    setDifficulty(newDifficulty);

    const items = chooseItems(newDifficulty);

    setSelectedItems(items);
    setCards(createBoard(items));

    resetGameState();
  };

  const startGame = () => {
    if (gameCompleted) {
      return;
    }

    setGameStarted(true);
  };

  const resetCurrentGame = () => {
    setCards(createBoard(selectedItems));
    resetGameState();
  };

  const playAdaptiveNextGame = () => {
    const nextDifficulty =
      recommendedNextDifficulty;

    setDifficulty(nextDifficulty);
    createNewGame(nextDifficulty);
  };

  /* =====================================================
     TIMER
     ===================================================== */

  useEffect(() => {
    if (!gameStarted || gameCompleted) {
      return;
    }

    const timer = window.setInterval(() => {
      setTime((previous) => previous + 1);
    }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [gameStarted, gameCompleted]);

  /* =====================================================
     CARD CLICK
     ===================================================== */

  const handleCardClick = (cardId: string) => {
    if (
      !gameStarted ||
      gameCompleted ||
      locked
    ) {
      return;
    }

    if (selectedCards.includes(cardId)) {
      return;
    }

    const clickedCard = cards.find(
      (card) => card.cardId === cardId
    );

    if (!clickedCard || clickedCard.matched) {
      return;
    }

    if (selectedCards.length >= 2) {
      return;
    }

    setSelectedCards((previous) => [
      ...previous,
      cardId,
    ]);
  };

  /* =====================================================
     CHECK SELECTED PAIR
     ===================================================== */

  useEffect(() => {
    if (selectedCards.length !== 2) {
      return;
    }

    const firstCard = cards.find(
      (card) =>
        card.cardId === selectedCards[0]
    );

    const secondCard = cards.find(
      (card) =>
        card.cardId === selectedCards[1]
    );

    if (!firstCard || !secondCard) {
      return;
    }

    setLocked(true);

    setAttempts(
      (previous) => previous + 1
    );

    if (firstCard.id === secondCard.id) {
      const timeout = window.setTimeout(() => {
        setCards((previousCards) =>
          previousCards.map((card) =>
            card.id === firstCard.id
              ? {
                  ...card,
                  matched: true,
                }
              : card
          )
        );

        setMatchedPairs(
          (previous) => previous + 1
        );

        setSelectedCards([]);
        setLocked(false);
      }, 450);

      return () =>
        window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setSelectedCards([]);
      setLocked(false);
    }, 900);

    return () =>
      window.clearTimeout(timeout);
  }, [selectedCards, cards]);

  /* =====================================================
     DETECT COMPLETION
     ===================================================== */

  useEffect(() => {
    if (
      gameStarted &&
      matchedPairs === pairCount &&
      pairCount > 0
    ) {
      setGameCompleted(true);
      setLocked(true);
    }
  }, [
    matchedPairs,
    pairCount,
    gameStarted,
  ]);

  /* =====================================================
     SAVE SESSION + RECOMMENDATION
     ===================================================== */

  useEffect(() => {
    if (
      !gameCompleted ||
      saveStarted.current
    ) {
      return;
    }

    const storedPatientId =
      getStoredPatientId();

    if (!storedPatientId) {
      console.warn(
        "Memory Matching completed, but no patientId was found."
      );

      return;
    }

    const patientId: string =
      storedPatientId;

    /*
      Capture final values before asynchronous requests.
    */
    const finalAccuracy = accuracy;
    const finalScore = score;
    const finalAttempts = attempts;
    const currentDifficulty = difficulty;

    const nextDifficulty =
      getAdaptiveDifficulty(
        currentDifficulty,
        finalAccuracy
      );

    const recommendationReason =
      getRecommendationReason(
        currentDifficulty,
        nextDifficulty,
        finalAccuracy
      );

    saveStarted.current = true;

    async function saveCompletedActivity() {
      let sessionSucceeded = false;
      let recommendationSucceeded = false;

      /*
        Save these separately.

        If one request fails, we still attempt the other
        instead of losing both records.
      */

      try {
        await saveGameSession({
          patientId,
          gameName: "Memory Matching",
          score: finalScore,
          totalQuestions: finalAttempts,
          accuracy: finalAccuracy,
          difficulty: currentDifficulty,
        });

        sessionSucceeded = true;
        setResultSaved(true);

        console.log(
          "Memory Matching session saved successfully."
        );
      } catch (error) {
        console.error(
          "Failed to save Memory Matching session:",
          error
        );
      }

      try {
        await saveRecommendation({
          patientId,
          gameName: "Memory Matching",
          currentDifficulty,
          recommendedDifficulty:
            nextDifficulty,
          reason: recommendationReason,
          accuracy: finalAccuracy,
        });

        recommendationSucceeded = true;
        setRecommendationSaved(true);

        console.log(
          "Memory Matching recommendation saved successfully."
        );
      } catch (error) {
        console.error(
          "Failed to save Memory Matching recommendation:",
          error
        );
      }

      /*
        Allow a retry only if BOTH requests failed.

        If one succeeded and one failed, automatically
        rerunning the entire effect could duplicate the
        successful MongoDB record.
      */
      if (
        !sessionSucceeded &&
        !recommendationSucceeded
      ) {
        saveStarted.current = false;
      }
    }

    void saveCompletedActivity();
  }, [
    gameCompleted,
    score,
    attempts,
    accuracy,
    difficulty,
  ]);

  /* =====================================================
     SPEAK INSTRUCTIONS
     ===================================================== */

  const speakInstructions = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const message =
      new SpeechSynthesisUtterance(
        text.speechInstructions
      );

    message.lang =
      languageOption.speechCode;

    message.rate = 0.88;
    message.pitch = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const requestedCode =
      languageOption.speechCode.toLowerCase();

    const requestedBase =
      requestedCode.split("-")[0];

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
      message.voice = matchingVoice;
    }

    window.speechSynthesis.speak(message);
  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main className="memory-match-page">

      {/* HEADER */}

      <header className="memory-match-header">
        <button
          type="button"
          className="memory-match-brand"
          onClick={() => navigate("/home")}
          aria-label={text.goHome}
        >
          <span className="memory-match-logo">
            S
          </span>

          <span>
            <strong>SMRITI</strong>

            <small>
              {text.brandSubtitle}
            </small>
          </span>
        </button>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 11px",
              border:
                "1px solid rgba(23, 76, 60, 0.18)",
              borderRadius: "10px",
              background: "#ffffff",
            }}
          >
            <Globe2 size={17} />

            <select
              aria-label="Select language"
              value={language}
              onChange={(event) =>
                handleLanguageChange(
                  event.target
                    .value as AppLanguage
                )
              }
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#174c3c",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {SUPPORTED_LANGUAGES.map(
                (option) => (
                  <option
                    key={option.code}
                    value={option.name}
                  >
                    {option.nativeName} —{" "}
                    {option.name}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="button"
            className="memory-match-back"
            onClick={() =>
              navigate("/games")
            }
          >
            <ArrowLeft size={21} />
            {text.backActivities}
          </button>
        </div>
      </header>

      <div className="memory-match-content">

        {/* INTRO */}

        <section className="memory-match-intro">
          <span className="memory-match-eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.intro}</p>

          <div className="memory-match-tip">
            <Lightbulb size={24} />

            <div>
              <strong>{text.tip}</strong>
              <span>{text.tipText}</span>
            </div>
          </div>
        </section>

        {/* STATISTICS */}

        <section
          className="memory-match-stats"
          aria-label="Game statistics"
        >
          <div className="memory-stat">
            <span className="memory-stat-icon">
              <Award size={25} />
            </span>

            <div>
              <span>{text.score}</span>
              <strong>{score}</strong>
            </div>
          </div>

          <div className="memory-stat">
            <span className="memory-stat-icon">
              <MousePointerClick size={25} />
            </span>

            <div>
              <span>{text.attempts}</span>
              <strong>{attempts}</strong>
            </div>
          </div>

          <div className="memory-stat">
            <span className="memory-stat-icon">
              <Clock3 size={25} />
            </span>

            <div>
              <span>{text.time}</span>
              <strong>
                {formatTime(time)}
              </strong>
            </div>
          </div>

          <div className="memory-stat">
            <span className="memory-stat-icon">
              <BarChart3 size={25} />
            </span>

            <div>
              <span>{text.accuracy}</span>
              <strong>{accuracy}%</strong>
            </div>
          </div>
        </section>

        {/* CONTROLS */}

        <section className="memory-match-controls">
          <div>
            <span className="control-label">
              {text.difficulty}
            </span>

            <div className="difficulty-options">
              {(
                [
                  "Easy",
                  "Medium",
                  "Hard",
                ] as Difficulty[]
              ).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={
                    difficulty === level
                      ? "difficulty-button active"
                      : "difficulty-button"
                  }
                  onClick={() =>
                    handleDifficultyChange(
                      level
                    )
                  }
                >
                  <strong>
                    {getDifficultyLabel(
                      level
                    )}
                  </strong>

                  <span>
                    {
                      DIFFICULTY_CONFIG[
                        level
                      ].cards
                    }{" "}
                    {text.cards}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="new-game-button"
            onClick={() =>
              createNewGame()
            }
          >
            <Shuffle size={20} />
            {text.newGame}
          </button>
        </section>

        {/* GAME */}

        <section className="memory-match-game-layout">
          <div className="memory-board-section">

            {!gameStarted &&
              !gameCompleted && (
                <div className="start-panel">
                  <div className="start-panel-icon">
                    <Play size={31} />
                  </div>

                  <div>
                    <strong>
                      {text.ready}
                    </strong>

                    <p>
                      {text.readyText}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="start-button"
                    onClick={startGame}
                  >
                    <Play size={21} />
                    {text.startActivity}
                  </button>
                </div>
              )}

            <div
              className={`memory-card-grid memory-card-grid-${difficulty.toLowerCase()}`}
            >
              {cards.map((card) => {
                const isSelected =
                  selectedCards.includes(
                    card.cardId
                  );

                const isVisible =
                  isSelected ||
                  card.matched;

                const displayName =
                  getItemName(card);

                return (
                  <button
                    type="button"
                    key={card.cardId}
                    className={[
                      "photo-memory-card",
                      isVisible
                        ? "is-open"
                        : "",
                      card.matched
                        ? "is-matched"
                        : "",
                      !gameStarted
                        ? "is-disabled"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleCardClick(
                        card.cardId
                      )
                    }
                    disabled={
                      !gameStarted ||
                      gameCompleted ||
                      card.matched
                    }
                    aria-label={
                      isVisible
                        ? displayName
                        : text.hiddenCard
                    }
                  >
                    <div className="photo-memory-card-inner">
                      <div className="photo-card-back">
                        <span className="card-back-logo">
                          S
                        </span>

                        <span>
                          SMRITI
                        </span>
                      </div>

                      <div className="photo-card-front">
                        <img
                          src={card.image}
                          alt={displayName}
                        />

                        <div className="photo-card-label">
                          <span>
                            {displayName}
                          </span>

                          {card.matched && (
                            <span className="matched-mark">
                              <Check
                                size={17}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {gameStarted &&
              !gameCompleted && (
                <div className="board-actions">
                  <button
                    type="button"
                    className="secondary-game-button"
                    onClick={
                      resetCurrentGame
                    }
                  >
                    <RotateCcw
                      size={20}
                    />
                    {text.reset}
                  </button>
                </div>
              )}
          </div>

          {/* INSTRUCTIONS */}

          <aside className="memory-instructions">
            <h2>{text.howToPlay}</h2>

            <div className="instruction-step">
              <span>1</span>
              <p>{text.step1}</p>
            </div>

            <div className="instruction-step">
              <span>2</span>
              <p>{text.step2}</p>
            </div>

            <div className="instruction-step">
              <span>3</span>
              <p>{text.step3}</p>
            </div>

            <button
              type="button"
              className="listen-button"
              onClick={
                speakInstructions
              }
            >
              <Volume2 size={21} />
              {text.listenInstructions}
            </button>

            <p className="calm-message">
              {text.calmMessage}
            </p>
          </aside>
        </section>

        {/* COMPLETION */}

        {gameCompleted && (
          <section
            className="completion-panel"
            aria-live="polite"
          >
            <div className="completion-check">
              <Check size={32} />
            </div>

            <span className="completion-label">
              {text.complete}
            </span>

            <h2>{text.wellDone}</h2>

            <p>
              {text.foundAllStart}{" "}
              {pairCount}{" "}
              {text.foundAllEnd}
            </p>

            <div className="completion-results">
              <div>
                <span>
                  {text.accuracy}
                </span>
                <strong>
                  {accuracy}%
                </strong>
              </div>

              <div>
                <span>
                  {text.attempts}
                </span>
                <strong>
                  {attempts}
                </strong>
              </div>

              <div>
                <span>
                  {text.time}
                </span>
                <strong>
                  {formatTime(time)}
                </strong>
              </div>

              <div>
                <span>
                  {text.difficulty}
                </span>
                <strong>
                  {getDifficultyLabel(
                    difficulty
                  )}
                </strong>
              </div>
            </div>

            {resultSaved && (
              <p className="result-saved">
                <Check size={18} />
                {text.saved}
              </p>
            )}

            <div
              style={{
                marginTop: "22px",
                marginBottom: "22px",
                padding: "18px 20px",
                borderRadius: "14px",
                background: "#f4f7f2",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing:
                    "0.08em",
                  color: "#8c6a17",
                }}
              >
                {
                  text.adaptiveRecommendation
                }
              </span>

              <strong
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "18px",
                  color: "#123d31",
                }}
              >
                {text.nextLevel}:{" "}
                {getDifficultyLabel(
                  recommendedNextDifficulty
                )}
              </strong>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {adaptiveMessage}
              </p>

              {recommendationSaved && (
                <span
                  style={{
                    display: "block",
                    marginTop: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#174c3c",
                  }}
                >
                  <Check
                    size={15}
                    style={{
                      verticalAlign:
                        "middle",
                      marginRight: "5px",
                    }}
                  />
                  Recommendation saved
                </span>
              )}
            </div>

            <div className="completion-actions">
              <button
                type="button"
                className="secondary-game-button"
                onClick={() =>
                  navigate("/games")
                }
              >
                <ArrowLeft size={20} />
                {
                  text.backActivitiesBottom
                }
              </button>

              <button
                type="button"
                className="primary-game-button"
                onClick={
                  playAdaptiveNextGame
                }
              >
                <Shuffle size={20} />
                {text.playAnother}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MatchingGame;