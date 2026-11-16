/// <reference path="./global.d.ts" />
/** ANGULARJS */
import './decorators';
import './app/core';
import './app/features';
import './components';
import './app/shared';
import './ib-web-menus-module';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

/** ANGULAR **/
export * from './public-api';