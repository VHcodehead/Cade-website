import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from './session';
import { SESSION_COOKIE_NAME } from './session';

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(cookie);
  if (!session?.userId) {
    redirect('/admin/login');
  }
  return { isAuth: true as const, userId: session.userId };
});
