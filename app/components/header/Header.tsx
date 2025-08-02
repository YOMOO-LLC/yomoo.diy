import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { useSearchParams } from '@remix-run/react';

export function Header() {
  const chat = useStore(chatStore);
  const [searchParams, setSearchParams] = useSearchParams();
  const isLandingPageMode = searchParams.get('mode') === 'landing-page';

  const handleLandingPageMode = () => {
    setSearchParams({ mode: 'landing-page' });
  };

  const handleNormalMode = () => {
    setSearchParams({});
  };

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          {/* <span className="i-bolt:logo-text?mask w-[46px] inline-block" /> */}
          <img src="/logo-light-styled.png" alt="logo" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="logo" className="w-[90px] inline-block hidden dark:block" />
        </a>
      </div>

      {/* Landing Page Mode Toggle - Show when chat hasn't started */}
      {!chat.started && (
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2 bg-bolt-elements-background-depth-2 rounded-lg p-1">
            <button
              onClick={handleNormalMode}
              className={classNames('px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200', {
                'bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary shadow-sm': !isLandingPageMode,
                'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary': isLandingPageMode,
              })}
            >
              💻 开发模式
            </button>
            <button
              onClick={handleLandingPageMode}
              className={classNames(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2',
                {
                  'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg': isLandingPageMode,
                  'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-1':
                    !isLandingPageMode,
                },
              )}
            >
              <span className="text-lg">🚀</span>
              Landing Page
            </button>
          </div>
        </div>
      )}

      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
