namespace IbUiPassengerSelectorComponentModel {
  export type Model = {
    maxPassengers: number;
  };
  export type PassengerCondition = {
    passengersCount: number;
    passengersWithInfants: number;
    totalAdults: number;
    maxChilds: number;
  };

  export interface KeyCode extends Event {
    keyCode: number;
  }
}
