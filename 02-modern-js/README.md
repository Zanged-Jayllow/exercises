# JavaScript Exercise: Modern Features & Best Practices

## Overview
This exercise evaluates your understanding of modern JavaScript concepts including variable scoping, destructuring, spread/rest operators, template literals, optional chaining, modules, and more.

## Learning Objectives
- Demonstrate understanding of variable scoping (var, let, const)
- Apply destructuring for objects and arrays
- Use spread/rest operators effectively
- Implement template literals and string interpolation
- Work with optional chaining and nullish coalescing
- Create and use ES6 modules
- Implement functions as first-class values
- Use modern collection types (Map, Set)
- Apply JSDoc documentation

## Exercise Structure
The exercise consists of several modules that work together to create a simple library management system:

1. **data.js** - Contains sample data and data manipulation utilities
2. **library.js** - Core library functionality using modern JS features
3. **ui.js** - User interface utilities and display functions
4. **main.js** - Entry point that ties everything together
5. **index.html** - HTML file to run the application

## Understanding the Application

You are building a **Library Management System** that demonstrates modern JavaScript features through practical functionality. The application consists of five interconnected modules:

**Core Architecture:**
- `data.js` - Contains sample book data and utility functions for data manipulation
- `library.js` - Implements the main LibraryManager class with advanced features
- `ui.js` - Handles console-based display and formatting of information
- `main.js` - Entry point that coordinates all modules and runs demonstrations
- `index.html` - Browser interface that loads the application as ES6 modules

**Application Flow:**
1. Sample book data is loaded with properties like title, author, availability status
2. LibraryManager class provides methods to search, filter, and analyze books
3. UI utilities format and display information using modern JavaScript features
4. Main application demonstrates all functionality through console output

**Key Features Demonstrated:**
- Book filtering by availability status (available, checked out)
- Grouping books by genre using Map data structure
- Search functionality with multiple criteria
- Statistical analysis of library collection
- Dynamic formatting using template literals and destructuring

## Task Checklist

Complete the following tasks by finding and implementing all `TODO` comments:

### Data Layer (`data.js`) - 3 tasks
- [✅] **Task 1:** Create Map for book categories and Set for unique authors using constructors and spread operator
- [✅] **Task 2:** Implement `filterBooksByStatus()` and `groupBooksByGenre()` functions using array methods and optional chaining
- [✅] **Task 3:** Create generator function `bookTitleGenerator()` and `createBookSummary()` with destructuring and template literals

### Library Management (`library.js`) - 3 tasks
- [🔧] **Task 1:** Implement `addBooks()` method using rest parameters and `searchBooks()` with destructuring parameters
- [🔧] **Task 2:** Implement `getStatistics()` and `updateBook()` methods using computed properties and logical assignment operators
- [🔧] **Task 3:** Create higher-order functions `createBookFormatter()` and `memoize()` for functional programming patterns

### User Interface (`ui.js`) - 3 tasks
- [🔧] **Task 1:** Implement `displayStatistics()` and `displayBooks()` using destructuring and template literals for formatted output
- [🔧] **Task 2:** Implement `displaySearchResults()` and `formatAvailability()` with dynamic titles and optional chaining
- [🔧] **Task 3:** Create `showBookAnalysis()` function demonstrating array method combinations (map, filter, reduce)

### Main Application (`main.js`) - 3 tasks
- [🔧] **Task 1:** Implement `runLibraryDemo()` main function and `demonstrateScoping()` showing let/const behavior
- [🔧] **Task 2:** Implement `demonstrateErrorHandling()` and `showGeneratorExample()` functions with modern error handling patterns
- [🔧] **Task 3:** Start the application and demonstrate array destructuring with first, second, and rest elements

### Code Quality Requirements
- [🔧] Use `const` for values that won't be reassigned, `let` for variables that change
- [✅] Avoid `var` declarations entirely
- [🔧] Apply destructuring in function parameters and assignments where possible
- [🔧] Use template literals instead of string concatenation
- [🔧] Use optional chaining when accessing potentially undefined properties
- [🔧] Use nullish coalescing for default value assignments

**Total: 12 focused tasks across 4 files**

## Testing Your Implementation

1. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)
2. Open Developer Tools (F12) and check the Console tab
3. Verify the following output appears:
   - Library statistics and metrics
   - Formatted book listings and summaries
   - Search and filter results
   - Demonstration of JavaScript features
   - No error messages or undefined values

## Expected Console Output Structure

```
🚀 Starting Library Management System Demo
==================================================

🔍 === VARIABLE SCOPING DEMO ===
[Scoping demonstrations]

📊 === LIBRARY STATISTICS ===
[Library metrics and counts]

📖 === DESTRUCTURING DEMO ===
[Array and object destructuring examples]

[Additional sections showing various features...]

✅ Demo completed! Check your implementations against the TODO comments.
```

## Expected Output
When working correctly, the console should display:
- Library statistics and summary information
- Formatted book listings
- Search and filter results
- Demonstration of various JavaScript features

## Submission
Ensure all files are complete and the application runs without errors in the browser console.