namespace PassengerResponse {
  export type PassengerInfo = {
    passengers: Passenger[];
    totalAvios: number;
    totalPoints: number;
  };

  export type Passenger = {
    name: string;
    surnames: string;
    id: string;
    memberIdentifier: string;
    totalAviosPassenger: string;
    totalPointsPassenger: string;
    items: Item[];
  };

  export type Item = {
    title: string;
    aviosAmount: number;
    points: number;
  };
}
