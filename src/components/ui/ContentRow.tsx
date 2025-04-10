import MediaCard from './MediaCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContentRowProps {
    title: string
    items: any[]
    type: 'continue' | 'recent'
}

const ContentRow = ({ title, items, type }: ContentRowProps) => {
    const { t } = useLanguage();

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <button className="text-amber-500 hover:underline">{t.viewAll}</button>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4">
                {items.map(item => (
                    <MediaCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        progress={item.progress}
                        added={item.added}
                        type={type}
                        movieData={item.movieData}
                    />
                ))}
            </div>
        </section>
    )
}

export default ContentRow;
