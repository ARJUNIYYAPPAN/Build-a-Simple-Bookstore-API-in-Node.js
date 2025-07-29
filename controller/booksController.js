const Book = require('../model/BookSchema');

// POST /books Add a new book
exports.addNewBook = async(req, res) => {

  const { title, author, price, rating, yearOfPublished } = req.body; 

  if(!title || !author || !price || !rating || !yearOfPublished) {
  return res.status(400).json({
    message: "All fields are required"
  });
 }


 if( rating < 1 || rating > 5 ){
  return res.status(400).json({
    message: "rating must be  1 to 5"
  })
 }

 try {
    const existingUid = await Book.findOne({ title }); 

    if(existingUid) {
      return res.status(400).json({
        message: "Book already exists"
      });
    }

    const newBook = new Book({
      title,
      author,
      price,
      rating,
      yearOfPublished
    });

    await newBook.save();
    res.status(201).json({
      message: "Book added!"
    });
 } catch (error) {
  res.status(400).json({
    message: "Server error on post"
  });
 }
}

// GET /books Get all books
exports.getAllBook = async(req, res) => {

  try {
    
    const books = await Book.find();
    
    if(books.length === 0){
      return res.status(404).json({
        message: "No books exists"
      }) 
    }
    res.status(200).json({
      message: "Get all book Successfully", 
      book
    });
  } catch (error) {
    res.status(400).json({
      message: "Server error"
    });
  }
}

// GET /books/:uuid Get a book by ID(using params)
exports.getBookByID = async(req, res) => {
  try {
    
    const book = await Book.findOne({ uuid: req.params.uuid }); 
   
    if(!book){
      return res.status(404).json({  
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Get by Id Successfully!",
      book
    });
  } catch (error) {
    res.status(400).json({
      message: "Server error" 
    });
  }
}

// PUT /books/:uuid Update book by ID(using params)
exports.putByID = async(req, res) => {
  
  try {
    
    const book = await Book.findOne({ uuid: req.params.uuid });
    
    if(!book){
      return res.status(404).json({  
        message: "User not found"
      });
    }
    
    await Book.updateOne(book, {
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        rating: req.body.rating,
        yearOfPublished: req.body.yearOfPublished
    })

    res.status(200).json({
      message: "Updated successfully"
    }); 
  } catch (error) {
    res.status(400).json({
      message: "Server error"
    });
  }
}

// DELETE /books/?uuid=785787 Delete book by ID(using query)

exports.deleteBookByID = async(req, res) => {

   const bookID = req.query.uuid;

   if(!bookID) {
    return res.status(400).json({
      message: "Book uuid required"
    })
   }
  try {
    const uuid = await Book.findOneAndDelete({ uuid: bookID });
    
    if(!uuid) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Server error"
    })
  }
}

// GET /above3star/?star=4   Get books based on rating (above 3 using query)
exports.getBookBasedOnRating = async(req, res) => {

  try {

    const star = parseFloat(req.query.star);

    if( isNaN(star) || star < 1 || star > 5 ){
      return res.status(400).json({
        message: "star must be 1 to 5"
      });
    }

    const books = await Book.find({rating: { $gte: star}});

    if(books.length === 0) {
      return res.status(404).json({
        message: "Books not found under your rating..."
      });
    }

    res.status(200).json({
      message: "Your rating list books",
      books
    });

  } catch (error) {
    res.status(400).json({
      message: "Server error"
    });
  }
}

// GET /activeBooks Get Active books only
exports.activeBook = async(req, res) => {
  try {
    
    const bookList = await Book.find({active: { $eq : true}}); 
    if(bookList.length === 0) {
      return res.status(404).json({
        message: "No books are actived"
      });
    }

    res.status(200).json({ 
       message: "Active Books list"  
      ,bookList 
    });
  } catch (error) {
    res.status(200).json({
      message: "Server error"
    });
  }
}

// PUT /statusChange   Update Books Status (true or false)
exports.updateBookStatus = async(req, res) => {
  try {

    const book = await Book.find();

    if(book.length === 0) {
      return res.status(404).json({
        message: "No book are exists"
      });
    } 
   const updatedBook = await Book.updateMany({}, [
    {
      $set: {
        active: { $not : "$active"}
      }
    }
   ]);
    
   const bookList = await Book.find();
    res.status(200).json({ message: "Status changed.", updatedBook, bookList}) 
  } catch (error) {
    res.status(400).json({
      message: "Server error"
    })
  }
}