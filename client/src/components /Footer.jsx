import './Footer.css';

function Footer() {
    return (
        <footer className='footer'>
            <div className='footer-inner'>
                <div className='footer-content'>
                    <div className='logo'>Peer<span>Send</span></div>
                    <div className='footer-links'>
                        <a href="#">About</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contact</a>
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
