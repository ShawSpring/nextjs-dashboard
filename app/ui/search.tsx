'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const handleSearch = useDebouncedCallback(function (term: string) {
    console.log('search ...', term);
    const params = new URLSearchParams(searchParams); // 每次都要从原来的searchParams开始
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
    }

    router.replace(`${pathName}?${params.toString()}`);
  }, 1000);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // * 分享url的时候，能将url里的查询参数searchParams直接填充搜索框
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon
        strokeWidth={2}
        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-cyan-700"
      />
    </div>
  );
}
