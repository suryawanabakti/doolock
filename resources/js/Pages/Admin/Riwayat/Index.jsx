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

const Riwayat = ({ auth, riwayat, mulai, sampai }) => {
    const [customers, setCustomers] = useState(riwayat);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const toast = useRef(null);
    const [dates, setDates] = useState([new Date(mulai), new Date(sampai)]);
    useEffect(() => {
        window.Echo.private(`management.${auth.user.id}`).listen(
            "StoreHistoryEvent",
            (event) => {
                console.log("REALTIME EVENT", event);
                if (event.histori?.status == 0) {
                    var status = "Blok";
                }
                if (event.histori?.status == 1) {
                    var status = "Terbuka";
                }

                if (event.histori?.status == 2) {
                    var status = "Tidak Terdaftar";
                }

                var data = {
                    id: event.histori.id,
                    id_tag: event.histori.id_tag,
                    user: event.histori.user,
                    status: status,
                    scanner: event.histori.scanner,
                    kode: event.histori.kode,
                    waktu: event.histori.waktu,
                };

                const updatedUsers = [data, ...customers];
                setCustomers(updatedUsers);
            }
        );
    }, [customers]);

    const [globalFilter, setGlobalFilter] = useState("");
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>
                    <span>Riwayat</span>
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
        switch (customer.status) {
            case "Terbuka":
                return "success";
            case "Blok":
                return "danger";
            case "Tidak Terdaftar":
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
        return (
            <Link
                href={route("admin.riwayat.mahasiswa")}
                data={{
                    id_tag: customer.id_tag,
                }}
            >
                {" "}
                {customer.user ? `${customer.user.nama}` : "-"}
            </Link>
        );
    };

    const nimBodyTemplate = (customer) => {
        return (
            <Link
                href={route("admin.riwayat.mahasiswa")}
                data={{
                    id_tag: customer.id_tag,
                }}
            >
                {" "}
                {customer.user ? `${customer.user.nim}` : "-"}
            </Link>
        );
    };

    const ruanganBodyTemplate = (customer) => {
        return (
            <div>
                {" "}
                {customer.scanner ? (
                    <Link
                        data={{
                            ruangan_id: customer.scanner?.ruangan_id,
                        }}
                        href={route("admin.riwayat.ruangan")}
                    >
                        {customer.scanner.ruangan.nama_ruangan} /{" "}
                        {customer.scanner?.type}
                    </Link>
                ) : (
                    customer.kode
                )}
                {/* <Tooltip target="#textWithTooltip" /> */}
            </div>
        );
    };

    const filterByDate = (e) => {
        e.preventDefault();
        router.get(
            route("admin.riwayat.index"),
            { dates },
            {
                onSuccess: () => {},
            }
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Calendar
                    value={dates}
                    onChange={(e) => setDates(e.value)}
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
            <Button
                label="Export"
                icon="pi pi-download"
                className="p-button-help"
            />
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
                                headerClassName="fw-bold"
                                field="waktu"
                                header="Waktu"
                                sortable
                                filterPlaceholder="Waktu"
                                headerStyle={{ width: "12rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="scanner"
                                header="Ruangan"
                                sortable
                                filterPlaceholder="Type"
                                body={ruanganBodyTemplate}
                                filter
                                headerStyle={{ width: "12rem" }}
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
                                field="user"
                                header="NIM"
                                filter
                                sortable
                                body={nimBodyTemplate}
                                filterPlaceholder="Search by user"
                                headerStyle={{ width: "12rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="user"
                                header="Nama"
                                filter
                                sortable
                                body={userBodyTemplate}
                                filterPlaceholder="Search by user"
                                headerStyle={{ width: "12rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="status"
                                header="Status"
                                sortable
                                filterPlaceholder="Search by status"
                                body={statusBodyTemplate}
                                headerStyle={{ width: "10rem" }}
                                filter
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Riwayat;
