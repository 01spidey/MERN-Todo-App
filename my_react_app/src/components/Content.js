import React, { useState,useEffect } from 'react'
import '../styles/Content.scss'
import {FiEdit3} from "react-icons/fi";
import {FaTrash} from "react-icons/fa";
import {IoIosRefresh} from "react-icons/io";
import noDataImg from '../assets/no-data.svg'
import axios from 'axios';
import { IoMdListBox } from 'react-icons/io';
import {IoLogOut} from 'react-icons/io5'
import { HiMenu } from 'react-icons/hi';
import {Puff} from  'react-loader-spinner'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Content = () => {

    const [items, setItems] = useState([])
    const [listItems, setListItems] = useState([])
    const [deletePopup, setDeletePopup] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    
    const [addTaskPopup, setAddTaskPopup] = useState(false)
    const [taskPopupAction, setTaskPopupAction] = useState('add')
    const [newTask, setNewTask] = useState('')
    const [taskToBeEdited, setTaskToBeEdited] = useState(0)

    const [addListPopup, setAddListPopup] = useState(false)
    const [listPopupAction, setListPopupAction] = useState('add')
    const [newList, setNewList] = useState('')
    const [listToBeEdited, setListToBeEdited] = useState(0)

    const [curListItem, setCurListItem] = useState(null)
    const [showSideBar, setShowSideBar] = useState(true)
    const [loader, setLoader] = useState(false)

    
    // const API_URL = 'http://localhost:4000'
    const API_URL = 'https://taskify-api-fqvf.onrender.com'

    const [username, setUsername] = useState(sessionStorage.getItem('username'))
    const navigate = useNavigate()

    useEffect(() => {      

      if(username){
        if(username==='null' || null){
          navigate('/')
        }else{
          setUsername(username)
          getLists(1)
        }
      }else{
        navigate('/')
      }
    }, [])

    const toastify = (status, message) => {
    
      let toast_class = {
        className : `toast`,
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        closeOnClick: true,
        theme: 'dark',
      }
  
      if (status === 'success') {
        toast.success(message, toast_class);
      }
      else if(status === 'warning'){
        toast.warn(message, toast_class);
      }
      else{
        toast.error(message, toast_class);
      }
      
    };

    const getLists = (lst_id) => {
      try{
        setLoader(true)
        axios.get(`${API_URL}/getLists/${username}`).then(
            (res)=> {
              setLoader(false)
              let cur_lst = res.data.lists
              setListItems(cur_lst)
              let index = Math.max(0, lst_id-1)
              getTasksofList(res.data.lists[index])
              
            }
        ).catch(
          err=>{
            setLoader(false)
            console.log(err)
          }
        )
      }
      catch(err){
          console.log(err)
      }
    }

    const handleTask = (target_task, action) => {
      setLoader(true)
      axios.put(`${API_URL}/handleTask`, {id :(target_task.id-1), list_id : curListItem.original_id, action : action}).then(
        (res)=>{
          setLoader(false)
          if(res.data.success){
            // console.log(res.data); 
            getTasksofList(curListItem)
          }else toastify('error', res.data.message)
        }
      )
      .catch(
        (err)=> {
          setLoader(false)
          console.log(err)}
      )

    }

    // Delete Task - Toasted
    const deleteTask = ()=>{
      setLoader(true)
      axios.delete(`${API_URL}/deleteTask/${curListItem.original_id}/${deletePopup.item.original_id}`)
      .then(
        (res)=> {
          setLoader(false)
          if(res.data.success){
            toastify('error', res.data.message)
            getTasksofList(curListItem)
          }else{
            toastify('error', res.data.message)
          }
        }
      ).catch(
        (err)=>{
          setLoader(false)
          toastify('error', 'Server Not Responding')
          console.log(err)
        }
      )

      setShowPopup(false)      
    }

    // Delete List - Toasted
    const deleteList = ()=>{
      setLoader(true)
      axios.delete(`${API_URL}/deleteList/${deletePopup.item.original_id}`)
      .then(
        (res)=> {
          setLoader(false)
          if(res.data.success){
            toastify('error', res.data.message)
            getLists(deletePopup.item.id-1)
          }else{
            toastify('error', res.data.message)
          }
        }
      ).catch(
        (err)=>{
          setLoader(false)
          toastify('error', 'Server Not Responding')
          console.log(err)
        }
      )

      setShowPopup(false)
      // setDeletePopup(null)
    }

    // Create New Task
    const handleNewTask = (event)=>{
      setNewTask(event.target.value)
    }

    const handleNewList = (event)=>{
      setNewList(event.target.value)
    }

    // Add New Task or Edit Existing Task - Toasted
    const addOrUpdateTask = (action, task_id)=>{

      let postData = {
        list_id : curListItem.original_id,
        task_obj : {
          task : newTask.trim(),
          checked :false
        }
      }

      let putData = {
        list_id : curListItem.original_id,
        task_obj : {
          id : task_id,
          task : newTask.trim()
        }
      }

      if(action==='add'){
        setLoader(true)
        axios.post(`${API_URL}/addTask`, postData).then(
          (res)=> {setLoader(false); toastify('success', res.data.message) ; getTasksofList(curListItem)}
        ).catch(
          (err)=>{
            setLoader(false)
            toastify('error', 'Server Not Responding!!')
            console.log(err)
          }
        )

      }else{
        setLoader(true)
        axios.put(`${API_URL}/updateTask`, putData)
        .then(
          (res)=> {
            setLoader(false)
            if(res.data.success){
              toastify('success', res.data.message)
              getTasksofList(curListItem)
            }else{
              toastify('error', res.data.message)
            }
            
          }
        ).catch(
          (err)=>{
            setLoader(false) 
            toastify('error', 'Server Not Responding!!')
            console.log(err)
          }
        )
      }
     
     setAddTaskPopup(false)
     setShowPopup(false)
    }

    // Add New List or Edit Existing List - Toasted
    const addOrUpdateList = (action, list_id)=>{

      let list_obj = {
        username : username,
        name : newList.trim(),
        tasks : []
      }

      if(action==='add'){
        setLoader(true)
        axios.post(`${API_URL}/addList`, list_obj).then(
          (res)=> {
            setLoader(false)
            if(res.data.success){
              setAddListPopup(false)
              setShowPopup(false)
              getLists(listItems.length+1)
              toastify('success', res.data.message)
            }else{
              toastify('warning', res.data.message)
            }
            
          }
        ).catch(
          (err)=>{
            setLoader(false)
            toastify('error', 'Server Not Responding!!')
            console.log(err)
          }
        )
      }
      
      else{
        setLoader(true)
        axios.put(`${API_URL}/updateList`, {list_id : list_id, name : newList.trim()})
        .then(
          (res)=> {
            setLoader(false)
            if(res.data.success){
              getLists(curListItem.id)
              setAddListPopup(false)
              setShowPopup(false)
              toastify('success', res.data.message)
            }else{ 
              toastify('error', res.data.message)
            }
            
          }
        ).catch(
          (err)=> {
            setLoader(false)
            toastify('error', 'Server Not Responding!!')
            console.log(err)
          }
        )
      }
    }
  
    const getTasksofList = (listItem)=>{
      setCurListItem(listItem)
      setLoader(true)
      axios.get(`${API_URL}/getTasks/${listItem.original_id}`).then(
        (res)=>{ 
          setLoader(false)
          setItems(res.data.tasks);
        }
      ).catch(
        err=>{
          setLoader(false)
          console.log(err)
          toastify('error', 'Server Not Responding!!')
        }
      )
    }

    const handleDragEnd = (result)=>{
      console.log(result)

      if(!result.destination) return;
      const [source_ind, dest_ind] = [result.source.index, result.destination.index];
      const itemsCopy = [...items];

      let temp = itemsCopy[source_ind];
      itemsCopy[source_ind] = itemsCopy[dest_ind];
      itemsCopy[dest_ind] = temp;
      let a = 1;
      itemsCopy.forEach(
        (item)=> item.id = a++
      )
      // setItems(itemsCopy)

      setLoader(true)
      axios.put(`${API_URL}/reorderTasks`, {list_id : curListItem.original_id, tasks : itemsCopy})
      .then(
        (res)=> {
          setLoader(false)
          if(res.data.success){
            console.log(res); 
            getTasksofList(curListItem)
          }else console.log(res.data.message)
        }
      ).catch(
        (err)=>{
          setLoader(false)
          toastify('error', 'Server Not Responding!!')
          console.log(err)
        }
      )

    }

    const logout = ()=>{
      sessionStorage.removeItem('username')
      navigate('/')
    }

  return ( 

    <div className="main-box">
      
      <ToastContainer />

      <div className="left-box" style={
        showSideBar?{
          width: '25%'
        } : { width: '0%', padding : '0px' }
      }>

        <div className="top-box">
          <div className="temp">
            <h1 className="title">Lists</h1>
              <HiMenu id='ham-icon' onClick={()=>{setShowSideBar(!showSideBar)}} />
          </div>

          <div className="add-list no-select" onClick={
            ()=>{
              setNewList('')
              setDeletePopup(null);
              setShowPopup(true);
              setAddListPopup(true);
              setListPopupAction('add');}
          }>
            <p style={{fontSize : '1.2rem'}}>+</p>
            <p>New List</p>
          </div> 
        
        </div>
        

        <div className="list-box">
          {            
            listItems.map((listItem)=>(
              
              <div className={`list-item ${curListItem.original_id===listItem.original_id?'active-list-item' : 'inactive-list-item'}`} 
              key={listItem.id} onClick={()=>getTasksofList(listItem)} draggable>
               
                <div style={{display : 'flex', alignItems : 'center', gap : '5px', flex:1}}>
                  <IoMdListBox id='list-icon' />
                  <p className="list-name">{listItem.name}</p>
                </div>
                
                <div className="opts-box" style={
                  curListItem===listItem?{
                    opacity : 1,
                    pointerEvents : 'all'
                  } :{
                    opacity : 0,
                    pointerEvents : 'none'
                  }               
                }>
                  <FiEdit3 id='edit'  
                  onClick={()=>{
                    setShowPopup(true);
                    setAddListPopup(true);
                    setListPopupAction('edit');
                    setNewList(listItem.name);
                    setListToBeEdited(listItem.original_id)
                  }}/>
                  <FaTrash id='delete' 
                    onClick={()=>{
                      setShowPopup(true);
                      setDeletePopup({
                        item : listItem, 
                        type : 'list'
                      }
                      ); 
                    }}/>
                </div>
              </div>
            ))
          }

        </div>

        <div className="list-box"
          style={
            {
              position : 'absolute',
              bottom : '10px',
              left : '10px',
              right : '10px'
            }
          }
        >
          <div className="list-item last-item" onClick={logout}>
              <div style={{display : 'flex', alignItems : 'center', gap : '5px', flex:1}}>
              <IoLogOut id='list-icon' />
              <p className="list-name">Logout</p>
            </div>
          </div>
        </div>

      </div>

      {
        !showSideBar?
          <div className="closed-left-box">
          <HiMenu id='ham-icon' onClick={()=>{setShowSideBar(!showSideBar)}} />
          </div>:null
      }
      

      <div className="right-box">
        
        {
          curListItem?
            <div>
              <div className="add-btn no-select" 
                onClick={()=>{
                  setNewTask('')
                  setDeletePopup(null)
                  setShowPopup(true);
                  setAddTaskPopup(true);
                  setTaskPopupAction('add');
                }}>
                  <p>+</p>
            
              </div>
              <div className="title" style={{
                display : 'flex', alignItems : 'center', gap : '5px'
              }}>
                <IoMdListBox color='#7c5cfc'/>
                <p>{curListItem.name}</p>
              </div>
            </div>
            
          :null
        }

        {
          loader?
            <div className="loader">
              <Puff  width='200' color="#7c5cfc"/>
            </div>:null
        }
        
        
      {
        items.length>0?
          <DragDropContext onDragEnd={(result)=> handleDragEnd(result)}>
            <Droppable droppableId="tasks" direction='vertical'>
              {
                (provided)=>(
                  <div className="container" {...provided.droppableProps} ref={provided.innerRef}>
                    { items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>

                          {
                            (provided)=>(
                              <div 
                                className={`task ${item.checked?'complete-task' : 'incomplete-task'}`} 
                                {...provided.draggableProps} 
                                {...provided.dragHandleProps} 
                                ref={provided.innerRef}
                              >
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
                                      setDeletePopup({
                                        item : item, 
                                        type : 'task'
                                      })
                                    }}/> 
                                </div>

                              </div>
                            )
                          }
                        </Draggable>
                      ))}
                      {provided.placeholder}
                  </div>
                )
              }
              
            </Droppable>
          </DragDropContext>
          
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
                  <p className="dialog">Do you want to delete this {deletePopup.type}?</p>
                  <div className="btns">
                    <button style={{backgroundColor : 'red'}} onClick={deletePopup.type==='list'?deleteList : deleteTask}>Delete</button>
                    <button style={{backgroundColor : '#35363a'}} 
                      onClick={()=>{
                        setShowPopup(false);
                        setDeletePopup(null);
                      }}
                    >Close</button>
                  </div>
                </div>

              :addTaskPopup?

                <div className="popup-box" id='add-popup'>
                  <p className="dialog">{taskPopupAction==='add'?'Add New Task' : 'Edit Task'}</p>
                  <textarea 
                    type="text"
                    placeholder='Write your Task Here...'
                    value={newTask}
                    onChange={(e)=> handleNewTask(e)}
                  ></textarea>
                  <div className="btns">
                    <button style={{backgroundColor:'#7c5cfc'}} onClick={()=>addOrUpdateTask(taskPopupAction,taskToBeEdited)}>{taskPopupAction==='add'?'Add' : 'Save'}</button>
                    <button style={{backgroundColor:'#35363a'}} onClick={()=>{
                      setAddTaskPopup(false);
                      setShowPopup(false);
                      setTaskPopupAction('add')
                    }}>Close</button>
                  </div>
                </div>
              
              :addListPopup?

                <div className="popup-box" id='add-popup'>
                  <p className="dialog">{listPopupAction==='add'?'Create List' : 'Edit List'}</p>
                  <input 
                    type="text"
                    placeholder='List Name...'
                    value={newList}
                    onChange={(e)=> handleNewList(e)}
                  ></input>
                  <div className="btns">
                    <button style={{backgroundColor:'#7c5cfc'}} onClick={()=>addOrUpdateList(listPopupAction,listToBeEdited)}>{listPopupAction==='add'?'Add' : 'Save'}</button>
                    <button style={{backgroundColor:'#35363a'}} onClick={()=>{
                      setAddListPopup(false);
                      setShowPopup(false);
                      setListPopupAction('add')
                    }}>Close</button>
                  </div>
                </div>

              :null
            }
          </div> 
          
          : null
      }
      </div>

    </div>
  )

}

export default Content