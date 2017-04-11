/**
 * 设备管理的接口
 */
export interface IDeviceManager {
    /**
     * 管理器的名称
     */
    managerName: string;
    /**
     * 当前设备列表
     */
    deviceList: IDevice[];
    /**
     * 查找设备
     */
    findDevice(findParams: FindParams): Promise<IDevice[]>;
    /**
     * 初始化
     */
    regist(device: IDevice): void;
    /**
     * 对象销毁
     */
    destoryDevice(device: IDevice): void;
    /**
     * 设备失去连接
     */
    onDisconnect(): void;
}

/**
 * 设备对象
 */
export interface IDevice {
    //设备id
    id?: string;
    //设备信息
    deviceInfo;
    //连接类型 "wifi"，"蓝牙"等
    type: string;
    //设备的ip地址
    address?: string
    //设备的制造商
    manufacturer: string;
    //设备的型号
    productName: string;
}

export interface FindParams {
    
    /**
     * 店铺的id
     * 
     * @type {string}
     * @memberOf FindParams
     */
    storeId: string;
    
    /**
     * token
     * 
     * @type {string}
     * @memberOf FindParams
     */
    token: string;
    
    /**
     * 连接类型 "wifi"等
     * @type {string}
     * @memberOf FindParams
     */
    type: string;
    
    /**
     * 
     * 设备信息
     * @type {{
     *         ip?: string;
     *         port?: number;
     *         deviceType?: string
     *     }}
     * @memberOf FindParams
     */
    info?: {
        ip?: string;
        port?: number;
        deviceType?: string
    };
}