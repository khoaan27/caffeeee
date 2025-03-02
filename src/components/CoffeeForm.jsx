import {coffeeOptions} from '../ultis'
import { useState } from 'react'
import Modal from './Modal'
import Authentication from './Authentication'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
export default function CoffeeForm(props){
    const {isAuthenticated}=props
    const [showModal,setShowModal]=useState(false)
    const [selectedCoffee,setSelectedCoffee]=useState(null)
    const [showCoffeeTypes,setShowCoffeeTypes]=useState(false)
    const [coffeeCost,setCoffeeCost]=useState(0)
    const [hour,setHour]=useState(0)
    const [min,setMin]=useState(0)
    const {globalData,setGlobalData,globalUser}=useAuth()

    async function handleSubmitForm(){
        if(!isAuthenticated){
            setShowModal(true)
            return
        }
        //only submit form if it is completed
        if(!selectedCoffee){
            return
        }
        try{
            const newGlobalData={
                ...(globalData || {})
            }
            const nowTime=Date.now()
    
            const timeToSubtract=(hour*60*60*1000)+(min*60*1000)
            const timeStamp=nowTime-timeToSubtract
            const newData={
                name: selectedCoffee, 
                cost: coffeeCost 
            }
            newGlobalData[timeStamp]=newData
    
            console.log(timeStamp,selectedCoffee,coffeeCost)
            //update global state
            setGlobalData(newGlobalData)
    
            const userRef=doc(db,'users',globalUser.uid)
            const res=await setDoc(userRef,{
                [timeStamp]:newData
            },{merge:true})
            setSelectedCoffee(null)
            setHour(0)
            setMin(0)
            setCoffeeCost(0)
        }catch(err){
            console.log(err.message)
        }        
    }
    function handleCloseModal(){
        setShowModal(false)
    }
    return(
        <>
        {showModal && ( <Modal handleCloseModal={handleCloseModal}>
                            <Authentication handleCloseModal={handleCloseModal}/>
                        </Modal>)}
            <div className="section-header">
                <i className="fa-solid fa-notes-medical"></i>
                <h2>Start Tracking Today</h2>
            </div>
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0,5).map((option,optionIndex)=>{
                    return(
                        <button onClick={()=>{
                            setSelectedCoffee(option.name)
                            setShowCoffeeTypes(false)
                        }}
                                className={'button-card '+ (option.name===selectedCoffee?' coffee-button-selected':'')} key={optionIndex}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                        </button>
                    )
                })}
                <button onClick={()=>{
                    setShowCoffeeTypes(true)
                    setSelectedCoffee(null)
                }}
                    className={'button-card '+ (showCoffeeTypes?' coffee-button-selected':'')}>
                    <h4>Other</h4>
                    <p></p>
                </button>
            </div>
             {showCoffeeTypes &&  (
                <select onChange={(e)=>{
                    setSelectedCoffee(e.target.value)
                }}
                        name="coffee-list" id="coffee-list">
                <option value={null}>Select type</option>
                {coffeeOptions.slice(5).map((option,optionIndex)=>{
                    return(
                        <option value={option.name} key={optionIndex}>
                            {option.name} ({option.caffeine} mg)
                        </option>
                    )
                })}
            </select>
        )}
            <h4>Add the cost ($)</h4>
            <input type="number" className='w-full' 
                    placeholder='4.5' step='0.1'
                    value={coffeeCost || ""} onChange={(e)=>{
                        setCoffeeCost(e.target.value)
                    }}/>
            <h4>Time since consumption</h4>
            <div className='time-entry'>
                <div>
                    <h6>Hours</h6>
                    <select onChange={(e)=>{
                        setHour(e.target.value)
                    }} id="hours-select">
                        {[...Array(24).keys()].map((hours)=>{
                            return(
                                <option key={hours} value={hours}>{hours}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <h6>Mins</h6>
                    <select onChange={(e)=>{
                        setMin(e.target.value)
                    }} id="mins-select">
                        {[5,10,15,20,25,30,35,40,45].map((mins)=>{
                            return(
                                <option key={mins} value={mins}>{mins}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <button onClick={handleSubmitForm}>
                <p>Add Entry</p>
            </button>
        </>
    )
}