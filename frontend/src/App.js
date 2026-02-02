import { useEffect, useState } from "react";
import { getMyIssues } from "./services/api";

function App() {
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getMyIssues()
            .then(data => setIssues(data))
            .catch(() => setError("User not logged in"));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>React ↔ Django API Test</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {issues.map(issue => (
                <div key={issue.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <h4>{issue.title}</h4>
                    <p>Status: {issue.status}</p>
                </div>
            ))}
        </div>
    );
}

export default App;
