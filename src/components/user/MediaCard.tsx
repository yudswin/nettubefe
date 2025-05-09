import { Media } from '../../types/media'
import { useNavigate } from 'react-router-dom'

export interface MediaCardProps {
    media: Media
    contentType: 'tvshow' | 'movie'
}

const MediaCard = ({ media, contentType }: MediaCardProps) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/player/${media._id}`)}
            key={media._id}
            className=" rounded-lg p-4 gap-4 flex items-center flex-row hover:shadow-lg hover:bg-gray-800 transition-shadow duration-200 hover:cursor-pointer"
        >
            <div
                className="w-36 h-24 bg-cover bg-center rounded flex-shrink-0"
                style={{ backgroundImage: `url()` }}
            >
                <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium truncate" title={media.title}>
                        {media.title}
                    </h4>
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded ml-2">
                        {media.audioType}
                    </span>
                </div>

                <div className="text-sm text-gray-600">
                    <p>Season: {media.season}</p>
                    <p className={`${contentType === 'tvshow' ? "" : "hidden"}`}>Episode: {media.episode}</p>
                </div>
            </div>
        </div>
    )
}

export default MediaCard