/**
 * Data module for library management system
 * Demonstrates modern JavaScript data structures and manipulation
 */

// Sample book data
export const books = [
    {
        id: 1,
        title: "The Clean Coder",
        author: "Robert C. Martin",
        year: 2011,
        genre: "Programming",
        availability: { status: "available", location: "A1-23" }
    },
    {
        id: 2,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        year: 2014,
        genre: "Programming",
        availability: { status: "checked_out", dueDate: "2024-12-01" }
    },
    {
        id: 3,
        title: "Design Patterns",
        author: "Gang of Four",
        year: 1994,
        genre: "Software Engineering"
        // Note: availability is intentionally missing for some books
    },
    {
        id: 4,
        title: "Clean Architecture",
        author: "Robert C. Martin",
        year: 2017,
        genre: "Programming",
        availability: { status: "available", location: "A2-15" }
    }
];

// TODO: Create a Map for book categories and a Set for unique authors
// Map: "Programming" -> "Books about programming languages and techniques"
//      "Software Engineering" -> "Books about software design and architecture"
// Set: Extract all unique author names from the books array using spread operator
export const categoryDescriptions = new Map([["Programming", "Books about programming languages and techniques"],["Software Engineering","Books about software design and architecture"]]);
export const uniqueAuthors = new Set([...books.map(book => book.author)]);

/**
 * TODO: Implement filterBooksByStatus and groupBooksByGenre functions
 * filterBooksByStatus: Use array filter method and optional chaining for availability
 * groupBooksByGenre: Return Map with genre as key, array of books as value
 */
export function filterBooksByStatus(bookArray, status) {

    // Handles unexpected inputs
    if (!Array.isArray(bookArray)) {
        console.warn('filterBooksByStatus: Expected array, received', typeof bookArray);
        return [];
    }
    
    // Filter books by availability status, handle undefined availability
    return bookArray.filter(book => book?.availability?.status === status);
}

export function groupBooksByGenre(bookArray) {
    // Group books into Map by genre
    const genreMap = new Map();
    
    bookArray.forEach(book => {
        // Get the genre from the book, use optional chaining to handle undefined
        const genre = book?.genre;
        
        if (genre) {
            // If genre already exists in Map, add book to its array
            // If not, create new array with the book
            if (genreMap.has(genre)) {
                genreMap.get(genre).push(book);
            }
            else {
                genreMap.set(genre, [book]);
            }
        }
    });
    
    return genreMap;
}

/**
 * TODO: Create generator function and book summary function
 * bookTitleGenerator: Generator that yields each book title using for...of
 * createBookSummary: Use destructuring and template literals for formatted output
 * Example: "The Clean Coder by Robert C. Martin (2011) - Available at A1-23"
 */
export function* bookTitleGenerator(bookArray) {
    for (const book of bookArray) {
        yield book.title;
    }
}

export function createBookSummary(book) {
    // Destructure book properties and create formatted summary
    
    // Preliminary checks for broken inputs
    if (!book || typeof book !== "object") {
        return "Unknown Title by Unknown Author (Unknown Year) - Status: Unknown";
    }

    // Destructure book properties
    const {
        title = "Unknown Title",
        author = "Unknown Author",
        year = "Unknown Year",
        availability = {}
    } = book;
    
    // Destructure availability properties
    const {
        status: availStatus = "Unknown",
        location,
        dueDate
    } = availability;
    
    const statusLower = availStatus.toLowerCase();
    
    // Use template literals for string interpolation
    let availInfo = "";
    
    if (statusLower === "available") {
        availInfo = ` - Status: Available at ${location || "Unknown Location"}`;
    } else if (statusLower === "checked_out") {
        availInfo = ` - Status: Checked Out And Due at ${dueDate || "Unknown Time"}`;
    } else {
        availInfo = ` - Status: ${availStatus}`;
    }

    // Create the final output using template literals
    const output = `${title} by ${author} (${year})${availInfo}`;

    return output;
}