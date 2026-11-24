export interface SeatBoostApiResponse {
    data: SeatBoostResponse, 
    code: number
}

export interface SeatBoostResponse {
    showBanner:boolean
    encryptedDeeplink:string
}