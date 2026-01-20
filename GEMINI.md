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

## Session Status (Last Updated: 2026-01-16)

### Todo List

1.  **[DONE] Refactor `friends.ts` store**
    *   **Context:** The store logic for fetching friends and handling requests has been corrected to handle bidirectional relationships and proper foreign keys.

2.  **[DONE] Implement `ProfileView.vue`**
    *   **Action:** Displays current user details (username, email) and includes a logout button.

3.  **[DONE] Create Friends Management UI**
    *   **Action:** Created `FriendsView.vue` with tabs for 'Friends', 'Requests', and 'Search'. Implemented search, add, accept, reject, and remove logic.

4.  **[DONE] Create `items.ts` Pinia store**
    *   **Action:** Defined interfaces for Items and implemented CRUD actions (fetch, add, update, delete) and lending actions (lend, return).

5.  **[DONE] Fix Pinia Initialization**
    *   **Action:** Added `app.use(createPinia())` in `main.ts` to resolve "no active Pinia" error.

6.  **[PENDING] Create UI for Item Management**
    *   **Action:** Implement `HomeView.vue` (or a dedicated Items view) to list the user's library, and provide forms/dialogs to add new items and edit existing ones.
    *   **Requirements:** Need to install `select`, `dialog`, `dropdown-menu` from shadcn-vue.

7.  **[PENDING] Implement Lending/Loan logic UI**
    *   **Action:** Create the UI mechanism to select a friend and mark an item as 'LENT'.

8.  **[DONE] Verify and Fix Friends Logic**
    *   **Action:** Rigorously test the entire friends workflow (Search, Add, Accept, Reject, Remove) to ensure stability and correctness.

9.  **[CURRENT] Implement Advanced Items Store Logic**
    *   **Action:** Update `items.ts` to handle fetching borrowed items, return actions for borrowers, and better lending validation.
    *   **Subtasks:** `fetchBorrowedItems`, `returnBorrowedItem`, `lendItem` refinement.

10. **[PENDING] Build Item Management Dashboard**
    *   **Action:** Create the main dashboard in `HomeView.vue` with tabs for "My Library" and "Borrowed Items".
    *   **Features:** Add Item Dialog, Item List (Cards/Table), Edit/Delete actions, Lend/Return actions.

### Detailed Next Step: Implement Advanced Items Store Logic

**Objective:** Enhance `items.ts` to support the full lending lifecycle from both owner and borrower perspectives.

**Specifics:**
1.  **Fetch Borrowed Items:** Add `fetchBorrowedItems` to retrieve items where `lent_to` matches the current user.
2.  **Refine Lending:** Update `lendItem` to potentially check friendship status (if not enforced by DB RLS) and ensure atomic updates.
3.  **Borrower Actions:** Implement `returnBorrowedItem` for the borrower to mark an item as returned.
4.  **Type Safety:** Review and enforce types using `enums` from `consts.ts`.
