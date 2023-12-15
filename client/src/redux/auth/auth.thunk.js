import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthAPI } from 'src/api'

export const auth_loginWithEmailAndPassword = createAsyncThunk(
    '@auth/loginWithEmailAndPassword',
    async (body, { rejectWithValue }) => {
        try {
            const response = await AuthAPI.loginWithEmailAndPassword(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const auth_getUser = createAsyncThunk('@auth/getUser', async (token) => {
    return await AuthAPI.getAuthenticatedUser(token)
})

export const auth_logout = createAsyncThunk('@auth/logout', async (token) => {
    return await AuthAPI.revokeToken(token)
})
