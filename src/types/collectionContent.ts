export interface CollectionContent {
    contentId: string;
    contents: {
        _id: string;
        title: string;
        originTitle: string;
        englishTitle: string;
        slug?: string;
        thumbnailPath: string;
        bannerPath?: string;
        overview?: string;
        imdbRating?: string;
        lastestEpisode: number | null;
        lastestSeason: number | null;
        rating: string;
        runtime?: number;
        releaseDate?: string;
        year?: number;
        type: "movie" | "tvshow";
        status?: "finish" | "updating";
        publish: boolean;
    };
    rank: number;
    addedAt: string;
}