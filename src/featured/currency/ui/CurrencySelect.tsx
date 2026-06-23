'use client';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Root,
} from '@radix-ui/react-dropdown-menu';
import { useTranslations } from 'next-intl';

import { CURRENCY_LIST, type CurrencyConfig, getCurrencyGroups } from '@/shared/config/currencies';
import { cn } from '@/shared/lib/utils/cn';
import { CaretDown } from '@/shared/ui/icons/caret-down';

import { useCurrencyStore } from '../model/store';
import st from './CurrencySelect.module.scss';

type CurrencySelectProps = {
  /** Selected billing country; its currency is promoted to the "Popular" group. */
  countryCode?: string;
};

export const CurrencySelect = ({ countryCode }: CurrencySelectProps) => {
  const { currency, setCurrency } = useCurrencyStore();
  const t = useTranslations('currency');

  const active = CURRENCY_LIST.find((c) => c.code === currency) ?? CURRENCY_LIST[0];
  const { popular, others } = getCurrencyGroups(countryCode);

  const renderItem = (option: CurrencyConfig) => (
    <DropdownMenuItem
      key={option.code}
      className={cn(st.selectItem, option.code === currency && st.selected)}
      onClick={() => setCurrency(option.code)}
    >
      <span className={st.symbol}>{option.symbol}</span>
      {option.label}
    </DropdownMenuItem>
  );

  return (
    <Root>
      <DropdownMenuTrigger className={st.selectTrigger} type="button">
        <span className={st.value}>
          {active.symbol} {active.label}
        </span>
        <CaretDown />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className={st.selectContent} sideOffset={8} align="end">
          <DropdownMenuLabel className={st.groupLabel}>{t('popular')}</DropdownMenuLabel>
          {popular.map(renderItem)}
          {others.length > 0 && (
            <>
              <DropdownMenuLabel className={st.groupLabel}>{t('others')}</DropdownMenuLabel>
              {others.map(renderItem)}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Root>
  );
};
