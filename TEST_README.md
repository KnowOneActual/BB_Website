# Daily Links Unit Tests

This project includes comprehensive unit tests for the `daily-links.js` module.

## Test Coverage

The test suite covers the following scenarios:

### 1. **Fetching and Parsing** (`daily-links.json`)
- Successfully fetches the JSON data file
- Correctly parses the JSON response
- Validates data structure and properties

### 2. **Grouping Links by Category**
- Groups links by their `category` property
- Handles uncategorized links (defaults to "Uncategorized")
- Handles empty link arrays

### 3. **DOM Rendering**
- Clears loading message before rendering
- Dynamically creates sections for each category
- Renders link elements with correct attributes (`href`, `target`, `rel`)
- Renders link titles and icons correctly
- Adds arrow icons to each link

### 4. **Error Handling**
- Displays error message when fetch fails
- Displays error message when HTTP response is not OK (e.g., 404)
- Logs errors to console

### 5. **Icon Handling**
- Renders links with specified icons
- Uses default icon (`fa-solid fa-link`) when icon is not specified
- Uses default icon when icon is an empty string
- Handles multiple links with different icons
- Applies correct color styling to all icons

## Installation

Install the required dependencies:

```bash
npm install
```

This will install:
- `jest` - Testing framework
- `jest-environment-jsdom` - DOM environment for testing
- `@testing-library/jest-dom` - Custom Jest matchers for DOM

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Files

- **`daily-links.test.js`** - Main test suite with all unit tests
- **`jest.config.js`** - Jest configuration
- **`jest.setup.js`** - Global test setup file

## Test Structure

The tests are organized into 5 main describe blocks, each covering one of the required test cases:

1. `fetching and parsing daily-links.json`
2. `grouping links by category`
3. `rendering categories and links`
4. `error handling`
5. `icon handling`

Each describe block contains multiple `it()` test cases that verify specific functionality.

## Mocking

The tests use Jest's built-in mocking capabilities:
- `fetch` is mocked using `jest.spyOn(global, 'fetch')`
- DOM environment is provided by `jsdom`
- Console methods are mocked when testing error logging

## Coverage Report

After running `npm run test:coverage`, you can view the coverage report:
- **Terminal**: Summary displayed in the console
- **HTML**: Open `coverage/index.html` in a browser for detailed report
- **LCOV**: `coverage/lcov.info` for CI/CD integration

## Notes

- Tests are isolated and do not depend on the actual `data/daily-links.json` file
- Each test uses mock data to ensure predictable results
- DOM is reset before each test using `beforeEach()` hook
- All mocks are cleaned up after each test using `afterEach()` hook
