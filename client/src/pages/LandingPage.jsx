import './LandingPage.css'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

function LandingPage() {
    const videoTextRef = useRef(null)

    // //lensi for smooth scroll
    useEffect(() => {
        // setting up lenis
        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
        })
        // listening to scroll event
        lenis.on('scroll', () => {
            if (videoTextRef.current) {
                const rect = videoTextRef.current.getBoundingClientRect()
                const windowHeight = window.innerHeight
                const distanceFromBottom = windowHeight - rect.top
                const opacity = Math.min(Math.max(distanceFromBottom / 300, 0), 0.9)
                const translateY = Math.max(20 - (distanceFromBottom / 15), 0)
                videoTextRef.current.style.opacity = opacity
                videoTextRef.current.style.transform = `translateX(-50%) translateY(${translateY}px)`
            }
        })
        // animation loop (RAF) for lenis
        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => lenis.destroy()
    }, [])



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
                <div className='video-wrapper'>
                    <video src="/Abstract+Objects.mp4"
                        className="hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline></video>
                    <div className='video-text' ref={videoTextRef}>Peer<span>Send</span></div>
                </div>
            </section>

        </div>
    )
}


export default LandingPage