"use client";

import Layout from "@/Layouts/layout/layout";
import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Tag } from "primereact/tag";

export default function UserManagement({ users }) {
    // State management
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [dataUsers, setDataUsers] = useState(users);
    const [openDialogTambah, setDialogTambah] = useState(false);
    const [dialogEdit, setDialogEdit] = useState(false);
    const [ruangans, setRuangans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedCities, setSelectedCities] = useState(null);
    const [user, setUser] = useState({
        id: null,
        name: "",
        ruangan_id: [],
        email: "",
        password: "",
        password_confirmation: "",
    });

    const toast = useRef(null);

    // Fetch ruangan data
    const fetchRuangans = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                window.route("admin.users.get-ruangan")
            );
            setRuangans(res.data);
        } catch (error) {
            console.error("Failed to fetch ruangans", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to load room data",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Open dialog for new user
    const openNewDialog = async () => {
        await fetchRuangans();
        setUser({
            id: null,
            name: "",
            ruangan_id: [],
            email: "",
            password: "",
            password_confirmation: "",
        });
        setSelectedCities(null);
        setErrors({});
        setDialogTambah(true);
    };

    // Open dialog for editing user
    const openEditDialog = async (data) => {
        await fetchRuangans();

        const transformedRuangan = data.ruangan.map((item) => ({
            id: item.ruangan.id,
            name: item.ruangan.nama_ruangan,
            code: item.ruangan.id,
            nama_ruangan: item.ruangan.nama_ruangan,
        }));

        setUser({
            id: data.id,
            name: data.name,
            ruangan_id: transformedRuangan,
            email: data.email,
            password: "",
            password_confirmation: "",
        });

        setSelectedCities(transformedRuangan);
        setErrors({});
        setDialogEdit(true);
    };

    // Handle input changes
    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [field]: value }));

        // Clear error for this field when user types
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (user.id) {
                // Update existing user
                const res = await axios.patch(
                    window.route("admin.users.update", user.id),
                    user
                );
                setDataUsers((prevData) =>
                    prevData.map((u) => (u.id === res.data.id ? res.data : u))
                );
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: `User ${user.name} updated successfully`,
                    life: 3000,
                });
                resetForm();
            } else {
                // Create new user
                const res = await axios.post(
                    window.route("admin.users.store"),
                    user
                );
                setDataUsers((prevData) => [res.data, ...prevData]);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: `User ${user.name} created successfully`,
                    life: 3000,
                });
                resetForm();
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.response?.data?.message || "An error occurred",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirmation = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: `Are you sure you want to delete ${rowData.name}?`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    setLoading(true);
                    await axios.delete(
                        window.route("admin.users.destroy", rowData.id)
                    );
                    setDataUsers((prevData) =>
                        prevData.filter((user) => user.id !== rowData.id)
                    );
                    toast.current.show({
                        severity: "success",
                        summary: "Deleted",
                        detail: `User ${rowData.name} deleted successfully`,
                        life: 3000,
                    });
                } catch (error) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: `Error deleting user: ${error.message}`,
                        life: 3000,
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    // Reset form
    const resetForm = () => {
        setUser({
            id: null,
            name: "",
            ruangan_id: [],
            email: "",
            password: "",
            password_confirmation: "",
        });
        setSelectedCities(null);
        setErrors({});
        setDialogTambah(false);
        setDialogEdit(false);
    };

    // Dialog footer
    const renderFooter = () => (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={resetForm}
                className="p-button-text"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={loading}
            />
        </div>
    );

    // Action buttons for each row
    const renderActionBody = (rowData) => (
        <div className="flex gap-2 justify-content-center">
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                loading={loading && user.id === rowData.id}
                className="p-button-sm"
                tooltip="Edit"
                tooltipOptions={{ position: "top" }}
                onClick={() => openEditDialog(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                className="p-button-sm"
                tooltip="Delete"
                tooltipOptions={{ position: "top" }}
                onClick={(event) => handleDeleteConfirmation(event, rowData)}
            />
        </div>
    );

    // Render room badges
    const renderRuangan = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                {rowData.ruangan.map((data) => (
                    <Tag
                        key={data.id}
                        value={data.ruangan.nama_ruangan}
                        severity="info"
                        className="mr-1 mb-1"
                    />
                ))}
            </div>
        );
    };

    // Search handler
    const onInputSearch = (e) => {
        setGlobalFilter(e.target.value);
    };

    return (
        <Layout>
            <ConfirmPopup />
            <Toast ref={toast} />

            {/* User Form Dialog */}
            <Dialog
                visible={openDialogTambah || dialogEdit}
                style={{ width: "500px" }}
                breakpoints={{ "960px": "80vw", "641px": "95vw" }}
                header={user.id ? "Edit User" : "Add New User"}
                modal
                className="p-fluid"
                footer={renderFooter()}
                onHide={resetForm}
                draggable={false}
                resizable={false}
            >
                <div className="grid formgrid p-2">
                    <div className="field col-12 mb-3">
                        <label htmlFor="name" className="font-bold block mb-2">
                            Name
                        </label>
                        <InputText
                            id="name"
                            required
                            autoFocus
                            onChange={(e) => handleInputChange(e, "name")}
                            value={user.name}
                            placeholder="Enter name"
                            className={classNames({ "p-invalid": errors.name })}
                        />
                        {errors.name && (
                            <small className="p-error block mt-1">
                                {errors.name}
                            </small>
                        )}
                    </div>

                    <div className="field col-12 mb-3">
                        <label htmlFor="email" className="font-bold block mb-2">
                            Email
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            required
                            onChange={(e) => handleInputChange(e, "email")}
                            value={user.email}
                            placeholder="Enter email address"
                            className={classNames({
                                "p-invalid": errors.email,
                            })}
                        />
                        {errors.email && (
                            <small className="p-error block mt-1">
                                {errors.email}
                            </small>
                        )}
                    </div>

                    <div className="field col-12 mb-3">
                        <label
                            htmlFor="ruangan"
                            className="font-bold block mb-2"
                        >
                            Assigned Rooms
                        </label>
                        <MultiSelect
                            value={selectedCities}
                            filter
                            onChange={(e) => {
                                setUser((prevUser) => ({
                                    ...prevUser,
                                    ruangan_id: e.value,
                                }));
                                setSelectedCities(e.value);

                                // Clear error when selection changes
                                if (errors.ruangan_id) {
                                    setErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.ruangan_id;
                                        return newErrors;
                                    });
                                }
                            }}
                            options={ruangans}
                            optionLabel="name"
                            placeholder="Select rooms"
                            maxSelectedLabels={3}
                            className={classNames("w-full", {
                                "p-invalid": errors.ruangan_id,
                            })}
                            display="chip"
                        />
                        {errors.ruangan_id && (
                            <small className="p-error block mt-1">
                                {errors.ruangan_id}
                            </small>
                        )}
                    </div>

                    <Divider className="col-12" />

                    <div className="field col-12 mb-3">
                        <label
                            htmlFor="password"
                            className="font-bold block mb-2"
                        >
                            Password{" "}
                            {user.id && (
                                <span className="text-sm text-gray-500">
                                    (leave blank to keep current)
                                </span>
                            )}
                        </label>
                        <InputText
                            id="password"
                            type="password"
                            onChange={(e) => handleInputChange(e, "password")}
                            value={user.password}
                            placeholder="Enter password"
                            className={classNames({
                                "p-invalid": errors.password,
                            })}
                        />
                        {errors.password && (
                            <small className="p-error block mt-1">
                                {errors.password}
                            </small>
                        )}
                    </div>

                    <div className="field col-12 mb-3">
                        <label
                            htmlFor="password_confirmation"
                            className="font-bold block mb-2"
                        >
                            Confirm Password
                        </label>
                        <InputText
                            id="password_confirmation"
                            type="password"
                            onChange={(e) =>
                                handleInputChange(e, "password_confirmation")
                            }
                            value={user.password_confirmation}
                            placeholder="Confirm password"
                            className={classNames({
                                "p-invalid": errors.password_confirmation,
                            })}
                        />
                        {errors.password_confirmation && (
                            <small className="p-error block mt-1">
                                {errors.password_confirmation}
                            </small>
                        )}
                    </div>
                </div>
            </Dialog>

            {/* Main Content */}
            <div className="grid">
                <div className="col-12">
                    <Card>
                        <Toolbar
                            className="mb-4"
                            start={
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        label="Add New User"
                                        icon="pi pi-plus"
                                        severity="primary"
                                        onClick={openNewDialog}
                                        loading={loading}
                                    />
                                </div>
                            }
                            end={
                                <div className="flex align-items-center">
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-search" />
                                        <InputText
                                            type="search"
                                            value={globalFilter}
                                            onChange={onInputSearch}
                                            placeholder="Search..."
                                        />
                                    </span>
                                </div>
                            }
                        />

                        <DataTable
                            value={dataUsers}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                            globalFilter={globalFilter}
                            filters={filters}
                            emptyMessage="No users found"
                            loading={loading}
                            responsiveLayout="stack"
                            breakpoint="960px"
                            stripedRows
                            header={
                                <div className="flex justify-content-between align-items-center">
                                    <h3 className="m-0">Admin Management</h3>
                                </div>
                            }
                        >
                            <Column
                                field="name"
                                header="Name"
                                sortable
                                style={{ minWidth: "12rem" }}
                                headerClassName="text-primary font-bold"
                            />
                            <Column
                                field="email"
                                header="Email"
                                sortable
                                style={{ minWidth: "14rem" }}
                                headerClassName="text-primary font-bold"
                            />
                            <Column
                                field="ruangan"
                                header="Assigned Rooms"
                                body={renderRuangan}
                                style={{ minWidth: "16rem" }}
                                headerClassName="text-primary font-bold"
                            />
                            <Column
                                body={renderActionBody}
                                exportable={false}
                                style={{
                                    minWidth: "8rem",
                                    textAlign: "center",
                                }}
                                headerClassName="text-center"
                                header="Actions"
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
