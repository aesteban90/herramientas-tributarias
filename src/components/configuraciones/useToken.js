import { useState } from 'react';

export default function useToken() {  

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);    
    return userToken?.token
  };
  
  const getTheme = () => {
    const jsonString = localStorage.getItem('theme');
    const theme = JSON.parse(jsonString);    
    return theme?.theme
  };

  const saveTheme = theme => {
    localStorage.setItem('theme', JSON.stringify(theme));
    setTheme(theme.token);
  };  

  const getUsername = () => {
    const tokenString = localStorage.getItem('token');
    const userName = JSON.parse(tokenString);        
    return userName?.username
  };

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const [token, setToken] = useState(getToken());
  const [theme, setTheme] = useState(getTheme());

  return {
    setToken: saveToken, token, getUsername, theme, setTheme: saveTheme
  }

  
}

