'use client';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Root,
} from '@radix-ui/react-dropdown-menu';

import { CURRENCY_LIST, type CurrencyCode } from '@/shared/config/currencies';
import { cn } from '@/shared/lib/utils/cn';
import { CaretDown } from '@/shared/ui/icons/caret-down';

import { useCurrencyStore } from '../model/store';
import st from './CurrencySelect.module.scss';

export const CurrencySelect = () => {
  const { currency, setCurrency } = useCurrencyStore();

  const active = CURRENCY_LIST.find((c) => c.code === currency) ?? CURRENCY_LIST[0];

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
          {CURRENCY_LIST.map((option) => (
            <DropdownMenuItem
              key={option.code}
              className={cn(st.selectItem, option.code === currency && st.selected)}
              onClick={() => setCurrency(option.code as CurrencyCode)}
            >
              <span className={st.symbol}>{option.symbol}</span>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Root>
  );
};
