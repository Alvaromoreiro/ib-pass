@Service(
    'ib-MmB-booking-dashboard-module',
    ['localStorageService'],
    [])
export class UpdateSpecialNeedsTransformer {

    allSpecialNeeds = { specialNeeds: [] };

    constructor (
        private localStorageService
    ) {}

    transformUpdateSpecialNeeds = (passenger) => {
        if (this.allSpecialNeedCondition()) {
            this.allSpecialNeeds.specialNeeds = this.localStorageService.get('specialNeedsPassengers');
        };
        let needPassenger;
        if (passenger.passengerType !== 'INFANT' && passenger.specialNeeds) {
            needPassenger = {
                passengerId: passenger.passengerId,
                specialNeedsCodes: []
            };
            passenger.specialNeeds.values.forEach((need) => {
                needPassenger.specialNeedsCodes.push(need.serviceCode);
            });
            
            this.addAllSpecialNeeds(needPassenger, passenger);
        };
        return this.allSpecialNeeds;
    };

    private addAllSpecialNeeds = (needPassenger, passenger) => {
        if (this.allSpecialNeedCondition()) {
            this.allSpecialNeeds.specialNeeds.push(needPassenger);
        } else {
            this.allSpecialNeeds.specialNeeds.map((element) => {
                if (element.passengerId === passenger.passengerId) {
                    element.specialNeedsCodes = needPassenger.specialNeedsCodes;
                }
            });
        };
    };

    private allSpecialNeedCondition = () => {
       return (this.allSpecialNeeds === null || this.allSpecialNeeds.specialNeeds === null || this.allSpecialNeeds.specialNeeds.length === 0);
    }
};