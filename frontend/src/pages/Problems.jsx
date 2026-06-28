import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getProblems, getProblemStatuses } from "../services/problemsService";
import "./css/Problems.css";

function getActionLabel(status) {
  if (status === "Solved") return "Solved";
  if (status === "Attempted") return "Continue";
  return "Solve";
}

function ProblemAction({ status }) {
  const label = getActionLabel(status);

  if (status === "Solved") {
    return (
      <span className="problem-action solved-action">
        <Check size={16} />
        {label}
      </span>
    );
  }

  if (status === "Attempted") {
    return <span className="problem-action attempt-action">{label}</span>;
  }

  return <span className="problem-action solve-action">{label}</span>;
}

export default function Problems() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [problemsError, setProblemsError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [statusMap, setStatusMap] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProblems = async () => {
      setProblemsLoading(true);
      setProblemsError("");

      try {
        const data = await getProblems();
        if (!cancelled) {
          setProblems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setProblems([]);
          setProblemsError(err.message || "Unable to load problems");
        }
      } finally {
        if (!cancelled) {
          setProblemsLoading(false);
        }
      }
    };

    fetchProblems();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setStatusMap({});
      return;
    }

    let cancelled = false;

    const fetchStatuses = async () => {
      setStatusLoading(true);

      try {
        const statuses = await getProblemStatuses();
        if (!cancelled) {
          const map = {};
          statuses.forEach((item) => {
            map[item.problemId] = item.status;
          });
          setStatusMap(map);
        }
      } catch {
        if (!cancelled) {
          setStatusMap({});
        }
      } finally {
        if (!cancelled) {
          setStatusLoading(false);
        }
      }
    };

    fetchStatuses();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficulty]);

  const getProblemStatus = (problemId) => {
    if (!user) return "Not Attempted";
    return statusMap[String(problemId)] || "Not Attempted";
  };

  return (
    <>
      <Navbar />
      <div className="problems-page">
        <div className="problems-content">
          <div className="problems-toolbar">
            <input
              type="text"
              placeholder="Search problems..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
            </button>
            {showFilters && (
              <div className="difficulty-filters">
                {["All", "Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    className={difficulty === level ? "active-filter" : ""}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="problems-container">
            {problemsLoading && (
              <div className="no-problems">Loading problems...</div>
            )}

            {!problemsLoading && problemsError && (
              <div className="no-problems">{problemsError}</div>
            )}

            {!problemsLoading &&
              !problemsError &&
              filteredProblems.length === 0 && (
                <div className="no-problems">No Problems Available</div>
              )}

            {!problemsLoading &&
              !problemsError &&
              filteredProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="problem-card"
                >
                  <span className="problem-title">
                    {problem.id}. {problem.title}
                  </span>
                  <div className="problem-right">
                    <span
                      className={`difficulty ${problem.difficulty.toLowerCase()}`}
                    >
                      {problem.difficulty}
                    </span>
                    {statusLoading && user ? (
                      <span className="problem-action loading-action">...</span>
                    ) : (
                      <ProblemAction status={getProblemStatus(problem.id)} />
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
