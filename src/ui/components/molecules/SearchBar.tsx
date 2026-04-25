'use client';

import { Search } from 'lucide-react';
import {
  composeRenderProps,
  Input,
  SearchField,
  SearchFieldProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

const searchBar = tv({
  base: 'group flex flex-1 items-center gap-2 rounded-md border border-line bg-surface px-4 py-2.5 transition focus-within:bg-background focus-within:border-cta',
  variants: {
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
});

export interface SearchBarProps extends Omit<SearchFieldProps, 'children'> {
  placeholder?: string;
}

export function SearchBar({
  placeholder = 'Search culinary secrets...',
  ...props
}: SearchBarProps) {
  return (
    <SearchField
      aria-label="Search"
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        searchBar({ ...renderProps, className }),
      )}
    >
      <Search aria-hidden className="text-text-secondary size-4 shrink-0" />
      <Input
        placeholder={placeholder}
        className="text-text placeholder:text-text-secondary flex-1 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
    </SearchField>
  );
}
