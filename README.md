# ams-be

**Disclaimer: This project is under development, intended functionality it's
not yet finished.**

This project is a quick-start boilerplate of the Javascript framework Ember.js to
start a frontend project with some useful functionality out of the box like:
- Header-body-footer page layout.
- User register with validation.
- User login with validation.
- User reset password with validation.
- Emailing.

Recomended for API projects that implement the JSON API specification (http://jsonapi.org/).

**This frontend project is matched with a backend project on PHP micro-framework
Lumen** (yet on development).

## Addons

- ember-paper. Material Design for Ember.js using Ember.js syntax and components.
http://miguelcobain.github.io/ember-paper/
-- ember-cli-sass. Installed by ember-paper.
- ember-test-selectors. Removes attributes starting with "data-test-" from HTML
tags in templates for production builds.
https://github.com/simplabs/ember-test-selectors


## Features

- TDD. This project uses [Test Driven Development](https://www.agilealliance.org/glossary/tdd/)
as development methodology.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd ams-be`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
