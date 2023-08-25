import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Styles from '@/styles/pages/blog-view.module.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Link from 'next/link'

function BlogView() {
    const [writeComment,setWriteComment] = useState("")
    const [userDetails,setUserDetails] = useState([])
    const [blogData,setBlogData] = useState({
        "title" : "How to Create a Blog ?",
        "author" : "Master",
        "dateTime" : "20:30 19th,April,2023",
        "tags" : ["Create Blog","Blog","Blog Space","Blogger","Blogging Mistakes"],
        "content" : `
        Blog creation in this website is very easy. But sorry this website is currently under maintanence.
        After the completion of this website you can also use markdown in the blogs and also some images
        in the dimension and the way you like it to display.

        This also allows you to embedd your website so that you can give the exapmles so easily.

        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde consectetur laudantium debitis explicabo 
        ipsum excepturi iste corrupti dolore ullam sit et accusantium quidem culpa, delectus, earum reiciendis. 
        Molestias minima alias quisquam voluptatem iusto inventore, beatae nulla dicta, eveniet facilis harum! 
        Quasi aperiam doloremque voluptate facere. Qui pariatur repudiandae quia cupiditate voluptate, deleniti 
        officiis eligendi quibusdam ratione temporibus vitae odio excepturi aperiam sapiente nostrum consequatur 
        perspiciatis eveniet debitis delectus aliquid hic error eaque ad nesciunt? Nisi, harum eveniet? A delectus 
        facilis dolore quibusdam voluptates officia distinctio sequi voluptas nesciunt aliquid similique, ipsa quasi 
        maxime optio quidem, beatae sit tempore! Natus temporibus odit, suscipit reiciendis ratione iste unde neque, 
        repellendus deleniti dolores iusto dolorum sed quo ea quibusdam magnam, ad id amet error hic quod!`,
        "stats" : {
            "like" : 30,
            "dislike" : 0,
            "view" : 100,
            "share" : 50
        },
        "comments": []
    })

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
        <div className={Styles.mainWrapper}>
            <Navbar />
            <div className={Styles.mainContainer}>
                <div className={Styles.BlogTitle}> {blogData.title} </div>
                <div className={Styles.BlogSubscript}> - by {blogData.author}, {blogData.dateTime} </div>

                <div className={Styles.BlogTags}>
                    {
                        blogData.tags.map((tag,index) => {
                            <div className={Styles.Tag} key={index}> {tag} </div>
                        })
                    }
                </div>
                
                <div className={Styles.lineBreak}></div>

                <div className={Styles.BlogContent}>
                {blogData.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                </div>
                <div className={Styles.Stats}> Likes {blogData.stats.like} | Dislikes {blogData.stats.dislike} | views {blogData.stats.view} | shares {blogData.stats.share}</div>

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