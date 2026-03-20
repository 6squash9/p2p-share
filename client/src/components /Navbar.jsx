import './Navbar.css'
import { useNavigate } from 'react-router-dom'

function Navbar({ lenisRef }) {
    const navigate = useNavigate()
    return (
        <nav className='navbar'>
            <div className='nav-inner'>
                <div onClick={() => { navigate("/") }} className='logo'>Peer<span>Send</span></div>
                <div className='nav-links'>
                    <a href="#">About</a>
                    <a href="#">Blog</a>
                    <a href="#features" onClick={(e) => { e.preventDefault(); lenisRef.current?.scrollTo('#features', { duration: 1.2 }) }}>Features</a>
                    <a href="#how-it-works" onClick={(e) => { e.preventDefault(); lenisRef.current?.scrollTo('#how-it-works', { duration: 1.2 }) }}>How it works</a>
                </div>
                <div className='nav-buttons'>
                    <button onClick={() => navigate("/room")}>Get Started</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar