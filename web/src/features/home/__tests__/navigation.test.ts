/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { Route } from '@/routes/index'

vi.mock('@/features/home', () => ({ Home: () => null }))

const clients: QueryClient[] = []

afterEach(() => {
  clients.forEach((client) => client.clear())
  clients.length = 0
})

describe('home navigation', () => {
  it.each([
    ['disabled', '{"home":false}', true],
    ['enabled', '{"home":true}', false],
    ['missing', undefined, false],
    ['invalid', '{invalid', false],
  ])('%s homepage setting', async (_, HeaderNavModules, shouldRedirect) => {
    const queryClient = new QueryClient()
    clients.push(queryClient)
    queryClient.setQueryData(STATUS_QUERY_KEY, { HeaderNavModules })
    const beforeLoad = Route.options.beforeLoad
    expect(beforeLoad).toBeTypeOf('function')
    if (!beforeLoad) return
    const load = async () =>
      beforeLoad({ context: { queryClient } } as Parameters<
        typeof beforeLoad
      >[0])
    if (shouldRedirect) {
      await expect(load()).rejects.toMatchObject({
        options: { to: '/dashboard', replace: true },
      })
    } else {
      await expect(load()).resolves.toBeUndefined()
    }
  })
})
