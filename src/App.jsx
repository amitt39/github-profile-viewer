import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSearch(e) {
    setUsername(e.target.value);
  }

  const fetchUser = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter username.");
      return;
    }

    setIsLoading(true);
    setProfileData(null);
    setRepos([]);
    setError("");
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      setError("User not found");
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    const reposData = await fetch(
      `https://api.github.com/users/${username}/repos`,
    );
    const repos = await reposData.json();
    setProfileData(data);
    setRepos(repos);
    setIsLoading(false);
    setUsername("");
    setError("");
  };

  return (
    <>
      <form onSubmit={fetchUser}>
        <input
          type="text"
          value={username}
          onChange={handleSearch}
          placeholder="Enter github username..."
        />
        <input type="submit" value={isLoading ? "Seraching..." : "Search"} />
      </form>
      {isLoading && <p>Loading...</p>}
      {error !== "" && <p>{error}</p>}
      {profileData && (
        <div>
          <img src={profileData.avatar_url} alt="" />
          <p>{profileData.login}</p>
          <p>{profileData.bio}</p>

          {repos.map((r) => {
            return (
              <li key={r.id}>
                <a href={r.html_url} target="_blank">
                  {r.name}
                </a>
              </li>
            );
          })}
        </div>
      )}
    </>
  );
}

export default App;
