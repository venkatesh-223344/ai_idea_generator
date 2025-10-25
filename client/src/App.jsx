import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/generate", { topic });
    setIdeas(res.data.ideas);
  };

  return (
    <div className="app">
      <h1>💡 AI Idea Generator</h1>
      <form onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <button type="submit">Generate</button>
      </form>

      <ul>
        {ideas.map((idea, i) => (
          <li key={i}>{idea}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
