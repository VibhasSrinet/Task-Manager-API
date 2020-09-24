const mongoose = require('mongoose')
const validator= require('validator')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')
const Task= require('./task.js')
const UserSchema = new mongoose.Schema({
    name: {
 
        type: String,
        required: true,
        trim: true,

    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
          if(value<0){
              throw new Error('Age cant be negative')
          }
        }
    },

    email:{
        type: String,
        required: true,
        trim: true,
        unique: true, 
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    } ,
    password:{
        type: String,

        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain password')
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]

})
UserSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner' 
})

UserSchema.methods.toJSON=function(){
   const user= this
   const userObject= user.toObject()
   delete userObject.password
   delete userObject.tokens

   return userObject
}

UserSchema.methods.generateAuthToken = async function(){
    const user =this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismybattle')
    user.tokens= user.tokens.concat({token})
    await user.save()
    return token
}
UserSchema.statics.findByCredentials= async (email, password)=>{
    const user =await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch=  await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return  user
}
UserSchema.pre('save', async function(next){
    const user= this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.pre('remove', async function(next){
    const user= this
    await Task.deleteMany({owner: user._id})
    next()
})
const User= mongoose.model('User', UserSchema)

module.exports= User