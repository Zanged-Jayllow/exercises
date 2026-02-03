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
    // Filter books by availability status, handle undefined availability
}

export function groupBooksByGenre(bookArray) {
    // Group books into Map by genre
}

/**
 * TODO: Create generator function and book summary function
 * bookTitleGenerator: Generator that yields each book title using for...of
 * createBookSummary: Use destructuring and template literals for formatted output
 * Example: "The Clean Coder by Robert C. Martin (2011) - Available at A1-23"
 */
export function* bookTitleGenerator(bookArray) {
    // Yield book titles one by one
}

export function createBookSummary(book) {
    // Destructure book properties and create formatted summary

    // Preliminary checks for broken inputs
    if (!book || typeof book !== "object") {
        return "Unknown Title by Unknown Author (Unknown Year) - Status: Unknown";
    }

    // Fetches availability info
    let availInfo = "";
    let availStatus = book.availability?.status?.toLowerCase() ?? "Unknown";

    if (availStatus === "available"){
        availInfo += " - Status: Available at " + (book.availability?.location ?? "Unknown Location");
    }
    else if (availStatus === "checked_out"){
        availInfo += " - Status: Checked Out And Due at " + (book.availability?.dueDate ?? "Unknown Time");
    }
    else{
        availInfo += " - Status: " + availStatus;
    }

    // Fetches the easier info
    let output = (book.title ?? "Unknown Title") + " by " +  (book.author ?? "Unknown Author") + " (" + (book.year ?? "Unknown Year") + ")" + availInfo;

    return output;
}