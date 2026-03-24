import './LandingPage.css'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { Lock, Zap, UserX, FileCheck, Heart, Infinity } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components /Navbar'

function LandingPage() {
    const videoTextRef = useRef(null)
    const videoWrapperRef = useRef(null)
    const heroRef = useRef(null)
    const heroTextRef = useRef(null)
    const lenisRef = useRef(null)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // setting up lenis
        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
        })
        lenisRef.current = lenis

        // Check for section parameter from the url upon page load
        const params = new URLSearchParams(location.search)
        // get the section id from the url anything after ?section=
        const sectionId = params.get('section')
        if (sectionId) {
            // Small timeout to ensure DOM is ready and Lenis is settled
            setTimeout(() => {
                lenis.scrollTo(`#${sectionId}`, { duration: 1.2 })
                // Clean up the URL
                navigate('/', { replace: true })
            }, 100)
        }

        lenis.on('scroll', ({ scroll }) => {
            // --- Text Nudge Animation ---
            // Text nudges up just a little based on scroll — feels alive but never hits the navbar
            if (heroTextRef.current && heroRef.current) {
                const heroTop = heroRef.current.offsetTop
                const scrollIntoHero = Math.max(scroll - heroTop, 0)
                const textOffset = Math.min(scrollIntoHero * 0.05, 30)
                heroTextRef.current.style.transform = `translateY(-${textOffset}px)`
            }

            // --- Fade in the video overlay text ---
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
            <Navbar lenisRef={lenisRef} />


            {/* Outer: provides scroll distance. Inner: sticks to viewport */}
            <section className='hero-pin-wrapper' ref={heroRef}>
                <div className='hero-sticky-content'>

                    {/* Text block — stays visible while video rises over it */}
                    <div className='hero-text' ref={heroTextRef}>
                        <h1><span className="logo">Peer<span>Send</span></span> lets you send files privately.</h1>
                        <p>
                            Send files directly to anyone. No middleman. No storage. No signup. Just fast, private sharing.
                        </p>
                        <div className='hero-buttons'>
                            <button className='btn-primary' onClick={() => navigate("/room")}>Send a File →</button>
                            <button className='btn-secondary'>How it works</button>
                        </div>
                    </div>

                    {/* Video — JS slides this upward over the text as you scroll */}
                    <div className='video-wrapper' ref={videoWrapperRef}>
                        <video
                            src="/Abstract+Objects.mp4"
                            className="hero-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                        <div className='video-text' ref={videoTextRef}>Peer<span>Send</span></div>
                    </div>

                </div>
            </section>
            {/* How it works */}

            <section id='how-it-works' className='process'>
                <div className='process-border'>
                    <div className='process-inner'>
                        <div className='process-text'>
                            <div className='section-badge'>How it works</div>
                            <h2>Send your files <span className='serif-accent'>smoothly</span></h2>
                            <p className='section-subtitle'>Send files to anyone in three simple steps.</p>
                        </div>
                        <div className='process-boxes'>
                            <div className='process-box'>
                                <div className='step-number'>01</div>
                                <h3>Initialize</h3>
                                <p>Generate a secure, private room instantly. No signup, no tracking. Just a temporary space to share freely</p>
                            </div>
                            <div className='process-box'>
                                <div className='step-number'>02</div>
                                <h3>Connect</h3>
                                <p>Share the unique room link with your recipient. PeerSend establishes a direct, encrypted bridge between you.</p>
                            </div>
                            <div className='process-box'>
                                <div className='step-number'>03</div>
                                <h3>Transfer</h3>
                                <p>Stream files browser-to-browser. Your data never touches a server, ensuring absolute privacy and maximum speed.</p>
                            </div>
                        </div>
                        <button className='process-button' onClick={() => navigate("/room")}>Send a File</button>
                    </div>
                </div>
            </section >

            {/* Features */}
            <section id='features' className='features'>
                <div className='features-border'>
                    <div className='process-inner'>
                        <div className='feature-text'>
                            <div className='section-badge'>Features</div>
                            <h2>Reasons you will <span className='serif-accent'>love</span> us</h2>
                            <p className='section-subtitle'>Send files the way it should've always worked.</p>
                        </div>
                        <div className='feature-boxes'>
                            <div className='feature-box'>
                                <Lock size={32} strokeWidth={1.5} />
                                <h3>End-to-End Encrypted</h3>
                                <p>DTLS encryption via WebRTC. Nobody can intercept your files.</p>
                            </div>
                            <div className='feature-box'>
                                <Zap size={32} strokeWidth={1.5} />
                                <h3>Lightning Fast</h3>
                                <p>Direct browser-to-browser transfer. No server bottleneck slowing you down.</p>
                            </div>
                            <div className='feature-box'>
                                <UserX size={32} strokeWidth={1.5} />
                                <h3>No Signup Required</h3>
                                <p>Just create a room and go. No accounts, no tracking, no BS.</p>
                            </div>
                            <div className='feature-box'>
                                <Infinity size={32} strokeWidth={1.5} />
                                <h3>No File Size Limits</h3>
                                <p>Send files of any size. No restrictions whatsoever.</p>
                            </div>
                            <div className='feature-box'>
                                <FileCheck size={32} strokeWidth={1.5} />
                                <h3>Any File Type</h3>
                                <p>Videos, docs, images, zips — send anything you want.</p>
                            </div>
                            <div className='feature-box'>
                                <Heart size={32} strokeWidth={1.5} />
                                <h3>Completely Free</h3>
                                <p>No subscriptions, no limits, no hidden costs. Always free.</p>
                            </div>

                        </div>
                        <button className='process-button' onClick={() => { navigate("/room") }}>Send a File</button>
                    </div>
                </div>
            </section >

            {/* Footer */}
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


        </div >
    )
}

export default LandingPage