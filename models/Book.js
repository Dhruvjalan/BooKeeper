import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type:String,
    required:true,
  },
  genre: {
    type: String,
    required: true
  },
  collection: {
    type: String,
    required: true
  },
  completionStatus: {
    type: String,
    required: true,
    default: 'Uncategorized'
  },
  pagesRead: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  remarks: {
    type: String
  }
})

bookSchema.statics.getUserBooks = async function(userId){
    const bookList = this.find({userId})
    if(bookList){
        return bookList
    }
    throw Error ('You have no books added yet.')
}

bookSchema.statics.isBookThere = async function({ userId, title, author }) {
    const book = await this.findOne({ userId, title, author })
    return !!book
}

const Book = mongoose.model('Book', bookSchema)
export default Book
