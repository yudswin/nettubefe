export interface Content {
    _id: string;
    title: string;
    slug?: string;
    thumbnailPath: string;
    bannerPath?: string;
    overview?: string;
    imdbRating?: string;
    runtime?: number;
    releaseDate?: string;
    year?: number;
    type: "movie" | "tvshow";
    status?: "finish" | "updating";
    publish: boolean;
}
