export default async function handler(req: any, res: any) {
	console.log(req);
	try {
		res.status(200).json(req.body);
	} catch (e) {
		console.error(e);
		res.end();
	}
}
