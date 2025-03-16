# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

## Setup and Run Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/MarwanMaher0/Assessment-Management-Dashboard.git
   cd Assessment-Management-Dashboard
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

4. Build for production:
   ```sh
   npm run build
   ```

5. Preview the production build:
   ```sh
   npm run serve
   ```   

## Architectural Decisions and Approach

This project uses Vue 3 with TypeScript and Vite for a modern and efficient development experience. The architecture follows a modular approach, with components and composables to encapsulate reusable logic. Vuex is used for state management, and Vue Router handles navigation. The project also includes internationalization (i18n) for multi-language support.

## Architecture Questions

### 1. How would you optimize API calls in this application for performance?

To optimize API calls, I would implement debouncing for search inputs to reduce the number of requests sent to the server. Additionally, I would use pagination and lazy loading to fetch data in smaller chunks, reducing the initial load time. Caching responses using tools like Vuex or localStorage can also help minimize redundant API calls. For frequently changing data, implementing WebSockets or Server-Sent Events (SSE) can provide real-time updates without continuous polling.

### 2. Describe your approach to handling shared logic between components.

Shared logic between components can be handled using Vue's composition API by creating reusable composables. These composables can encapsulate common logic and state, making it easy to share functionality across multiple components. Additionally, Vuex can be used to manage global state and actions, ensuring that shared logic is centralized and easily accessible.

### 3. How would you implement client-side data caching for this dashboard?

Client-side data caching can be implemented using Vuex or localStorage. For example, when fetching data from an API, the response can be stored in Vuex state or localStorage. Subsequent requests can first check the cache before making an API call. This reduces the number of network requests and improves the application's performance. Additionally, setting expiration times for cached data ensures that the cache remains up-to-date.

### 4. What strategy would you use to scale this application if it needed to support hundreds of different user permission types?

To support hundreds of different user permission types, I would implement a role-based access control (RBAC) system. This involves defining roles and permissions in a centralized configuration and checking these permissions before rendering components or executing actions. Using middleware in Vue Router can help enforce route-level permissions. Additionally, leveraging a backend service to manage and validate permissions ensures that the system remains scalable and secure.

### 5. Explain your testing strategy and how you decided what to test.

My testing strategy includes unit tests and integration tests. Unit tests focus on individual components and functions, ensuring that they work as expected in isolation. Integration tests verify that different parts of the application work together correctly. I prioritize testing critical paths, such as user authentication, data fetching, and form submissions, to ensure that the core features are reliable.

### 6. How would you handle offline capabilities in this application?

To handle offline capabilities, I would implement a service worker using Workbox. The service worker can cache static assets and API responses, allowing the application to function even when the network is unavailable. Additionally, using IndexedDB or localStorage can help store user data locally, enabling offline access and synchronization when the network is restored. Providing visual indicators and fallback messages can enhance the user experience during offline periods.

## Description of Implemented Features

- **User Management**: View, add, edit, and delete users.
- **Authentication**: Login functionality with role-based access control.
- **Internationalization**: Multi-language support with English and Arabic translations.
- **Responsive Design**: Mobile-friendly layout with adaptive components.
- **Dark Mode**: Toggle between light and dark themes.

## User Roles and Permissions

- **Admin**: Can view, add, edit, and delete any user. Has access to all features and settings.
- **Manager**: Can view, add, and edit users. Cannot delete users.
- **Viewer**: Can only view user details. Cannot add, edit, or delete users.

## Test Coverage Information and How to Run Tests

The project includes unit tests and integration tests. To run the tests, use the following commands:

1. Run unit and integration tests:
   ```sh
   npm run test
   ```

Test coverage reports can be generated using the following command:
```sh
npm run test:coverage
```

The coverage reports will be available in the `coverage` directory.
