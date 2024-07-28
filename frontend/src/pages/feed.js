import React, { useEffect, useState } from 'react'
import Styles from '@/styles/pages/feed.module.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SlLike,SlDislike } from 'react-icons/sl'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineEye, AiOutlineLike } from 'react-icons/ai'
import { getFeed, getUser, updateBlogStats } from '@/apiFunctions';

export default function Feed() {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [uname, setUname] = useState('');
    // Feed appears to authenticated users only  (Can be done at backend)  
    useEffect(() => {
        const loadFeed = async () => {
            // const res = await axios.get(backend_url + '/get-feed',{withCredentials: true}).then(r=>r.data);
            const res = await getFeed();
            console.log("Feed: ",res);
            if (res.status) setBlogs(JSON.parse(res.blogs));
        }
        const isAuthenticated = async () => {
            // const res = await axios.get(backend_url + '/api/user',{withCredentials:true}).then((r)=>r.data);
            const res = await getUser();
            if (res.status) setUname(res.user.username);
            setLoading(false);
            loadFeed();
        }
        isAuthenticated();
      }, []);
    const updateAction = async (action, id) => {
        if (action !== "likes" && action !== "dislikes") return ;

        // Send a request to the backend to update along with the credentials.
        // const res = await axios.post( backend_url + '/update-blog-stats',{action,blog_id:id},{withCredentials: true}).then((r) => r.data);
        const res = await updateBlogStats(id);
        console.log(res);
        if (!res.status) {return ;}

        // Update blogData.stats.action += userStats.action ? -1 : 1
        let s = action === "likes" ? "liked" : "disliked";
        setBlogs(blogs.map((blog)=> {
            if (blog.id === id) {
                const updatedBlog = blog;
                const actionValue = updatedBlog.stats[action] || 0;
                const sValue = updatedBlog.stats[s] || false;
                updatedBlog.stats = {
                    ...updatedBlog.stats,
                    [action]: actionValue + (sValue ? -1 : 1),
                    [s]: !sValue,
                };
                return updatedBlog
            }
            return blog;
        }));
        console.log(blogs);
    }
  return (
    loading ? <h1> Loading... </h1> :
    <div className={Styles.mainWrapper}>
        <Navbar uname={uname} />
        <div className={Styles.mainContainer}>
            { blogs.map((blog,index) => {
                return(
                    <div className={Styles.blogContainer} key={index}>
                        <div className={Styles.blogTopSection}>
                        <Link href={`/blog-view/${blog.id}`} className={Styles.blogTitle}>
                            {blog.title}
                        </Link>
                        { blog.author === uname &&
                        <div className={Styles.deleteBlogBtn} onClick={()=>{deleteBlog(blog.id)}}> Delete </div>
                        }
                        </div>
                        <div className={Styles.blogDetails}>
                            <div className={Styles.Stats}> 
                                {/* Likes */}
                                <div className={Styles.statsItemContainer} onClick={()=>{updateAction("likes", blog.id)}}>{blog.stats.liked ? <AiFillLike className={Styles.statsItemLogo} />  : <AiOutlineLike className={Styles.statsItemLogo} />}
                                    <div className={Styles.statsItemCount}> {blog.stats.likes} </div>
                                </div>
                                {/* DisLikes */}
                                <div className={Styles.statsItemContainer} onClick={()=>{updateAction("dislikes", blog.id)}}>{blog.stats.disliked ? <AiFillDislike className={Styles.statsItemLogo} />  : <AiOutlineDislike className={Styles.statsItemLogo} />}
                                    <div className={Styles.statsItemCount}> {blog.stats.dislikes} </div>
                                </div>
                                {/* Views */}
                                <div className={Styles.statsItemContainer}><AiOutlineEye className={Styles.statsItemLogo} />
                                    <div className={Styles.statsItemCount}> {blog.stats.views} </div>
                                </div>
                            </div>
                            <div className={Styles.blogBottomDetails}>
                                - by <Link href={`/profile/${blog.author}`} target='_blank' className={Styles.blogAuthor}>{blog.author}</Link> | {blog.time.slice(0,19)}
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
