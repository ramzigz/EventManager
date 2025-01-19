import { redirect } from 'next/navigation';

export default function Home() {
  // Redirects to /events
  redirect('/events');
  return null;  // This will never be rendered since it's a redirect
}