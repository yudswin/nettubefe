import TopicContentCard from './TopicContentCard';
import { Content } from '../../types/content';

interface TopicContentRowProps {
    title: string
    slug?: string
    items: Partial<Content>[]
    className?: string
}

const TopicContentRow = ({ title, items, className = '', slug }: TopicContentRowProps) => {
    return (
        <section className="mb-8">
            <a href={`collection/${slug}`} className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${className} bg-clip-text text-transparent`}>{title}</h2>
            </a>

            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {items.map(content => (
                    <TopicContentCard
                        content={content}
                        slug={slug}
                    />
                ))}
            </div>
        </section>
    )
}

export default TopicContentRow;
