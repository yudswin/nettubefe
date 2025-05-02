import home from "../pages/Home"
import user from "../pages/user"

export interface RouteType {
    path: string;
    page: React.ComponentType;
}

const routes: RouteType[] = [
    {
        path: '/',
        page: home,
    },
    {
        path: '/user',
        page: user
    }
]

export default routes