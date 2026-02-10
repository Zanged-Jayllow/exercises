/**
 * Main entry point for the library management system
 * Demonstrates ES6 modules, async operations, and coordination of different modules
 */

import { books, filterBooksByStatus, groupBooksByGenre, bookTitleGenerator, createBookSummary } from './data.js';
import libraryManager, { LibraryManager, createBookFormatter, memoize } from './library.js';
import { displayStatistics, displayBooks, displaySearchResults, showBookAnalysis, formatAvailability } from './ui.js';

/**
 * TODO: Implement main application function and variable scoping demonstration
 * runLibraryDemo(): Coordinate all modules, handle null default export, show library features
 * demonstrateScoping(): Show let/const behavior, block scoping, temporal dead zone awareness
 */
async function runLibraryDemo() {
    console.log('🚀 Starting Library Management System Demo');
    console.log('='.repeat(50));

    try {
        // Handle case where default export might be null
        const library = libraryManager || new LibraryManager(books);

        demonstrateScoping();

        // Display library statistics and demonstrate book operations
        // Show filtering, grouping, search, and analysis features

        // === STATISTICS ===
        console.log('\n=== LIBRARY STATISTICS ===');
        const stats = library.getStatistics?.() ?? {};
        displayStatistics(stats);

        // === DISPLAY ALL BOOKS ===
        console.log('\n=== ALL BOOKS ===');
        displayBooks(books);

        // === FILTERING ===
        console.log('\n=== AVAILABLE BOOKS ===');
        const availableBooks = filterBooksByStatus(books, 'available');
        displayBooks(availableBooks);

        // === GROUPING ===
        console.log('\n=== BOOKS BY GENRE ===');
        const grouped = groupBooksByGenre(books);
        console.log(grouped);

        // === SEARCH ===
        console.log('\n=== SEARCH RESULTS ("JavaScript") ===');
        const results = library.searchBooks?.('JavaScript') ?? [];
        displaySearchResults(results);

        // === BOOK ANALYSIS ===
        if (books.length > 0) {
            console.log('\n=== BOOK ANALYSIS ===');
            showBookAnalysis(books[0]);
        }

        // === FORMATTER + MEMOIZE ===
        console.log('\n=== FORMATTER & MEMOIZATION ===');

        const formatter = createBookFormatter('** ');
        console.log(formatter(books[0]));

        const memoizedSummary = memoize(createBookSummary);
        console.log(memoizedSummary(books[0]));
        console.log('(Cached call)');
        console.log(memoizedSummary(books[0]));

        // === GENERATOR ===
        showGeneratorExample();

        // === ERROR HANDLING ===
        demonstrateErrorHandling(library);
        
    } catch (error) {
        console.error('Application error:', error.message);
    } finally {
        console.log('\n✅ Demo completed!');
    }
}

function demonstrateScoping() {
    console.log('\n🔍 === VARIABLE SCOPING DEMO ===');
    // Show const/let behavior, block scoping, temporal dead zone

    const systemName = 'Constant Outside The Block';

    if (true) {
        let blockScoped = 'Variable Inside The Block';
        console.log(systemName);
        console.log(blockScoped);
    }

    // console.log(blockScoped); // This causes ReferenceError (block scoped)

    // Temporal Dead Zone demo
    try {
        console.log("\nVariable Initialized Before Being Referenced");
        let tdzVar1 = "Initialized Before";
        console.log("Using Variable: ", tdzVar1);
        console.log("\nVariable Initialized After Being Referenced");
        console.log("Using Variable", tdzVar2); // This causes TDZ Error
        let tdzVar2 = 'Initialized After';
    } catch (error) {
        console.log('TDZ error caught:', error.message);
    }

    // Const behavior
    const config = { maxBooks: 5 };
    // Constant Containing An Object: Object Mutation Is Allowed
    config.maxBooks = 10;
    console.log('Updated config:', config);
    // Constant Reassignment: Not Allowed
    try {
        console.log('Current config:', config);
        console.log('Attempting To Reassign config')
        config = 23;
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    // Constant Redeclaration: Not Allowed
    try {
        console.log('Current config:', config);
        console.log('Attempting To Redeclare config')
        const config = 23;
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    // Constant Redeclaration: Not Allowed
    try {
        console.log('Current config:', config);
        console.log('Attempting To Redeclare config as Variable')
        let config = 23;
    } catch (error) {
        console.log('Error caught:', error.message);
    }

    //TODO: Variable Behavior
}

/**
 * TODO: Implement error handling and generator demonstrations  
 * demonstrateErrorHandling(library): Show try/catch, optional chaining, nullish coalescing
 * showGeneratorExample(): Use bookTitleGenerator to iterate through titles
 */
function demonstrateErrorHandling(library) {
    console.log('\n⚠️  === ERROR HANDLING DEMO ===');
    // Test safe property access, array methods on potentially undefined values

    // Try Catch Block
    try {
        // Optional chaining + Nullish coalescing
        const firstBookTitle = library.books?.[0]?.title ?? 'Unknown Title';
        console.log('First Book Title:', firstBookTitle);

        // TODO: Safe array operation

        // TODO: Availability formatting

    } catch (error) {
        console.error('Handled error:', error.message);
    }

    // Try Catch Blocks - Intentional Error Triggering
    try {
        // Without Optional chaining
        console.log('Property Access Without Optional Chaining')
        const firstBookGenre = library.books[0].genre;
        console.log('First Book Genre:', firstBookGenre);
    } catch (error) {
        console.error('Handled error:', error.message);
    }

    try {
        // Without Nullish coalescing
        console.log('Property Access Without Nullish Coalescing')
        const firstBookYear = library.books?.[0]?.year;
        console.log('First Book Year:', firstBookYear);
    } catch (error) {
        console.error('Handled error:', error.message);
    }

    // TODO: Try-Catch Block For Safe Array Opertions
    // TODO: Try-Catch Block For Availability Formatting
}

function showGeneratorExample() {
    console.log('\n🔄 === GENERATOR DEMO ===');
    // Use bookTitleGenerator and show iteration

    const generator = bookTitleGenerator(books);

    for (const title of generator) {
        console.log('Book: ', title);
    }
}

/**
 * TODO: Start the application and demonstrate array destructuring
 * Call runLibraryDemo() when module loads
 * Show destructuring with first book, second book, and rest pattern
 */
// Start application and show destructuring example
console.log('\n📖 === DESTRUCTURING DEMO ===');
const [firstBook, secondBook, ...remainingBooks] = books;
// Display destructured results
console.log('First book:', firstBook?.title ?? 'N/A');
console.log('Second book:', secondBook?.title ?? 'N/A');
console.log('Remaining count:', remainingBooks.length);

runLibraryDemo();