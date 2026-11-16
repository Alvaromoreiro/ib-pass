import { TestBed } from '@angular/core/testing';
import { IbElitePointsManager } from '@shared/services/ib-elite-points-manager/ib-elite-points-manager';

describe('IbElitePointsManager', () => {
  let service: IbElitePointsManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbElitePointsManager);
  });

  it('should receive 0 if no fare is provided', () => {
    expect(service.eliteQualificationMapper(null, null, null)).toBe(0);
  });

  it('should receive fare if no flightRatio or comercialNameES is provided', () => {
    const fare = 100;
    const flightRatio = 'Invalid Flight Ratio';
    const comercialNameES = 'Invalid Comercial Name ES';
    expect(service.eliteQualificationMapper(fare, comercialNameES, flightRatio)).toBe(fare);
  });

  it('should return the fare plus the elite points value for the combination of flightRatio and comercialNameES', () => {
    const fare = 100;
    const flightRatio = 'Corto Radio';
    const comercialNameES = 'Básica';
    expect(service.eliteQualificationMapper(fare, comercialNameES, flightRatio)).toBe(100);
  });

  it('should return the fare plus the elite points value for the combination of flightRatio and comercialNameES, rounded to the nearest whole number', () => {
    const fare = 100.5;
    const flightRatio = 'Corto Radio';
    const comercialNameES = 'Básica';
    expect(service.eliteQualificationMapper(fare, comercialNameES, flightRatio)).toBe(101);
  });

  it('should use the value "Corto Radio" as the default flightRatio if no valid value is provided', () => {
    const fare = 100;
    const flightRatio = 'Invalid Flight Ratio';
    const comercialNameES = 'Básica';
    expect(service.eliteQualificationMapper(fare, comercialNameES, flightRatio)).toBe(100);
  });

  it('should use the value "Basica" as the default commercialName if a valid value is not provided', () => {
    const fare = 100;
    const flightRatio = 'Corto Radio';
    const comercialNameES = 'Invalid Comercial Name ES';
    expect(service.eliteQualificationMapper(fare, comercialNameES, flightRatio)).toBe(100);
  });
});