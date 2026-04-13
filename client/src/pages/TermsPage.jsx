import './TermsPage.css'
import Navbar from '../components /Navbar'
import Footer from '../components /Footer'

const sections = [
    {
        title: "Acceptance of Terms",
        content: `By accessing and using PeerSend, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
        title: "Description of Service",
        content: `PeerSend provides a web-based, peer-to-peer file transfer service. The service is provided "as is" and "as available". We do not store your files on our servers. File transfers occur directly between peers using WebRTC technology.`
    },
    {
        title: "User Conduct",
        content: `You agree not to use PeerSend to transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable. You are solely responsible for the content you transfer.`
    },
    {
        title: "Intellectual Property",
        content: `You agree not to use PeerSend to infringe on any intellectual property rights. You represent and warrant that you have all necessary rights to the files you transfer. We respect copyright laws and expect our users to do the same.`
    },
    {
        title: "Limitation of Liability",
        content: `PeerSend shall not be liable for any direct, indirect, incidental, special or consequential damages, resulting from the use or the inability to use the service, including but not limited to, damages for loss of profits, use, data or other intangible losses. Since we do not store your files, we are not responsible for any file loss or corruption during transfer.`
    },
    {
        title: "Service Reliability",
        content: `We do our best to maintain the reliability of PeerSend, but we cannot guarantee uninterrupted access. The service relies on browser capabilities, network conditions, and WebRTC protocol, which may fail or be blocked by firewalls or network administrators.`
    },
    {
        title: "Third-Party Services",
        content: `PeerSend uses Google's STUN servers to help establish peer-to-peer connections. This is a standard WebRTC practice. Google may log IP addresses as part of this process. We have no control over Google's data practices. We also use Cloudflare for DNS and DDoS protection, and Vercel and Railway for hosting.`
    },
    {
        title: "Modifications to Service",
        content: `We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.`
    },
    {
        title: "Governing Law",
        content: `These terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.`
    },
    {
        title: "Similarity Disclaimer",
        content: `PeerSend is an independent project. The name, concept, or functionality may coincidentally overlap with other existing products. This is unintentional and does not constitute any claim over or against those products. PeerSend makes no claim over any third-party names, brands, or intellectual property.`
    }
]

function TermsPage() {
    return (
        <div className='terms-wrapper'>
            <Navbar />

            <main className='terms-main'>
                <div className='terms-header'>
                    <div className='section-badge'>Legal</div>
                    <h1>Terms of <span className='serif-accent'>Service</span></h1>
                    <p className='terms-subtitle'>
                        The rules of the road for using PeerSend. Keep it legal, keep it peer-to-peer.
                    </p>
                    <span className='terms-date'>Last updated: April 2026</span>
                </div>

                <div className='terms-content'>
                    {sections.map((section, i) => (
                        <div className='terms-section' key={i}>
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

export default TermsPage
