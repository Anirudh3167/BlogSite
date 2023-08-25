import React from 'react'
import Link from 'next/link'
import Styles from '@/styles/components/footer.module.css'

export default function Footer() {
  return (
    <div className={Styles.mainWrapper}>
      <div className={Styles.mainContainer}>

        <div className={Styles.mainContents}>
          <div className={Styles.leftContents}>
            {/* Logo tag */}
            <Link className={Styles.logoSpace} href="http://127.0.0.1:3000"> Blog Space </Link>
            <div className={Styles.desc}>
              This website is made just to under stand the basic concepts of blogs and blogging.
              You can post your blogs here and can expect comments for your blogs.
              Also, if someone likes your post they can also like it.
            </div>
          </div>
          {/* Links section */}
          <div className={Styles.rightContents}> 
            <div className={Styles.linksContainer}>
              <div className={Styles.linksHead}> Quick Links </div>  
              <Link href="#" className={Styles.links}> Home </Link>
              <Link href="#" className={Styles.links}> Profile </Link>
              <Link href="#" className={Styles.links}> Settings </Link>
              <Link href="#" className={Styles.links}> Feed </Link>
            </div> 
            <div className={Styles.linksContainer}>
              <div className={Styles.linksHead}> Community Links </div>  
              <Link href="#" className={Styles.links}> Contribution </Link>
              <Link href="#" className={Styles.links}> Members </Link>
              <Link href="#" className={Styles.links}> Donation </Link>
              <Link href="#" className={Styles.links}> About </Link>
            </div> 
            <div className={Styles.linksContainer}>
              <div className={Styles.linksHead}> Conact Links </div>  
              <Link href="#" className={Styles.links}> Contact 1 </Link>
              <Link href="#" className={Styles.links}> Contact 2 </Link>
              <Link href="#" className={Styles.links}> Contact 3 </Link>
              <Link href="#" className={Styles.links}> Contact 4 </Link>
            </div> 
          </div>
        </div>

    {/* Copy Right tag */}

        <div className={Styles.copyrightContents}>
            &copy; all rights are reserved to the creator from 2022.
        </div>

      </div>
    </div>
  )
}
