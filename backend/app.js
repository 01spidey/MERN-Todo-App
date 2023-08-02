
const express = require('express')
const cors = require('cors')

const mongoose = require("mongoose");
// const {Task, } = require('./models/taskModel')
// const {TaskList} = require('./models/taskListModel')

// const Task = require('./models/models').Task
// const TaskList = require('./models/models').TaskList
const { Task, TaskList, User } = require('./models/models');

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
app.get('/getTasks/:id', async (req, res) => {
    try{
        let list_id = req.params.id;
        console.log(list_id)
        let all_tasks = await TaskList.findById(list_id)
        all_tasks = all_tasks.tasks
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
        res.status(200).send(
            {
                success: true,
                tasks: data
            }
        )
    }
    catch(err){
        console.log(err)
        res.status(500).send(
            {
                success: false,
                tasks: null
            }
        )
    }
    
})

// Add New Task
app.post('/addTask', async (req, res) => {
        try{
            console.log(req.body)
            let list_id = req.body.list_id
            let newTask = req.body.task_obj
            
            await TaskList.findByIdAndUpdate(
                list_id,
                {$push: {tasks: newTask}}
            ).then(
                ()=>{
                    res.status(200).send(
                        {
                            success: true,
                            message: 'Task Added Successfully!!'
                        }
                    )
                }
            ).catch(
                (err)=>{
                    console.log(err)
                    res.status(500).send(
                        {
                            success: false,
                            message: 'Error While Adding Task!!'
                        }
                    )
                }
            )
        }

        catch(e){
            console.log(e)
            res.status(500).send(
                {success: false, message : 'Error While Adding Task!!'}
            )
        }
})

