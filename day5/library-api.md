# Library Books API

This API manages books in a library.

## 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Success status:** `200 OK`

## 2. Get one book

- **Method:** GET
- **Path:** `/books/:id`
- **Description:** Returns one book using its ID.
- **Success status:** `200 OK`

## 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book.
- **Example request body:**
  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```
- **Success status:** `201 Created`

## 4. Update a book

- **Method:** PUT
- **Path:** `/books/:id`
- **Description:** Updates an existing book using its ID.
- **Example request body:**
  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```
- **Success status:** `200 OK`

## 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/:id`
- **Description:** Deletes a book using its ID.
- **Success status:** `204 No Content`

## 6. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author.
- **Success status:** `200 OK`

## Error Codes

### 400 Bad Request

This happens when the request contains invalid or missing data.

Example:

- Sending a POST request to `/books` without a book title or author.

### 404 Not Found

This happens when the requested book does not exist.

Example:

- Sending `GET /books/999` when book ID 999 does not exist.