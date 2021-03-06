import cn from 'classnames';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import s from './ProductView.module.css';
import { FC } from 'react';
import type { Product } from '@commerce/types/product';
import usePrice from '@framework/product/use-price';
import { WishlistButton } from '@components/wishlist';
import { ProductSlider, ProductCard } from '@components/product';
import { Container, Text } from '@components/ui';
import ProductSidebar from '../ProductSidebar';
import ProductTag from '../ProductTag';
interface ProductViewProps {
	product: Product;
	relatedProducts: Product[];
}

const ProductView: FC<ProductViewProps> = ({ product, relatedProducts }) => {
	const { price } = usePrice({
		amount: product.price.value,
		baseAmount: product.price.retailPrice,
		currencyCode: product.price.currencyCode!,
	});
	const [image] = product.images;

	return (
		<>
			<Container className="max-w-none w-full" clean>
				<div className={cn(s.root, 'fit')}>
					<div className={cn(s.main, 'fit')}>
						<ProductTag
							name={product.name}
							price={`${price} ${product.price?.currencyCode}`}
							fontSize={32}
						/>
						<div className={s.sliderContainer}>
							{image && (
								<Image
									className={(s.img)}
									src={image.url!}
									alt={image.alt || 'Фото страви'}
									layout={'fill'}
									priority={true}
									quality="40"
								/>
							)}
							{/* <ProductSlider key={product.id}>
                {product.images.map((image, i) => (
                  <div key={image.url} className={s.imageContainer}>
                    <Image
                      className={s.img}
                      src={image.url!}
                      alt={image.alt || 'Фото страви'}
                      width={800}
                      height={500}
                      priority={i === 0}
                      quality="40"
                    />
                  </div>
                ))}
              </ProductSlider> */}
						</div>
						{process.env.COMMERCE_WISHLIST_ENABLED && (
							<WishlistButton
								className={s.wishlistButton}
								productId={product.id}
								variant={product.variants[0]}
							/>
						)}
					</div>

					<ProductSidebar product={product} className={s.sidebar} />
				</div>
				<hr className="mt-16 border-accent-2" />
				<section className="py-12 px-6 mb-10">
					<Text variant="sectionHeading">
						Обирай також улюблені страви наши гостей
					</Text>
					<div className={s.relatedProductsGrid}>
						{relatedProducts.map((p) => (
							<div
								key={p.path}
								className="animated fadeIn bg-accent-0 border border-accent-2"
							>
								<ProductCard
									noNameTag
									product={p}
									key={p.path}
									variant="simple"
									className="animated fadeIn"
									imgProps={{
										width: 300,
										height: 300,
									}}
								/>
							</div>
						))}
					</div>
				</section>
			</Container>
			<NextSeo
				title={product.name}
				description={product.description}
				openGraph={{
					type: 'website',
					title: product.name,
					description: product.description,
					images: [
						{
							url: product.images[0]?.url!,
							width: 800,
							height: 600,
							alt: product.name,
						},
					],
				}}
			/>
		</>
	);
};

export default ProductView;
