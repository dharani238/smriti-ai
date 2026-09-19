import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Loader2,
  Volume2,
  X,
} from "lucide-react";

import {
  getMemories,
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

type Memory = {
  id: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
  createdAt?: string;
};

const translations = {
  English: {
    backHome: "Back to home",
    eyebrow: "PERSONAL MEMORIES",
    title: "My Memories",
    description:
      "Revisit meaningful moments shared by your family and caregiver.",

    memoryVault: "MEMORY VAULT",
    savedMemories: "Saved memories",

    memories: "memories",
    memory: "memory",

    loading: "Loading your memories...",

    noMemories: "No memories yet",

    noMemoriesDescription:
      "Memories added by your caregiver will appear here.",

    openMemory: "View memory",

    listen: "Listen",

    close: "Close",

    category: "Category",

    rememberedMoment: "A familiar memory",

    privacyTitle: "Your personal memory space",

    privacyDescription:
      "These memories have been shared to support familiar and meaningful recall.",

    patientMissing:
      "Patient information was not found. Please log in again.",

    loadError:
      "Unable to load your memories right now.",

    speechIntro: "Here is a memory called",

    speechCategory: "This memory is in the category",

    unknownDate: "",
  },

  Assamese: {
    backHome: "হোমলৈ উভতি যাওক",

    eyebrow: "ব্যক্তিগত স্মৃতি",

    title: "মোৰ স্মৃতিসমূহ",

    description:
      "আপোনাৰ পৰিয়াল আৰু যত্ন লোৱা ব্যক্তিয়ে সংৰক্ষণ কৰা অৰ্থপূৰ্ণ মুহূৰ্তসমূহ পুনৰ চাওক।",

    memoryVault: "স্মৃতি ভঁৰাল",

    savedMemories: "সংৰক্ষিত স্মৃতিসমূহ",

    memories: "টা স্মৃতি",

    memory: "টা স্মৃতি",

    loading: "আপোনাৰ স্মৃতিসমূহ লোড হৈ আছে...",

    noMemories: "এতিয়াও কোনো স্মৃতি নাই",

    noMemoriesDescription:
      "আপোনাৰ যত্ন লোৱা ব্যক্তিয়ে যোগ কৰা স্মৃতিসমূহ ইয়াত দেখা যাব।",

    openMemory: "স্মৃতি চাওক",

    listen: "শুনক",

    close: "বন্ধ কৰক",

    category: "শ্ৰেণী",

    rememberedMoment: "এটা চিনাকি স্মৃতি",

    privacyTitle: "আপোনাৰ ব্যক্তিগত স্মৃতিৰ স্থান",

    privacyDescription:
      "এই স্মৃতিসমূহ চিনাকি আৰু অৰ্থপূৰ্ণ কথা মনত পেলোৱাত সহায় কৰিবলৈ সংৰক্ষণ কৰা হৈছে।",

    patientMissing:
      "ৰোগীৰ তথ্য পোৱা নগ'ল। অনুগ্ৰহ কৰি পুনৰ লগইন কৰক।",

    loadError:
      "এই মুহূৰ্তত আপোনাৰ স্মৃতিসমূহ লোড কৰিব পৰা নগ'ল।",

    speechIntro: "এই স্মৃতিটোৰ নাম",

    speechCategory: "এই স্মৃতিটোৰ শ্ৰেণী",

    unknownDate: "",
  },
};

function Memories() {
  const navigate =
    useNavigate();

  const [
    memories,
    setMemories,
  ] = useState<Memory[]>([]);

  const [
    selectedMemory,
    setSelectedMemory,
  ] = useState<Memory | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    language,
    setLanguage,
  ] = useState<AppLanguage>(
    () =>
      getStoredLanguage()
  );

  const text =
    language === "Assamese"
      ? translations.Assamese
      : translations.English;

  const languageOption =
    getLanguageOption(
      language
    );

  let user: any = null;

  try {
    const storedUser =
      localStorage.getItem(
        "user"
      );

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
     LOAD MEMORIES
     ===================================================== */

  useEffect(() => {
    let active = true;

    async function loadMemories() {
      if (!patientId) {
        if (active) {
          setLoading(false);

          setMessage(
            language ===
              "Assamese"
              ? translations.Assamese
                  .patientMissing
              : translations.English
                  .patientMissing
          );
        }

        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const data =
          await getMemories(
            patientId
          );

        if (!active) {
          return;
        }

        setMemories(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load memories:",
          error
        );

        if (active) {
          setMessage(
            language ===
              "Assamese"
              ? translations.Assamese
                  .loadError
              : translations.English
                  .loadError
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMemories();

    return () => {
      active = false;
    };
  }, [
    patientId,
    language,
  ]);

  /* =====================================================
     LANGUAGE
     ===================================================== */

  function handleLanguageChange(
    value: string
  ) {
    const nextLanguage =
      value as AppLanguage;

    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }

    setLanguage(
      nextLanguage
    );

    saveLanguage(
      nextLanguage
    );

    setMessage("");
  }

  /* =====================================================
     DATE
     ===================================================== */

  function formatDate(
    dateValue?: string
  ) {
    if (!dateValue) {
      return "";
    }

    const date =
      new Date(
        dateValue
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(
        language ===
          "Assamese"
          ? "as-IN"
          : "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      ).format(
        date
      );
    } catch {
      return "";
    }
  }

  /* =====================================================
     SPEECH
     ===================================================== */

  function speakMemory(
    memory: Memory
  ) {
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
      language ===
      "Assamese"
    ) {
      speechText =
        `${text.speechIntro} ${memory.title}. ` +
        `${memory.description}. ` +
        `${text.speechCategory} ${memory.category}.`;
    } else {
      speechText =
        `${text.speechIntro} ${memory.title}. ` +
        `${memory.description}. ` +
        `${text.speechCategory} ${memory.category}.`;
    }

    const speech =
      new SpeechSynthesisUtterance(
        speechText
      );

    speech.lang =
      languageOption.speechCode;

    speech.rate = 0.84;
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

    if (matchingVoice) {
      speech.voice =
        matchingVoice;
    }

    window.speechSynthesis.speak(
      speech
    );
  }

  function closeMemory() {
    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }

    setSelectedMemory(
      null
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f7f6f0",
        color:
          "#173d32",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          minHeight:
            "72px",
          padding:
            "0 6%",
          display:
            "flex",
          alignItems:
            "center",
          gap:
            "18px",
          background:
            "#ffffff",
          borderBottom:
            "1px solid #e2e4de",
        }}
      >
        <button
          type="button"
          onClick={() =>
            navigate(
              "/home"
            )
          }
          style={{
            display:
              "inline-flex",
            alignItems:
              "center",
            gap:
              "8px",
            border:
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
          <ArrowLeft
            size={20}
          />

          {
            text.backHome
          }
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/home"
            )
          }
          style={{
            marginLeft:
              "auto",
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "10px",
            border:
              "none",
            background:
              "transparent",
            color:
              "#174c3c",
            cursor:
              "pointer",
          }}
        >
          <span
            style={{
              width:
                "38px",
              height:
                "38px",
              display:
                "grid",
              placeItems:
                "center",
              borderRadius:
                "10px",
              background:
                "#e8c968",
              color:
                "#173d32",
              fontWeight:
                900,
              fontSize:
                "20px",
            }}
          >
            S
          </span>

          <strong
            style={{
              fontSize:
                "20px",
              letterSpacing:
                "0.03em",
            }}
          >
            SMRITI
          </strong>
        </button>

        <select
          value={
            language
          }
          onChange={(
            event
          ) =>
            handleLanguageChange(
              event.target.value
            )
          }
          aria-label="Select language"
          style={{
            minHeight:
              "42px",
            padding:
              "0 12px",
            border:
              "1px solid #d8ddd9",
            borderRadius:
              "10px",
            background:
              "#ffffff",
            color:
              "#174c3c",
            fontWeight:
              700,
            cursor:
              "pointer",
          }}
        >
          {SUPPORTED_LANGUAGES.map(
            (option) => (
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
      </header>

      <div
        style={{
          width:
            "min(1160px, 90%)",
          margin:
            "0 auto",
          padding:
            "48px 0 70px",
        }}
      >
        {/* INTRO */}

        <section
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap:
              "24px",
            marginBottom:
              "34px",
          }}
        >
          <div>
            <p
              style={{
                margin:
                  "0 0 8px",
                color:
                  "#98751e",
                fontSize:
                  "13px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.12em",
              }}
            >
              {
                text.eyebrow
              }
            </p>

            <h1
              style={{
                margin:
                  "0 0 12px",
                color:
                  "#173d32",
                fontSize:
                  "clamp(34px, 5vw, 50px)",
                lineHeight:
                  1.1,
              }}
            >
              {
                text.title
              }
            </h1>

            <p
              style={{
                maxWidth:
                  "680px",
                margin:
                  0,
                color:
                  "#65716b",
                fontSize:
                  "17px",
                lineHeight:
                  1.7,
              }}
            >
              {
                text.description
              }
            </p>
          </div>

          <div
            style={{
              width:
                "66px",
              height:
                "66px",
              flexShrink:
                0,
              display:
                "grid",
              placeItems:
                "center",
              borderRadius:
                "18px",
              background:
                "#e8efe9",
              color:
                "#174c3c",
            }}
          >
            <BookOpen
              size={31}
            />
          </div>
        </section>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              marginBottom:
                "24px",
              padding:
                "15px 18px",
              border:
                "1px solid #e5d7b6",
              borderRadius:
                "12px",
              background:
                "#fff9eb",
              color:
                "#745b22",
              lineHeight:
                1.6,
            }}
          >
            {message}
          </div>
        )}

        {/* MEMORY SECTION */}

        <section
          style={{
            padding:
              "28px",
            background:
              "#ffffff",
            border:
              "1px solid #e1e4df",
            borderRadius:
              "18px",
            boxShadow:
              "0 8px 30px rgba(27, 59, 48, 0.05)",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap:
                "20px",
              marginBottom:
                "25px",
            }}
          >
            <div>
              <p
                style={{
                  margin:
                    "0 0 5px",
                  color:
                    "#98751e",
                  fontSize:
                    "12px",
                  fontWeight:
                    800,
                  letterSpacing:
                    "0.1em",
                }}
              >
                {
                  text.memoryVault
                }
              </p>

              <h2
                style={{
                  margin:
                    0,
                  color:
                    "#173d32",
                }}
              >
                {
                  text.savedMemories
                }
              </h2>
            </div>

            <span
              style={{
                minWidth:
                  "42px",
                height:
                  "42px",
                padding:
                  "0 12px",
                display:
                  "grid",
                placeItems:
                  "center",
                borderRadius:
                  "999px",
                background:
                  "#eef3ef",
                color:
                  "#174c3c",
                fontWeight:
                  800,
              }}
            >
              {
                memories.length
              }
            </span>
          </div>

          {/* LOADING */}

          {loading ? (
            <div
              style={{
                minHeight:
                  "250px",
                display:
                  "grid",
                placeItems:
                  "center",
                textAlign:
                  "center",
                color:
                  "#65716b",
              }}
            >
              <div>
                <Loader2
                  size={32}
                />

                <p>
                  {
                    text.loading
                  }
                </p>
              </div>
            </div>
          ) : memories.length ===
            0 ? (
            /* EMPTY */

            <div
              style={{
                minHeight:
                  "250px",
                display:
                  "grid",
                placeItems:
                  "center",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  maxWidth:
                    "480px",
                }}
              >
                <ImageIcon
                  size={40}
                  style={{
                    marginBottom:
                      "12px",
                  }}
                />

                <h3
                  style={{
                    margin:
                      "0 0 8px",
                  }}
                >
                  {
                    text.noMemories
                  }
                </h3>

                <p
                  style={{
                    margin:
                      0,
                    color:
                      "#65716b",
                    lineHeight:
                      1.6,
                  }}
                >
                  {
                    text.noMemoriesDescription
                  }
                </p>
              </div>
            </div>
          ) : (
            /* MEMORY GRID */

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap:
                  "20px",
              }}
            >
              {memories.map(
                (
                  memory
                ) => (
                  <article
                    key={
                      memory.id
                    }
                    style={{
                      overflow:
                        "hidden",
                      border:
                        "1px solid #e0e4df",
                      borderRadius:
                        "16px",
                      background:
                        "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        height:
                          "210px",
                        background:
                          "#edf1ed",
                      }}
                    >
                      {memory.photo ? (
                        <img
                          src={
                            memory.photo
                          }
                          alt={
                            memory.title
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                            display:
                              "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            display:
                              "grid",
                            placeItems:
                              "center",
                            color:
                              "#668076",
                          }}
                        >
                          <ImageIcon
                            size={
                              42
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding:
                          "19px",
                      }}
                    >
                      <span
                        style={{
                          display:
                            "inline-block",
                          marginBottom:
                            "9px",
                          padding:
                            "5px 9px",
                          borderRadius:
                            "999px",
                          background:
                            "#f6f0dd",
                          color:
                            "#7b611e",
                          fontSize:
                            "12px",
                          fontWeight:
                            800,
                        }}
                      >
                        {
                          memory.category
                        }
                      </span>

                      <h3
                        style={{
                          margin:
                            "0 0 8px",
                          color:
                            "#173d32",
                          fontSize:
                            "21px",
                        }}
                      >
                        {
                          memory.title
                        }
                      </h3>

                      <p
                        style={{
                          margin:
                            "0 0 15px",
                          color:
                            "#65716b",
                          lineHeight:
                            1.6,
                          display:
                            "-webkit-box",
                          WebkitLineClamp:
                            3,
                          WebkitBoxOrient:
                            "vertical",
                          overflow:
                            "hidden",
                        }}
                      >
                        {
                          memory.description
                        }
                      </p>

                      {formatDate(
                        memory.createdAt
                      ) && (
                        <div
                          style={{
                            marginBottom:
                              "15px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "6px",
                            color:
                              "#7a847f",
                            fontSize:
                              "13px",
                          }}
                        >
                          <CalendarDays
                            size={
                              15
                            }
                          />

                          {
                            formatDate(
                              memory.createdAt
                            )
                          }
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMemory(
                            memory
                          )
                        }
                        style={{
                          width:
                            "100%",
                          minHeight:
                            "44px",
                          padding:
                            "0 14px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap:
                            "10px",
                          border:
                            "1px solid #174c3c",
                          borderRadius:
                            "10px",
                          background:
                            "#174c3c",
                          color:
                            "#ffffff",
                          fontWeight:
                            750,
                          cursor:
                            "pointer",
                        }}
                      >
                        <span>
                          {
                            text.openMemory
                          }
                        </span>

                        <ChevronRight
                          size={18}
                        />
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        {/* PRIVACY NOTE */}

        <section
          style={{
            marginTop:
              "24px",
            padding:
              "18px 20px",
            display:
              "flex",
            alignItems:
              "flex-start",
            gap:
              "12px",
            border:
              "1px solid #dce4dd",
            borderRadius:
              "14px",
            background:
              "#ffffff",
          }}
        >
          <Heart
            size={21}
          />

          <div>
            <strong
              style={{
                display:
                  "block",
                marginBottom:
                  "4px",
              }}
            >
              {
                text.privacyTitle
              }
            </strong>

            <span
              style={{
                color:
                  "#65716b",
                lineHeight:
                  1.6,
              }}
            >
              {
                text.privacyDescription
              }
            </span>
          </div>
        </section>
      </div>

      {/* MEMORY DETAIL */}

      {selectedMemory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedMemory.title
          }
          onClick={
            closeMemory
          }
          style={{
            position:
              "fixed",
            inset:
              0,
            zIndex:
              1000,
            padding:
              "30px 18px",
            display:
              "grid",
            placeItems:
              "center",
            background:
              "rgba(12, 31, 25, 0.68)",
            overflowY:
              "auto",
          }}
        >
          <article
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
            style={{
              position:
                "relative",
              width:
                "min(720px, 100%)",
              overflow:
                "hidden",
              borderRadius:
                "20px",
              background:
                "#ffffff",
              boxShadow:
                "0 24px 70px rgba(0, 0, 0, 0.24)",
            }}
          >
            <button
              type="button"
              onClick={
                closeMemory
              }
              aria-label={
                text.close
              }
              style={{
                position:
                  "absolute",
                top:
                  "14px",
                right:
                  "14px",
                zIndex:
                  2,
                width:
                  "42px",
                height:
                  "42px",
                display:
                  "grid",
                placeItems:
                  "center",
                border:
                  "none",
                borderRadius:
                  "999px",
                background:
                  "rgba(255,255,255,0.94)",
                color:
                  "#173d32",
                cursor:
                  "pointer",
              }}
            >
              <X
                size={22}
              />
            </button>

            {selectedMemory.photo ? (
              <img
                src={
                  selectedMemory.photo
                }
                alt={
                  selectedMemory.title
                }
                style={{
                  width:
                    "100%",
                  maxHeight:
                    "390px",
                  objectFit:
                    "cover",
                  display:
                    "block",
                }}
              />
            ) : (
              <div
                style={{
                  height:
                    "250px",
                  display:
                    "grid",
                  placeItems:
                    "center",
                  background:
                    "#edf1ed",
                  color:
                    "#668076",
                }}
              >
                <ImageIcon
                  size={54}
                />
              </div>
            )}

            <div
              style={{
                padding:
                  "28px",
              }}
            >
              <p
                style={{
                  margin:
                    "0 0 7px",
                  color:
                    "#98751e",
                  fontSize:
                    "12px",
                  fontWeight:
                    800,
                  letterSpacing:
                    "0.1em",
                }}
              >
                {
                  text.rememberedMoment
                }
              </p>

              <h2
                style={{
                  margin:
                    "0 0 12px",
                  color:
                    "#173d32",
                  fontSize:
                    "30px",
                }}
              >
                {
                  selectedMemory.title
                }
              </h2>

              <span
                style={{
                  display:
                    "inline-block",
                  marginBottom:
                    "17px",
                  padding:
                    "6px 10px",
                  borderRadius:
                    "999px",
                  background:
                    "#f6f0dd",
                  color:
                    "#7b611e",
                  fontSize:
                    "13px",
                  fontWeight:
                    750,
                }}
              >
                {text.category}:{" "}
                {
                  selectedMemory.category
                }
              </span>

              <p
                style={{
                  margin:
                    "0 0 24px",
                  color:
                    "#56655e",
                  fontSize:
                    "18px",
                  lineHeight:
                    1.75,
                }}
              >
                {
                  selectedMemory.description
                }
              </p>

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                  flexWrap:
                    "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    speakMemory(
                      selectedMemory
                    )
                  }
                  style={{
                    minHeight:
                      "46px",
                    padding:
                      "0 17px",
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap:
                      "8px",
                    border:
                      "1px solid #174c3c",
                    borderRadius:
                      "10px",
                    background:
                      "#174c3c",
                    color:
                      "#ffffff",
                    fontWeight:
                      750,
                    cursor:
                      "pointer",
                  }}
                >
                  <Volume2
                    size={19}
                  />

                  {
                    text.listen
                  }
                </button>

                <button
                  type="button"
                  onClick={
                    closeMemory
                  }
                  style={{
                    minHeight:
                      "46px",
                    padding:
                      "0 17px",
                    border:
                      "1px solid #d8ddd9",
                    borderRadius:
                      "10px",
                    background:
                      "#ffffff",
                    color:
                      "#174c3c",
                    fontWeight:
                      750,
                    cursor:
                      "pointer",
                  }}
                >
                  {
                    text.close
                  }
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

export default Memories;