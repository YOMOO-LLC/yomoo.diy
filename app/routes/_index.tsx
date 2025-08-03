import { json, type MetaFunction, redirect } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { OnboardingFlow } from '~/components/onboarding/OnboardingFlow';
import { useSearchParams } from '@remix-run/react';

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
 * Now supports multiple modes:
 * - onboarding: Guided onboarding flow
 * - landing-page: Standard landing page with chat
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 */
export default function Index() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  // Onboarding mode - full screen dedicated flow
  if (mode === 'onboarding') {
    return (
      <div className="min-h-screen bg-bolt-elements-background-depth-1">
        <ClientOnly fallback={<div>Loading onboarding...</div>}>{() => <OnboardingFlow />}</ClientOnly>
      </div>
    );
  }

  // Standard landing page mode
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
