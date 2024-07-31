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
    const [dataRuangan, setDataRuangan] = useState(ruangans);
    const [globalFilter, setGlobalFilter] = useState("");

    const onInputSearch = (e) => {
        var val = e.target.value;
        setGlobalFilter(val ? val : []);
    };

    let emptyRuangan = {
        id: "",
        nama_ruangan: "",
        jam_buka: "00:00:00",
        jam_tutup: "00:00:00",
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

                    // Update the state with the new array
                    setDataRuangan((prevItems) =>
                        prevItems.filter((item) => item.id !== rowData.id)
                    );
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
        } catch (err) {
            setErrors(err.response.data.errors);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    "You have error create mahasiswa " +
                    err.response.data.message,
                life: 3000,
            });
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
                              jam_buka: res.data.jam_buka,
                              jam_tutup: res.data.jam_tutup,
                          }
                        : item
                )
            );
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail:
                    "You have success updated ruangan " + res.data.nama_ruangan,
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
                    severity="primary"
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
                                field="nama_ruangan"
                                header="Nama Kelas"
                                sortable
                                filterPlaceholder="id"
                                style={{ minWidth: "20rem" }}
                                headerStyle={{ width: "20rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jam_buka"
                                header="Jam Buka"
                                filterPlaceholder="jam buka"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jam_tutup"
                                header="Jam Tutup"
                                filterPlaceholder="jam tutup"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
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
                <div className="field">
                    <label htmlFor="jam_buka" className="font-bold">
                        Jam Buka
                    </label>
                    <InputText
                        id="jam_buka"
                        required
                        autoFocus
                        type="time"
                        value={ruangan.jam_buka}
                        onChange={(e) => onInputChange(e, "jam_buka")}
                        placeholder="Masukkan Jam Buka"
                    />
                    {errors.jam_buka && (
                        <small className="p-error">{errors.jam_buka}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="jam_tutup" className="font-bold">
                        Jam Tutup
                    </label>
                    <InputText
                        id="jam_tutup"
                        required
                        autoFocus
                        type="time"
                        value={ruangan.jam_tutup}
                        onChange={(e) => onInputChange(e, "jam_tutup")}
                        placeholder="Masukkan Jam Tutup"
                    />
                    {errors.jam_tutup && (
                        <small className="p-error">{errors.jam_tutup}</small>
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
                <div className="field">
                    <label htmlFor="jam_buka" className="font-bold">
                        Jam Buka
                    </label>
                    <InputText
                        id="jam_buka"
                        required
                        autoFocus
                        type="time"
                        value={ruangan.jam_buka}
                        onChange={(e) => onInputChange(e, "jam_buka")}
                        placeholder="Masukkan Jam Buka"
                    />
                    {errors.jam_buka && (
                        <small className="p-error">{errors.jam_buka}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="jam_tutup" className="font-bold">
                        Jam Tutup
                    </label>
                    <InputText
                        id="jam_tutup"
                        required
                        autoFocus
                        type="time"
                        value={ruangan.jam_tutup}
                        onChange={(e) => onInputChange(e, "jam_tutup")}
                        placeholder="Masukkan Jam Tutup"
                    />
                    {errors.jam_tutup && (
                        <small className="p-error">{errors.jam_tutup}</small>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}
