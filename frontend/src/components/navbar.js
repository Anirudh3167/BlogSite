import React, { useEffect } from 'react'
import Link from 'next/link'
import Styles from '@/styles/components/navbar.module.css'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Navbar() {

  const [hamburgerActive, setHamburgerActive] = useState(false);
  const [Authenticated,setAuthenticated] = useState(false);
  const router = useRouter();

  const handleHamburger = () => {
    setHamburgerActive(!hamburgerActive);
  }

  const signOut = async () => {
    const resp = await axios.post("http://localhost:8000/api/logout",{},{withCredentials:true});

    if (resp.data.status) {
        router.push("/");
    }
  }

  useEffect(() => {
    const userLoggedIn = async () => {
      const resp = await axios.get("http://localhost:8000/api/user/isLogged",{withCredentials:true});

      if (resp.data.status) {setAuthenticated(true);}
    }
    userLoggedIn();
  })

  return (
    <div className={Styles.mainWrapper}>
        <div className={Styles.mainContainer}>
            <Link href="/"><div className={Styles.logoSpace}> Blog Space </div></Link>
            <div className={Styles.contentSpace}>
              {/* hamburger Menu */}
                <div className={`${Styles.hamburgerMenu} ${hamburgerActive ? Styles.active : ''}`} onClick={handleHamburger}>
                  <div className={`${Styles.hamburgerLine} + ${Styles.before}`}></div>
                  <div className={`${Styles.hamburgerLine} + ${Styles.middle}`}></div>
                  <div className={`${Styles.hamburgerLine} + ${Styles.after}`}></div>
                </div>

                <div className={Styles.contents}>
                    <Link href="/" className={Styles.contentItem}> Home </Link>
                    <div className={Styles.contentItem}> 
                      <div className={Styles.subContentName}> Blogs </div>
                      <div className={Styles.subContentItem}>
                        <Link href="/publish" className={Styles.contentItem}> Create Blog </Link>
                        <Link href="/my-blogs" className={Styles.contentItem}> My Blogs </Link> 
                      </div>  
                    </div>
                    <Link href="/feed" className={Styles.contentItem}> Feed </Link>
                    { Authenticated ? (
                          <>
                          <Link href="/profile" className={Styles.contentItem}> Profile </Link>
                          <div className={Styles.contentItem}>
                            <div onClick={() => {signOut();}} className={Styles.signOut}> Sign Out </div>
                          </div>
                          </>
                      )  : (
                        <div className={Styles.contentItem}>
                          <Link href="/signin" className={Styles.signOut}> Sign In </Link>
                        </div>
                      )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
