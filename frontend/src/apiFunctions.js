import axios from "axios";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

/*
User Related APIs
*/
export async function createUser (payload) {
    if (!payload) return ;
    return await axios.post(backend_url + "/api/register",payload,{withCredentials:true}).then(r=>r.data);
}

export async function IsAuthenticated () {
    return await axios.get( backend_url + '/api/user/isLogged',{withCredentials:true}).then(r=>r.data);
}

export async function getUser (username = null) {
    return await axios.get(backend_url + '/api/user',{
        withCredentials:true, params: username ? {username} : {}
    }).then((r)=>r.data);
}

export async function updateUserFollows (username) {
    if (!username) return ;
    return await axios.post(backend_url + '/api/user/follow',{username},{withCredentials:true}).then(r=>r.data);
}

/*
Blog Related APIs
*/
export async function updateBlogStats (payload) {
    if (!payload) return ;
    return await axios.post( backend_url + '/update-blog-stats',payload,{withCredentials: true}).then(r =>r.data);
}

export async function getBlog (id) {
    if (!id) return ;
    return await axios.get(backend_url + '/get-blog',{params:{'blog_id':id},withCredentials:true}).then(r=>r.data);
}

export async function createBlog (payload) {
    if (!payload) return ;
    return await axios.post(backend_url + "/create-blog",payload,{withCredentials:true}).then(r=>r.data);
}

export async function deleteBlog (id) {
    if (!id) return ;
    return await axios.post(backend_url + '/delete-blog',{'blog_id':id},{withCredentials: true}).then(r=>r.data);
}

export async function editBlog (payload) {
    if (!payload) return ;
    return await axios.post(backend_url + "/update-blog",payload,{withCredentials:true}).then(r=>r.data);
}

/*
Common / Other APIs
*/
export async function login (payload) {
    if (!payload) return ;
    return await axios.post(backend_url + "/api/login",payload,{withCredentials:true,
        headers:{"Content-Type":"application/json"}}).then(r=>r.data);
}

export async function logout () {
    return await axios.post(backend_url + "/api/logout",{},{withCredentials:true}).then(r=>r.data);
}

export async function getFeed () {
    return await axios.get(backend_url + '/get-feed',{withCredentials: true}).then(r=>r.data);
}

export async function getUserBlogs (username) { // Blogs created by a user
    if (!username) return ;
    return await axios.get(backend_url + '/user-blogs',{params:{username}, withCredentials: true}).then(r=>r.data);
}