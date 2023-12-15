import _axios from 'axios'
import { appConfig } from 'src/configs/app.config'
import { authUtils } from 'src/utils'

// On request rejected
const onRequestError = axiosError => {
    return axiosError
}

// On response fulfilled
const onResponseSuccess = axiosResponse => {
    return axiosResponse
}

// On response rejected
const onResponseError = axiosError => {
    return Promise.reject(axiosError)
}

/**
 * Axios instance
 */
const Axios = _axios.create({
    baseURL: appConfig.apiBaseUrl,
    timeout: 20000,
})

// On request
Axios.interceptors.request.use(
    async config => {
        try {
            const idToken = authUtils.getUserAccessToken()
            if (idToken) {
                config.headers['Authorization'] = `Bearer ${idToken}`
            }
        } catch (e) {
            console.log(e)
        }
        return config
    },
    error => {
        return Promise.reject(onRequestError(error))
    }
)
// On response
Axios.interceptors.response.use(
    async response => {
        return onResponseSuccess(response)
    },
    async error => {
        return onResponseError(error)
    }
)

export default Axios
