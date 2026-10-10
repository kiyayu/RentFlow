//src/features/auth/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from './LoginForm'
import { authApi } from '../api/auth.api'

const renderForm = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>
  )

describe('LoginForm', () => {
  it('shows field errors and does not call the API when empty', async () => {
    const login = vi.spyOn(authApi, 'login')
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('submits valid credentials', async () => {
    const login = vi.spyOn(authApi, 'login').mockResolvedValue({
      id: '1', name: 'T', email: 'a@b.com', emailVerified: true, role: 'customer', createdAt: '',
    })
    renderForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/^password/i), 'anything')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    await vi.waitFor(() => expect(login).toHaveBeenCalledOnce())
    expect(login.mock.calls[0][0]).toEqual({ email: 'a@b.com', password: 'anything' })
  })
})