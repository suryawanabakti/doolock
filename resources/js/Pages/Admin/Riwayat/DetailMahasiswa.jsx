import Layout from "@/Layouts/layout/layout.jsx";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { FilterMatchMode } from "primereact/api";

const DetailMahasiswa = ({ mulai, sampai, mahasiswa, riwayat }) => {
    const [customers, setCustomers] = useState(riwayat);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const toast = useRef(null);
    const [dates, setDates] = useState([new Date(mulai), new Date(sampai)]);

    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>
                    {" "}
                    {mahasiswa.ket == "mhs" ? "Mahasiswa" : "Dosen"} :{" "}
                    {mahasiswa.nim} {mahasiswa.nama} ({mahasiswa.id_tag})
                </h5>
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
        console.log(customer.status);
        switch (customer.status) {
            case "Terbuka":
                return "success";
            case "Blok":
                return "danger";
            case "Tidak Terdaftar":
                return "warning";
            case "No Akses":
                return "warning";
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

    const userBodyTemplate = (customer) => {
        console.log("USER", customer.user);
        return <span> {customer.user ? customer.user.nama : "-"}</span>;
    };

    const ruanganBodyTemplate = (customer) => {
        return (
            <p
                id="textWithTooltip"
                // data-pr-tooltip="This is a tooltip!"
                // data-pr-position="top"
            >
                {" "}
                {customer.scanner
                    ? `${customer.scanner.ruangan.nama_ruangan} / ${customer.scanner?.type}`
                    : customer.kode}
                {/* <Tooltip target="#textWithTooltip" /> */}
            </p>
        );
    };

    const filterByDate = (e) => {
        e.preventDefault();
        router.get(
            route("admin.riwayat.mahasiswa"),
            { dates, id_tag: mahasiswa.id_tag },
            {
                onSuccess: () => {},
            }
        );
    };
    const [dateRange, setDateRange] = useState([
        new Date(mulai),
        new Date(sampai),
    ]);
    const handleChangeDate = (e) => {
        setDateRange(e.value);
        setDates([
            moment(e.value[0]).tz("Asia/Makassar").format("YYYY-MM-DD"),
            moment(e.value[1]).tz("Asia/Makassar").format("YYYY-MM-DD"),
        ]);
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Calendar
                    value={dateRange}
                    onChange={(e) => handleChangeDate(e)}
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                />
                <Button label="Filter By Date" onClick={filterByDate} />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-help mr-2"
                />
                <Button
                    label="Kembali"
                    link
                    onClick={() => router.get(route("admin.riwayat.index"))}
                />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
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

    useEffect(() => {}, []);
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
                        <DataTable
                            filters={filters}
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
                                headerClassName="fw-bold"
                                field="waktu"
                                header="Waktu"
                                sortable
                                filterPlaceholder="Waktu"
                                headerStyle={{ width: "12rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="kode"
                                header="Kode Scanner"
                                sortable
                                filterPlaceholder="Type"
                                headerStyle={{ width: "12rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="id_tag"
                                header="ID TAG"
                                sortable
                                filterPlaceholder="Search by user"
                                headerStyle={{ width: "8rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="scanner"
                                header="Ruangan"
                                sortable
                                filterPlaceholder="Type"
                                body={ruanganBodyTemplate}
                                headerStyle={{ width: "12rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="status"
                                header="Status"
                                sortable
                                filterPlaceholder="Search by status"
                                body={statusBodyTemplate}
                                headerStyle={{ width: "12rem" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DetailMahasiswa;
