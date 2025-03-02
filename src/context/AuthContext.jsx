import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useState,useEffect,useContext, createContext } from "react"
import {auth,db} from '../../firebase'
import { doc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}
export function AuthProvider(props){
    const {children}=props
    const [globalUser,setGlobalUser]=useState(null)
    const [globalData,setGlobalData]=useState(null)
    const [isLoading,setIsLoading]=useState(false)

    
    function signup(email,password){
        return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .catch((error) => {
            console.error("Lỗi đăng ký:", error.message);
            throw error; // Ném lỗi để component có thể hiển thị
        });
    }
    
    function login(email,password){
        return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .catch((error) => {
            console.error("Lỗi đăng nhập:", error.message);
            throw error;
        });
    }
    
    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Email đặt lại mật khẩu đã được gửi!");
        })
        .catch((error) => {
            console.error("Lỗi reset mật khẩu:", error.message);
            throw error;
        });
    }
    
    function logout(){
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
        .then(() => {
            console.log("Đã đăng xuất thành công!");
        })
        .catch((error) => {
            console.error("Lỗi đăng xuất:", error.message);
            throw error;
        });
        
    }
    const value={globalUser,globalData,setGlobalData,isLoading,signup,login,resetPassword,logout}
    
    useEffect(()=>{
        const unsubscribe= onAuthStateChanged(auth,async (user)=>{

            console.log('current user:',user)
            setGlobalUser(user)
            if (!user) {
                console.log('no user')
                setGlobalData(null)
                return}

            //check xem co data cua user trong database ko, neu co thi fetch data cu va update global state
            try{
                setIsLoading(true)
                const docRef = doc(db,'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData={}
                if(docSnap.exists()){
                    firebaseData = docSnap.data()
                    console.log('found user data',firebaseData)

                }
                setGlobalData(firebaseData)
            }catch(err){
                console.log(err.message);
            }finally{
                setIsLoading(false)
            }
        })
        return unsubscribe
    },[])
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}