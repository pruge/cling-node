export declare class ModbusCrcError extends Error {
    constructor();
}
export declare class ModbusAborted extends Error {
    constructor();
}
export declare class ModbusRetryLimitExceed extends Error {
    constructor(add: string | number);
}
export declare class ModbusResponseTimeout extends Error {
    constructor(time: string | number);
}
