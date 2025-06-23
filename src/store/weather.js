import { observable, runInAction } from "mobx";
import service from "../service";
const weatherStore = observable({
  weathers: [],
  city: '',
  async getWeathers(city) {
    try {
      const result = await service.getWeathers(city);
      // console.log(result);
      //   console.log(result.data);
      if (result.data.code === 200 && result.data.data.data) { // 这个接口输入数字能给出200的结果，因此还要看返回数据
        runInAction(() => {
          // 在 runInAction 中修改状态
          this.weathers = result.data.data.data.map(item => ({
            ...item,
            // 如果原数据没有 id，添加唯一标识
            id: item.id || `weather-${Date.now()}-${Math.random().toString(36).slice(2)}`
          }));
          this.city = result.data.data.city;
        });
        return true;
      }
      return '请确认您的城市是否填写正确'; // 没能获取数据，则返回检查
    } catch (err) {
      return err;
    }
  }
})


export default weatherStore;