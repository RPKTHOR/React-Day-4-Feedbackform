import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// A simple mapping object for common language codes
const languageMap = {
  'en': 'English',
  'fr': 'French',
  'es': 'Spanish',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'la': 'Latin',
  'fi': 'Finnish',
  // Add more mappings as needed
};

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("none"); 

  useEffect(() => {
    // This effect runs only once to get the full list of languages for the filter dropdown.
    // We can fetch a broad sample to get most languages.
    fetch('https://gutendex.com/books/')
      .then(res => res.json())
      .then(data => {
        const allBooks = data.results;
        const uniqueLanguages = [...new Set(allBooks.flatMap(book => book.languages))];
        setLanguages(uniqueLanguages);
      })
      .catch(error => console.error("Error fetching language data:", error));
  }, []);

  useEffect(() => {
    let url = 'https://gutendex.com/books/?';
    const params = new URLSearchParams();

    if (search.trim() !== '') {
      params.append('search', search.trim());
    }
    
    if (language !== 'all') {
      params.append('languages', language);
    }

    if (sort === 'popularity') {
      params.append('sort', 'popular'); // The API uses 'popular' for this sort
    }

    url += params.toString();

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBooks(data.results);
      })
      .catch(error => console.error("Error fetching filtered books:", error));
  }, [search, language, sort]);

  return (
    <div className='container my-4'>
      <h1 className='text-center mb-4'>Public Domain Book Explorer</h1>

      {/* Filters */}
      <div className='row mb-4'>
        <div className='col-md-4'>
          <input
            type='text'
            className='form-control'
            placeholder='Search by title or author...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='col-md-4'>
          <select
            className='form-select'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            {languages.map((langCode) => (
              <option key={langCode} value={langCode}>
                {languageMap[langCode] || langCode.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className='col-md-4'>
          <select
            className='form-select'
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="none">Sort By...</option>
            <option value="popularity">Popularity (Downloads)</option>
          </select>
        </div>
      </div>

      {/* Book cards */}
      <div className='row'>
        {books.map((book) => (
          <div key={book.id} className='col-md-4' mb-4>
            <div className='card h-100 shadow-sm'>
              {/* Fallback to a placeholder image if none is available */}
              <img
                src={book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}
                className='card-img-top p-3'
                alt={book.title}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className='card-body d-flex flex-column'>
                <h5 className='card-title'>{book.title}</h5>
                <p className='text-muted'>
                  {book.authors.map(author => author.name).join(', ')}
                </p>
                <div className='mt-auto'>
                  <p className='fw-bold'>
                    Downloads: <span className='text-primary'>{book.download_count}</span>
                  </p>
                  <a
                    href={book.formats['text/html'] || book.formats['text/plain'] || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='btn btn-success w-100'
                  >
                    Read Book
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {books.length === 0 && (
          <p className='text-center text-muted'>No books found</p>
        )}
      </div>
    </div>
  );
};

export default BookList;