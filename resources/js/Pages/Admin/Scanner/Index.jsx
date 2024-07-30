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
import { Tooltip } from "primereact/tooltip";
import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";

const Scanner = ({ scanner, ruangans }) => {
    const { data, setData, processing, post, reset } = useForm({
        kode: "",
        id: "",
        ruangan_id: "",
        type: "masuk",
        status: 1,
    });
    const [selectedCountry, setSelectedCountry] = useState(null);

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

    const [errors, setErrors] = useState([]);
    const submit = (e) => {
        e.preventDefault();
        axios
            .post(route("admin.scanner.store"), data)
            .then((res) => {
                // Create a new array including the new user
                const updatedUsers = [res.data, ...customers];
                // Update the state with the new array
                setCustomers(updatedUsers);
                setProductDialog(false);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "You have success create scanner " + data.ruangan,
                    life: 3000,
                });
                reset();
            })
            .catch((err) => {
                console.log("ERRROR", err);
                setErrors(err.response?.data?.errors);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        "You have error create scanner " +
                        err.response?.data?.message,
                    life: 3000,
                });
            });
    };

    const submit2 = (e) => {
        e.preventDefault();
        axios
            .patch(route("admin.scanner.update", data.id), data)
            .then((res) => {
                // Create a new array including the new user
                setCustomers((prevItems) =>
                    prevItems.map((item) =>
                        item.id === data.id
                            ? {
                                  ...item,
                                  kode: res.data.kode,
                                  ruangan: res.data.ruangan,
                                  type: res.data.type,
                                  last: res.data.last,
                                  status: res.data.status,
                              }
                            : item
                    )
                );
                setProductDialog2(false);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "You have success updated scanner " + res.data.nama,
                    life: 3000,
                });
                reset();
            })
            .catch((err) => {
                setErrors(err.response.data.errors);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        "You have error updated scanner " +
                        err.response.data.message,
                    life: 3000,
                });
            });
    };

    const [customers, setCustomers] = useState(scanner);
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
                        route("admin.scanner.destroy", rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail:
                            "You have deleted " + rowData.ruangan.nama_ruangan,
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
    const [ingredient, setIngredient] = useState("");

    const [globalFilter, setGlobalFilter] = useState("");
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>Scanner</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
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
        console.log(data);
        setData({
            id: data.id,
            kode: data.kode,
            ruangan_id: data.ruangan?.id,
            type: data.type,
            status: data.status == "Active" ? 1 : 0,
        });
        setSelectedCountry({
            name: data.ruangan?.nama_ruangan,
            code: data.ruangan?.id,
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
        e.preventDefault();
        axios
            .post(
                route("admin.scanner.active", {
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
        e.preventDefault();
        axios
            .post(
                route("admin.scanner.block", {
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
                label="Export"
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
    const ruanganBodyTemplate = (scanner) => {
        return (
            <p
                id="textWithTooltip"
                // data-pr-tooltip="This is a tooltip!"
                // data-pr-position="top"
            >
                {" "}
                {scanner ? `${scanner.ruangan?.nama_ruangan}` : kode}
            </p>
        );
    };

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
                                field="kode"
                                header="Kode"
                                sortable
                                filterPlaceholder="Search by kode"
                                headerStyle={{ width: "6rem" }}
                            />
                            <Column
                                header="Ruangan"
                                sortable
                                filterPlaceholder="Search by ruangan"
                                body={ruanganBodyTemplate}
                                headerStyle={{ width: "12rem" }}
                            />
                            <Column
                                field="type"
                                header="Type"
                                sortable
                                filter
                                filterPlaceholder="Search by type"
                                headerStyle={{ width: "10rem" }}
                            />
                            <Column
                                field="last"
                                header="Last Update"
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
                header="New Scanner"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="kode" className="font-bold">
                        Kode
                    </label>
                    <InputText
                        id="kode"
                        required
                        autoFocus
                        onChange={(e) => setData("kode", e.target.value)}
                        value={data.kode}
                        placeholder="Masukkan Kode"
                    />
                    {errors.kode && (
                        <small className="p-error">{errors.kode}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Ruangan
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.value);
                            setData("ruangan_id", e.value.code);
                        }}
                        options={ruangans}
                        optionLabel="name"
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
                <div className="field">
                    <label htmlFor="type" className="font-bold mb-3">
                        Type
                    </label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="dalam"
                                name="type"
                                value="dalam"
                                checked={data.type == "dalam"}
                                onClick={() => setData("type", "dalam")}
                            />
                            <label htmlFor="dalam">Dalam</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="luar"
                                name="type"
                                value="luar"
                                checked={data.type == "luar"}
                                onClick={() => setData("type", "luar")}
                            />
                            <label htmlFor="luar">Luar</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="status" className="font-bold mb-3">
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
                header="Edit Scanner"
                modal
                className="p-fluid"
                footer={productDialogFooter2}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="kode" className="font-bold">
                        Kode
                    </label>
                    <InputText
                        id="kode"
                        required
                        autoFocus
                        onChange={(e) => setData("kode", e.target.value)}
                        value={data.kode}
                        placeholder="Masukkan Kode"
                    />
                    {errors.kode && (
                        <small className="p-error">{errors.kode}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="ruangan" className="font-bold">
                        Ruangan
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.value);
                            setData("ruangan_id", e.value.code);
                        }}
                        options={ruangans}
                        optionLabel="name"
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
                <div className="field">
                    <label htmlFor="type" className="font-bold mb-3">
                        Type
                    </label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="dalam"
                                name="type"
                                value="dalam"
                                checked={data.type == "dalam"}
                                onClick={() => setData("type", "dalam")}
                            />
                            <label htmlFor="dalam">Dalam</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="luar"
                                name="type"
                                value="luar"
                                checked={data.type == "luar"}
                                onClick={() => setData("type", "luar")}
                            />
                            <label htmlFor="luar">Luar</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="status" className="font-bold mb-3">
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

export default Scanner;
