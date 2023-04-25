// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { redirect } from '@sveltejs/kit';
export const prerender = true;

export const load = async ({ parent }) => {
  const { session, ...rest } = await parent();
  
  if (session) {
    throw redirect(303, '/story-list');
  }

  return {};
};