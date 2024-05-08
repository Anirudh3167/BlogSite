import React, { useState,useEffect } from 'react'
import Styles from '@/styles/pages/profile.module.css'
import Link from 'next/link'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import axios from 'axios'
import { useRouter } from 'next/router'


export default function Profile() {
    // Variables
    const [username,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [Auth,setAuth] = useState(false);
    const [interests, setInterests] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const router = useRouter();
    
    useEffect(() => {
        const userBlogs = async (username) => {
            const res = await axios.get('http://localhost:8000/user-blogs',{params:{'username': username}});
            const r = await res.data.blogs;
            setBlogs(JSON.parse(r));
        }
        const getUser = async () => {
            const res = await axios.get('http://localhost:8000/api/user',{withCredentials:true});
            
            if (!res.data.status) { alert(res.data.reason); router.push('/');}
            setUserName(res.data.user.username);
            setEmail(res.data.user.email)
            setAuth(true);
            setInterests(res.data.user.interests.split('[<#SEP#>]'))
            userBlogs(res.data.user.username);
        }
        getUser();
      }, []);
      
  return (
    <div className={Styles.mainWrapper}>
        <Navbar />
        <div className={Styles.mainContainer}>
            {/* Left section */}
            <div className={Styles.leftContainer}>

                <div className={Styles.editSpace}>
                    <div className={Styles.editBtn}> Edit </div>
                </div>
                <div className={Styles.photoSpace}> 
                    <div className={Styles.dp}> A </div>    {/* dp --> Display Picture */}
                    <div className={Styles.username}> @{username} </div>
                </div>

                <div className={Styles.detailsSpace}>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Name: </div>
                        <input type="text" name="name" value={username} disabled={true} />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Email: </div>
                        <input type="email" name="email" value={email} disabled={true} readOnly />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Mobile: </div>
                        <input type="text" name="mobile" value="0123456789" disabled={true} />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Interests: </div>
                        <div className={Styles.interestsDetail}>
                        {
                            interests.map((i,idx) => {
                                return(
                                    <div key={idx} className={Styles.interestsBox}>{i}</div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
                <div className={Styles.lineBreak}></div>
                <div className={Styles.settingsBtn}> Settings </div>

            </div>
            {/* Right section */}
            <div className={Styles.rightContainer}>
                    { blogs.length < 1 ?
                    <div className={Styles.userBlogs}>
                        Start creating new blogs by from here.
                        <Link href="/publish" className={Styles.newBlog}> Create Blog</Link>
                    </div> :
                    <div className={Styles.userBlogs} style={{alignItems:'flex-start',justifyContent:'flex-start', gap:'10px'}}>
                        {blogs.map((blog,index) => {
                            return(
                                <Link href={`/blog-view/${blog.id}`} className={Styles.userblog} key={index}> {blog.title} </Link>
                            )
                        })}
                    </div>
                    }

                <div className={Styles.likedBlogs}>
                    You have no liked blogs. Start Watching the latest blog from
                    <Link href="/feed" className={Styles.newBlog}> feed </Link>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}
