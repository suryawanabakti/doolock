import Layout from "@/Layouts/layout/layout";
import { router } from "@inertiajs/react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Ruangan({ ruangans }) {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.nama_ruangan}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.nama_ruangan}</div>
            </div>
        );
    };

    const [dataRuangan, setDataRuangan] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    useEffect(() => {
        setDataRuangan(ruangans);
    }, []);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kelas: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const onInputSearch = (e) => {
        var val = e.target.value;
        setGlobalFilter(val ? val : []);
    };

    let emptyRuangan = {
        id: "",
        nama_ruangan: "",
        type: "lab",
        jam_buka: "00:01:00",
        jam_tutup: "23:58:00",
        open_api: "",
        parent_id: "",
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
                    icon="pi pi-key"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() =>
                        router.visit(
                            route("admin.ruangan-hak-akses.index", {
                                id: rowData.id,
                            })
                        )
                    }
                />

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
                        route("admin.ruangan.destroy", rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama_ruangan,
                        life: 3000,
                    });

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
            const res = await axios.post(route("admin.ruangan.store"), ruangan);
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
            alert(error.response?.data?.message || error.message);
            setErrors(error.response?.data?.errors || []);
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
        console.log("coba", {
            id: data.parent_id,
            name: data.parent?.nama_ruangan,
            nama_ruangan: data.parent?.nama_ruangan,
            code: data.parent_id,
            type: data.type,
        });

        setSelectedCountry({
            id: data.parent_id,
            name: data.parent?.nama_ruangan,
            nama_ruangan: data.parent?.nama_ruangan,
            code: data.parent_id,
        });

        setSelectedType({ name: data.type, code: data.type });

        setRuangan(data);

        setDialogEdit(true);
    };
    const [dialogAccess, setDialogAccess] = useState(false);
    const openAccess = (data) => {
        setDialogAccess(true);
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
                route("admin.ruangan.update", ruangan.id),
                ruangan
            );
            console.log(res.data.open_api);
            setDataRuangan((prevItems) =>
                prevItems.map((item) =>
                    item.id === res.data.id
                        ? {
                              ...item,
                              parent: res.data.parent,
                              nama_ruangan: res.data.nama_ruangan,
                              jam_buka: res.data.jam_buka,
                              jam_tutup: res.data.jam_tutup,
                              open_api: res.data.open_api,
                              type: res.data.type,
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
            alert(error.response?.data?.message || error.message);
            setErrors(error.response?.data?.errors || []);
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
                <h5>Ruangan</h5>
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
    const [selectedType, setSelectedType] = useState({
        name: "",
        code: "",
    });
    const types = [
        {
            name: "umum",
            code: "umum",
        },
        {
            name: "lab",
            code: "lab",
        },
    ];

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
                            filters={filters}
                            value={dataRuangan}
                            paginator
                            dataKey="id"
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            emptyMessage="Tidak ada ruangan"
                            header={header}
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="first_scanner.kode"
                                header="Kode"
                                body={(rowData) => {
                                    return rowData.first_scanner
                                        ? rowData.first_scanner?.kode.slice(
                                              0,
                                              -1
                                          )
                                        : "-";
                                }}
                                filterPlaceholder="jam buka"
                                style={{ minWidth: "3rem" }}
                                headerStyle={{ width: "3rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="nama_ruangan"
                                header="Nama Ruangan"
                                body={(rowData) => {
                                    return (
                                        <div>
                                            {rowData.nama_ruangan} <br />
                                            {rowData.parent &&
                                                `Parent : ${rowData.parent?.nama_ruangan}`}
                                        </div>
                                    );
                                }}
                                sortable
                                filterPlaceholder="id"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="type"
                                header="Tipe"
                                sortable
                                filterPlaceholder="id"
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jam_buka"
                                header="Jam Buka"
                                filterPlaceholder="jam buka"
                                style={{ minWidth: "8rem" }}
                                headerStyle={{ width: "8rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jam_tutup"
                                header="Jam Tutup"
                                filterPlaceholder="jam tutup"
                                style={{ minWidth: "8rem" }}
                                headerStyle={{ width: "8rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="open_api"
                                header="Api"
                                body={(rowData) => {
                                    return rowData.open_api == 1 ? (
                                        <Badge
                                            value={"Open"}
                                            severity="success"
                                        />
                                    ) : (
                                        <Badge
                                            value={"Closed"}
                                            severity="danger"
                                        />
                                    );
                                }}
                                filterPlaceholder="API"
                                sortable
                                style={{ minWidth: "1rem" }}
                                headerStyle={{ width: "1rem" }}
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
                header="Edit Ruangan"
                modal
                className="p-fluid"
                footer={footerDialogEdit}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama Ruangan
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
                    <label htmlFor="name" className="font-bold">
                        Tipe Ruangan
                    </label>
                    <Dropdown
                        value={selectedType}
                        onChange={(e) => {
                            setRuangan({ ...ruangan, type: e.value.code });
                            setSelectedType(e.value);
                        }}
                        options={types}
                        optionLabel="name"
                        placeholder="Select a Type"
                        className="w-full md:w-14rem"
                    />

                    {errors.type && (
                        <small className="p-error">{errors.type}</small>
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
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Parent Ruangan (Tidak usah di isi jika tidak ada)
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.value);
                            setRuangan({
                                ...ruangan,
                                parent_id: e.value.id,
                            });
                        }}
                        options={[
                            { id: null, nama_ruangan: "None", code: null },
                            ...ruangans,
                        ]}
                        optionLabel="nama_ruangan"
                        placeholder="Select a Room"
                        filter
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                        className="w-full "
                    />

                    {errors.parent_id && (
                        <small className="p-error">{errors.parent_id}</small>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Ruangan"
                modal
                className="p-fluid"
                footer={footerDialogTambah}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama Ruangan
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
                    <label htmlFor="name" className="font-bold">
                        Tipe Ruangan
                    </label>
                    <Dropdown
                        value={selectedType}
                        onChange={(e) => {
                            setRuangan({ ...ruangan, type: e.value.code });
                            setSelectedType(e.value);
                        }}
                        options={types}
                        optionLabel="name"
                        placeholder="Select a Type"
                        className="w-full md:w-14rem"
                    />

                    {errors.type && (
                        <small className="p-error">{errors.type}</small>
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
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Parent Ruangan (Tidak usah di isi jika tidak ada)
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.value);
                            setRuangan({
                                ...ruangan,
                                parent_id: e.value.id,
                            });
                        }}
                        options={[
                            { id: null, nama_ruangan: "None", code: null },
                            ...ruangans,
                        ]}
                        optionLabel="nama_ruangan"
                        placeholder="Select a Room"
                        filter
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                        className="w-full "
                    />

                    {errors.ruangan && (
                        <small className="p-error">{errors.ruangan}</small>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}
