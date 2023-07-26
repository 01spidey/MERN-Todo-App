import React, { useState,useEffect } from 'react'
import '../styles/Content.scss'
import {FiEdit3} from "react-icons/fi";
import {FaTrash} from "react-icons/fa";
import {IoIosRefresh} from "react-icons/io";
import noDataImg from '../assets/no-data.svg'
import axios from 'axios';

const Content = () => {


    const [items, setItems] = useState([])
    const [deletePopup, setDeletePopup] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    // const [toastrMessage, setToastrMessage] = useState(null)
    const [addTaskPopup, setAddTaskPopup] = useState(false)
    const [taskPopupAction, setTaskPopupAction] = useState('add')
    const [newTask, setNewTask] = useState('')

    const [taskToBeEdited, setTaskToBeEdited] = useState(0)
    const API_URL = 'http://localhost:4000'

    useEffect(() => {
      getTasks()
    }, [])

    const getTasks = () => {
      try{
        axios.get(`${API_URL}/getTasks`).then(
            (res)=> setItems(res.data.tasks)
        )
      }
      catch(err){
          console.log(err)
      }
    }

    // Finish (or) Retrieve Task
    const handleTask = (target_task, action) => {

      axios.put(`${API_URL}/handleTask`, {id : target_task.original_id, action : action}).then(
        (res)=>{
          if(res.data.success){
            console.log(res.data); 
            getTasks()
          }else console.log(res.data.message)
        }
      )
      .catch(
        (err)=> console.log(err)
      )

    }

    // Delete Task
    const deleteTask = ()=>{
      axios.delete(`${API_URL}/deleteTask/${deletePopup}`)
      .then(
        (res)=> {
          if(res.data.success){
            console.log(res.data); 
            getTasks()
          }else console.log(res.data.message)
        }
      ).catch(
        (err)=> console.log(err)
      )

      setShowPopup(false)
      setDeletePopup(null)
      
    }

    // Create New Task
    const handleNewTask = (event)=>{
      setNewTask(event.target.value)
    }

    // Add New Task or Edit Existing Task
    const addOrUpdateTask = (action, task_id)=>{

      let task_obj = {
        task : newTask.trim(),
        checked :false
      }

      if(action==='add'){
        axios.post(`${API_URL}/addTask`, task_obj).then(
          (res)=> {console.log(res); getTasks()}
        ).catch(
          (err)=> console.log(err)
        )

      }else{
        // id = task_id
        axios.put(`${API_URL}/updateTask`, {id : task_id, task : newTask.trim()})
        .then(
          (res)=> {
            if(res.data.success){
              console.log(res); 
              getTasks()
            }else console.log(res.data.message)
            
          }
        ).catch(
          (err)=> console.log(err)
        )
      }
     
     setAddTaskPopup(false)
     setShowPopup(false)
     setNewTask('')

    }


  return ( 
    <div className="main">
      <div className="add-btn no-select" 
        onClick={()=>{
          setShowPopup(true);
          setAddTaskPopup(true);
          setTaskPopupAction('add');
        }}>
          <p>+</p>
      </div>

      {
        items.length>0?
          <div className="container">
            {
              items.map((item) => (
                <div className={`task ${item.checked?'complete-task' : 'incomplete-task'}`} key={item.id}>

                  <p className='num'>{item.id}</p>
                  <p className='task-name'
                    style={
                      {textDecoration: item.checked ? 'line-through' : 'none'}
                    }
                    onClick={!item.checked? ()=> handleTask(item, true) : null} 
                  >{item.task}</p>
                  <div className="opts-box"
                    style={
                      item.checked?{
                        color : 'black'
                      } : null
                    }
                  >
                    {item.checked? <IoIosRefresh id='restore' style={{fontSize : '1.3rem'}} onClick={()=>handleTask(item, false)}/> 
                    :<FiEdit3 id='edit' 
                      onClick={()=>{
                        setShowPopup(true);
                        setAddTaskPopup(true);
                        setTaskPopupAction('edit');
                        setNewTask(item.task);
                        setTaskToBeEdited(item.original_id)
                      }
                      }/>}

                    <FaTrash id='delete' 
                      onClick={()=>{
                        setShowPopup(true);
                        setDeletePopup(item.original_id); 
                      }}/> 
                  </div>

                </div>
              ))
            }

          </div>
        : 
        <div className="no-data">
          <img src={noDataImg} alt="Vanakkam" />
          <p>No Tasks!!</p>
        </div>
      }

      
      
      {
        showPopup?
          <div className="popup-container">
            {
              deletePopup!==null?

                <div className="popup-box">
                  <p className="dialog">Do you want to delete the task?</p>
                  <div className="btns">
                    <button style={{backgroundColor : 'red'}} onClick={deleteTask}>Delete</button>
                    <button style={{backgroundColor : '#35363a'}} 
                      onClick={()=>{
                        setShowPopup(false);
                        setDeletePopup(null);
                      }}
                    >Close</button>
                  </div>
                </div>

              :addTaskPopup?

                <div className="popup-box" id='add-task-popup'>
                  <p className="dialog">{taskPopupAction==='add'?'Add New Task' : 'Edit Task'}</p>
                  <textarea 
                    type="text"
                    placeholder='Write your Task Here...'
                    value={newTask}
                    onChange={(e)=> handleNewTask(e)}
                  ></textarea>
                  <div className="btns">
                    <button style={{backgroundColor:'#396c94'}} onClick={()=>addOrUpdateTask(taskPopupAction,taskToBeEdited)}>{taskPopupAction==='add'?'Add' : 'Save'}</button>
                    <button style={{backgroundColor:'#35363a'}} onClick={()=>{
                      setAddTaskPopup(false);
                      setShowPopup(false);
                      setNewTask('');
                      setTaskPopupAction('add')
                    }}>Close</button>
                  </div>
                </div>
              
              :null
            }
          </div> 
          
          : null
      }

    </div>
  )

}

export default Content