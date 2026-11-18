
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("my-notes")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("my-notes", JSON.stringify(notes));
  }, [notes]);

  function saveNote(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both a title and a note.");
      return;
    }

    if (editingId !== null) {
      setNotes((previous) =>
        previous.map((note) =>
          note.id === editingId
            ? { ...note, title: title.trim(), content: content.trim() }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toLocaleDateString(),
      };

      setNotes((previous) => [newNote, ...previous]);
    }

    resetForm();
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((previous) => previous.filter((note) => note.id !== id));

      if (editingId === id) {
        resetForm();
      }
    }
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#home">🌸 NoteBloom</a>
        <span className="topbar-label">Your little space for big ideas</span>
      </header>

      <main className="main" id="home">
        <section className="welcome">
          <p className="eyebrow">YOUR PERSONAL NOTEBOOK</p>
          <h1>Thoughts worth <span>keeping.</span></h1>
          <p className="welcome-text">
            Capture your ideas, plan your day, and keep everything in one place.
          </p>
        </section>

        <section className="editor">
          <div className="editor-heading">
            <div>
              <p className="eyebrow">{editingId !== null ? "EDIT NOTE" : "CREATE SOMETHING"}</p>
              <h2>{editingId !== null ? "Update your note" : "Write a new note"}</h2>
            </div>
            <span className="editor-icon">✍️</span>
          </div>

          <form onSubmit={saveNote}>
            <label htmlFor="note-title">Note title</label>
            <input
              id="note-title"
              type="text"
              placeholder="e.g. Ideas for my next project"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              required
            />

            <label htmlFor="note-content">Your note</label>
            <textarea
              id="note-content"
              placeholder="Write down whatever is on your mind..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              required
            />

            <div className="form-actions">
              <button className="primary-btn" type="submit">
                {editingId !== null ? "✓ Update Note" : "+ Save Note"}
              </button>

              {editingId !== null && (
                <button className="secondary-btn" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="notes-section">
          <div className="notes-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>My Notes <span className="count">{notes.length}</span></h2>
            </div>

            <input
              className="search"
              type="search"
              placeholder="Search notes..."
              aria-label="Search notes"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{search ? "🔎" : "📔"}</div>
              <h3>{search ? "No matching notes" : "Your page is waiting!"}</h3>
              <p>
                {search
                  ? "Try another search term."
                  : "Create your first note using the form above."}
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note, index) => (
                <article className={`note-card card-${index % 4}`} key={note.id}>
                  <div className="note-card-top">
                    <span className="note-symbol">✿</span>
                    <span className="note-date">{note.date}</span>
                  </div>

                  <h3>{note.title}</h3>
                  <p className="note-content">{note.content}</p>

                  <div className="note-actions">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editNote(note)}
                      aria-label={`Edit ${note.title}`}
                    >
                      ✎ Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteNote(note.id)}
                      aria-label={`Delete ${note.title}`}
                    >
                      ♲ Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        Made with ♡ using React.js
      </footer>
    </div>
  );
}

export default App;
