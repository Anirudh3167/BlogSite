import React from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function testing() {
  return (
    <div>
        <Navbar />
        
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"300px"}}>Middle page</div>

        <img src="https://media.istockphoto.com/id/1209030907/vector/abstract-triangular-background.jpg?s=612x612&w=0&k=20&c=WL6sXFy_wr1z7Yk_lPbJ2Zhd2EjoM1eomgCN8C05Q6U=" width="100%" height="100%" alt="NO Image" />
        <Footer />
    </div>
  )
}
