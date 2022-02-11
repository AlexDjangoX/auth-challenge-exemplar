import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const apiUrl = 'http://localhost:4000';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then(res => res.json())
      .then(res => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const response = await fetch(`${apiUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const json = await response.json();

    console.log(json);
  };

  const handleLogin = async ({ username, password }) => {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const json = await response.json();

    localStorage.setItem('token', json.data);
  };
  
  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const response = await fetch(`${apiUrl}/movie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, runtimeMins })
    });

    const json = await response.json();

    setMovies([...movies, json.data]);
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
