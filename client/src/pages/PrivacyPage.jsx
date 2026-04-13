import './PrivacyPage.css'
import Navbar from '../components /Navbar'
import Footer from '../components /Footer'
import { useNavigate } from 'react-router-dom'

const sections = [
    {
        title: "Introduction",
        content: `PeerSend is built on a single belief: your files are your business. This Privacy Policy explains what little data we touch, why, and how. Short version: we don't store your files, we don't track you, and we never sell your data.`
    },
    {
        title: "What Data We Collect",
        content: `Almost nothing. We do not require you to create an account, log in, or provide any personal information to use PeerSend. We may collect basic, anonymous usage metrics (e.g. page visits) through our hosting provider, but these are not tied to any individual.`
    },
    {
        title: "How File Transfer Works",
        content: `PeerSend uses WebRTC to establish a direct, encrypted, peer-to-peer connection between your browser and the recipient's browser. Your files travel directly between devices, they are never uploaded to, stored on, or routed through our servers. We have no access to the contents of your transfers.`
    },
    {
        title: "Signaling Server",
        content: `To establish the WebRTC connection, we use a lightweight signaling server. This server only exchanges the connection metadata (ICE candidates and session descriptions) needed to set up the peer-to-peer channel. It does not see, buffer, or log your file data. Once the connection is established, the signaling server is no longer involved.`
    },
    {
        title: "Third-Party Services",
        content: `The PeerSend frontend is hosted on Vercel and the backend (signaling server) runs on Railway. We also use Cloudflare as a reverse proxy for DDoS protection and DNS. Each of these providers may log basic request metadata (e.g. IP addresses, request timestamps) as part of standard infrastructure operations, refer to their respective privacy policies for details. We do not use any advertising networks, third-party analytics, or tracking pixels.`
    },
    {
        title: "Cookies & Local Storage",
        content: `PeerSend does not use cookies for tracking or advertising. We may use browser local storage minimally to improve your experience (e.g. remembering a theme preference), but nothing sensitive is ever persisted and it is never shared with third parties.`
    },
    {
        title: "Changes to This Policy",
        content: `We may update this policy occasionally. If we make significant changes, we'll update the date at the bottom of this page. Continued use of PeerSend after changes means you accept the revised policy.`
    },
    {
        title: "Contact",
        content: `Have a question about your privacy? Reach out to us via the contact form. We're happy to help.`
    }
]

function PrivacyPage() {
    return (
        <div className='privacy-wrapper'>
            <Navbar />

            <main className='privacy-main'>
                <div className='privacy-header'>
                    <div className='section-badge'>Legal</div>
                    <h1>Privacy <span className='serif-accent'>Policy</span></h1>
                    <p className='privacy-subtitle'>
                        We built PeerSend to work <em>without</em> your data. Here's proof.
                    </p>
                    <span className='privacy-date'>Last updated: April 2026</span>
                </div>

                <div className='privacy-content'>
                    {sections.map((section, i) => (
                        <div className='privacy-section' key={i}>
                            <h2>{section.title}</h2>
                            <p>{section.content}</p>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default PrivacyPage
