import axios from 'axios';
const API_URL = 'http://localhost:4000'


function getTasksService(){
    try{
        // return fetch(`${API_URL}/getTasks`).then(
        //     res=>res.json()
        // )
        axios.get(`${API_URL}/getTasks`).then(
            (res)=> {
                console.log(res.data)
                return res.data
            }
        )
    }
    catch(err){
        console.log(err)
    }
    
}

function addTaskService(task_obj){
    let req_body = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task_obj)
    }

    try{
        return fetch(`${API_URL}/addTask`, req_body).then(
            res=> res.json()
        )
    }
    catch(err){
        console.log(err)
    }
}

export {getTasksService, addTaskService}