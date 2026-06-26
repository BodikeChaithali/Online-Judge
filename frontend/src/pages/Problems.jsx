import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { problems } from "../data/problems";
import "./css/Problems.css";

export default function Problems() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

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
            {filteredProblems.length === 0 ? (
              <div className="no-problems">No Problems Available</div>
            ) : (
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
                    <span className="problem-action">
                      {problem.completed ? "✓" : "-"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
