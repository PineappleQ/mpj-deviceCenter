import { FindParams } from './../mode/device';
import { Base64 } from './../common/base64';
import { Printer, DeviceInfo } from './printerDevice';
import { IDevice } from "../mode/device";
import Axios, { AxiosRequestConfig } from "axios"
export class PrinterManager {
    constructor() { }
    static Current: PrinterManager = new PrinterManager();
    /**
     * 添加的打印机数组
     * 
     * @private
     * @type {Printer[]}
     * @memberOf PrinterManager
     */
    private deviceList: Printer[] = [];

    /**
     * 查找到的打印机数组
     * 该数组为临时数组，每次查找时会先清空
     * @private
     * @type {Printer[]}
     * @memberOf PrinterManager
     */
    private findDeviceList: Printer[] = [];

    get ManagerType() {
        return "printerManager";
    }

    //打印机指令
    instructionSets = [
        { "value": 'pos/esc', name: '标准EPSON兼容' },
        { "value": 'pos/esc/ab', name: '爱宝（Aibao）系列' },
        { "value": 'pos/esc/sdk/sprt', name: '斯普瑞特（SPRT）打印机' }
    ];
    //打印机宽度
    selectPageSizes = [
        { "value": "size-58", "label": "58mm" },
        { "value": "size-73", "label": "73mm" },
        { "value": "size-80", "label": "80mm" }
    ];
    //打印机尾部走纸行数
    paperScrollRows = [
        { "value": "1", "label": "1行" },
        { "value": "2", "label": "2行" },
        { "value": "3", "label": "3行" },
        { "value": "4", "label": "4行" },
        { "value": "5", "label": "5行" },
        { "value": "6", "label": "6行" },
        { "value": "7", "label": "7行" },
        { "value": "8", "label": "8行" },
        { "value": "9", "label": "9行" }
    ];

    getFindDevices(): Printer[] {
        return this.findDeviceList;
    }

    /**
     * 添加打印机到设备数组
     * 
     * @param {IDevice} printer
     * 
     * @memberOf PrinterManager
     */
    AddDevice(printer: IDevice) {
        this.deviceList.push(printer);
    }

    /**
     * 
     * 查找打印机
     * @param {string} url
     * @param {FindParams} findParams
     * @returns {Promise<PrintResult>}
     * 
     * @memberOf PrinterManager
     */
    findDevice(url: string, findParams: FindParams): Promise<PrintResult> {
        this.findDeviceList = [];
        let options: AxiosRequestConfig = {
            method: "POST",
            url: url,
            headers: {
                info: findParams.info,
                storeId: findParams.storeId,
                token: findParams.token,
                type: findParams.type
            }
        }
        let findResult: PrintResult = null;
        return new Promise<PrintResult>((resolve, reject) => {
            Axios(options).then((response) => {
                let result = response.data;
                let msg = this.errMsg(result);
                msg = msg ? msg : "查找设备成功";
                findResult = {
                    status: 200,
                    msg: msg
                }
                if (result.data) {
                    findResult.data = result.data;
                    if (Array.isArray(result.data)) {
                        this.findDeviceList = this.findDeviceList.concat(result.data);
                    } else {
                        this.findDeviceList.push(result.data);
                    }

                }
                resolve(findResult);
            }).catch((error) => {
                reject(error);
            });
        })

    }

    /**
     * 获取所有的打印机
     * 
     * @returns
     * 
     * @memberOf PrinterManager
     */
    getAllDevices() {
        return this.deviceList;
    }

    /**
     * 打印html模板
     * 
     * @param {PrintParams} printParams
     * @returns {Promise<PrintResult>}
     * 
     * @memberOf PrinterManager
     */
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
        let infoStr: any = {}
        if (printParams.printId) {
            infoStr["print-id"] = printParams.printId;
        }
        infoStr.type = printParams.type;
        let options: AxiosRequestConfig = {
            method: "POST",
            url: printParams.url,
            data: postData,
            headers: {
                info: JSON.stringify(printParams.deviceInfo),
                storeId: printParams.storeId,
                token: printParams.token,
                type: printParams.type
            }
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

    /**
     * 店铺id
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    storeId: string;

    /**
     * token
     * 
     * @type {string}
     * @memberOf PrintParams
     */
    token: string;
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
    status: number;

    /**
     * 结果信息
     * 
     * @type {string}
     * @memberOf PrintResult
     */
    msg: string;
    /**
     * 
     * 返回的数据
     * 
     * @memberOf PrintResult
     */
    data?
}