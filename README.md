# greenkeeper-postpublish

[![Greenkeeper badge](https://badges.greenkeeper.io/greenkeeperio/greenkeeper-postpublish.svg)](https://greenkeeper.io/)

## Set up greenkeeper-postpublish

To install `greenkeeper-postpublish` save it to your `devDependencies`:
```
npm install greenkeeper-postpublish --save-dev
```

Then add it to your `scripts` in your `package.json`:
```json
  "scripts": {
    "postpublish": "greenkeeper-postpublish --secret=$GK_NPMHOOK_SECRET --installation=$GK_INSTALLATION_ID"
  }
```

You can also set the `secret` and `installation` values in your publish environment:

```
gk_secret=$GK_NPMHOOK_SECRET
gh_installation=$GK_INSTALLATION_ID
```

Where the `GK_NPMHOOK_SECRET` is set in your Greenkeeper Enterprise Admin Dashboard at https://gke.your-company.com:8800 and `GK_INSTALLATION_ID` can be found in your GitHub Enterprise setup on the organisation for your modules: https://ghe.your-company.com/organizations/$organisation_name/settings/installations -> Greenkeeper -> the integer number in the URL.

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
greenkeeper-postpublish --pkgname mypackage --pkgversion 4.2.0 --secret=abcd --installation=54321
```

🌴

