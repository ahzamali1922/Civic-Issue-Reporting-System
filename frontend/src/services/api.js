const API_BASE = "http://127.0.0.1:8000";

// fetch logged-in user's issues
export async function getMyIssues() {
    const response = await fetch(`${API_BASE}/api/my-issues/`, {
        credentials: "include", // VERY IMPORTANT
    });

    if (!response.ok) {
        throw new Error("Not authenticated");
    }

    return response.json();
}
