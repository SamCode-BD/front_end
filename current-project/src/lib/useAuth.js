"use client"
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

export default function useAuth(redirectTo = '/login') {
  let user;
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  //console.log("token: " + String(token))

  try {
    const decoded = jwtDecode(token);
    //console.log("decoded: " + decoded)
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.removeItem('token');
    } else {
      //console.log("user = decoded");
      user = decoded; // user info from token
      //console.log(user)
    }
  } catch (err) {
    localStorage.removeItem('token');
  };

return user;
}
