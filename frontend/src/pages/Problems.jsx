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
        difficulty === "All" ||
        problem.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <>
      <Navbar />
      <div className="problems-page">
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
            Filters
          </button>
        </div>
        {showFilters && (
          <div className="difficulty-filters">
            <button
              className={difficulty === "All" ? "active-filter" : ""}
              onClick={() => setDifficulty("All")}
            >
              All
            </button>
            <button
              className={difficulty === "Easy" ? "active-filter" : ""}
              onClick={() => setDifficulty("Easy")}
            >
              Easy
            </button>
            <button
              className={difficulty === "Medium" ? "active-filter" : ""}
              onClick={() => setDifficulty("Medium")}
            >
              Medium
            </button>
            <button
              className={difficulty === "Hard" ? "active-filter" : ""}
              onClick={() => setDifficulty("Hard")}
            >
              Hard
            </button>
          </div>
        )}
        <div className="problems-container">
          {filteredProblems.length === 0 ? (
            <div className="no-problems">
              No Problems Available
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <Link
                key={problem.id}
                to={`/problems/${problem.id}`}
                className="problem-card"
              >
                <span className="problem-title">
                  {problem.title}
                </span>

                <span
                  className={`difficulty ${problem.difficulty.toLowerCase()}`}
                >
                  {problem.difficulty}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}