import { Printer, DeviceInfo } from './printerDevice';
import { IDevice } from "../mode/device";

export class PrinterManager {
    private deviceList: Printer[] = [];

    get ManagerType() {
        return "printerManager";
    }
    static Current: PrinterManager = new PrinterManager();

    constructor() { }

    AddDevice(printer: IDevice) {
        //TODO:
        this.deviceList.push(printer);
    }

    printHtml(printParams: PrintParams): Promise<PrintResult> {
        switch (printParams.printMode) {
            case "http":
                this.printByHttp(printParams);
                break;
            default:
                this.printByHttp(printParams);
                break;
        }
        return;
    }

    /**
     * 通过http请求打印
     * 
     * @param {PrintParams} printParams
     * @returns
     * 
     * @memberOf PrinterManager
     */
    printByHttp(printParams: PrintParams) {
        if (!printParams.url) {
            console.log("缺少打印服务地址");
            return;
        }
    }
}


/**
 * 打印的参数
 * 
 * @interface PrintParams
 */
interface PrintParams {
    /**
     * 打印的方式，通过请求打印、驱动打印等。默认为发送http请求打印
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    printMode: string;

    /**
     * 打印请求地址
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    url?: string;

    /**
     * 要打印的模板
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    printTemplate: string;

    /**
     * 打印模式："text","img"等
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    mode: string;

    /**
     * 设备信息
     * 
     * @type {DeviceInfo}
     * @memberOf PrintParams
     */
    deviceInfo: DeviceInfo;

    /**
     * 打印的id
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    printId: string;

    /**
     * 打印机的连接类型 "wifi","usb"等
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    type: string;
}


/**
 * 打印结果模型
 * 
 * @interface PrintResult
 */
interface PrintResult {
    /**
     * 结果标识码
     * 
     * @type {number}
     * @memberOf PrintResult
     */
    code: number;

    /**
     * 结果信息
     * 
     * @type {string}
     * @memberOf PrintResult
     */
    msg: string;
}