import User from '../models/User.js'
import Book from '../models/Book.js'
// Book details object should have:
// UserId, title ; author ; genre ; pagesRead; totalPages;completionStatus; rating ; remarks ;


export async function add_book_post(req,res){
    const {userId, title,author,genre,pagesRead,totalPages,completionStatus,rating,remarks} = req.body
    try {
        const book = await Book.create({userId, title,author,genre,pagesRead,totalPages,completionStatus,rating,remarks})
        
        const user = await User.addBook(userId,book._id,completionStatus/100)
        console.log("Printing user on appcontroller line 13, addbook",user)

        return res.status(201).json({ bookid: book._id })
    } catch (err) {
        console.log("error: ",err)
        res.status(400).json(err)
    }
}

export async function delete_book(req,res){
    const {userId, bookId} = req.params
    console.log("Deleting",bookId, "from user ",userId, "bookId is a ",typeof(bookId))
    
    try{
        const book = await Book.findByIdAndDelete(bookId)
        const user = await User.removeBook(userId, bookId)
        console.log("Printing user on appcontroller line 27, deletebook",user)
        if(!book){
            return res.status(404).json({"error":"Book Not Found"})
        }
        else
{         return res.status(201).json({"message": `Deleted ${book._id}`})
}
    }
    catch(err){
        console.log(err)
        return res.status(500).json({"error":err.message})
    }
}

export async function update_book(req, res) {
  const { bookId } = req.params
  const { userId, title, author, genre, pagesRead, totalPages, completionStatus, rating, remarks } = req.body


  
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        userId,
        title,
        author,
        genre,
        pagesRead,
        totalPages,
        completionStatus,
        rating,
        remarks
      },
      { new: true } // return the updated document
    )
    const user = await User.addBook(userId,bookId,completionStatus/100)


    console.log("Printing user on appcontroller line 68, editbook",user)

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' })
    }

    res.status(200).json({ message: 'Book updated', book: updatedBook })
  } catch (err) {
    console.error("Error updating book:", err)
    res.status(500).json({ error: err.message })
  }
}