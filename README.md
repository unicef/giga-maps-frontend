# GigaMaps Frontend

![GigaMaps logo](https://maps.giga.global/assets/giga-logo.bdd54d.png)

[Giga](https://giga.global/) is a UNICEF-ITU initiative to connect every school to the Internet
and every young person to information, opportunity and choice. GigaMaps maps schools' Internet
access in real time, creates models for innovative financing, and supports governments
contracting for connectivity.

This repository contains the **GigaMaps web frontend**: a React + TypeScript single-page
application that renders the interactive school-connectivity map. It is powered by the
[GigaMaps backend API](https://github.com/unicef/giga-maps-backend).

## About Giga Maps Frontend

Giga Maps Frontend is a live global open map of the internet connectivity of all the schools.

### Why it is important?

Mapping schools is important because we can't solve a problem if we don't know the problem.
Giga's mission is to connect every school to the internet and for that, we need to know accurate
info on each school location, their connectivity and their infrastructure.

We need to put it on an open map because this is a global project with multiple stakeholders like
governments, donors, investors, UNICEF implementation country offices, Internet service
providers, partners, schools, open source community and of course, Giga. All of them need to
have a common tool through which they can see the progress in connecting schools, highlight its
importance and bring actionable clarity and transparency into the process. So, Giga Maps is this
common narrative tool for all Giga members and stakeholders.

## Getting Started

### System Requirements

In order to run the project, you need to install the following:

- [Node.js](https://nodejs.org) **>= 16.16.0** (download [here](https://nodejs.org/en/download/))
- [Yarn](https://yarnpkg.com): Install it globally using `npm install -g yarn`
- A running instance of the [GigaMaps backend](https://github.com/unicef/giga-maps-backend)
  (the app expects an API at `API_BASE_URL`)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/unicef/giga-maps-frontend
   cd giga-maps-frontend
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Create your environment file and fill in the values (see [Environment Variables](#environment-variables)):
   ```sh
   cp .env.ref .env
   ```
4. Start the development server:
   ```sh
   yarn start
   ```
5. Open [http://localhost:9500](http://localhost:9500) to view the app in the browser.

## Environment Variables

Environment variables are loaded at build time via `dotenv-webpack`. The keys listed in
`.env.ref` are **required** — the build will fail if they are missing from your `.env`.

> ⚠️ **Never commit real secrets.** `.env` is git-ignored; only commit the empty `.env.ref`
> template with the list of required keys.

| Variable | Required | Description |
|----------|----------|-------------|
| `API_MAPBOX_ACCESS_TOKEN` | yes | Mapbox access token used to render the map. |
| `API_BASE_URL` | yes | Base URL of the GigaMaps backend API (e.g. `http://localhost:8000/`). |
| `B2C_CLIENT_ID` | yes | Azure AD B2C client ID used for login. |
| `ENV` | yes | Current environment name (e.g. `development`, `production`). |
| `NOCODB_API_URL` | optional | NoCoDB API URL, used for country configuration. |
| `NOCODB_API_TOKEN` | optional | NoCoDB API token (paired with `NOCODB_API_URL`). |
| `NOCODB_TABLE_ID` | optional | NoCoDB table ID for country configuration. |
| `AIRTABLE_API_KEY` | optional | Airtable API key (data integration). |
| `MATOMO_SITE_ID` | optional | Matomo analytics site ID. |
| `LOOMFLOW_API_KEY` | optional | Loomflow feedback widget API key. |

## Technology Stack

GigaMaps is built using the following technologies:

- [TypeScript](https://www.typescriptlang.org/): a statically typed superset of JavaScript that adds optional types and other useful features.

- [Effector](https://effector.dev/): a library for managing application state in React applications.

- [Carbon UI library](https://www.carbondesignsystem.com/): a UI component library that provides a set of reusable UI components for building web applications.

- [React](https://reactjs.org/): a JavaScript library for building user interfaces.

- [Babel](https://babeljs.io/): a tool for compiling modern JavaScript code to ensure compatibility with older browsers.

- [Webpack](https://webpack.js.org/): a module bundler that packages the code into a single file that can be run in the browser.

- [SCSS](https://sass-lang.com/): a preprocessor scripting language that adds special features to CSS.

- [Styled Components](https://styled-components.com/): a library for styling components using JavaScript.

- [ESLint](https://eslint.org/): a tool for identifying and reporting on patterns found in JavaScript code.

- [Stylelint](https://stylelint.io/): a tool for identifying and reporting on patterns found in CSS code.

- [Prettier](https://prettier.io/): a tool for formatting code to ensure consistent style.

- [Jest](https://jestjs.io/): a testing framework for JavaScript.

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/): a library for testing React components using user-centric test patterns.

## Project Structure

- `src/`: contains the source code
  - `assets/`: static assets such as images, icons, etc.
  - `@/`:  directory with application custom components;
  - `api/` directory with all application endpoints and request functions, also contains a file with all responces types;  
  - `lib/` directory contains custom libraries implementations, helpers and utils;  
  - `core/` directory with application main elements;
  - `utils/`: utility functions
  - `App.tsx`: main app component
  - `index.tsx`: entry point

In the root directory of the application, you will find the configuration files for the development and build process. These include configuration files for code linting, the Jest configuration for the UI testing tool, and files for deployment with Docker. The source code is located in the `src/` directory. The `webpack/` directory contains the environment configuration and webpack configuration files. 

Additionally, the `jest.config.js` file is used to configure Jest for UI testing. It specifies the test environment, the test files to be run, and the module name mapping.


## Scripts

- `yarn start`: starts the Webpack dev server on [http://localhost:9500](http://localhost:9500) (hot reload)
- `yarn build`: builds the app for production into `build/`
- `yarn serve`: builds and serves the production output on [http://localhost:9510](http://localhost:9510)
- `yarn build-info`: opens the bundle analyzer in the browser
- `yarn qa`: runs the full quality gate (type check + lint + tests + prettier check)
- `yarn fix`: auto-fixes ESLint and Stylelint issues
- `yarn lint`: runs ESLint and Stylelint
- `yarn eslint`: runs ESLint
- `yarn stylelint`: runs Stylelint
- `yarn ts`: runs TypeScript type checks
- `yarn ts-files`: lists TypeScript files
- `yarn ts-coverage`: shows TypeScript coverage
- `yarn codestyle`: checks code style with Prettier
- `yarn format`: formats files with Prettier
- `yarn test`: launches the test runner
- `yarn test-silent`: runs tests and shows errors only
- `yarn test-coverage`: shows test coverage

## Dependencies

Key runtime dependencies (see `package.json` for the full list):

- `react` / `react-dom`: UI library
- `effector` / `effector-react`: state management
- `@carbon/react`, `@carbon/charts`, `@carbon/icons-react`: Carbon Design System UI & charts
- `mapbox-gl`: interactive map rendering
- `three` / `three-globe`: 3D globe visualization
- `@azure/msal-browser` / `@azure/msal-react`: Azure AD B2C authentication
- `i18next` / `react-i18next`: internationalization
- `styled-components`: component styling
- `date-fns`: date utilities
- `clsx`: conditional class names
- `webfontloader`: web font loading

## Code of Conduct

At Giga, we're committed to maintaining an environment that's respectful, inclusive, and
harassment-free for everyone involved in our project and community. We welcome contributors
and participants from diverse backgrounds and pledge to uphold these standards.

## Contribution Guidelines

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/unicef/giga-maps-frontend/issues)**: Submit bugs found or log feature requests for the `giga-maps-frontend` project.
- **[Submit Pull Requests](https://github.com/unicef/giga-maps-frontend/pulls)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/unicef/giga-maps-frontend/discussions)**: Share your insights, provide feedback, or ask questions.

If you feel impacted by the work we are doing and would like to contribute through monetary
means, then consider donating at <https://give.giga.global>.

Before submitting a pull request, please run `yarn qa` to ensure type checks, linting, tests,
and formatting all pass.

<details closed>
<summary>Contributing steps</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/unicef/giga-maps-frontend
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

## License / Legal

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU Affero General Public License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

For the plain text version please see <https://www.gnu.org/licenses/agpl-3.0.txt>.

## Contact

- GigaMaps Project Lead: Shilpa Arora — sharora@unicef.org
- GigaMaps Project Member: Vipul Bhavsar — vbhavsar@unicef.org
- Giga Open-Source Community Manager: David Njagah — dnjagah@unicef.org
- Giga Website: <https://giga.global/contact-us/>

