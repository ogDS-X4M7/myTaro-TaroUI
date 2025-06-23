import hotStore from "./hot";
import counterStore from "./counter";
import userStore from "./user";
import videoStore from "./shortvideoes";
import weatherStore from "./weather";
import EnglishStore from "./English";

const rootStore = {
    counterStore,
    hotStore,
    userStore,
    videoStore,
    weatherStore,
    EnglishStore
};
export default rootStore;