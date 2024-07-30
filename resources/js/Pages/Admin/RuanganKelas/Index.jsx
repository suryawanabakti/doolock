import Layout from "@/Layouts/layout/layout";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Ruangan({ ruangans }) {
    const [dataRuangan, setDataRuangan] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    useEffect(() => {
        setDataRuangan(ruangans);
    }, []);
    const onInputSearch = (e) => {
        var val = e.target.value;
        setGlobalFilter(val ? val : []);
    };

    let emptyRuangan = {
        id: "",
        nama_ruangan: "",
    };
    const [ruangan, setRuangan] = useState(emptyRuangan);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _ruangan = { ...ruangan };
        _ruangan[`${name}`] = val;
        setRuangan(_ruangan);
    };

    const [errors, setErrors] = useState([]);
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => openEdit(rowData)}
                />

                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={(event) => confirm2(event, rowData)}
                />
            </React.Fragment>
        );
    };
    const toast = useRef(null);
    // DELETE
    const reject = () => {
        toast.current.show({
            severity: "warn",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
        });
    };
    const confirm2 = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Do you want to delete this record?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(
                        route("admin.ruangan-kelas.destroy", rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama_ruangan,
                        life: 3000,
                    });
                    const updatedRuangan = ruangans.filter(
                        (user) => user.id !== rowData.id
                    );
                    // Update the state with the new array
                    setDataRuangan(updatedRuangan);
                } catch (e) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "You have error deleted " + e.message,
                        life: 3000,
                    });
                }
            },
            reject,
        });
    };
    // TAMBAH
    const [dialogTambah, setDialogTambah] = useState(false);
    const openNew = () => {
        setDialogTambah(true);
    };
    const submit = async (e) => {
        try {
            const res = await axios.post(
                route("admin.ruangan-kelas.store"),
                ruangan
            );
            const updatedData = [res.data, ...dataRuangan];
            setDataRuangan(updatedData);

            setDialogTambah(false);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail:
                    "You have success create ruangan " + res.data.nama_ruangan,
                life: 3000,
            });
            setRuangan(emptyRuangan);
        } catch (error) {
            console.log(error);
        }
    };
    const footerDialogTambah = (e) => {
        return (
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
    };
    const onHideDialog = () => {
        setRuangan(emptyRuangan);
        setErrors([]);
        setDialogTambah(false);
    };
    // END TAMBAH

    // EDIT

    const openEdit = (data) => {
        setDialogEdit(true);
        setRuangan(data);
    };
    const onHideDialog2 = () => {
        setRuangan(emptyRuangan);
        setErrors([]);
        setDialogEdit(false);
    };
    const [dialogEdit, setDialogEdit] = useState(false);
    const submit2 = async (e) => {
        try {
            const res = await axios.patch(
                route("admin.ruangan-kelas.update", ruangan.id),
                ruangan
            );
            setDataRuangan((prevItems) =>
                prevItems.map((item) =>
                    item.id === res.data.id
                        ? {
                              ...item,
                              nama_ruangan: res.data.nama_ruangan,
                          }
                        : item
                )
            );
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail:
                    "You have success updated kelas " + res.data.nama_ruangan,
                life: 3000,
            });
            setRuangan(emptyRuangan);
            setDialogEdit(false);
        } catch (error) {
            console.log(error);
        }
    };
    const footerDialogEdit = (e) => {
        return (
            <React.Fragment>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    outlined
                    onClick={() => onHideDialog2()}
                />
                <Button label="Save" icon="pi pi-check" onClick={submit2} />
            </React.Fragment>
        );
    };
    // END EDIT
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                />
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>Kelas</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => onInputSearch(e)}
                        placeholder="Global Search"
                    />
                </span>
            </div>
        );
    };
    const header = renderHeader();
    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                        ></Toolbar>
                        <DataTable
                            value={dataRuangan}
                            paginator
                            dataKey="id"
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            emptyMessage="Tidak ada ruangan"
                            globalFilterFields={["nama_ruangan"]}
                            header={header}
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="id"
                                header="ID"
                                sortable
                                filterPlaceholder="id"
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="nama_ruangan"
                                header="Nama Kelas"
                                sortable
                                filterPlaceholder="id"
                                style={{ minWidth: "20rem" }}
                                headerStyle={{ width: "20rem" }}
                            />

                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "12rem" }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog
                visible={dialogEdit}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Kelas"
                modal
                className="p-fluid"
                footer={footerDialogEdit}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama Kelas
                    </label>
                    <InputText
                        id="name"
                        required
                        autoFocus
                        value={ruangan.nama_ruangan}
                        onChange={(e) => onInputChange(e, "nama_ruangan")}
                        placeholder="Masukkan Nama"
                    />
                    {errors.nama_ruangan && (
                        <small className="p-error">{errors.nama_ruangan}</small>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Kelas"
                modal
                className="p-fluid"
                footer={footerDialogTambah}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama Kelas
                    </label>
                    <InputText
                        id="name"
                        required
                        autoFocus
                        value={ruangan.nama_ruangan}
                        onChange={(e) => onInputChange(e, "nama_ruangan")}
                        placeholder="Masukkan Nama"
                    />
                    {errors.nama_ruangan && (
                        <small className="p-error">{errors.nama_ruangan}</small>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}
