import { Settings } from 'luxon';

Settings.defaultZone = 'Europe/Berlin';
Settings.throwOnInvalid = true;

export { DateTime } from 'luxon';
