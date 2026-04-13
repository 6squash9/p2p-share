import './Footer.css';
import { useNavigate } from 'react-router-dom'

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className='footer'>
            <div className='footer-inner'>
                <div className='footer-content'>
                    <div className='logo'>Peer<span>Send</span></div>
                    <div className='footer-links'>
                        <a href="/about" onClick={() => navigate('/about')}>About</a>
                        <a href="/privacy" onClick={() => navigate('/privacy')}>Privacy</a>
                        <a href="/terms" onClick={() => navigate('/terms')}>Terms</a>
                        <a href="/contact" onClick={() => navigate('/contact')}>Contact</a>
                    </div>
                </div>
                <div className='footer-bottom'>
                    <p>&copy; {new Date().getFullYear()} PeerSend. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
