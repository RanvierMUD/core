[![Build Status](https://travis-ci.com/RanvierMUD/core.svg?branch=master)](https://travis-ci.com/RanvierMUD/core)
[![Coverage Status](https://coveralls.io/repos/github/RanvierMUD/core/badge.svg?branch=master)](https://coveralls.io/github/RanvierMUD/core?branch=master)

Actual core engine code for [Ranvier](https://ranviermud.com) game engine.

### Developing

* Have a checkout of the normal ranviermud repo
* Have a checkout of this repo adjacent to it
* In this repo run npm install then `npm link` (might need `sudo`)
* Go back to the other repo and run `npm link ranvier`

Now any changes you make in this repo will automatically be available inside your ranvier project. Any time you do `npm
install` or `npm update` in your ranviermud repository you'll have to re-run `npm link ranvier` to re-establish the link.
