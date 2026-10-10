//src/features/auth/hooks/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

export const useRegister = () => useMutation({ mutationFn: authApi.register })
export const useVerifyOtp = () => useMutation({ mutationFn: authApi.verifyOtp })
export const useResendOtp = () => useMutation({ mutationFn: authApi.resendOtp })
export const useForgotPassword = () => useMutation({ mutationFn: authApi.forgotPassword })
export const useResetPassword = () => useMutation({ mutationFn: authApi.resetPassword })