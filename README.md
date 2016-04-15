# greenkeeper-postpublish

## Set up greenkeeper-postpublish

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

## Manual use

You can also run it outside of the `package.json` scripts. You will need to install
it with the `--global` flag then though:
```
npm install greenkeeper-postpublish --global
```

If you run `greenkeeper-postpublish` in a directory with a `package.json` it will
parse it and use its `name` and `version`.

You can also specify the `--pkgname` and `--pkgversion` parameters instead:

```
greenkeeper-postpublish --pkgname mypackage --pkgversion 4.2.0
```

🌴
