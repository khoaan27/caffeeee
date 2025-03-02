import { useState } from "react"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useAuth } from "../context/AuthContext"

export default function Layout(props){
    const {children}=props
    const [showModal,setShowModal]=useState(false)
    const {globalUser,logout}=useAuth()
    const header=(
        <header>
            <div>
                <h1 className="text-gradient">CAFFEIND</h1>
                <p>For Coffee Insatiates</p>
            </div>
           {globalUser ?(
                <button onClick={logout}>
                <p>LogOut</p>
                <i className="fa-solid fa-right-from-bracket"></i>
            </button>
           ):( 
                <button onClick={()=>{setShowModal(true)}}>
                <p>Sign up for free</p>
                <i className="fa-solid fa-user-plus"></i>
            </button>)}
        </header>
    )
    const footer=(
        <footer>
            <p><span className="text-gradient">Caffiend</span> was made by <a href="https://www.facebook.com/truong.khoa.an.2004/" target="_blank" rel="noopener noreferrer">Khoa An</a> <br /> using the ReactJS and <a href="https://www.fantacss.smoljames.com" target="_blank" rel="noopener noreferrer">FantaCSS</a> design libary.</p>
        </footer>
    )
    function handleCloseModal(){
        setShowModal(false)
    }
    return(
        <> 
           {showModal && (<Modal handleCloseModal={handleCloseModal}>
                <Authentication handleCloseModal={handleCloseModal} />
            </Modal>)}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}