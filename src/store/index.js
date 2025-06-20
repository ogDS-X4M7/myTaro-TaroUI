import hotStore from "./hot";
import counterStore from "./counter";
import userStore from "./user";
import videoStore from "./shortvideoes";

const rootStore = {
    counterStore,
    hotStore,
    userStore,
    videoStore
};
export default rootStore;