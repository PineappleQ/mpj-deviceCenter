import { Base64 } from './../common/base64';
import { Printer, DeviceInfo } from './printerDevice';
import { IDevice } from "../mode/device";
import Axios, { AxiosRequestConfig } from "axios"
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
        let base64 = new Base64();
        let postData = base64.encode(printParams.printTemplate);
        let options: AxiosRequestConfig = {
            method: "POST",
            url: printParams.url,
            data: postData,
        }
        Axios(options).then((response) => {
            console.log(response);
        })
    }
    /**
     * 返回参数及对应的信息
     * @param data 
     */
    errMsg(data) {
        if (!data)
            return;
        if (data.retCode == 2) {
            return;
        }
        if (data.msg) {
            return data.msg;
        }
        let msg = "";

        switch (data.retCode) {

            case 201:
                msg = "打印机缺纸，请换纸。";
                break;
            case 205:
                msg = "纸舱盖未到位，请检查是否已经合上。";
                break;
            case 202:
            case 204:
                msg = "打印机发生未知故障(" + data.retCode + ")，请关闭电源检查打印机并重启。如果问题仍然存在请联系设备商。";
                break;
            case 203:
                msg = "打印机未连接，请检查连接是否正常，电源是否打开";
                break;
            case 200:
            case 404:
            case 500:
                msg = "设备服务器发生内部错误(" + data.retCode + ")，请联系平台供应商。";
                break;
            case 408:
                msg = "设备服务器无法连接。";
                break;
            case 301:
                msg = "设备传入参数不足或错误。";
                break;
            case 206:
                msg = "打印任务过多，正在排队打印，请等待...";
                break;
        }
        return msg;
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