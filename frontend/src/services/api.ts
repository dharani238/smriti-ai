const API_BASE_URL = "http://localhost:5001/api";

// ======================================================
// COMMON HELPERS
// ======================================================

async function readJsonResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

// ======================================================
// AUTHENTICATION
// ======================================================

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return readJsonResponse(response);
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  patientId?: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// PATIENTS
// ======================================================

export async function getPatient(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/patients/${patientId}`
  );

  return readJsonResponse(response);
}

export async function getPatientsByCaregiver(
  caregiverId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/patients/caregiver/${caregiverId}`
  );

  const data =
    await readJsonResponse(response);

  return data.patients || [];
}

export async function createPatient(data: {
  name: string;
  age: number;
  language: string;
  caregiverId: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/patients`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// FAMILY MEMBERS
// ======================================================

export async function getFamilyMembers(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/family/${patientId}`
  );

  const data =
    await readJsonResponse(response);

  return (data.familyMembers || []).map(
    (member: any) => ({
      id:
        member.id ||
        member._id,

      _id:
        member._id ||
        member.id,

      name:
        member.name,

      relation:
        member.relationship ||
        member.relation ||
        "family member",

      relationship:
        member.relationship ||
        member.relation ||
        "family member",

      age:
        member.age,

      photo:
        member.photo || "",

      createdAt:
        member.createdAt,

      updatedAt:
        member.updatedAt,
    })
  );
}

