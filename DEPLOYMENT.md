# Deployment Guide for Render

## Option 1: Automated Blueprint (Recommended)
This method deploys both Server and Client automatically.

1.  In Render Dashboard, click **New +** -> **Blueprint**.
2.  Connect your GitHub repo `ai_idea_generator`.
3.  Click **Apply** (it should list `ai-idea-server` and `ai-idea-client`).
4.  **Environment Variables**:
    *   `OPENROUTER_API_KEY`: Paste your key.
    *   `CLIENT_URL`: Leave empty initially.
5.  After deployment:
    *   Copy the **Client URL**.
    *   Go to **Server Service** -> **Environment**.
    *   Update `CLIENT_URL` with the Client URL.
    *   Save.

---

## Option 2: Manual Deployment (If Option 1 didn't work)
If you already have the Server but missing the Client, do this:

### 1. Deploy the Client (Frontend)
1.  Dashboard -> **New +** -> **Static Site**.
2.  Repo: `ai_idea_generator`.
3.  **Name**: `ai-idea-client`.
4.  **Root Directory**: `client`.
5.  **Build Command**: `npm run build`.
6.  **Publish Directory**: `dist`.
7.  **Environment Variables**:
    *   Key: `VITE_SERVER_URL`
    *   Value: Your Server URL (e.g., `https://ai-idea-server.onrender.com`).
8.  Click **Create Static Site**.

### 2. Connect Server to Client
1.  Go to your **Server Service** settings -> **Environment**.
2.  Add/Update `CLIENT_URL` with your **new Client URL** (e.g., `https://ai-idea-client.onrender.com`).
3.  **Save Changes** (Server will restart).

## Testing
Open your **Client URL** in the browser. It should load the website and successfully generate ideas.
