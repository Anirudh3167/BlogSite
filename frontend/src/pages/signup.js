import React, { useState } from 'react'
import Styles from '@/styles/pages/signup.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { LoginUser } from './api/user-authentication';
import Head from 'next/head';
import axios from 'axios';
import { createUser } from '@/apiFunctions';

export default function SignUp() {
    // Variables
    const [username,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const router = useRouter();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const submit = async (e) => {
        e.preventDefault();
        // const res = await axios.post(backend_url + "/api/register",{username,email,password},{withCredentials:true}).then(r=>r.data);
        if ((await createUser({username,email,password})).status) router.push(`/profile/${username}`);
    }
    // Page code.
  return (
    <div className={Styles.mainWrapper}>
        <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        </Head>
        <div className={Styles.mainContainer}>

            <form className={Styles.loginBox} onSubmit={submit}>
                    <input type="text" name="username" className={Styles.inputBox} placeholder='username'
                     onChange={e => {setUserName(e.target.value)}} />                
                    <input type="email" name='email' className={Styles.inputBox} placeholder='email' 
                     onChange={e => {setEmail(e.target.value)}} />                
                    <input type="password" name='passcode' className={Styles.inputBox} placeholder='Password' 
                     onChange={e => {setPassword(e.target.value)}} />

                <div className={Styles.signInOption}> 
                    Already have an account? &nbsp;
                    <Link href="/signin" style={{color:"blue",textDecoration:"underline"}}>Signin</Link>
                    </div>
                <button type='submit' className={Styles.signUpButton}> Sign Up </button>

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
