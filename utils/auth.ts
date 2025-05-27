'use client'
// utils/auth.ts
export const checkAuth = () => {
    //Check for a token in localStorage
    const token = localStorage.getItem('gymAuthToken');
    return !!token; // Return true if token exists, false otherwise
  };