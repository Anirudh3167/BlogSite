import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Styles from '@/styles/pages/blog-view.module.css'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import Link from 'next/link'
import { useRouter } from 'next/router'

function BlogView() {
    const router = useRouter();
    const { id } = router.query;
    const [redirect, setRedirect] = useState(undefined);
    const [blogData,setBlogData] = useState({blog: {
            "title" : "",
            "author":"", time: "",
            "tags":["some", "initial"], "content":"",
            "stats":{}
        },
        "comments": []
    })

    useEffect(() => {
        const getBlog = async () => {
            const res = await axios.get('http://localhost:8000/get-blog',{params:{'blog_id':id[0]}});
            const blogDataInit = await res.data.blog;
            blogDataInit.tags = blogDataInit.tags.split('/');
            console.log(blogDataInit.tags.length, blogDataInit.tags);
            setBlogData({blog:blogDataInit,comments:blogData.comments});
        }
        const initialDelayTimer = setTimeout(() => {
            if (id === undefined && !redirect) {
                const redirectTimer = setTimeout(() => {setRedirect(true); router.push('/');}, 1000);
                return () => clearTimeout(redirectTimer);
            } else if (!redirect) {
                setRedirect(false); 
            }
        }, 50);
        return () => clearTimeout(initialDelayTimer);
    }, [id, router, redirect]);

    useEffect(() => {
        const getBlog = async () => {
            const res = await axios.get('http://localhost:8000/get-blog',{params:{'blog_id':id[0]}});
            const blogDataInit = await res.data.blog;
            if (blogDataInit.tags.split('/').length > 1) blogDataInit.tags = blogDataInit.tags.split('/');
            else blogDataInit.tags = [blogDataInit.tags];
            console.log(blogDataInit.tags.length, blogDataInit.tags);
            setBlogData({blog:blogDataInit,comments:blogData.comments});
        }
        if (redirect === false) getBlog();
    },[redirect])
    const [writeComment,setWriteComment] = useState("")
    const [userDetails,setUserDetails] = useState([])

    // Local functions.
    const handleCommentPost = (event) => {
        event.preventDefault();
        const comment = {
            "dateTime" : new Date(),
            "content" : writeComment,
            "Author" : userDetails.username,
            "comment_id" : "1",
            "stats" : {
                "like" : 30,
                "dislike" : 0,
                "view" : 100,
                "share" : 50
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
    const [authenticated,setAuthenticated] = useState(false);
    useEffect(() => {
        const getUser = async () => {
            const resp = await axios.get("http://localhost:8000/api/user",{withCredentials:true});
            setUserDetails(resp.data);
        }
        const userLoggedIn = async () => {
          const resp = await axios.get("http://localhost:8000/api/user/isLogged",{withCredentials:true});
    
          if (resp.data.status) {
            setAuthenticated(true);
            getUser();
        }
        }
        userLoggedIn();
      },[])
    return (
        redirect === true ? <h1> No blog Id. Redirecting to home page...</h1> :
        redirect === undefined ? <h1> Loading... </h1> :
        <div className={Styles.mainWrapper}>
            <Navbar />
            <div className={Styles.mainContainer}>
                <div className={Styles.BlogTitle}> {blogData.blog.title} </div>
                <div className={Styles.BlogSubscript}> - by {blogData.blog.author}, {blogData.blog.time} </div>

                <div className={Styles.BlogTags}>
                    {
                        blogData.blog.tags.map((tag,index) => {
                            return(<div className={Styles.Tag} key={index}> {tag} </div>)
                        })
                    }
                </div>
                
                <div className={Styles.lineBreak}></div>

                <div className={Styles.BlogContent}>
                {blogData.blog.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                </div>
                <div className={Styles.Stats}> Likes {blogData.blog.stats.likes} | Dislikes {blogData.blog.stats.dislikes} | views {blogData.blog.stats.views}
                {/*  | shares {blogData.stats.share} */}
                </div>

                <div className={Styles.lineBreak}></div>

                <div className={Styles.CommentName}> Comments </div>
                {
                    authenticated ? 
                        <div className={Styles.commentInputContainer}>
                            <input type="text" className={Styles.commentInputBox} onChange={(e) => {setWriteComment(e.target.value)}} value={writeComment} placeholder='Write your comment' />
                            <button className={Styles.commentSendBtn} onClick={(e) => {handleCommentPost(e);}}> Post </button>
                        </div>
                        : ""
                }
                <div className={Styles.Comments}>
                    {blogData.comments.length === 0 ? (
                        <div className={Styles.Comment}>
                        {authenticated ? (
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