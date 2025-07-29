const express = require('express');
const router = express.Router();
const booksController = require('../controller/booksController');

router.post('/books', booksController.addNewBook);
router.get('/books', booksController.getAllBook);
router.get('/books/:uuid', booksController.getBookByID);
router.put('/books/:uuid', booksController.putByID);
router.delete('/books', booksController.deleteBookByID);
router.get('/above3star/', booksController.getBookBasedOnRating);
router.get('/activeBooks', booksController.activeBook);
router.put('/statusChange', booksController.updateBookStatus);
 
module.exports = router;
