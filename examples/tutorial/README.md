Execute all commands from the root folder of this repository.

Start with

    git clone <this repo url>
    cd spotify-web-api-node
    npm install
    npm install express
    node examples/tutorial/00-get-access-token.js "<Client ID>" "<Client Secret>"

and visit <http://localhost:8888/login> in your browser to get an `access_token`.  
If you don't have a `client_id` and `client_secret` yet, create an application here: <https://developer.spotify.com/my-applications> to get them. Make sure you whitelist the correct redirectUri when creating your application, which is `http://localhost:8888/callback`.

After you got the `access_token`, call all other examples with this token in ENV variable `SPOTIFY_ACCESS_TOKEN`. The easiest way is to call:

    export SPOTIFY_ACCESS_TOKEN="<Token content here>"
    node examples/tutorial/01-basics/01-get-info-about-current-user.js
