# greenkeeper-postpublish

To install `greenkeeper-postpublish` save it to your `devDependencies`:
```
npm install greenkeeper-postpublish --save-dev
```

Then add it to your `scripts` in your `package.json`:
```json
  "scripts": {
    "postpublish": "greenkeeper-postpublish"
  }
```

When set up like this, every time your release the package (with `npm publish`),
it will let Greenkeeper know that there is a new version available.
