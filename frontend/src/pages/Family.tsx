import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  Loader2,
  UserRound,
  UsersRound,
  Volume2,
} from "lucide-react";

import {
  getFamilyMembers,
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

import "./Family.css";

type FamilyMember = {
  id?: string;
  _id?: string;
  name: string;
  relation?: string;
  relationship?: string;
  age?: number;
  photo?: string;
};

type FamilyTranslations = {
  backHome: string;
  brandSubtitle: string;
  eyebrow: string;
  title: string;
  description: string;
  familiarPeople: string;
  familyMembers: string;
  loading: string;
  noFamilyTitle: string;
  noFamilyDescription: string;
  age: string;
  listen: string;
  privacyTitle: string;
  privacyDescription: string;
  noPatient: string;
  loadError: string;
  person: string;
  familyMember: string;
};

const ENGLISH_TEXT: FamilyTranslations = {
  backHome: "Back to home",
  brandSubtitle: "Memory & daily wellbeing",
  eyebrow: "MY MEMORIES",
  title: "My Family",
  description:
    "Revisit familiar people shared by your family and caregiver.",
  familiarPeople: "FAMILIAR PEOPLE",
  familyMembers: "Family members",
  loading: "Loading family members...",
  noFamilyTitle: "No family members yet",
  noFamilyDescription:
    "Family members added by your caregiver will appear here.",
  age: "Age",
  listen: "Listen",
  privacyTitle: "Your personal memories",
  privacyDescription:
    "These familiar people are part of your private memory support space.",
  noPatient:
    "Patient information was not found for this account. Please log in again.",
  loadError: "Unable to load family members.",
  person: "person",
  familyMember: "Family member",
};

const ASSAMESE_TEXT: FamilyTranslations = {
  backHome: "হোমলৈ উভতি যাওক",
  brandSubtitle: "স্মৃতি আৰু দৈনন্দিন সুস্থতা",
  eyebrow: "মোৰ স্মৃতিসমূহ",
  title: "মোৰ পৰিয়াল",
  description:
    "আপোনাৰ পৰিয়াল আৰু যত্ন লোৱা ব্যক্তিয়ে সংৰক্ষণ কৰা চিনাকি মানুহবোৰ পুনৰ চাওক।",
  familiarPeople: "চিনাকি মানুহ",
  familyMembers: "পৰিয়ালৰ সদস্য",
  loading: "পৰিয়ালৰ সদস্যসমূহ লোড হৈ আছে...",
  noFamilyTitle: "এতিয়াও কোনো পৰিয়ালৰ সদস্য নাই",
  noFamilyDescription:
    "আপোনাৰ যত্ন লোৱা ব্যক্তিয়ে যোগ কৰা পৰিয়ালৰ সদস্যসমূহ ইয়াত দেখা যাব।",
  age: "বয়স",
  listen: "শুনক",
  privacyTitle: "আপোনাৰ ব্যক্তিগত স্মৃতি",
  privacyDescription:
    "এই চিনাকি মানুহবোৰ আপোনাৰ ব্যক্তিগত স্মৃতি সহায়ক স্থানৰ অংশ।",
  noPatient:
    "এই একাউণ্টৰ বাবে ৰোগীৰ তথ্য পোৱা নগ'ল। অনুগ্ৰহ কৰি পুনৰ লগইন কৰক।",
  loadError:
    "পৰিয়ালৰ সদস্যসমূহ লোড কৰিব পৰা নগ'ল।",
  person: "ব্যক্তি",
  familyMember: "পৰিয়ালৰ সদস্য",
};

function Family() {
  const navigate = useNavigate();

  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [language, setLanguage] =
    useState<AppLanguage>(() => getStoredLanguage());

  const languageOption =
    getLanguageOption(language);

  const text =
    language === "Assamese"
      ? ASSAMESE_TEXT
      : ENGLISH_TEXT;

  const storedUser =
    localStorage.getItem("user");

  let user: any = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  const patientId = user?.patientId;

  useEffect(() => {
    let active = true;

    async function loadFamily() {
      if (!patientId) {
        if (active) {
          setLoading(false);
          setMessage(text.noPatient);
        }

        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const data =
          await getFamilyMembers(patientId);

        if (!active) {
          return;
        }

        setFamily(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load family members:",
          error
        );

        if (active) {
          setMessage(text.loadError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFamily();

    return () => {
      active = false;
    };
  }, [
    patientId,
    language,
    text.noPatient,
    text.loadError,
  ]);

  const getRelationship = (
    member: FamilyMember
  ) => {
    return (
      member.relationship ||
      member.relation ||
      text.familyMember
    );
  };

  const spokenFamilyText =
    useMemo(() => {
      if (family.length === 0) {
        return language === "Assamese"
          ? "এতিয়াও কোনো পৰিয়ালৰ সদস্য সংৰক্ষণ কৰা হোৱা নাই।"
          : "There are no family members saved yet.";
      }

      if (language === "Assamese") {
        const names = family
          .map((member) => member.name)
          .join(", ");

        return `আপোনাৰ পৰিয়ালৰ স্মৃতিত ${family.length} জন চিনাকি ব্যক্তি আছে। তেওঁলোক হ'ল ${names}।`;
      }

      const descriptions =
        family.map((member) => {
          const relation =
            getRelationship(member);

          if (
            member.age !== undefined &&
            member.age !== null
          ) {
            return `${member.name}, your ${relation}, age ${member.age}`;
          }

          return `${member.name}, your ${relation}`;
        });

      return `You have ${family.length} familiar ${
        family.length === 1
          ? "person"
          : "people"
      } in your family memories. ${descriptions.join(
        ". "
      )}.`;
    }, [
      family,
      language,
      text.familyMember,
    ]);

  const speakFamily = () => {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        spokenFamilyText
      );

    speech.lang =
      languageOption.speechCode;

    speech.rate = 0.84;
    speech.pitch = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const exactVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() ===
          languageOption.speechCode.toLowerCase()
      );

    const baseLanguage =
      languageOption.speechCode
        .split("-")[0]
        .toLowerCase();

    const baseVoice =
      voices.find(
        (voice) =>
          voice.lang
            .toLowerCase()
            .startsWith(baseLanguage)
      );

    if (
      exactVoice ||
      baseVoice
    ) {
      speech.voice =
        exactVoice ||
        baseVoice ||
        null;
    }

    window.speechSynthesis.speak(
      speech
    );
  };

  const handleLanguageChange = (
    value: string
  ) => {
    const nextLanguage =
      value as AppLanguage;

    window.speechSynthesis?.cancel();

    setLanguage(nextLanguage);
    saveLanguage(nextLanguage);
    setMessage("");
  };

  return (
    <main className="family-page">
      <header className="family-header">
        <button
          className="family-back"
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >
          <ArrowLeft size={20} />

          <span>
            {text.backHome}
          </span>
        </button>

        <button
          type="button"
          className="family-brand"
          onClick={() =>
            navigate("/home")
          }
          aria-label="Go to home"
        >
          <span className="family-brand-mark">
            S
          </span>

          <span>
            SMRITI
          </span>
        </button>

        <select
          value={language}
          onChange={(event) =>
            handleLanguageChange(
              event.target.value
            )
          }
          aria-label="Select language"
          style={{
            minHeight: "44px",
            padding: "0 14px",
            border:
              "1px solid #d8d8d0",
            borderRadius: "10px",
            background: "#ffffff",
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
      </header>

      <div className="family-content">
        <section className="family-intro">
          <div>
            <p className="family-eyebrow">
              {text.eyebrow}
            </p>

            <h1>
              {text.title}
            </h1>

            <p>
              {text.description}
            </p>

            <button
              type="button"
              onClick={speakFamily}
              style={{
                marginTop: "18px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                minHeight: "44px",
                padding: "0 16px",
                border:
                  "1px solid #d9dfda",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#174c3c",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Volume2 size={19} />
              {text.listen}
            </button>
          </div>

          <div className="family-intro-icon">
            <UsersRound size={30} />
          </div>
        </section>

        {message && (
          <div className="family-warning">
            {message}
          </div>
        )}

        <section className="family-members-section">
          <div className="family-list-heading">
            <div>
              <p className="family-eyebrow">
                {text.familiarPeople}
              </p>

              <h2>
                {text.familyMembers}
              </h2>
            </div>

            <span className="family-count">
              {family.length}
            </span>
          </div>

          {loading ? (
            <div className="family-empty">
              <Loader2
                size={28}
                className="family-spinner"
              />

              <p>
                {text.loading}
              </p>
            </div>
          ) : family.length > 0 ? (
            <div className="family-grid">
              {family.map(
                (member, index) => {
                  const relation =
                    getRelationship(
                      member
                    );

                  const memberKey =
                    member._id ||
                    member.id ||
                    `${member.name}-${index}`;

                  return (
                    <article
                      className="family-member-card"
                      key={memberKey}
                    >
                      <div className="family-member-photo">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                          />
                        ) : (
                          <div className="family-photo-fallback">
                            <UserRound
                              size={42}
                            />
                          </div>
                        )}
                      </div>

                      <div className="family-member-info">
                        <h3>
                          {member.name}
                        </h3>

                        <p className="family-relation">
                          {relation}
                        </p>

                        {member.age !==
                          undefined &&
                          member.age !==
                            null && (
                            <p className="family-age">
                              {text.age}{" "}
                              {member.age}
                            </p>
                          )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="family-empty">
              <UsersRound size={34} />

              <h3>
                {text.noFamilyTitle}
              </h3>

              <p>
                {
                  text.noFamilyDescription
                }
              </p>
            </div>
          )}
        </section>

        <div className="family-privacy-note">
          <Heart size={20} />

          <div>
            <strong>
              {text.privacyTitle}
            </strong>

            <span>
              {
                text.privacyDescription
              }
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Family;