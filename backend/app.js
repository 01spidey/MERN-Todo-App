
const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose");
const {Task} = require('./models/taskModel')
const bodyParser = require('body-parser')


const app = express()
const port = 4000
const mongoURI = 'mongodb://0.0.0.0:27017/todo-db';

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// I need to create a database named "todo" in MongoDB. When connected successfully, it will create a collection named "tasks" in the database and log "Connected to MongoDB".
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err))



// Configuring Server to listen on Port 4000
app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Get All Tasks
app.get('/getTasks', async (req, res) => {
    try{
        let all_tasks = await Task.find({})
        let data = []
        let a = 1;
        all_tasks.forEach((task)=>{
            data.push({
                original_id : task._id,
                id: a++,
                task: task.task,
                checked: task.checked
            })
        })

        // console.log(data)
        res.status(200).send(
            {
                success: true,
                tasks: data
            }
        )
    }
    catch(err){
        res.status(500).json(
            {
                success: false,
                tasks: null
            }
        )
    }
    
})

// Add New Task
app.post('/addTask', 
    async (req, res) => {
        try{
            
            console.log(req.body)
            let newTask = new Task(req.body)
            
            await newTask.save().then(()=> console.log('Task Added Successfully!!'))
            .catch((err)=> console.log(err))

            res.status(200).json(
                {
                    success: true,
                    message: 'Task Added Successfully!!'
                }
            )
        }

        catch(e){
            console.log(e)
            res.status(500).json(
                {success: false, message : e}
            )
        }
})

// Edit Existing Task
app.put('/updateTask', async (req, res) => {

    let task_id = req.body.id
    let new_task = req.body.task

    try{
        await Task.findByIdAndUpdate(
            task_id,
            {task: new_task},
            {new: true}
        )
        .then(()=> {
            console.log('Task Edited Successfully!!')
            res.status(200).send(
                {
                    success: true,
                    message: 'Task Edited Successfully!!'
                }
            )
        })
        .catch((err)=> {
            console.log(err)
            res.status(500).send(
                {
                    success: false,
                    message: 'Task Edit Failed!!'
                }
            )
        })
    }
    catch(err){
        res.status(500).send(
            {
                success: false,
                message: 'Task Edit Failed!!'
            }
        )
    }
})

// Finish or Retrieve Task
app.put('/handleTask', async (req, res) => {
    try{
        let task_id = req.body.id
        let action = req.body.action
        console.log(task_id)
        
        await Task.findByIdAndUpdate(
            task_id,
            {checked : action},
            {new : true}
        ).then(
            ()=> {
                res.status(200).send(
                    {success: true, message: `Task ${action?'Finished' : 'Retrieved'} Successfully!!`}
                )
            }
        )
        .catch(
            (err)=>{
                console.log(err)
                res.status(500).send(
                    { success: false, message: 'Some Technical Error!!'}
                )
            }
        )

        
    }
    catch(err){
        res.status(500).send(
            {
                success: false,
                message: 'Some Technical Error'
            }
        )
    }
})

// Delete Task
app.delete('/deleteTask/:id', async (req, res) => {
    try{
        let task_id = req.params.id
        console.log(task_id)

        await Task.findByIdAndDelete(
            task_id,
        ).then(
            ()=>{
                res.status(200).send(
                    {success: true, message: 'Task Deleted Successfully!!'}
                )
            }
        ).catch(
            (err)=>{
                console.log(err)
                res.status(500).send(
                    {success: false, message: 'Task Deletion Failed!!'}
                )
            }
        )
    }
    catch(err){
        res.status(500).send(
            {
                success: false,
                message: 'Task Deletion Failed!!'
            }
        )
    }
})


