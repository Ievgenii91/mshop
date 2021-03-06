import useCart from '@framework/cart/use-cart';
import usePrice from '@framework/product/use-price';
import { Layout } from '@components/common';
import { Button, Input, Text } from '@components/ui';
import InputMask from 'react-input-mask';
import { Bag, Cross, Check, MapPin, CreditCard } from '@components/icons';
import { CartItem } from '@components/cart';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useCheckout from '@framework/cart/use-checkout';
import { Product as CommerceProduct } from '@commerce/types/product';
import ProductCard from '@components/product/ProductCard';
import { GetStaticPropsContext } from 'next';
import commerce from '@lib/api/commerce';

const DELIVER_PRICE = 33;
type BaseProduct = {
	count: number;
	total: number;
};
type Product = CommerceProduct & BaseProduct;
type Order = {
	id: string;
	products: Partial<Product[]>;
};

export async function getStaticProps({
	params,
	locale,
	locales,
	preview,
}: GetStaticPropsContext<{ slug: string }>) {
	const config = { locale, locales };

	const allProductsPromise = commerce.getAllProducts({
		variables: { first: 4 },
		config,
		preview,
	});
	const { products: relatedProducts } = await allProductsPromise;

	return {
		props: {
			relatedProducts,
		},
		revalidate: 200,
	};
}

