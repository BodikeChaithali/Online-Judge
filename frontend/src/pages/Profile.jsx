import Navbar from "../components/Navbar";
import "./css/Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteUser } from "../services/authService";
import { getProfileStats } from "../services/profileService";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError("");

      try {
        const data = await getProfileStats();
        if (!cancelled) {
          setStats(data);
        }
      } catch (err) {
        if (!cancelled) {
          setStatsError(err.message || "Unable to load statistics");
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  const firstName = user.firstName;
  const lastName = user.lastName;
  const email = user.email;

  const handleDelete = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Please enter your password.");
      return;
    }
    try {
      await deleteUser(deletePassword);
      await logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const formatRank = (rank) => (rank ? `#${rank}` : "Unranked");
  const formatRate = (rate) =>
    typeof rate === "number" ? `${rate.toFixed(2)}%` : "0.00%";

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <h1>
              {firstName} {lastName}
            </h1>
            <p>{email}</p>
            <div className="profile-info">
              <div className="info-item">
                <span>Username</span>
                <strong>
                  {firstName} {lastName}
                </strong>
              </div>
              <div className="info-item">
                <span>Email</span>
                <strong>{email}</strong>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="update-btn"
                onClick={() => navigate("/update-profile")}
              >
                Update Profile
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  setShowDeleteBox(!showDeleteBox);
                  setDeleteError("");
                }}
              >
                Delete Account
              </button>
              <button
                className="logout-btn"
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
            {showDeleteBox && (
              <div className="delete-box">
                <h3>Delete Account</h3>
                <p>Enter your password to permanently delete your account.</p>
                <input
                  type="password"
                  placeholder="Password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError("");
                  }}
                />
                {deleteError && (
                  <div className="error-message">{deleteError}</div>
                )}
                <button className="confirm-delete-btn" onClick={handleDelete}>
                  Confirm Delete
                </button>
              </div>
            )}
          </div>

          <section className="profile-stats">
            <h2>Statistics</h2>

            {statsLoading && (
              <div className="stats-state">Loading statistics...</div>
            )}

            {!statsLoading && statsError && (
              <div className="stats-state stats-error">{statsError}</div>
            )}

            {!statsLoading && !statsError && stats && (
              <>
                <div className="stats-grid stats-grid-2">
                  <StatCard label="Rank" value={formatRank(stats.rank)} />
                  <StatCard label="Score" value={stats.score ?? 0} />
                </div>

                <div className="stats-grid stats-grid-2">
                  <StatCard label="Solved" value={stats.solved ?? 0} />
                  <StatCard
                    label="Acceptance Rate"
                    value={formatRate(stats.acceptanceRate)}
                  />
                </div>

                <div className="stats-grid stats-grid-3">
                  <StatCard label="Easy" value={stats.easy ?? 0} />
                  <StatCard label="Medium" value={stats.medium ?? 0} />
                  <StatCard label="Hard" value={stats.hard ?? 0} />
                </div>

                <div className="stats-grid stats-grid-3">
                  <StatCard
                    label="Total Submissions"
                    value={stats.totalSubmissions ?? 0}
                  />
                  <StatCard label="Accepted" value={stats.accepted ?? 0} />
                  <StatCard
                    label="Wrong Answer"
                    value={stats.wrongAnswer ?? 0}
                  />
                </div>

                <div className="stats-grid stats-grid-3">
                  <StatCard
                    label="TLE"
                    value={stats.timeLimitExceeded ?? 0}
                  />
                  <StatCard
                    label="Runtime Error"
                    value={stats.runtimeError ?? 0}
                  />
                  <StatCard
                    label="Compilation Error"
                    value={stats.compilationError ?? 0}
                  />
                </div>

                {stats.totalSubmissions === 0 && (
                  <p className="stats-empty-note">
                    No submissions yet. Start solving problems to build your
                    stats.
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
