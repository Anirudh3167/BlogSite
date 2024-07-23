// Shares option is doubtful

import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Styles from '@/styles/pages/blog-view.module.css'
import Navbar from '../../../components/navbar'
import Footer from '../../../components/footer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SlLike,SlDislike } from 'react-icons/sl'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineEye, AiOutlineLike } from 'react-icons/ai'
import { IsAuthenticated, deleteBlog, getBlog, getUser, updateBlogStats } from '@/apiFunctions'


function BlogView() {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const { id } = router.query;
    const [redirect, setRedirect] = useState(undefined);
    const [blogData,setBlogData] = useState({blog: {
            "title" : "Blog Not Found",
            "author":"Creator", time: Date().toString().slice(0,33),
            "tags":["Network Issues", "Unexpected Problems"], "content":"Blog Not Found",
            "stats":{ "likes" : 0, "dislikes" : 0, "views" : 0, "liked" : false, "disliked" : false},
        },
        "comments": []
    })
    const updateAction = async (action) => {
        if (action !== "likes" && action !== "dislikes") return ;

        console.log('ID sent for update: ', id);
        // Send a request to the backend to update along with the credentials.
        // const res = await axios.post( backend_url + '/update-blog-stats',{action,blog_id:id},{withCredentials: true}).then(r =>r.data);
        // console.log(res);
        if (!(await updateBlogStats({action,blog_id:id}).status)) return ; // Stop if backend is not updated
        // if (!res.status) {router.replace('/signin');    return ;}

        // Update blogData.stats.action += userStats.action ? -1 : 1
        let s = action === "likes" ? "liked" : "disliked"
        setBlogData(prevBlogData => ({
            ...prevBlogData,
            blog: {
              ...prevBlogData.blog,
              stats: {
                ...prevBlogData.blog.stats,
                [action]: prevBlogData.blog.stats[action] + (prevBlogData.blog.stats[s] ? -1 : 1),
                [s]: !prevBlogData.blog.stats[s],
              }
            }
          }));
    }
    useEffect(() => {
        const initialDelayTimer = setTimeout(() => {
            if (id === undefined && !redirect) {
                const redirectTimer = setTimeout(() => {setRedirect(true); router.push('/');}, 1000);
                return () => clearTimeout(redirectTimer);
            } else if (!redirect) setRedirect(false); 
        }, 50);
        return () => clearTimeout(initialDelayTimer);
    }, [id, router, redirect]);

    useEffect(() => {
        if (!id) return ;
        const loadBlog = async () => {
            // const res = await axios.get(backend_url + '/get-blog',{params:{'blog_id':id},withCredentials:true});
            const res = await getBlog(id);
            if (!res.status) {alert('Invalid Blog Id'); return ;}
            // const blogDataInit = res.blog;
            if (res.blog.tags) res.blog.tags = res.blog.tags.split('/');
            if (res.blog)   setBlogData({blog:res.blog,comments:blogData.comments});
        }
        if (redirect === false) loadBlog();
    },[redirect])
    const [writeComment,setWriteComment] = useState("")

    // Local functions.
    const handleCommentPost = (event) => {
        event.preventDefault();
        const comment = {
            "dateTime" : new Date(),
            "content" : writeComment,
            "Author" : uname,
            "comment_id" : "1",
            "stats" : {
                "like" : 30,
                "dislike" : 0,
                "view" : 100,
                "share" : 50,
                "liked" : false,
                "disliked" : false,
            }
        }
        console.log(comment);
        setBlogData((prevBlogData) => ({
          ...prevBlogData,
          comments: [comment,...prevBlogData.comments],
        }));
        setWriteComment("");
    }

    // Checking user Authentication.
    const [uname,setUname] = useState('');
    useEffect(() => {
        const userLoggedIn = async () => {
        //   const resp = await axios.get(backend_url + "/api/user",{withCredentials:true});
        const resp = await getUser();
          if (resp.status) setUname(resp.user.username);
        }
        userLoggedIn();
      },[]);

      const deleteBlogAction = async (blog_id) => {
        console.log("deleting blog: ", blog_id, "\nAt url: ", backend_url + '/delete-blog');
        // const res = await axios.post(backend_url + '/delete-blog',{blog_id},{withCredentials: true}).then((res)=>{return res.data});
        const res = await deleteBlog(blog_id);
        if (res.status) router.push('/feed');
      }
    return (
        redirect === true ? <h1> No blog Id. Redirecting to home page...</h1> :
        redirect === undefined ? <h1> Loading... </h1> :
        <div className={Styles.mainWrapper}>
            <Navbar uname={uname} />
            <div className={Styles.mainContainer}>
                {/* Edit and Delete  (Only Visible for author) */}
                {blogData.blog.author === uname &&
                <div className={Styles.BtnSection}>
                    <div className={Styles.EditBtn} onClick={() => {router.replace(`/blog-view/${id}/edit`)}}> Edit </div>
                    <div className={Styles.EditBtn} style={{backgroundColor:"red"}} onClick={() => {deleteBlogAction(id);}}> Delete </div>
                </div>
                }
                <div className={Styles.BlogTitle}> {blogData.blog.title} </div>
                <div className={Styles.BlogSubscript}> - by {blogData.blog.author}, {blogData.blog.time.slice(0,16)} </div>

                <div className={Styles.BlogTags}>
                    {
                        blogData.blog.tags.map((tag,index) => {
                            return(<div className={Styles.Tag} key={index}> {tag} </div>)
                        })
                    }
                </div>
                
                <div className={Styles.lineBreak}></div>

                <div className={Styles.BlogContent}>
                {blogData.blog.content.split('\n').map((line, idx) => {
                    return line === "" ? <br key={idx} /> : <p key={idx}> {line} </p>;
                })}
                </div>
                <div className={Styles.Stats}> 
                    <div className={Styles.Stats}> 
                        {/* Likes */}
                        <div className={Styles.statsItemContainer} onClick={()=>{updateAction("likes")}}>{blogData.blog.stats.liked ? <AiFillLike className={Styles.statsItemLogo} />  : <AiOutlineLike className={Styles.statsItemLogo} />}
                            <div className={Styles.statsItemCount}> {blogData.blog.stats.likes} </div>
                        </div>
                        {/* DisLikes */}
                        <div className={Styles.statsItemContainer} onClick={()=>{updateAction("dislikes")}}>{blogData.blog.stats.disliked ? <AiFillDislike className={Styles.statsItemLogo} />  : <AiOutlineDislike className={Styles.statsItemLogo} />}
                            <div className={Styles.statsItemCount}> {blogData.blog.stats.dislikes} </div>
                        </div>
                        {/* Views */}
                        <div className={Styles.statsItemContainer}><AiOutlineEye className={Styles.statsItemLogo} />
                            <div className={Styles.statsItemCount}> {blogData.blog.stats.views} </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.lineBreak}></div>

                <div className={Styles.CommentName}> Comments </div>
                {
                    uname !== '' ? 
                        <div className={Styles.commentInputContainer}>
                            <input type="text" className={Styles.commentInputBox} onChange={(e) => {setWriteComment(e.target.value)}} value={writeComment} placeholder='Write your comment' />
                            <button className={Styles.commentSendBtn} onClick={(e) => {handleCommentPost(e);}}> Post </button>
                        </div>
                        : ""
                }
                <div className={Styles.Comments}>
                    {blogData.comments.length === 0 ? (
                        <div className={Styles.Comment}>
                        {uname !== '' ? (
                            "Be the first one to comment."
                        ) : (
                            <div className={Styles.commentLoginContanier}>
                            <Link href="/sigin" className={Styles.commentLoginBtn}>
                                Login
                            </Link>{" "}
                            to comment.
                            </div>
                        )}
                        </div>
                    ) : (
                        <>
                        {blogData.comments.map((comment, index) => (
                            <div className={Styles.Comment} key={index}>
                               Message : {comment.content} <br /> 
                               From:{comment.Author} <br />
                               At : {comment.dateTime.toLocaleString()}
                            </div>
                        ))}
                        </>
                    )}
                </div>
                <div className={Styles.lineBreak}></div>
            </div>
            <Footer />
        </div>
    )
}

export default BlogView