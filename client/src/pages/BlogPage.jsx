import './BlogPage.css'
import Navbar from '../components /Navbar'
import Footer from '../components /Footer'
import { ArrowUpRight } from 'lucide-react'

const blogPosts = [
    {
        id: 1,
        title: "What actually travels when you send someone a file?",
        excerpt: "A friend asked how PeerSend moves files without a server. The answer — light bouncing through glass thinner than a hair, across the ocean floor — turned out to be one of the strangest things I know.",
        category: "Deep Dive",
        readTime: "12 min read",
        date: "Aug 20, 2025",
        coverImage: "/blog/cover-how-data-travels.jpg",
        hashnodeUrl: "https://suyash7.hashnode.dev/what-actually-travels-when-you-send-someone-a-file", // TODO: Replace with actual Hashnode URL
    },
]

function BlogPage() {
    return (
        <div className='blog-wrapper'>
            <Navbar />

            <main className='blog-main'>

                {/* Header */}
                <div className='blog-header'>
                    <div className='section-badge'>Blog</div>
                    <h1>Stories from the <span className='serif-accent'>inside</span></h1>
                    <p className='blog-subtitle'>
                        How PeerSend works under the hood, what we've learned building it, and the things that surprised us along the way.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className='blog-grid'>
                    {blogPosts.map((post) => (
                        <a
                            key={post.id}
                            href={post.hashnodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='blog-card'
                        >
                            <div className='blog-card-image'>
                                <img src={post.coverImage} alt={post.title} />
                            </div>
                            <div className='blog-card-body'>
                                <div className='blog-card-meta'>
                                    <span className='blog-read-time'>{post.readTime}</span>
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className='blog-card-footer'>
                                    <span className='blog-date'>{post.date}</span>
                                    <span className='blog-read-link'>
                                        Read on Hashnode <ArrowUpRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

            </main>

            <Footer />
        </div>
    )
}

export default BlogPage
