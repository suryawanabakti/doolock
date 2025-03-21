import Layout from "@/Layouts/layout/layout.jsx";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useRef, useState } from "react";

const Mahasiswa = ({ mahasiswa, kelas }) => {
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };
    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const { data, setData, processing, post, reset } = useForm({
        pin: "",
        id_tag: "",
        id: "",
        nim: "",
        nama: "",
        status: 1,
        ruangan_id: "",
        kelas: "",
        tahun_masuk: 2024,
        file_import: null,
    });

    const [importDialog, setImportDialog] = useState(false);
    const [errors, setErrors] = useState([]);
    const submit = (e) => {
        e.preventDefault();
        axios
            .post(route("admin.mahasiswa.store"), data)
            .then((res) => {
                // Create a new array including the new user
                const updatedUsers = [res.data, ...customers];
                // Update the state with the new array
                setCustomers(updatedUsers);
                setProductDialog(false);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "You have success create mahasiswa " + data.nama,
                    life: 3000,
                });
                setSelectedCountry([]);
                reset();
            })
            .catch((err) => {
                setErrors(err.response.data.errors);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        "You have error create mahasiswa " +
                        err.response.data.message,
                    life: 3000,
                });
            });
    };

    const submit2 = (e) => {
        e.preventDefault();
        axios
            .patch(route("admin.mahasiswa.update", data.id), data)
            .then((res) => {
                setCustomers((prevItems) =>
                    prevItems.map((item) =>
                        item.id === data.id
                            ? {
                                  ...item,
                                  pin: res.data.pin,
                                  nama: res.data.nama,
                                  ruangan: res.data.ruangan,
                                  id_tag: res.data.id_tag,
                                  status: res.data.status,
                                  nim: res.data.nim,
                              }
                            : item
                    )
                );
                setProductDialog2(false);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail:
                        "You have success updated mahasiswa " + res.data.nama,
                    life: 3000,
                });
                reset();
                setSelectedCountry([]);
            })
            .catch((err) => {
                console.log("ERROR", err);
                setErrors(err.response.data.errors);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        "You have error create mahasiswa " +
                        err.response.data.message,
                    life: 3000,
                });
            });
    };

    const [customers, setCustomers] = useState(mahasiswa);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const toast = useRef(null);

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
                        route("admin.mahasiswa.destroy", rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama,
                        life: 3000,
                    });
                    const updatedUsers = customers.filter(
                        (user) => user.id !== rowData.id
                    );
                    // Update the state with the new array
                    setCustomers(updatedUsers);
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

    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kelas: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tahun: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const onInputSearch = (e) => {
        var value = e.target.value;
        setGlobalFilter(value);
    };
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>Mahasiswa</h5>
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

    const getSeverity = (customer) => {
        switch (customer.status) {
            case "Active":
                return "success";
            case "Block":
                return "danger";
            default:
                return null;
        }
    };
    const [statuses] = useState(["Active", "Block"]);

    const statusBodyTemplate = (customer) => {
        return (
            <Tag value={customer.status} severity={getSeverity(customer)}></Tag>
        );
    };
    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                itemTemplate={statusItemTemplate}
                placeholder="Select One"
                className="p-column-filter"
                showClear
            />
        );
    };
    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const [productDialog, setProductDialog] = useState(false);
    const [productDialog2, setProductDialog2] = useState(false);
    const openNew = () => {
        setProductDialog(true);
    };
    const openEdit = (data) => {
        setData({
            id: data.id,
            pin: data.pin,
            nim: data.nim,
            id_tag: data.id_tag,
            nama: data.nama,
            ruangan_id: data.ruangan?.id,
            status: data.status == "Active" ? 1 : 0,
            tahun_masuk: data.tahun_masuk,
        });
        setSelectedCountry({
            code: data.ruangan?.id,
            name: data.ruangan?.nama_ruangan,
        });
        setProductDialog2(true);
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={() => onHideDialog()}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={submit}
                disabled={processing}
            />
        </React.Fragment>
    );

    const productDialogFooter2 = (
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
    const activeUser = (e) => {
        console.log(selectedCustomers);
        e.preventDefault();
        axios
            .post(
                route("admin.mahasiswa.active", {
                    selectedCustomers: selectedCustomers,
                })
            )
            .then((res) => {
                setCustomers(res.data);
                setSelectedCustomers([]);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const blockUser = (e) => {
        console.log(selectedCustomers);
        e.preventDefault();
        axios
            .post(
                route("admin.mahasiswa.block", {
                    selectedCustomers: selectedCustomers,
                })
            )
            .then((res) => {
                setCustomers(res.data);
                setSelectedCustomers([]);
            })
            .catch((err) => {
                console.log(err);
            });
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
                <Button
                    label={`Active`}
                    icon="pi pi-check"
                    severity="success"
                    disabled={selectedCustomers.length <= 0}
                    onClick={activeUser}
                />
                <Button
                    label="Block"
                    icon="pi pi-times"
                    severity="danger"
                    disabled={selectedCustomers.length <= 0}
                    onClick={blockUser}
                />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Import"
                icon="pi pi-upload"
                className="p-button-primary"
                onClick={() => setImportDialog(true)}
            />
        );
    };

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
    const onHideDialog = () => {
        reset();
        setErrors([]);
        setProductDialog(false);
    };
    const onHideDialog2 = () => {
        reset();
        setErrors([]);
        setProductDialog2(false);
    };
    // TAMBAH
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [errorsImport, setErrorsImport] = useState([]);

    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        {Object.values(errorsImport).map((value) => {
                            return (
                                <>
                                    <div className="text-sm mb-2 text-red-500">
                                        {value}
                                    </div>
                                </>
                            );
                        })}
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        ></Toolbar>
                        {selectedCustomers.length > 0 && (
                            <div className="mb-3">
                                You have selected :{" "}
                                <b>{selectedCustomers.length} </b>
                                people.
                            </div>
                        )}

                        <DataTable
                            value={customers}
                            selection={selectedCustomers}
                            onSelectionChange={(e) =>
                                setSelectedCustomers(e.value)
                            }
                            dataKey="id"
                            paginator
                            filters={filters}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            header={header}
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column
                                headerClassName="fw-bold"
                                field="id_tag"
                                header="ID TAG"
                                sortable
                                filterPlaceholder="Search by id tag"
                                headerStyle={{ width: "20rem" }}
                            />
                            <Column
                                field="nim"
                                header="NIM"
                                sortable
                                filterPlaceholder="Search by nim"
                                headerStyle={{ width: "12rem" }}
                            />
                            <Column
                                field="nama"
                                header="Name"
                                sortable
                                filterPlaceholder="Search by name"
                                style={{ minWidth: "13rem" }}
                            />
                            <Column
                                filter
                                field="tahun_masuk"
                                header="Tahun"
                                sortable
                                filterPlaceholder="Search by tahun masuk"
                                filterElement={() => <span>Tetst</span>}
                                style={{ minWidth: "5rem" }}
                            />
                            <Column
                                field="ruangan.nama_ruangan"
                                header="Kelas"
                                filter
                                filterPlaceholder="Search by kelas"
                                style={{ minWidth: "7rem" }}
                            />

                            <Column
                                field="status"
                                header="Status"
                                filterMenuStyle={{ width: "5rem" }}
                                style={{ minWidth: "5rem" }}
                                body={statusBodyTemplate}
                                filter
                                filterElement={statusFilterTemplate}
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
                visible={importDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Import Mahasiswa"
                modal
                className="p-fluid"
                footer={() => {}}
                onHide={() => {
                    reset();
                    setImportDialog(false);
                }}
            >
                <p>
                    Download Example{" "}
                    <a href="/example-mahasiswa.xlsx" download>
                        here
                    </a>
                </p>
                <div className="field">
                    <label htmlFor="Kelas" className="font-bold">
                        Kelas
                    </label>
                    <InputText
                        placeholder="Kelas A"
                        id="kelas"
                        required
                        type="text"
                        value={data.kelas}
                        autoFocus
                        onChange={(e) => setData("kelas", e.target.value)}
                    />
                    {errors.kelas && (
                        <small className="p-error">{errors.kelas}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tahun_masuk" className="font-bold">
                        Tahun Masuk
                    </label>
                    <InputText
                        value={data.tahun_masuk}
                        placeholder="2025"
                        id="tahun_masuk"
                        required
                        type="text"
                        autoFocus
                        onChange={(e) => setData("tahun_masuk", e.target.value)}
                    />
                    {errors.tahun_masuk && (
                        <small className="p-error">{errors.tahun_masuk}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="file" className="font-bold">
                        File Excel
                    </label>
                    <InputText
                        id="file"
                        required
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        type="file"
                        autoFocus
                        onChange={(e) =>
                            setData("file_import", e.target.files[0])
                        }
                    />
                    {errors.file_import && (
                        <small className="p-error">{errors.file_import}</small>
                    )}
                </div>

                <Button
                    label="Import"
                    onClick={() =>
                        router.post(
                            route("admin.mahasiswa.import"),
                            {
                                kelas: data.kelas,
                                tahun_masuk: data.tahun_masuk,
                                file_import: data.file_import,
                            },
                            {
                                onError: (err) => {
                                    toast.current.show({
                                        severity: "error",
                                        summary: "Error",
                                        detail: "Gagal import, harap perbaiki data di excel yg anda upload",
                                        life: 10000,
                                    });
                                    setErrorsImport(err);
                                },
                                onSuccess: (res) => {
                                    toast.current.show({
                                        severity: "success",
                                        summary: "Berahasil",
                                        detail: "Berhasil import",
                                        life: 3000,
                                    });
                                },
                                onFinish: (res) => {
                                    setImportDialog(false);
                                },
                            }
                        )
                    }
                />
            </Dialog>
            <Dialog
                visible={productDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Mahasiswa"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="pin" className="font-bold">
                        PIN
                    </label>
                    <InputText
                        id="pin"
                        autoFocus
                        onChange={(e) => setData("pin", e.target.value)}
                        value={data.pin}
                        placeholder="Masukkan PIN"
                    />
                    {errors.pin && (
                        <small className="p-error">{errors.pin}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="id_tag" className="font-bold">
                        ID TAG{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        id="id_tag"
                        required
                        autoFocus
                        onChange={(e) => setData("id_tag", e.target.value)}
                        value={data.id_tag}
                        placeholder="Masukkan ID Tag"
                    />
                    {errors.id_tag && (
                        <small className="p-error">{errors.id_tag}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="nim" className="font-bold">
                        NIM{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        id="nim"
                        required
                        autoFocus
                        value={data.nim}
                        placeholder="Masukkan NIM"
                        onChange={(e) => setData("nim", e.target.value)}
                    />
                    {errors.nim && (
                        <small className="p-error">{errors.nim}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        id="name"
                        required
                        autoFocus
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                        placeholder="Masukkan Nama"
                    />
                    {errors.nama && (
                        <small className="p-error">{errors.nama}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tahun_masuk" className="font-bold">
                        Tahun Masuk{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        id="tahun_masuk"
                        type="number"
                        required
                        autoFocus
                        value={data.tahun_masuk}
                        placeholder="Masukkan Tahun Masuk"
                        onChange={(e) => setData("tahun_masuk", e.target.value)}
                    />
                    {errors.tahun_masuk && (
                        <small className="p-error">{errors.tahun_masuk}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Kelas{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.value);
                            console.log(e.value);
                            setData("ruangan_id", e.value.code);
                        }}
                        options={kelas}
                        optionLabel="Kelas"
                        placeholder="Select a Class"
                        filter
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                        className="w-full "
                    />

                    {errors.ruangan_id && (
                        <small className="p-error">{errors.ruangan_id}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold mb-3">
                        Status{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="active"
                                name="status"
                                value="1"
                                checked={data.status == 1}
                                onClick={() => setData("status", 1)}
                            />
                            <label htmlFor="active">Active</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="block"
                                name="status"
                                value="0"
                                checked={data.status == 0}
                                onClick={() => setData("status", 0)}
                            />
                            <label htmlFor="block">Block</label>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={productDialog2}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Edit Mahasiswa"
                modal
                className="p-fluid"
                footer={productDialogFooter2}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="pin" className="font-bold">
                        PIN
                    </label>
                    <InputText
                        id="pin"
                        autoFocus
                        onChange={(e) => setData("pin", e.target.value)}
                        value={data.pin}
                        placeholder="Masukkan PIN"
                    />
                    {errors.pin && (
                        <small className="p-error">{errors.pin}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="id_tag" className="font-bold">
                        ID TAG <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputText
                        id="id_tag"
                        required
                        autoFocus
                        onChange={(e) => setData("id_tag", e.target.value)}
                        placeholder="Masukkan ID Tag"
                        value={data.id_tag}
                    />
                    {errors.id_tag && (
                        <small className="p-error">{errors.id_tag}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nim" className="font-bold">
                        NIM <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputText
                        id="nim"
                        required
                        autoFocus
                        value={data.nim}
                        placeholder="Masukkan NIM"
                        onChange={(e) => setData("nim", e.target.value)}
                    />
                    {errors.nim && (
                        <small className="p-error">{errors.nim}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputText
                        id="name"
                        required
                        autoFocus
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                        placeholder="Masukkan Nama"
                    />
                    {errors.nama && (
                        <small className="p-error">{errors.nama}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tahun_masuk" className="font-bold">
                        Tahun Masuk <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputText
                        id="tahun_masuk"
                        type="number"
                        required
                        autoFocus
                        value={data.tahun_masuk}
                        placeholder="Masukkan Tahun Masuk"
                        onChange={(e) => setData("tahun_masuk", e.target.value)}
                    />
                    {errors.tahun_masuk && (
                        <small className="p-error">{errors.tahun_masuk}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Kelas <span style={{ color: "red" }}>*</span>
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            console.log(e.value);
                            setSelectedCountry(e.value);
                            setData("ruangan_id", e.value.code);
                        }}
                        options={kelas}
                        optionLabel="Kelas"
                        placeholder="Select a Class"
                        filter
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                        className="w-full "
                    />

                    {errors.ruangan_id && (
                        <small className="p-error">{errors.ruangan_id}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold mb-3">
                        Status <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="active"
                                name="status"
                                value="1"
                                checked={data.status == 1}
                                onClick={() => setData("status", 1)}
                            />
                            <label htmlFor="active">Active</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="block"
                                name="status"
                                value="0"
                                checked={data.status == 0}
                                onClick={() => setData("status", 0)}
                            />
                            <label htmlFor="block">Block</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Layout>
    );
};

export default Mahasiswa;
