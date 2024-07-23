"use client";
import React, { useState } from 'react'
import Styles from '@/styles/pages/signup.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router';
import Head from 'next/head';
import { login } from '@/apiFunctions';

export default function SignIn() {
    const [username,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const router = useRouter();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const submit = async (e) => {
        e.preventDefault();
        // const response = await axios.post(backend_url + "/api/login",post_data,{withCredentials:true,headers:{"Content-Type":"application/json"}})

        const data = await login({username,password});
        if (!data.status) {router.reload();}
        else {
            // const cookies = response.headers;
            // console.log(cookies);
            console.log(data);
            router.push(`/profile/${username}`);
        }
    }
    
  return (
    <div className={Styles.mainWrapper}>
    <Head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    </Head>
        <div className={Styles.mainContainer}>

            <form className={Styles.loginBox} onSubmit={submit}>
                    <input type="text" name="username" className={Styles.inputBox} placeholder='username' 
                     onChange={(e) => {setUserName(e.target.value)}}/>               
                    <input type="password" name='passcode' className={Styles.inputBox} placeholder='Password' 
                     onChange={(e) => {setPassword(e.target.value)}}/>

                <div className={Styles.signInOption}> 
                    New user? &nbsp;
                    <Link href="/signup" style={{color:"blue",textDecoration:"underline"}}>Signup</Link>
                    </div>
                <button className={Styles.signUpButton} type='submit'> Sign In </button>

                <div className={Styles.oauthText}>
                    &nbsp; &nbsp; &nbsp; -- or -- <br />
                    continue with
                </div>
                <div className={Styles.oauthIcons}>
                    <div className='fa fa-google' style={{fontSize:'28px'}}></div>
                    <div className='fa fa-github' style={{fontSize:'28px'}}></div>
                    <div className='fa fa-linkedin' style={{fontSize:'28px'}}></div>
                </div>

            </form>
        </div>
    </div>
  )
}
