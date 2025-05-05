import { useEffect, useState } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Department } from "../../types/department";
import { DepartmentService } from "@services/department.service";
import { Toast } from "@components/feedback/Toast";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { LoadingSpinner } from "@components/feedback/LoadingSpinner";

const DepartmentTab = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: "success" | "error";
    }>({ show: false, message: "", type: "success" });
    const [countries, setCountries] = useState<Department[]>([]);
    const [newDepartment, setNewDepartment] = useState<Omit<Department, "_id">>({
        name: "",
        slug: "",
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const fetchCountries = async () => {
        try {
            setIsLoading(true);
            const response = await DepartmentService.getDepartmentList();
            if (response.status === "success") {
                setCountries(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load countries',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({ show: true, message: "Failed to fetch countries", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const columnHelper = createColumnHelper<Department>();
    const columns = [
        columnHelper.accessor("name", {
            header: "Department Name",
            cell: ({ row }) =>
                editingId === row.original._id ? (
                    <input
                        type="text"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                        disabled
                        className="border p-1"
                    />
                ) : (
                    row.original.name
                ),
        }),
        columnHelper.accessor("slug", {
            header: "Slug",
            cell: ({ row }) =>
                editingId === row.original._id ? (
                    <input
                        type="text"
                        value={newDepartment.slug}
                        onChange={(e) => setNewDepartment({ ...newDepartment, slug: e.target.value })}
                        disabled
                        className="border p-1"
                    />
                ) : (
                    row.original.slug
                ),
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="space-x-2">
                    {editingId === row.original._id ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="text-gray-600 hover:text-green-500 btn btn-ghost hover:bg-[#99f099] border-1  bg-[#b5f0ad] hover:border-green-400"
                                disabled={isSaving}
                            >
                                {isSaving ? <LoadingSpinner /> :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                }
                            </button>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setNewDepartment({ name: "", slug: "" });
                                }}
                                className="text-gray-600 hover:text-gray-500 btn btn-ghost hover:bg-[#d5dad5] border-1  bg-[#b1beaf] hover:border-gray-400"
                                disabled={isSaving}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setEditingId(row.original._id);
                                    setNewDepartment(row.original);
                                }}
                                className="text-gray-600 hover:text-white btn btn-ghost hover:bg-[#97a0a8] border-1  bg-[#d9e4ee] hover:border-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>

                            </button>
                            <button
                                onClick={() => handleDelete(row.original._id)}
                                className="text-gray-600 hover:text-red-500 btn btn-ghost hover:bg-[#f09999] border-1  bg-[#f0adad] hover:border-red-600"
                                disabled={isDeletingId === row.original._id}
                            >
                                {isDeletingId === row.original._id ? (
                                    <LoadingSpinner />
                                ) :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>

                                }
                            </button>
                        </>
                    )}
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: countries,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });


    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this Department?")) {
            try {
                setIsDeletingId(id);
                const response = await DepartmentService.deleteDepartment(id);
                if (response.status === "success") {
                    setToast({ show: true, message: "Department deleted", type: "success" });
                    await fetchCountries();
                } else {
                    setToast({ show: true, message: "Failed to delete Department", type: "error" });
                }
            } catch (error) {
                setToast({ show: true, message: "Failed to delete Department", type: "error" });
            } finally {
                setIsDeletingId(null);
            }
        }
    };

    const handleSave = async () => {
        if (!newDepartment.name || !newDepartment.slug) {
            setToast({ show: true, message: "Please fill in all fields", type: "error" });
            return;
        }

        try {
            setIsSaving(true);
            let response;
            if (editingId) {
                response = await DepartmentService.updateDepartment(editingId, newDepartment);
            } else {
                response = await DepartmentService.createDepartment(newDepartment);
            }

            if (response.status === "success") {
                setToast({
                    show: true,
                    message: editingId ? "Department updated" : "Department created",
                    type: "success",
                });
                await fetchCountries();
                setEditingId(null);
                setNewDepartment({ name: "", slug: "" });
            } else {
                setToast({
                    show: true,
                    message: response.msg || (editingId ? "Failed to update Department" : "Failed to create Department"),
                    type: "error"
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: editingId ? "Failed to update Department" : "Failed to create Department",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="p-4 relative">
            {isLoading && <FullPageLoader />}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Department Name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    className="border p-2"
                />
                <input
                    type="text"
                    placeholder="slug"
                    value={newDepartment.slug}
                    onChange={(e) => setNewDepartment({ ...newDepartment, slug: e.target.value })}
                    className="border p-2"
                />
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <LoadingSpinner />
                    ) : editingId ? (
                        "Update Department"
                    ) : (
                        "Add Department"
                    )}
                </button>
            </div>

            <table className="table w-full border-collapse">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="bg-amber-500">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="p-3 text-left border-b border-gray-200 text-white"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className={` ${row.original._id == editingId ? "bg-amber-800" : "hover:bg-gray-700"}`}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className={`p-3 border-b border-gray-200 `}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentTab;