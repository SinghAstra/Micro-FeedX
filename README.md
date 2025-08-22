# Micro-FeedX: A Modern Microblogging Platform

## Project Overview

Micro-FeedX is a modern, feature-rich microblogging platform designed for users to share short-form content, engage in discussions, and connect with others. It solves the problem of fragmented social media experiences by providing a centralized space for concise updates and community interaction.

**Why Micro-FeedX?**

*   **Concise Communication:** Encourages short, impactful posts, fostering quick and easy information sharing.
*   **Community Focused:** Built with features that promote interaction, discussion, and a sense of belonging.
*   **Modern Tech Stack:** Leverages cutting-edge technologies for performance, scalability, and a delightful user experience.

**Target Audience:**

*   Individuals looking for a focused platform to share thoughts and updates.
*   Communities seeking a dedicated space for discussions and announcements.
*   Developers interested in learning from a modern web application architecture.

**What Makes Micro-FeedX Unique?**

*   **Seamless User Experience:** Built with a focus on intuitive design and smooth interactions.
*   **Real-time Updates:** Utilizes modern web technologies to deliver instant updates and notifications.
*   **Extensible Architecture:** Designed to be easily extended with new features and integrations.

## Key Features

*   **User Authentication:** Secure user registration and login using Supabase, with options for email/password and Google OAuth.
*   **Post Creation & Management:** Users can create, edit, and delete posts with content validation.
*   **Post Feed:** Displays a dynamic feed of posts with infinite scrolling and skeleton loading.
*   **Like, Comment, & Share:** Standard social media interactions to engage with posts.
*   **Search Functionality:** Users can search for posts based on keywords.
*   **User Profiles:** Customizable user profiles with avatars and usernames.
*   **Toast Notifications:** Real-time feedback and notifications using Sonner.
*   **Responsive Design:** Optimized for various screen sizes and devices.
*   **Moving Backgrounds and Borders:** Eye-catching visual elements using animated gradients.

## Architecture & Code Organization

Micro-FeedX follows a modern web application architecture, leveraging Next.js for server-side rendering, routing, and API endpoints. The application is structured into distinct modules for clear separation of concerns.

**Key Components:**

*   **`app/`:** Contains Next.js route handlers, pages, and layouts.
    *   `(auth)`: Authentication-related routes (login, register, setup username).
    *   `(protected)`: Routes accessible only to authenticated users (home).
    *   `(home)`: Routes accessible only to guest users (landing page).
*   **`components/`:** Reusable UI components.
    *   `ui/`: Core UI components (buttons, cards, inputs, dialogs, etc.) built with Radix UI.
    *   `home/`: Components specific to the home page (post feed, search bar, etc.).
    *   `landing/`: Components for the landing page (navbar, footer, hero).
    *   `component-x/`: Components with moving backgrounds and borders.
    *   `providers/`: Context providers (SWR, Toast, Theme).
*   **`lib/`:** Utility functions, schemas, and Supabase clients.
    *   `supabase/`: Supabase client configurations (browser, server, admin).
    *   `schema/`: Zod schemas for data validation.
    *   `utils.ts`: Utility functions (e.g., `cn` for class merging).
    *   `variants.ts`: Framer Motion animation variants.
*   **`actions/`:** Server actions for handling form submissions and data mutations.
    *   `auth.ts`: Authentication actions (login, register).
    *   `posts.ts`: Post management actions (create, edit, delete).
    *   `server-auth.ts`: Server-side authentication helpers.
*   **`interfaces/`:** TypeScript interfaces for data structures.
    *   `post.ts`: Interfaces for `User` and `Post` objects.
    *   `site.ts`: Interface for site-wide configuration.

**Directory Structure Mapping:**

*   `app/`: Defines the application's routes and page structure.
*   `components/`: Houses all reusable UI elements.
*   `lib/`: Contains core logic, data access, and utility functions.
*   `actions/`: Encapsulates server-side data mutations and business logic.
*   `interfaces/`: Defines the shape of data used throughout the application.

**Key Design Decisions:**

