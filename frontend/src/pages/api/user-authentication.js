// Basic variables.
const Base_Url = "http://127.0.0.1:8000/api/";

//  For Registering New User.
export async function RegisterUser(username, email, password) {
    const params = {
        method : "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            username,
            email,
            password
        })
    }
    const data = await fetch(Base_Url + "register",params);

    return {
        props : { data }
    };
}

//  For getting the User logged In.
export async function LoginUser(email, password) {
    try {
        const data = await fetch(Base_Url + "login",{
            method : "POST",
            headers: {"Content-Type" : "application/json"},
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });
        return data;
    } catch(error) {
        alert(error);
    }
}

//  For getting the User details.
export async function UserDetails() {
    const params = {
        method : "GET",
        headers: {"Content-Type" : "application/json"},
        credentials: "include"
    }
    const data = await fetch(Base_Url + "user",params);
    const info = await data.json();

    return info;
}

//  For getting the user Logged Out.
export async function LogoutUser() {
    const params = {
        method : "GET",
        headers: {"Content-Type" : "application/json"},
        credentials: "include"
    }
    const data = await fetch(Base_Url + "logout",params);
    const info = await data.json();

    return info;
}