import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils'; 
import {SlicedAvailabilityDataTransformer} from './ib-booking-sliced-availability-data-transformer';
export const AJSSlicedAvailabilityDataTransformer = new InjectionToken('SlicedAvailabilityDataTransformer');
export const AJSSlicedAvailabilityDataTransformerProvider = upgradeAJSServiceProvider('SlicedAvailabilityDataTransformer', AJSSlicedAvailabilityDataTransformer);
export interface AJSSlicedAvailabilityDataTransformerType extends SlicedAvailabilityDataTransformer {}