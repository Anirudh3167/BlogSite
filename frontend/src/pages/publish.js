import React, { useEffect, useState } from 'react'
import Styles from '@/styles/pages/publish.module.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import axios from 'axios'

export default function Publish() {
    const [title,setTitle] = useState("");
    const [tags,setTags] = useState([]);
    const [content,setContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            title, tags, content,time : new Date()
        }
        console.log(data);
        const resp = await axios.post("http://localhost:8000/create-blog",data,{withCredentials:true});
        console.log(resp);
    }
  return (
    <div className={Styles.mainWrapper}>
        <Navbar />
        <div className={Styles.mainContainer}>
            <div className={Styles.formContainer}>

                <div className={Styles.contents} style={{flexDirection:"row",color:"white",alignItems:"flex-start",justifyContent:"flex-start",marginTop:"30px;"}}> Date : 12th, April, 2023 05:30 PM</div>
                <div className={Styles.contents}>
                    <div className={Styles.label}> Title:</div>
                    <input type="text" name="title"
                    onChange={(event) => {setTitle(event.target.value);}}
                    placeholder='title for this blog...' />
                </div>
                <div className={Styles.contents}>
                    <div className={Styles.label}> Tags:</div>
                    <input type="text" name="tags"
                    onChange={(event) => {setTags(event.target.value.split("/"));}}
                     placeholder='Use / to seperate tags' />
                </div>
                <div className={Styles.contents}>
                    <div className={Styles.label}> Content:</div>
                    <textarea name="content" id="content"  
                    className={Styles.previewbox} style={{display:"flex"}} 
                    onChange={(event) => {setContent(event.target.value);}} 
                    placeholder='Write you blog here' />
                </div>

                <div className={Styles.btns}>
                    <button type='submit' onClick={(e) => {handleSubmit(e)}} className={Styles.submitBtn} style={{backgroundColor:"rgb(20,170,20)"}}> Submit </button>
                    <button type='submit' className={Styles.submitBtn} style={{backgroundColor:"rgb(210,210,210)"}}> Cancel </button>
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