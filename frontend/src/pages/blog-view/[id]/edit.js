import React, { useEffect, useState } from 'react'
import Styles from '@/styles/pages/publish.module.css'
import Navbar from '../../../components/navbar'
import Footer from '../../../components/footer'
import axios from 'axios'
import { useRouter } from 'next/router'
import { editBlog, getBlog, getUser } from '@/apiFunctions'

export default function Publish() {
    const [title,setTitle] = useState("");
    const [tags,setTags] = useState("");
    const [content,setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [uname, setUname] = useState('');
    const { id } = router.query;
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const isAuthenticated = async () => {
        if (uname !== '') return true;
        // const res = await axios.get(`${backend_url}/api/user`, { withCredentials: true }).then(r=>r.data);
        const res = await getUser();
        setUname(res.user.username);
        return res.status;
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            title, tags, content,time : Date().toString().slice(0,33), blog_id: id,
        }
        console.log(data);
        // const resp = await axios.post(backend_url + "/update-blog",data,{withCredentials:true});
        const resp = await editBlog(data);
        console.log(resp);

        router.push(`/blog-view/${id}`)
    }
    
    useEffect(() => {
           const fetchData = async () => {
            if (uname === '' && !await isAuthenticated()) router.push('/signin');
            setLoading(false);

            if (!id || uname === '') return ;
        
            let b = await getBlog(id);
            console.log(b.blog.author, uname, b.blog.author === uname);

            if (!b || !b.status || (b.blog.author !== uname)) router.replace(`/blog-view/${id}`);
            setTitle(b.title);  setContent(b.blog.content);  setTags(b.blog.tags); }
            fetchData();
      }, [id,uname]);
  return (
    loading ? <h1> Loading... </h1> :
    <div className={Styles.mainWrapper}>
        <Navbar uname={uname} />
        <div className={Styles.mainContainer}>
            <div className={Styles.formContainer}>

                <div className={Styles.contents} style={{flexDirection:"row",color:"white",alignItems:"flex-start",justifyContent:"flex-start",marginTop:"30px"}}> Date : 12th, April, 2023 05:30 PM</div>
                <div className={Styles.contents}>
                    <div className={Styles.label}> Title:</div>
                    <input type="text" name="title" defaultValue={title}
                    onChange={(event) => {setTitle(event.target.value);}}
                    placeholder='title for this blog...' />
                </div>
                <div className={Styles.contents}>
                    <div className={Styles.label}> Tags:</div>
                    <input type="text" name="tags" defaultValue={tags}
                    onChange={(event) => {setTags(event.target.value);}}
                     placeholder='Use / to seperate tags' />
                </div>
                <div className={Styles.contents}>
                    <div className={Styles.label}> Content:</div>
                    <textarea name="content" id="content"   defaultValue={content}
                    className={Styles.previewbox} style={{display:"flex"}} 
                    onChange={(event) => {setContent(event.target.value);}} 
                    placeholder='Write you blog here' />
                </div>

                <div className={Styles.btns}>
                    <button type='submit' onClick={(e) => {handleSubmit(e)}} className={Styles.submitBtn} style={{backgroundColor:"rgb(20,170,20)"}}> Submit </button>
                    <button type='submit' onClick={() => {router.push(`/blog-view/${id}`)}} className={Styles.submitBtn} style={{backgroundColor:"rgb(210,210,210)"}}> Cancel </button>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

/* The data that will be sent from this form:-
1. Author  (From backend)
2. Date    (From backend)
3. Title   (From form)
4. Tags    (From form)
5. Content (From form)
*/