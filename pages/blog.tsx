import type { GetStaticPropsContext } from 'next'
import { Layout } from '@components/common'
import { Container } from '@components/ui'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  return {
    props: { pages: [] },
  }
}

export default function Blog() {
  return (
    <div className="pb-20">
      <div className="text-center pt-5 pb-20 bg-violet">
        <Container>
          <h2 className="mt-5 text-4xl tracking-tight leading-10 font-extrabold text-white sm:text-5xl sm:leading-none md:text-6xl">
            Вітаємо у МУШЛЯ
          </h2>
          <p className="mt-3 max-w-md mx-auto text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Роби замовлення у декілька кліків:
            <ul className="mt-3">
              <li>1. Доставка в будь-яку точку міста</li>
              <li>2. Вартість доставки - 33 гривні</li>
              <li>3. Замовляйте щодня з 11.00 до 21.00</li>
            </ul>
            <p className="mt-3 max-w-md mx-auto text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Fast casual формат від Gastrofamily з делікатесними
              морепродуктами, ресторанними подачами і цінником fast casual.
            </p>
            <p className="mt-3 max-w-md mx-auto text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              В Mushlya можна замовити делікатесні морепродукти за 1-5 євро:
              <ul>
                <li>- величезні устриці</li>
                <li>- морських равликів-булотів</li>
                <li>- всеможливі креветки</li>
                <li>- бургери та сендвічі</li>
                <li>
                  - а головне — цілий казанок мідій у вершковому соусі з теплим
                  багетом.
                </li>
              </ul>
            </p>
            <p className="mt-3 max-w-md mx-auto text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Час очікування замовлення — максимум 5-10 хвилин.
            </p>
            <p className="mt-3 max-w-md mx-auto text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Mushlya — це місце, де вечірка ніколи не закінчується, а велике
              свято можна влаштувати імпульсивно, за мінімальні кошти, без
              усіляких передзамовлень та бронювань.
            </p>
          </p>

          <h2 className="mt-5 text-4xl tracking-tight leading-10 font-extrabold text-white sm:text-5xl sm:leading-none md:text-6xl">
            Контакти
          </h2>

          <p className="mt-3 max-w-md mx-auto text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Житомир, вул. Київська, 16
            <p>
              тел.
              <a href="callto:+380 96 454 38 93">+380 96 454 38 93</a>
            </p>
          </p>
        </Container>
      </div>
    </div>
  )
}

Blog.Layout = Layout
