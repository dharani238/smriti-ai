import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Brain,
  ChevronRight,
  Clock3,
  Eye,
  Globe2,
  Grid3X3,
  Heart,
  Images,
  Info,
  ListOrdered,
  Play,
  ScanSearch,
  Sparkles,
  UsersRound,
} from "lucide-react";

import {
  getStoredLanguage,
  saveLanguage,
  SUPPORTED_LANGUAGES,
} from "../i18n/languages";

import type {
  AppLanguage,
} from "../i18n/languages";

import "./Games.css";

import memoryMatchCover from "../assets/activity-covers/memory-match.jpg";

import pictureSequenceCover from "../assets/activity-covers/picture-sequence.jpg";

import whatsMissingCover from "../assets/activity-covers/whats-missing.jpg";

import findFamiliarCover from "../assets/activity-covers/find-familiar.jpg";

import familyFacesCover from "../assets/activity-covers/family-faces.jpg";

import photoRecallCover from "../assets/activity-covers/photo-recall.jpg";

import memoryTimelineCover from "../assets/activity-covers/memory-timeline.jpg";

import placeMemoryCover from "../assets/activity-covers/place-memory.jpg";

import everydaySequenceCover from "../assets/activity-covers/everyday-sequence.jpg";

import categorySortCover from "../assets/activity-covers/category-sort.jpg";

import spotChangeCover from "../assets/activity-covers/spot-change.jpg";

import wordPictureCover from "../assets/activity-covers/word-picture.jpg";

/* =====================================================
   TYPES
   ===================================================== */

type ActivityCardProps = {
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  image: string;
  imagePosition?: string;
  onClick?: () => void;
  status?: "available" | "coming";
  startLabel: string;
  comingSoonLabel: string;
};

/* =====================================================
   TRANSLATIONS
   ===================================================== */