export default function Checkout({ relatedProducts }: any) {
	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [order, setOrder] = useState<Order>();
	const [deliver, setDeliver] = useState<boolean>(false);
	const [cardPaymentMethod, setCardPaymentMethod] = useState<boolean>(false);
	const [canOrder, setCanOrder] = useState<boolean>(false);
	const [signature, setSignature] = useState<string>('');
	const [base64data, setBase64data] = useState<string>('');
	const form = useRef(null);
	const postOrder = useCheckout();
	const [formData, setFormData] = useState<
		Partial<{
			name: string;
			phone: string;
			description: string;
			address: string;
		}>
	>({
		name: '',
		phone: '',
		description: '',
		address: '',
	});

	const { data, isLoading, isEmpty } = useCart();

	const showForm = !isEmpty && !success;

	useEffect(() => {
		if (base64data && signature) {
			// localStorage.clear();
			// localStorage.setItem('order', JSON.stringify({
			//   phone,
			//   clientName,
			//   note,
			//   date: new Date().getTime() + '',
			//   products: order.selectedItems,
			// }))
			(form.current as any).submit();
		}
	}, [base64data, signature]);

	const { price: subTotal } = usePrice(
		data && {
			amount: Number(data.subtotalPrice),
			currencyCode: data.currency.code,
		}
	);
	const { price: total } = usePrice(
		data && {
			amount: Number(data.totalPrice) + (deliver ? DELIVER_PRICE : 0),
			currencyCode: data.currency.code,
		}
	);

	const { price: deliverPrice } = usePrice(
		data && {
			amount: deliver ? DELIVER_PRICE : 0,
			currencyCode: data.currency.code,
		}
	);

	const checkout = useCallback(async () => {
		if (!canOrder) return;
		const products = data?.lineItems.map((v) => ({
			id: v.id,
			name: v.name,
			price: v.variant.price,
			count: v.quantity,
			total: v.variant.price * v.quantity,
		}));
		let amount = 0;
		products?.forEach((v) => {
			amount += v.total;
		});
		const body = {
			initiator: 'site',
			phone: formData?.phone,
			name: formData?.name,
			products,
			address: formData?.address,
			deliverPrice: deliver ? DELIVER_PRICE : 0,
			date: new Date().toISOString(),
			blocked: cardPaymentMethod,
		};
		let res = null;
		try {
			res = await postOrder(body);
		} catch (e) {
			setSuccess(false);
		}

		if (!res) {
			setError(true);
		} else {
			setSuccess(true);
			setOrder(res);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			localStorage.removeItem('bc_cartId');
			if (localStorage.getItem('mstore_orders')) {
				const orders = localStorage.getItem('mstore_orders')?.split(',');
				orders?.push(res.id);
				localStorage.setItem('mstore_orders', orders?.join(',') + '');
			} else {
				localStorage.setItem('mstore_orders', res.id);
			}

			if (cardPaymentMethod) {
				try {
					const response = await fetch('/api/payment', {
						method: 'POST',
						body: JSON.stringify({
							amount,
							description: '???????????? ???? ????????????????????????',
							order_id: res.id,
						}),
					});
					const { data, signature } = await response.json();
					setBase64data(data);
					setSignature(signature);
				} catch (e) {
					console.error(e);
					return;
				}
			}
		}
	}, [
		canOrder,
		cardPaymentMethod,
		formData?.phone,
		formData?.name,
		formData?.address,
		data?.lineItems,
		deliver,
		postOrder,
	]);

	const handleChange = useCallback(
		(data: any, prop: string) => {
			const entity = {
				...formData,
				[prop]: typeof data === 'string' ? data : data.target?.value,
			};
			setFormData(entity);
			if (!entity.name || (deliver ? !entity.address : true)) {
				setCanOrder(false);
			}
			// localStorage.setItem('form-data', JSON.stringify(entity))
		},
		[setFormData, formData, deliver]
	);

	useEffect(() => {
		if (deliver && !formData.address) {
			setCanOrder(false);
		}
	}, [deliver]);

	const beforeChange = useCallback(
		(newState: any) => {
			const { value } = newState;
			const selection = newState.selection;

			const phone = /^\+[0-9]{2}\((0\d+)\)\s\d{3}\s\d{2}\s\d{2}/.test(value);
			const expression =
				formData?.name && phone && (deliver ? formData.address : true);
			setCanOrder(!!expression);

			return {
				value,
				selection,
			};
		},
		[formData]
	);

	return (
		<>
			<form
				ref={form}
				method="POST"
				action="https://www.liqpay.ua/api/3/checkout"
			>
				<input type="hidden" name="data" value={base64data} />
				<input type="hidden" name="signature" value={signature} />
			</form>
			<div className="grid lg:grid-cols-12 w-full max-w-7xl mx-auto">
				<div
					className={isEmpty || success ? 'lg:col-span-12' : 'lg:col-span-8'}
				>
					{isLoading || isEmpty ? (
						<div className="flex-1 px-12 py-24 flex flex-col justify-center items-center ">
							<span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
								<Bag className="absolute" />
							</span>
							<h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
								??????... ????????????????, ?????? ??????????.
							</h2>
							<p className="text-accents-6 px-10 text-center pt-2">
								????????????????, ??????????????, ????????, ?????? ???????? ???????? ??????????...
							</p>
						</div>
					) : error ? (
						<div className="flex-1 px-12 flex flex-col justify-center items-center">
							<span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
								<Cross width={24} height={24} onClick={() => setError(false)} />
							</span>
							<h2 className="pt-6 text-xl font-light text-center">
								???? ???? ???????????? ???????????????????? ??????????????. ???????? ?????????? ?????????????????? ????????
								???????????????? ????????????????????.
							</h2>
						</div>
					) : success ? (
						<div className="flex-1 px-12 py-24 flex flex-col justify-center items-center">
							<span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
								<Check />
							</span>
							<h2 className="pt-6 text-xl font-light text-center">
								?????????????? ???? ???????? ????????????????????.
							</h2>
							<p>
								?????????? ???????????? ???????????????????? - <b>{order?.id}</b>
								<p>{deliver && '?????????????????? ???????????????? ???????????????? ????????????'}</p>
							</p>
							<div className="mt-4">
								{order &&
									order.products.map((v, index) => (
										<div key={index + 'e'}>
											* {v?.name} - {v?.total}
										</div>
									))}
							</div>

							<div></div>
						</div>
					) : (
						<div className="px-4 sm:px-6 flex-1">
							{/* <Text variant="pageHeading">????????????????????</Text> */}
							<Text variant="sectionHeading">
								?????????????????????? ???????????????????????? ???????????? ????????????????????
							</Text>
							<ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accents-2 border-b border-accents-2">
								{data!.lineItems.map((item) => (
									<CartItem key={item.id} item={item} currencyCode={'UAH'} />
								))}
							</ul>
							<div className="my-6">
								<Text>???????????????????????? ???????????? ???? ????????????????????</Text>
								{/* <div className="flex py-6 space-x-6">
								{[1, 2, 3, 4, 5, 6].map((x) => (
									<div
										key={x}
										className="border border-accents-3 w-full h-24 bg-accents-2 bg-opacity-50 transform cursor-pointer hover:scale-110 duration-75"
									/>
								))}
							</div> */}
								<div className="flex py-6 space-x-6">
									{relatedProducts.map((p: Product) => (
										<div
											key={p.path}
											className="border border-accents-3 w-full bg-accents-2 bg-opacity-50 transform cursor-pointer hover:scale-110 duration-75"
										>
											<ProductCard
												noNameTag
												product={p}
												key={p.path}
												variant="simple"
												className="animated fadeIn"
												imgProps={{
													width: 75,
													height: 75,
												}}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
				{showForm && (
					<div className="lg:col-span-4">
						<div className="flex-shrink-0 px-4 sm:px-6 mt-2">
							<Text className="mt-4 pb-1">????'??</Text>
							<Input
								value={formData?.name}
								onChange={(e) => handleChange(e, 'name')}
							></Input>
							<Text className="mt-4 pb-1">??????????????</Text>
							<InputMask
								value={formData?.phone}
								mask="+38(099) 999 99 99"
								onChange={(e) => handleChange(e, 'phone')}
								// @ts-ignore
								beforeMaskedValueChange={beforeChange}
							>
								{(inputProps: unknown) => <Input {...inputProps} type="tel" />}
							</InputMask>
							<Text className="mt-4 pb-1">?????????????????? ??????????????????</Text>
							<Input
								value={formData?.description}
								onChange={(e) => handleChange(e, 'description')}
							></Input>
						</div>
						<div className="flex-shrink-0 px-4 py-8 sm:px-6">
							<div
								className={
									(deliver ? 'border-cyan text-cyan bg-cyan-light ' : '') +
									'rounded-md border border-accents-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accents-4'
								}
								onClick={() => {
									setDeliver((v) => !v);
								}}
							>
								<div className="mr-5">
									<MapPin />
								</div>
								<div className="text-sm text-center font-medium">
									<span className="uppercase">?????????????? ????????????</span>
								</div>
							</div>
							{deliver && (
								<div className="mb-4">
									<Text className="mt-4 pb-1">???????? ???????????????????</Text>
									<Input
										autoFocus
										value={formData?.address}
										onChange={(e) => handleChange(e, 'address')}
									></Input>
								</div>
							)}
							<div
								className={
									(!deliver ? 'border-cyan text-cyan bg-cyan-light' : '') +
									' rounded-md border border-accents-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accents-4'
								}
								onClick={() => {
									setDeliver((v) => !v);
								}}
							>
								<div className="mr-5">
									<Bag />
								</div>
								<div className="text-sm text-center font-medium">
									<span className="uppercase">???????????? ??????</span>
								</div>
							</div>
							<div className="border-t border-accents-2 mb-4 mt-4"></div>
							<div
								className={
									(cardPaymentMethod
										? 'border-cyan text-cyan bg-cyan-light'
										: '') +
									' rounded-md border border-accents-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accents-4'
								}
								onClick={() => {
									setCardPaymentMethod((v) => !v);
								}}
							>
								<div className="mr-5">
									<CreditCard />
								</div>
								<div className="text-sm text-center font-medium">
									<span className="uppercase">???????????????? ????????????</span>
								</div>
							</div>
							<div className="border-t border-accents-2">
								<ul className="py-3">
									<li className="flex justify-between py-1">
										<span>????????</span>
										<span>{subTotal}</span>
									</li>
									{deliver && (
										<li className="flex justify-between py-1">
											<span>???????????????? ????????????????</span>
											<span className="tracking-wide">{deliverPrice}</span>
										</li>
									)}
								</ul>
								<div className="flex justify-between border-t border-accents-2 py-3 font-bold mb-10">
									<span>????????????</span>
									<span>{total}</span>
								</div>
							</div>
							<div className="flex flex-row justify-end">
								<div className="w-full lg:w-72">
									{isEmpty ? (
										<Button href="/" Component="a" width="100%">
											???????? ???? ????????????
										</Button>
									) : (
										<Button
											onClick={checkout}
											disabled={!canOrder}
											Component="a"
											width="100%"
										>
											????????????????
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

Checkout.Layout = Layout;
