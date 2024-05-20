import { JSONBasedDriver } from '../drivers/JSONBasedDriver';

export class DriverError extends Error {
    public constructor(
        message: string,
        public driver: JSONBasedDriver
    ) {
        super(message);
    }
}
