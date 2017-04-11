import { IDevice } from './../mode/device';

/**
 *打印机模型 
 * 
 * @export
 * @class Printer
 * @implements {IDevice}
 */
export class Printer implements IDevice {
    /**
     *设备信息 
     * @memberOf Printer
     */
    deviceInfo: DeviceInfo;
    /**
     * 设备的ip地址
     * @type {string}
     * @memberOf Printer
     */
    address?: string
    /**
     * 设备的制造商
     * @type {string}
     * @memberOf Printer
     */
    manufacturer: string;

    /**
     * 设备名称
     * 
     * @type {string}
     * @memberOf Printer
     */
    productName: string;

    /**
     * 连接类型 "wifi","usb"等
     * 
     * 
     * @memberOf Printer
     */
    type: string;
    constructor() {

    }
}

/**
 * 设备信息
 * 
 * @export
 * @interface DeviceInfo
 */
export interface DeviceInfo {

    address?: string;
    /**
     * 访问usb的硬件路径
     * 
     * @type {string}
     * @memberOf DeviceInfo
     */
    fileName?: string;
    /**
     * 是否需要验证
     * 
     * @type {boolean}
     * @memberOf DeviceInfo
     */
    authenticated?: boolean;
    /**
     * 蓝牙连接密码
     * 
     * @type {string}
     * @memberOf DeviceInfo
     */
    pin?: string
    /**
     * 端口
     * 
     * @type {number}
     * @memberOf DeviceInfo
     */
    port?: number;

    extDeviceType: string;

    /**
     * 打印机指令
     * 
     * @type {string}
     * @memberOf DeviceInfo
     */
    instructionSet: string;
}