const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.routes');
mongoose.connect('mongodb://localhost:27017/football').then(() => {
    console.log("db connected...")
})
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', userRouter);
app.listen(3500, () => {
    console.log('App is running ')
})