 import { NewManageMyBookingService } from '@src/components/services/ib-MmB-new-manage-my-booking.service';

describe('NewManageMyBookingService', () => {
    let service: NewManageMyBookingService;

    beforeEach(() => {
        service = new NewManageMyBookingService();
    });

    it('should NOT point to localhost', () => {
        const url = (service as any).SEARCH_NEW_URL;
        expect(url).not.toContain('localhost');
    });
});