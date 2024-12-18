import Layout from "@/Layouts/layout/layout";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { FilterMatchMode } from "primereact/api";

export default function Index({ users }) {
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const onInputSearch = (e) => {
        var value = e.target.value;
        setGlobalFilter(value);
    };
    const [dataUsers, setDataUsers] = useState(users);
    const [openDialogTambah, setDialogTambah] = useState(false);
    const [ruangans, setRuangans] = useState([]);
    const [btnNew, setBtnNew] = useState(false);
    const [errors, setErrors] = useState([]);
    const [user, setUser] = useState({
        id: null, // Add ID for editing
        name: "",
        ruangan_id: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [selectedRuangan, setSelectedRuangan] = useState(null);
    const [dialogEdit, setDialogEdit] = useState(false);

    const toast = useRef(null);

    const fetchRuangans = async () => {
        try {
            setBtnNew(true);
            const res = await axios.get(route("admin.users.get-ruangan"));
            setRuangans(res.data);
        } catch (error) {
            console.error("Failed to fetch ruangans", error);
        } finally {
            setBtnNew(false);
        }
    };

    const openNewDialog = async () => {
        await fetchRuangans();
        setUser({
            id: null,
            name: "",
            ruangan_id: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
        setDialogTambah(true);
    };

    const openEditDialog = async (data) => {
        await fetchRuangans();
        setUser({
            id: data.id,
            name: data.name,
            ruangan_id: data.ruangan_id,
            email: data.email,
            password: "",
            password_confirmation: "",
        });
        setSelectedRuangan(ruangans.find((r) => r.id === data.ruangan_id));
        setDialogEdit(true);
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [field]: value }));
    };

    const handleDropdownChange = (e) => {
        setSelectedRuangan(e.value);
        setUser((prevUser) => ({ ...prevUser, ruangan_id: e.value.id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.id) {
            // Update existing user
            try {
                const res = await axios.patch(
                    route("admin.users.update", user.id),
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
            } catch (error) {
                setErrors(error.response?.data?.errors || []);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        error.response?.data?.message || "Error updating user",
                    life: 3000,
                });
            }
        } else {
            // Create new user
            try {
                const res = await axios.post(route("admin.users.store"), user);
                setDataUsers((prevData) => [res.data, ...prevData]);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: `User ${user.name} created successfully`,
                    life: 3000,
                });
                resetForm();
            } catch (error) {
                setErrors(error.response?.data?.errors || []);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        error.response?.data?.message || "Error creating user",
                    life: 3000,
                });
            }
        }
    };

    const handleDeleteConfirmation = async (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Do you want to delete this record?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(
                        route("admin.users.destroy", rowData.id)
                    );
                    setDataUsers((prevData) =>
                        prevData.filter((user) => user.id !== rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Deleted",
                        detail: `User ${rowData.name} deleted successfully`,
                        life: 3000,
                    });
                } catch (error) {
                    console.error("Failed to delete user", error);
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: `Error deleting user: ${error.message}`,
                        life: 3000,
                    });
                }
            },
        });
    };

    const resetForm = () => {
        setUser({
            id: null,
            name: "",
            ruangan_id: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
        setErrors([]);
        setDialogTambah(false);
        setDialogEdit(false);
    };

    const renderFooter = () => (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={resetForm}
            />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
        </>
    );

    const renderSelectedRuangan = (option) => (
        <div className="flex align-items-center">
            <div>{option?.nama_ruangan || "Select a Room"}</div>
        </div>
    );

    const renderRuanganTemplate = (option) => (
        <div className="flex align-items-center">
            <div>{option.nama_ruangan}</div>
        </div>
    );

    const renderActionBody = (rowData) => (
        <>
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                loading={btnNew}
                className="mr-2"
                onClick={() => openEditDialog(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                onClick={(event) => handleDeleteConfirmation(event, rowData)}
            />
        </>
    );

    return (
        <Layout>
            <ConfirmPopup />
            <Toast ref={toast} />
            <Dialog
                visible={openDialogTambah || dialogEdit}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={user.id ? "Edit User" : "New User"}
                modal
                className="p-fluid"
                footer={renderFooter()}
                onHide={resetForm}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText
                        id="name"
                        required
                        autoFocus
                        onChange={(e) => handleInputChange(e, "name")}
                        value={user.name}
                        placeholder="Enter Name..."
                    />
                    {errors.name && (
                        <small className="p-error">{errors.name}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText
                        id="email"
                        type="email"
                        required
                        onChange={(e) => handleInputChange(e, "email")}
                        value={user.email}
                        placeholder="Enter Email..."
                    />
                    {errors.email && (
                        <small className="p-error">{errors.email}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Room
                    </label>
                    <Dropdown
                        value={selectedRuangan}
                        onChange={handleDropdownChange}
                        options={ruangans}
                        optionLabel="nama_ruangan"
                        placeholder="Select a Room"
                        filter
                        valueTemplate={renderSelectedRuangan}
                        itemTemplate={renderRuanganTemplate}
                        className="w-full"
                    />
                    {errors.ruangan_id && (
                        <small className="p-error">{errors.ruangan_id}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="password" className="font-bold">
                        Password
                    </label>
                    <InputText
                        id="password"
                        type="password"
                        onChange={(e) => handleInputChange(e, "password")}
                        value={user.password}
                        placeholder="Enter Password..."
                    />
                    {errors.password && (
                        <small className="p-error">{errors.password}</small>
                    )}
                </div>
                <div className="field">
                    <label
                        htmlFor="password_confirmation"
                        className="font-bold"
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
                        placeholder="Confirm Password..."
                    />
                    {errors.password_confirmation && (
                        <small className="p-error">
                            {errors.password_confirmation}
                        </small>
                    )}
                </div>
            </Dialog>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Toolbar
                            className="mb-4"
                            left={() => (
                                <div className="flex flex-wrap gap-2">
                                    {/* <Button
                                        label="New"
                                        icon="pi pi-plus"
                                        severity="primary"
                                        onClick={openNewDialog}
                                        loading={btnNew}
                                    /> */}
                                </div>
                            )}
                        />
                        <DataTable
                            value={dataUsers}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            filters={filters}
                            header={() => (
                                <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                                    <h5>Admin Ruangan</h5>
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-search" />
                                        <InputText
                                            type="search"
                                            onInput={(e) => onInputSearch(e)}
                                            placeholder="Global Search"
                                        />
                                    </span>
                                </div>
                            )}
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="name"
                                header="Name"
                                sortable
                                filterPlaceholder="Search by name"
                                headerStyle={{ width: "20rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="email"
                                header="Email"
                                sortable
                                filterPlaceholder="Search by email"
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="ruangan.nama_ruangan"
                                header="Ruangan"
                                sortable
                                filterPlaceholder="Search by room"
                                body={(rowData) => {
                                    return (
                                        <span key={rowData.id}>
                                            {rowData.ruangan.map((data) => {
                                                return (
                                                    <div key={data.id}>
                                                        {
                                                            data.ruangan
                                                                .nama_ruangan
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </span>
                                    );
                                }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                body={renderActionBody}
                                exportable={false}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
