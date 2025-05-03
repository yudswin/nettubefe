import AdminContent from "@pages/contents/AdminContent";
import home from "../pages/home"
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
    },
    {
        path: '/admin',
        page: AdminContent
    }
]

export default routes