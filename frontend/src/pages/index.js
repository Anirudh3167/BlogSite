import React from 'react'
import Styles from '@/styles/pages/Home.module.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className={Styles.mainWrapper}>
        <Navbar />
        <div className={Styles.mainContainer}>
            <div className={Styles.pageOne}>
                <div className={Styles.pageHead}>A Blogging Website</div>
                <div className={Styles.pageContent}> 
                    Lorem ipsum dolor sit amet consectetur, 
                    adipisicing elit. Explicabo nemo sint temporibus sed doloremque accusantium nihil 
                    voluptas molestiae laudantium maiores.
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}
