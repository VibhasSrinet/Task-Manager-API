const jwt= require('jsonwebtoken')
const mongoose  = require('mongoose')
const User= require('../../src/models/user')
const Task= require('../../src/models/task')


const userOneId= new mongoose.Types.ObjectId()
const userOne={
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com', 
    password: 'What56!!',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET )
    }]
    }

    const userTwoId= new mongoose.Types.ObjectId()
const userTwo={
    _id: userTwoId,
    name: 'Andrew',
    email: 'manika@example.com', 
    password: 'Adyksh3!!',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET )
    }]
    }
     const taskOneId= new mongoose.Types.ObjectId()
     const taskTwoId= new mongoose.Types.ObjectId()
     const taskThreeId= new mongoose.Types.ObjectId()
    const taskOne={
        _id: taskOneId,
        description : 'First Task',
        completed: false,
        owner: userOneId
    }

    const taskTwo={
        _id: taskTwoId,
        description : 'Second Task',
        completed: true,
        owner: userOneId
    }

    const taskThree={
        _id: taskThreeId,
        description : 'Third Task',
        completed: false,
        owner: userTwoId
    }


    const setDataBase = async ()=>{
        await User.deleteMany()
        await Task.deleteMany()
        await new User(userOne).save()
        await new User(userTwo).save()
        await new Task(taskOne).save()
        await new Task(taskTwo).save()
        await new Task(taskThree).save()

    }
    

    module.exports = {
        userOneId,
        userOne,
        userTwoId, 
        userTwo,
        taskOne,
        taskTwo,
        taskThree, 
        setDataBase 
    }