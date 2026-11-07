const form = document.getElementById('search-form') ;
const usernameInput = document.getElementById('username') ;
const profile = document.getElementById('profile') ;
const message = document.getElementById('message') ;

// form submission 

form.addEventListener( 'submit' , (e)=> {
    e.preventDefault() ;

    const username = usernameInput.value.trim() ;

    // validation 

    if( username === ""){
        message.textContent = "Please enter a valid username !" ;
        profile.innerHTML = "" ;
        return ;
    }

    if (!/^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {

        message.textContent = "Please enter a valid GitHub username.";

        profile.innerHTML = "";

        return;
    }

    getUser(username) ;
})

// Fetch Github user information

async function getUser(username){
    const API_URL = `https://api.github.com/users/${encodeURIComponent(username)}`

    message.textContent = "Loading..." ;
    profile.innerHTML = "" ;

    try{

        const response = await fetch(API_URL) ;

        // check for errors

        if( response.status === 404 ){
            throw new Error("Github user not found!") ;
        }

        if( response.status === 403 ){
            throw new Error("API rate limit exceeded .Try again later!") ;
        }

        if( !response.ok ){
            throw new Error("Something went wrong. Please try again.")
        }

        const data = await response.json() ;

        message.textContent = "";
        displayProfile(data);
    }

    catch(error){
        message.textContent = error.message;
        profile.innerHTML = "" ;
    }
}

// Display profile inforamtion

function displayProfile(user){
          
    profile.innerHTML = `
            <div class="profile-card">

            <img src="${user.avatar_url}" class="avatar" alt="Profile picture">

            <h2>${user.name || user.login}</h2>

            <p>@${user.login}</p>

            <p>${user.bio || "No bio available."}</p>

            <p>${user.location || "Location not available"}</p>

            <div class="stats">

                <div>
                    <strong>${user.public_repos}</strong>
                    <span>Repositories</span>
                </div>

                <div>
                    <strong>${user.followers}</strong>
                    <span>Followers</span>
                </div>

                <div>
                    <strong>${user.following}</strong>
                    <span>Following</span>
                </div>

            </div>

            <br>

            <a href="${user.html_url}" target="_blank" rel="noopener noreferrer">

                Visit GitHub Profile

            </a>

        </div>
     `;
}