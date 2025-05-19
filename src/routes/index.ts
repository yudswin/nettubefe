import AdminContent from "@pages/contents/AdminContent";
import home from "../pages/home"
import Player from "@pages/player";
import movie from "@pages/movie";
import person from "@pages/person";
import collection from "@pages/collection";
import collectionList from "@pages/collectionList";
import browse from "@pages/browse";


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
    },
    {
        path: '/person/:personId',
        page: person
    },
    {
        path: '/collection/:slug',
        page: collection
    },
    {
        path: '/collection',
        page: collectionList,
    },
    {
        path: '/browse',
        page: browse
    }
]

export default routes