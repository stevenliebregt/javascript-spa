# JavaScript SPA

This is a little JavaScript SPA scaffolding I wrote for myself.

## Features

 - [Hash based router](#Hash-based-router)
 - [JSX like tagged template literals](#JSX-like-tagged-template-literals)
 
### Hash based router

This scaffolding contains a hash based router. Routes can be defined in the `src/js/routes.js` file.

By default the router wil route on the following `window` events: `load` and `hashchange`.
 
Example routes:

```js
export const routes = {
  '/': Home,
  '/about-this': About,
  '/number/:number': {
    page: Number,
    parameters: {
      number: '\\d+',
    },
  },
};
```
 
### JSX like tagged template literals 

I like the JSX syntax, so using tagged template literals I made my own parser with the help of Google.

It looks something like this in a screen:

```js
class MyScreen extends Component {
  render() {
    const items = [
      'banana',
      'pear',
      'apple',
    ];
    
    return jsx`
      <div>
        <h1>This is some JSX</h1>
        <ol>${items.map(item => jsx`<li>Item: ${item}</li>`)}</ol>
        <button data-name="myButton" onclick="{this.onClick}">Click me!</button>
      </div>
    `;
  };
  
  onClick = (event) => {
    alert(`You clicked me, my name is: "${event.target.dataset.name}"`);
  };
}
```

This wil print out a heading, an ordered list with 3 items, banana, pear and apple and a button.
The `onclick` attribute of the button will be replaced by an event listener. So we don't have a visible
`onclick` in the HTML.

Below is the HTML that would be generated from the above snippet.

```html
<div>
  <h1>This is some JSX</h1>
  <ol>
    <li>Item: banana</li>
    <li>Item: pear</li>
    <li>Item: apple</li>
  </ol>
  <button data-name="myButton">Click me!</button> <!-- The onclick is now an event listener -->
</div>
```

#### Rules

 - The root JSX needs to have only one child, just like React JSX.
 - If you want to nest template literals you'll need to tag them too with `
    jsx` otherwise the HTML will be shown as a plain string.

#### Configuration

There is also a little bit of configuration for the JSX to be found in `src/js/config.js`. These options are:

**jsxPlaceholderPrefix**

This option is used to set a prefix for parameters used in the processor of the tagged template literals. This
should be a string that is never used in your text, since it will then be seen as a parameter placeholder. The
default value is `__JSX_PARAM__`.

**jsxAllowEventStringEval**

This option can be used to allow passing functions as strings to event attributes in the JSX. Like this:
`<button onclick="console.log(this)">Button</button>`, if this is `true` then the actual onclick listener
for that button will be `() => eval('console.log(this)')`. This is not really safe, thus the default value
is `false`. Use this at your own risk!

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
