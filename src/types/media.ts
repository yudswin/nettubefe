export interface Cast {
    id: number;
    name: string;
    character: string;
    image: string;
}

export interface Episode {
    id: number;
    title: string;
    number: number;
    image: string;
    duration: string;
    description?: string;
}

export interface Movie {
    id: number;
    title: string;
    image: string;
    coverImage?: string;
    description: string;
    year: string;
    duration: string;
    rating: string;
    progress?: number;
    added?: string;
    cast: Cast[];
    episodes?: Episode[];
}

export interface Media {
    _id: string,
    episode: number,
    season: number, 
    publicId: string,
    title: string,
    audioType: 'subtitle' | 'original' | 'voiceover'
    contentId: string,
}