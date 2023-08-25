import React from 'react'
import Styles from '@/styles/pages/feed.module.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Feed() {
  return (
    <div className={Styles.mainWrapper}>
        <Navbar />
        <div className={Styles.mainContainer}>

            <div className={Styles.blogContainer}>
                <div className={Styles.blogTitle}>
                    How to create a Blog?
                </div>
                <div className={Styles.blogDetails}>
                    <div className={Styles.blogStats}>
                        Likes 0 | Comments 0 | Shares 0
                    </div>
                    <div className={Styles.blogAuthor}>
                        - by Anirudh | 05:30 PM 15th,April,2023
                    </div>
                </div>
            </div>
            <div className={Styles.blogContainer}>
                <div className={Styles.blogTitle}>
                    How to create a Blog?
                </div>
                <div className={Styles.blogDetails}>
                    <div className={Styles.blogStats}>
                        Likes 0 | Comments 0 | Shares 0
                    </div>
                    <div className={Styles.blogAuthor}>
                        - by Anirudh | 05:30 PM 15th,April,2023
                    </div>
                </div>
            </div>
            <div className={Styles.blogContainer}>
                <div className={Styles.blogTitle}>
                    How to create a Blog?
                </div>
                <div className={Styles.blogDetails}>
                    <div className={Styles.blogStats}>
                        Likes 0 | Comments 0 | Shares 0
                    </div>
                    <div className={Styles.blogAuthor}>
                        - by Anirudh | 05:30 PM 15th,April,2023
                    </div>
                </div>
            </div>
            <div className={Styles.blogContainer}>
                <div className={Styles.blogTitle}>
                    How to create a Blog?
                </div>
                <div className={Styles.blogDetails}>
                    <div className={Styles.blogStats}>
                        Likes 0 | Comments 0 | Shares 0
                    </div>
                    <div className={Styles.blogAuthor}>
                        - by Anirudh | 05:30 PM 15th,April,2023
                    </div>
                </div>
            </div>

        </div>
        <Footer />
    </div>
  )
}
