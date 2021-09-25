export class HorecaApiError extends Error {
  status: number
  res: Response

  constructor(msg: string, res: any) {
    super(msg)
    this.name = msg
    this.status = res.statusCode
    this.res = res
  }
}

export class HorecaNetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'HorecaNetworkError'
  }
}
