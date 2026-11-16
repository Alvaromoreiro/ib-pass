import { AttendanceVoucherResponse } from '@src/app/core/models/attendance-voucher-model/attendance-voucher-model';

@Service(
    'ib-MmB-services-module', [
        'CommonsGenericProxy',
        'MmBAppConstants',
        'CommonsNewHttpUtilsErrorService'
    ], [])
export class AttendanceVoucherService {
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getAttendanceVoucher = (locator: string, surname: string) => {
        return new Promise((resolve, reject) => {
            const endpoint = this.MmBAppConstants.DEFAULT_ENDPOINTS.attendanceVoucherStatusURI;
            this.CommonsGenericProxy.postGeneric(endpoint, {'locator': 'JCH21', 'surname': 'abreu'}).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    mockAttendanceVoucher = (locator: string, surname: string) => {
        return new Promise(resolve => {
            const object : AttendanceVoucherResponse = {
                'locator': 'JCH21', 
                'surname': 'abreu',
                'flight': {
                    'operationalCompany': 'IB',
                    'number' : '3939',
                    'departureTime': 'xxxxx'
                },
                'voucher': [
                    {
                        'id': '2771341',
                        'voucherType': 'RESTAURANT',
                        'actions': [],
                        'additionalInfo': [{
                            'infoType': 'BOARDING'
                        }],
                        'url': 'https://inci.iberia.com/QSP/client/general-info/interesting-points/'
                    },
                    {
                        'id': '2771341',
                        'voucherType': 'ACCOMODATION',
                        'actions': [{'actionType': 'DOWNLOAD'},{'actionType': 'EMAIL'}],
                        'additionalInfo': [],
                        'url': 'https://www2.melia.com/meliapro/es/landing/iberia/vouchers.html'
                    }
            ]
            }
            resolve(object);
        });
        
    
    }
}