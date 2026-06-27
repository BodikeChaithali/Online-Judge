import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./css/UpdateProfile.css";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!newEmail && !newPassword) {
      setError("Please enter a new email or password.");
      return;
    }
    try {
      await updateUser({
        email: user.email,
        password,
        newEmail,
        newPassword,
      });
      const updatedUser = {
        ...user,
        email: newEmail || user.email,
      };
      setUser(updatedUser);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="update-page">
        <form className="update-card" onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <p className="update-subtitle">
            Update your email, password, or both.
          </p>
          <input type="email" value={user.email} readOnly />
          <input
            type="password"
            placeholder="Current Password *"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />
          <input
            type="email"
            placeholder="New Email (Optional)"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setError("");
            }}
          />
          <input
            type="password"
            placeholder="New Password (Optional)"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </>
  );
}
