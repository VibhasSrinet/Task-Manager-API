const request=   require('supertest')
const User= require('../src/models/user')
const app= require('../src/app')
const {userOneId, userOne, setDataBase }= require('./fixtures/db')






beforeEach(setDataBase)



test('Should signup a new user', async ()=>{
    const response = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrewguru@google.in',
        password: 'VibhasP@55'
    }).expect(201)

    const user= await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user : {
        name: 'Andrew',
        email: 'andrewguru@google.in',
        },
        token : user.tokens[0].token

    })
    expect(user.password).not.toBe('VibhasP@55')
})

test('Should login an existing user', async ()=>{
    const response=await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
 
const user= await User.findById(userOneId)
expect(response.body.token).toBe(user.tokens[1].token)
})

 test('Should not login non existing user', async ()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypas'
    }).expect(400)
 })


 test('Should get profile of user', async ()=>{
     await request(app)
                 .get('/users/me')
                 .set('Authorization', `Bearer ${userOne.tokens[0].token}`)  
                 .send()
                 .expect(200)
 })

 test('Should not get profile for unauthenticated user', async ()=>{
     await request(app)
             .get('/users/me')
             .send()
             .expect(401)
 } )

 test('Should delete account for users', async ()=>{
     await request(app)
           .delete('/users/me')
           .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
           .send()
           .expect(200)

           const user= await User.findById(userOneId)
           expect(user).toBeNull()
 }) 

 test('Should not delete account unauthorized users', async ()=>{
    await request(app)
          .delete('/users/me')
          .send()
          .expect(401)
})

test('Should upload Avatar image', async ()=>{
    await request(app)
         .post('/users/me/avatar')
         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
         .attach('avatar', 'tests/fixtures/profile-pic.jpg')
         .expect(200)
   const user = await User.findById(userOneId)
   expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async ()=>{
    await request(app)
          .patch('/users/me')
          .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
          .send({
              name: 'Jess'
          })
          .expect(200)
        const user = await  User.findById(userOneId)
        expect(user.name).toEqual('Jess') 
})

test('Should not update invalid user fields', async ()=>{
    await request(app)
          .patch('/users/me')
          .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
          .send({
              location : 'New Delhi'
          })
          .expect(400)
       
})