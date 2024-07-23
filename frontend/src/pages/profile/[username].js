/*
Profile Problem persists.

To Reproduce,
1. Open /profile/anirudh
2. Click on profile in Navbar

Other Problems :-
 - Get the password on the edit click
 - Ask for confirmation before deleting the account
 - Interests update issues
*/

import React, { useState,useEffect } from 'react'
import Styles from '@/styles/pages/profile.module.css'
import Link from 'next/link'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import axios from 'axios'
import { useRouter } from 'next/router'
import { deleteBlog, getUser, updateUserFollows } from '@/apiFunctions'


export default function Profile() {
    // Variables
    const [editMode, setEditMode] = useState(false);
    const [user,setUser] = useState([]);
    const [uname,setUName] = useState('');
    const [password, setPassword] = useState('');
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [email,setEmail] = useState('');
    const [interests, setInterests] = useState([]);
    const [authorBlogs, setAuthorBlogs] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [curUser, setCurUser] = useState('');
    const router = useRouter();
    const [follows, setFollows] = useState(false);
    let username = router.query.username;
    const [showWrongName, setShowWrongName] = useState(false);

    const updateDetails = async (action) => {
        if (action === "cancel") {
            setUName(user.username);    setInterests(user.interests.split('[<#SEP#>]'));
        } else if (action === 'save') {
            const payload = {};
            if (password !== '') payload['password'] = password;
            if (uname !== '' && uname !== user.username) payload['username'] = username;
            if (interests !== '' && interests !== user.interests) payload['interests'] = interests;

            const res = await axios.post(backend_url + '/api/user/update',payload,{withCredentials:true}).then(r=>r.data);
            if (res.status) {   // Update the orignial user object
                setUser(prevUser => ({...prevUser,username: uname,interests: interests}));
            } else alert(res.Reason);
        }
        setEditMode(false);
    }

    const deleteAccount = async () => {
        const res = await axios.post(backend_url + '/api/user/delete',{},{withCredentials:true}).then(r=>r.data);
        if (res.status) {alert("Your Account deleted successfully"); router.push('/');}
    }
    
    useEffect(() => {
        if (!username || uname !== "") return ;  // Wait till username is set

        const userBlogs = async (username) => {
            const res = await axios.get(backend_url + '/user-blogs',{params:{'username': username}}).then((r)=>r.data);
            console.log(res);
            setAuthorBlogs(JSON.parse(res.author_blogs));
            setLikedBlogs(JSON.parse(res.liked_blogs));
        }
        const loadUser = async (username = null) => {
            // const res = await axios.get(backend_url + '/api/user',{
            //     withCredentials:true, params: username ? {username} : {}
            // }).then((r)=>r.data);
            const res = await getUser(username);
            if (!username && res.status) {setCurUser(res.user.username); return ;}    // To get the current user
            // if (!res.status) { alert(res.reason); router.push('/');}
            if (res.user) {  // To get the profile of other user
                console.log(res.user);                
                setUser(res.user);
                setUName(res.user.username);
                setEmail(res.user.email);
                setFollows(res.user.follows);
                setInterests(res.user.interests.split(','));
                userBlogs(username);
            } else if (username) {setShowWrongName(true);}
        }
        loadUser();      loadUser(username);
      }, [username]);

      const deleteBlogAction = async (blog_id) => {
        console.log("deleting blog: ", blog_id, "\nAt url: ", backend_url + '/delete-blog');
        // const res = await axios.post(backend_url + '/delete-blog',{blog_id},{withCredentials: true}).then(r=>r.data);
        const res = await deleteBlog(blog_id);
        // remove the blog by it's id.
        if (res.status) setAuthorBlogs((blog) => blog.filter((b) => b.id !== blog_id));
      }
      const updateFollows = async () => {
        if (!curUser) router.push('/signin');
        // const res = await axios.post(backend_url + '/api/user/follow',{username},{withCredentials:true}).then(r=>r.data);
        const res = await updateUserFollows(username);
        console.log("Follows: ", res);
        if (res.status) setFollows(!follows);
      }
    if (showWrongName) {return (
        <div className={Styles.mainWrapper}>
            <Navbar uname={curUser} />
            <div className={Styles.mainContainer} style={{alignItems:"center", justifyContent:"center",color:"white"}}>
                <h1>{username} not found</h1>
            </div>
        </div>
    )}
  return (
    <div className={Styles.mainWrapper}>
        <Navbar uname={curUser} />
        <div className={Styles.mainContainer}>
            {/* Left section */}
            <div className={Styles.leftContainer}>
                { curUser === uname &&  ( editMode ? 
                    <div className={Styles.editSpace}>
                        <div className={Styles.editBtn} onClick={() => updateDetails("save")}> Save </div>
                        <div className={Styles.editBtn} onClick={() => updateDetails("cancel")}> Cancel </div>                    
                    </div> 
                :
                    <div className={Styles.editSpace}>
                        <div className={Styles.editBtn} onClick={() => setEditMode(true)}> Edit </div>
                    </div>
                )}
                <div className={Styles.photoSpace}> 
                    <div className={Styles.dp}> A </div>    {/* dp --> Display Picture */}
                    <div className={Styles.username}> @{uname} </div>
                    {curUser !== uname && <div className={Styles.FollowBtn} onClick={()=>updateFollows()}
                        style={{cursor: "pointer", padding: "10px 20px 10px 20px"}}> {follows ? "Unfollow" : "Follow"} </div>}
                </div>

                <div className={Styles.detailsSpace}>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Name: </div>
                        <input type="text" name="name" value={uname} onInput={(e)=>setUName(e.target.value)} disabled={!editMode} />
                    </div>
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Email: </div>
                        <input type="email" name="email" value={email} disabled={true} readOnly />
                    </div>
                    {editMode &&
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> password: </div>
                        <input type="password" name="password" value={password} onInput={(e)=>setPassword(e.target.value)} disabled={!editMode} />
                    </div>}
                    {editMode ?
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Interests: </div>
                        <input type="text" name="interests" value={interests} onInput={(e)=>setInterests(e.target.value)} disabled={!editMode} />
                    </div> :
                    <div className={Styles.detail}>
                        <div className={Styles.detailName}> Interests: </div>
                        <div className={Styles.interestsDetail}>
                        {
                           (typeof interests === 'string' ? interests.split(',') : interests).map((i,idx) => {
                                return(
                                    <div key={idx} className={Styles.interestsBox}>{i}</div>
                                )
                            })
                        }
                        </div>
                    </div>}
                </div>
                <div className={Styles.lineBreak}></div>
                <div className={Styles.settingsBtn}> Settings </div>
                { curUser && curUser !== '' && curUser === uname &&
                <div className={Styles.settingsBtn} style={{backgroundColor:"red",borderRadius:10, height: 50, cursor:"pointer"}}
                onClick={() => deleteAccount()}> Delete Account </div>}

            </div>
            {/* Right section */}
            <div className={Styles.rightContainer}>
                <div className={Styles.SectionHead}> {uname === curUser ? "Your Blogs" : uname + "'s Blogs"} </div>
                { authorBlogs.length < 1 ?
                    uname !== curUser ?
                    <div className={Styles.userBlogs}> {uname} has not created any blogs yet</div> :
                <div className={Styles.userBlogs}>
                    Start creating new blogs by from here.
                    <Link href="/publish" className={Styles.newBlog}> Create Blog</Link>
                </div> :
                <div className={Styles.userBlogs} style={{alignItems:'flex-start',justifyContent:'flex-start', gap:'10px'}}>
                    {authorBlogs.map((blog,index) => {
                        return(
                            <div key={index} className={Styles.userblog}>
                                <Link href={`/blog-view/${blog.id}`}> {blog.title} </Link>
                                {uname === curUser && <div className={Styles.deleteBlogBtn} onClick={()=>deleteBlogAction(blog.id)}> Delete </div>}
                            </div>
                        )
                    })}
                </div>
                }
                {uname === curUser && <div className={Styles.SectionHead}> Liked Blogs </div>}

                { uname === curUser && (likedBlogs.length < 1 ? 
                    <div className={Styles.likedBlogs}>
                    You have no liked blogs. Start Watching the latest blog from
                    <Link href="/feed" className={Styles.newBlog}> feed </Link> </div> :
                    <div className={Styles.userBlogs} style={{alignItems:'flex-start',justifyContent:'flex-start', gap:'10px'}}>
                        {likedBlogs.map((blog,index) => {
                            return(
                                <div key={index} className={Styles.userblog}>
                                    <Link href={`/blog-view/${blog.id}`}> {blog.title} </Link>
                                    {blog.author === curUser && <div className={Styles.deleteBlogBtn} onClick={()=>deleteBlogAction(blog.id)}> Delete </div>}
                                </div>
                            )
                        })}
                    </div>)
                }
            </div>
        </div>
        <Footer />
    </div>
  )
}
