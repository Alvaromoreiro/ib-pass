/// <reference path="./global.d.ts" />

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import './styles/ib-pmt-styles-host';

/** ANGULARJS */
import './decorators';
import './app/react';
import './ib-pmt-app-module';
import './components/ib-payments/cmpnts';
import './app/core';
import './app/feature';
import './app/shared';

/** ANGULAR **/
export * from './ib-payments-app.module';
