import { useState } from 'react'
import './ContactPage.css'
import Navbar from '../components /Navbar'
import Footer from '../components /Footer'

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScZx5G52k26Q5fBUrp0BNDjulcly8rIeGDCVAZQjJqEwxYO0A/formResponse'

        const formBody = new URLSearchParams({
            'entry.932878115': formData.name,
            'entry.321145325': formData.email,
            'entry.1898697900': formData.subject,
            'entry.391965054': formData.message,
            'emailAddress': formData.email,
            'fvv': '1',
            'pageHistory': '0',
        })

        try {
            await fetch(googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody.toString(),
            })
            // no-cors means we can't read the response, but the submission goes through
            setSubmitted(true)
        } catch (err) {
            console.error('Contact form submission failed:', err)
            alert('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='contact-wrapper'>
            <Navbar />

            <main className='contact-main'>
                <div className='contact-header'>
                    <div className='section-badge'>Contact</div>
                    <h1>Get in <span className='serif-accent'>Touch</span></h1>
                    <p className='contact-subtitle'>
                        Have a question, a bug report, or just want to say hi? We'd love to hear from you.
                    </p>
                </div>

                <div className='contact-form-wrap'>
                    {submitted ? (
                        <div className='contact-success'>
                            <div className='success-icon'>✓</div>
                            <h2>Message sent!</h2>
                            <p>Thanks for reaching out. We'll get back to you as soon as possible.</p>
                            <button
                                className='contact-btn'
                                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }) }}
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className='contact-form' onSubmit={handleSubmit}>
                            <div className='form-row'>
                                <div className='form-group'>
                                    <label htmlFor='contact-name'>Name</label>
                                    <input
                                        id='contact-name'
                                        type='text'
                                        name='name'
                                        placeholder='Your name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete='name'
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='contact-email'>Email</label>
                                    <input
                                        id='contact-email'
                                        type='email'
                                        name='email'
                                        placeholder='you@example.com'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete='email'
                                    />
                                </div>
                            </div>

                            <div className='form-group'>
                                <label htmlFor='contact-subject'>Subject</label>
                                <input
                                    id='contact-subject'
                                    type='text'
                                    name='subject'
                                    placeholder="What's this about?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='contact-message'>Message</label>
                                <textarea
                                    id='contact-message'
                                    name='message'
                                    placeholder="Tell us what's on your mind…"
                                    rows={7}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type='submit'
                                className={`contact-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? <span className='btn-spinner' /> : 'Send message'}
                            </button>
                        </form>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ContactPage
 