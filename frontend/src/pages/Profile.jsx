import Navbar from "../components/Navbar";
import "./css/Profile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteUser } from "../services/authService";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) 
    return null;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const email = user.email;
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
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

  return (
    <>
      <Navbar />
      <div className="profile-page">
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
              <span>Name</span>
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
      </div>
    </>
  );
}
