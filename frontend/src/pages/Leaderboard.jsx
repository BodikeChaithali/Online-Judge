import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getLeaderboard } from "../services/leaderboardService";
import "./css/Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function getRankDisplay(rank) {
  if (rank <= 3) {
    return MEDALS[rank - 1];
  }
  return rank;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getLeaderboard();
        if (!cancelled) {
          setEntries(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load leaderboard");
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="leaderboard-page">
        <div className="leaderboard-content">
          <header className="leaderboard-header">
            <h1>Leaderboard</h1>
            <p>Ranked by difficulty-weighted score</p>
          </header>

          {loading && (
            <div className="leaderboard-state">Loading leaderboard...</div>
          )}

          {!loading && error && (
            <div className="leaderboard-state leaderboard-error">{error}</div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="leaderboard-state">
              No accepted submissions yet. Be the first to solve a problem!
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <div className="leaderboard-table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th className="numeric-col">Solved</th>
                    <th className="numeric-col">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.userId || entry.email || entry.rank}
                      className={entry.rank <= 3 ? `top-${entry.rank}` : ""}
                    >
                      <td className="rank-cell">
                        <span
                          className={
                            entry.rank <= 3 ? "rank-medal" : "rank-number"
                          }
                        >
                          {getRankDisplay(entry.rank)}
                        </span>
                      </td>
                      <td className="username-cell">
                        <div className="username-cell-inner">
                          <div className="username-avatar">
                            {(entry.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <span>{entry.username || "Anonymous"}</span>
                        </div>
                      </td>
                      <td className="solved-cell">{entry.solved}</td>
                      <td className="score-cell">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
