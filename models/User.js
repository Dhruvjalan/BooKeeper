import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types
import validator from 'validator'
import bcrypt from 'bcrypt'

  const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [6, 'Password should be atleast more than 6 characters long']
    },
    TotalBooks: {
      type: Array,
      required: true
    },
    CompletedBooks: {
      type: Array,
      required: true
    }
  })

userSchema.post('save', function (doc, next) {
  console.log('New user was created')
  next()
})

userSchema.pre('save', async function (next) {
  console.log('User going to be created', this)
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect Password')
  }
  throw Error('Looks like this email is not signed up with us. Sign in Now')
}

userSchema.statics.addBook = async function (userId,collection, bookId, completion) {
  const bookObjectId = new mongoose.Types.ObjectId(String(bookId))
  const crosscheck_user = await this.findById(userId)
  let user = crosscheck_user
  if (!crosscheck_user.TotalBooks.some(id => id.equals(bookObjectId))){
  
    user = await this.findByIdAndUpdate(
    userId,
    { 
      $push: {TotalBooks: bookObjectId }
    },
    { new: true }
  )}

  if(completion===1){ 
    if(!crosscheck_user.CompletedBooks.some(id => id.equals(bookObjectId))){
        user = await this.findByIdAndUpdate(
        userId,
        { 
          $push: {CompletedBooks: bookObjectId }
        },
        { new: true }
          )    
    }
  } else if (completion<1){
    const user = await this.findByIdAndUpdate(
      userId,
      {
      $pull: {CompletedBooks:bookObjectId}
      },
      {new:true}
    )
  }


  return user
  
  
  
}

userSchema.statics.removeBook = async function(userId,bookId) {
  
const bookObjectId = new mongoose.Types.ObjectId(String(bookId))

  const user = await this.findByIdAndUpdate(userId,{
    $pull: {TotalBooks: bookObjectId, CompletedBooks:bookObjectId}
  },{new:true}
)
  return user
}

const User = mongoose.model('user', userSchema)
export default User

