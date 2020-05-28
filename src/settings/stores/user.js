import { observable, action, computed } from "mobx";
import AsyncStorage from '@react-native-community/async-storage'

export default class UserStore {

    @observable CartList = [];
    CartKey = '@CartList';

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.fetchCartList();
    }

    @action
    async fetchCartList(): void {
        let res = await AsyncStorage.getItem(this.CartKey) || '[]';
        this.CartList = JSON.parse(res);
    }

    @action
    async addCartList(item) {
        let lists = [...this.CartList];
        this.CartList = lists.concat([item]);
        AsyncStorage.setItem(this.CartKey, JSON.stringify(this.CartList));
    }

    @computed
    get CartListIds() {
        return this.CartList.map(e => e.id)
    }

    @action
    async deleteCartList(index) {
        console.log(index)
        let lists = [...this.CartList];
        lists.splice(index, 1);
        AsyncStorage.setItem(this.CartKey, JSON.stringify(lists));
        this.CartList = lists;
    }
}