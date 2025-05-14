import { useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
    currentPage: string;
    returnPath?: string;
}

const Breadcrumb = ({ currentPage, returnPath }: BreadcrumbProps) => {
    const navigate = useNavigate();

    return (
        <div className="text-sm breadcrumbs font-bold">
            <ul>
                <li>
                    <button
                        onClick={() => navigate('/')}
                        className="text-amber-400 hover:text-amber-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Home
                    </button>
                </li>
                {returnPath && (
                    <li>
                        {(returnPath === "collection") && (
                            <>
                                <button
                                    onClick={() => navigate('/collection')}
                                    className="text-amber-400 hover:text-amber-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>
                                    Collection
                                </button>
                            </>
                        )}
                    </li>
                )}
                <li>
                    <span className="text-amber-300 font-medium">{currentPage}</span>
                </li>
            </ul>
        </div>
    );
};

export default Breadcrumb;