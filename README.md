# MalariaMuseum
Let's eradicate malaria!!!

This site is designed with [Rohit Goswami](https://github.com/HaoZeke)'s [Webpack2Jekyll Starter-kit](https://github.com/HaoZeke/Webpack2Jekyll)

Deployed and built using **Netlify**

### Dependencies
- [Node.js](http://nodejs.org/)
- [Gulp](http://gulpjs.com/)
- [Sass (3.4+)](http://sass-lang.com/install)
- [Ruby (2.0+)](https://www.ruby-lang.org)

### Installation
1. Install dependencies listed above
2. Run `bundle install && yarn` to install other dependencies
3. Finally, run `gulp serve` to start watching files

### Writing Posts
To add new drafts, simply add a file in the `posts/_drafts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary Front Matter at the top:

    ---
    layout: single
    title:  Example draft
    date:   2016-01-01 00:00:00 +0000
    categories: example
    ---

Once the draft is ready to publish, move the file to `posts/_posts`. Drafts will be viewable when served locally, but are not included in the production build.

### Deployment
Deploy this to the `prod` branch with `gulp deploy`. This will build a site for production, without draft posts. Built code lives in the `dist` directory.
