import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'

import Layout from './components/Layout/Layout'
import { themeRegistry } from './countdown'
import type { ThemeId } from './countdown'
import Index from './pages/Index'
import Notfound from './pages/Notfound'

const isThemeId = (v: unknown): v is ThemeId =>
  typeof v === 'string' && v in themeRegistry

// Root route renders the shared Layout and an <Outlet /> for child routes.
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: () => <Notfound />,
})

export interface CountdownSearch {
  date?: string
  title?: string
  theme?: ThemeId
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
  validateSearch: (search: Record<string, unknown>): CountdownSearch => {
    const date = typeof search.date === 'string' ? search.date : undefined
    const title = typeof search.title === 'string' ? search.title : undefined
    const theme = isThemeId(search.theme) ? search.theme : undefined
    return {
      ...(date ? { date } : {}),
      ...(title ? { title } : {}),
      ...(theme ? { theme } : {}),
    }
  },
})

const routeTree = rootRoute.addChildren([indexRoute])

// `basepath` honours Vite's `base` config (e.g. '/countdown/') so the same
// build works locally and on GitHub Pages.
const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultNotFoundComponent: () => <Notfound />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
