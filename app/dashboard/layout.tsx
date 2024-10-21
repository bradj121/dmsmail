'use client';

import SideNav from '@/app/ui/dashboard/sidenav';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState();
  const router = useRouter();

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const response = await fetch(`${URL}/auth/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    if (response.ok) {
      const json = await response.json();
      setProfile(json);
    } else {
      console.log(response);
      router.push("/login");
    }
  }
  
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-gray-400">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}