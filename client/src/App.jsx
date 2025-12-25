import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [businessType, setBusinessType] = useState("");
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);


  const generateIdeas = async () => {
    if (!businessType.trim()) return;
    setLoading(true);
    setIdeas(null);
    try {
      // Use environment variable for the server URL, default to localhost for development
      const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
      const response = await axios.post(`${API_URL}/generate`, { businessType });
      setIdeas(response.data);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "Error generating ideas";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>💡 AI Business Architect</h1>
      <p className="subtitle">Instant ideas for your next big venture!</p>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter your Business Type (e.g. Bakery, Tech Startup)..."
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
        />
        <button onClick={generateIdeas} disabled={loading}>
          {loading ? "Dreaming..." : "Generate Ideas"}
        </button>
      </div>

      <div className="result-area">
        {ideas ? (
          <div className="ideas-grid">
            <div className="idea-card">
              <h2>🚀 Business Ideas</h2>
              <ul>
                {ideas.businessIdeas?.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>

            <div className="idea-card">
              <h2>📈 Marketing Ideas</h2>
              <ul>
                {ideas.marketingIdeas?.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>

            <div className="idea-card">
              <h2>📝 Content Ideas</h2>
              <ul>
                {ideas.contentIdeas?.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="placeholder-text">
            <p>Enter a business type and click Generate to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
