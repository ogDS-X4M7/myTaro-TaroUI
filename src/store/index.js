import hotStore from "./hot";
import counterStore from "./counter";
import userStore from "./user";
import videoStore from "./shortvideoes";
import weatherStore from "./weather";
import EnglishStore from "./English";
import WordStore from "./word";

const rootStore = {
    counterStore,
    hotStore,
    userStore,
    videoStore,
    weatherStore,
    EnglishStore,
    WordStore
};
export default rootStore;