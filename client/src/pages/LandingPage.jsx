import './LandingPage.css'


function LandingPage() {
    return (
        <div className='wrapper'>
            {/* navbar */}
            <nav className='navbar'>
                <div className='nav-inner'>
                    <div className='logo'>Peer<span>Send</span></div>
                    <div className='nav-links'>
                        <a href="#">About</a>
                        <a href="#">Blog</a>
                        <a href="#">Features</a>
                        <a href="#">How it works</a>

                    </div>
                    <div className='nav-buttons'>
                        <button>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* hero section */}
            <section className='hero'>

            </section>
        </div>
    )
}


export default LandingPage