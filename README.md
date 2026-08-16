# Deep Talk Card: No-Login Edition 🃏

A beautifully designed, **no-login** web application to spark meaningful conversations. Built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**.

![Deep Talk Banner](https://placehold.co/1200x400/1e293b/white?text=Deep+Talk+Card)

## ✨ Features

-   **Zero Login Required**: Jump straight into the game. No sign-ups, no profiles.
-   **Two Game Modes**:
    -   **Shared Mode**: Classic "one question for everyone" style.
    -   **Draft Mode**: Local multiplayer with a unique "Pick -> Reveal -> Done" loop.
-   **Beautiful UI**: Glassmorphism, fluid animations (Framer Motion), and dynamic gradients.
-   **Responsive**: Works perfectly on mobile and desktop.

## 🎮 How to Play

### 1. Shared Mode (Classic)
Perfect for casual hangouts or icebreakers.
1.  Select a **Category** (e.g., "Deep Talk", "Fun").
2.  Choose **Shared Mode** in the setup modal.
3.  Click **Start Game**.
4.  A single card is displayed. Everyone answers the same question.
5.  Click **Pertanyaan Baru** (Next) to draw a new card.

### 2. Draft Mode (Pass & Play)
A structured loop for groups of 2-8 players.
1.  Select a **Category**.
2.  Choose **Draft Mode**.
3.  Input the **Number of Players** and their **Names** (optional).
4.  **The Draft Loop**:
    -   **Pick**: The active player (highlighted) picks a mystery card from the board.
    -   **Reveal**: The card flips over. The player reads it aloud.
    -   **Done**: Player clicks **"Selesai / Done"** to finish their turn.
    -   **Next**: The turn passes to the next randomized player.
5.  **New Round**: Once all players have drafted, start a new round to reshuffle and get fresh cards.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: React Context + Hooks (No external state library needed for this scale)

## 🚀 Quick Start

### Prerequisites
-   Node.js 20.9+ installed.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/deep-talk-card.git
    cd deep-talk-card
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000).

## ☁️ Deployment (Vercel)

This project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Go to [Vercel Dashboard](https://vercel.com/new).
3.  Import your repository.
4.  Click **Deploy**.

## 📂 Project Structure

```
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root Layout
│   └── page.tsx          # Home Page
├── components/           # React Components
│   ├── GameLayout.tsx    # State-driven Layout Manager
│   ├── DraftingBoard.tsx # Draft Logic UI
│   └── ...
├── lib/                  # Logic & Data
│   ├── game-engine.ts    # Pure Game State Transitions
│   ├── store.tsx         # Global State (Context)
│   └── data.ts           # Category Metadata
└── public/questions/     # Versioned Question Banks
```

Question banks are cached as immutable static assets. When changing their
contents, create a new version directory and update `QUESTION_DATA_VERSION` in
`lib/question-loader.ts` so returning visitors do not receive stale questions.

## 📄 License
MIT
