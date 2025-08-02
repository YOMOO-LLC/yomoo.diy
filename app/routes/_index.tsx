import { json, type MetaFunction, redirect } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'Bolt - AI Landing Page Generator' },
    { name: 'description', content: 'Create beautiful, professional landing pages with AI assistance' },
  ];
};

export const loader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get('mode');

  // If no mode is specified, redirect to landing-page mode by default
  if (!mode) {
    throw redirect('/?mode=landing-page');
  }

  return json({});
};

/**
 * Landing page component for Bolt
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
