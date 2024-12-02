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

const Riwayat = ({ auth, riwayat, mulai, sampai }) => {
    const [customers, setCustomers] = useState(riwayat);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const toast = useRef(null);

    const [dates, setDates] = useState([new Date(mulai), new Date(sampai)]);
    useEffect(() => {
        window.Echo.private(`management.1`).listen(
            "StoreHistoryEvent",
            (event) => {
                const statusLabels = [
                    "Blok",
                    "Terbuka",
                    "Tidak Terdaftar",
                    "No Akses",
                ];
                const status = statusLabels[event.histori?.status] || null;

                const data = {
                    id: event.histori.id,
                    id_tag: event.histori.id_tag,
                    user: event.histori.user,
                    status,
                    scanner: event.histori.scanner,
                    kode: event.histori.kode,
                    waktu: event.histori.waktu,
                };

                setCustomers((prev) => [data, ...prev]);
            }
        );
    }, []);

    const [globalFilter, setGlobalFilter] = useState("");
    const [dateRange, setDateRange] = useState([
        new Date(mulai),
        new Date(sampai),
    ]);

    const renderHeader = () => (
        <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
            <h5>Riwayat</h5>
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

    const getSeverity = (status) => {
        switch (status) {
            case "Terbuka":
                return "success";
            case "Blok":
                return "danger";
            case "Tidak Terdaftar":
            case "No Akses":
                return "warning";
            default:
                return null;
        }
    };

    const statusBodyTemplate = (customer) => (
        <Tag value={customer.status} severity={getSeverity(customer.status)} />
    );

    const userBodyTemplate = (customer) => (
        <Link
            href={route("admin.riwayat.mahasiswa")}
            data={{ id_tag: customer.id_tag }}
        >
            {customer.user ? customer.user.nama : customer.nama}
        </Link>
    );

    const nimBodyTemplate = (customer) => (
        <Link
            href={route("admin.riwayat.mahasiswa")}
            data={{ id_tag: customer.id_tag }}
        >
            {customer.user ? customer.user.nim : customer.nim}
        </Link>
    );

    const getKeterangan = (type) =>
        ({
            luar: "Masuk",
            dalam: "Keluar",
        }[type] || "");

    const ruanganBodyTemplate = (customer) => (
        <div>
            {customer.scanner ? (
                <Link
                    data={{ ruangan_id: customer.scanner.ruangan_id }}
                    href={route("admin.riwayat.ruangan")}
                >
                    {customer.scanner.ruangan.nama_ruangan}
                </Link>
            ) : (
                customer.kode
            )}
        </div>
    );

    const handleChangeDate = (e) => {
        const [start, end] = e.value;
        setDateRange([start, end]);
        setDates([
            moment(start).tz("Asia/Makassar").format("YYYY-MM-DD"),
            moment(end).tz("Asia/Makassar").format("YYYY-MM-DD"),
        ]);
    };

    const filterByDate = (e) => {
        e.preventDefault();
        router.get(route("admin.riwayat.index"), { dates });
    };

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Calendar
                value={dateRange}
                onChange={handleChangeDate}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
            />
            <Button label="Filter By Date" onClick={filterByDate} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <a
            // moment(start).tz("Asia/Makassar").format("YYYY-MM-DD")
            href={`/admin/riwayat/export?mulai=${moment(dateRange[0])
                .tz("Asia/Makassar")
                .format("YYYY-MM-DD")}&sampai=${moment(dateRange[1])
                .tz("Asia/Makassar")
                .format("YYYY-MM-DD")}`}
            rel="noopener noreferrer"
            className="p-button font-bold p-component"
        >
            <span className="p-button-icon p-c p-button-icon-left pi pi-download" />
            <span className="p-button-label p-c">Export</span>
        </a>
    );

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
                        />
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
                            filters={{
                                global: {
                                    value: null,
                                    matchMode: FilterMatchMode.CONTAINS,
                                },
                                "user.nim": {
                                    value: null,
                                    matchMode: FilterMatchMode.STARTS_WITH,
                                },
                                status: {
                                    value: null,
                                    matchMode: FilterMatchMode.STARTS_WITH,
                                },
                            }}
                            header={renderHeader()}
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
                                field="scanner.ruangan.nama_ruangan"
                                header="Ruangan"
                                sortable
                                filterPlaceholder="Type"
                                body={ruanganBodyTemplate}
                                filter
                                headerStyle={{ width: "10rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="scanner.type"
                                header="Type Scanner"
                                filterPlaceholder="Type"
                                headerStyle={{ width: "6rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="id_tag"
                                header="ID TAG"
                                sortable
                                filter
                                filterPlaceholder="Search by user"
                                headerStyle={{ width: "8rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="user.nim"
                                header="NIM"
                                filter
                                body={nimBodyTemplate}
                                sortable
                                filterPlaceholder="Search by user"
                                headerStyle={{ width: "12rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="user.nama"
                                header="Nama"
                                filter
                                sortable
                                body={userBodyTemplate}
                                filterPlaceholder="Search by user"
                                headerStyle={{ width: "30rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="status"
                                header="Status"
                                sortable
                                filterPlaceholder="Search by status"
                                body={statusBodyTemplate}
                                headerStyle={{ width: "5rem" }}
                                filter
                            />
                            <Column
                                headerClassName="fw-bold"
                                header="Ket."
                                filterPlaceholder="Search by status"
                                body={(rowData) => (
                                    <span>
                                        {getKeterangan(rowData.scanner?.type)}
                                    </span>
                                )}
                                headerStyle={{ width: "8rem" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Riwayat;
