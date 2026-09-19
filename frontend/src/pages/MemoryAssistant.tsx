import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Globe2,
  Heart,
  Home,
  Image as ImageIcon,
  MessageCircle,
  Mic,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
  Volume2,
} from "lucide-react";

import VoiceButton from "../components/VoiceButton";

import {
  getFamilyMembers,
  getMemories,
} from "../services/api";

import {
  getLanguageOption,
  getStoredLanguage,
  getTranslations,
  saveLanguage,
  SUPPORTED_LANGUAGES,
} from "../i18n/languages";

import type {
  AppLanguage,
} from "../i18n/languages";

import "./MemoryAssistant.css";

/* =====================================================
   TYPES
   ===================================================== */

type FamilyMember = {
  _id?: string;
  name?: string;
  relationship?: string;
  age?: number;
  photo?: string;
};

type Memory = {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  photo?: string;
  imageUrl?: string;
};

type AssistantSource =
  | {
      type: "family";
      title: string;
      subtitle: string;
      image?: string;
    }
  | {
      type: "memory";
      title: string;
      subtitle: string;
      image?: string;
    };

type AssistantResult = {
  text: string;
  source: AssistantSource | null;
};

/* =====================================================
   TEXT HELPERS
   ===================================================== */

function normalizeText(
  value?: string
) {
  return (value || "")
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(
  value: string
) {
  const stopWords =
    new Set([
      "a",
      "an",
      "and",
      "are",
      "about",
      "can",
      "could",
      "do",
      "does",
      "for",
      "from",
      "i",
      "in",
      "is",
      "it",
      "me",
      "my",
      "of",
      "on",
      "please",
      "show",
      "tell",
      "the",
      "this",
      "to",
      "what",
      "when",
      "where",
      "which",
      "who",
      "with",
      "you",
    ]);

  return normalizeText(value)
    .split(" ")
    .filter(
      (word) =>
        word.length > 1 &&
        !stopWords.has(
          word
        )
    );
}

/* =====================================================
   COMPONENT
   ===================================================== */

function MemoryAssistant() {
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

  const t =
    getTranslations(
      language
    );

  const languageOption =
    getLanguageOption(
      language
    );

  /* =====================================================
     STATE
     ===================================================== */

  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    familyMembers,
    setFamilyMembers,
  ] =
    useState<
      FamilyMember[]
    >([]);

  const [
    memories,
    setMemories,
  ] =
    useState<Memory[]>(
      []
    );

  const [
    source,
    setSource,
  ] =
    useState<AssistantSource | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    thinking,
    setThinking,
  ] = useState(false);

  const [
    dataError,
    setDataError,
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

  const patientName =
    user?.name ||
    "there";

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

    setQuestion("");
    setAnswer("");
    setSource(null);
    setDataError("");
  };

  /* =====================================================
     LOAD PERSONAL MEMORY DATA
     ===================================================== */

  useEffect(() => {
    async function loadMemoryData() {
      if (!patientId) {
        setDataError(
          t.noPatient
        );

        setLoading(
          false
        );

        return;
      }

      try {
        setLoading(
          true
        );

        setDataError(
          ""
        );

        const [
          familyResponse,
          memoryResponse,
        ] =
          await Promise.all([
            getFamilyMembers(
              patientId
            ),

            getMemories(
              patientId
            ),
          ]);

        setFamilyMembers(
          Array.isArray(
            familyResponse
          )
            ? familyResponse
            : []
        );

        setMemories(
          Array.isArray(
            memoryResponse
          )
            ? memoryResponse
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load SMRITI memory data:",
          error
        );

        setDataError(
          t.loadError
        );
      } finally {
        setLoading(
          false
        );
      }
    }

    void loadMemoryData();
  }, [
    patientId,
    language,
    t.noPatient,
    t.loadError,
  ]);

  /* =====================================================
     COUNTS
     ===================================================== */

  const familyCount =
    familyMembers.length;

  const memoryCount =
    memories.length;

  const hasPersonalData =
    familyCount > 0 ||
    memoryCount > 0;

  /* =====================================================
     FIND FAMILY MEMBER
     ===================================================== */

  const findFamilyMember = (
    query: string
  ): FamilyMember | null => {
    const normalizedQuestion =
      normalizeText(
        query
      );

    const queryWords =
      getWords(query);

    let bestMember:
      | FamilyMember
      | null = null;

    let bestScore = 0;

    familyMembers.forEach(
      (member) => {
        const name =
          normalizeText(
            member.name
          );

        const relationship =
          normalizeText(
            member.relationship
          );

        let score = 0;

        if (
          name &&
          normalizedQuestion.includes(
            name
          )
        ) {
          score += 10;
        }

        if (
          relationship &&
          normalizedQuestion.includes(
            relationship
          )
        ) {
          score += 6;
        }

        const memberWords =
          getWords(
            `${
              member.name ||
              ""
            } ${
              member.relationship ||
              ""
            }`
          );

        queryWords.forEach(
          (word) => {
            if (
              memberWords.includes(
                word
              )
            ) {
              score += 2;
            }
          }
        );

        if (
          score >
          bestScore
        ) {
          bestScore =
            score;

          bestMember =
            member;
        }
      }
    );

    if (
      bestScore === 0
    ) {
      return null;
    }

    return bestMember;
  };

  /* =====================================================
     FIND MEMORY
     ===================================================== */

  const findMemory = (
    query: string
  ): Memory | null => {
    const normalizedQuestion =
      normalizeText(
        query
      );

    const queryWords =
      getWords(query);

    let bestMemory:
      | Memory
      | null = null;

    let bestScore = 0;

    memories.forEach(
      (memory) => {
        const title =
          normalizeText(
            memory.title
          );

        const category =
          normalizeText(
            memory.category
          );

        const description =
          normalizeText(
            memory.description
          );

        let score = 0;

        if (
          title &&
          normalizedQuestion.includes(
            title
          )
        ) {
          score += 10;
        }

        if (
          category &&
          normalizedQuestion.includes(
            category
          )
        ) {
          score += 5;
        }

        const memoryWords =
          getWords(
            `${
              memory.title ||
              ""
            } ${
              memory.category ||
              ""
            } ${
              memory.description ||
              ""
            }`
          );

        queryWords.forEach(
          (word) => {
            if (
              memoryWords.includes(
                word
              )
            ) {
              score += 2;
            }
          }
        );

        if (
          description &&
          description.length >
            3 &&
          normalizedQuestion.includes(
            description
          )
        ) {
          score += 4;
        }

        if (
          score >
          bestScore
        ) {
          bestScore =
            score;

          bestMemory =
            memory;
        }
      }
    );

    if (
      bestScore === 0
    ) {
      return null;
    }

    return bestMemory;
  };

  /* =====================================================
     SPEECH OUTPUT
     ===================================================== */

  const speakText = (
    text: string
  ) => {
    if (
      !text ||
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    /*
     * Selected language from
     * languages.ts.
     *
     * Assamese should be as-IN.
     */
    speech.lang =
      languageOption.speechCode;

    speech.rate =
      0.84;

    speech.pitch = 1;

    const chooseVoice =
      () => {
        const voices =
          window.speechSynthesis.getVoices();

        const requestedCode =
          languageOption.speechCode.toLowerCase();

        const requestedBase =
          requestedCode.split(
            "-"
          )[0];

        const exactVoice =
          voices.find(
            (voice) =>
              voice.lang
                .toLowerCase() ===
              requestedCode
          );

        const baseVoice =
          voices.find(
            (voice) =>
              voice.lang
                .toLowerCase()
                .split(
                  "-"
                )[0] ===
              requestedBase
          );

        const matchingVoice =
          exactVoice ||
          baseVoice;

        if (
          matchingVoice
        ) {
          speech.voice =
            matchingVoice;
        }

        window.speechSynthesis.speak(
          speech
        );
      };

    /*
     * Chrome sometimes loads voices
     * asynchronously.
     */
    const availableVoices =
      window.speechSynthesis.getVoices();

    if (
      availableVoices.length >
      0
    ) {
      chooseVoice();
    } else {
      const handleVoicesChanged =
        () => {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

          chooseVoice();
        };

      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );

      window.setTimeout(
        () => {
          if (
            !window.speechSynthesis.speaking
          ) {
            window.speechSynthesis.removeEventListener(
              "voiceschanged",
              handleVoicesChanged
            );

            chooseVoice();
          }
        },
        500
      );
    }
  };

  /* =====================================================
     ENGLISH RESPONSE
     ===================================================== */

  const createEnglishAnswer = (
    query: string
  ): AssistantResult => {
    const normalized =
      normalizeText(
        query
      );

    /*
     * Exact memory title first.
     */

    const exactMemory =
      memories.find(
        (memory) => {
          const title =
            normalizeText(
              memory.title
            );

          return (
            title.length >
              0 &&
            normalized.includes(
              title
            )
          );
        }
      );

    if (exactMemory) {
      let text =
        exactMemory.title
          ? `I found a memory called "${exactMemory.title}".`
          : "I found a familiar memory.";

      if (
        exactMemory.description
      ) {
        text += ` ${exactMemory.description}`;
      }

      if (
        exactMemory.category
      ) {
        text += ` It is saved under ${exactMemory.category}.`;
      }

      return {
        text,

        source: {
          type:
            "memory",

          title:
            exactMemory.title ||
            "Familiar memory",

          subtitle:
            exactMemory.category ||
            "Memory",

          image:
            exactMemory.photo ||
            exactMemory.imageUrl,
        },
      };
    }

    /*
     * Exact family member.
     */

    const exactMember =
      familyMembers.find(
        (member) => {
          const name =
            normalizeText(
              member.name
            );

          return (
            name.length >
              0 &&
            normalized.includes(
              name
            )
          );
        }
      );

    if (exactMember) {
      let text = "";

      if (
        exactMember.name &&
        exactMember.relationship
      ) {
        text =
          `${exactMember.name} is listed in your family memories as your ${exactMember.relationship}.`;
      } else if (
        exactMember.name
      ) {
        text =
          `${exactMember.name} is someone in your family memory collection.`;
      } else {
        text =
          "I found a matching family profile in your memory collection.";
      }

      if (
        exactMember.age !==
          undefined &&
        exactMember.age !==
          null
      ) {
        text +=
          ` Their recorded age is ${exactMember.age}.`;
      }

      return {
        text,

        source: {
          type:
            "family",

          title:
            exactMember.name ||
            "Family member",

          subtitle:
            exactMember.relationship ||
            "Family profile",

          image:
            exactMember.photo,
        },
      };
    }

    /*
     * General family question.
     */

    const askingForFamily =
      normalized.includes(
        "my family"
      ) ||
      normalized.includes(
        "family members"
      ) ||
      normalized.includes(
        "family member"
      ) ||
      normalized ===
        "family";

    if (
      askingForFamily &&
      familyMembers.length >
        0
    ) {
      const names =
        familyMembers
          .map(
            (member) => {
              if (
                member.name &&
                member.relationship
              ) {
                return `${member.name}, your ${member.relationship}`;
              }

              return (
                member.name ||
                member.relationship ||
                ""
              );
            }
          )
          .filter(
            Boolean
          );

      return {
        text:
          names.length ===
          1
            ? `I found one family profile. ${names[0]}.`
            : `I found ${names.length} family profiles. ${names.join(
                "; "
              )}.`,

        source: null,
      };
    }

    /*
     * General memory question.
     */

    const askingForMemories =
      normalized.includes(
        "my memories"
      ) ||
      normalized.includes(
        "my memory"
      ) ||
      normalized.includes(
        "memories"
      );

    if (
      askingForMemories &&
      memories.length >
        0
    ) {
      const titles =
        memories
          .slice(
            0,
            4
          )
          .map(
            (memory) =>
              memory.title
          )
          .filter(
            Boolean
          );

      return {
        text:
          `Your memory collection has ${memories.length} ${
            memories.length ===
            1
              ? "memory"
              : "memories"
          }. ${
            titles.length >
            0
              ? `Some familiar memories are ${titles.join(
                  ", "
                )}.`
              : ""
          }`,

        source: null,
      };
    }

    /*
     * Fuzzy memory.
     */

    const memory =
      findMemory(
        query
      );

    if (memory) {
      let text =
        memory.title
          ? `I found a memory called "${memory.title}".`
          : "I found a familiar memory.";

      if (
        memory.description
      ) {
        text +=
          ` ${memory.description}`;
      }

      if (
        memory.category
      ) {
        text +=
          ` It is saved under ${memory.category}.`;
      }

      return {
        text,

        source: {
          type:
            "memory",

          title:
            memory.title ||
            "Familiar memory",

          subtitle:
            memory.category ||
            "Memory",

          image:
            memory.photo ||
            memory.imageUrl,
        },
      };
    }

    /*
     * Fuzzy family.
     */

    const member =
      findFamilyMember(
        query
      );

    if (member) {
      let text = "";

      if (
        member.name &&
        member.relationship
      ) {
        text =
          `${member.name} is listed in your family memories as your ${member.relationship}.`;
      } else if (
        member.name
      ) {
        text =
          `${member.name} is someone in your family memory collection.`;
      } else {
        text =
          "I found a matching family profile in your memory collection.";
      }

      if (
        member.age !==
          undefined &&
        member.age !==
          null
      ) {
        text +=
          ` Their recorded age is ${member.age}.`;
      }

      return {
        text,

        source: {
          type:
            "family",

          title:
            member.name ||
            "Family member",

          subtitle:
            member.relationship ||
            "Family profile",

          image:
            member.photo,
        },
      };
    }

    /*
     * Greeting.
     */

    if (
      normalized ===
        "hello" ||
      normalized ===
        "hi" ||
      normalized ===
        "hey"
    ) {
      return {
        text:
          `Hello ${patientName}. You can ask me about familiar people or memories shared by your family.`,

        source: null,
      };
    }

    return {
      text:
        t.noMatch,

      source: null,
    };
  };

  /* =====================================================
     ASSAMESE RESPONSE
     ===================================================== */

  const createAssameseAnswer = (
    query: string
  ): AssistantResult => {
    const normalized =
      normalizeText(
        query
      );

    /*
     * Exact memory title.
     */

    const exactMemory =
      memories.find(
        (memory) => {
          const title =
            normalizeText(
              memory.title
            );

          return (
            title.length >
              0 &&
            normalized.includes(
              title
            )
          );
        }
      );

    if (exactMemory) {
      let text =
        exactMemory.title
          ? `"${exactMemory.title}" নামৰ এটা সংৰক্ষিত স্মৃতি পোৱা গৈছে।`
          : "এটা চিনাকি স্মৃতি পোৱা গৈছে।";

      if (
        exactMemory.description
      ) {
        text +=
          ` ${exactMemory.description}`;
      }

      if (
        exactMemory.category
      ) {
        text +=
          ` এইটো ${exactMemory.category} শ্ৰেণীত সংৰক্ষিত আছে।`;
      }

      return {
        text,

        source: {
          type:
            "memory",

          title:
            exactMemory.title ||
            "চিনাকি স্মৃতি",

          subtitle:
            exactMemory.category ||
            "স্মৃতি",

          image:
            exactMemory.photo ||
            exactMemory.imageUrl,
        },
      };
    }

    /*
     * Exact family member.
     */

    const exactMember =
      familyMembers.find(
        (member) => {
          const name =
            normalizeText(
              member.name
            );

          return (
            name.length >
              0 &&
            normalized.includes(
              name
            )
          );
        }
      );

    if (exactMember) {
      let text = "";

      if (
        exactMember.name &&
        exactMember.relationship
      ) {
        text =
          `${exactMember.name} আপোনাৰ পৰিয়ালৰ স্মৃতি সংগ্ৰহত ${exactMember.relationship} হিচাপে সংৰক্ষিত আছে।`;
      } else if (
        exactMember.name
      ) {
        text =
          `${exactMember.name} আপোনাৰ পৰিয়ালৰ স্মৃতি সংগ্ৰহত থকা এজন চিনাকি ব্যক্তি।`;
      } else {
        text =
          "আপোনাৰ স্মৃতি সংগ্ৰহত এটা মিল থকা পৰিয়ালৰ প্ৰ'ফাইল পোৱা গৈছে।";
      }

      if (
        exactMember.age !==
          undefined &&
        exactMember.age !==
          null
      ) {
        text +=
          ` সংৰক্ষিত বয়স ${exactMember.age} বছৰ।`;
      }

      return {
        text,

        source: {
          type:
            "family",

          title:
            exactMember.name ||
            "পৰিয়ালৰ সদস্য",

          subtitle:
            exactMember.relationship ||
            "পৰিয়ালৰ প্ৰ'ফাইল",

          image:
            exactMember.photo,
        },
      };
    }

    /*
     * General family.
     */

    const askingForFamily =
      normalized.includes(
        "my family"
      ) ||
      normalized.includes(
        "family members"
      ) ||
      normalized.includes(
        "পৰিয়ালৰ সদস্য"
      ) ||
      normalized.includes(
        "মোৰ পৰিয়াল"
      );

    if (
      askingForFamily &&
      familyMembers.length >
        0
    ) {
      const names =
        familyMembers
          .map(
            (member) => {
              if (
                member.name &&
                member.relationship
              ) {
                return `${member.name} — ${member.relationship}`;
              }

              return (
                member.name ||
                member.relationship ||
                ""
              );
            }
          )
          .filter(
            Boolean
          );

      return {
        text:
          familyMembers.length ===
          1
            ? `আপোনাৰ স্মৃতি সংগ্ৰহত এটা পৰিয়ালৰ প্ৰ'ফাইল আছে। ${names[0] || ""}।`
            : `আপোনাৰ স্মৃতি সংগ্ৰহত ${familyMembers.length}টা পৰিয়ালৰ প্ৰ'ফাইল আছে। ${names.join(
                "; "
              )}।`,

        source: null,
      };
    }

    /*
     * General memories.
     */

    const askingForMemories =
      normalized.includes(
        "my memories"
      ) ||
      normalized.includes(
        "memories"
      ) ||
      normalized.includes(
        "মোৰ স্মৃতি"
      ) ||
      normalized.includes(
        "স্মৃতিসমূহ"
      );

    if (
      askingForMemories &&
      memories.length >
        0
    ) {
      const titles =
        memories
          .slice(
            0,
            4
          )
          .map(
            (memory) =>
              memory.title
          )
          .filter(
            Boolean
          );

      return {
        text:
          `আপোনাৰ স্মৃতি সংগ্ৰহত ${memories.length}টা সংৰক্ষিত স্মৃতি আছে। ${
            titles.length >
            0
              ? `ইয়াৰ ভিতৰত ${titles.join(
                  ", "
                )} আছে।`
              : ""
          }`,

        source: null,
      };
    }

    /*
     * Fuzzy memory.
     */

    const memory =
      findMemory(
        query
      );

    if (memory) {
      let text =
        memory.title
          ? `"${memory.title}" নামৰ এটা সংৰক্ষিত স্মৃতি পোৱা গৈছে।`
          : "এটা চিনাকি স্মৃতি পোৱা গৈছে।";

      if (
        memory.description
      ) {
        text +=
          ` ${memory.description}`;
      }

      if (
        memory.category
      ) {
        text +=
          ` এইটো ${memory.category} শ্ৰেণীত সংৰক্ষিত আছে।`;
      }

      return {
        text,

        source: {
          type:
            "memory",

          title:
            memory.title ||
            "চিনাকি স্মৃতি",

          subtitle:
            memory.category ||
            "স্মৃতি",

          image:
            memory.photo ||
            memory.imageUrl,
        },
      };
    }

    /*
     * Fuzzy family.
     */

    const member =
      findFamilyMember(
        query
      );

    if (member) {
      let text = "";

      if (
        member.name &&
        member.relationship
      ) {
        text =
          `${member.name} আপোনাৰ পৰিয়ালৰ স্মৃতি সংগ্ৰহত ${member.relationship} হিচাপে সংৰক্ষিত আছে।`;
      } else if (
        member.name
      ) {
        text =
          `${member.name} আপোনাৰ পৰিয়ালৰ স্মৃতি সংগ্ৰহত থকা এজন চিনাকি ব্যক্তি।`;
      } else {
        text =
          "আপোনাৰ স্মৃতি সংগ্ৰহত এটা মিল থকা পৰিয়ালৰ প্ৰ'ফাইল পোৱা গৈছে।";
      }

      if (
        member.age !==
          undefined &&
        member.age !==
          null
      ) {
        text +=
          ` সংৰক্ষিত বয়স ${member.age} বছৰ।`;
      }

      return {
        text,

        source: {
          type:
            "family",

          title:
            member.name ||
            "পৰিয়ালৰ সদস্য",

          subtitle:
            member.relationship ||
            "পৰিয়ালৰ প্ৰ'ফাইল",

          image:
            member.photo,
        },
      };
    }

    /*
     * Greeting.
     */

    if (
      normalized ===
        "নমস্কাৰ" ||
      normalized ===
        "হেল্লো" ||
      normalized ===
        "hello" ||
      normalized ===
        "hi"
    ) {
      return {
        text:
          `নমস্কাৰ ${patientName}। আপুনি পৰিয়ালৰ চিনাকি মানুহ বা সংৰক্ষিত স্মৃতিৰ বিষয়ে মোক সুধিব পাৰে।`,

        source: null,
      };
    }

    return {
      text:
        "আপোনাৰ সংৰক্ষিত পৰিয়ালৰ প্ৰ'ফাইল বা স্মৃতিসমূহত এই তথ্য পোৱা নগ'ল। আপুনি কোনো চিনাকি ব্যক্তিৰ নাম, সম্পৰ্ক বা সংৰক্ষিত স্মৃতিৰ নাম সুধি চাব পাৰে।",

      source: null,
    };
  };

  /* =====================================================
     CREATE ANSWER
     ===================================================== */

  const createAnswer = (
    query: string
  ): AssistantResult => {
    if (
      language ===
      "Assamese"
    ) {
      return createAssameseAnswer(
        query
      );
    }

    return createEnglishAnswer(
      query
    );
  };

  /* =====================================================
     ASK
     ===================================================== */

  const handleAsk =
    async (
      directQuestion?: string
    ) => {
      const cleanQuestion =
        (
          directQuestion ??
          question
        ).trim();

      if (
        !cleanQuestion
      ) {
        return;
      }

      if (!patientId) {
        setAnswer(
          t.noPatient
        );

        setSource(
          null
        );

        return;
      }

      setQuestion(
        cleanQuestion
      );

      setThinking(
        true
      );

      setAnswer("");

      setSource(null);

      if (
        "speechSynthesis" in
        window
      ) {
        window.speechSynthesis.cancel();
      }

      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            250
          );
        }
      );

      const result =
        createAnswer(
          cleanQuestion
        );

      setAnswer(
        result.text
      );

      setSource(
        result.source
      );

      setThinking(
        false
      );

      speakText(
        result.text
      );
    };

  /* =====================================================
     VOICE INPUT
     ===================================================== */

  const handleVoiceText = (
    text: string
  ) => {
    setQuestion(
      text
    );

    setAnswer("");

    setSource(null);
  };

  /* =====================================================
     SUGGESTIONS
     ===================================================== */

  const suggestions =
    useMemo(() => {
      const items:
        string[] = [];

      const firstFamily =
        familyMembers.find(
          (member) =>
            member.name
        );

      const firstMemory =
        memories.find(
          (memory) =>
            memory.title
        );

      if (
        language ===
        "Assamese"
      ) {
        if (
          firstFamily?.name
        ) {
          items.push(
            `${firstFamily.name} কোন?`
          );
        }

        if (
          firstMemory?.title
        ) {
          items.push(
            `${firstMemory.title} স্মৃতিৰ বিষয়ে কওক`
          );
        }

        if (
          familyMembers.length >
          0
        ) {
          items.push(
            "মোৰ পৰিয়ালৰ সদস্যসকল কোন?"
          );
        }

        if (
          memories.length >
          0
        ) {
          items.push(
            "মোৰ স্মৃতিসমূহৰ বিষয়ে কওক"
          );
        }

        return items.slice(
          0,
          4
        );
      }

      if (
        firstFamily?.name
      ) {
        items.push(
          `Who is ${firstFamily.name}?`
        );
      }

      if (
        firstMemory?.title
      ) {
        items.push(
          `Tell me about ${firstMemory.title}`
        );
      }

      if (
        familyMembers.length >
        0
      ) {
        items.push(
          "Who are my family members?"
        );
      }

      if (
        memories.length >
        0
      ) {
        items.push(
          "Tell me about my memories"
        );
      }

      return items.slice(
        0,
        4
      );
    }, [
      familyMembers,
      memories,
      language,
    ]);

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main className="smriti-assistant-page">

      {/* HEADER */}

      <header className="smriti-assistant-header">

        <button
          type="button"
          className="smriti-assistant-brand"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <span className="smriti-assistant-logo">
            S
          </span>

          <span>
            <strong>
              SMRITI
            </strong>

            <small>
              Memory & daily wellbeing
            </small>
          </span>
        </button>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "12px",
          }}
        >

          {/* LANGUAGE SELECTOR */}

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "8px",
              border:
                "1px solid #d8ded7",
              borderRadius:
                "10px",
              padding:
                "8px 12px",
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
                  600,
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
            className="smriti-assistant-home"
            onClick={() =>
              navigate(
                "/home"
              )
            }
          >
            <Home
              size={19}
            />

            {t.home}
          </button>
        </div>
      </header>

      <div className="smriti-assistant-content">

        {/* INTRO */}

        <section className="smriti-assistant-intro">
          <button
            type="button"
            className="smriti-assistant-back"
            onClick={() =>
              navigate(
                "/home"
              )
            }
          >
            <ArrowLeft
              size={18}
            />

            {t.backHome}
          </button>

          <div className="smriti-assistant-title">
            <div className="smriti-assistant-main-icon">
              <MessageCircle
                size={34}
              />
            </div>

            <div>
              <span className="smriti-assistant-eyebrow">
                {
                  t.memoryCompanion
                }
              </span>

              <h1>
                {
                  t.talkToSmriti
                }
              </h1>

              <p>
                {t.intro}
              </p>
            </div>
          </div>
        </section>

        {/* MEMORY STATUS */}

        <section className="smriti-memory-status">

          <div className="smriti-status-item">
            <span className="smriti-status-icon">
              <UsersRound
                size={22}
              />
            </span>

            <div>
              <strong>
                {
                  familyCount
                }
              </strong>

              <span>
                {familyCount ===
                1
                  ? t.familyProfile
                  : t.familyProfiles}
              </span>
            </div>
          </div>

          <div className="smriti-status-item">
            <span className="smriti-status-icon">
              <ImageIcon
                size={22}
              />
            </span>

            <div>
              <strong>
                {
                  memoryCount
                }
              </strong>

              <span>
                {memoryCount ===
                1
                  ? t.savedMemory
                  : t.savedMemories}
              </span>
            </div>
          </div>

          <div className="smriti-connected-message">
            <Heart
              size={19}
            />

            <span>
              {
                t.connected
              }
            </span>
          </div>
        </section>

        {/* MAIN ASSISTANT */}

        <section className="smriti-conversation-card">

          <div className="smriti-companion-heading">
            <div className="smriti-companion-avatar">
              S
            </div>

            <div>
              <span>
                SMRITI COMPANION
              </span>

              <h2>
                {
                  t.whatRemember
                }
              </h2>
            </div>
          </div>

          <p className="smriti-companion-description">
            {
              t.companionDescription
            }
          </p>

          {loading ? (
            <div className="smriti-loading">
              <span className="smriti-loading-dot" />

              {
                t.loading
              }
            </div>
          ) : (
            <>
              {dataError && (
                <div className="smriti-error">
                  {
                    dataError
                  }
                </div>
              )}

              {!hasPersonalData &&
                !dataError && (
                  <div className="smriti-empty-data">
                    <Heart
                      size={24}
                    />

                    <div>
                      <strong>
                        {
                          t.collectionReady
                        }
                      </strong>

                      <span>
                        {
                          t.collectionReadyDescription
                        }
                      </span>
                    </div>
                  </div>
                )}

              {/* QUESTION */}

              <div className="smriti-question-area">

                <label
                  htmlFor="smriti-question"
                  className="smriti-question-label"
                >
                  {
                    t.askSmriti
                  }
                </label>

                <div className="smriti-question-box">

                  <Search
                    size={22}
                  />

                  <input
                    id="smriti-question"
                    type="text"
                    value={
                      question
                    }
                    placeholder={
                      t.placeholder
                    }
                    onChange={(
                      event
                    ) =>
                      setQuestion(
                        event.target.value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        void handleAsk();
                      }
                    }}
                  />

                  <button
                    type="button"
                    className="smriti-ask-button"
                    disabled={
                      thinking ||
                      !question.trim()
                    }
                    onClick={() =>
                      void handleAsk()
                    }
                  >
                    {thinking
                      ? t.searching
                      : t.ask}
                  </button>
                </div>

                {/* VOICE INPUT */}

                <div className="smriti-voice-row">

                  <div className="smriti-voice-icon">
                    <Mic
                      size={19}
                    />
                  </div>

                  <div>
                    <strong>
                      {
                        t.preferSpeak
                      }
                    </strong>

                    <span>
                      {
                        t.voiceDescription
                      }
                    </span>
                  </div>

                  <VoiceButton
                    onText={
                      handleVoiceText
                    }
                    languageCode={
                      languageOption.speechCode
                    }
                  />
                </div>
              </div>

              {/* SUGGESTIONS */}

              {suggestions.length >
                0 && (
                <div className="smriti-suggestions">
                  <span>
                    {
                      t.tryAsking
                    }
                  </span>

                  <div className="smriti-suggestion-list">
                    {suggestions.map(
                      (
                        suggestion
                      ) => (
                        <button
                          type="button"
                          key={
                            suggestion
                          }
                          onClick={() =>
                            void handleAsk(
                              suggestion
                            )
                          }
                        >
                          {
                            suggestion
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* THINKING */}

              {thinking && (
                <div className="smriti-thinking">
                  <Sparkles
                    size={21}
                  />

                  <span>
                    {
                      t.looking
                    }
                  </span>
                </div>
              )}

              {/* ANSWER */}

              {answer &&
                !thinking && (
                  <div className="smriti-answer">

                    <div className="smriti-answer-heading">
                      <div className="smriti-answer-avatar">
                        S
                      </div>

                      <div>
                        <span>
                          SMRITI
                        </span>

                        <strong>
                          {
                            t.fromCollection
                          }
                        </strong>
                      </div>
                    </div>

                    <p>
                      {
                        answer
                      }
                    </p>

                    {source && (
                      <div className="smriti-source-card">

                        {source.image ? (
                          <img
                            src={
                              source.image
                            }
                            alt={
                              source.title
                            }
                          />
                        ) : (
                          <div className="smriti-source-placeholder">
                            {source.type ===
                            "family" ? (
                              <UserRound
                                size={28}
                              />
                            ) : (
                              <ImageIcon
                                size={28}
                              />
                            )}
                          </div>
                        )}

                        <div>
                          <span>
                            {source.type ===
                            "family"
                              ? t.familyProfile
                              : t.savedMemory}
                          </span>

                          <strong>
                            {
                              source.title
                            }
                          </strong>

                          <small>
                            {
                              source.subtitle
                            }
                          </small>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="smriti-read-button"
                      onClick={() =>
                        speakText(
                          answer
                        )
                      }
                    >
                      <Volume2
                        size={20}
                      />

                      {
                        t.readAloud
                      }
                    </button>
                  </div>
                )}
            </>
          )}
        </section>

        {/* PRIVACY */}

        <section className="smriti-assistant-note">
          <Heart
            size={18}
          />

          <p>
            {
              t.privacyNote
            }
          </p>
        </section>
      </div>
    </main>
  );
}

export default MemoryAssistant;