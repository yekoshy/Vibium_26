# Vibium_26

## Overview

This repository runs a Vibium test suite and generates an HTML report from the output.

## Prerequisites

- Node.js installed
 version v18.0.0 or higher

## Installation

1. Open a terminal in the project root:

2. Install dependencies:
   ```bash
   npm install vibium
   npm install https://github.com/VibiumDev/vibium.git#main --install-strategy=nested
    cd .\node_modules\vibium-monorepo\clients\javascript
    npm install
    npm run build
    copy .\dist\* ..\..\..\vibium
    cd ..\..\..\..
    npm install --save-dev npm-run-all
   ```


## Running the tests and generating the report

There are two main scripts defined in `package.json`:

- `npm run test:xml` - runs the tests and writes JUnit XML output to `report.xml`
- `npm run report:html` - converts `report.xml` into `report.html`

To run both steps in sequence:

```bash
npm run test
```

Open `report.html` in a browser to view the generated test report.


## Notes

- If you see warnings about deprecated dependencies, updating the package versions may help.
