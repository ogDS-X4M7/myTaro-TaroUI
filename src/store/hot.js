import { observable, runInAction } from "mobx";
import service from "../service";
const hotStore = observable({
  hots: [],
  async getHots() {
    try {
      const result = await service.getHotList();
      // console.log(result);
      // console.log(result.data);
      runInAction(() => {
        // 在 runInAction 中修改状态
        // this.hots.push(...result.data.data);
        this.hots = result.data.data.map(item => ({
          ...item,
          // 如果原数据没有 id，添加唯一标识
          id: item.id || `hot-${Date.now()}-${Math.random().toString(36).slice(2)}`
        }));
      });
      return true;
      // async、await本质就是promise的语法糖，我在这里return true，但后续调用这个函数的地方收到的返回值仍然是一个promise：resolved状态，值为 true。
      // 因为async、await内部会自动帮忙转化成promise，当然源头必须本身是promise才能处理，就像这里的await service.getHotList()，
      // 找到源头是返回了一个request请求，返回的本身就是promise，经过这里的语法糖，继续返回的值就和promise直接的.then是一样的，返回的一直都是promise。
    } catch (err) {
      return err;
    }
  }
})


export default hotStore;