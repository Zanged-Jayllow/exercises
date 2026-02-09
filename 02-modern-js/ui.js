/**
 * UI utilities module demonstrating template literals, destructuring, and modern JS
 */

/**
 * TODO: Implement display functions using destructuring and template literals
 * displayStatistics(statistics): Extract properties with destructuring, format with template literals
 * displayBooks(books, title): Show formatted book list, use optional chaining for availability
 */
export function displayStatistics(statistics) {
    // Use destructuring to extract statistics properties
    // Use template literals for formatted console output

        const {
            total,
            available,
            checkedOut,
            percentageAvailable,
            uniqueAuthors
        } = statistics;

        console.log(`
        Library Statistics
        =========================
        Total Books: ${total}
        Available Books: ${available}
        Checked Out Books: ${checkedOut}
        Availability: ${percentageAvailable}%
        Unique Authors: ${uniqueAuthors}
        `);
}

export function displayBooks(books, title = "Books") {
    // Display books with formatted output using template literals
    // Handle undefined availability with optional chaining

    console.log(`\n${title}`);
    console.log("=========================");

    books.forEach((book, index) => {
        // Destructure book properties
        const { title, author, year, availability } = book;

        // Optional chaining for nested availability
        const status = availability?.status ?? "unknown";

        // Extra info depending on status
        let availabilityText;

        if (status === "available") {
            availabilityText =
                `Available at ${availability?.location ?? "Unknown location"}`;
        }
        else if (status === "checked_out") {
            availabilityText =
                `Checked out (Due: ${availability?.dueDate ?? "Unknown"})`;
        }
        else {
            availabilityText = "Availability unknown";
        }

        console.log(
            `${index + 1}. "${title}" by ${author} (${year}) — ${availabilityText}`
        );
    });
}

/**
 * TODO: Implement search results and availability formatting
 * displaySearchResults(results, criteria): Show search results with dynamic title
 * formatAvailability(availability): Return formatted status string with optional chaining
 */
export function displaySearchResults(searchResults, searchCriteria) {
    // Use destructuring for search criteria
    // Create dynamic title with template literals

    // Destructure criteria
    const { title, author, genre, available } = searchCriteria;

    // Build dynamic title
    const criteriaParts = [
        title && `Title: "${title}"`,
        author && `Author: ${author}`,
        genre && `Genre: ${genre}`,
        available !== undefined && `Available: ${available ? "Yes" : "No"}`
    ].filter(Boolean); // remove undefined parts

    const criteriaText =
        criteriaParts.length > 0
            ? criteriaParts.join(" | ")
            : "All Books";

    console.log(`
    Search Results
    =========================
    Criteria: ${criteriaText}
    Matches Found: ${searchResults.length}
    `);

    // Display results
    searchResults.forEach((book, index) => {
        const { title, author, year, availability } = book;

        console.log(
            `${index + 1}. "${title}" by ${author} (${year}) — ${formatAvailability(availability)}`
        );
    });

    // No results case
    if (searchResults.length === 0) {
        console.log("No matches found.");
    }
}

export function formatAvailability(availability) {
    // Use optional chaining and nullish coalescing
    // Return formatted status with appropriate symbols

    const status = availability?.status ?? "unknown";

    if (status === "available") {
        const location = availability?.location ?? "Unknown location";
        return `Available — Shelf: ${location}`;
    }

    if (status === "checked_out") {
        const dueDate = availability?.dueDate ?? "Unknown due date";
        return `Checked Out — Due: ${dueDate}`;
    }

    return `Availability Unknown`;
}

/**
 * TODO: Create analysis function demonstrating array methods
 * showBookAnalysis(books): Use map, filter, reduce to show insights
 * Calculate most common decade, genre distribution, etc.
 */
export function showBookAnalysis(books) {
    console.log('\n🔍 === BOOK ANALYSIS ===');
    
    // Use modern array methods to analyze the book collection
    // Show publication decades, genre counts, etc.

    if (!books || books.length === 0) {
        console.log('No books available.');
        return;
    }

    // Availability summary
    const availableBooks = books.filter(
        book => book.availability?.status === 'available'
    );

    const checkedOutBooks = books.filter(
        book => book.availability?.status === 'checked_out'
    );

    console.log('\n--- Book Availability ---');
    console.log(`Available: ${availableBooks.length}`);
    console.log(`Checked Out: ${checkedOutBooks.length}`);

    // Publication decades
    const decades = books.map(book => {
        const year = book.year;
        return Math.floor(year / 10) * 10; // use floor to turn years into decades
    });

    // Count decades using reduce
    const decadeCounts = decades.reduce((acc, decade) => {
        acc[decade] = (acc[decade] || 0) + 1;
        return acc;
    }, {});

    console.log('\n--- Publication by Decade ---');
    Object.entries(decadeCounts).forEach(([decade, count]) => {
        console.log(`${decade}s: ${count} book(s)`);
    });

    // Most common decade
    const mostCommonDecade = Object.entries(decadeCounts)
        .reduce((max, current) =>
            current[1] > max[1] ? current : max
        );

    console.log('\n--- Most Common Publication Decade ---');
    console.log(
        `${mostCommonDecade[0]}s (${mostCommonDecade[1]} books)`
    );

    // Genre distribution
    const genreCounts = books.reduce((acc, book) => {
        const genre = book.genre ?? 'Unknown';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
    }, {});

    console.log('\n--- Genre Distribution ---');
    Object.entries(genreCounts).forEach(([genre, count]) => {
        console.log(`${genre}: ${count}`);
    });
}