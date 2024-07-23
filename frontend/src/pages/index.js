import React, { useEffect, useState } from 'react'
import Styles from '@/styles/pages/Home.module.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { getUser } from '@/apiFunctions'

export default function Home() {
  const [uname, setUName] = useState('');
  useEffect(()=>{

    const loadUser = async () => {
      const res = await getUser();
      if (res.status) setUName(res.user.username);
    }
    loadUser();
  },[]);
  return (
    <div className={Styles.mainWrapper}>
        <Navbar uname={uname} />
        <div className={Styles.mainContainer}>
            <div className={Styles.pageOne}>
                <div className={Styles.pageHead}>Welcome to BlogSite</div>
                <div className={Styles.pageContent} style={{flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start', gap:'10px'}}> 
                    An Open Space for,
                    Knowledge Sharing, Assistance, Blogging and much more.
                    Why don't you try it by <Link href='/signup' style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'10px',borderRadius:'10px',border:'2px solid white'}}> Getting Started</Link>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}