*   **Next.js:** Chosen for its server-side rendering capabilities, routing, and API endpoints, providing a performant and SEO-friendly experience.
*   **Supabase:** Selected for its ease of use, real-time capabilities, and comprehensive feature set for authentication and data storage.
*   **Radix UI:** Used for building accessible and customizable UI components.
*   **Zod:** Employed for robust data validation, ensuring data integrity.
*   **Tailwind CSS:** Utilized for styling, providing a flexible and maintainable approach.

## Technology Stack

*   **Next.js:** React framework for building performant web applications.
*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Superset of JavaScript that adds static typing.
*   **Supabase:** Open-source alternative to Firebase for authentication, database, and real-time functionality.
*   **Radix UI:** Unstyled, accessible UI primitives.
*   **Tailwind CSS:** Utility-first CSS framework.
*   **Zod:** TypeScript-first schema validation with static type inference.
*   **Framer Motion:** Animation library for creating smooth and engaging user experiences.
*   **SWR:** React Hooks library for remote data fetching.
*   **Sonner:**  Library for creating beautiful and customizable toast notifications.

**Why These Technologies?**

*   **Next.js:** Provides server-side rendering, routing, and API endpoints out of the box, simplifying development and improving performance.
*   **Supabase:** Offers a complete backend solution with authentication, database, and real-time capabilities, reducing the need for custom backend development.
*   **Radix UI:** Ensures accessibility and provides a solid foundation for building custom UI components.
*   **Tailwind CSS:** Enables rapid styling and consistent design across the application.
*   **Zod:** Provides robust data validation, preventing errors and ensuring data integrity.

## Getting Started

1.  **Prerequisites:**
    *   Node.js (version 18 or higher)
    *   npm or yarn package manager
    *   Supabase account and project

2.  **Installation:**

    ```bash
    git clone <repository_url>
    cd micro-feedx
    npm install # or yarn install
    ```

3.  **Configuration:**

    *   Create a `.env.local` file in the root directory.
    *   Add the following environment variables, replacing the placeholders with your Supabase credentials:

    ```
    NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
    SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
    ```

4.  **Running the Application:**

    ```bash
    npm run dev # or yarn dev
    ```

    This will start the development server at `http://localhost:3000`.

5.  **Common Development Commands:**

    *   `npm run dev`: Start the development server.
    *   `npm run build`: Build the application for production.
    *   `npm run start`: Start the production server.
    *   `npm run lint`: Run ESLint to check for code quality issues.
    *   `npm run format`: Format the code using Prettier.

## Project Structure

```
micro-feedx/
├── app/                       # Next.js routes, pages, and layouts
│   ├── (auth)/                # Authentication routes
│   ├── (protected)/           # Protected routes
│   ├── (home)/               # Guest routes
│   ├── api/                   # API endpoints
│   └── layout.tsx             # Root layout
├── components/                # Reusable UI components
│   ├── ui/                    # Core UI components
│   ├── home/                  # Home page components
│   ├── landing/               # Landing page components
│   ├── component-x/           # Components with moving backgrounds and borders
│   └── providers/             # Context providers
├── lib/                       # Utility functions, schemas, and Supabase clients
│   ├── supabase/              # Supabase client configurations
│   ├── schema/                # Zod schemas
│   ├── utils.ts               # Utility functions
│   └── variants.ts            # Framer Motion animation variants
├── actions/                   # Server actions
│   ├── auth.ts                # Authentication actions
│   └── posts.ts               # Post management actions
├── interfaces/                # TypeScript interfaces
│   ├── post.ts                # User and Post interfaces
│   └── site.ts                # Site configuration interface
├── config/                    # Configuration files
│   └── site.ts                # Site configuration
├── public/                    # Static assets
├── styles/                    # Global styles
├── .env.local                # Environment variables
├── next.config.js           # Next.js configuration
├── package.json               # Project metadata and dependencies
├── README.md                  # Project documentation
└── tsconfig.json              # TypeScript configuration
```

**Key Files to Know:**

*   `app/layout.tsx`: The root layout of the application.
*   `components/ui/*`: Reusable UI components.
*   `lib/supabase/*`: Supabase client configurations.
*   `actions/*`: Server actions for data mutations.
*   `config/site.ts`: Site-wide configuration settings.

We welcome contributions to Micro-FeedX! Please refer to the contributing guidelines for more information.