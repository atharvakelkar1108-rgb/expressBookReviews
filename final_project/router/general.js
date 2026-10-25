const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (isValid(username)) {

            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        }

        return res.status(404).json({
            message: "User already exists!"
        });
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    let filteredBooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
            filteredBooks[key] = books[key];
        }
    });

    return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    let filteredBooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            filteredBooks[key] = books[key];
        }
    });

    return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

public_users.get('/async/books', async (req, res) => {
    const getBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    });

    getBooks
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(404).json({ message: err }));
});

public_users.get('/async/isbn/:isbn', async (req, res) => {

    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];

        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

public_users.get('/async/author/:author', async (req, res) => {

    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {

        const filteredBooks = Object.keys(books)
            .filter(key => books[key].author === author)
            .reduce((obj, key) => {
                obj[key] = books[key];
                return obj;
            }, {});

        if (Object.keys(filteredBooks).length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found");
        }
    });

    getBooksByAuthor
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(404).json({ message: err }));
});


public_users.get('/async/title/:title', async (req, res) => {

    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {

        const filteredBooks = Object.keys(books)
            .filter(key => books[key].title === title)
            .reduce((obj, key) => {
                obj[key] = books[key];
                return obj;
            }, {});

        if (Object.keys(filteredBooks).length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found");
        }
    });

    getBooksByTitle
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
