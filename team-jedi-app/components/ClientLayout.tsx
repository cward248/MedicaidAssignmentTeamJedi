"use client";

import { usePathname } from 'next/navigation';
import TextHelp from './TextHelp';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  
  // Don't show help on politician or verify pages
  const showHelp = !pathname?.includes('/politician-view') && !pathname?.includes('/verify');
  
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({ email: user.email, id: user.id });
      }
    };
    getUserData();
  }, []);

  return (
    <>
      {children}
      {showHelp && <TextHelp userData={userData} />}
    </>
  );
} // Author: Calis W