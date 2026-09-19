import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import {
  Activity,
  Bell,
  Brain,
  Camera,
  ChevronDown,
  Clock3,
  Copy,
  Edit3,
  Heart,
  Home,
  Image,
  Languages,
  LogOut,
  Menu,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  addFamilyMember,
  addMemory,
  addReminder,
  createPatient,
  deleteFamilyMember,
  deleteMemory,
  deleteReminder,
  getFamilyMembers,
  getGameSessions,
  getMemories,
  getPatient,
  getPatientsByCaregiver,
  getRecommendations,
  getReminders,
  resetReminder,
  updateFamilyMember,
  updateMemory,
  updateReminder,
} from "../services/api";

import "./CaregiverDashboard.css";

type DashboardSection =
  | "overview"
  | "progress"
  | "family"
  | "routine"
  | "patients";

type FamilyMember = {
  id: string;
  name: string;
  relation?: string;
  relationship?: string;
  age?: number;
  photo?: string;
  createdAt?: string;
};

type MemoryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
  createdAt?: string;
};

type ReminderItem = {
  _id?: string;
  id?: string;
  patientId?: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  status?: "pending" | "completed" | "snoozed";
  completedAt?: string;
  snoozedUntil?: string;
  createdAt?: string;
};

const MEMORY_CATEGORIES = [
  "Family",
  "Celebrations",
  "Places",
  "Traditions",
  "Life Events",
  "Songs",
];

function CaregiverDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // GENERAL DASHBOARD STATE
  // =====================================================

  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [patients, setPatients] =
    useState<any[]>([]);

  const [
    selectedPatientId,
    setSelectedPatientId,
  ] = useState("");

  const [patient, setPatient] =
    useState<any>(null);

  const [gameSessions, setGameSessions] =
    useState<any[]>([]);

  const [
    familyMembers,
    setFamilyMembers,
  ] = useState<FamilyMember[]>([]);

  const [memories, setMemories] =
    useState<MemoryItem[]>([]);

  const [reminders, setReminders] =
    useState<ReminderItem[]>([]);

  const [
    recommendations,
    setRecommendations,
  ] = useState<any[]>([]);

  const [
    loadingPatients,
    setLoadingPatients,
  ] = useState(true);

  const [
    loadingDashboard,
    setLoadingDashboard,
  ] = useState(false);

  // =====================================================
  // PATIENT CREATION
  // =====================================================

  const [
    showAddPatient,
    setShowAddPatient,
  ] = useState(false);

  const [
    newPatientName,
    setNewPatientName,
  ] = useState("");

  const [
    newPatientAge,
    setNewPatientAge,
  ] = useState("");

  const [
    newPatientLanguage,
    setNewPatientLanguage,
  ] = useState("Assamese");

  const [
    creatingPatient,
    setCreatingPatient,
  ] = useState(false);

  // =====================================================
  // FAMILY MEMBER MANAGEMENT
  // =====================================================

  const [
    showFamilyForm,
    setShowFamilyForm,
  ] = useState(false);

  const [
    editingFamilyId,
    setEditingFamilyId,
  ] = useState<string | null>(null);

  const [familyName, setFamilyName] =
    useState("");

  const [
    familyRelationship,
    setFamilyRelationship,
  ] = useState("");

  const [familyAge, setFamilyAge] =
    useState("");

  const [familyPhoto, setFamilyPhoto] =
    useState("");

  const [
    savingFamily,
    setSavingFamily,
  ] = useState(false);

  // =====================================================
  // MEMORY MANAGEMENT
  // =====================================================

  const [
    showMemoryForm,
    setShowMemoryForm,
  ] = useState(false);

  const [
    editingMemoryId,
    setEditingMemoryId,
  ] = useState<string | null>(null);

  const [memoryTitle, setMemoryTitle] =
    useState("");

  const [
    memoryDescription,
    setMemoryDescription,
  ] = useState("");

  const [
    memoryCategory,
    setMemoryCategory,
  ] = useState("Family");

  const [memoryPhoto, setMemoryPhoto] =
    useState("");

  const [
    savingMemory,
    setSavingMemory,
  ] = useState(false);

  // =====================================================
  // REMINDER MANAGEMENT
  // =====================================================

  const [
    showReminderForm,
    setShowReminderForm,
  ] = useState(false);

  const [
    editingReminderId,
    setEditingReminderId,
  ] = useState<string | null>(null);

  const [
    reminderTitle,
    setReminderTitle,
  ] = useState("");

  const [
    reminderDescription,
    setReminderDescription,
  ] = useState("");

  const [
    reminderDate,
    setReminderDate,
  ] = useState("");

  const [
    reminderTime,
    setReminderTime,
  ] = useState("");

  const [
    savingReminder,
    setSavingReminder,
  ] = useState(false);

  // =====================================================
  // LOGGED-IN CAREGIVER
  // =====================================================

  const storedUser =
    localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const caregiverId =
    user?.id || user?._id || "";

  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  useEffect(() => {
    async function loadPatients() {
      if (!caregiverId) {
        setLoadingPatients(false);
        return;
      }

      try {
        setLoadingPatients(true);

        const data =
          await getPatientsByCaregiver(
            caregiverId
          );

        const patientList =
          Array.isArray(data) ? data : [];

        setPatients(patientList);

        if (patientList.length > 0) {
          setSelectedPatientId(
            (currentId) => {
              if (
                currentId &&
                patientList.some(
                  (item: any) =>
                    item._id ===
                    currentId
                )
              ) {
                return currentId;
              }

              return patientList[0]._id;
            }
          );
        } else {
          setSelectedPatientId("");
          setPatient(null);
        }
      } catch (error) {
        console.error(
          "Failed to load patients:",
          error
        );

        setPatients([]);
        setSelectedPatientId("");
      } finally {
        setLoadingPatients(false);
      }
    }

    loadPatients();
  }, [caregiverId]);

  // =====================================================
  // LOAD SELECTED PATIENT
  // =====================================================

  useEffect(() => {
    async function loadDashboard() {
      if (!selectedPatientId) {
        setPatient(null);
        setGameSessions([]);
        setFamilyMembers([]);
        setMemories([]);
        setReminders([]);
        setRecommendations([]);
        return;
      }

      try {
        setLoadingDashboard(true);

        const [
          patientData,
          sessions,
          family,
          memoryData,
          reminderData,
          recommendationData,
        ] = await Promise.all([
          getPatient(selectedPatientId),
          getGameSessions(
            selectedPatientId
          ),
          getFamilyMembers(
            selectedPatientId
          ),
          getMemories(
            selectedPatientId
          ),
          getReminders(
            selectedPatientId
          ),
          getRecommendations(
            selectedPatientId
          ),
        ]);

        if (
          patientData?.success &&
          patientData?.patient
        ) {
          setPatient(
            patientData.patient
          );
        } else {
          setPatient(null);
        }

        setGameSessions(
          Array.isArray(sessions)
            ? sessions
            : []
        );

        setFamilyMembers(
          Array.isArray(family)
            ? family
            : []
        );

        setMemories(
          Array.isArray(memoryData)
            ? memoryData
            : []
        );

        setReminders(
          Array.isArray(reminderData)
            ? reminderData
            : []
        );

        setRecommendations(
          Array.isArray(
            recommendationData
          )
            ? recommendationData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load caregiver dashboard:",
          error
        );
      } finally {
        setLoadingDashboard(false);
      }
    }

    loadDashboard();
  }, [selectedPatientId]);

  // =====================================================
  // REFRESH FAMILY + MEMORIES
  // =====================================================

  async function refreshFamily() {
    if (!selectedPatientId) {
      return;
    }

    const data =
      await getFamilyMembers(
        selectedPatientId
      );

    setFamilyMembers(
      Array.isArray(data) ? data : []
    );
  }

  async function refreshMemories() {
    if (!selectedPatientId) {
      return;
    }

    const data =
      await getMemories(
        selectedPatientId
      );

    setMemories(
      Array.isArray(data) ? data : []
    );
  }

  // =====================================================
  // IMAGE CONVERSION
  // =====================================================

  function readImage(
    event: ChangeEvent<HTMLInputElement>,
    callback: (value: string) => void
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      alert(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Please select an image smaller than 2 MB."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result === "string"
      ) {
        callback(reader.result);
      }
    };

    reader.onerror = () => {
      alert(
        "The image could not be read."
      );
    };

    reader.readAsDataURL(file);
  }

  // =====================================================
  // FAMILY FORM
  // =====================================================

  function resetFamilyForm() {
    setEditingFamilyId(null);
    setFamilyName("");
    setFamilyRelationship("");
    setFamilyAge("");
    setFamilyPhoto("");
    setShowFamilyForm(false);
  }

  function startAddFamily() {
    setEditingFamilyId(null);
    setFamilyName("");
    setFamilyRelationship("");
    setFamilyAge("");
    setFamilyPhoto("");
    setShowFamilyForm(true);
  }

  function startEditFamily(
    member: FamilyMember
  ) {
    setEditingFamilyId(member.id);
    setFamilyName(member.name || "");
    setFamilyRelationship(
      member.relationship ||
        member.relation ||
        ""
    );

    setFamilyAge(
      member.age
        ? String(member.age)
        : ""
    );

    setFamilyPhoto(
      member.photo || ""
    );

    setShowFamilyForm(true);
  }

  async function handleSaveFamily() {
    if (!selectedPatientId) {
      return;
    }

    const name = familyName.trim();

    const relationship =
      familyRelationship.trim();

    if (!name || !relationship) {
      alert(
        "Please enter the person's name and relationship."
      );
      return;
    }

    let parsedAge:
      | number
      | undefined =
      undefined;

    if (familyAge.trim()) {
      parsedAge =
        Number(familyAge);

      if (
        Number.isNaN(parsedAge) ||
        parsedAge <= 0 ||
        parsedAge > 120
      ) {
        alert(
          "Please enter a valid age."
        );
        return;
      }
    }

    try {
      setSavingFamily(true);

      const payload = {
        patientId:
          selectedPatientId,
        name,
        relationship,
        age: parsedAge,
        photo:
          familyPhoto ||
          undefined,
      };

      const result =
        editingFamilyId
          ? await updateFamilyMember(
              editingFamilyId,
              payload
            )
          : await addFamilyMember(
              payload
            );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to save family member."
        );
        return;
      }

      await refreshFamily();

      resetFamilyForm();
    } catch (error) {
      console.error(
        "Family member save error:",
        error
      );

      alert(
        "Unable to save the family member."
      );
    } finally {
      setSavingFamily(false);
    }
  }

  async function handleDeleteFamily(
    member: FamilyMember
  ) {
    const confirmed =
      window.confirm(
        `Remove ${member.name} from this patient's familiar people?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await deleteFamilyMember(
          member.id
        );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to remove family member."
        );
        return;
      }

      await refreshFamily();

      if (
        editingFamilyId ===
        member.id
      ) {
        resetFamilyForm();
      }
    } catch (error) {
      console.error(
        "Family member delete error:",
        error
      );

      alert(
        "Unable to remove the family member."
      );
    }
  }

  // =====================================================
  // MEMORY FORM
  // =====================================================

  function resetMemoryForm() {
    setEditingMemoryId(null);
    setMemoryTitle("");
    setMemoryDescription("");
    setMemoryCategory("Family");
    setMemoryPhoto("");
    setShowMemoryForm(false);
  }

  function startAddMemory() {
    setEditingMemoryId(null);
    setMemoryTitle("");
    setMemoryDescription("");
    setMemoryCategory("Family");
    setMemoryPhoto("");
    setShowMemoryForm(true);
  }

  function startEditMemory(
    memory: MemoryItem
  ) {
    setEditingMemoryId(memory.id);

    setMemoryTitle(
      memory.title || ""
    );

    setMemoryDescription(
      memory.description || ""
    );

    setMemoryCategory(
      memory.category || "Family"
    );

    setMemoryPhoto(
      memory.photo || ""
    );

    setShowMemoryForm(true);
  }

  async function handleSaveMemory() {
    if (!selectedPatientId) {
      return;
    }

    const title =
      memoryTitle.trim();

    const description =
      memoryDescription.trim();

    const category =
      memoryCategory.trim();

    if (
      !title ||
      !description ||
      !category
    ) {
      alert(
        "Please enter a title, category and description."
      );
      return;
    }

    try {
      setSavingMemory(true);

      const payload = {
        patientId:
          selectedPatientId,
        title,
        description,
        category,
        photo:
          memoryPhoto ||
          undefined,
      };

      const result =
        editingMemoryId
          ? await updateMemory(
              editingMemoryId,
              payload
            )
          : await addMemory(
              payload
            );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to save memory."
        );
        return;
      }

      await refreshMemories();

      resetMemoryForm();
    } catch (error) {
      console.error(
        "Memory save error:",
        error
      );

      alert(
        "Unable to save the memory."
      );
    } finally {
      setSavingMemory(false);
    }
  }

  async function handleDeleteMemory(
    memory: MemoryItem
  ) {
    const confirmed =
      window.confirm(
        `Delete "${memory.title}" from this patient's Memory Vault?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await deleteMemory(
          memory.id
        );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to delete memory."
        );
        return;
      }

      await refreshMemories();

      if (
        editingMemoryId ===
        memory.id
      ) {
        resetMemoryForm();
      }
    } catch (error) {
      console.error(
        "Memory delete error:",
        error
      );

      alert(
        "Unable to delete the memory."
      );
    }
  }

  // =====================================================
  // REMINDER MANAGEMENT
  // =====================================================

  async function refreshReminders() {
    if (!selectedPatientId) {
      return;
    }

    const data =
      await getReminders(
        selectedPatientId
      );

    setReminders(
      Array.isArray(data) ? data : []
    );
  }

  function resetReminderForm() {
    setEditingReminderId(null);
    setReminderTitle("");
    setReminderDescription("");
    setReminderDate("");
    setReminderTime("");
    setShowReminderForm(false);
  }

  function startAddReminder() {
    setEditingReminderId(null);
    setReminderTitle("");
    setReminderDescription("");
    setReminderDate("");
    setReminderTime("");
    setShowReminderForm(true);
  }

  function startEditReminder(
    reminder: ReminderItem
  ) {
    const reminderId =
      reminder._id || reminder.id;

    if (!reminderId) {
      return;
    }

    setEditingReminderId(reminderId);
    setReminderTitle(
      reminder.title || ""
    );
    setReminderDescription(
      reminder.description || ""
    );
    setReminderDate(
      reminder.date || ""
    );
    setReminderTime(
      reminder.time || ""
    );
    setShowReminderForm(true);
  }

  async function handleSaveReminder() {
    if (!selectedPatientId) {
      alert(
        "Please select a patient first."
      );
      return;
    }

    const title =
      reminderTitle.trim();

    const description =
      reminderDescription.trim();

    const date =
      reminderDate.trim();

    const time =
      reminderTime.trim();

    if (!title || !date || !time) {
      alert(
        "Please enter a reminder title, date and time."
      );
      return;
    }

    try {
      setSavingReminder(true);

      const payload = {
        patientId:
          selectedPatientId,
        title,
        description:
          description || undefined,
        date,
        time,
      };

      const result =
        editingReminderId
          ? await updateReminder(
              editingReminderId,
              payload
            )
          : await addReminder(
              payload
            );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to save reminder."
        );
        return;
      }

      await refreshReminders();
      resetReminderForm();
    } catch (error) {
      console.error(
        "Reminder save error:",
        error
      );

      alert(
        "Unable to save the reminder."
      );
    } finally {
      setSavingReminder(false);
    }
  }

  async function handleDeleteReminder(
    reminder: ReminderItem
  ) {
    const reminderId =
      reminder._id || reminder.id;

    if (!reminderId) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${reminder.title}" from this patient's routine?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await deleteReminder(
          reminderId
        );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to delete reminder."
        );
        return;
      }

      await refreshReminders();

      if (
        editingReminderId ===
        reminderId
      ) {
        resetReminderForm();
      }
    } catch (error) {
      console.error(
        "Reminder delete error:",
        error
      );

      alert(
        "Unable to delete the reminder."
      );
    }
  }

  async function handleResetReminder(
    reminder: ReminderItem
  ) {
    const reminderId =
      reminder._id || reminder.id;

    if (!reminderId) {
      return;
    }

    try {
      const result =
        await resetReminder(
          reminderId
        );

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to reset reminder."
        );
        return;
      }

      await refreshReminders();
    } catch (error) {
      console.error(
        "Reminder reset error:",
        error
      );

      alert(
        "Unable to reset the reminder."
      );
    }
  }

  // =====================================================
  // CREATE PATIENT
  // =====================================================

  async function handleCreatePatient() {
    const name =
      newPatientName.trim();

    const ageText =
      newPatientAge.trim();

    const age = Number(ageText);

    if (!name || !ageText) {
      alert(
        "Please enter patient name and age."
      );
      return;
    }

    if (
      Number.isNaN(age) ||
      age <= 0 ||
      age > 120
    ) {
      alert(
        "Please enter a valid patient age."
      );
      return;
    }

    if (!caregiverId) {
      alert(
        "Caregiver information was not found. Please login again."
      );
      return;
    }

    try {
      setCreatingPatient(true);

      const data =
        await createPatient({
          name,
          age,
          language:
            newPatientLanguage,
          caregiverId,
        });

      if (
        !data?.success ||
        !data?.patient
      ) {
        alert(
          data?.message ||
            "Failed to create patient."
        );
        return;
      }

      const newPatient =
        data.patient;

      setNewPatientName("");
      setNewPatientAge("");
      setNewPatientLanguage(
        "Assamese"
      );

      setShowAddPatient(false);

      const updatedPatients =
        await getPatientsByCaregiver(
          caregiverId
        );

      const patientList =
        Array.isArray(
          updatedPatients
        )
          ? updatedPatients
          : [];

      setPatients(patientList);

      setSelectedPatientId(
        newPatient._id
      );

      setPatient(newPatient);

      setActiveSection(
        "overview"
      );

      alert(
        `Patient created successfully.\n\nPatient ID:\n${newPatient._id}`
      );
    } catch (error) {
      console.error(
        "Failed to create patient:",
        error
      );

      alert(
        "Unable to create patient. Please make sure the backend is running."
      );
    } finally {
      setCreatingPatient(false);
    }
  }

  // =====================================================
  // LOGOUT / COPY
  // =====================================================

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function copyPatientId() {
    if (!selectedPatientId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        selectedPatientId
      );

      alert(
        "Patient ID copied."
      );
    } catch {
      alert(
        `Patient ID: ${selectedPatientId}`
      );
    }
  }

  // =====================================================
  // DASHBOARD SUMMARY
  // =====================================================

  const totalGames =
    gameSessions.length;

  const averageAccuracy =
    useMemo(() => {
      if (
        gameSessions.length === 0
      ) {
        return 0;
      }

      const total =
        gameSessions.reduce(
          (sum, session) =>
            sum +
            Number(
              session.accuracy || 0
            ),
          0
        );

      return Math.round(
        total /
          gameSessions.length
      );
    }, [gameSessions]);

  const latestSession =
    gameSessions.length > 0
      ? gameSessions[0]
      : null;

  const recentSessions =
    gameSessions.slice(0, 6);

  const latestRecommendation =
    recommendations.length > 0
      ? recommendations[0]
      : null;

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigationItems: {
    id: DashboardSection;
    label: string;
    icon: any;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
    },
    {
      id: "progress",
      label: "Patient Progress",
      icon: Activity,
    },
    {
      id: "family",
      label: "Family & Memories",
      icon: Heart,
    },
    {
      id: "routine",
      label: "Routine & Reminders",
      icon: Bell,
    },
    {
      id: "patients",
      label: "Patient Management",
      icon: Users,
    },
  ];

  function changeSection(
    section: DashboardSection
  ) {
    setActiveSection(section);
    setMobileMenuOpen(false);
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingPatients) {
    return (
      <div className="care-loading-screen">
        <div className="care-loading-logo">
          S
        </div>

        <p>
          Preparing caregiver dashboard...
        </p>
      </div>
    );
  }

  // =====================================================
  // AUTH ERROR
  // =====================================================

  if (!caregiverId) {
    return (
      <div className="care-auth-error">
        <div className="care-auth-error-card">
          <div className="care-loading-logo">
            S
          </div>

          <h1>
            Caregiver session unavailable
          </h1>

          <p>
            Please sign in again to
            continue to SMRITI Care.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // OVERVIEW
  // =====================================================

  function renderOverview() {
    return (
      <>
        <section className="care-welcome">
          <div>
            <span className="care-eyebrow">
              CAREGIVER OVERVIEW
            </span>

            <h1>
              Supporting everyday memory,
              together.
            </h1>

            <p>
              Review activity, routines
              and familiar-memory support
              for the selected patient.
            </p>
          </div>

          <div className="care-welcome-symbol">
            <Heart size={34} />
          </div>
        </section>

        <section className="care-stat-grid">
          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Brain size={22} />
            </div>

            <div>
              <span>
                Activities completed
              </span>

              <strong>
                {totalGames}
              </strong>

              <small>
                Recorded activity sessions
              </small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Target size={22} />
            </div>

            <div>
              <span>
                Average accuracy
              </span>

              <strong>
                {averageAccuracy}%
              </strong>

              <small>
                Across recorded sessions
              </small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Users size={22} />
            </div>

            <div>
              <span>
                Family profiles
              </span>

              <strong>
                {familyMembers.length}
              </strong>

              <small>
                Familiar people available
              </small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Bell size={22} />
            </div>

            <div>
              <span>
                Routine reminders
              </span>

              <strong>
                {reminders.length}
              </strong>

              <small>
                Currently recorded
              </small>
            </div>
          </article>
        </section>

        <section className="care-two-column">
          <article className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">
                  RECENT ACTIVITY
                </span>

                <h2>
                  Latest engagement
                </h2>
              </div>

              <button
                className="care-text-button"
                onClick={() =>
                  changeSection(
                    "progress"
                  )
                }
              >
                View progress
              </button>
            </div>

            {latestSession ? (
              <div className="care-latest-session">
                <div className="care-session-icon">
                  <Brain size={25} />
                </div>

                <div className="care-session-main">
                  <strong>
                    {
                      latestSession.gameName
                    }
                  </strong>

                  <span>
                    {latestSession.playedAt
                      ? new Date(
                          latestSession.playedAt
                        ).toLocaleString()
                      : "Recently"}
                  </span>
                </div>

                <div className="care-session-metric">
                  <strong>
                    {latestSession.accuracy ??
                      0}
                    %
                  </strong>

                  <span>
                    Accuracy
                  </span>
                </div>

                <div className="care-session-metric">
                  <strong>
                    {latestSession.difficulty ||
                      "—"}
                  </strong>

                  <span>
                    Difficulty
                  </span>
                </div>
              </div>
            ) : (
              <div className="care-empty-state">
                <Brain size={30} />

                <h3>
                  No activity recorded yet
                </h3>

                <p>
                  Completed patient
                  activities will appear
                  here.
                </p>
              </div>
            )}
          </article>

          <article className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">
                  ADAPTIVE GUIDANCE
                </span>

                <h2>
                  Activity recommendation
                </h2>
              </div>

              <Sparkles size={21} />
            </div>

            {latestRecommendation ? (
              <div className="care-guidance">
                <div className="care-guidance-game">
                  <span>
                    Recommended activity
                  </span>

                  <strong>
                    {
                      latestRecommendation.gameName
                    }
                  </strong>
                </div>

                <div className="care-guidance-levels">
                  <div>
                    <span>
                      Current
                    </span>

                    <strong>
                      {
                        latestRecommendation.currentDifficulty
                      }
                    </strong>
                  </div>

                  <div className="care-guidance-arrow">
                    →
                  </div>

                  <div>
                    <span>
                      Suggested
                    </span>

                    <strong>
                      {
                        latestRecommendation.recommendedDifficulty
                      }
                    </strong>
                  </div>
                </div>

                {latestRecommendation.reason && (
                  <p>
                    {
                      latestRecommendation.reason
                    }
                  </p>
                )}

                <small>
                  Guidance is based on
                  recorded activity
                  performance and is not a
                  medical assessment.
                </small>
              </div>
            ) : (
              <div className="care-empty-state compact">
                <Sparkles size={28} />

                <h3>
                  More activity is needed
                </h3>

                <p>
                  Recommendations will
                  appear after activity
                  sessions are recorded.
                </p>
              </div>
            )}
          </article>
        </section>

        <section className="care-panel">
          <div className="care-panel-header">
            <div>
              <span className="care-section-label">
                TODAY
              </span>

              <h2>
                Routine overview
              </h2>
            </div>

            <button
              className="care-text-button"
              onClick={() =>
                changeSection(
                  "routine"
                )
              }
            >
              View all
            </button>
          </div>

          {reminders.length > 0 ? (
            <div className="care-reminder-list">
              {reminders
                .slice(0, 4)
                .map((reminder) => (
                  <div
                    className="care-reminder-row"
                    key={
                      reminder._id ||
                      reminder.id
                    }
                  >
                    <div className="care-reminder-time">
                      <Clock3
                        size={18}
                      />

                      <span>
                        {reminder.time ||
                          "Scheduled"}
                      </span>
                    </div>

                    <div className="care-reminder-content">
                      <strong>
                        {
                          reminder.title
                        }
                      </strong>

                      <span>
                        {reminder.description ||
                          reminder.date ||
                          "Daily routine reminder"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="care-empty-state compact">
              <Bell size={28} />

              <h3>
                No reminders scheduled
              </h3>

              <p>
                Routine reminders for
                this patient will appear
                here.
              </p>
            </div>
          )}
        </section>
      </>
    );
  }

  // =====================================================
  // PROGRESS
  // =====================================================

  function renderProgress() {
    const trendSessions = [...gameSessions]
      .sort((a, b) => new Date(a.playedAt || 0).getTime() - new Date(b.playedAt || 0).getTime())
      .slice(-8);

    const gameMap: Record<string, { sessions: number; totalAccuracy: number }> = {};

    gameSessions.forEach((session) => {
      const gameName = session.gameName || "Activity";
      if (!gameMap[gameName]) {
        gameMap[gameName] = { sessions: 0, totalAccuracy: 0 };
      }
      gameMap[gameName].sessions += 1;
      gameMap[gameName].totalAccuracy += Number(session.accuracy || 0);
    });

    const gamePerformance = Object.entries(gameMap)
      .map(([name, data]) => ({
        name,
        sessions: data.sessions,
        averageAccuracy: Math.round(data.totalAccuracy / data.sessions),
      }))
      .sort((a, b) => b.sessions - a.sessions);

    const difficultyCounts: Record<string, number> = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
      Other: 0,
    };

    gameSessions.forEach((session) => {
      const difficulty = String(session.difficulty || "").toLowerCase();
      if (difficulty === "easy") difficultyCounts.Easy += 1;
      else if (difficulty === "medium") difficultyCounts.Medium += 1;
      else if (difficulty === "hard") difficultyCounts.Hard += 1;
      else difficultyCounts.Other += 1;
    });

    const difficultyData = [
      { name: "Easy", count: difficultyCounts.Easy },
      { name: "Medium", count: difficultyCounts.Medium },
      { name: "Hard", count: difficultyCounts.Hard },
    ];

    if (difficultyCounts.Other > 0) {
      difficultyData.push({ name: "Other", count: difficultyCounts.Other });
    }

    const highestAccuracy =
      gameSessions.length > 0
        ? Math.max(...gameSessions.map((session) => Number(session.accuracy || 0)))
        : 0;

    return (
      <>
        <section className="care-page-heading">
          <span className="care-eyebrow">PATIENT PROGRESS</span>
          <h1>Progress & engagement</h1>
          <p>
            Review activity frequency, accuracy and difficulty across recorded
            cognitive activities. These results support caregiver awareness and
            are not a medical assessment.
          </p>
        </section>

        <section className="care-stat-grid">
          <article className="care-stat-card">
            <div className="care-stat-icon"><Activity size={22} /></div>
            <div>
              <span>Activities completed</span>
              <strong>{totalGames}</strong>
              <small>Recorded sessions</small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon"><Target size={22} /></div>
            <div>
              <span>Average accuracy</span>
              <strong>{averageAccuracy}%</strong>
              <small>Across all activities</small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon"><Sparkles size={22} /></div>
            <div>
              <span>Highest accuracy</span>
              <strong>{highestAccuracy}%</strong>
              <small>Best recorded session</small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon"><Brain size={22} /></div>
            <div>
              <span>Latest difficulty</span>
              <strong className="care-stat-text-value">
                {latestSession?.difficulty || "—"}
              </strong>
              <small>Most recent activity</small>
            </div>
          </article>
        </section>

        <section className="care-progress-grid">
          <article className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">ACCURACY TREND</span>
                <h2>Recent performance</h2>
              </div>
              <Activity size={20} />
            </div>

            {trendSessions.length > 0 ? (
              <>
                <div className="care-chart-scale">
                  <span>100%</span><span>75%</span><span>50%</span>
                  <span>25%</span><span>0%</span>
                </div>

                <div className="care-accuracy-chart">
                  {trendSessions.map((session, index) => {
                    const accuracy = Math.max(0, Math.min(100, Number(session.accuracy || 0)));
                    return (
                      <div
                        className="care-accuracy-column"
                        key={session._id || `${session.gameName}-${index}`}
                      >
                        <div className="care-accuracy-value">{accuracy}%</div>
                        <div className="care-accuracy-track">
                          <div
                            className="care-accuracy-fill"
                            style={{ height: `${accuracy}%` }}
                          />
                        </div>
                        <strong>{session.gameName || "Activity"}</strong>
                        <span>
                          {session.playedAt
                            ? new Date(session.playedAt).toLocaleDateString(undefined, {
                                day: "numeric",
                                month: "short",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="care-chart-note">
                  Each bar represents one recorded activity session. New sessions
                  are added automatically.
                </p>
              </>
            ) : (
              <div className="care-empty-state compact">
                <Activity size={28} />
                <h3>No progress data yet</h3>
                <p>Accuracy trends will appear after activities are completed.</p>
              </div>
            )}
          </article>

          <article className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">DIFFICULTY</span>
                <h2>Session distribution</h2>
              </div>
              <Brain size={20} />
            </div>

            {totalGames > 0 ? (
              <div className="care-difficulty-list">
                {difficultyData.map((item) => {
                  const percentage = Math.round((item.count / totalGames) * 100);
                  return (
                    <div className="care-difficulty-row" key={item.name}>
                      <div className="care-difficulty-heading">
                        <strong>{item.name}</strong>
                        <span>{item.count} {item.count === 1 ? "session" : "sessions"}</span>
                      </div>
                      <div className="care-horizontal-track">
                        <div
                          className="care-horizontal-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <small>{percentage}% of recorded activity</small>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="care-empty-state compact">
                <Brain size={28} />
                <h3>No difficulty data</h3>
                <p>Difficulty distribution will appear after games are completed.</p>
              </div>
            )}
          </article>
        </section>

        <section className="care-panel">
          <div className="care-panel-header">
            <div>
              <span className="care-section-label">ACTIVITY BREAKDOWN</span>
              <h2>Performance by activity</h2>
            </div>
            <Target size={20} />
          </div>

          {gamePerformance.length > 0 ? (
            <div className="care-game-performance-grid">
              {gamePerformance.map((game) => (
                <article className="care-game-performance-card" key={game.name}>
                  <div className="care-game-performance-top">
                    <div className="care-game-performance-icon"><Brain size={19} /></div>
                    <div>
                      <strong>{game.name}</strong>
                      <span>{game.sessions} {game.sessions === 1 ? "session" : "sessions"}</span>
                    </div>
                  </div>
                  <div className="care-game-performance-score">
                    <strong>{game.averageAccuracy}%</strong>
                    <span>Average accuracy</span>
                  </div>
                  <div className="care-horizontal-track">
                    <div
                      className="care-horizontal-fill"
                      style={{ width: `${Math.min(100, Math.max(0, game.averageAccuracy))}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="care-empty-state compact">
              <Target size={28} />
              <h3>No activity breakdown yet</h3>
              <p>Individual activity performance will appear after sessions are recorded.</p>
            </div>
          )}
        </section>

        <section className="care-progress-guidance-grid">
          <article className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">PERSONALISATION</span>
                <h2>Adaptive guidance</h2>
              </div>
              <Sparkles size={20} />
            </div>

            {latestRecommendation ? (
              <div className="care-guidance">
                <div className="care-guidance-game">
                  <span>Activity</span>
                  <strong>{latestRecommendation.gameName}</strong>
                </div>
                <div className="care-guidance-levels">
                  <div>
                    <span>Current</span>
                    <strong>{latestRecommendation.currentDifficulty}</strong>
                  </div>
                  <div className="care-guidance-arrow">→</div>
                  <div>
                    <span>Recommended</span>
                    <strong>{latestRecommendation.recommendedDifficulty}</strong>
                  </div>
                </div>
                {latestRecommendation.reason && <p>{latestRecommendation.reason}</p>}
                <small>
                  This recommendation is generated from recorded activity
                  performance and is not a clinical recommendation.
                </small>
              </div>
            ) : (
              <div className="care-empty-state compact">
                <Sparkles size={28} />
                <h3>No recommendation yet</h3>
                <p>Guidance will appear when enough activity data is available.</p>
              </div>
            )}
          </article>

          <article className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">ENGAGEMENT</span>
                <h2>Activity summary</h2>
              </div>
              <Clock3 size={20} />
            </div>

            <div className="care-engagement-summary">
              <div><span>Recorded activities</span><strong>{totalGames}</strong></div>
              <div><span>Activity types</span><strong>{gamePerformance.length}</strong></div>
              <div>
                <span>Latest activity</span>
                <strong className="care-engagement-text">
                  {latestSession?.gameName || "No activity yet"}
                </strong>
              </div>
              <div>
                <span>Latest recorded</span>
                <strong className="care-engagement-text">
                  {latestSession?.playedAt
                    ? new Date(latestSession.playedAt).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section className="care-panel">
          <div className="care-panel-header">
            <div>
              <span className="care-section-label">SESSION HISTORY</span>
              <h2>Recent activities</h2>
            </div>
            <span className="care-count-badge">{gameSessions.length}</span>
          </div>

          {recentSessions.length > 0 ? (
            <div className="care-table-wrapper">
              <table className="care-table">
                <thead>
                  <tr>
                    <th>Activity</th><th>Difficulty</th><th>Score</th>
                    <th>Accuracy</th><th>Played</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session, index) => (
                    <tr key={session._id || `${session.gameName}-${index}`}>
                      <td><strong>{session.gameName}</strong></td>
                      <td><span className="care-level-badge">{session.difficulty || "—"}</span></td>
                      <td>{session.score ?? "—"}</td>
                      <td><strong>{session.accuracy ?? 0}%</strong></td>
                      <td>
                        {session.playedAt
                          ? new Date(session.playedAt).toLocaleString()
                          : "Recently"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="care-empty-state">
              <Activity size={30} />
              <h3>No sessions yet</h3>
              <p>Activity results will appear after the patient completes a game.</p>
            </div>
          )}
        </section>
      </>
    );
  }

  // =====================================================
  // FAMILY & MEMORIES
  // =====================================================

  function renderFamily() {
    return (
      <>
        <section className="care-page-heading care-page-heading-row">
          <div>
            <span className="care-eyebrow">
              FAMILIAR CONNECTIONS
            </span>

            <h1>
              Family & memories
            </h1>

            <p>
              Manage familiar people and
              meaningful memories for{" "}
              {patient?.name ||
                "the selected patient"}.
              These records support
              personalized memory
              activities.
            </p>
          </div>

          <div className="care-family-heading-actions">
            <button
              className="care-secondary-button"
              onClick={
                startAddFamily
              }
            >
              <UserPlus size={17} />
              Add person
            </button>

            <button
              className="care-primary-button"
              onClick={
                startAddMemory
              }
            >
              <Plus size={17} />
              Add memory
            </button>
          </div>
        </section>

        {/* FAMILY FORM */}

        {showFamilyForm && (
          <section className="care-panel care-management-form">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">
                  {editingFamilyId
                    ? "EDIT FAMILIAR PERSON"
                    : "NEW FAMILIAR PERSON"}
                </span>

                <h2>
                  {editingFamilyId
                    ? "Update family profile"
                    : "Add familiar person"}
                </h2>
              </div>

              <button
                className="care-icon-button"
                onClick={
                  resetFamilyForm
                }
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="care-management-layout">
              <div className="care-photo-editor">
                <div className="care-photo-preview">
                  {familyPhoto ? (
                    <img
                      src={
                        familyPhoto
                      }
                      alt="Selected family member"
                    />
                  ) : (
                    <User
                      size={44}
                    />
                  )}
                </div>

                <label className="care-upload-button">
                  <Camera size={17} />

                  {familyPhoto
                    ? "Change photo"
                    : "Choose photo"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(
                      event
                    ) =>
                      readImage(
                        event,
                        setFamilyPhoto
                      )
                    }
                  />
                </label>

                {familyPhoto && (
                  <button
                    type="button"
                    className="care-remove-photo"
                    onClick={() =>
                      setFamilyPhoto(
                        ""
                      )
                    }
                  >
                    Remove photo
                  </button>
                )}

                <small>
                  JPG, PNG or WEBP. Maximum
                  2 MB.
                </small>
              </div>

              <div className="care-management-fields">
                <label>
                  <span>
                    Name *
                  </span>

                  <input
                    type="text"
                    value={
                      familyName
                    }
                    placeholder="Enter person's name"
                    onChange={(
                      event
                    ) =>
                      setFamilyName(
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    Relationship *
                  </span>

                  <input
                    type="text"
                    value={
                      familyRelationship
                    }
                    placeholder="Example: Daughter, Son, Sister"
                    onChange={(
                      event
                    ) =>
                      setFamilyRelationship(
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    Age
                  </span>

                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={
                      familyAge
                    }
                    placeholder="Optional"
                    onChange={(
                      event
                    ) =>
                      setFamilyAge(
                        event.target
                          .value
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="care-form-actions">
              <button
                className="care-secondary-button"
                onClick={
                  resetFamilyForm
                }
              >
                Cancel
              </button>

              <button
                className="care-primary-button"
                disabled={
                  savingFamily
                }
                onClick={
                  handleSaveFamily
                }
              >
                <Save size={17} />

                {savingFamily
                  ? "Saving..."
                  : editingFamilyId
                    ? "Save changes"
                    : "Add person"}
              </button>
            </div>
          </section>
        )}

        {/* FAMILY PROFILES */}

        <section className="care-panel">
          <div className="care-panel-header">
            <div>
              <span className="care-section-label">
                FAMILY PROFILES
              </span>

              <h2>
                Familiar people
              </h2>
            </div>

            <div className="care-panel-header-actions">
              <span className="care-count-badge">
                {
                  familyMembers.length
                }
              </span>

              <button
                className="care-text-button"
                onClick={
                  startAddFamily
                }
              >
                + Add person
              </button>
            </div>
          </div>

          {familyMembers.length >
          0 ? (
            <div className="care-family-grid care-family-management-grid">
              {familyMembers.map(
                (member) => (
                  <article
                    className="care-family-person care-family-management-card"
                    key={
                      member.id
                    }
                  >
                    <div className="care-family-photo">
                      {member.photo ? (
                        <img
                          src={
                            member.photo
                          }
                          alt={
                            member.name
                          }
                        />
                      ) : (
                        <User
                          size={30}
                        />
                      )}
                    </div>

                    <div className="care-family-person-info">
                      <strong>
                        {
                          member.name
                        }
                      </strong>

                      <span>
                        {member.relationship ||
                          member.relation ||
                          "Family member"}
                      </span>

                      {member.age && (
                        <small>
                          Age{" "}
                          {
                            member.age
                          }
                        </small>
                      )}
                    </div>

                    <div className="care-record-actions">
                      <button
                        onClick={() =>
                          startEditFamily(
                            member
                          )
                        }
                        aria-label={`Edit ${member.name}`}
                        title="Edit"
                      >
                        <Edit3
                          size={15}
                        />
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          handleDeleteFamily(
                            member
                          )
                        }
                        aria-label={`Delete ${member.name}`}
                        title="Delete"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="care-empty-state">
              <Users size={30} />

              <h3>
                No familiar people yet
              </h3>

              <p>
                Add familiar people and
                photographs to support
                personalized activities
                such as Family Faces.
              </p>

              <button
                className="care-primary-button"
                onClick={
                  startAddFamily
                }
              >
                <UserPlus
                  size={17}
                />
                Add first person
              </button>
            </div>
          )}

          <div className="care-information-note">
            <Heart size={19} />

            <p>
              These photographs can be
              used by personalized
              activities such as Family
              Faces. Only store
              photographs you have
              permission to use.
            </p>
          </div>
        </section>

        {/* MEMORY FORM */}

        {showMemoryForm && (
          <section className="care-panel care-management-form">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">
                  {editingMemoryId
                    ? "EDIT MEMORY"
                    : "NEW MEMORY"}
                </span>

                <h2>
                  {editingMemoryId
                    ? "Update personal memory"
                    : "Add to Memory Vault"}
                </h2>
              </div>

              <button
                className="care-icon-button"
                onClick={
                  resetMemoryForm
                }
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="care-management-layout">
              <div className="care-photo-editor memory">
                <div className="care-photo-preview memory">
                  {memoryPhoto ? (
                    <img
                      src={
                        memoryPhoto
                      }
                      alt="Selected memory"
                    />
                  ) : (
                    <Image
                      size={42}
                    />
                  )}
                </div>

                <label className="care-upload-button">
                  <Camera size={17} />

                  {memoryPhoto
                    ? "Change photo"
                    : "Choose photo"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(
                      event
                    ) =>
                      readImage(
                        event,
                        setMemoryPhoto
                      )
                    }
                  />
                </label>

                {memoryPhoto && (
                  <button
                    type="button"
                    className="care-remove-photo"
                    onClick={() =>
                      setMemoryPhoto(
                        ""
                      )
                    }
                  >
                    Remove photo
                  </button>
                )}

                <small>
                  Personal photographs
                  work best for Photo
                  Recall.
                </small>
              </div>

              <div className="care-management-fields">
                <label>
                  <span>
                    Memory title *
                  </span>

                  <input
                    type="text"
                    value={
                      memoryTitle
                    }
                    placeholder="Example: Family celebration"
                    onChange={(
                      event
                    ) =>
                      setMemoryTitle(
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    Category *
                  </span>

                  <select
                    value={
                      memoryCategory
                    }
                    onChange={(
                      event
                    ) =>
                      setMemoryCategory(
                        event.target
                          .value
                      )
                    }
                  >
                    {MEMORY_CATEGORIES.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {
                            category
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="care-full-field">
                  <span>
                    Memory description *
                  </span>

                  <textarea
                    value={
                      memoryDescription
                    }
                    placeholder="Describe the familiar moment using information known to the patient and caregiver."
                    rows={5}
                    onChange={(
                      event
                    ) =>
                      setMemoryDescription(
                        event.target
                          .value
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="care-form-actions">
              <button
                className="care-secondary-button"
                onClick={
                  resetMemoryForm
                }
              >
                Cancel
              </button>

              <button
                className="care-primary-button"
                disabled={
                  savingMemory
                }
                onClick={
                  handleSaveMemory
                }
              >
                <Save size={17} />

                {savingMemory
                  ? "Saving..."
                  : editingMemoryId
                    ? "Save changes"
                    : "Add memory"}
              </button>
            </div>
          </section>
        )}

        {/* MEMORY VAULT */}

        <section className="care-panel">
          <div className="care-panel-header">
            <div>
              <span className="care-section-label">
                MEMORY VAULT
              </span>

              <h2>
                Personal memories
              </h2>
            </div>

            <div className="care-panel-header-actions">
              <span className="care-count-badge">
                {memories.length}
              </span>

              <button
                className="care-text-button"
                onClick={
                  startAddMemory
                }
              >
                + Add memory
              </button>
            </div>
          </div>

          {memories.length > 0 ? (
            <div className="care-memory-grid">
              {memories.map(
                (memory) => (
                  <article
                    className="care-memory-card"
                    key={
                      memory.id
                    }
                  >
                    <div className="care-memory-image">
                      {memory.photo ? (
                        <img
                          src={
                            memory.photo
                          }
                          alt={
                            memory.title
                          }
                        />
                      ) : (
                        <div className="care-memory-image-placeholder">
                          <Image
                            size={30}
                          />
                        </div>
                      )}

                      <span className="care-memory-category">
                        {
                          memory.category
                        }
                      </span>
                    </div>

                    <div className="care-memory-body">
                      <div className="care-memory-title-row">
                        <h3>
                          {
                            memory.title
                          }
                        </h3>

                        <div className="care-record-actions">
                          <button
                            onClick={() =>
                              startEditMemory(
                                memory
                              )
                            }
                            title="Edit memory"
                          >
                            <Edit3
                              size={15}
                            />
                          </button>

                          <button
                            className="danger"
                            onClick={() =>
                              handleDeleteMemory(
                                memory
                              )
                            }
                            title="Delete memory"
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>
                      </div>

                      <p>
                        {
                          memory.description
                        }
                      </p>

                      {memory.createdAt && (
                        <small>
                          Added{" "}
                          {new Date(
                            memory.createdAt
                          ).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="care-empty-state">
              <Image size={31} />

              <h3>
                Memory Vault is empty
              </h3>

              <p>
                Add meaningful personal
                photographs and
                descriptions. Memories
                with photographs can
                support Photo Recall and
                other personalized
                experiences.
              </p>

              <button
                className="care-primary-button"
                onClick={
                  startAddMemory
                }
              >
                <Plus size={17} />
                Add first memory
              </button>
            </div>
          )}
        </section>
      </>
    );
  }

  // =====================================================
  // ROUTINE
  // =====================================================

  function renderRoutine() {
    const pendingCount =
      reminders.filter(
        (reminder) =>
          !reminder.status ||
          reminder.status === "pending"
      ).length;

    const completedCount =
      reminders.filter(
        (reminder) =>
          reminder.status === "completed"
      ).length;

    const snoozedCount =
      reminders.filter(
        (reminder) =>
          reminder.status === "snoozed"
      ).length;

    function formatReminderDate(
      value: string
    ) {
      if (!value) {
        return "No date";
      }

      const parsed =
        new Date(`${value}T00:00:00`);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return value;
      }

      return parsed.toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    }

    function statusLabel(
      reminder: ReminderItem
    ) {
      if (
        reminder.status === "completed"
      ) {
        return "Completed";
      }

      if (
        reminder.status === "snoozed"
      ) {
        return "Snoozed";
      }

      return "Pending";
    }

    return (
      <>
        <section className="care-page-heading care-page-heading-row">
          <div>
            <span className="care-eyebrow">
              DAILY SUPPORT
            </span>

            <h1>
              Routine & reminders
            </h1>

            <p>
              Create and manage everyday
              reminders for{" "}
              {patient?.name ||
                "the selected patient"}.
              Patient acknowledgement
              status appears here after
              they respond.
            </p>
          </div>

          <button
            className="care-primary-button"
            onClick={
              startAddReminder
            }
            disabled={
              !selectedPatientId
            }
          >
            <Plus size={17} />
            Add reminder
          </button>
        </section>

        <section className="care-stat-grid">
          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Bell size={22} />
            </div>

            <div>
              <span>
                Total reminders
              </span>
              <strong>
                {reminders.length}
              </strong>
              <small>
                Recorded for this patient
              </small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <span>
                Pending
              </span>
              <strong>
                {pendingCount}
              </strong>
              <small>
                Awaiting acknowledgement
              </small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Target size={22} />
            </div>

            <div>
              <span>
                Completed
              </span>
              <strong>
                {completedCount}
              </strong>
              <small>
                Marked done by patient
              </small>
            </div>
          </article>

          <article className="care-stat-card">
            <div className="care-stat-icon">
              <Activity size={22} />
            </div>

            <div>
              <span>
                Snoozed
              </span>
              <strong>
                {snoozedCount}
              </strong>
              <small>
                Deferred by patient
              </small>
            </div>
          </article>
        </section>

        {showReminderForm && (
          <section className="care-panel care-management-form">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">
                  {editingReminderId
                    ? "EDIT REMINDER"
                    : "NEW REMINDER"}
                </span>

                <h2>
                  {editingReminderId
                    ? "Update routine reminder"
                    : "Schedule a reminder"}
                </h2>
              </div>

              <button
                className="care-icon-button"
                onClick={
                  resetReminderForm
                }
                aria-label="Close reminder form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="care-management-fields">
              <label>
                <span>
                  Reminder title *
                </span>

                <input
                  type="text"
                  value={
                    reminderTitle
                  }
                  placeholder="Example: Evening walk"
                  onChange={(event) =>
                    setReminderTitle(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Description
                </span>

                <input
                  type="text"
                  value={
                    reminderDescription
                  }
                  placeholder="Optional short instruction"
                  onChange={(event) =>
                    setReminderDescription(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Date *
                </span>

                <input
                  type="date"
                  value={
                    reminderDate
                  }
                  onChange={(event) =>
                    setReminderDate(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Time *
                </span>

                <input
                  type="time"
                  value={
                    reminderTime
                  }
                  onChange={(event) =>
                    setReminderTime(
                      event.target.value
                    )
                  }
                />
              </label>
            </div>

            <div className="care-form-actions">
              <button
                className="care-secondary-button"
                onClick={
                  resetReminderForm
                }
              >
                Cancel
              </button>

              <button
                className="care-primary-button"
                disabled={
                  savingReminder
                }
                onClick={
                  handleSaveReminder
                }
              >
                <Save size={17} />

                {savingReminder
                  ? "Saving..."
                  : editingReminderId
                    ? "Save changes"
                    : "Add reminder"}
              </button>
            </div>
          </section>
        )}

        <section className="care-panel">
          <div className="care-panel-header">
            <div>
              <span className="care-section-label">
                REMINDERS
              </span>

              <h2>
                Patient routine
              </h2>
            </div>

            <div className="care-panel-header-actions">
              <span className="care-count-badge">
                {reminders.length}
              </span>

              <button
                className="care-text-button"
                onClick={
                  startAddReminder
                }
              >
                + Add reminder
              </button>
            </div>
          </div>

          {reminders.length > 0 ? (
            <div className="care-routine-grid">
              {reminders.map(
                (reminder) => {
                  const reminderId =
                    reminder._id ||
                    reminder.id ||
                    `${reminder.title}-${reminder.date}-${reminder.time}`;

                  const status =
                    reminder.status ||
                    "pending";

                  return (
                    <article
                      className="care-routine-card"
                      key={reminderId}
                    >
                      <div className="care-routine-icon">
                        <Bell size={20} />
                      </div>

                      <div>
                        <div className="care-routine-title-row">
                          <strong>
                            {reminder.title}
                          </strong>

                          <span
                            className={`care-level-badge care-reminder-status ${status}`}
                          >
                            {statusLabel(
                              reminder
                            )}
                          </span>
                        </div>

                        {reminder.description && (
                          <p>
                            {
                              reminder.description
                            }
                          </p>
                        )}

                        <div className="care-routine-meta">
                          <span>
                            <Clock3
                              size={15}
                            />
                            {reminder.time ||
                              "No time"}
                          </span>

                          <span>
                            {formatReminderDate(
                              reminder.date
                            )}
                          </span>
                        </div>

                        {status ===
                          "completed" &&
                          reminder.completedAt && (
                            <small>
                              Completed{" "}
                              {new Date(
                                reminder.completedAt
                              ).toLocaleString()}
                            </small>
                          )}

                        {status ===
                          "snoozed" &&
                          reminder.snoozedUntil && (
                            <small>
                              Snoozed until{" "}
                              {new Date(
                                reminder.snoozedUntil
                              ).toLocaleString()}
                            </small>
                          )}
                      </div>

                      <div className="care-record-actions">
                        <button
                          onClick={() =>
                            startEditReminder(
                              reminder
                            )
                          }
                          aria-label={`Edit ${reminder.title}`}
                          title="Edit reminder"
                        >
                          <Edit3 size={15} />
                        </button>

                        {status !==
                          "pending" && (
                          <button
                            onClick={() =>
                              handleResetReminder(
                                reminder
                              )
                            }
                            aria-label={`Reset ${reminder.title} to pending`}
                            title="Reset to pending"
                          >
                            <Clock3
                              size={15}
                            />
                          </button>
                        )}

                        <button
                          className="danger"
                          onClick={() =>
                            handleDeleteReminder(
                              reminder
                            )
                          }
                          aria-label={`Delete ${reminder.title}`}
                          title="Delete reminder"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="care-empty-state">
              <Bell size={30} />

              <h3>
                No reminders scheduled
              </h3>

              <p>
                Add the first routine
                reminder for this patient.
                It will be stored in
                MongoDB and shown in the
                patient experience.
              </p>

              <button
                className="care-primary-button"
                onClick={
                  startAddReminder
                }
              >
                <Plus size={17} />
                Add first reminder
              </button>
            </div>
          )}
        </section>
      </>
    );
  }

  // =====================================================
  // PATIENT MANAGEMENT
  // =====================================================

  function renderPatients() {
    return (
      <>
        <section className="care-page-heading care-page-heading-row">
          <div>
            <span className="care-eyebrow">
              PATIENT MANAGEMENT
            </span>

            <h1>
              Connected patients
            </h1>

            <p>
              Create and manage the
              patient profiles connected
              to this caregiver account.
            </p>
          </div>

          <button
            className="care-primary-button"
            onClick={() =>
              setShowAddPatient(true)
            }
          >
            <UserPlus size={18} />
            Add patient
          </button>
        </section>

        {showAddPatient && (
          <section className="care-panel">
            <div className="care-panel-header">
              <div>
                <span className="care-section-label">
                  NEW PATIENT
                </span>

                <h2>
                  Create patient profile
                </h2>
              </div>

              <button
                className="care-icon-button"
                onClick={() =>
                  setShowAddPatient(
                    false
                  )
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="care-form-grid">
              <label>
                <span>
                  Patient name
                </span>

                <input
                  type="text"
                  value={
                    newPatientName
                  }
                  placeholder="Enter patient name"
                  onChange={(
                    event
                  ) =>
                    setNewPatientName(
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Age
                </span>

                <input
                  type="number"
                  min="1"
                  max="120"
                  value={
                    newPatientAge
                  }
                  placeholder="Enter age"
                  onChange={(
                    event
                  ) =>
                    setNewPatientAge(
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Preferred language
                </span>

                <select
                  value={
                    newPatientLanguage
                  }
                  onChange={(
                    event
                  ) =>
                    setNewPatientLanguage(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="Assamese">
                    Assamese
                  </option>

                  <option value="English">
                    English
                  </option>

                  <option value="Hindi">
                    Hindi
                  </option>

                  <option value="Bengali">
                    Bengali
                  </option>

                  <option value="Bodo">
                    Bodo
                  </option>

                  <option value="Khasi">
                    Khasi
                  </option>

                  <option value="Mizo">
                    Mizo
                  </option>

                  <option value="Manipuri">
                    Manipuri / Meitei
                  </option>
                </select>
              </label>
            </div>

            <div className="care-form-actions">
              <button
                className="care-secondary-button"
                onClick={() =>
                  setShowAddPatient(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="care-primary-button"
                disabled={
                  creatingPatient
                }
                onClick={
                  handleCreatePatient
                }
              >
                <Plus size={18} />

                {creatingPatient
                  ? "Creating..."
                  : "Create patient"}
              </button>
            </div>
          </section>
        )}

        <section className="care-patient-grid">
          {patients.length > 0 ? (
            patients.map(
              (item) => (
                <article
                  className={`care-patient-card ${
                    selectedPatientId ===
                    item._id
                      ? "selected"
                      : ""
                  }`}
                  key={item._id}
                >
                  <div className="care-patient-avatar">
                    {item.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "P"}
                  </div>

                  <div className="care-patient-details">
                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Age {item.age} ·{" "}
                      {
                        item.language
                      }
                    </p>

                    <span>
                      Patient ID
                    </span>

                    <code>
                      {item._id}
                    </code>
                  </div>

                  <button
                    className="care-secondary-button"
                    onClick={() => {
                      setSelectedPatientId(
                        item._id
                      );

                      setActiveSection(
                        "overview"
                      );
                    }}
                  >
                    {selectedPatientId ===
                    item._id
                      ? "Selected"
                      : "View patient"}
                  </button>
                </article>
              )
            )
          ) : (
            <section className="care-panel care-empty-state">
              <Users size={34} />

              <h3>
                No patients connected
              </h3>

              <p>
                Create your first patient
                profile to begin.
              </p>

              {!showAddPatient && (
                <button
                  className="care-primary-button"
                  onClick={() =>
                    setShowAddPatient(
                      true
                    )
                  }
                >
                  <UserPlus
                    size={18}
                  />
                  Add patient
                </button>
              )}
            </section>
          )}
        </section>
      </>
    );
  }

  // =====================================================
  // MAIN CONTENT
  // =====================================================

  function renderContent() {
    if (
      activeSection === "patients"
    ) {
      return renderPatients();
    }

    if (!selectedPatientId) {
      return (
        <section className="care-no-patient">
          <div className="care-no-patient-icon">
            <Users size={34} />
          </div>

          <h1>
            Add your first patient
          </h1>

          <p>
            Create a patient profile to
            begin managing familiar
            memories, routines and
            activity information.
          </p>

          <button
            className="care-primary-button"
            onClick={() => {
              setActiveSection(
                "patients"
              );

              setShowAddPatient(
                true
              );
            }}
          >
            <UserPlus size={18} />
            Add patient
          </button>
        </section>
      );
    }

    if (loadingDashboard) {
      return (
        <section className="care-content-loading">
          <div className="care-loading-ring" />

          <p>
            Loading patient
            information...
          </p>
        </section>
      );
    }

    switch (activeSection) {
      case "progress":
        return renderProgress();

      case "family":
        return renderFamily();

      case "routine":
        return renderRoutine();

      case "overview":
      default:
        return renderOverview();
    }
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="care-app">
      {mobileMenuOpen && (
        <button
          className="care-mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          aria-label="Close menu"
        />
      )}

      <aside
        className={`care-sidebar ${
          mobileMenuOpen
            ? "open"
            : ""
        }`}
      >
        <div
          className="care-brand"
          onClick={() =>
            changeSection("overview")
          }
        >
          <div className="care-brand-mark">
            S
          </div>

          <div>
            <strong>
              SMRITI
            </strong>

            <span>
              Caregiver
            </span>
          </div>
        </div>

        <nav className="care-navigation">
          <span className="care-nav-heading">
            CARE
          </span>

          {navigationItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={item.id}
                  className={
                    activeSection ===
                    item.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeSection(
                      item.id
                    )
                  }
                >
                  <Icon
                    size={19}
                  />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            }
          )}
        </nav>

        <div className="care-sidebar-note">
          <Heart size={19} />

          <p>
            Designed to support familiar
            routines, memory engagement
            and caregiver connection.
          </p>
        </div>

        <button
          className="care-sidebar-logout"
          onClick={
            handleLogout
          }
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <div className="care-main">
        <header className="care-header">
          <div className="care-header-left">
            <button
              className="care-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  true
                )
              }
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="care-header-label">
                Selected patient
              </span>

              <strong>
                {patient?.name ||
                  (patients.length ===
                  0
                    ? "No patient selected"
                    : "Patient")}
              </strong>
            </div>
          </div>

          <div className="care-header-actions">
            {patients.length >
              0 && (
              <div className="care-patient-select">
                <User size={17} />

                <select
                  value={
                    selectedPatientId
                  }
                  onChange={(
                    event
                  ) => {
                    resetFamilyForm();
                    resetMemoryForm();

                    setSelectedPatientId(
                      event.target
                        .value
                    );
                  }}
                >
                  {patients.map(
                    (item) => (
                      <option
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {
                          item.name
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={16}
                />
              </div>
            )}

            {patient?.language && (
              <div className="care-language-chip">
                <Languages
                  size={17}
                />

                {
                  patient.language
                }
              </div>
            )}

            <div className="care-profile-chip">
              <div>
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "C"}
              </div>

              <span>
                {user?.name ||
                  "Caregiver"}
              </span>
            </div>
          </div>
        </header>

        {selectedPatientId &&
          patient && (
            <div className="care-patient-strip">
              <div>
                <div className="care-patient-strip-avatar">
                  {patient.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "P"}
                </div>

                <div>
                  <strong>
                    {patient.name}
                  </strong>

                  <span>
                    Age{" "}
                    {patient.age} ·{" "}
                    {
                      patient.language
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={
                  copyPatientId
                }
                title="Copy patient ID"
              >
                <Copy
                  size={16}
                />

                Copy Patient ID
              </button>
            </div>
          )}

        <main className="care-content">
          {renderContent()}
        </main>

        <footer className="care-footer">
          <p>
            SMRITI supports cognitive
            engagement, familiar routines
            and memory assistance. It
            does not diagnose, treat or
            replace professional
            healthcare.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default CaregiverDashboard;