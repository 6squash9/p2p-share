import './Navbar.css'
import { useNavigate, useLocation } from 'react-router-dom'

function Navbar({ lenisRef }) {
    const navigate = useNavigate()
    const location = useLocation()
    const isOnLanding = location.pathname === '/'

    const handleSectionNav = (e, sectionId) => {
        e.preventDefault()
        if (isOnLanding && lenisRef?.current) {
            lenisRef.current.scrollTo(`#${sectionId}`, { duration: 1.2 })
        } else {
            navigate(`/?section=${sectionId}`)
        }
    }

    return (
        <nav className='navbar'>
            <div className='nav-inner'>
                <div onClick={() => { navigate("/") }} className='logo'>Peer<span>Send</span></div>
                <div className='nav-links'>
                    <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About</a>
                    <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog') }}>Blog</a>
                    <a href="#features" onClick={(e) => handleSectionNav(e, 'features')}>Features</a>
                    <a href="#how-it-works" onClick={(e) => handleSectionNav(e, 'how-it-works')}>How it works</a>
                </div>
                <div className='nav-buttons'>
                    <button onClick={() => navigate("/room")}>Get Started</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar