## Basic setup with TailwindCSS and VSCode settings.

### Tailwind CDN 1

```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Tailwind CDN Alternative

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

### .vscode/settings.json

```json
{
  "tailwindCSS.includeLanguages": {
    "html": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["class\\s*=\\s*\"([^\"]*)\"", 1]
  ],
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### tailwind.config.js

```js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```