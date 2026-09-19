import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getGameSessions } from "../services/api";

function Progress() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const patientId = user?.patientId;

  useEffect(() => {
    async function loadProgress() {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        const gameSessions =
          await getGameSessions(patientId);

        setSessions(gameSessions);
      } catch (error) {
        console.error(
          "Failed to load progress:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [patientId]);

  const chartData = sessions
    .slice()
    .reverse()
    .map((session: any, index: number) => ({
      game: `${session.gameName} ${index + 1}`,
      accuracy: session.accuracy,
    }));

  const latestSession =
    sessions.length > 0 ? sessions[0] : null;

  return (
    <div className="page-container">
      <h1>📊 My Progress</h1>

      <p>
        Track your performance across cognitive
        games.
      </p>

      {loading ? (
        <p>Loading your progress...</p>
      ) : sessions.length === 0 ? (
        <div className="family-card">
          <h2>🧠 No Game Results Yet</h2>

          <p>
            Play a cognitive game to start
            tracking your progress.
          </p>
        </div>
      ) : (
        <>
          {/* Latest Performance */}
          <div className="family-card">
            <h2>⭐ Latest Performance</h2>

            <p>
              <strong>Game:</strong>{" "}
              {latestSession.gameName}
            </p>

            <p>
              <strong>Score:</strong>{" "}
              {latestSession.score}
            </p>

            <p>
              <strong>Accuracy:</strong>{" "}
              {latestSession.accuracy}%
            </p>

            <p>
              <strong>Difficulty:</strong>{" "}
              {latestSession.difficulty}
            </p>
          </div>

          {/* Progress Chart */}
          <div className="family-card">
            <h2>📈 Accuracy Progress</h2>

            <div
              className="chart-container"
              style={{
                width: "100%",
                height: "350px",
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart data={chartData}>
                  <CartesianGrid />

                  <XAxis dataKey="game" />

                  <YAxis
                    domain={[0, 100]}
                    label={{
                      value: "Accuracy (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Game History */}
          <div className="family-card">
            <h2>🎮 Game History</h2>

            {sessions.map(
              (session: any) => (
                <div
                  key={session._id}
                  className="reminder-card"
                >
                  <h3>
                    {session.gameName}
                  </h3>

                  <p>
                    🎯 Accuracy:{" "}
                    {session.accuracy}%
                  </p>

                  <p>
                    🏆 Score:{" "}
                    {session.score}
                  </p>

                  <p>
                    📊 Difficulty:{" "}
                    {session.difficulty}
                  </p>

                  <p>
                    📅{" "}
                    {new Date(
                      session.playedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;