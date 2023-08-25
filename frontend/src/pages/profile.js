import React, { useState,useEffect } from 'react'
import Styles from '@/styles/pages/profile.module.css'
import Link from 'next/link'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import axios from 'axios'


export default function Profile() {
    // Variables
    const [username,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [Auth,setAuth] = useState(false);
    
    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get('http://localhost:8000/api/user',{withCredentials:true});
            
            setUserName(response.data.username);
            setEmail(response.data.email)
            setAuth(true);
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
                        <input type="text" name="name" value="Anirudh" disabled={true} />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Email: </div>
                        <input type="email" name="email" value={email} disabled={true} />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Mobile: </div>
                        <input type="text" name="mobile" value="0123456789" disabled={true} />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Interests: </div>
                        <input type="text" name="userTags" value="Science | ML | Web dev" disabled={true} />
                    </div>
                </div>
                <div className={Styles.lineBreak}></div>
                <div className={Styles.settingsBtn}> Settings </div>

            </div>
            {/* Right section */}
            <div className={Styles.rightContainer}>
                <div className={Styles.userBlogs}>
                    Start creating new blogs by from here.
                    <Link href="/publish" className={Styles.newBlog}> Create Blog</Link>
                </div>

                <div className={Styles.likedBlogs}>
                    You have no liked blogs.
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}
