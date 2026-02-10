/**
 * Main entry point for the library management system
 * Demonstrates ES6 modules, async operations, and coordination of different modules
 */

import { books, filterBooksByStatus, groupBooksByGenre, bookTitleGenerator, createBookSummary } from './data.js';
import libraryManager, { LibraryManager, createBookFormatter, memoize } from './library.js';
import { displayStatistics, displayBooks, displaySearchResults, showBookAnalysis, formatAvailability } from './ui.js';

// wrapped inside to port it
function showDestructuringExample() {
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
}

/**
 * TODO: Implement main application function and variable scoping demonstration
 * demonstrateScoping(): Show let/const behavior, block scoping, temporal dead zone awareness
 */
function demonstrateScoping() {
    console.log('\n🔍 === VARIABLE SCOPING DEMO ===');
    // Show const/let behavior, block scoping, temporal dead zone

    // Const behavior
    console.log('\n--- Const Behavior ---');
    // Constant Containing An Object: Object Mutation Is Allowed
    try {
        console.log('--- Mutation ---');
        const config = { maxBooks: 5 };
        console.log('Current config constant:', config);
        console.log('Attempting To Mutate maxBooks inside config constant');
        config.maxBooks = 10;
        console.log('Updated config constant:', config);
    } catch (error) {
        console.log('Error caught:', error.message);
        console.log('Refresh the page/console and try again!');
    }
    // Constant Reassignment: Not Allowed
    try {
        console.log('--- Reassignment ---');
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
        console.log('--- Redeclaration ---');
        console.log('Attempting To Redeclare config constant as constant');
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
        console.log('Attempting To Redeclare config constant as variable');
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
    console.log('\n--- Let Behavior ---');
    // Variable Reassignment: Allowed
    try {
        console.log('--- Reassignment ---');
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
        console.log('--- Redeclaration ---');
        console.log('Attempting To Redeclare config variable as constant');
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
        console.log('Attempting To Redeclare config variable as variable');
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
    console.log('\n--- Block Scoping ---');
    // Referencing variable in upper level from lower is allowed
    console.log("--- Referencing Outside Variables From Inside ---");
    {
        const systemName = 'Constant Outside The Block';
        {
            let blockScoped = 'Variable Inside The Block';
            console.log("Refernecing: ", systemName);
            console.log("Referencing: ", blockScoped);
        }
    }
    
    // Referencing varibale in lower level from upper is not allowed
    console.log("--- Referencing Inside Variables From Outside ---");
    try{
        const systemName = 'Constant Outside The Block';
        {
            let blockScoped = 'Variable Inside The Block';
        }
        console.log("Refernecing: ", systemName);
        console.log("Referencing: ", blockScoped);
    }
    catch(error){
        console.log('Error caught:', error.message);
    }

    // Redeclaring const inside a block is allowed
    console.log("--- Redeclaring Constant Inside A Block ---");
    {
        const systemName = 'Constant Outside The Block';
        {
            const systemName = 'Constant Inside The Block';
            console.log("Refernecing: ", systemName);
        }
        console.log("Refernecing: ", systemName);
    }

    // Temporal Dead Zone demo
    console.log('\n--- Temporal Dead Zone ---');
    try {
        console.log("Variable Initialized Before Being Referenced");
        let tdzVar1 = "Initialized Before";
        console.log("Attempting to Use Variable");
        console.log("Variable: ", tdzVar1);
        console.log("Variable Initialized After Being Referenced");
        console.log("Attempting to Use Variable");
        console.log("Variable", tdzVar2); // This causes TDZ Error
        let tdzVar2 = 'Initialized After';
    } catch (error) {
        console.log('Error caught:', error.message);
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
        console.log('\n--- Demonstrating Optional Chaining + Nullish Coalescing ---');
        const firstBookTitle = library.books?.[0]?.title ?? 'Unknown Title';
        console.log('First Book Title:', firstBookTitle);

        // Safe array operation
        console.log('\n--- Demonstrating Safe Array Operation ---');
        const safeArray = library.books || [];
        const availableCount = safeArray.filter(book => book.status === 'available').length;
        console.log('Available books (safe array operation):', availableCount);

        // Availability formatting
        console.log('\n--- Demonstrating Availability formatting (With ui Layer) ---');

        const testAvailability1 = { status: 'available', location: 'A-101' };
        const testAvailability2 = { status: 'checked_out', dueDate: '2024-12-31' };
        const testAvailability3 = { status: 'unknown' };
        const testAvailability4 = undefined;

        console.log('Test 1 (available):', formatAvailability?.(testAvailability1) ?? 'Formatter not available');
        console.log('Test 2 (checked out):', formatAvailability?.(testAvailability2) ?? 'Formatter not available');
        console.log('Test 3 (unknown):', formatAvailability?.(testAvailability3) ?? 'Formatter not available');
        console.log('Test 4 (undefined):', formatAvailability?.(testAvailability4) ?? 'Formatter not available');

        // Also test with a real book if available
        if (books[0]?.availability) {
            const bookAvailability = formatAvailability(books[0].availability);
            console.log('Book 1 availability:', bookAvailability);
        }

    } catch (error) {
        console.log('Error caught:', error.message);
    }

    console.log('\n--- Demonstrating Try-Catch Handling ---');
    // Try Catch Blocks - Intentional Error Triggering
    try {
        // Without Optional chaining
        console.log('\nProperty Access Without Optional Chaining');
        const firstBookDOI = library.badbooks[0].doi;
        console.log('First Book Genre:', firstBookDOI);
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    try {
        // Without Nullish coalescing
        console.log('\nString Operation Without Nullish Coalescing');
        const firstBookSlogan = library.books?.[0]?.slogan;
        console.log('Title uppercase:', firstBookSlogan.toUpperCase());
    } catch (error) {
        console.log('Error caught:', error.message);
    }

    // TODO: Try-Catch Block For Safe Array Opertions
    try {
        console.log('\n--- Safe Array Operations ---');
        const undefinedArray = undefined;
        // This would normally throw an error
        const mapResult = undefinedArray?.map?.(book => book.title) ?? [];
        console.log('Safe map operation on undefined array:', mapResult);
        
        // Empty array case
        const emptyArray = [];
        const emptyResult = emptyArray.map(book => book.title);
        console.log('Map on empty array:', emptyResult);
    } catch (error) {
        console.log('Error caught:', error.message);
    }

    // This Try Catch Block Demonstrates How The Formatter
    // Already handles invalid inputs, so technically it won't
    // get triggered.
    try {
        console.log('\n--- Availability Formatting ---');
        const invalidStatus = 'unknown_status';
        const formatted = formatAvailability(invalidStatus);
        console.log('Formatting invalid status:', formatted);
    } catch (error) {
        console.log('Error caught:', error.message);
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

    console.log('Iterating through books using generator:');
    for (const title of generator) {
        console.log('Book:', title);
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
 * TODO: Implement main application function and variable scoping demonstration
 * runLibraryDemo(): Coordinate all modules, handle null default export, show library features
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
        console.log('\n📊 === LIBRARY STATISTICS ===');
        const stats = library.getStatistics?.() ?? {};
        displayStatistics(stats);

        // Destructuring Demo
        showDestructuringExample();

        // Functionality Demo
        console.log('\n🔧 === FUNCTIONALITY DEMOS ===');

        // Display Books Demo
        displayBooks(books, "=== ALL BOOKS ===");

        // Filter By Status Demo
        const availableBooks = filterBooksByStatus(books, 'available');
        displayBooks(availableBooks, '=== AVAILABLE BOOKS ===');
        const borrowedBooks = filterBooksByStatus(books, 'checked_out');
        displayBooks(borrowedBooks, '=== CHECKED OUT BOOKS ===');

        // Group by Genre Demo
        console.log('\n=== BOOKS BY GENRE ===');
        const grouped = groupBooksByGenre(books);
        console.log(grouped);

        // Searching Demo
        console.log('\n=== SEARCH RESULTS ("Design Patterns") ===');
        // Debug Code
        // console.log('Library object:', library);
        // console.log('Search method exists:', typeof library.searchBooks);

        const results = library.searchBooks?.({ title: 'Design Patterns' }) ?? [];

        // console.log('Search results exists:', typeof results);
        displaySearchResults(results, { title: 'Design Patterns' });

        // Book Analysis Demo
        if (books.length > 0) {
            showBookAnalysis(books);
        }
        else{
            console.log('\n🔍 === BOOK ANALYSIS ===');
            console.log('Cannot Proceed: No Books Available');
        }

        // Formatter + Memoize Demo
        console.log('\n=== FORMATTER & MEMOIZATION ===');

        const lowercaseTitleFunc = (book) => book.title?.toLowerCase() || '';

        const formatter = createBookFormatter(lowercaseTitleFunc);
        console.log(formatter([books[0]]));

        const memoizedSummary = memoize(createBookSummary);
        console.log(memoizedSummary(books[0]));
        console.log('Try With Cached call');
        // This should return the cached value without re-computing things
        console.log(memoizedSummary(books[0]));

        // Generator Demo
        showGeneratorExample();

        // Error Handling Demo
        demonstrateErrorHandling(library);
        
    } catch (error) {
        console.error('Application error:', error.message);
    } finally {
        console.log('\n✅ Demo completed!');
    }
}

runLibraryDemo();