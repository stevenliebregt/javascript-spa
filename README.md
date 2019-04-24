# JavaScript SPA

This is a little JavaScript SPA scaffolding I wrote for myself.

It contains:

 - A hash based router
 - ...


## Deploying

### Heroku CLI

Follow the following steps for a very basic Heroku deployment.

```bash
# Only do these if you don't already have a Git repository
git init
git add .
git commit -m "init"

heroku login
heroku create <app-name>
heroku git:remote --app <app-name>

git push heroku master
```

Now every time you run:

```bash
git push heroku master
```

Your app will be updated.

You could also make an app on the Heroku site and configure it yourself.

### Somewhere else

Serve the `dist` folder as root and you're set.
