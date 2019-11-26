# Web Development Starter Kit - v2.0

![](https://github.com/gleesik/web-dev-starter-kit/workflows/Continous%20Integration/badge.svg)


## TO DO

- [x] Remove old file structure.
- [x] Install NodeJS, Gulp, Pug, Jekyll, Babel, Sass, Normalize, Autoprefixer & BrowserSync.
- [x] Store the dev dependences on package.json.
- [x] Write system preparation instructions.
- [x] Write local installation instructions.
- [x] Write usage instructions.
- [x] Write contributions instructions.
- [x] Create the Jekyll gulp task.
- [x] Create the Sass compilation gulp task.
- [x] Modify the Sass gulp task to integrate css autoprefixing.
- [x] Create the Normalize gulp task.
- [x] Create the JS compilation with Babel gulp task.
- [x] Create the BrowserSync gulp task.
- [x] Create the css minify gulp task.
- [x] Create the js minify gulp task.
- [x] Create a build for production gulp task.
- [x] Rewrite all the tasks in order to migrate to gulp v4.
- [x] Create the pug compilation gulp task.
- [x] Move to the native jekyll.
- [x] Fix pug compilation for jekyll compatibility regarding layout wrapping newline.
- [x] Create the html minify gulp task.
- [x] Create the html prettify gulp task.
- [x] Create settings to activate or deactivate gulp tasks.
- [x] Create custom global out directory.
- [x] Test the environment on macOS.
- [x] Test the environment on Linux.
- [x] Test the environment on Windows.

## System Preparation

To use this project, you'll need the following things installed on your machine.

1. [NodeJS](https://nodejs.org/) - use the installer.
2. [Pug](https://pugjs.org/) - `$ npm install --global pug`
3. [GulpJS](https://gulpjs.com/) - `$ npm install --global gulp-cli`
4. [Jekyll](https://jekyllrb.com/) - `$ gem install bundler jekyll`

**OBS:** Mac and Linux users may need sudo.

## Local Installation

Inside the directory, run:
1. `$ npm install`
2. `$ bundler install`

**OBS:** Mac and Linux users may need sudo.

## Usage

1. **Development mode**

This will start the environment with file watching, browser synchronisation, auto-rebuild, js compilation, sass
compilation, css injection, etc.

```shell
$ gulp
```

2. **Jekyll**

This project use Jekyll with Jekyll-Bliss for pug views, so you can use any of the commands listed in their
[documentation](http://jekyllrb.com/docs/usage/).

## Contribution
Contributions, questions and comments are all welcome and encouraged.

- For **code contributions** to *Web Development Starter Kit*, please submit a pull request.

- If you spot **problems** in the _environment_, feel free to create an issue. This way we'll all know that there can be
something improved.
