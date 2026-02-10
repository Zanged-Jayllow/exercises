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
        console.log('\n=== SEARCH RESULTS ("Design Patterns") ===');
        // Debug Code
        // console.log('Library object:', library);
        // console.log('Search method exists:', typeof library.searchBooks);

        const results = library.searchBooks?.({ title: 'Design Patterns' }) ?? [];

        // console.log('Search results exists:', typeof results);
        displaySearchResults(results, { title: 'Design Patterns' });

        // === BOOK ANALYSIS ===
        if (books.length > 0) {
            console.log('\n=== BOOK ANALYSIS ===');
            showBookAnalysis(books);
        }

        // === FORMATTER + MEMOIZE ===
        console.log('\n=== FORMATTER & MEMOIZATION ===');

        const formatter = createBookFormatter('** ');
        console.log(formatter([books[0]]));

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

    // Const behavior
    const config = { maxBooks: 5 };
    // Constant Containing An Object: Object Mutation Is Allowed
    console.log('Current config constant:', config);
    console.log('Attempting To Mutate maxBooks inside config constant');
    config.maxBooks = 10;
    console.log('Updated config constant:', config);
    // Constant Reassignment: Not Allowed
    try {
        const config = { maxBooks: 5 };
        console.log('Current config constant:', config);
        console.log('Attempting To Reassign config constant');
        config = 23;
        console.log('Updated config constant:', config);
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    // Constant Redeclaration: Not Allowed Within Same Block
    try {
        eval(`
            const config = { maxBooks: 5 };
            console.log('Current config constant:', config);
            console.log('Attempting To Redeclare config constant as constant');
            const config = 23;
            console.log('Updated config constant:', config);
        `)
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    // Constant Redeclaration: Not Allowed Within Same Block
    try {
        eval(`
            const config = { maxBooks: 5 };
            console.log('Current config constant:', config);
            console.log('Attempting To Redeclare config constant as variable');
            let config = 23;
            console.log('Updated config constant:', config);
        `)
    } catch (error) {
        console.log('Error caught:', error.message);
    }

    //let Behavior
    // Variable Reassignment: Allowed
    try {
        let configvar = {maxBooks: 5};
        console.log('Current config variable:', configvar);
        console.log('Attempting To Reassign config variable');
        configvar = 23;
        console.log('Updated config variable:', configvar);
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    // Variable Redeclaration: Not Allowed Within Same Block
    try {
        eval(`
            let configvar = {maxBooks: 5};
            console.log('Current config variable:', configvar);
            console.log('Attempting To Redeclare config variable as constant');
            const configvar = 23;
            console.log('Updated config variable:', configvar);
        `)
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    // Variable Redeclaration: Not Allowed Within Same Block
    try {
        eval(`
            let configvar = {maxBooks: 5};
            console.log('Current config variable:', configvar);
            console.log('Attempting To Redeclare config variable as variable');
            let configvar = 23;
            console.log('Updated config variable:', configvar);
        `)
    } catch (error) {
        console.log('Error caught:', error.message);
    }

    // Block Scoping - Present Both For let And const
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
        const safeArray = library.books || [];
        const availableCount = safeArray.filter(book => book.status === 'available').length;
        console.log('Available books (safe array operation):', availableCount);

        // TODO: Availability formatting
        const formattedAvailability = formatAvailability?.() ?? 'Availability formatter not available';
        console.log('Formatted availability:', formattedAvailability);

        // Test formatting with a specific book
        if (books[0]) {
            const bookAvailability = formatAvailability?.(books[0].status) ?? 'Unknown';
            console.log('Book 1 availability:', bookAvailability);
        }

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
    try {
        console.log('\n=== Safe Array Operations ===');
        const undefinedArray = undefined;
        // This would normally throw an error
        const mapResult = undefinedArray?.map?.(book => book.title) ?? [];
        console.log('Safe map operation on undefined array:', mapResult);
        
        // Empty array case
        const emptyArray = [];
        const emptyResult = emptyArray.map(book => book.title);
        console.log('Map on empty array:', emptyResult);
    } catch (error) {
        console.error('Array operation error:', error.message);
    }

    // TODO: Try-Catch Block For Availability Formatting
    try {
        console.log('\n=== Availability Formatting ===');
        const invalidStatus = 'unknown_status';
        const formatted = formatAvailability(invalidStatus);
        console.log('Formatting invalid status:', formatted);
    } catch (error) {
        console.error('Formatting error:', error.message);
        console.log('Using fallback formatting...');
        const fallbackResult = invalidStatus === 'available' ? 'Available' : 
                              invalidStatus === 'checked_out' ? 'Checked Out' : 
                              'Unknown Status';
        console.log('Fallback formatting result:', fallbackResult);
    }
}

function showGeneratorExample() {
    console.log('\n🔄 === GENERATOR DEMO ===');
    // Use bookTitleGenerator and show iteration

    const generator = bookTitleGenerator(books);

    console.log('Iterating through book titles using generator:');
    for (const title of generator) {
        console.log('📚 Book:', title);
    }

    // Demonstrating manual iteration
    console.log('\nManual generator iteration:');
    const manualGenerator = bookTitleGenerator(books);
    let result = manualGenerator.next();
    while (!result.done) {
        console.log('Manual iteration:', result.value);
        result = manualGenerator.next();
    }
    console.log('Generator finished:', result.done);
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