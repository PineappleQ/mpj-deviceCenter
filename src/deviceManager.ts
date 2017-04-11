import { PrinterManager } from './printer/printManager';
export class DeviceManager {
    static Current: DeviceManager = new DeviceManager();
    private managerList: any = [];
    constructor() {
        this.addManager(PrinterManager.Current);
    }

    /**
     * 通过设备管理器类型获取管理器
     * 
     * @param {string} managerType
     * @returns
     * 
     * @memberOf DeviceManager
     */
    getManagerByType(managerType: string) {
        let targetManager = this.managerList.find((manager) => {
            return manager.ManagerType == managerType;
        });
        return targetManager;
    }

    /**
     * 添加设备管理器
     * 
     * @param {any} manager
     * 
     * @memberOf DeviceManager
     */
    addManager(manager) {
        this.managerList.push(manager);
    }
}