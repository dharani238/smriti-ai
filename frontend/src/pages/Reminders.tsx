import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  TimerReset,
} from "lucide-react";

import {
  completeReminder,
  getReminders,
  snoozeReminder,
} from "../services/api";

import {
  getStoredLanguage,
} from "../i18n/languages";

import type {
  AppLanguage,
} from "../i18n/languages";

import "./Reminders.css";

/* =========================================================
   TYPES
   ========================================================= */

type ReminderStatus =
  | "pending"
  | "completed"
  | "snoozed";

type Reminder = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  status?: ReminderStatus;
  completedAt?: string;
  snoozedUntil?: string;
};

type ReminderText = {
  backHome: string;

  eyebrow: string;
  title: string;
  description: string;

  routineTitle: string;
  routineDescription: string;

  loading: string;

  emptyTitle: string;
  emptyDescription: string;

  today: string;

  completed: string;
  snoozed: string;
  pending: string;

  done: string;
  snooze: string;
  updating: string;

  caregiverNoteTitle: string;
  caregiverNote: string;

  completedMessage: string;

  loadError: string;
  updateError: string;
  patientMissing: string;

  refreshLabel: string;
};

/* =========================================================
   ENGLISH
   ========================================================= */

const ENGLISH_TEXT: ReminderText = {
  backHome:
    "Back to home",

  eyebrow:
    "MY DAILY ROUTINE",

  title:
    "My Routine",

  description:
    "A calm place to follow the important activities your caregiver has planned for your day.",

  routineTitle:
    "Your reminders",

  routineDescription:
    "Take your time. Complete each activity when you are ready.",

  loading:
    "Loading your reminders...",

  emptyTitle:
    "Your routine is clear",

  emptyDescription:
    "There are no reminders scheduled right now. New activities created by your caregiver will appear here.",

  today:
    "Today",

  completed:
    "Completed",

  snoozed:
    "Snoozed",

  pending:
    "Pending",

  done:
    "Mark as done",

  snooze:
    "Snooze",

  updating:
    "Updating...",

  caregiverNoteTitle:
    "Caregiver-supported routine",

  caregiverNote:
    "Your caregiver manages your routine. You can mark an activity as done when you finish it, or snooze it when you need more time.",

  completedMessage:
    "This activity has been completed.",

  loadError:
    "Unable to load your reminders.",

  updateError:
    "Unable to update the reminder. Please try again.",

  patientMissing:
    "Patient information was not found. Please log in again.",

  refreshLabel:
    "Refresh reminders",
};

/* =========================================================
   ASSAMESE
   ========================================================= */

const ASSAMESE_TEXT: ReminderText = {
  backHome:
    "হোমলৈ উভতি যাওক",

  eyebrow:
    "মোৰ দৈনন্দিন ৰুটিন",

  title:
    "মোৰ ৰুটিন",

  description:
    "আপোনাৰ যত্ন লোৱা ব্যক্তিয়ে আপোনাৰ দিনটোৰ বাবে ঠিক কৰা গুৰুত্বপূৰ্ণ কামসমূহ সহজে অনুসৰণ কৰক।",

  routineTitle:
    "আপোনাৰ সোঁৱৰণীসমূহ",

  routineDescription:
    "লাহে লাহে কৰক। সাজু হ'লে প্ৰতিটো কাম সম্পূৰ্ণ কৰক।",

  loading:
    "আপোনাৰ সোঁৱৰণীসমূহ লোড হৈ আছে...",

  emptyTitle:
    "এতিয়া কোনো কাম বাকী নাই",

  emptyDescription:
    "এতিয়া কোনো সোঁৱৰণী নিৰ্ধাৰিত নাই। আপোনাৰ যত্ন লোৱা ব্যক্তিয়ে নতুন কাম যোগ কৰিলে ইয়াত দেখা যাব।",

  today:
    "আজি",

  completed:
    "সম্পূৰ্ণ",

  snoozed:
    "পিছলৈ ৰখা",

  pending:
    "বাকী আছে",

  done:
    "সম্পূৰ্ণ বুলি চিহ্নিত কৰক",

  snooze:
    "পিছলৈ ৰাখক",

  updating:
    "আপডেট হৈ আছে...",

  caregiverNoteTitle:
    "যত্ন লোৱা ব্যক্তিৰ সহায়ত ৰুটিন",

  caregiverNote:
    "আপোনাৰ যত্ন লোৱা ব্যক্তিয়ে ৰুটিন পৰিচালনা কৰে। কাম শেষ হ'লে সম্পূৰ্ণ বুলি চিহ্নিত কৰিব পাৰে অথবা অধিক সময়ৰ প্ৰয়োজন হ'লে পিছলৈ ৰাখিব পাৰে।",

  completedMessage:
    "এই কামটো সম্পূৰ্ণ কৰা হৈছে।",

  loadError:
    "আপোনাৰ সোঁৱৰণীসমূহ লোড কৰিব পৰা নগ'ল।",

  updateError:
    "সোঁৱৰণীটো আপডেট কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",

  patientMissing:
    "ৰোগীৰ তথ্য পোৱা নগ'ল। অনুগ্ৰহ কৰি পুনৰ লগইন কৰক।",

  refreshLabel:
    "সোঁৱৰণীসমূহ পুনৰ লোড কৰক",
};

