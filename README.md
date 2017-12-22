# Memoriae API

![](https://i.imgur.com/Q11Sq67.gif)

# Install dependencies
```bash
npm install
```

# Create environment configs
```bash
cp src/config/environments/environments.json.example src/config/environments/development.json
cp src/config/environments/environments.json.example src/config/environments/test.json
cp src/config/environments/environments.json.example src/config/environments/production.json
```

# Start development
This will start auto-reload development web server and will check linting, tests and test coverage on every file change

```bash
npm run dev
```
# Run linter
This will run linter and exits with error code if there is a linting error

```bash
npm run lint
```
# Run tests
This will run tests and exits with error code if any test fails

```bash
npm run test
```
# Run coverage
This will check for test coverages to meet required criterias. Exists with error code if fails

```bash
npm run coverage
```
Required Criterias:
 - Lines: 85
 - Functions: 85
 - Branches 85
# Run coverage report
This will create test coverage report in html format

```bash
npm run coverage:report
```
# Start production server:
```bash
TYPE = production npm start
```
