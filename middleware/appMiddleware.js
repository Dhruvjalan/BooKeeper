import User from '../models/User.js'
import Book from '../models/Book.js'



export async function get_this_book(req,res,next){
    const bookId = req.params.bookId 

    try{
    const book = await Book.findById(bookId);
      if(book){
        res.locals.book = book
      }
      else{
        res.locals.book = null 
        res.redirect('/BookNotFound')   
    }
    next()
  }
  catch(err){
    console.log(err)
    res.redirect('/BookNotFound')   

  }
}
