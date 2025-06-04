# Documentation
**Last updated**: May 27, 2024
# ![GigaMaps logo](https://maps.giga.global/assets/giga-logo.bdd54d.png)
Giga is a UNICEF-ITU initiative to connect every school to the Internet and every young person to information, opportunity and choice. 
Giga maps schools’ Internet access in real time, creates models for innovative financing, and supports governments contracting for connectivity. 

## Getting Started - Frontend


### Prerequisites

In order to run the project, you need to install the following:

- [Node.js](https://nodejs.org) (download [here](https://nodejs.org/en/download/))
- [Yarn](https://yarnpkg.com): Install it globally using `npm install -g yarn`


### Installation
1. Clone the repository: `git clone https://github.com/unicef/project-connect-nagarro-fe`
2. Install dependencies: `yarn install`
3. Start the development server: `yarn start`
4. Open [http://localhost:9500](http://localhost:9500) to view the app in the browser.


## Environment Variables

- **API_MAPBOX_ACCESS_TOKEN**: (required) Token for map interaction.
- **API_BASE_URL**: (required) API backend URL.
- **B2C_CLIENT_ID**: (required) Client ID for login.
- **ENV**: (optional, default: development) Current environment variable.
- **MATOMO_SITE_ID**: (optional) Analytics site ID.
- **LOOMFLOW_API_KEY**: (optional) Loomflow API key.

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

- `yarn start`: starts the development server
- `yarn build`: Builds the app for production
- `yarn build-info`: Opens bundle analyzer in browser
- `yarn qa`: Runs code quality tools
- `yarn fix`: Fix linting errors
- `yarn lint`: Runs linters
- `yarn eslint`: Runs ESLint
- `yarn stylelint`: Runs Stylelint
- `yarn ts`: Runs TypeScript checks
- `yarn ts-files`: Lists TypeScript files
- `yarn ts-coverage`: Shows TypeScript coverage
- `yarn codestyle`: Checks code style with prettier
- `yarn format`: Formats files with prettier
- `yarn test`: Launches the test runner
- `yarn test-silent`: Launches the test runner and shows errors only
- `yarn test-coverage`: Shows test coverage

## Dependencies

- `@azure/msal-browser`: Azure AD authentication library
- `@azure/msal-react`: Azure AD authentication library for React
- `@carbon/charts`: charting library
- `@carbon/icons-react`: icon library
- `clsx`: utility for constructing class names
- `effector`: state management library
- `mapbox-gl`: map library
- `react`: React library
- `react-dom`: React DOM library
- `react-perfect-scrollbar`: perfect scrollbar library
- `styled-components`: styling library
- `webfontloader`: web font loader library
- ...etc

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the UNICEF's license.

