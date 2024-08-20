import Layout from "@/Layouts/layout/layout";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useState } from "react";

export default function Index({ users }) {
    const [dataUsers, setDataUsers] = useState(users);
    const [openDialogTambah, setDialogTambah] = useState(false);

    const openNew = () => {
        setDialogTambah(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="primary"
                    onClick={openNew}
                />
            </div>
        );
    };
    const onHideDialog = () => {
        setDialogTambah(false);
    };
    const submit = (e) => {
        e.preventDefault();
    };

    const footerDialogTambah = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={() => onHideDialog()}
            />
            <Button label="Save" icon="pi pi-check" onClick={submit} />
        </React.Fragment>
    );

    const [errors, setErrors] = useState([]);
    const emptyUser = {
        name: "",
        ruangan_id: "",
        username: "",
        password: "",
        password_confirmation: "",
    };
    const [user, setUser] = useState(emptyUser);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
    };
    return (
        <Layout>
            <Dialog
                visible={openDialogTambah}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Users"
                modal
                className="p-fluid"
                footer={footerDialogTambah}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama
                    </label>
                    <InputText
                        id="name"
                        required
                        autoFocus
                        onChange={(e) => onInputChange(e, "name")}
                        value={user.name}
                        placeholder="Masukkan Nama..."
                    />
                    {errors.name && (
                        <small className="p-error">{errors.name}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="username" className="font-bold">
                        Username
                    </label>
                    <InputText
                        id="username"
                        required
                        autoFocus
                        onChange={(e) => onInputChange(e, "username")}
                        value={user.username}
                        placeholder="Masukkan Username..."
                    />
                    {errors.username && (
                        <small className="p-error">{errors.username}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="password" className="font-bold">
                        Password
                    </label>
                    <InputText
                        id="password"
                        required
                        autoFocus
                        onChange={(e) => onInputChange(e, "password")}
                        value={user.password}
                        placeholder="Masukkan password..."
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
                        Password Konfirmasi
                    </label>
                    <InputText
                        id="password_confirmation"
                        required
                        autoFocus
                        onChange={(e) =>
                            onInputChange(e, "password_confirmation")
                        }
                        value={user.password_confirmation}
                        placeholder="Masukkan Password Konfirmasi..."
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
                            left={leftToolbarTemplate}
                            // right={rightToolbarTemplate}
                        ></Toolbar>
                        <DataTable
                            value={dataUsers}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="name"
                                header="Name"
                                sortable
                                filterPlaceholder="Search by name"
                                headerStyle={{ width: "6rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="email"
                                header="Username"
                                sortable
                                filterPlaceholder="Search by username"
                                headerStyle={{ width: "6rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="ruangan.nama_ruangan"
                                header="Nama Ruangan"
                                sortable
                                filterPlaceholder="Search by username"
                                headerStyle={{ width: "6rem" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
