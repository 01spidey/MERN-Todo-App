import React, { useState,useEffect } from 'react'
import '../styles/Content.scss'
import {FiEdit3} from "react-icons/fi";
import {FaTrash} from "react-icons/fa";
import {IoIosRefresh} from "react-icons/io";
import noDataImg from '../assets/no-data.svg'
import axios from 'axios';
import { IoMdListBox } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';
import {InfinitySpin } from  'react-loader-spinner'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Content = () => {

    const [items, setItems] = useState([])
    const [listItems, setListItems] = useState([])
    const [deletePopup, setDeletePopup] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    // const [toastrMessage, setToastrMessage] = useState(null)
    
    const [addTaskPopup, setAddTaskPopup] = useState(false)
    const [taskPopupAction, setTaskPopupAction] = useState('add')
    const [newTask, setNewTask] = useState('')
    const [taskToBeEdited, setTaskToBeEdited] = useState(0)

    const [addListPopup, setAddListPopup] = useState(false)
    const [listPopupAction, setListPopupAction] = useState('add')
    const [newList, setNewList] = useState('')
    const [listToBeEdited, setListToBeEdited] = useState(0)

    const [curListItem, setCurListItem] = useState('')
    const [showSideBar, setShowSideBar] = useState(true)
    const [loader, setLoader] = useState(false)

    
    const API_URL = 'http://localhost:4000'

    useEffect(() => {
      getLists(null)
    }, [])


    const getLists = (flag) => {
      try{

        axios.get(`${API_URL}/getLists`).then(
            (res)=> {
              setListItems(res.data.lists)

              if(flag===null){
                setCurListItem(res.data.lists[0])
                getTasksofList(res.data.lists[0])
              }
              else{
                if(flag===true){
                  let updated_list_item = {
                    ...curListItem,
                    name : newList.trim() 
                  }
                  console.log(updated_list_item)
                  setCurListItem(updated_list_item)
                  getTasksofList(updated_list_item)
                }else{
                  setCurListItem(res.data.lists[(res.data.lists.length)-1])
                  getTasksofList(res.data.lists[(res.data.lists.length)-1])
                }
              } 
            }
        ).catch(
          err=> console.log(err)
        )
      }
      catch(err){
          console.log(err)
      }
    }

    const handleTask = (target_task, action) => {

      axios.put(`${API_URL}/handleTask`, {id :(target_task.id-1), list_id : curListItem.original_id, action : action}).then(
        (res)=>{
          if(res.data.success){
            console.log(res.data); 
            getTasksofList(curListItem)
          }else console.log(res.data.message)
        }
      )
      .catch(
        (err)=> console.log(err)
      )

    }

    // Delete Task
    const deleteTask = ()=>{
      axios.delete(`${API_URL}/deleteTask/${curListItem.original_id}/${deletePopup.id}`)
      .then(
        (res)=> {
          if(res.data.success){
            console.log(res.data); 
            getTasksofList(curListItem)
          }else console.log(res.data.message)
        }
      ).catch(
        (err)=> console.log(err)
      )

      setShowPopup(false)
      setDeletePopup(null)
      
    }

    // Delete List
    const deleteList = ()=>{
      axios.delete(`${API_URL}/deleteList/${deletePopup.id}`)
      .then(
        (res)=> {
          if(res.data.success){
            console.log(res.data); 
            // getTasksofList(false)
            getLists(false)
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

    const handleNewList = (event)=>{
      setNewList(event.target.value)
    }

    // Add New Task or Edit Existing Task
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
        axios.post(`${API_URL}/addTask`, postData).then(
          (res)=> {console.log(res); getTasksofList(curListItem)}
        ).catch(
          (err)=> console.log(err)
        )

      }else{
        // id = task_id
        axios.put(`${API_URL}/updateTask`, putData)
        .then(
          (res)=> {
            if(res.data.success){
              console.log(res); 
              getTasksofList(curListItem)
            }else console.log(res.data.message)
            
          }
        ).catch(
          (err)=> console.log(err)
        )
      }
     
     setAddTaskPopup(false)
     setShowPopup(false)
    }

    const addOrUpdateList = (action, list_id)=>{

      let list_obj = {
        name : newList.trim(),
        tasks : []
      }

      if(action==='add'){
        axios.post(`${API_URL}/addList`, list_obj).then(
          (res)=> {
            console.log(res);
            if(res.data.success){
              setAddListPopup(false)
              setShowPopup(false)
              getLists(false)
            }
            
          }
        ).catch(
          (err)=> console.log(err)
        )

      }
      
      else{
        // id = task_id
        axios.put(`${API_URL}/updateList`, {list_id : list_id, name : newList.trim()})
        .then(
          (res)=> {
            if(res.data.success){
              console.log(res); 
              getLists(true)
              
              setAddListPopup(false)
              setShowPopup(false)
            }else console.log(res.data.message)
            
          }
        ).catch(
          (err)=> console.log(err)
        )
      }
    }
  
    const getTasksofList = (listItem)=>{
      setCurListItem(listItem)
      
      console.log(listItem)

      axios.get(`${API_URL}/getTasks/${listItem.original_id}`).then(
        (res)=>{ 
          console.log(res.data)
          setItems(res.data.tasks);
        }
      ).catch(
        err=> console.log('Some Technical Error!!')
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

      axios.put(`${API_URL}/reorderTasks`, {list_id : curListItem.original_id, tasks : itemsCopy})
      .then(
        (res)=> {
          if(res.data.success){
            console.log(res); 
            getTasksofList(curListItem)
          }else console.log(res.data.message)
        }
      ).catch(
        (err)=> console.log(err)
      )

    }

  return ( 

    <div className="main-box">

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
                        id : listItem.original_id, 
                        type : 'list'
                      }
                      ); 
                    }}/>
                </div>
              </div>
            ))
          }
        </div>

      </div>

      {
        !showSideBar?
          <div className="closed-left-box">
          <HiMenu id='ham-icon' onClick={()=>{setShowSideBar(!showSideBar)}} />
          </div>:null
      }
      

      <div className="right-box">
        
        <div className="add-btn no-select" 
          onClick={()=>{
            setNewTask('')
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
                                        id : item.original_id, 
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
              loader?
                <div className="loader">
                  <InfinitySpin  width='200' color="#4fa94d" />
                </div>:null
            }

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