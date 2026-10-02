import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getProblems, getProblemStatuses } from "../services/problemsService";
import "./css/Problems.css";

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  const unique = new Map();
  tags.forEach((raw) => {
    const label = String(raw ?? "").trim();
    const key = label.toLowerCase();
    if (key && !unique.has(key)) unique.set(key, { key, label });
  });
  return [...unique.values()];
}

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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const allTags = useMemo(() => {
    const counts = new Map();
    problems.forEach((problem) => {
      normalizeTags(problem.tags).forEach(({ key, label }) => {
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { key, label, count: 1 });
      });
    });
    return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [problems]);
  const tagLabels = useMemo(
    () => new Map(allTags.map((tag) => [tag.key, tag.label])),
    [allTags],
  );

  const selectedDifficulties = useMemo(() => {
    const picked = new Set(
      searchParams.getAll("difficulty").map((value) => value.toLowerCase()),
    );
    return DIFFICULTY_LEVELS.filter((level) => picked.has(level.toLowerCase()));
  }, [searchParams]);
  const selectedTags = useMemo(() => {
    const known = new Set(allTags.map((tag) => tag.key));
    return searchParams.getAll("tag").filter((key) => known.has(key));
  }, [searchParams, allTags]);

  const updateParams = (change) => {
    const next = new URLSearchParams(searchParams);
    change(next);
    setSearchParams(next, { replace: true });
  };

  const toggleDifficulty = (level) =>
  updateParams((params) => {
    const next = selectedDifficulties.includes(level)
      ? selectedDifficulties.filter((l) => l !== level)
      : [...selectedDifficulties, level];
    params.delete("difficulty");
    if (next.length < DIFFICULTY_LEVELS.length) {
      next.forEach((l) => params.append("difficulty", l));
    }
  });

const clearDifficulties = () =>
  updateParams((params) => params.delete("difficulty"));

  const toggleTag = (key) =>
    updateParams((params) => {
      const current = params.getAll("tag");
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      params.delete("tag");
      next.forEach((k) => params.append("tag", k));
    });

  const clearTags = () => updateParams((params) => params.delete("tag"));

  const clearFilters = () => {
    setSearch("");
    updateParams((params) => {
      params.delete("tag");
      params.delete("difficulty");
    });
  };

  const activeFilterCount = selectedTags.length + selectedDifficulties.length;
  const hasActiveFilters = activeFilterCount > 0 || search !== "";

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(problem.difficulty);
      const matchesTags =
        selectedTags.length === 0 ||
        normalizeTags(problem.tags).some((tag) =>
          selectedTags.includes(tag.key),
        );
      return matchesSearch && matchesDifficulty && matchesTags;
    });
  }, [problems, search, selectedDifficulties, selectedTags]);

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
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <Filter size={18} />
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
            {showFilters && (
              <div className="difficulty-filters">
                <button
                  className={selectedDifficulties.length === 0 ? "active-filter" : ""}
                  aria-pressed={selectedDifficulties.length === 0}
                  onClick={clearDifficulties}
                >
                  All
                </button>
                {DIFFICULTY_LEVELS.map((level) => {
                  const active = selectedDifficulties.includes(level);
                    return (
                      <button
                        key={level}
                        className={active ? "active-filter" : ""}
                        aria-pressed={active}
                        onClick={() => toggleDifficulty(level)}
                      >
                        {level}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
          {showFilters && allTags.length > 0 && (
            <div className="tag-filters">
              <span className="tag-filters-label">Topics</span>
              {allTags.map(({ key, label, count }) => {
                const active = selectedTags.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    className={`tag-chip${active ? " active" : ""}`}
                    onClick={() => toggleTag(key)}
                  >
                    {label}
                    <span className="tag-count">{count}</span>
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button type="button" className="tag-clear" onClick={clearTags}>
                  Clear topics
                </button>
              )}
            </div>
          )}
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
                <div className="no-problems">
                  {problems.length > 0
                    ? "No problems match your filters"
                    : "No Problems Available"}
                  {problems.length > 0 && hasActiveFilters && (
                    <div>
                      <button
                        type="button"
                        className="clear-filters-btn"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              )}

            {!problemsLoading &&
              !problemsError &&
              filteredProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="problem-card"
                >
                  <div className="problem-main">
                    <span className="problem-title">
                      {problem.id}. {problem.title}
                    </span>
                    {normalizeTags(problem.tags).length > 0 && (
                      <div className="card-tags">
                        {normalizeTags(problem.tags).map(({ key }) => (
                          <span
                            key={key}
                            className={`card-tag${
                              selectedTags.includes(key) ? " matched" : ""
                            }`}
                          >
                            {tagLabels.get(key)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
