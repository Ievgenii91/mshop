import s from './ProductSidebar.module.css';
import { useAddItem } from '@framework/cart';
import React, { FC, useEffect, useState } from 'react';
import { ProductOptions } from '@components/product';
import type { Product } from '@commerce/types/product';
import { Button, Text, Rating, Collapse, useUI } from '@components/ui';
import {
	getProductVariant,
	selectDefaultOptionFromProduct,
	SelectedOptions,
} from '../helpers';

interface ProductSidebarProps {
	product: Product;
	className?: string;
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
	const addItem = useAddItem();
	const { openSidebar } = useUI();
	const [loading, setLoading] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});


	// TODO: check
	// useEffect(() => {
	//   selectDefaultOptionFromProduct(product, setSelectedOptions)
	// }, [product])

	// const variant = getProductVariant(product, selectedOptions)
	const addToCart = async () => {
		setLoading(true);
		try {
			const data = await addItem({
				productId: String(product.id),
				variantId: '', // String(variant ? variant.id   : product.variants[0].id),
			});
			if (data) {
				localStorage.setItem('bc_cartId', (data as any)['_id']);
			}
			openSidebar();
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	return (
		<div className={className}>
			<ProductOptions
				options={product.options}
				selectedOptions={selectedOptions}
				setSelectedOptions={setSelectedOptions}
			/>
			<Text
				className="pb-4 break-words w-full max-w-xl"
				html={product.descriptionHtml || product.description}
			/>
			{/* <div className="flex flex-row justify-between items-center">
        <Rating value={4} />
        <div className="text-accent-6 pr-1 font-medium text-sm">36 reviews</div>
      </div> */}
			<div>
				{process.env.COMMERCE_CART_ENABLED && (
					<Button
						aria-label="Add to Cart"
						type="button"
						className={s.button}
						onClick={addToCart}
						loading={loading}
					>
						 Додати у кошик
					</Button>
				)}
			</div>
		</div>
	);
};

export default ProductSidebar;
