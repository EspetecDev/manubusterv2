# Gemini Project Overview: ManuBuster v2 Client

This document provides a comprehensive overview of the `manubusterv2/client` project to be used as instructional context for Gemini.

## Project Overview

This is a web application client built with **Vue.js 3** and **TypeScript**. The primary goal of the application is to create a library of physical items that a user can lend to friends.

The project is bootstrapped with **Vite**, ensuring a fast development and build process. It uses **Pinia** for state management and **Vue Router** for client-side routing. The backend is powered by **Supabase**, which is used for database storage and user authentication.

The user interface is built with **Tailwind CSS** and features a component library based on **shadcn-vue**, providing a consistent and modern look and feel.

### Core Technologies

-   **Framework**: Vue.js 3 (`<script setup>`)
-   **Language**: TypeScript
-   **Build Tool**: Vite
-   **Routing**: Vue Router
-   **State Management**: Pinia
-   **Backend**: Supabase (Auth and Database)
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn-vue, lucide-vue-next (icons)

## Building and Running

The project's key scripts are defined in `package.json`.

-   **To run the development server:**
    ```bash
    pnpm dev
    ```

-   **To build the application for production:**
    ```bash
    pnpm build
    ```

-   **To preview the production build locally:**
    ```bash
    pnpm preview
    ```

-   **To add new `shadcn-vue` components:**
    ```bash
    pnpm dlx shadcn-vue@latest
    ```

## Development Conventions

### Architecture

-   **Application Entrypoint**: `src/main.ts` initializes the Vue app, mounts the root component (`App.vue`), and installs the router.
-   **Routing**: Routes are defined in `src/router/index.ts`. It includes a navigation guard (`beforeEach`) that handles authentication, redirecting users to the login page if they are not authenticated and trying to access protected routes.
-   **Layouts**: The application uses a dynamic layout system in `App.vue`. Routes can specify a layout (e.g., `meta: { layout: 'auth' }`) to use a different page structure, separating authentication views from the main dashboard layout.
-   **State Management**: Global state is managed with Pinia. The main store so far is `src/stores/friends.ts`, which handles all logic related to fetching, searching, and managing user friendships via Supabase.
-   **Backend Interaction**: All communication with the backend is handled through the Supabase client, which is initialized in `src/lib/supabase.ts` and imported into stores or components where needed. Environment variables for Supabase URL and Key are required.

### Code Style & Structure

-   **Components**: Reusable UI components are located in `src/components/ui` and follow the `shadcn-vue` structure. Feature-specific components are in `src/components`.
-   **Views**: Top-level page components are located in `src/views`.
-   **Styling**: Global styles and Tailwind CSS directives are in `src/style.css`. Component-specific styles are co-located within the Vue components.
-   **Path Aliases**: The project is configured with a `@` alias for the `src` directory (e.g., `import HomeView from '@/views/HomeView.vue'`).

---

## 🎨 Theme & Aesthetic
- **Visual Style:** Modern, minimal, and high-contrast dark mode based on the **Shadcn UI** framework.
- **Color Palette:**
  - **Background (Base):** `#0f172a` (Deep Slate/Navy)
  - **Card/Surface:** `#1e293b` (Slate-800)
  - **Border/Separator:** `#334155` (Slate-700)
  - **Primary Action:** `#2563eb` (Royal Blue)
  - **Success (On-time):** `#10b981` (Emerald)
  - **Destructive (Overdue):** `#ef4444` (Red-500)
  - **Text (Primary):** `#f8fafc` (Slate-50)
  - **Text (Secondary):** `#94a3b8` (Slate-400)

## 🔠 Typography
- **Font Family:** `Inter`, `Geist Sans`, or a similar high-legibility sans-serif.
- **Hierarchy:**
  - **H1 (Titles):** Semi-bold, 24px-30px, tracking-tight.
  - **Stat Numbers:** Bold, 32px+.
  - **Labels/Body:** 14px Regular for metadata; 14px Medium for UI labels.

## 🧱 Key Components
- **Sidebar (Nav):** Slim left-aligned navigation with `Ghost` button styles for inactive links and a `Secondary` background for the active state.
- **KPI Cards:** Standard `Card` components with a title, a large value, and a small trend indicator (e.g., "+2 this week").
- **Data Table:** Clean `Table` with:
  - **Avatars:** 32px circular borrower images.
  - **Badges:** Pill-shaped labels for item categories (Music, Game) and loan status.
  - **Actions:** Horizontal three-dot (`MoreHorizontal`) dropdown menus for each row.
- **Inputs:** `Input` fields with subtle borders and `Search` icons.

## 📐 Layout Structure
1. **Top Header:** Contains "Dashboard" title, a center-aligned global search, and a "New Loan" `Primary Button`.
2. **Hero/Summary:** A three-column grid for high-level stats (Total Lent, Overdue, Friends).
3. **Primary List:** A full-width `Card` containing the "Active Loans" table.
4. **Secondary Section:** A "Recent Activity" list below the main table, displaying a vertical timeline or horizontal cards.

---

## Session Status (Last Updated: 2026-01-12)

### Pending Todo List

1.  **[PENDING] Refactor `friends.ts` store**
    *   **Context:** The current store has incorrect logic for fetching friends (assumes user is always one side of the relationship) and incorrect join logic for friend requests (fetches receiver profile instead of sender).
    *   **Action:** Update `fetchFriends` to handle bidirectional relationships, update `fetchFriendRequests` to fetch sender profiles, and update `Friendship` interface to match DB columns.

2.  **[PENDING] Implement `ProfileView.vue`**
    *   **Action:** Display current user details (username, email).

3.  **[PENDING] Create Friends Management UI**
    *   **Action:** Create UI to list friends, search users, send requests, and accept/reject requests.

4.  **[PENDING] Create `items.ts` Pinia store**
    *   **Action:** Define interfaces for Items (Games, Consoles) and implement CRUD actions.

5.  **[PENDING] Create UI for Item Management**
    *   **Action:** Dashboard/list view for library and add/edit forms.

6.  **[PENDING] Implement Lending/Loan logic**
    *   **Action:** Mechanism to mark items as 'LENT' and track status.

### Detailed Next Step: Refactor `friends.ts`

**Objective:** Fix data structure and logic errors in `src/stores/friends.ts`.

**Specifics:**
1.  **Update `Friendship` Interface:** Rename `user_1_id` -> `user_id_1` and `user_2_id` -> `user_id_2` to match Supabase DB.
2.  **Refactor `fetchFriends()`:**
    *   Fetch friendships where `user_id_1 == me` OR `user_id_2 == me`.
    *   Manually calculate the "friend" ID (the one that isn't me).
    *   Fetch those profiles in a second query and merge.
3.  **Refactor `fetchFriendRequests()`:**
    *   Ensure we fetch the **sender's** profile (using `friendships_user_id_1_fkey`) when querying for pending requests where I am `user_id_2`.