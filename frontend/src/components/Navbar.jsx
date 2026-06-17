import { Link } from "react-router-dom";
import "./css/Navbar.css";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const firstName = user?.firstName?.split(" ")[0] || "";
  const initial = firstName.charAt(0).toUpperCase();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          <img src="/favicon.svg" alt="logo" className="brand-logo" />
          <h2>OnlineJudge</h2>
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/problems" className="nav-link">
              Problems
            </Link>
            <Link to="/profile" className="profile-link">
              <div className="avatar">{initial}</div>
              <span>{firstName}</span>
            </Link>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
