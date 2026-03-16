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
                <h1><span className="logo">Peer<span>Send</span></span> lets you send files privately.</h1>

                <p>
                    Send files directly to anyone. No middleman. No storage. No signup. Just fast, private sharing.
                </p>
                <div className='hero-buttons'>
                    <button className='btn-primary'>Send a File →</button>
                    <button className='btn-secondary'>How it works</button>
                </div>
            </section>

        </div>
    )
}


export default LandingPage