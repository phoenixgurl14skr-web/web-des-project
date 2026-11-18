
const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formHeading = document.getElementById("formHeading");
const bookCount = document.getElementById("bookCount");

let editingId = null;

// GET - Display all books
async function getBooks() {
    try {
        const response = await fetch("/api/books");
        const books = await response.json();

        bookList.innerHTML = "";
        bookCount.textContent =
            `${books.length} ${books.length === 1 ? "Book" : "Books"}`;

        if (books.length === 0) {
            bookList.innerHTML =
                '<p class="empty-message">No books yet. Add your first book!</p>';
            return;
        }

        books.forEach(book => {
            const card = document.createElement("div");
            card.className = "book-card";

            const heading = document.createElement("h3");
            heading.textContent = book.title;

            const author = document.createElement("p");
            author.textContent = `Author: ${book.author}`;

            const year = document.createElement("p");
            year.textContent = `Year: ${book.year}`;

            const actions = document.createElement("div");
            actions.className = "book-actions";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.addEventListener("click", () => editBook(book));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => deleteBook(book.id));

            actions.append(editBtn, deleteBtn);
            card.append(heading, author, year, actions);
            bookList.appendChild(card);
        });

    } catch (error) {
        bookList.textContent = "Unable to load books. Please check the server.";
    }
}

// POST and PUT - Add or update a book
bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const book = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        year: Number(yearInput.value)
    };

    if (!book.title || !book.author || !book.year || book.year < 1) {
        alert("Please enter valid book details.");
        return;
    }

    const url = editingId
        ? `/api/books/${editingId}`
        : "/api/books";

    const method = editingId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);
        resetForm();
        getBooks();

    } catch (error) {
        alert(error.message || "Something went wrong.");
    }
});

// Load book details into the form for editing
function editBook(book) {
    editingId = book.id;

    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year;

    formHeading.textContent = "Update Book";
    submitBtn.textContent = "Update Book";
    cancelBtn.hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// DELETE - Remove a book
async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);
        getBooks();

    } catch (error) {
        alert(error.message || "Unable to delete book.");
    }
}

// Reset the form
function resetForm() {
    bookForm.reset();
    editingId = null;

    formHeading.textContent = "Add a New Book";
    submitBtn.textContent = "+ Add Book";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

// Display books when page opens
getBooks();
