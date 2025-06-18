import User from '../models/User.js'
import Book from '../models/Book.js'
// Book details object should have:
// UserId, title ; author ; genre ; pagesRead; totalPages;completionStatus; rating ; remarks ;
export async function add_book_post(req,res){
    const {userId, title,author,genre,pagesRead,totalPages,completionStatus,rating,remarks} = req.body
    try {
        const book = await Book.create({userId, title,author,genre,pagesRead,totalPages,completionStatus,rating,remarks})
        res.
        res.status(201).json({ bookid: book._id })
    } catch (err) {
        // const errors = handleErrors(err)
        res.status(400).json(err)
    }
}