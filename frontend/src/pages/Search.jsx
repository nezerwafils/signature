import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchUsers } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await searchUsers(query);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Search Users</h1>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for users..."
            className="search-input"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {loading && <div className="loading">Searching...</div>}

      {!loading && searched && (
        <div className="search-results">
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users found matching "{query}"</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  className="user-card"
                >
                  <div className="user-avatar">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.username} />
                    ) : (
                      <span>{user.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div className="user-details">
                    <h3>{user.displayName || user.username}</h3>
                    <p>@{user.username}</p>
                    {user.bio && <p className="user-bio">{user.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
