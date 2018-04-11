
# ams-be

This project is a quick-start boilerplate of the Javascript framework 
[Ember.js](https://www.emberjs.com/) to start a frontend project with the common
functionality out of the box like main page layout, user management and forms
validation.

It's recomended for API projects that implement the JSON API specification (http://jsonapi.org/).

**ams-be is a frontend project that matches the [backend project ams-bl](https://github.com/AMS777/ams-bl) 
developed with the PHP micro-framework [Lumen](https://lumen.laravel.com/) and
may be set up with the [ams-bel architecture](https://github.com/AMS777/ams-bel)** 
(though other backend and architecture may be used).


## Demo

**You can see a working demo of the ams-be frontend project and the ams-bl 
backend project with the ams-bel architecture at:**

**http://ams-bel.mas.gallery/**


## Features

- User register.
- User login.
- User password reset with token.
- Update user account.
- Delete user account.
- User email verification on register.
- Contact form page.
- Forms validation.
- API error handling.
- Material Design styling.
- Header-body-footer page layout.
- FAQ, Privacy and Terms pages and page footer links.


## Technologies

- TDD. This project uses [Test Driven Development](https://www.agilealliance.org/glossary/tdd/)
as development methodology.
- JSON API. API requests and responses follow the JSON API v1.0 specification:
http://jsonapi.org/format/
- JWT. Authentication with JSON Web Tokens: https://tools.ietf.org/html/rfc7519
- Ember 3.0. This project is developed with the 
[3.0 version of Ember.js](https://www.emberjs.com/blog/2017/10/03/the-road-to-ember-3-0.html),
[released on 2018-02-14](https://www.emberjs.com/blog/2018/02/14/ember-3-0-released.html).


## Addons

- ember-paper. Material Design for Ember.js using Ember.js syntax and components.  
  http://miguelcobain.github.io/ember-paper/
  - ember-cli-sass. Installed by ember-paper.
- ember-test-selectors. Removes attributes starting with `data-test-` from HTML
tags in templates for production builds. 
  https://github.com/simplabs/ember-test-selectors
- ember-paper-link. Extends ember's built in `link-to` helper and adds
`paper-button` styling and functionality.  
  https://github.com/Subtletree/ember-paper-link
- qunit-dom. Specific test asserts for DOM elements.  
  https://github.com/simplabs/qunit-dom
- ember-cli-fake-server. Makes it extremely simple to stub Ajax requests for testing.  
  https://github.com/201-created/ember-cli-fake-server
- ember-simple-auth. A library for implementing authentication and authorization in 
Ember.js applications.  
  https://github.com/simplabs/ember-simple-auth
- ember-cp-validations. Elaborate validations (email format, string length,
fields comparison...)
  https://github.com/offirgolan/ember-cp-validations


## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)


## Install

Download or fork this project and take it as the starting point of your own project.


## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

If you are running ams-be frontend with the development server of ams-bl as backend,
first run the ams-bl server and then run:

* `ember serve --proxy http://localhost:8000`


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


## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
