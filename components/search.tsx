import cn from 'classnames'
import type { SearchPropsType } from '@lib/search-props'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Container, Skeleton } from '@components/ui'

import useSearch from '@framework/product/use-search'

import rangeMap from '@lib/range-map'

import { filterQuery, getCategoryPath, useSearchMeta } from '@lib/search'
import { normalizeProduct } from '@framework/lib/normalize'

export default function Search({ categories }: SearchPropsType) {
  const [activeFilter, setActiveFilter] = useState('')
  const [toggleFilter, setToggleFilter] = useState(false)

  const router = useRouter()
  const { asPath } = router
  const { sort, type } = router.query
  // `q` can be included but because categories and designers can't be searched
  // in the same way of products, it's better to ignore the search input if one
  // of those is selected
  const query = filterQuery({ sort })

  const { pathname, category } = useSearchMeta(asPath)
  const activeCategory = categories.find((cat: any) => cat.slug === category)
  const { data } = useSearch({
    categoryId: activeCategory?.id,
    query: router.query,
  })
  let products = useMemo(() => data?.products.map((v: any): any => normalizeProduct(v)), [data]) || [];

  const handleClick = (event: any, filter: string) => {
    if (filter !== activeFilter) {
      setToggleFilter(true)
    } else {
      setToggleFilter(!toggleFilter)
    }
    setActiveFilter(filter)
  }

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 mb-20">
        <div className="col-span-10 lg:col-span-2 order-1 lg:order-none">
          {/* Categories */}
          <div className="relative inline-block w-full">
            <div className="lg:hidden">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, 'categories')}
                  className="flex justify-between w-full rounded-sm border border-accent-3 px-4 py-3 bg-accent-0 text-sm leading-5 font-medium text-accent-4 hover:text-accent-5 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-accent-1 active:text-accent-8 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {activeCategory?.name
                    ? `Категорія: ${activeCategory?.name}`
                    : 'Всі категорії'}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== 'categories' || toggleFilter !== true
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="rounded-sm bg-accent-0 shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    {/* <li
                      className={cn(
                        'block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                        {
                          underline: !activeCategory?.name,
                        }
                      )}
                    >
                      <Link href={{ pathname: getCategoryPath(''), query }}>
                        <a
                          onClick={(e) => handleClick(e, 'categories')}
                          className={
                            'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                          }
                        >
                          All Categories
                        </a>
                      </Link>
                    </li> */}
                    {categories.map((cat: any) => (
                      <li
                        key={cat.path}
                        className={cn(
                          'block text-sm leading-5 text-accent-4 hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                          {
                            underline: activeCategory?.id === cat.id,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname: getCategoryPath(cat.path),
                            query,
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, 'categories')}
                            className={
                              'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                            }
                          >
                            {cat.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products */}
        <div className="col-span-10 order-2 lg:order-none">
          {(query || activeCategory) && (
            <div className="mb-12 transition ease-in duration-75">
              {data ? (
                <>
                  <span
                    className={cn('animated', {
                      fadeIn: data.found,
                      hidden: !data.found,
                    })}
                  >
                    Показано {products.length} страв{' '}
                    {query && (
                      <>
                        для "<strong></strong>"
                      </>
                    )}
                  </span>
                  <span
                    className={cn('animated', {
                      fadeIn: !data.found,
                      hidden: data.found,
                    })}
                  >
                    {query ? (
                      <>
                        Нажаль не можемо нічого знайти по "<strong></strong>"
                      </>
                    ) : (
                      <>Для даної категорії немає страв</>
                    )}
                  </span>
                </>
              ) : query ? (
                <>
                  Шукаємо: "<strong></strong>"
                </>
              ) : (
                <>Пошук...</>
              )}
            </div>
          )}
          {data ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <ProductCard
                  variant="simple"
                  key={product.id}
                  className="animated fadeIn"
                  product={product}
                  imgProps={{
                    width: 480,
                    height: 480,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rangeMap(12, (i) => (
                <Skeleton key={i}>
                  <div className="w-60 h-60" />
                </Skeleton>
              ))}
            </div>
          )}{' '}
        </div>
      </div>
    </Container>
  )
}

Search.Layout = Layout
