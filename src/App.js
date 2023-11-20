import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task) { // Vérifie si la chaîne de caractères 'task' n'est pas vide
      setTasks([...tasks, task]); // Ajoute la nouvelle tâche à la liste des tâches
      setTask(''); // Réinitialise l'entrée après l'ajout
    }
  };

  const deleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete)); // Supprime la tâche de la liste
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SimpleTasker</h1>
        <div>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
          />
          <button onClick={addTask}>Ajouter</button>
        </div>
        <ul>
          {tasks.map((t, index) => (
            <li key={index}>
              {t}
              <button onClick={() => deleteTask(index)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;