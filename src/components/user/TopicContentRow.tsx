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
        <section key={slug} className="flex md:flex-row flex-col">
            <div className="flex flex-wrap md:justify-center items-center mb-4 min-w-[16rem] ">
                <a href={`collection/${slug}`} className="md:w-64 text-center items-center flex flex-col group">
                    <h2 className={`text-2xl font-bold bg-gradient-to-r ${className} bg-clip-text text-transparent`}>{title}</h2>
                    <h3 className='md:flex hidden mt-2 text-gray-400 group-hover:text-amber-300 transition-colors ease-in-out delay-75 gap-2 items-center'>
                        <span>View Collection</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </h3>
                </a>
            </div>

            <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
                {items.map((content, index) => (
                    <TopicContentCard
                        key={content._id?.toString() || content.contentId?.toString() || `content-${index}`}
                        index={index}
                        content={content}
                        slug={slug}
                    />
                ))}
            </div>
        </section>
    )
}

export default TopicContentRow;