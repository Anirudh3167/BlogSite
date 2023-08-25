import React, { useState } from 'react'
import Styles from '@/styles/pages/signup.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { LoginUser } from './api/user-authentication';
import Head from 'next/head';

export default function SignUp() {
    // Variables
    const [username,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();

        await fetch("http://127.0.0.1:8000/api/register/",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:  JSON.stringify({
                "username":username, 
                "email":email, 
                "password":password
            }),
        });
        await router.push('/profile');
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
