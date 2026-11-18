
const express = require("express");
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Sample book collection
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        year: 1988
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        year: 2018
    }
];

// 1. GET - View all books
app.get("/api/books", (req, res) => {
    res.json(books);
});

// 2. GET - View one book
app.get("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
});

// 3. POST - Add a new book
app.post("/api/books", (req, res) => {
    const { title, author, year } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({
            message: "Please enter title, author and year"
        });
    }

    const newBook = {
        id: Date.now(),
        title,
        author,
        year: Number(year)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 4. PUT - Update a book
app.put("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, year } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({
            message: "Please enter all book details"
        });
    }

    book.title = title;
    book.author = author;
    book.year = Number(year);

    res.json({
        message: "Book updated successfully",
        book
    });
});

// 5. DELETE - Remove a book
app.delete("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    books = books.filter(b => b.id !== Number(req.params.id));

    res.json({ message: "Book deleted successfully" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

