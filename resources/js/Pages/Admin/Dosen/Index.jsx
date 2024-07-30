import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";
import { useForm } from "@inertiajs/react";
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
import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";

const Dosen = ({ mahasiswa }) => {
    const { data, setData, processing, post, reset } = useForm({
        id_tag: "",
        id: "",
        nim: "",
        nama: "",
        status: 1,
    });
    const [errors, setErrors] = useState([]);
    const submit = (e) => {
        e.preventDefault();
        axios
            .post(route("admin.dosen.store"), data)
            .then((res) => {
                // Create a new array including the new user
                const updatedUsers = [res.data, ...customers];
                // Update the state with the new array
                setCustomers(updatedUsers);
                setProductDialog(false);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "You have success create dosen " + data.nama,
                    life: 3000,
                });
                reset();
            })
            .catch((err) => {
                console.log("ERRORSSS", err);
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
            .patch(route("admin.dosen.update", data.id), data)
            .then((res) => {
                // Create a new array including the new user

                // Update the state with the new array
                console.log(res.data);
                setCustomers((prevItems) =>
                    prevItems.map((item) =>
                        item.id === data.id
                            ? {
                                  ...item,
                                  nama: res.data.nama,
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
                        route("admin.dosen.destroy", rowData.id)
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
                    console.log("ERR HAPUS", e);
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
    const [ingredient, setIngredient] = useState("");

    const [globalFilter, setGlobalFilter] = useState("");
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>Dosen</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) =>
                            setGlobalFilter(
                                e.target.value ? e.target.value : []
                            )
                        }
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
            nim: data.nim,
            id_tag: data.id_tag,
            nama: data.nama,
            status: data.status == "Active" ? 1 : 0,
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
            <Button label="Save" icon="pi pi-check" onClick={submit} />
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
                route("admin.dosen.active", {
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
                route("admin.dosen.block", {
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
                    severity="success"
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
                icon="pi pi-download"
                className="p-button-help"
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
                                header="NIP"
                                sortable
                                filterPlaceholder="Search by nim"
                                headerStyle={{ width: "12rem" }}
                            />
                            <Column
                                field="nama"
                                header="Name"
                                filter
                                filterPlaceholder="Search by name"
                                style={{ minWidth: "14rem" }}
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
                visible={productDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Dosen"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="id_tag" className="font-bold">
                        ID TAG
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
                        NIP
                    </label>
                    <InputText
                        id="nim"
                        required
                        autoFocus
                        value={data.nim}
                        placeholder="Masukkan NIP"
                        onChange={(e) => setData("nim", e.target.value)}
                    />
                    {errors.nim && (
                        <small className="p-error">{errors.nim}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama
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
                    <label htmlFor="name" className="font-bold mb-3">
                        Status
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
                header="Edit Dosen"
                modal
                className="p-fluid"
                footer={productDialogFooter2}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="id_tag" className="font-bold">
                        ID TAG
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
                        NIP
                    </label>
                    <InputText
                        id="nim"
                        required
                        autoFocus
                        value={data.nim}
                        placeholder="Masukkan NIP"
                        onChange={(e) => setData("nim", e.target.value)}
                    />
                    {errors.nim && (
                        <small className="p-error">{errors.nim}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nama
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
                    <label htmlFor="name" className="font-bold mb-3">
                        Status
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

export default Dosen;
