/**
 * Library management module demonstrating modern JavaScript features
 */

import { books, categoryDescriptions, uniqueAuthors, filterBooksByStatus, groupBooksByGenre } from './data.js';

/**
 * LibraryManager class demonstrating modern JavaScript class features
 */
export class LibraryManager {
    #statistics = {}; // Private field for storing statistics
    #searchCache = new Map(); // Private cache for memoized searches

    constructor(initialBooks = []) {
        this.books = [...initialBooks]; // Shallow copy using spread
        this.#updateStatistics();
    }

    /**
     * TODO: Implement addBooks method using rest parameters and search functionality
     * addBooks(...newBooks): Add multiple books using spread operator, update statistics
     * searchBooks({title, author, genre} = {}, caseSensitive = false): Search with destructuring and optional chaining
     */
    addBooks(...newBooks) {
        // Add books using spread operator and update statistics
        this.books.push(...newBooks);
        this.#searchCache.clear(); // Clear search cache after adding 
        this.#updateStatistics();
        return this.books.length;
    }

    searchBooks({ title, author, genre } = {}, caseSensitive = false) {
        // Implement search logic with destructuring and optional chaining

        // Create a cache key based on search parameters
        const cacheKey = JSON.stringify({ title, author, genre, caseSensitive });

        // Check if it is already present in cache, return if present
        if (this.#searchCache.has(cacheKey)) {
            return this.#searchCache.get(cacheKey);
        }

        // Debug Codes
        // console.log("Is this the issue?")

        // Filter Books
        const results = this.books.filter(book => {
            // Title search with optional chaining
            if (title) {
                const bookTitle = book.title || '';
                const searchTitle = caseSensitive ? title : title.toLowerCase();
                const compareTitle = caseSensitive ? bookTitle : bookTitle.toLowerCase();
                
                if (!compareTitle.includes(searchTitle)) return false;
            }

            // Author search with optional chaining
            if (author) {
                const bookAuthor = book.author || '';
                const searchAuthor = caseSensitive ? author : author.toLowerCase();
                const compareAuthor = caseSensitive ? bookAuthor : bookAuthor.toLowerCase();
                
                if (!compareAuthor.includes(searchAuthor)) return false;
            }

            // Genre search with optional chaining
            if (genre) {
                const bookGenre = book.genre || '';
                const searchGenre = caseSensitive ? genre : genre.toLowerCase();
                const compareGenre = caseSensitive ? bookGenre : bookGenre.toLowerCase();
                
                if (!compareGenre.includes(searchGenre)) return false;
            }

            return true;
        });

        // Cache the results
        this.#searchCache.set(cacheKey, results);
        return results;
    }

    /**
     * TODO: Implement getStatistics and updateBook methods
     * getStatistics(): Return computed statistics object with total, available, checked out counts
     * updateBook(book, updates): Use logical assignment operators (??=, ||=, &&=)
     */
    getStatistics() {
        // Return statistics with computed property names
        const genreStats = {};
        
        // Calculate genre-specific statistics
        // May refactor later if genre specification is not needed
        this.books.forEach(book => {
            const genre = book.genre || 'Unknown';
            genreStats[genre] = (genreStats[genre] || 0) + 1;
        });

        const stats = {
            ...this.#statistics,
            byGenre: genreStats,
            uniqueAuthors: new Set(this.books.map(book => book.author)).size,
            // Using computed property names
            [`percentageAvailable`]: this.#statistics.total > 0 
                ? Math.round((this.#statistics.available / this.#statistics.total) * 100) 
                : 0
        };

        // Add computed property for each genre percentage
        Object.keys(genreStats).forEach(genre => {
            stats[`${genre}Percentage`] = Math.round((genreStats[genre] / this.#statistics.total) * 100);
        });

        return stats;
    }

    updateBook(book, updates) {
        // Find the book in the array
        const bookIndex = this.books.findIndex(b => 
            b === book || 
            b.id === book?.id || 
            (b.title === book?.title && b.author === book?.author)
        );
        
        if (bookIndex === -1) return false;

        // Use logical assignment operators to update book properties
        
        // Only assigns if current title and genre is null or undefined
        this.books[bookIndex].title ??= updates.title;
        this.books[bookIndex].genre ??= updates.genre;
        
        // Only assigns if current author is falsy (empty string, 0, false, null, undefined)
        this.books[bookIndex].author ||= updates.author;
        
        // Update publication year only if it exists in updates and is truthy
        this.books[bookIndex].publicationYear &&= updates.publicationYear;

        // Handle availability object with logical operators and optional chaining
        this.books[bookIndex].availability = this.books[bookIndex].availability || {};
        
        // Update optional dueDate only if not already set
        this.books[bookIndex].availability.dueDate ??= updates.availability?.dueDate;
        
        // Update status and set default if the original is falsy
        this.books[bookIndex].availability.status ||= updates.availability?.status || 'available';

        // Clear cache after updating book
        this.#searchCache.clear();
        this.#updateStatistics();
        
        return true;
    }

    /**
     * TODO: Implement higher-order functions and memoization
     * createBookFormatter(formatter): Return function that applies formatter to book arrays
     * memoize(fn): Use Map to cache function results
     */
    #updateStatistics() {
        // Calculate statistics and store in private field
        this.#statistics = {
            total: this.books.length,
            available: this.books.filter(book => book.availability?.status === 'available').length,
            checkedOut: this.books.filter(book => book.availability?.status === 'checked_out').length
        };
    }
}

export const createBookFormatter = (formatter) => {
    // Return function that applies formatter to book arrays

    // handles when the formatter is not a function
    if (typeof formatter !== 'function') {
        // Debug Code
        console.log("Provided Formatter Is Not A Function")
        // Default formatter if none provided
        formatter = (book) => `${book.title} by ${book.author} (${book.genre})`;
    }

    return (bookArray) => {
        // Validate input and throw error when invalid
        if (!Array.isArray(bookArray)) {
            throw new Error('Expected an array of books');
        }

        // Apply formatter to each book
        return bookArray.map(book => {
            // Use optional chaining for safe property access
            const formatted = formatter(book);
            
            // Return default formatted string if formatter returns falsy
            return formatted || `${book.title || 'Unknown Title'} by ${book.author || 'Unknown Author'}`;
        });
    };
};

export const memoize = (fn) => {
    // Use Map to cache function results
    const cache = new Map();
    
    return function(...args) {
        // Create a cache key from the function name and stringified arguments
        const functionName = fn.name || 'anonymous';
        const argsKey = JSON.stringify(args);
        const cacheKey = `${functionName}:${argsKey}`;
        
        // Check cache first, return cache key if present
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        
        // Compute result with error handling
        let result;
        try {
            result = fn(...args);
        } catch (error) {
            // Don't cache errors
            throw error;
        }
        
        // Cache the result
        cache.set(cacheKey, result);
        
        return result;
    };
};

// Export default library instance
export default new LibraryManager(books);