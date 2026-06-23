import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./css/Landing.css";

export default function Landing() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="landing">
      <Navbar />
      <section className="hero">
        <h1>Master Competitive Programming</h1>
        <p>
          Practice coding problems, improve problem-solving skills, participate
          in contests, and track your progress with OnlineJudge.
        </p>
        <div className="hero-buttons">
          <>
            <Link to="/problems" className="primary-btn">
              Start Solving
            </Link>
            {!user && (
              <Link to="/register" className="secondary-btn">
                Create Account
              </Link>
            )}
          </>
        </div>
      </section>
      <footer className="footer">
        © 2026 OnlineJudge. All Rights Reserved.
      </footer>
    </div>
  );
}
