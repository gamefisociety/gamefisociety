
import axios from "axios";

axios.interceptors.request.use(function (config) {
    return config
}, function (error) {

    return Promise.reject(error)
})

axios.interceptors.response.use(function (config) {

    return config
}, function (error) {
    return Promise.reject(error)
})


function requset(config) {
    return new Promise((resolve, reject) => {
        _apiAxios(resolve, reject, config.method, config.url, config.params, config.data, config.header, config.addheader);
    });
}

function _apiAxios(_resolve, _reject, method = "get", url = "", params = {}, data = {}, header = {}, addheader = {}) {
    axios({
        method: method,
        url: url,
        params:params,
        data:data,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        withCredentials: false
    }).then((res) => {
        if (res.status === 200) {
            _resolve(res.data)
        } else {
            _reject(res)
        }
    }, err => {
        _reject(err)
    }).catch((err) => {
        _reject(err.response)
    })
}

export default requset;
