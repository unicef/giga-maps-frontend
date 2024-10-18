<div style="padding-left: 20px; padding-right: 10px;">
<a href="https://giga.global/">
    <img src="https://s41713.pcdn.co/wp-content/uploads/2018/11/2020.05_GIGA-visual-identity-guidelines_v1-25.png" alt="Giga logo" title="Giga" align="right" height="60" style="padding-top: 10px;"/>
</a>

<div style="padding-top: 20px;"> </div>
<h1><a id="gigameter" class="anchor" aria-hidden="true" href="#gigablocks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Giga Maps Frontend </h1> 

<div align="center" >

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->
![GitHub repo size](https://img.shields.io/github/repo-size/unicef/giga-maps-frontend)
![GitHub stars](https://img.shields.io/github/stars/unicef/giga-maps-frontend)
![Twitter Follow](https://img.shields.io/twitter/follow/gigaglobal)
![License](https://img.shields.io/github/license/unicef/giga-maps-frontend)


</div>

<details open="open">
	<summary style="padding-bottom: 10px;"><h2>Table of Contents</h2></summary>
  <ol>
    <li><a href="#about-giga">About Giga</a></li>
    <li><a href="#about-gigamaps">About Giga Maps Frontend</a>
    <ul>
        <li><a href="#why-it-is-important">Why it is important?</a></li>
        <li><a href="#system-requirements">System Requirements</a></li>
        <li><a href="#giga-maps-repos">Github Repositories of Giga MAps</a></li>
      </ul>
      </li>
	<li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#code-of-conduct">Code of Conduct</a></li>
    <li><a href="#contribution-guidelines">Contribution Guidelines</a></li>
    <li><a href="#license">License/Legal</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<h2><a id="about-giga" class="anchor" aria-hidden="true" href="#about-giga"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>About Giga</h2>

Giga is a UNICEF-ITU global initiative to connect every school to the Internet and every young person to information, opportunity, and choice. By connecting all schools to the Internet, we ensure that every child has a fair shot at success in an increasingly digital world.

<h2><a id="about-gigamaps" class="anchor" aria-hidden="true" href="#about-gigamaps"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
About Giga Maps Frontend</h2>

Giga Maps Frontend is a live global open map of the internet connectivity of all the schools.

<h3><a id="why-it-is-important" class="anchor" aria-hidden="true" href="#why-it-is-important"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Why it is important? </h3>
<p></p>

Mapping schools is important because we can't solve a problem if we don't know the problem. Giga's mission is to connect every school to the internet and for that, we need to know accurate info on each school location, their connectivity and their infrastructure.

We need to put it on an open map because this is a global project with multiple stakeholders like governments, donors, investors, UNICEF implementation country offices, Internet service providers, partners, schools, open source community and of course, Giga. All of them need to have a common tool through which they can see the progress in connecting schools, highlight its importance and bring actionable clarity and transparency into the process. So, Giga Maps is this common narrative tool for all Giga members and stakeholders. 


<h3><a id="system-requirements" class="anchor" aria-hidden="true" href="#system-requirements"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
System Requirements </h3>
<p></p>
In order to run the project, you need to install the following:

- Node.js (download here)
- Yarn: Install it globally using npm install -g yarn


<h3><a id="giga-maps-repos" class="anchor" aria-hidden="true" href="#giga-maps-repos"><svg class="octicon octicon-link" align="center" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Github Repositories of Giga Maps </h3>

- [Giga Maps Frontend](https://github.com/unicef/giga-maps-frontend/)
- [Giga Maps Backend](https://github.com/unicef/giga-maps-backend/)
- [Giga – documentation](#)


<h2><a id="getting-started" class="anchor" aria-hidden="true" href="#getting-started"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Getting Started</h2>

### Setup and Running
#### Installation 

1. Clone the repository: git clone https://github.com/unicef/giga-maps-frontend/
2. Install dependencies: 
```
yarn install
```
3. Start the development server: 
```
yarn start
```
4. Open http://localhost:9500 to view the app in the browser.

#### Setup Environment Variables

- API_MAPBOX_ACCESS_TOKEN: (required) Token for map interaction.
- API_BASE_URL: (required) API backend URL.
- B2C_CLIENT_ID: (required) Client ID for login.
- ENV: (optional, default: development) Current environment variable.
- MATOMO_SITE_ID: (optional) Analytics site ID.

#### Technology Stack

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


#### Project Structure

- src/: contains the source code
assets/: static assets such as images, icons, etc.
- @/: directory with application custom components;
- api/ directory with all application endpoints and request functions, also contains a file with all responces types;
- lib/ directory contains custom libraries implementations, helpers and utils;
- core/ directory with application main elements;
- utils/: utility functions
- App.tsx: main app component
- index.tsx: entry point

In the root directory of the application, you will find the configuration files for the development and build process. These include configuration files for code linting, the Jest configuration for the UI testing tool, and files for deployment with Docker. The source code is located in the src/ directory. The webpack/ directory contains the environment configuration and webpack configuration files.

Additionally, the jest.config.js file is used to configure Jest for UI testing. It specifies the test environment, the test files to be run, and the module name mapping.

<h2><a id="code-of-conduct" class="anchor" aria-hidden="true" href="#code-of-conduct"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Code of Conduct</h2>

At Giga, we're committed to maintaining an environment that's respectful, inclusive, and harassment-free for everyone involved in our project and community. We welcome contributors and participants from diverse backgrounds and pledge to uphold the standards. 


[Click here for detailed Code of Conduct](#)

<h2><a id="contribution-guidelines" class="anchor" aria-hidden="true" href="#contribution-guidelines"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Contribution Guidelines</h2>

Thank you for considering contributing to Giga Meter Backend! We value your input and aim to make the contribution process as accessible and transparent as possible. Whether you're interested in reporting bugs, discussing code, submitting fixes, proposing features, becoming a maintainer, or engaging with the GigaMeter community, we welcome your involvement.

If you feel impacted by the work we are doing and would like to contirbute through monetary means then consider donating at <b>https://give.giga.global</b>

  
[Click here for detailed Contribution Guidelines](#)

<h2><a id="license" class="anchor" aria-hidden="true" href="#license"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
License / Legal</h2>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.
See [LICENSE](https://github.com/unicef/giga-maps-frontend/blob/main/LICENSE) for more information.

For the plain text version please see <https://www.gnu.org/licenses/agpl-3.0.txt>

<h2><a id="contact" class="anchor" aria-hidden="true" href="#contact"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Contact</h2>

GigaMaps Project Lead: Shilpa Arora: sharora@unicef.org 

GigaMaps Project Member: Vipul Bhavsar: vbhavsar@unicef.org 

Giga Open-Source Community Manager: David Njagah: dnjagah@unicef.org 

Giga Website: https://giga.global/contact-us/ 

<br>

<h2><a id="acknowledgements" class="anchor" aria-hidden="true" href="#acknowledgements"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></path></svg></a>
Acknowledgments💜</h2> 

* Thanks to the Nagarro team for helping build this application!

</div>

