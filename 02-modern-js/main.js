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

    // Using library object?

    // Try Catch Block
    try {
        // Optional chaining + Nullish coalescing
        console.log('\n--- Demonstrating Optional Chaining + Nullish Coalescing ---');
        const firstBookTitle = library.books?.[0]?.title ?? 'Unknown Title';
        console.log('First Book Title:', firstBookTitle);

        // Safe array operation
        console.log('\n--- Demonstrating Safe Array Operation ---');
        console.log("Filtering with optional chaining + Nullish Coalescing");
        const safeArray = library.books || [];
        const availableCount = safeArray.filter(book => book.availability?.status === 'available').length;
        console.log('Available books:', availableCount);

        // Availability formatting
        console.log('\n--- Demonstrating Availability Formatting (UI Layer) ---');

        const testCases = [
            ['Test 1 (status: available with location)', { status: 'available', location: 'A-101' }],
            ['Test 2 (status: checked out with due dates)', { status: 'checked_out', dueDate: '2024-12-31' }],
            ['Test 3 (status: unknown)', { status: 'unknown' }],
            ['Test 4 (status is undefined)', undefined],
            ['Test 5 (status: available with missing location)', { status: 'available' }],
            ['Test 6 (status: checked out with missing due dates)', { status: 'checked_out' }],
            ['Test 7 (status is broken values)', { status: 'adfhiahdf' }],
            ['Test 8 (status: available with broken location)', { status: 'available', location: 'asdasdf' }],
            ['Test 9 (status: checked out with broken due dates)', { status: 'checked_out', dueDate: 'adfasdf' }],
            ['Test 10 (status is not valid)', 234],
            ['Test 11 (status: available with invalid date parameter)', { status: 'available', dueDate: 'adfasdf' }],
            ['Test 12 (status: checked out with invalid location parameter)', { status: 'checked_out', location: 'adfasdf' }]
        ];

        // Run all tests
        testCases.map(([description, input]) => {
            const result = formatAvailability?.(input) ?? 'Formatter not available';
            return { description, input, result };
        }).forEach(test => {
            console.log(`${test.description}: ${test.result}`);
        });

        // Test with real book that is available
        console.log("Try To Run Format Availability On Real Library Books")
        if (library?.books && Array.isArray(library.books)) {
            library.books.forEach((book) => {
                if (book?.availability) {
                    const availability = formatAvailability?.(book.availability) ?? 'Formatter not available';
                    console.log(`Book (${book.title || 'Untitled'}): ${availability}`);
                } else {
                    console.log(`Book (${book.title || 'Untitled'}): No availability data`);
                }
            });
        } else {
            console.log('No books found in library');
        }

    } catch (error) {
        console.log('Error caught:', error.message);
    }

    console.log('\n--- Demonstrating The Effect Of Try-Catch Handling ---');
    // Try Catch Blocks - Intentional Error Triggering
    try {
        // Without Optional chaining
        console.log('\nProperty Access Without Optional Chaining');
        console.log('Attempting To Access library.badbooks[0].doi (badbooks does not exist)');
        const firstBookDOI = library.badbooks[0].doi;
        console.log('First Book Genre:', firstBookDOI);
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    try {
        // Without Nullish coalescing
        console.log('\nString Operation Without Nullish Coalescing');
        console.log('Attempting To Do Operations With library.books?.[0]?.slogan (slogan does not exist)');
        const firstBookSlogan = library.books?.[0]?.slogan;
        console.log('Title uppercase:', firstBookSlogan.toUpperCase());
    } catch (error) {
        console.log('Error caught:', error.message);
    }

    // TODO: Try-Catch Block For Safe Array Operations
    // Safe as in being non-mutating methods like map(), filter(), and reduce()?
    // Is this what the question meant?
    try {
        console.log('\nSafe Array Operations (Map) Without Optional Chaining');
        console.log('Attempt to map undefined array library.badbooks');
        const mapResult = library.badbooks.map(book => book.title);
        console.log('Result:', mapResult);
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    try {
        console.log('\nSafe Array Operations (Filter) Without Optional Chaining');
        console.log('Attempt to filter undefined array library.badbooks');
        const recentBooks = library.badbooks.filter(book => book.year > 2000);
        console.log('Result:', recentBooks);
    } catch (error) {
        console.log('Error caught:', error.message);
    }
    try {
        console.log('\nSafe Array Operations (Reduce) Without Optional Chaining');
        console.log('Attempt to reduce undefined array library.badbooks');
        const averageYear = library.badbooks.reduce((acc, book) => {
            return acc + book.year;
        }, 0) / library.badbooks.length;
        console.log('Result:', averageYear);
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
        console.log('Result formatting invalid status:', formatted);
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

function showFormatterExample(formatterFunc = (book) => book.title?.toLowerCase() || '') {
    console.log('\n=== Formatter Demo ===');
    console.log("Attempting Creating Book Formatter With", formatterFunc);
    const formatter = createBookFormatter(formatterFunc);
    console.log("Attempting To Use Formatter On One Book");
    console.log("Before:", [books[0]]);
    console.log("Result:", formatter([books[0]]));
    console.log("Attempting To Use Formatter Book Array");
    console.log("Before:", books);
    console.log("Result:", formatter(books));
}

function showMemoExample() {
    console.log('\n=== Memoization Demo ===');

    console.log('Initial Call');
    const memoizedSummary = memoize(createBookSummary);
    console.log(memoizedSummary(books[0]));
    console.log('Try With Cached call');
    // This should return the cached value
    console.log(memoizedSummary(books[0]));
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
        showFormatterExample();
        showMemoExample();
        /* console.log('\n=== FORMATTER & MEMOIZATION ===');

        const lowercaseTitleFunc = (book) => book.title?.toLowerCase() || '';

        const formatter = createBookFormatter(lowercaseTitleFunc);
        console.log(formatter([books[0]]));

        const memoizedSummary = memoize(createBookSummary);
        console.log(memoizedSummary(books[0]));
        console.log('Try With Cached call');
        // This should return the cached value without re-computing things
        console.log(memoizedSummary(books[0])); */

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