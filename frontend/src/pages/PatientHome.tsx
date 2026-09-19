import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gamepad2,
  Globe2,
  Heart,
  Home,
  Images,
  LogOut,
  MessageCircle,
  Play,
  Sparkles,
  UserRound,
  UsersRound,
  Volume2,
} from "lucide-react";

import {
  completeReminder,
  getGameSessions,
  getMemories,
  getPatient,
  getRecommendations,
  getReminders,
  snoozeReminder,
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

import patientWelcomeImage from "../assets/images/demo/patient-welcome.jpg";

import memoryOfTheDayImage from "../assets/images/memories/memory-of-the-day.jpg";

import "./PatientHome.css";

/* =====================================================
   TYPES
   ===================================================== */

type PatientData = {
  name?: string;
  language?: string;
};

type Reminder = {
  _id?: string;
  id?: string;
  patientId?: string;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  completed?: boolean;
  status?:
    | "pending"
    | "completed"
    | "snoozed"
    | string;
  completedAt?: string;
  snoozedUntil?: string;
};

type Memory = {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  photo?: string;
};

type GameSession = {
  _id?: string;
  gameName?: string;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  difficulty?: string;
  createdAt?: string;
};

type Recommendation = {
  _id?: string;
  gameName?: string;
  difficulty?: string;
  recommendedDifficulty?: string;
  currentDifficulty?: string;
  reason?: string;
  title?: string;
};

/* =====================================================
   PATIENT HOME TRANSLATIONS
   ===================================================== */

const patientHomeTranslations = {
  English: {
    signOut: "Sign out",

    home: "Home",
    activities: "Activities",
    memories: "My memories",
    routine: "My routine",
    talkToSmriti: "Talk to SMRITI",

    familyConnected: "Family connected",
    familyConnectedDescription:
      "Your experience can be supported by your caregiver.",

    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",

    personalSpace: "YOUR PERSONAL SPACE",

    heroDescription:
      "Familiar memories, meaningful activities and your daily routine — all together in one calm place.",

    startTodayActivity:
      "Start today's activity",

    listen: "Listen",

    familyMemories:
      "FAMILY & MEMORIES",

    stayClose:
      "Stay close to familiar moments",

    today: "TODAY",

    daySimpler:
      "Your day, made simpler",

    daySimplerDescription:
      "Everything important for today in one place.",

    dailyRoutine:
      "DAILY ROUTINE",

    todayRoutine:
      "Today's routine",

    updating: "Updating...",

    done: "Done",

    remind10:
      "Remind me in 10 min",

    completed: "Completed",
    snoozed: "Snoozed",
    pending: "Pending",

    snoozedUntil: "Snoozed until",

    dayClear:
      "Your day is clear",

    remindersAppear:
      "Your reminders will appear here when they are added.",

    viewRoutine:
      "View full routine",

    memoryOfDay:
      "MEMORY OF THE DAY",

    familiarMoment:
      "A familiar moment",

    memory: "Memory",

    family: "Family",

    familiarMemory:
      "A familiar memory",

    meaningfulMoment:
      "A meaningful moment shared by your family.",

    familyMemory:
      "FAMILY MEMORY",

    specialCelebration:
      "A special family celebration",

    familiarCollection:
      "A familiar moment from the family memory collection.",

    visitMemories:
      "Visit my memories",

    recommended:
      "RECOMMENDED FOR YOU",

    gentleActivity:
      "A gentle activity for today",

    memoryMatch:
      "Memory Match",

    gettingStarted:
      "Getting started",

    recentActivity:
      "Suggested from your recent activity",

    gentleBegin:
      "A gentle activity to begin with",

    memoryAttention:
      "Memory & attention",

    takeTime:
      "Take your time",

    startActivity:
      "Start activity",

    explore: "EXPLORE",

    moreWays:
      "More ways SMRITI can help",

    memoryDescription:
      "Revisit familiar people, stories and meaningful moments.",

    activityDescription:
      "Explore gentle activities for memory and attention.",

    assistantDescription:
      "Ask about familiar people and memories shared by your family.",

    todayWord: "Today",

    reminder: "Reminder",

    reminderCompleted:
      "marked as completed.",

    reminderSnoozed:
      "will remind you again in 10 minutes.",

    reminderUpdateError:
      "Could not update the reminder. Please try again.",

    reminderSnoozeError:
      "Could not snooze the reminder. Please try again.",

    welcome:
      "Welcome to SMRITI. What would you like to do today?",

    patient: "Patient",
  },

  Assamese: {
    signOut: "ছাইন আউট",

    home: "হোম",
    activities: "কাৰ্যকলাপ",
    memories: "মোৰ স্মৃতিসমূহ",
    routine: "মোৰ দৈনিক কাৰ্যসূচী",
    talkToSmriti: "SMRITIৰ সৈতে কথা পাতক",

    familyConnected:
      "পৰিয়াল সংযুক্ত আছে",

    familyConnectedDescription:
      "আপোনাৰ যত্ন লোৱা ব্যক্তিয়ে আপোনাৰ অভিজ্ঞতাত সহায় কৰিব পাৰে।",

    morning: "সুপ্ৰভাত",
    afternoon: "শুভ দুপৰীয়া",
    evening: "শুভ সন্ধিয়া",

    personalSpace:
      "আপোনাৰ ব্যক্তিগত স্থান",

    heroDescription:
      "চিনাকি স্মৃতি, অৰ্থপূৰ্ণ কাৰ্যকলাপ আৰু আপোনাৰ দৈনিক কাৰ্যসূচী — সকলো এটা শান্ত স্থানত।",

    startTodayActivity:
      "আজিৰ কাৰ্যকলাপ আৰম্ভ কৰক",

    listen: "শুনক",

    familyMemories:
      "পৰিয়াল আৰু স্মৃতি",

    stayClose:
      "চিনাকি মুহূৰ্তসমূহৰ ওচৰত থাকক",

    today: "আজি",

    daySimpler:
      "আপোনাৰ দিনটো সহজ কৰি তোলক",

    daySimplerDescription:
      "আজিৰ সকলো গুৰুত্বপূৰ্ণ কথা একে ঠাইতে।",

    dailyRoutine:
      "দৈনিক কাৰ্যসূচী",

    todayRoutine:
      "আজিৰ কাৰ্যসূচী",

    updating:
      "আপডেট হৈ আছে...",

    done: "সম্পূৰ্ণ",

    remind10:
      "১০ মিনিট পিছত মনত পেলাওক",

    completed: "সম্পূৰ্ণ",
    snoozed: "পিছলৈ ৰখা হৈছে",
    pending: "বাকী আছে",

    snoozedUntil:
      "পিছলৈ ৰখা হৈছে",

    dayClear:
      "আজিৰ কাৰ্যসূচী খালী আছে",

    remindersAppear:
      "নতুন সোঁৱৰাই দিয়া কাৰ্য যোগ কৰিলে ইয়াত দেখা যাব।",

    viewRoutine:
      "সম্পূৰ্ণ কাৰ্যসূচী চাওক",

    memoryOfDay:
      "আজিৰ স্মৃতি",

    familiarMoment:
      "এটা চিনাকি মুহূৰ্ত",

    memory: "স্মৃতি",

    family: "পৰিয়াল",

    familiarMemory:
      "এটা চিনাকি স্মৃতি",

    meaningfulMoment:
      "আপোনাৰ পৰিয়ালৰ সৈতে ভাগ কৰা এটা অৰ্থপূৰ্ণ মুহূৰ্ত।",

    familyMemory:
      "পৰিয়ালৰ স্মৃতি",

    specialCelebration:
      "পৰিয়ালৰ এটা বিশেষ উদযাপন",

    familiarCollection:
      "পৰিয়ালৰ স্মৃতি সংগ্ৰহৰ এটা চিনাকি মুহূৰ্ত।",

    visitMemories:
      "মোৰ স্মৃতিসমূহ চাওক",

    recommended:
      "আপোনাৰ বাবে পৰামৰ্শ",

    gentleActivity:
      "আজিৰ বাবে এটা সহজ কাৰ্যকলাপ",

    memoryMatch:
      "স্মৃতি মিলোৱা",

    gettingStarted:
      "আৰম্ভণি",

    recentActivity:
      "আপোনাৰ শেহতীয়া কাৰ্যকলাপৰ ভিত্তিত পৰামৰ্শ দিয়া হৈছে",

    gentleBegin:
      "আৰম্ভ কৰিবলৈ এটা সহজ কাৰ্যকলাপ",

    memoryAttention:
      "স্মৃতি আৰু মনোযোগ",

    takeTime:
      "লাহে লাহে কৰক",

    startActivity:
      "কাৰ্যকলাপ আৰম্ভ কৰক",

    explore: "অন্বেষণ কৰক",

    moreWays:
      "SMRITIয়ে আপোনাক সহায় কৰিব পৰা আন উপায়",

    memoryDescription:
      "চিনাকি মানুহ, কাহিনী আৰু অৰ্থপূৰ্ণ মুহূৰ্তসমূহ পুনৰ মনত পেলাওক।",

    activityDescription:
      "স্মৃতি আৰু মনোযোগৰ বাবে সহজ কাৰ্যকলাপসমূহ চেষ্টা কৰক।",

    assistantDescription:
      "আপোনাৰ পৰিয়ালে ভাগ কৰা চিনাকি মানুহ আৰু স্মৃতিৰ বিষয়ে সুধক।",

    todayWord: "আজি",

    reminder: "সোঁৱৰাই দিয়া কাৰ্য",

    reminderCompleted:
      "সম্পূৰ্ণ কৰা হৈছে।",

    reminderSnoozed:
      "১০ মিনিট পিছত পুনৰ মনত পেলোৱা হ'ব।",

    reminderUpdateError:
      "সোঁৱৰাই দিয়া কাৰ্যটো আপডেট কৰিব পৰা নগ'ল। পুনৰ চেষ্টা কৰক।",

    reminderSnoozeError:
      "সোঁৱৰাই দিয়া কাৰ্যটো পিছলৈ ৰাখিব পৰা নগ'ল। পুনৰ চেষ্টা কৰক।",

    welcome:
      "SMRITIলৈ স্বাগতম। আজি আপুনি কি কৰিব বিচাৰে?",

    patient: "ব্যৱহাৰকাৰী",
  },
};

/* =====================================================
   COMPONENT
   ===================================================== */

function PatientHome() {
  const navigate =
    useNavigate();

  /* =====================================================
     LANGUAGE
     ===================================================== */

  const [
    language,
    setLanguage,
  ] =
    useState<AppLanguage>(
      getStoredLanguage()
    );

  const languageOption =
    getLanguageOption(
      language
    );

  const text =
    language ===
    "Assamese"
      ? patientHomeTranslations.Assamese
      : patientHomeTranslations.English;

  /* =====================================================
     STATE
     ===================================================== */

  const [
    patient,
    setPatient,
  ] =
    useState<PatientData>({
      name: "Patient",
      language: "English",
    });

  const [
    reminders,
    setReminders,
  ] =
    useState<Reminder[]>(
      []
    );

  const [
    memories,
    setMemories,
  ] =
    useState<Memory[]>(
      []
    );

  const [
    gameSessions,
    setGameSessions,
  ] =
    useState<
      GameSession[]
    >([]);

  const [
    recommendations,
    setRecommendations,
  ] =
    useState<
      Recommendation[]
    >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    processingReminderId,
    setProcessingReminderId,
  ] =
    useState<
      string | null
    >(null);

  const [
    reminderMessage,
    setReminderMessage,
  ] = useState("");

  /* =====================================================
     CURRENT USER
     ===================================================== */

  const storedUser =
    localStorage.getItem(
      "user"
    );

  let user: any = null;

  try {
    user = storedUser
      ? JSON.parse(
          storedUser
        )
      : null;
  } catch {
    user = null;
  }

  const patientId =
    user?.patientId;

  /* =====================================================
     LANGUAGE CHANGE
     ===================================================== */

  const handleLanguageChange = (
    selectedLanguage: AppLanguage
  ) => {
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

    setReminderMessage(
      ""
    );
  };

  /* =====================================================
     REFRESH REMINDERS
     ===================================================== */

  const refreshReminders =
    async () => {
      if (!patientId) {
        return;
      }

      try {
        const response =
          await getReminders(
            patientId
          );

        setReminders(
          Array.isArray(
            response
          )
            ? response
            : []
        );
      } catch (error) {
        console.error(
          "Failed to refresh reminders:",
          error
        );
      }
    };

  /* =====================================================
     LOAD DASHBOARD
     ===================================================== */

  useEffect(() => {
    async function loadDashboard() {
      if (!patientId) {
        setPatient({
          name:
            user?.name ||
            "Patient",

          language:
            "English",
        });

        setLoading(
          false
        );

        return;
      }

      try {
        const [
          patientResponse,
          reminderResponse,
          memoryResponse,
          sessionResponse,
          recommendationResponse,
        ] =
          await Promise.all([
            getPatient(
              patientId
            ),

            getReminders(
              patientId
            ),

            getMemories(
              patientId
            ),

            getGameSessions(
              patientId
            ),

            getRecommendations(
              patientId
            ),
          ]);

        if (
          patientResponse?.success &&
          patientResponse?.patient
        ) {
          const patientLanguage =
            patientResponse.patient
              .language ||
            "English";

          setPatient({
            name:
              patientResponse.patient
                .name ||
              user?.name ||
              "Patient",

            language:
              patientLanguage,
          });

          const existingLanguage =
            localStorage.getItem(
              "smriti-language"
            );

          if (
            !existingLanguage &&
            (
              patientLanguage ===
                "English" ||
              patientLanguage ===
                "Assamese"
            )
          ) {
            const profileLanguage =
              patientLanguage as AppLanguage;

            setLanguage(
              profileLanguage
            );

            saveLanguage(
              profileLanguage
            );
          }
        } else {
          setPatient({
            name:
              user?.name ||
              "Patient",

            language:
              "English",
          });
        }

        setReminders(
          Array.isArray(
            reminderResponse
          )
            ? reminderResponse
            : []
        );

        setMemories(
          Array.isArray(
            memoryResponse
          )
            ? memoryResponse
            : []
        );

        setGameSessions(
          Array.isArray(
            sessionResponse
          )
            ? sessionResponse
            : []
        );

        setRecommendations(
          Array.isArray(
            recommendationResponse
          )
            ? recommendationResponse
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load patient dashboard:",
          error
        );

        setPatient({
          name:
            user?.name ||
            "Patient",

          language:
            "English",
        });
      } finally {
        setLoading(
          false
        );
      }
    }

    void loadDashboard();
  }, [patientId]);

  /* =====================================================
     GREETING
     ===================================================== */

  const greeting =
    useMemo(() => {
      const hour =
        new Date().getHours();

      if (hour < 12) {
        return text.morning;
      }

      if (hour < 17) {
        return text.afternoon;
      }

      return text.evening;
    }, [
      language,
      text.morning,
      text.afternoon,
      text.evening,
    ]);

  /* =====================================================
     TODAY DATE
     ===================================================== */

  const today =
    useMemo(() => {
      const locale =
        language ===
        "Assamese"
          ? "as-IN"
          : "en-IN";

      try {
        return new Intl.DateTimeFormat(
          locale,
          {
            weekday:
              "long",

            day:
              "numeric",

            month:
              "long",
          }
        ).format(
          new Date()
        );
      } catch {
        return new Intl.DateTimeFormat(
          "en-IN",
          {
            weekday:
              "long",

            day:
              "numeric",

            month:
              "long",
          }
        ).format(
          new Date()
        );
      }
    }, [language]);

  /* =====================================================
     TODAY REMINDERS
     ===================================================== */

  const todayReminders =
    useMemo(() => {
      const todayDate =
        new Date();

      return reminders
        .filter(
          (reminder) => {
            if (
              !reminder.date
            ) {
              return true;
            }

            const parts =
              reminder.date.split(
                "-"
              );

            if (
              parts.length ===
              3
            ) {
              const year =
                Number(
                  parts[0]
                );

              const month =
                Number(
                  parts[1]
                );

              const day =
                Number(
                  parts[2]
                );

              if (
                Number.isFinite(
                  year
                ) &&
                Number.isFinite(
                  month
                ) &&
                Number.isFinite(
                  day
                )
              ) {
                return (
                  year ===
                    todayDate.getFullYear() &&
                  month ===
                    todayDate.getMonth() +
                      1 &&
                  day ===
                    todayDate.getDate()
                );
              }
            }

            const reminderDate =
              new Date(
                reminder.date
              );

            if (
              Number.isNaN(
                reminderDate.getTime()
              )
            ) {
              return true;
            }

            return (
              reminderDate.getDate() ===
                todayDate.getDate() &&
              reminderDate.getMonth() ===
                todayDate.getMonth() &&
              reminderDate.getFullYear() ===
                todayDate.getFullYear()
            );
          }
        )
        .sort(
          (a, b) =>
            (
              a.time ||
              ""
            ).localeCompare(
              b.time ||
                ""
            )
        )
        .slice(
          0,
          3
        );
    }, [reminders]);

  /* =====================================================
     DASHBOARD DATA
     ===================================================== */

  const featuredMemory =
    memories.length >
    0
      ? memories[0]
      : null;

  const latestSession =
    gameSessions.length >
    0
      ? gameSessions[0]
      : null;

  const recommendation =
    recommendations.length >
    0
      ? recommendations[0]
      : null;

  const recommendedGame =
    recommendation?.gameName ||
    recommendation?.title ||
    text.memoryMatch;

  const hasActivityHistory =
    Boolean(
      latestSession
    ) ||
    recommendations.length >
      0;

  const recommendedDifficulty =
    hasActivityHistory
      ? recommendation
          ?.recommendedDifficulty ||
        recommendation
          ?.difficulty ||
        latestSession
          ?.difficulty ||
        "Medium"
      : text.gettingStarted;

  const recommendedReason =
    recommendation?.reason ||
    (latestSession
      ? text.recentActivity
      : text.gentleBegin);

  /* =====================================================
     REMINDER STATUS
     ===================================================== */

  const getReminderStatus = (
    reminder: Reminder
  ) => {
    if (
      reminder.completed ===
        true ||
      reminder.status?.toLowerCase() ===
        "completed" ||
      reminder.status?.toLowerCase() ===
        "done"
    ) {
      return "completed";
    }

    if (
      reminder.status?.toLowerCase() ===
      "snoozed"
    ) {
      return "snoozed";
    }

    return "pending";
  };

  /* =====================================================
     SNOOZE TIME
     ===================================================== */

  const formatSnoozedTime = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const locale =
      language ===
      "Assamese"
        ? "as-IN"
        : "en-IN";

    try {
      return new Intl.DateTimeFormat(
        locale,
        {
          hour:
            "numeric",

          minute:
            "2-digit",
        }
      ).format(
        date
      );
    } catch {
      return new Intl.DateTimeFormat(
        "en-IN",
        {
          hour:
            "numeric",

          minute:
            "2-digit",
        }
      ).format(
        date
      );
    }
  };

  /* =====================================================
     COMPLETE REMINDER
     ===================================================== */

  const handleCompleteReminder =
    async (
      reminder: Reminder
    ) => {
      const reminderId =
        reminder._id ||
        reminder.id;

      if (
        !reminderId ||
        processingReminderId
      ) {
        return;
      }

      try {
        setProcessingReminderId(
          reminderId
        );

        setReminderMessage(
          ""
        );

        await completeReminder(
          reminderId
        );

        await refreshReminders();

        setReminderMessage(
          `"${reminder.title || text.reminder}" ${text.reminderCompleted}`
        );
      } catch (error) {
        console.error(
          "Failed to complete reminder:",
          error
        );

        setReminderMessage(
          text.reminderUpdateError
        );
      } finally {
        setProcessingReminderId(
          null
        );
      }
    };

  /* =====================================================
     SNOOZE REMINDER
     ===================================================== */

  const handleSnoozeReminder =
    async (
      reminder: Reminder
    ) => {
      const reminderId =
        reminder._id ||
        reminder.id;

      if (
        !reminderId ||
        processingReminderId
      ) {
        return;
      }

      try {
        setProcessingReminderId(
          reminderId
        );

        setReminderMessage(
          ""
        );

        await snoozeReminder(
          reminderId,
          10
        );

        await refreshReminders();

        setReminderMessage(
          `"${reminder.title || text.reminder}" ${text.reminderSnoozed}`
        );
      } catch (error) {
        console.error(
          "Failed to snooze reminder:",
          error
        );

        setReminderMessage(
          text.reminderSnoozeError
        );
      } finally {
        setProcessingReminderId(
          null
        );
      }
    };

  /* =====================================================
     SPEAK WELCOME
     ===================================================== */

  const speakWelcome =
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

      const name =
        patient.name ||
        text.patient;

      const welcomeText =
        `${greeting}, ${name}. ${text.welcome}`;

      const message =
        new SpeechSynthesisUtterance(
          welcomeText
        );

      message.lang =
        languageOption.speechCode;

      message.rate =
        0.84;

      message.pitch =
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
              .split(
                "-"
              )[0] ===
            requestedBase
        );

      if (
        matchingVoice
      ) {
        message.voice =
          matchingVoice;
      }

      window.speechSynthesis.speak(
        message
      );
    };

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout =
    () => {
      if (
        "speechSynthesis" in
        window
      ) {
        window.speechSynthesis.cancel();
      }

      localStorage.removeItem(
        "user"
      );

      navigate(
        "/login"
      );
    };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main className="patient-page">

      {/* HEADER */}

      <header className="patient-header">

        <button
          type="button"
          className="patient-brand"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <div className="patient-brand-mark">
            S
          </div>

          <div className="patient-brand-copy">
            <strong>
              SMRITI
            </strong>

            <span>
              Memory & daily wellbeing
            </span>
          </div>
        </button>

        <div className="patient-header-actions">

          {/* LANGUAGE SELECTOR */}

          <div
            className="patient-language"
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "7px",
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
                  "inherit",
                font:
                  "inherit",
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

          <button
            type="button"
            className="patient-icon-button"
            onClick={() =>
              navigate(
                "/reminders"
              )
            }
            aria-label="Open reminders"
          >
            <Bell
              size={22}
            />
          </button>

          <button
            type="button"
            className="patient-profile-button"
            aria-label="Patient profile"
          >
            <UserRound
              size={22}
            />
          </button>

          <button
            type="button"
            className="patient-logout-button"
            onClick={
              handleLogout
            }
          >
            <LogOut
              size={18}
            />

            <span>
              {
                text.signOut
              }
            </span>
          </button>
        </div>
      </header>

      <div className="patient-layout">

        {/* SIDEBAR */}

        <aside className="patient-sidebar">
          <nav className="patient-nav">

            <button
              type="button"
              className="patient-nav-item patient-nav-active"
              onClick={() =>
                navigate(
                  "/home"
                )
              }
            >
              <Home
                size={22}
              />

              <span>
                {
                  text.home
                }
              </span>
            </button>

            <button
              type="button"
              className="patient-nav-item"
              onClick={() =>
                navigate(
                  "/games"
                )
              }
            >
              <Gamepad2
                size={22}
              />

              <span>
                {
                  text.activities
                }
              </span>
            </button>

            <button
              type="button"
              className="patient-nav-item"
              onClick={() =>
                navigate(
                  "/memories"
                )
              }
            >
              <Images
                size={22}
              />

              <span>
                {
                  text.memories
                }
              </span>
            </button>

            <button
              type="button"
              className="patient-nav-item"
              onClick={() =>
                navigate(
                  "/reminders"
                )
              }
            >
              <CalendarDays
                size={22}
              />

              <span>
                {
                  text.routine
                }
              </span>
            </button>

            <button
              type="button"
              className="patient-nav-item"
              onClick={() =>
                navigate(
                  "/assistant"
                )
              }
            >
              <MessageCircle
                size={22}
              />

              <span>
                {
                  text.talkToSmriti
                }
              </span>
            </button>
          </nav>

          <div className="patient-sidebar-support">
            <div className="support-icon">
              <Heart
                size={20}
              />
            </div>

            <div>
              <strong>
                {
                  text.familyConnected
                }
              </strong>

              <span>
                {
                  text.familyConnectedDescription
                }
              </span>
            </div>
          </div>
        </aside>

        {/* CONTENT */}

        <section className="patient-content">

          {/* HERO */}

          <section className="patient-hero">

            <div className="patient-hero-copy">

              <div className="patient-hero-date">
                <CalendarDays
                  size={17}
                />

                <span>
                  {
                    today
                  }
                </span>
              </div>

              <p className="hero-eyebrow">
                {
                  text.personalSpace
                }
              </p>

              <h1>
                {greeting},
                <span>
                  {loading
                    ? "..."
                    : patient.name}
                </span>
              </h1>

              <p className="hero-description">
                {
                  text.heroDescription
                }
              </p>

              <div className="patient-hero-actions">

                <button
                  type="button"
                  className="hero-primary-button"
                  onClick={() =>
                    navigate(
                      "/games"
                    )
                  }
                >
                  <Brain
                    size={21}
                  />

                  <span>
                    {
                      text.startTodayActivity
                    }
                  </span>

                  <ChevronRight
                    size={19}
                  />
                </button>

                <button
                  type="button"
                  className="hero-listen-button"
                  onClick={
                    speakWelcome
                  }
                >
                  <Volume2
                    size={20}
                  />

                  <span>
                    {
                      text.listen
                    }
                  </span>
                </button>
              </div>
            </div>

            <div className="patient-hero-photo">

              <img
                src={
                  patientWelcomeImage
                }
                alt="Family spending time together"
              />

              <div className="hero-photo-gradient" />

              <div className="hero-photo-caption">
                <Heart
                  size={19}
                />

                <div>
                  <span>
                    {
                      text.familyMemories
                    }
                  </span>

                  <strong>
                    {
                      text.stayClose
                    }
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* TODAY TITLE */}

          <div className="patient-section-heading">
            <div>
              <span className="section-eyebrow">
                {
                  text.today
                }
              </span>

              <h2>
                {
                  text.daySimpler
                }
              </h2>
            </div>

            <p>
              {
                text.daySimplerDescription
              }
            </p>
          </div>

          {/* TODAY */}

          <section className="today-grid">

            {/* ROUTINE */}

            <article className="dashboard-card routine-card">

              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    {
                      text.dailyRoutine
                    }
                  </span>

                  <h3>
                    {
                      text.todayRoutine
                    }
                  </h3>
                </div>

                <div className="card-header-icon green-icon">
                  <CalendarDays
                    size={23}
                  />
                </div>
              </div>

              {reminderMessage && (
                <div
                  style={{
                    marginBottom:
                      "16px",

                    padding:
                      "12px 14px",

                    borderRadius:
                      "12px",

                    background:
                      "#f4f7f2",

                    fontSize:
                      "14px",

                    lineHeight:
                      1.5,
                  }}
                >
                  {
                    reminderMessage
                  }
                </div>
              )}

              {todayReminders.length >
              0 ? (
                <div className="routine-list">

                  {todayReminders.map(
                    (
                      reminder,
                      index
                    ) => {
                      const reminderId =
                        reminder._id ||
                        reminder.id ||
                        String(
                          index
                        );

                      const status =
                        getReminderStatus(
                          reminder
                        );

                      const completed =
                        status ===
                        "completed";

                      const snoozed =
                        status ===
                        "snoozed";

                      const processing =
                        processingReminderId ===
                        reminderId;

                      return (
                        <div
                          className="routine-item"
                          key={
                            reminderId
                          }
                        >
                          <div className="routine-time">
                            <Clock3
                              size={17}
                            />

                            <span>
                              {reminder.time ||
                                text.todayWord}
                            </span>
                          </div>

                          <div className="routine-main">

                            <strong>
                              {reminder.title ||
                                text.reminder}
                            </strong>

                            {reminder.description && (
                              <span>
                                {
                                  reminder.description
                                }
                              </span>
                            )}

                            {snoozed && (
                              <span
                                style={{
                                  marginTop:
                                    "5px",

                                  fontWeight:
                                    600,
                                }}
                              >
                                {
                                  text.snoozedUntil
                                }

                                {reminder.snoozedUntil
                                  ? ` ${formatSnoozedTime(
                                      reminder.snoozedUntil
                                    )}`
                                  : ""}
                              </span>
                            )}

                            {!completed &&
                              !snoozed && (
                                <div
                                  style={{
                                    display:
                                      "flex",

                                    flexWrap:
                                      "wrap",

                                    gap:
                                      "8px",

                                    marginTop:
                                      "12px",
                                  }}
                                >
                                  <button
                                    type="button"
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      handleCompleteReminder(
                                        reminder
                                      )
                                    }
                                    style={{
                                      border:
                                        "none",

                                      borderRadius:
                                        "10px",

                                      padding:
                                        "10px 14px",

                                      cursor:
                                        processing
                                          ? "not-allowed"
                                          : "pointer",

                                      fontWeight:
                                        700,

                                      background:
                                        "#174c3c",

                                      color:
                                        "#ffffff",

                                      opacity:
                                        processing
                                          ? 0.65
                                          : 1,
                                    }}
                                  >
                                    {processing
                                      ? text.updating
                                      : text.done}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      handleSnoozeReminder(
                                        reminder
                                      )
                                    }
                                    style={{
                                      border:
                                        "1px solid #d8d8d0",

                                      borderRadius:
                                        "10px",

                                      padding:
                                        "10px 14px",

                                      cursor:
                                        processing
                                          ? "not-allowed"
                                          : "pointer",

                                      fontWeight:
                                        700,

                                      background:
                                        "#ffffff",

                                      color:
                                        "#174c3c",

                                      opacity:
                                        processing
                                          ? 0.65
                                          : 1,
                                    }}
                                  >
                                    {
                                      text.remind10
                                    }
                                  </button>
                                </div>
                              )}
                          </div>

                          <div
                            className={
                              completed
                                ? "routine-status completed"
                                : "routine-status upcoming"
                            }
                          >
                            {completed ? (
                              <CheckCircle2
                                size={18}
                              />
                            ) : (
                              <Clock3
                                size={18}
                              />
                            )}

                            <span>
                              {completed
                                ? text.completed
                                : snoozed
                                ? text.snoozed
                                : text.pending}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="card-empty-state">
                  <CalendarDays
                    size={28}
                  />

                  <div>
                    <strong>
                      {
                        text.dayClear
                      }
                    </strong>

                    <span>
                      {
                        text.remindersAppear
                      }
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="card-text-button"
                onClick={() =>
                  navigate(
                    "/reminders"
                  )
                }
              >
                <span>
                  {
                    text.viewRoutine
                  }
                </span>

                <ChevronRight
                  size={18}
                />
              </button>
            </article>

            {/* MEMORY OF THE DAY */}

            <article className="dashboard-card memory-card">

              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    {
                      text.memoryOfDay
                    }
                  </span>

                  <h3>
                    {
                      text.familiarMoment
                    }
                  </h3>
                </div>

                <div className="card-header-icon gold-icon">
                  <Heart
                    size={23}
                  />
                </div>
              </div>

              <div className="memory-feature">

                <div className="memory-feature-image">
                  <img
                    src={
                      featuredMemory?.photo ||
                      featuredMemory?.imageUrl ||
                      memoryOfTheDayImage
                    }
                    alt={
                      featuredMemory?.title ||
                      "A familiar family memory"
                    }
                  />

                  <div className="memory-image-badge">
                    <Heart
                      size={14}
                    />

                    {
                      text.memory
                    }
                  </div>
                </div>

                <div className="memory-feature-copy">

                  {featuredMemory ? (
                    <>
                      <span className="memory-category">
                        {featuredMemory.category ||
                          text.family}
                      </span>

                      <h4>
                        {featuredMemory.title ||
                          text.familiarMemory}
                      </h4>

                      <p>
                        {featuredMemory.description ||
                          text.meaningfulMoment}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="memory-category">
                        {
                          text.familyMemory
                        }
                      </span>

                      <h4>
                        {
                          text.specialCelebration
                        }
                      </h4>

                      <p>
                        {
                          text.familiarCollection
                        }
                      </p>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="card-text-button"
                onClick={() =>
                  navigate(
                    "/memories"
                  )
                }
              >
                <span>
                  {
                    text.visitMemories
                  }
                </span>

                <ChevronRight
                  size={18}
                />
              </button>
            </article>
          </section>

          {/* RECOMMENDATION */}

          <section className="recommendation-section">

            <div className="recommendation-heading">
              <div>
                <span className="section-eyebrow">
                  {
                    text.recommended
                  }
                </span>

                <h2>
                  {
                    text.gentleActivity
                  }
                </h2>
              </div>

              <Sparkles
                size={23}
              />
            </div>

            <div className="recommendation-card">

              <div className="recommendation-icon">
                <Brain
                  size={32}
                />
              </div>

              <div className="recommendation-copy">

                <div className="recommendation-title-row">
                  <h3>
                    {
                      recommendedGame
                    }
                  </h3>

                  <span className="difficulty-pill">
                    {
                      recommendedDifficulty
                    }
                  </span>
                </div>

                <p>
                  {
                    recommendedReason
                  }
                </p>

                <div className="recommendation-meta">

                  <span>
                    <Gamepad2
                      size={17}
                    />

                    {
                      text.memoryAttention
                    }
                  </span>

                  <span>
                    <Clock3
                      size={17}
                    />

                    {
                      text.takeTime
                    }
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="recommendation-start"
                onClick={() =>
                  navigate(
                    "/games"
                  )
                }
              >
                <Play
                  size={18}
                  fill="currentColor"
                />

                <span>
                  {
                    text.startActivity
                  }
                </span>
              </button>
            </div>
          </section>

          {/* EXPLORE */}

          <section className="quick-section">

            <div className="patient-section-heading quick-heading">
              <div>
                <span className="section-eyebrow">
                  {
                    text.explore
                  }
                </span>

                <h2>
                  {
                    text.moreWays
                  }
                </h2>
              </div>
            </div>

            <div className="quick-grid">

              <button
                type="button"
                className="quick-card"
                onClick={() =>
                  navigate(
                    "/memories"
                  )
                }
              >
                <div className="quick-icon memory-quick">
                  <UsersRound
                    size={27}
                  />
                </div>

                <div>
                  <h3>
                    {
                      text.memories
                    }
                  </h3>

                  <p>
                    {
                      text.memoryDescription
                    }
                  </p>
                </div>

                <ChevronRight
                  size={23}
                />
              </button>

              <button
                type="button"
                className="quick-card"
                onClick={() =>
                  navigate(
                    "/games"
                  )
                }
              >
                <div className="quick-icon activity-quick">
                  <Brain
                    size={27}
                  />
                </div>

                <div>
                  <h3>
                    {
                      text.activities
                    }
                  </h3>

                  <p>
                    {
                      text.activityDescription
                    }
                  </p>
                </div>

                <ChevronRight
                  size={23}
                />
              </button>

              <button
                type="button"
                className="quick-card"
                onClick={() =>
                  navigate(
                    "/assistant"
                  )
                }
              >
                <div className="quick-icon assistant-quick">
                  <MessageCircle
                    size={27}
                  />
                </div>

                <div>
                  <h3>
                    {
                      text.talkToSmriti
                    }
                  </h3>

                  <p>
                    {
                      text.assistantDescription
                    }
                  </p>
                </div>

                <ChevronRight
                  size={23}
                />
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default PatientHome;