const gamesTranslations = {
  English: {
    home: "Home",

    brandSubtitle:
      "Memory & daily wellbeing",

    cognitiveActivities:
      "COGNITIVE ACTIVITIES",

    titleStart:
      "Activities for",

    titleHighlight:
      "memory and daily life",

    intro:
      "Choose a gentle activity designed to support memory, attention, recognition and familiar everyday routines.",

    takeYourTime:
      "Take your time",

    takeYourTimeDescription:
      "There is no need to rush. Choose an activity and continue at a comfortable pace.",

    recommendedToday:
      "RECOMMENDED FOR TODAY",

    startFamiliar:
      "Start with a familiar activity",

    memoryMatch:
      "Memory Match",

    memory:
      "Memory",

    memoryMatchDescription:
      "Match pairs of familiar photographs while practising visual memory and attention.",

    fiveEight:
      "5–8 min",

    easyHard:
      "Easy to Hard",

    startActivity:
      "Start activity",

    start:
      "Start",

    comingSoon:
      "Coming soon",

    memoryAttention:
      "Memory & attention",

    memoryAttentionDescription:
      "Practise remembering, sequencing and recognising familiar objects.",

    memoryMatchCardDescription:
      "Match pairs of familiar photographs and practise visual memory.",

    pictureSequence:
      "Picture Sequence",

    pictureSequenceDescription:
      "Remember familiar pictures and select them again in the same order.",

    fourSeven:
      "4–7 min",

    whatsMissing:
      "What's Missing?",

    whatsMissingDescription:
      "Look carefully at familiar objects and identify which one disappeared.",

    findFamiliar:
      "Find the Familiar",

    findFamiliarDescription:
      "Find the requested familiar everyday object among several photographs.",

    threeSix:
      "3–6 min",

    myMemories:
      "My memories",

    myMemoriesDescription:
      "Personal activities using familiar people, photographs, places and life memories.",

    familyFaces:
      "Family Faces",

    familyFacesDescription:
      "Recognise familiar family members using personal photographs.",

    fiveMin:
      "5 min",

    photoRecall:
      "Photo Recall",

    photoRecallDescription:
      "Look at a meaningful photograph and recall familiar details.",

    fiveSeven:
      "5–7 min",

    memoryTimeline:
      "Memory Timeline",

    memoryTimelineDescription:
      "Arrange meaningful personal memories into a familiar sequence.",

    placeMemory:
      "Place & Memory",

    placeMemoryDescription:
      "Reconnect familiar places with personal stories and memories.",

    everydayLife:
      "Everyday life",

    everydayLifeDescription:
      "Familiar activities based on objects, routines and daily recognition.",

    everydaySequence:
      "Everyday Sequence",

    everydaySequenceDescription:
      "Put familiar daily activities into a simple and meaningful order.",

    categorySort:
      "Category Sort",

    categorySortDescription:
      "Group familiar everyday objects into simple categories.",

    fourSix:
      "4–6 min",

    spotChange:
      "Spot the Change",

    spotChangeDescription:
      "Look carefully at a familiar scene and notice what has changed.",

    wordPicture:
      "Word & Picture",

    wordPictureDescription:
      "Match familiar words with the photographs they describe.",

    disclaimer:
      "SMRITI activities support cognitive engagement and memory assistance. They are not intended to diagnose, treat or replace professional medical care.",
  },

  Assamese: {
    home: "হোম",

    brandSubtitle:
      "স্মৃতি আৰু দৈনিক সুস্থতা",

    cognitiveActivities:
      "জ্ঞানীয় কাৰ্যকলাপ",

    titleStart:
      "কাৰ্যকলাপসমূহ",

    titleHighlight:
      "স্মৃতি আৰু দৈনন্দিন জীৱনৰ বাবে",

    intro:
      "স্মৃতি, মনোযোগ, চিনাক্তকৰণ আৰু চিনাকি দৈনন্দিন কাৰ্যসমূহত সহায় কৰিবলৈ এটা সহজ কাৰ্যকলাপ বাছনি কৰক।",

    takeYourTime:
      "লাহে লাহে কৰক",

    takeYourTimeDescription:
      "খৰখেদা কৰাৰ প্ৰয়োজন নাই। এটা কাৰ্যকলাপ বাছনি কৰক আৰু আপোনাৰ সুবিধাজনক গতিত আগবাঢ়ক।",

    recommendedToday:
      "আজিৰ বাবে পৰামৰ্শ",

    startFamiliar:
      "এটা চিনাকি কাৰ্যকলাপৰ সৈতে আৰম্ভ কৰক",

    memoryMatch:
      "স্মৃতি মিলোৱা",

    memory:
      "স্মৃতি",

    memoryMatchDescription:
      "চিনাকি ছবিৰ যোৰ মিলাই দৃশ্যমান স্মৃতি আৰু মনোযোগৰ অনুশীলন কৰক।",

    fiveEight:
      "৫–৮ মিনিট",

    easyHard:
      "সহজৰ পৰা কঠিন",

    startActivity:
      "কাৰ্যকলাপ আৰম্ভ কৰক",

    start:
      "আৰম্ভ কৰক",

    comingSoon:
      "শীঘ্ৰেই আহিব",

    memoryAttention:
      "স্মৃতি আৰু মনোযোগ",

    memoryAttentionDescription:
      "চিনাকি বস্তু মনত ৰখা, ক্ৰমত সজোৱা আৰু চিনাক্ত কৰাৰ অনুশীলন কৰক।",

    memoryMatchCardDescription:
      "চিনাকি ছবিৰ যোৰ মিলাই দৃশ্যমান স্মৃতিৰ অনুশীলন কৰক।",

    pictureSequence:
      "ছবিৰ ক্ৰম",

    pictureSequenceDescription:
      "চিনাকি ছবিসমূহ মনত ৰাখক আৰু একে ক্ৰমত পুনৰ বাছনি কৰক।",

    fourSeven:
      "৪–৭ মিনিট",

    whatsMissing:
      "কি নাই?",

    whatsMissingDescription:
      "চিনাকি বস্তুসমূহ ভালদৰে চাওক আৰু কোনটো বস্তু নাইকিয়া হৈছে চিনাক্ত কৰক।",

    findFamiliar:
      "চিনাকি বস্তু বিচাৰক",

    findFamiliarDescription:
      "কেইবাখনো ছবিৰ মাজৰ পৰা বিচৰা চিনাকি দৈনন্দিন বস্তুটো বিচাৰি উলিয়াওক।",

    threeSix:
      "৩–৬ মিনিট",

    myMemories:
      "মোৰ স্মৃতিসমূহ",

    myMemoriesDescription:
      "চিনাকি মানুহ, ছবি, ঠাই আৰু জীৱনৰ স্মৃতি ব্যৱহাৰ কৰা ব্যক্তিগত কাৰ্যকলাপ।",

    familyFaces:
      "পৰিয়ালৰ মুখ",

    familyFacesDescription:
      "ব্যক্তিগত ছবিৰ সহায়ত চিনাকি পৰিয়ালৰ সদস্যসকলক চিনাক্ত কৰক।",

    fiveMin:
      "৫ মিনিট",

    photoRecall:
      "ছবিৰ স্মৃতি",

    photoRecallDescription:
      "এখন অৰ্থপূৰ্ণ ছবি চাওক আৰু চিনাকি বিৱৰণসমূহ মনত পেলাওক।",

    fiveSeven:
      "৫–৭ মিনিট",

    memoryTimeline:
      "স্মৃতিৰ সময়ৰেখা",

    memoryTimelineDescription:
      "অৰ্থপূৰ্ণ ব্যক্তিগত স্মৃতিসমূহ এটা চিনাকি ক্ৰমত সজাওক।",

    placeMemory:
      "ঠাই আৰু স্মৃতি",

    placeMemoryDescription:
      "চিনাকি ঠাইসমূহক ব্যক্তিগত কাহিনী আৰু স্মৃতিৰ সৈতে পুনৰ সংযোগ কৰক।",

    everydayLife:
      "দৈনন্দিন জীৱন",

    everydayLifeDescription:
      "বস্তু, দৈনিক অভ্যাস আৰু চিনাক্তকৰণৰ ওপৰত ভিত্তি কৰা চিনাকি কাৰ্যকলাপ।",

    everydaySequence:
      "দৈনন্দিন ক্ৰম",

    everydaySequenceDescription:
      "চিনাকি দৈনন্দিন কাৰ্যসমূহ এটা সহজ আৰু অৰ্থপূৰ্ণ ক্ৰমত সজাওক।",

    categorySort:
      "শ্ৰেণী অনুসৰি সজাওক",

    categorySortDescription:
      "চিনাকি দৈনন্দিন বস্তুসমূহ সহজ শ্ৰেণীত ভাগ কৰক।",

    fourSix:
      "৪–৬ মিনিট",

    spotChange:
      "পৰিৱৰ্তন বিচাৰক",

    spotChangeDescription:
      "এটা চিনাকি দৃশ্য ভালদৰে চাওক আৰু কি সলনি হৈছে চিনাক্ত কৰক।",

    wordPicture:
      "শব্দ আৰু ছবি",

    wordPictureDescription:
      "চিনাকি শব্দসমূহ সিহঁতে বৰ্ণনা কৰা ছবিৰ সৈতে মিলাওক।",

    disclaimer:
      "SMRITIৰ কাৰ্যকলাপসমূহ জ্ঞানীয় সক্ৰিয়তা আৰু স্মৃতি সহায়ৰ বাবে তৈয়াৰ কৰা হৈছে। এইবোৰ ৰোগ নিৰ্ণয়, চিকিৎসা বা পেছাদাৰী চিকিৎসা সেৱাৰ বিকল্প নহয়।",
  },
};

