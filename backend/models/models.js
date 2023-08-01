const mongoose =  require('mongoose');

const taskSchema = new mongoose.Schema({   
    task: { type: String, required: true },
    checked: { type: Boolean, required: true , default: false}
})

const taskListSchema = new mongoose.Schema({   
    
    name : { type: String, required: true },
    tasks : [taskSchema]
})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

const TaskList = mongoose.model('TaskList', taskListSchema)
const Task = mongoose.model('Task', taskSchema)
const User = mongoose.model('User', userSchema)

module.exports = {Task}
module.exports = {TaskList}
module.exports = {User}