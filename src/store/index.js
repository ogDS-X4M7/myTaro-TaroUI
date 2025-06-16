import hotStore from "./hot";
import counterStore from "./counter";
import userStore from "./user";

const rootStore = {
    counterStore,
    hotStore,
    userStore
};
export default rootStore;