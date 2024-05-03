import React, { useEffect, useState } from 'react'
import Styles from '@/styles/pages/feed.module.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Feed() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    // Feed appears to authenticated users only  (Can be done at backend)  
    useEffect(() => {
        const userBlogs = async (username) => {
            const res = await axios.get('http://localhost:8000/user-blogs',{params:{'username': username}});
            const r = await res.data.blogs;
            setBlogs(JSON.parse(r));
        }
        const isAuthenticated = async () => {
            const res = await axios.get('http://localhost:8000/api/user',{withCredentials:true});
            const r = await res.data;
            setLoading(false);
            if (!r.status) router.push('/signin');
            else userBlogs(r.user.username);
        }
        isAuthenticated();
      }, []);
  return (
    loading ? <h1> Loading... </h1> :
    <div className={Styles.mainWrapper}>
        <Navbar />
        <div className={Styles.mainContainer}>
            { blogs.map((blog,index) => {
                return(
                    <div className={Styles.blogContainer} key={index}>
                        <Link href={`/blog-view/${blog.id}`} className={Styles.blogTitle}>
                            {blog.title}
                        </Link>
                        <div className={Styles.blogDetails}>
                            <div className={Styles.blogStats}>
                                Likes {blog.stats.likes} | Dislikes {blog.stats.dislikes} | Views {blog.stats.views} | Comments 0 | Shares 0
                            </div>
                            <div className={Styles.blogAuthor}>
                                - by {blog.author} | {blog.time}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        <Footer />
    </div>
  )
}
