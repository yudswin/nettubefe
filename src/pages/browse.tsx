import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ContentService, BrowseParams } from '../services/content.service';
import { GenreService } from '../services/genre.service';
import { CountryService } from '../services/country.service';
import { Content } from '../types/content';
import { Genre } from '../types/genre';
import { Country } from '../types/country';
import ContentCard from '../components/user/ContentCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const browse = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<Content[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        totalItems: 0,
        totalPages: 0
    });

    const [genres, setGenres] = useState<Genre[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [genresLoading, setGenresLoading] = useState(false);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [genresError, setGenresError] = useState<string | null>(null);
    const [countriesError, setCountriesError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [filters, setFilters] = useState<BrowseParams>({
        years: '',
        type: '',
        status: '',
        genreSlugs: '',
        countrySlugs: '',
        page: 1,
        limit: 20
    });

    const typeOptions = ['movie', 'tvshow', 'all'];
    const statusOptions = ['released', 'upcoming', 'all'];
    const yearOptions = Array.from({ length: 2025 - 1990 }, (_, i) => (2025 - i).toString());

    useEffect(() => {
        const initialFilters: BrowseParams = {
            years: searchParams.get('years') || undefined,
            type: searchParams.get('type') || undefined,
            status: searchParams.get('status') || undefined,
            genreSlugs: searchParams.get('genreSlugs') || undefined,
            countrySlugs: searchParams.get('countrySlugs') || undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page') || '1') : 1,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit') || '20') : 20
        };
        setFilters(initialFilters);
    }, [searchParams]);

    useEffect(() => {
        const fetchGenres = async () => {
            setGenresLoading(true);
            try {
                const response = await GenreService.getGenreList();
                if (response.status === 'success') {
                    setGenres(response.result);
                } else {
                    setGenresError(response.msg || 'Failed to load genres');
                }
            } catch (error) {
                setGenresError('Failed to fetch genres');
            } finally {
                setGenresLoading(false);
            }
        };

        const fetchCountries = async () => {
            setCountriesLoading(true);
            try {
                const response = await CountryService.getCountryList();
                if (response.status === 'success') {
                    setCountries(response.result);
                } else {
                    setCountriesError(response.msg || 'Failed to load countries');
                }
            } catch (error) {
                setCountriesError('Failed to fetch countries');
            } finally {
                setCountriesLoading(false);
            }
        };

        fetchGenres();
        fetchCountries();
    }, []);

    useEffect(() => {
        fetchContent();
    }, [filters]);

    const fetchContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ContentService.getBrowseContent(filters);
            if (response.status === 'success' && response.result) {
                setContent(response.result.results);
                setPagination(response.result.pagination);
            } else {
                setError(response.msg || 'Failed to fetch content');
                setContent([]);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setContent([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof BrowseParams, value: string | number) => {
        const newFilters: BrowseParams = { ...filters };
        if (key === 'page') {
            newFilters.page = typeof value === 'string' ? parseInt(value) : value;
        } else {
            (newFilters[key] as any) = value;
            newFilters.page = 1;
        }
        setFilters(newFilters);

        const newParams = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v !== '' && v !== undefined) {
                newParams.set(k, v.toString());
            }
        });
        setSearchParams(newParams);
    };

    const handleYearSelect = (year: string, isSelected: boolean) => {
        let years = filters.years?.split(',').filter(y => y) || [];
        years = isSelected ? years.filter(y => y !== year) : [...years, year];
        handleFilterChange('years', years.join(','));
    };

    const handleGenreSelect = (slug: string, isSelected: boolean) => {
        let genreSlugs = filters.genreSlugs?.split(',').filter(g => g) || [];
        genreSlugs = isSelected ? genreSlugs.filter(g => g !== slug) : [...genreSlugs, slug];
        handleFilterChange('genreSlugs', genreSlugs.join(','));
    };

    const handleCountrySelect = (slug: string, isSelected: boolean) => {
        let countrySlugs = filters.countrySlugs?.split(',').filter(c => c) || [];
        countrySlugs = isSelected ? countrySlugs.filter(c => c !== slug) : [...countrySlugs, slug];
        handleFilterChange('countrySlugs', countrySlugs.join(','));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderPagination = () => {
        return (
            <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                    {/* First page */}
                    <button
                        onClick={() => handleFilterChange('page', 1)}
                        disabled={pagination.page === 1}
                        className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        &laquo;
                    </button>

                    {/* Previous page */}
                    <button
                        onClick={() => handleFilterChange('page', pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        &lsaquo;
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        // Calculate the page number to display
                        let pageNum = pagination.page;
                        if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                        } else {
                            pageNum = pagination.page - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handleFilterChange('page', pageNum)}
                                className={`px-3 py-1 rounded ${pageNum === pagination.page ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Next page */}
                    <button
                        onClick={() => handleFilterChange('page', pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className={`px-3 py-1 rounded ${pagination.page === pagination.totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        &rsaquo;
                    </button>

                    {/* Last page */}
                    <button
                        onClick={() => handleFilterChange('page', pagination.totalPages)}
                        disabled={pagination.page === pagination.totalPages}
                        className={`px-3 py-1 rounded ${pagination.page === pagination.totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        &raquo;
                    </button>
                </nav>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

            <div className={`flex-1 transition-all duration-300 ease-in-out pt-16
                ${sidebarOpen ? 'md:ml-56' : 'md:ml-0'} ml-0`}>

                <main className="p-4 md:p-8 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-8">Browse Content</h1>

                    {/* Filters Section */}
                    <div className="bg-gradient-to-b from-[#272b3a] to-gray-900 p-6 rounded-2xl mb-8">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Type Filter */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Content Type</h3>
                                <div className="flex flex-wrap gap-2">
                                    {typeOptions.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => handleFilterChange('type', type === 'all' ? '' : type)}
                                            className={`px-3 py-1 rounded-lg ${(type === 'all' && !filters.type) || filters.type === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleFilterChange('status', status === 'all' ? '' : status)}
                                            className={`px-3 py-1 rounded-lg ${(status === 'all' && !filters.status) || filters.status === status
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Range Filter */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <h3 className="text-lg font-medium mb-2">Release Years</h3>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-hide">
                                    {yearOptions.map(year => {
                                        const isSelected = filters.years?.split(',').includes(year) || false;
                                        return (
                                            <button
                                                key={year}
                                                onClick={() => handleYearSelect(year, isSelected)}
                                                className={`px-3 py-1 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                            >
                                                {year}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Genres Filter */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Genres</h3>
                                {genresLoading ? (
                                    <LoadingSpinner />
                                ) : genresError ? (
                                    <div className="text-red-500 text-sm">{genresError}</div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map(genre => {
                                            const isSelected = filters.genreSlugs?.split(',').includes(genre.slug) || false;
                                            return (
                                                <button
                                                    key={genre.slug}
                                                    onClick={() => handleGenreSelect(genre.slug, isSelected)}
                                                    className={`px-3 py-1 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                                >
                                                    {genre.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Countries Filter */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Countries</h3>
                                {countriesLoading ? (
                                    <LoadingSpinner />
                                ) : countriesError ? (
                                    <div className="text-red-500 text-sm">{countriesError}</div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {countries.map(country => {
                                            const isSelected = filters.countrySlugs?.split(',').includes(country.slug) || false;
                                            return (
                                                <button
                                                    key={country.slug}
                                                    onClick={() => handleCountrySelect(country.slug, isSelected)}
                                                    className={`px-3 py-1 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                                >
                                                    {country.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Items per page */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Items per page</h3>
                                <select
                                    value={filters.limit}
                                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                                    className="px-3 py-2 rounded-lg bg-gray-700 text-white border-gray-600"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear filters button */}
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setFilters({
                                        years: '',
                                        type: '',
                                        status: '',
                                        genreSlugs: '',
                                        countrySlugs: '',
                                        page: 1,
                                        limit: 20
                                    });
                                    setSearchParams({});
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Content Results */}
                    <div className="bg-gradient-to-b from-[#272b3a] to-gray-900 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Results</h2>
                            <div className="text-gray-300">
                                {pagination.totalItems > 0 ?
                                    `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.totalItems)} of ${pagination.totalItems} items` :
                                    'No results found'}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <LoadingSpinner />
                            </div>
                        ) : error ? (
                            <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
                                {error}
                            </div>
                        ) : content.length === 0 ? (
                            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
                                <p className="text-gray-300">No content found matching your filters.</p>
                                <p className="mt-2 text-gray-400">Try adjusting your filter criteria.</p>
                            </div>
                        ) : content.length === 0 ? (
                            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
                                <p className="text-gray-300">No content found matching your filters.</p>
                                <p className="mt-2 text-gray-400">Try adjusting your filter criteria.</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-6">
                                {content.map(item => (
                                    <ContentCard key={item._id} content={item} />
                                ))}
                            </div>
                        )}
                        {/* Pagination */}
                        {!loading && !error && content.length > 0 && renderPagination()}
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default browse;