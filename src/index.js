import Vue from 'vue'
import Vuex from 'vuex'
//import axios from "axios"
import VueCookies from 'vue-cookies'


Vue.use(Vuex);
//Vue.use(axios);
Vue.use(VueCookies);


const store = new Vuex.Store({
    state: {
        baseURL: "http://" + window.location.hostname + "/",
        currentUser: {
            access_token: undefined,
            id: -1,
        },
        auth: false,
    },
    getters: {
        getCurrentUser(state) {
            return state.currentUser;
        },
        isAuth(state) {
            return state.auth;
        },
        baseURL(state) {
            return state.baseURL;
        }
    },
    mutations: {
        setCurrentUser(state, payload) {
            VueCookies.set("user", payload);
            state.currentUser = payload;
        },

        setAuth(state, payload) {
            state.auth = payload;
        },
        setUrl(state, payload) {
            state.baseURL = payload;
        }
    },
    actions: {
        setURL({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                commit('setUrl', data);
                resolve(this.getters.isAuth);

            })
        },
        updateIsAuth({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                commit('setAuth', data);
                resolve(his.getters.isAuth);

            })
        },
        Login({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                axios.post(this.getters.baseURL + data.url, data)
                    .then((res) => {
                        if (res.data.auth) {
                            axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.user.access_token;
                            commit('setCurrentUser', res.data.user);
                            commit('setAuth', true);
                        }
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    })
            })
        },
        setTokenForRequest({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                let oldAuth = VueCookies.get("user");
                if (oldAuth && oldAuth.access_token) {
                    axios.defaults.headers.common['Authorization'] = "Bearer " + oldAuth.access_token;
                }
                axios.get(this.getters.baseURL + data.url)
                    .then(res => {
                        let authServer = res.data.auth;
                        commit('setAuth', authServer);
                        if (authServer) {
                            commit('setCurrentUser', res.data.user);
                            axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.user.access_token;
                        }
                        resolve(this.getters.isAuth);
                    }).catch(err => {
                        commit('setAuth', false);
                        reject(err);
                    })


            });
        },
        Logout({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                axios.post(this.getters.baseURL + data.url, data.data)
                    .then((res) => {
                        commit('setCurrentUser', res.data.user);
                        $cookies.remove("access_token");
                        commit('setAuth', false);
                        resolve(this.getters.isAuth);
                    }).catch((err) => {
                        reject(err);
                    })
            })
        },
    },
});

export default {
    install(Vue, defaultOptions) {
        Vue.prototype.$authLaravel = this;
    },
    login: function (data) {
        return store.dispatch('Login', data).then(res => {
            return Promise.resolve(res);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    checkToken: function (url) {
        return store.dispatch('setTokenForRequest', {
            url: url
        }).then(res => {
            return Promise.resolve(res);
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    logout: function (url, data) {
        return store.dispatch('Logout', {
            url: url,
            data: data
        }).then(res => {
            return Promise.resolve(res);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    setURL: function (url) {
        store.dispatch('setURL', url);
    },
    isAuth: function () {
        return store.getters.isAuth;
    }
}
