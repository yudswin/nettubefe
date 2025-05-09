import Header from '@components/layout/Header'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PersonService } from '@services/person.service'
import { LoadingSpinner } from '@components/feedback/LoadingSpinner'
import Breadcrumb from '@components/layout/Breadcrumb'
import { Person } from '../types/person'
import { Content } from '../types/content'
import { ContentService } from '@services/content.service'
import ContentCard from '@components/user/ContentCard'
import { Departments, PersonDepartmentService } from '@services/junction/personDepartment.service'

const person = () => {
    const { personId } = useParams<{ personId: string }>()
    const [isLoading, setIsLoading] = useState(true)
    const [person, setPerson] = useState<Person>()
    const [contentList, setContentList] = useState<Content[]>([]);
    const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
    const [departmentList, setDepartmentList] = useState<Departments[]>([]);


    const [toast, setToast] = useState<{
        show: boolean
        message: string
        type: 'success' | 'error'
    }>({ show: false, message: '', type: 'success' })

    const fetchPerson = async () => {
        try {
            setIsLoading(true)
            if (personId) {
                const response = await PersonService.getPersonById(personId)
                if (response.status === 'success') {
                    setPerson(response.result)
                } else {
                    setToast({
                        show: true,
                        message: response.msg || 'Failed to load person',
                        type: 'error'
                    })
                }
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchContent = async () => {
        try {
            setIsLoading(true);
            if (personId) {
                const response = await ContentService.getContentByPerson(personId);

                if (response.status === 'success') {
                    setContentList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.msg || 'Failed to load content',
                        type: 'error'
                    });
                }
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartment = async () => {
        try {
            setIsDepartmentLoading(true)
            if (personId) {
                const response = await PersonDepartmentService.getDepartmentList(personId)
                if (response.status === 'success') {
                    setDepartmentList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.error || 'Failed to load media',
                        type: 'error'
                    })
                }
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsDepartmentLoading(false);
        }
    }

    useEffect(() => {
        fetchPerson()
        fetchContent()
        fetchDepartment()
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div>
                    <Header toggleSidebar={() => { }} sidebarOpen={false} />
                    {person ? (
                        <div className="max-w-7xl mx-auto px-4 py-16">
                            {/* Hero Section */}
                            <div className="hero mb-8">
                                <div className="hero-content flex-col lg:flex-row gap-8">
                                    {person.profilePath && (
                                        <img
                                            src={`https://media.themoviedb.org/${person.profilePath}`}
                                            className="max-w-md rounded-xl shadow-2xl"
                                            alt={person.name}
                                        />
                                    )}
                                    <div className="flex flex-col gap-4">
                                        <h1 className="text-5xl font-bold">
                                            {person.name}
                                        </h1>
                                        {isDepartmentLoading && <LoadingSpinner />}
                                        {departmentList.map((department) => (
                                            <div
                                                key={department.departmentId}
                                                className="badge badge-outline badge-primary gap-1 hover:bg-primary hover:text-primary-content transition-colors">
                                                <span className="transition-opacity">
                                                    {department.departmentName}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="grid gap-8">
                                <div className="text-lg">
                                    <Breadcrumb currentPage={person.name} />
                                </div>
                                {/* Additional Sections Can Be Added Here */}
                                <div className="flex flex-wrap gap-8">
                                    {contentList.length > 0 ? (
                                        contentList.map((content) => (
                                            <ContentCard
                                                content={content}
                                            />
                                        ))
                                    ) : (
                                        !isLoading && <div className="text-gray-400">No content available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-error max-w-7xl mx-auto my-8">
                            <div className="flex-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <label>Person not found</label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default person