export async function addFamilyMember(data: {
  patientId: string;
  name: string;
  relationship: string;
  age?: number;
  photo?: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/family`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

export async function updateFamilyMember(
  familyMemberId: string,
  data: {
    patientId: string;
    name: string;
    relationship: string;
    age?: number;
    photo?: string;
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/family/${familyMemberId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

export async function deleteFamilyMember(
  familyMemberId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/family/${familyMemberId}`,
    {
      method: "DELETE",
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// MEMORIES
// ======================================================

export async function getMemories(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/memories/${patientId}`
  );

  const data =
    await readJsonResponse(response);

  return (data.memories || []).map(
    (memory: any) => ({
      id:
        memory.id ||
        memory._id,

      _id:
        memory._id ||
        memory.id,

      title:
        memory.title,

      description:
        memory.description,

      category:
        memory.category,

      photo:
        memory.photo || "",

      createdAt:
        memory.createdAt,

      updatedAt:
        memory.updatedAt,
    })
  );
}

export async function addMemory(data: {
  patientId: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/memories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

export async function updateMemory(
  memoryId: string,
  data: {
    patientId: string;
    title: string;
    description: string;
    category: string;
    photo?: string;
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/memories/${memoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

export async function deleteMemory(
  memoryId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/memories/${memoryId}`,
    {
      method: "DELETE",
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// REMINDERS
// ======================================================

export async function getReminders(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${patientId}`
  );

  const data =
    await readJsonResponse(response);

  return data.reminders || [];
}

export async function addReminder(data: {
  patientId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/reminders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// UPDATE REMINDER
// ======================================================

export async function updateReminder(
  reminderId: string,
  data: {
    patientId: string;
    title: string;
    description?: string;
    date: string;
    time: string;
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${reminderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// DELETE REMINDER
// ======================================================

export async function deleteReminder(
  reminderId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${reminderId}`,
    {
      method: "DELETE",
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// COMPLETE REMINDER
// ======================================================

export async function completeReminder(
  reminderId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${reminderId}/complete`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// SNOOZE REMINDER
// ======================================================

export async function snoozeReminder(
  reminderId: string,
  minutes: number = 10
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${reminderId}/snooze`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minutes,
      }),
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// RESET REMINDER
// ======================================================

export async function resetReminder(
  reminderId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/reminders/${reminderId}/pending`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// GAME SESSIONS
// ======================================================

export type GameDifficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type GameSessionData = {
  patientId: string;
  gameName: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  difficulty: string;
};

export async function saveGameSession(
  data: GameSessionData
) {
  const response = await fetch(
    `${API_BASE_URL}/game-sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

export async function getGameSessions(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/game-sessions/${patientId}`
  );

  const data =
    await readJsonResponse(response);

  return data.gameSessions || [];
}

// ======================================================
// RECOMMENDATIONS
// ======================================================

export type RecommendationDifficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type RecommendationData = {
  patientId: string;
  gameName: string;

  currentDifficulty:
    RecommendationDifficulty;

  recommendedDifficulty:
    RecommendationDifficulty;

  reason: string;
  accuracy: number;
};

// ======================================================
// SAVE RECOMMENDATION
// ======================================================

export async function saveRecommendation(
  data: RecommendationData
) {
  const response = await fetch(
    `${API_BASE_URL}/recommendations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return readJsonResponse(response);
}

// ======================================================
// GET ALL RECOMMENDATIONS
// ======================================================

export async function getRecommendations(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/${patientId}`
  );

  const data =
    await readJsonResponse(response);

  return data.recommendations || [];
}

// ======================================================
// GET LATEST PATIENT RECOMMENDATION
// ======================================================

export async function getLatestRecommendation(
  patientId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/${patientId}/latest`
  );

  const data =
    await readJsonResponse(response);

  return data.recommendation || null;
}

// ======================================================
// GET LATEST RECOMMENDATION FOR A GAME
// ======================================================

export async function getLatestGameRecommendation(
  patientId: string,
  gameName: string
) {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/${patientId}/game/${encodeURIComponent(
      gameName
    )}`
  );

  const data =
    await readJsonResponse(response);

  return data.recommendation || null;
}

// ======================================================
// MEMORY ASSISTANT
// ======================================================

export async function askAssistant(
  question: string,
  patientId: string
) {
  try {
    const [
      memories,
      familyMembers,
    ] = await Promise.all([
      getMemories(patientId),
      getFamilyMembers(patientId),
    ]);

    const lowerQuestion =
      question
        .toLowerCase()
        .replace(
          /[?.,!]/g,
          ""
        )
        .trim();

    // ==================================================
    // SEARCH FAMILY MEMBERS FIRST
    // ==================================================

    const familyMember =
      familyMembers.find(
        (member: any) => {
          const name =
            (
              member.name ||
              ""
            )
              .toLowerCase()
              .trim();

          if (!name) {
            return false;
          }

          return (
            lowerQuestion.includes(
              name
            ) ||
            name.includes(
              lowerQuestion
            )
          );
        }
      );

    if (familyMember) {
      const relationship =
        familyMember.relation ||
        familyMember.relationship ||
        "family member";

      let answer =
        `${familyMember.name} is your ${relationship}`;

      if (
        familyMember.age
      ) {
        answer +=
          `. ${familyMember.name} is ${familyMember.age} years old`;
      }

      return {
        answer:
          answer + ".",
      };
    }

    // ==================================================
    // SEARCH CAREGIVER MEMORIES
    // ==================================================

    const stopWords = [
      "who",
      "what",
      "where",
      "when",
      "why",
      "how",
      "is",
      "are",
      "was",
      "were",
      "the",
      "a",
      "an",
      "my",
      "me",
      "your",
      "about",
      "tell",
      "please",
      "can",
      "you",
    ];

    const questionWords =
      lowerQuestion
        .split(/\s+/)
        .filter(
          (
            word: string
          ) =>
            word.length >
              2 &&
            !stopWords.includes(
              word
            )
        );

    const matchingMemory =
      memories.find(
        (memory: any) => {
          const memoryText =
            `${memory.title} ${memory.description} ${memory.category}`
              .toLowerCase();

          return questionWords.some(
            (
              word: string
            ) =>
              memoryText.includes(
                word
              )
          );
        }
      );

    if (matchingMemory) {
      return {
        answer:
          matchingMemory.description,
      };
    }

    return {
      answer:
        "I don't have that information in the memories provided by your caregiver.",
    };
  } catch (error) {
    console.error(
      "Memory Assistant error:",
      error
    );

    return {
      answer:
        "Sorry, I could not retrieve your memory information right now.",
    };
  }
}