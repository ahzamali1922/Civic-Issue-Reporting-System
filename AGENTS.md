# AGENTS.md — Civic Issue Reporting System V2

## Project purpose
Build Version 2 of the Civic Issue Reporting System: a web application that lets citizens report civic problems, helps administrators manage and assign reports, and uses ML to assist with issue classification and prioritization.

Typical issue categories include road damage/potholes, garbage, water leakage, faulty streetlights/electrical issues, drainage, fallen trees, damaged structures, broken signs, and graffiti. Keep category names consistent across the frontend, backend, and ML pipeline.

## Existing stack and repository layout
Preserve the existing stack unless the project owner explicitly approves a change:
- `backend/`: Python and Django; REST APIs should use Django REST Framework where appropriate.
- `frontend/`: React and Node.js tooling.
- `ml/`: independent Python environment and ML training/inference code.
- `backend/requirements.txt`: backend Python dependencies.
- `frontend/package.json` and lockfile: frontend dependencies.
- `ml/requirements.txt`: ML Python dependencies and tooling.
- Root `.gitignore`: ignore virtual environments, node_modules, secrets, datasets, caches, and generated artifacts.

Do not merge the backend and ML dependency environments without a clear technical reason. Keep model artifacts and large datasets out of ordinary Git history when appropriate; do not accidentally ignore model files required for inference.

## Current working direction
The repository's `main` branch represents the existing/stable version. Version 2 work should happen on its development branch and be planned for eventual review, merging into `main`, and deployment. Do not rewrite or force-push `main`, delete existing work, or perform destructive Git operations unless the user explicitly asks.

Begin unfamiliar work by inspecting the repository and its existing `README`, application structure, routes, models, serializers, views, tests, frontend pages, and ML scripts. Prefer an audit and a phased roadmap before large refactors.

## Engineering principles
1. Make small, reviewable changes that fit the current architecture.
2. Inspect existing code before creating replacement files; preserve working functionality.
3. Keep API contracts consistent between Django and React. Document endpoint changes and update callers.
4. Validate user input on the backend. Never trust frontend-only validation.
5. Keep secrets in environment variables. Commit `.env.example` with placeholder names, never real credentials.
6. Do not commit `.venv/`, `node_modules/`, datasets, local databases, logs, caches, or machine-specific paths.
7. Use migrations for Django model changes. Do not edit already-applied migrations casually.
8. Add or update tests for behavior changes and bug fixes.
9. Handle ML inference failures gracefully. The application should remain usable if a model is unavailable, and should distinguish model predictions from confirmed human decisions.
10. Avoid claiming that a model is accurate or production-ready without evaluation evidence. Track evaluation metrics and document limitations.
11. Use clear names, type hints where helpful, and concise comments that explain non-obvious decisions.
12. Do not add new frameworks or infrastructure unless they solve a documented need.

## ML context
The earlier project used:
- MobileNetV2 / TensorFlow for image classification.
- TF-IDF with Logistic Regression for text classification.
- Scikit-learn/joblib for text model and vectorizer persistence.
- Image and text predictions as assistance for issue categorization; geolocation and transparent rules may contribute to prioritization.

Previously reported results were approximately 96.1% image-classification accuracy and 82.5% text-classification accuracy. Treat these as historical reported results, not guaranteed current performance. Re-run evaluation on the current dataset/split before using them in documentation or deployment claims.

The previous image classes included:
`BROKEN_SIGN`, `DAMAGED_STRUCTURE`, `ELECTRICAL`, `FALLEN_TREE`, `GARBAGE`, `GRAFFITI`, `ROAD_DAMAGE`.

Before changing classes, inspect the current dataset, labels, saved model, preprocessing, and backend mapping. Ensure training and inference use identical preprocessing and class-index mappings.

## Development workflow
For each task:
1. Inspect the relevant files and current Git state.
2. Summarize the intended change and any assumptions.
3. Implement the smallest complete solution.
4. Run relevant tests, linting, builds, or smoke checks when available.
5. Report changed files, commands run, results, and any remaining risks.
6. Do not say tests passed unless they were actually run.

## Local setup guidance
- Backend: create a backend virtual environment, install `backend/requirements.txt`, configure environment variables, then run Django migrations and the development server.
- Frontend: install dependencies from the frontend lockfile with the matching package manager, then run the existing development script.
- ML: create a separate ML virtual environment and install `ml/requirements.txt`. Check TensorFlow/Python/platform compatibility before installing; GPU support depends on the operating system and runtime.
- Use `.env.example` as documentation only. Never put real secrets in it.

## Scope boundaries
Do not assume that authentication, maps, notifications, cloud deployment, a new database, or a new ML model must be implemented immediately. First audit what already exists, then prioritize features with the project owner. Prefer a phased roadmap with explicit priorities and acceptance criteria.