// Edit Existing Task
app.put('/updateTask', async (req, res) => {

    let list_id = req.body.list_id
    let task_id = req.body.task_obj.id
    let new_task = req.body.task_obj.task
    

    try{
        // console.log(req.body)

        await TaskList.findById(list_id).then(
            async (result)=> {
                let tasks = result.tasks

                tasks.forEach((task)=> {
                    if(task_id===task._id.toString()) {
                        console.log(task)
                        task.task = new_task
                    }
                })
                
                // console.log(tasks)

                result.tasks = tasks

                await result.save()
                .then(
                    ()=> {
                        res.status(200).send(
                            {
                                success: true,
                                message: 'Task Edited Successfully!!'
                            }
                        )
                    }
                )
                .catch(
                    (err)=> {
                        console.log(err)
                        res.status(500).send(
                            {
                                success: false,
                                message: 'Task Edit Failed!!'
                            }
                        )
                    }
                )
            }
        )
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
        let list_id = req.body.list_id

        console.log(req.body)

        await TaskList.findById(list_id).then(
            async (result)=>{
                let tasks = result.tasks
                let a=0
                tasks.forEach((task)=>{
                    if(task_id===a++) task.checked = action
                })
                result.tasks = tasks
                await result.save().then(
                    ()=> {
                        console.log('Task Updated Successfully!!')
                        res.status(200).send(
                            {
                                success: true,
                                message: `Task ${action?'Finished' : 'Retrieved'} Successfully!!`
                            }
                        )
                    }
                ).catch(
                    (err)=> {
                        console.log(err)
                        res.status(500).send(
                            {
                                success: true,
                                message: `Error occured while ${action?'Finishing' : 'Retrieving'} Task!!`
                            }
                        )
                    }
                )
            }
        ).catch(
            (err)=>{
                console.log(err)
                res.status(500).send(
                    {
                        success: false,
                        message: 'Some Technical Error!!'
                    }
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

app.put('/reorderTasks', async (req, res) => {
    try{
        let list_id = req.body.list_id
        let tasks = req.body.tasks

        let taskList = await TaskList.findById(list_id)
        
        let newTasks = tasks.map((task)=>{
            return {
                _id: task.original_id,
                task: task.task,
                checked: task.checked
            }
        })

        taskList.tasks = newTasks
        await taskList.save().then(
            ()=> {
                res.status(200).send(
                    {
                        success: true,
                        message: 'Tasks Reordered Successfully!!'
                    }
                )
            }
        ).catch(
            (err)=> {
                console.log(err)
                res.status(500).send(
                    {
                        success: false,
                        message: 'Some Technical Error!!'
                    }
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
app.delete('/deleteTask/:list_id/:task_id', async (req, res) => {
    try{
        let list_id = req.params.list_id
        let task_id = req.params.task_id
        // console.log(list_id, task_id)

        await TaskList.findById(list_id)
        .then(
            async (result)=>{
                let tasks = result.tasks
                let newTasks = tasks.filter((task)=> task._id.toString()!==task_id)
                result.tasks = newTasks
                await result.save().then(
                    ()=>{
                        console.log('Task Deleted Successfully!!')
                        res.status(200).send(
                            {
                                success: true,
                                message: 'Task Deleted Successfully!!'
                            }
                        )
                    }
                )
                .catch(
                    (err)=>{
                        console.log(err)
                        res.status(500).send(
                            {success: false, message: 'Task Deletion Failed!!'}
                        )
                    }
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



// ---------------------------------------------------------------

// Get All Lists
app.get('/getLists', async (req, res) => {
    try{
        // let all_lists = await List.find({})
        let all_lists = [ ]
        let data = []
        let a = 1;

        all_lists = await TaskList.find({})
        
        all_lists.forEach((list)=>{
            data.push({
                original_id : list._id,
                id: a++,
                name: list.name,
            })
        })

        res.status(200).send(
            {
                success: true,
                lists: data
            }
        )
    }
    catch(err){
        console.log(err)
        res.status(500).json(
            {
                success: false,
                lists: null
            }
        )
    }
    

})

// Add New List
app.post('/addList', async(req, res)=>{
    try{
        console.log(req.body)
        TaskList.findOne({name : req.body.name}).then(
            async (result)=>{
                if(result===null){
                    
                    let newTaskList = new TaskList(req.body)
                    
                    await newTaskList.save().then(()=> console.log('List Added Successfully!!'))
                    .catch((err)=> console.log(err))

                    res.status(200).send(
                        {
                            success: true,
                            message: 'List Added Successfully!!'
                        }
                    )
                }else{
                    res.status(200).send(
                        {
                            success: false,
                            message: 'List Already Exists!!'
                        }
                    )
                }
            }
        ).catch(
            (err) => {
                console.log(err);
                res.status(500).send(
                    {
                        success: false,
                        message: 'List Addition Failed!!'
                    }
                )
            }
        )

        
    }
    catch(err){
        res.status(500).send(
            {
                success: false,
                message: 'List Addition Failed!!'
            }
        )
    }

})

// Edit Existing List
app.put('/updateList', async (req, res) => {
    try{
        // console.log(req.body)
        let list_id = req.body.list_id
        let newListName = req.body.name

        
        TaskList.findByIdAndUpdate(
            list_id,
            {name: newListName},
            {new: true}
        ).then(
            (result)=> {
                console.log(result)
                res.status(200).send(
                    {
                        success: true,
                        message: 'List Edited Successfully!!'  
                    }
                )
            }
        ).catch(
            (err)=>{
                console.log(err)
                res.status(500).send(
                    {
                        success: false,
                        message: 'List Edit Failed!!'
                    }
                )
            }
        )
    }
    catch(err){
        res.status(500).send(
            {
                success: false,
                message: 'List Edit Failed!!'
            }
        )
    }

})

// Delete List
app.delete('/deleteList/:id', async (req, res) => {
    try{
        let list_id = req.params.id
        console.log(list_id)

        await TaskList.findByIdAndDelete(
            list_id,
        ).then(
            ()=>{
                res.status(200).send(
                    {success: true, message: 'List Deleted Successfully!!'}
                )
            }
        ).catch(
            (err)=>{
                console.log(err)
                res.status(500).send(
                    {success: false, message: 'List Deletion Failed!!'}
                )
            }
        )
    }
    catch(err){
        res.status(500).send(
            {
                success: false,
                message: 'List Deletion Failed!!'
            }
        )
    }
})

