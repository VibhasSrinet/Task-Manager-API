const express= require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task= require('./models/task')
const userRouter= require('./router/user')

const taskRouter= require('./router/task')

const app= express()
const port= process.env.Port || 3000


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


 

app.listen(port, ()=>{
    console.log('server is up on port'+ port)
}) 

const main= async ()=>{
    const user =  await User.findById('5f6a2b8645ccfa19c00069ae')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

//main()