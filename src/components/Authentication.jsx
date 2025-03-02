import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Authentication(props){
    const {handleCloseModal}=props
    const [isRegistatrion,setIsRegistatrion ] = useState(false)
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [isAuthenticating,setIsAuthenticating]=useState(false)
    const [error,setError]=useState(null)

    const {login,signup} =useAuth()

    async function handleAuthenticated() {
        console.log('bam nut submit')
        console.log('dng xac thuc',isAuthenticating)
        
        if(!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating){
            console.log("⚠️ Không đủ điều kiện để tiếp tục!");
    console.log("📧 Email:", email);
    console.log("✅ Email hợp lệ:", email.includes('@'));
    console.log("🔑 Password:", password);
    console.log("✅ Password đủ độ dài (>=6):", password.length >= 6);
        if(email==='' || password===''){
            setError("Please enter your email and password")
            return; 
        }
        if (!email.includes('@')) {
        setError("Enter the correct format, which is includes '@' " );
        return;
        }
        if (password.length < 6) {
        setError("Password has to have more than 6 characters");
        return;
    }
            return;
        }
        try{
            setIsAuthenticating(true)
            setError(null)
            console.log('gui ycau')
            if (isRegistatrion){
                await signup(email,password)
            }else{
                await login(email,password)
            }
            console.log('thanh cong')
            handleCloseModal()

        }catch (err)  {
            console.log("Lỗi chi tiết:", err); 
        
            if (err.code) { // Firebase trả về lỗi với `err.code`
                switch (err.code) {
                    case "auth/email-already-in-use":
                        setError("This email is already in use!");
                        break;
                    case "auth/invalid-email":
                        setError("Invalid Email");
                        break;
                    case "auth/user-not-found":
                        setError("User not found");
                        break;
                    case "auth/wrong-password":
                        setError("Wrong password,try again");
                        break;
                    default:
                        setError("Error! Try Again");
                }
            }}finally{
            setIsAuthenticating(false)
            console.log("🔄 isAuthenticating sau khi xác thực:", isAuthenticating);
        }
        
    }

    return(
        <>
            <div className="sign-container">
                <h2 className="sign-up-text">{isRegistatrion? 'Sign Up':'Login'}</h2>  
                <i  className="fa-solid fa-xmark" onClick={handleCloseModal}></i>
            </div>
            <p>{isRegistatrion?'Create an account':'Sign in to your account'}</p>
            {error && (
                <p style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>❌ {error}</p>
            )}
            
            <input value={email} onChange={(e)=>setEmail(e.target.value.toString())} type="text" placeholder="Email" /> 
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="*******" />  
            <button onClick={handleAuthenticated}><p>{isAuthenticating?'Authenticating...':'Submit'}</p></button>  
            <hr />
            <div className="register-cotent">
                <p>{isRegistatrion?'Already have an account?':'Don\'t have an account?'}</p>
                <button onClick={()=>{setIsRegistatrion(!isRegistatrion); setError(null)}}><p>{isRegistatrion? 'Sign In':'Sign Up'}</p></button>

            </div>
        </>
    )
}