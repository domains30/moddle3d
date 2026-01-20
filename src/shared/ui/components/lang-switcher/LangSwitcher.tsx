'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Root,
} from '@radix-ui/react-dropdown-menu';
import { useLocale } from 'next-intl';

import { cn } from '@/shared/lib/utils/cn';

import { CaretDown } from '../../icons/caret-down';
import { DEIcon } from '../../icons/countries/de';
import { GBIcon } from '../../icons/countries/gb';
import { ITIcon } from '../../icons/countries/it';
import { PLIcon } from '../../icons/countries/pl';
import st from './LangSwitcher.module.scss';

export const LangSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const locale = useLocale();

  const switchLanguage = useCallback(
    (value: string) => {
      const segments = pathname.split('/');
      segments[1] = value;
      const newPath = segments.join('/');
      router.replace(newPath);
    },
    [pathname, router]
  );

  const options = useMemo(
    () => [
      {
        label: (
          <div className={st.flag}>
            <GBIcon /> EN
          </div>
        ),
        value: 'en',
      },
      {
        label: (
          <div className={st.flag}>
            <DEIcon /> DE
          </div>
        ),
        value: 'de',
      },
      {
        label: (
          <div className={st.flag}>
            <ITIcon /> IT
          </div>
        ),
        value: 'it',
      },
      {
        label: (
          <div className={st.flag}>
            <PLIcon /> PL
          </div>
        ),
        value: 'pl',
      },
    ],
    []
  );

  return (
    <Root>
      <DropdownMenuTrigger className={st.selectTrigger}>
        {options.find((option) => option.value === locale)?.label}
        <CaretDown />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className={st.selectContent} sideOffset={10}>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(st.selectItem, option.value === locale && st.selected)}
              onClick={() => switchLanguage(option.value)}
            >
              {option.label}
              {option.value === locale && <SelectedIcon />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Root>
  );
};

const SelectedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.99998 10.78L3.21998 7.99999L2.27332 8.93999L5.99998 12.6667L14 4.66665L13.06 3.72665L5.99998 10.78Z"
      fill="white"
    />
  </svg>
);
