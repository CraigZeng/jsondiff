# jsondiff

## Description

visualize json difference

## Purpose

This project helps visualize the differences between two JSON objects. It provides a clear and intuitive interface to compare and identify changes in JSON data structures.

## Installation

This is an NPM package. You can install it using npm:

```bash
npm install jsondiff
```

## Usage

Import the `JSONDiff` class into your project:

```javascript
// ES6 module
import JSONDiff from 'jsondiff';

// CommonJS
// const JSONDiff = require('jsondiff');
```

Then, instantiate `JSONDiff` with a container element and the JSON data to compare:

```javascript
const diffViewer = new JSONDiff({
  container: document.getElementById('my-diff-container'), // or any other DOM element
  data: {
    base: { /* your first JSON object */ },
    test: { /* your second JSON object to compare */ }
  }
});
```

The necessary CSS styles are compiled from `jsondiff.less` and bundled with the JavaScript during the build process. If you are importing the module, you typically do not need to include a separate CSS file.

## Development Scripts

The following scripts are available for development:

*   `npm run build`: Builds the project for production. This command sets `NODE_ENV=production` and runs webpack with progress and production optimizations (`-p`).
*   `npm run dev`: Starts the webpack development server. This command sets `NODE_ENV=dev` and opens the application in your default browser.

## License

This project is licensed under the MIT License.

## Author

craigzeng

## Contributing

Contributions are welcome! Please refer to the repository's issue tracker and pull request guidelines.

## Repository

You can find the source code and contribute to the project on GitHub:
[https://github.com/CraigZeng/jsondiff](https://github.com/CraigZeng/jsondiff)
