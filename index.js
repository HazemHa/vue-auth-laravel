import Vue from 'vue'
import Router from 'vue-router';
import Vuex from 'vuex'
import axios from "axios"
import VueCookies from 'vue-cookies'


Vue.use(Vuex);
Vue.use(VueCookies)

const store = new Vuex.Store({
    state: {
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
    },
    mutations: {
        setCurrentUser(state, payload) {
            $cookies.set("user", payload);
            state.currentUser = payload;
        },

        setAuth(state, payload) {
            state.auth = payload;
        }
    },
    actions: {
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
                axios.post(this.getters.url + data.url, data.data)
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

                let accessToken = $cookies.get("user").access_token;
                let user = $cookies.get('user');
                let authServer = false;
                axios.defaults.headers.common['Authorization'] = "Bearer " + user.access_token;

                axios.get(this.getters.url + data.url)
                    .then(res => {
                        authServer = res.data.auth;
                        if (authServer) {
                            commit('setCurrentUser', res.data.user);
                            commit('setAuth', true);
                            axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
                            resolve(this.getters.isAuth);

                        }
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
                axios.post(this.getters.url + data.url)
                    .then((res) => {
                        commit('setCurrentUser', res.data.user);
                        $cookies.remove("access_token");
                        commit('setAuth', false);
                        resolve(his.getters.isAuth);
                    }).catch((err) => {
                        reject(err);
                    })
            })
        },
    },
});

var authLaravel = {
    install(Vue, defaultOptions = {}) {
        Vue.authLaravel = Vue.prototype.$authLaravel
        if (process.env.NODE_ENV === 'development')
            window.$authLaravel = Vue.prototype.$authLaravel
    },
    login: function (data) {
        store.dispatch('Login', data).then(res => {
            return res;
        }).catch(err => {
            return err;
        });
    },
    checkToken: function (url) {
        store.dispatch('setTokenForRequest', {
            url: url
        }).then(res => {
            return res;
        }).catch(err => {
            return err;
        });
    },
    logout: function (url) {
        store.dispatch('Logout', {
            url: url
        }).then(res => {
            return res;
        }).catch(err => {
            return err;
        });
    },
}
module.exports = authLaravel;