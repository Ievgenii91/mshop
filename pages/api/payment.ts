import crypto from 'crypto';
const { LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY } = process.env;

const str_to_sign = (str: string) => {
	const sha1 = crypto.createHash('sha1');
	sha1.update(str);
	return sha1.digest('base64');
};

const getHashes = (config: string) => {
	let data = Buffer.from(JSON.stringify(config)).toString('base64');
	let signature = str_to_sign(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
	console.log('hashes', signature);
	return {
		data,
		signature,
	};
};

export default async function handler(req: any, res: any) {
	const { amount, description } = JSON.parse(req.body);
	const host = req.headers.origin;
	const data = {
		version: '3',
		amount: amount,
		public_key: LIQPAY_PUBLIC_KEY,
		private_key: LIQPAY_PRIVATE_KEY,
		action: 'pay',
		currency: 'UAH',
		language: 'uk',
		description,
		result_url: host + '/checkout',
		server_url: host + '/api/result',
		order_id: new Date().getTime() + '',
	};
	try {
		res.status(200).json(getHashes(data as any));
	} catch (e) {
		console.error(e);
		res.end();
	}
}
