import './AboutPage.css'
import Navbar from '../components /Navbar'
import Footer from '../components /Footer'
import { useNavigate } from 'react-router-dom'

function AboutPage() {
    const navigate = useNavigate()

    return (
        <div className='about-wrapper'>
            <Navbar />

            <main className='about-main'>

                <div className='about-header'>
                    <div className='section-badge'>About</div>
                    <h1>We believe sharing files should be <span className='serif-accent'>private</span></h1>
                    <p className='about-subtitle'>
                        PeerSend is a browser-based, peer-to-peer file transfer tool built on the conviction that your data should never touch a stranger's server.
                    </p>
                </div>
                <div className='about-story-text'>
                    <p>
                        Most file sharing works like this: your file leaves your device, travels to a server somewhere, sits there, and then gets downloaded by someone else. You never really shared it. You uploaded it and hoped for the best.
                    </p>
                    <p>
                        PeerSend skips all of that. When you send a file, it goes directly from your browser to theirs. No uploads. No storage. No middleman with access to your data. The server exists only to introduce two browsers to each other. Once the connection is made, it's completely out of the picture.
                    </p>
                    <p>
                        We built PeerSend because privacy shouldn't require trust. It should be guaranteed by the architecture itself.
                    </p>
                </div>

                <div className='about-cta'>
                    <h2>Try it now</h2>
                    <p>No signup. No cloud. Just open a room and share.</p>
                    <button className='about-cta-btn' onClick={() => navigate('/room')}>
                        Send a File →
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    )
}

export default AboutPage