/* =====================================================
   ACTIVITY CARD
   ===================================================== */

function ActivityCard({
  title,
  description,
  duration,
  icon,
  image,
  imagePosition = "center",
  onClick,
  status = "available",
  startLabel,
  comingSoonLabel,
}: ActivityCardProps) {
  const isAvailable =
    status === "available";

  const handleOpen = () => {
    if (
      isAvailable &&
      onClick
    ) {
      onClick();
    }
  };

  return (
    <div
      className={`activity-card ${
        isAvailable
          ? "activity-card-available"
          : "activity-card-coming"
      }`}
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(8, 27, 22, 0.04) 0%,
            rgba(8, 27, 22, 0.12) 28%,
            rgba(8, 27, 22, 0.58) 62%,
            rgba(8, 27, 22, 0.96) 100%
          ),
          url(${image})
        `,

        backgroundPosition:
          imagePosition,
      }}
      role={
        isAvailable
          ? "button"
          : undefined
      }
      tabIndex={
        isAvailable
          ? 0
          : -1
      }
      onClick={
        handleOpen
      }
      onKeyDown={(
        event
      ) => {
        if (
          isAvailable &&
          (
            event.key ===
              "Enter" ||
            event.key ===
              " "
          )
        ) {
          event.preventDefault();

          handleOpen();
        }
      }}
    >
      <div className="activity-card-top">
        <div className="activity-icon">
          {icon}
        </div>

        {!isAvailable && (
          <span className="coming-pill">
            {
              comingSoonLabel
            }
          </span>
        )}
      </div>

      <div className="activity-card-bottom">
        <div className="activity-card-copy">
          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>
        </div>

        <div className="activity-card-footer">
          <span className="activity-duration">
            <Clock3
              size={15}
            />

            {duration}
          </span>

          {isAvailable && (
            <span className="activity-open">
              {
                startLabel
              }

              <ChevronRight
                size={16}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   GAMES
   ===================================================== */

function Games() {
  const navigate =
    useNavigate();

  const [
    language,
    setLanguage,
  ] =
    useState<AppLanguage>(
      getStoredLanguage()
    );

  const text =
    language ===
    "Assamese"
      ? gamesTranslations.Assamese
      : gamesTranslations.English;

  /* =====================================================
     LANGUAGE CHANGE
     ===================================================== */

  const handleLanguageChange = (
    selectedLanguage: AppLanguage
  ) => {
    setLanguage(
      selectedLanguage
    );

    saveLanguage(
      selectedLanguage
    );

    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }
  };

  /* =====================================================
     COMMON CARD PROPS
     ===================================================== */

  const commonCardLabels = {
    startLabel:
      text.start,

    comingSoonLabel:
      text.comingSoon,
  };

  return (
    <main className="activities-page">

      {/* HEADER */}

      <header className="activities-header">

        <button
          type="button"
          className="activities-back"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <ArrowLeft
            size={20}
          />

          <span>
            {text.home}
          </span>
        </button>

        <div className="activities-brand">
          <div className="activities-brand-mark">
            S
          </div>

          <div>
            <strong>
              SMRITI
            </strong>

            <span>
              {
                text.brandSubtitle
              }
            </span>
          </div>
        </div>

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
              "8px",

            padding:
              "8px 12px",

            border:
              "1px solid rgba(23, 76, 60, 0.18)",

            borderRadius:
              "10px",

            background:
              "#ffffff",
          }}
        >
          <Globe2
            size={18}
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

              fontSize:
                "14px",

              fontWeight:
                700,

              cursor:
                "pointer",

              color:
                "#174c3c",
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

      <div className="activities-content">

        {/* INTRO */}

        <section className="activities-intro">

          <div className="activities-intro-copy">
            <span className="activities-eyebrow">
              {
                text.cognitiveActivities
              }
            </span>

            <h1>
              {
                text.titleStart
              }

              <span>
                {
                  text.titleHighlight
                }
              </span>
            </h1>

            <p>
              {
                text.intro
              }
            </p>
          </div>

          <div className="activities-intro-note">

            <div className="intro-note-icon">
              <Heart
                size={22}
              />
            </div>

            <div>
              <strong>
                {
                  text.takeYourTime
                }
              </strong>

              <span>
                {
                  text.takeYourTimeDescription
                }
              </span>
            </div>
          </div>
        </section>

        {/* RECOMMENDED */}

        <section className="recommended-area">

          <div className="section-title-row">
            <div>
              <span className="activities-eyebrow">
                {
                  text.recommendedToday
                }
              </span>

              <h2>
                {
                  text.startFamiliar
                }
              </h2>
            </div>

            <Sparkles
              size={24}
            />
          </div>

          <div
            className="featured-activity"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(8, 39, 31, 0.97) 0%,
                  rgba(8, 39, 31, 0.91) 40%,
                  rgba(8, 39, 31, 0.60) 68%,
                  rgba(8, 39, 31, 0.18) 100%
                ),
                url(${memoryMatchCover})
              `,
            }}
          >
            <div className="featured-icon">
              <Grid3X3
                size={30}
              />
            </div>

            <div className="featured-copy">

              <div className="featured-title-row">
                <h3>
                  {
                    text.memoryMatch
                  }
                </h3>

                <span className="level-pill">
                  {
                    text.memory
                  }
                </span>
              </div>

              <p>
                {
                  text.memoryMatchDescription
                }
              </p>

              <div className="featured-details">
                <span>
                  <Clock3
                    size={16}
                  />

                  {
                    text.fiveEight
                  }
                </span>

                <span>
                  <Brain
                    size={16}
                  />

                  {
                    text.easyHard
                  }
                </span>
              </div>
            </div>

            <button
              type="button"
              className="featured-start"
              onClick={() =>
                navigate(
                  "/games/matching"
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
        </section>

        {/* MEMORY & ATTENTION */}

        <section className="activity-group">

          <div className="activity-group-heading">
            <div className="group-icon">
              <Brain
                size={24}
              />
            </div>

            <div>
              <h2>
                {
                  text.memoryAttention
                }
              </h2>

              <p>
                {
                  text.memoryAttentionDescription
                }
              </p>
            </div>
          </div>

          <div className="activity-grid">

            <ActivityCard
              title={
                text.memoryMatch
              }
              description={
                text.memoryMatchCardDescription
              }
              duration={
                text.fiveEight
              }
              icon={
                <Grid3X3
                  size={23}
                />
              }
              image={
                memoryMatchCover
              }
              onClick={() =>
                navigate(
                  "/games/matching"
                )
              }
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.pictureSequence
              }
              description={
                text.pictureSequenceDescription
              }
              duration={
                text.fourSeven
              }
              icon={
                <ListOrdered
                  size={23}
                />
              }
              image={
                pictureSequenceCover
              }
              onClick={() =>
                navigate(
                  "/games/sequence"
                )
              }
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.whatsMissing
              }
              description={
                text.whatsMissingDescription
              }
              duration={
                text.fourSeven
              }
              icon={
                <Eye
                  size={23}
                />
              }
              image={
                whatsMissingCover
              }
              onClick={() =>
                navigate(
                  "/games/whats-missing"
                )
              }
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.findFamiliar
              }
              description={
                text.findFamiliarDescription
              }
              duration={
                text.threeSix
              }
              icon={
                <ScanSearch
                  size={23}
                />
              }
              image={
                findFamiliarCover
              }
              onClick={() =>
                navigate(
                  "/games/find-familiar"
                )
              }
              {...commonCardLabels}
            />
          </div>
        </section>

        {/* MY MEMORIES */}

        <section className="activity-group">

          <div className="activity-group-heading">
            <div className="group-icon gold-group-icon">
              <Heart
                size={24}
              />
            </div>

            <div>
              <h2>
                {
                  text.myMemories
                }
              </h2>

              <p>
                {
                  text.myMemoriesDescription
                }
              </p>
            </div>
          </div>

          <div className="activity-grid">

            <ActivityCard
              title={
                text.familyFaces
              }
              description={
                text.familyFacesDescription
              }
              duration={
                text.fiveMin
              }
              icon={
                <UsersRound
                  size={23}
                />
              }
              image={
                familyFacesCover
              }
              imagePosition="center top"
              onClick={() =>
                navigate(
                  "/games/family-faces"
                )
              }
              status="available"
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.photoRecall
              }
              description={
                text.photoRecallDescription
              }
              duration={
                text.fiveSeven
              }
              icon={
                <Images
                  size={23}
                />
              }
              image={
                photoRecallCover
              }
              onClick={() =>
                navigate(
                  "/games/photo-recall"
                )
              }
              status="available"
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.memoryTimeline
              }
              description={
                text.memoryTimelineDescription
              }
              duration={
                text.fiveEight
              }
              icon={
                <ListOrdered
                  size={23}
                />
              }
              image={
                memoryTimelineCover
              }
              status="coming"
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.placeMemory
              }
              description={
                text.placeMemoryDescription
              }
              duration={
                text.fiveSeven
              }
              icon={
                <Heart
                  size={23}
                />
              }
              image={
                placeMemoryCover
              }
              status="coming"
              {...commonCardLabels}
            />
          </div>
        </section>

        {/* EVERYDAY LIFE */}

        <section className="activity-group">

          <div className="activity-group-heading">
            <div className="group-icon daily-group-icon">
              <Sparkles
                size={24}
              />
            </div>

            <div>
              <h2>
                {
                  text.everydayLife
                }
              </h2>

              <p>
                {
                  text.everydayLifeDescription
                }
              </p>
            </div>
          </div>

          <div className="activity-grid">

            <ActivityCard
              title={
                text.everydaySequence
              }
              description={
                text.everydaySequenceDescription
              }
              duration={
                text.fiveSeven
              }
              icon={
                <ListOrdered
                  size={23}
                />
              }
              image={
                everydaySequenceCover
              }
              status="coming"
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.categorySort
              }
              description={
                text.categorySortDescription
              }
              duration={
                text.fourSix
              }
              icon={
                <Grid3X3
                  size={23}
                />
              }
              image={
                categorySortCover
              }
              status="coming"
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.spotChange
              }
              description={
                text.spotChangeDescription
              }
              duration={
                text.fourSeven
              }
              icon={
                <Eye
                  size={23}
                />
              }
              image={
                spotChangeCover
              }
              status="coming"
              {...commonCardLabels}
            />

            <ActivityCard
              title={
                text.wordPicture
              }
              description={
                text.wordPictureDescription
              }
              duration={
                text.fourSix
              }
              icon={
                <Images
                  size={23}
                />
              }
              image={
                wordPictureCover
              }
              status="coming"
              {...commonCardLabels}
            />
          </div>
        </section>

        {/* DISCLAIMER */}

        <section className="activities-disclaimer">

          <Info
            size={20}
          />

          <p>
            {
              text.disclaimer
            }
          </p>
        </section>
      </div>
    </main>
  );
}

export default Games;