/* =========================================================
   COMPONENT
   ========================================================= */

function Reminders() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
     ======================================================= */

  const [
    reminders,
    setReminders,
  ] = useState<Reminder[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    language,
  ] = useState<AppLanguage>(
    () =>
      getStoredLanguage()
  );

  const text =
    language === "Assamese"
      ? ASSAMESE_TEXT
      : ENGLISH_TEXT;

  /* =======================================================
     USER
     ======================================================= */

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

  /* =======================================================
     LOAD REMINDERS
     ======================================================= */

  async function loadReminders() {
    if (!patientId) {
      setLoading(false);

      setMessage(
        text.patientMissing
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data =
        await getReminders(
          patientId
        );

      setReminders(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load reminders:",
        error
      );

      setMessage(
        text.loadError
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReminders();
  }, [
    patientId,
    language,
  ]);

  /* =======================================================
     COMPLETE REMINDER
     ======================================================= */

  async function handleComplete(
    reminderId: string
  ) {
    try {
      setUpdatingId(
        reminderId
      );

      setMessage("");

      const data =
        await completeReminder(
          reminderId
        );

      if (
        data &&
        data.success === false
      ) {
        setMessage(
          data.message ||
            text.updateError
        );

        return;
      }

      await loadReminders();
    } catch (error) {
      console.error(
        "Failed to complete reminder:",
        error
      );

      setMessage(
        text.updateError
      );
    } finally {
      setUpdatingId(
        null
      );
    }
  }

  /* =======================================================
     SNOOZE REMINDER
     ======================================================= */

  async function handleSnooze(
    reminderId: string
  ) {
    try {
      setUpdatingId(
        reminderId
      );

      setMessage("");

      const data =
        await snoozeReminder(
          reminderId
        );

      if (
        data &&
        data.success === false
      ) {
        setMessage(
          data.message ||
            text.updateError
        );

        return;
      }

      await loadReminders();
    } catch (error) {
      console.error(
        "Failed to snooze reminder:",
        error
      );

      setMessage(
        text.updateError
      );
    } finally {
      setUpdatingId(
        null
      );
    }
  }

  /* =======================================================
     DATE HELPERS
     ======================================================= */

  function getTodayDate() {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  }

  function getDateLabel(
    reminderDate: string
  ) {
    if (
      reminderDate ===
      getTodayDate()
    ) {
      return text.today;
    }

    const parsedDate =
      new Date(
        `${reminderDate}T00:00:00`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return reminderDate;
    }

    try {
      return new Intl.DateTimeFormat(
        language === "Assamese"
          ? "as-IN"
          : "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      ).format(
        parsedDate
      );
    } catch {
      return reminderDate;
    }
  }

  function formatReminderTime(
    reminderTime: string
  ) {
    if (!reminderTime) {
      return "";
    }

    const parts =
      reminderTime.split(
        ":"
      );

    if (
      parts.length < 2
    ) {
      return reminderTime;
    }

    const hours =
      Number(
        parts[0]
      );

    const minutes =
      Number(
        parts[1]
      );

    if (
      Number.isNaN(
        hours
      ) ||
      Number.isNaN(
        minutes
      )
    ) {
      return reminderTime;
    }

    const date =
      new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    try {
      return new Intl.DateTimeFormat(
        language === "Assamese"
          ? "as-IN"
          : "en-IN",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      ).format(
        date
      );
    } catch {
      return reminderTime;
    }
  }

  /* =======================================================
     STATUS HELPERS
     ======================================================= */

  function getStatusLabel(
    status?: ReminderStatus
  ) {
    if (
      status === "completed"
    ) {
      return text.completed;
    }

    if (
      status === "snoozed"
    ) {
      return text.snoozed;
    }

    return text.pending;
  }

  function getStatusClass(
    status?: ReminderStatus
  ) {
    if (
      status === "completed"
    ) {
      return "completed";
    }

    if (
      status === "snoozed"
    ) {
      return "snoozed";
    }

    return "pending";
  }

  /* =======================================================
     SORT REMINDERS
     ======================================================= */

  const sortedReminders =
    [...reminders].sort(
      (first, second) => {
        /*
         * Keep active reminders first.
         * Completed reminders naturally
         * move lower in the list.
         */

        if (
          first.status ===
            "completed" &&
          second.status !==
            "completed"
        ) {
          return 1;
        }

        if (
          first.status !==
            "completed" &&
          second.status ===
            "completed"
        ) {
          return -1;
        }

        const firstDate =
          `${first.date}T${
            first.time ||
            "00:00"
          }`;

        const secondDate =
          `${second.date}T${
            second.time ||
            "00:00"
          }`;

        return (
          new Date(
            firstDate
          ).getTime() -
          new Date(
            secondDate
          ).getTime()
        );
      }
    );

  /* =======================================================
     UI
     ======================================================= */

  return (
    <main className="reminders-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="reminders-header">

        <button
          type="button"
          className="reminders-back"
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
            {text.backHome}
          </span>
        </button>

        <button
          type="button"
          className="reminders-brand"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <span className="reminders-logo">
            S
          </span>

          <strong>
            SMRITI
          </strong>
        </button>

      </header>

      {/* ===================================================
          MAIN CONTENT
          =================================================== */}

      <div className="reminders-container">

        {/* =================================================
            HERO
            ================================================= */}

        <section className="reminders-hero">

          <div className="reminders-hero-copy">

            <p className="reminders-eyebrow">
              {text.eyebrow}
            </p>

            <h1>
              {text.title}
            </h1>

            <p className="reminders-hero-description">
              {text.description}
            </p>

          </div>

          <div className="reminders-hero-visual">

            <div className="reminders-hero-icon">
              <CalendarDays
                size={52}
                strokeWidth={1.8}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            CAREGIVER NOTE
            ================================================= */}

        <section className="reminders-caregiver-note">

          <div className="reminders-caregiver-icon">
            <CheckCircle2
              size={22}
            />
          </div>

          <div>

            <strong>
              {
                text.caregiverNoteTitle
              }
            </strong>

            <p>
              {
                text.caregiverNote
              }
            </p>

          </div>

        </section>

        {/* =================================================
            ERROR / INFORMATION MESSAGE
            ================================================= */}

        {message && (
          <div
            className="reminders-message"
            role="status"
          >
            {message}
          </div>
        )}

        {/* =================================================
            ROUTINE PANEL
            ================================================= */}

        <section className="reminders-panel">

          <div className="reminders-panel-header">

            <div className="reminders-panel-heading">

              <div className="reminders-panel-icon">
                <Bell
                  size={23}
                />
              </div>

              <div>

                <h2>
                  {
                    text.routineTitle
                  }
                </h2>

                <p>
                  {
                    text.routineDescription
                  }
                </p>

              </div>

            </div>

            <button
              type="button"
              className="reminders-refresh"
              onClick={() =>
                void loadReminders()
              }
              disabled={
                loading
              }
              aria-label={
                text.refreshLabel
              }
              title={
                text.refreshLabel
              }
            >
              {loading ? (
                <Loader2
                  size={19}
                  className="reminders-loading-icon"
                />
              ) : (
                <RefreshCw
                  size={19}
                />
              )}
            </button>

          </div>

          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (
            <div className="reminders-loading">

              <div>

                <Loader2
                  size={32}
                  className="reminders-loading-icon"
                />

                <p>
                  {text.loading}
                </p>

              </div>

            </div>
          )}

          {/* =================================================
              EMPTY
              ================================================= */}

          {!loading &&
            reminders.length ===
              0 && (
              <div className="reminders-empty">

                <div className="reminders-empty-content">

                  <div className="reminders-empty-icon">
                    <CheckCircle2
                      size={32}
                    />
                  </div>

                  <h3>
                    {
                      text.emptyTitle
                    }
                  </h3>

                  <p>
                    {
                      text.emptyDescription
                    }
                  </p>

                </div>

              </div>
            )}

          {/* =================================================
              REMINDERS
              ================================================= */}

          {!loading &&
            reminders.length >
              0 && (
              <div className="reminders-list">

                {sortedReminders.map(
                  (
                    reminder
                  ) => {
                    const status =
                      reminder.status ||
                      "pending";

                    const statusClass =
                      getStatusClass(
                        status
                      );

                    const isCompleted =
                      status ===
                      "completed";

                    const isUpdating =
                      updatingId ===
                      reminder._id;

                    return (
                      <article
                        key={
                          reminder._id
                        }
                        className={`reminder-card ${statusClass}`}
                      >

                        <div className="reminder-card-content">

                          {/* ===============================
                              REMINDER INFORMATION
                              =============================== */}

                          <div className="reminder-card-main">

                            <div className="reminder-title-row">

                              <h3>
                                {
                                  reminder.title
                                }
                              </h3>

                              <span
                                className={`reminder-status ${statusClass}`}
                              >
                                {
                                  getStatusLabel(
                                    status
                                  )
                                }
                              </span>

                            </div>

                            {reminder.description && (
                              <p className="reminder-description">
                                {
                                  reminder.description
                                }
                              </p>
                            )}

                            <div className="reminder-meta">

                              <span className="reminder-meta-item">

                                <CalendarDays
                                  size={17}
                                />

                                {
                                  getDateLabel(
                                    reminder.date
                                  )
                                }

                              </span>

                              <span className="reminder-meta-item">

                                <Clock3
                                  size={17}
                                />

                                {
                                  formatReminderTime(
                                    reminder.time
                                  )
                                }

                              </span>

                            </div>

                          </div>

                          {/* ===============================
                              COMPLETED
                              =============================== */}

                          {isCompleted && (
                            <div className="reminder-completed-message">

                              <CheckCircle2
                                size={18}
                              />

                              <span>
                                {
                                  text.completedMessage
                                }
                              </span>

                            </div>
                          )}

                          {/* ===============================
                              ACTIONS
                              =============================== */}

                          {!isCompleted && (
                            <div className="reminder-actions">

                              <button
                                type="button"
                                className="reminder-button reminder-snooze"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  void handleSnooze(
                                    reminder._id
                                  )
                                }
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={18}
                                    className="reminders-loading-icon"
                                  />
                                ) : (
                                  <TimerReset
                                    size={18}
                                  />
                                )}

                                <span>
                                  {isUpdating
                                    ? text.updating
                                    : text.snooze}
                                </span>
                              </button>

                              <button
                                type="button"
                                className="reminder-button reminder-done"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  void handleComplete(
                                    reminder._id
                                  )
                                }
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={18}
                                    className="reminders-loading-icon"
                                  />
                                ) : (
                                  <Check
                                    size={18}
                                  />
                                )}

                                <span>
                                  {isUpdating
                                    ? text.updating
                                    : text.done}
                                </span>
                              </button>

                            </div>
                          )}

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

        </section>

      </div>

    </main>
  );
}

export default Reminders;