import AdminContent from "@pages/contents/AdminContent";
import home from "../pages/home"
import user from "../pages/user"
import Player from "@pages/player";
import movie from "@pages/movie";

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
    },
    {
        path: '/player/:mediaId',
        page: Player
    },
    {
        path: '/movie/:contentId',
        page: movie
    }
]

export default routes