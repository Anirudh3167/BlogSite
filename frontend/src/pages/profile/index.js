import { getUser } from "@/apiFunctions";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Profile() {
    const router = useRouter();
    useEffect(()=>{
        const redirectUser = async () => {
            // const res = await axios.get(backend_url + '/api/user',{withCredentials:true, params: {username}}).then((r)=>r.data);
            const res = await getUser();
            if (res.status && res.user) router.push(`/profile/${res.user.username}`);
            else    router.push('/');
        }
        redirectUser();
    },[]);
    return (
        <div style={{display:"flex", alignItems:"center", justifyContent:"center",width:"100%",height:"100%",backgroundColor:"black"}}>
            <Navbar />
            <h1>Loading....</h1>
        </div>
    )
}