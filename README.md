## vue-auth-laravel
package for authentication  user in client-side by using cookies and vuex.
as we know  we just load page once in SPA because of that i write a small package for authentications user there.

## How it is work?
when user refresh page we call function checkToken which will send a request get to server in a specific url.
which must impelement in back-end side and  must return current authenticate user in json fromat with an access token.
 
i will take this token  and put it inside axios headers to make a whole requests to be auth.

## Installation
  `npm install @hazemha/vue-auth-laravel`


## Usage
use checkToken in main compoent

url: it's endpoint in server-side which will handle the requests.

## To avoid problem use the same format in server-side

 1- checkToken
 
    public function checkMyLogin()
    {
        if (\Auth::guard('api')->check()) {
            return response()->json(['auth' => true, 'user' => \Auth::guard('api')->user()], 200);
        }

        return response()->json(['auth' => false], 200);
    }
    
2- login
```
   public function Login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (\Auth::attempt($credentials)) {
            \Auth::user()->access_token = \Auth::user()->createToken('Token Name')->accessToken;
            $result = \Auth::user()->save();
            return response()->json(['user' => \Auth::user(), 'auth' => $result], 200);
        }
        return response()->json(['message' => 'please check form your credentials'], 401);
    }
```
3- logout
```
     public function Logout()
    {
        \Auth::user()->access_token = null;
        $result = \Auth::user()->save();
        return response()->json(['message' => $result], 200);
    }
```
   
    




## API
1- checkToken <br>
    this.$authLaravel.login('url')  <br>
    return the response from the server to you and check if the user login before to avoid login again <br>
2- login  <br>
          data = url and post data  <br>
          for example data ={url:'api\login',user:'username',password:'123123'}  <br>
      this.$authLaravel.login(data)   <br> 
      return the response from the server to you  <br>
  <br>
3- logout  <br>
      this.$authLaravel.login('url')   <br>
      return the response from the server to you  <br>



4- isAuth  <br>
      this.$authLaravel.isAuth()   <br>
      return is current user is login before or not and is Auth <br>
