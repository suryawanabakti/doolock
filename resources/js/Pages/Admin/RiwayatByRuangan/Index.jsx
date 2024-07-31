import Layout from "@/Layouts/layout/layout.jsx";
import { router } from "@inertiajs/react";
import moment from "moment-timezone";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";

const RiwayatByRuangan = ({
    auth,
    mulai,
    sampai,
    ruangan,
    riwayat,
    ruangans,
    dataKosong,
}) => {
    const [customers, setCustomers] = useState(riwayat);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const toast = useRef(null);
    const [dates, setDates] = useState([new Date(mulai), new Date(sampai)]);

    const [globalFilter, setGlobalFilter] = useState("");
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                {ruangan && (
                    <React.Fragment>
                        <h5> Ruangan : {ruangan?.nama_ruangan} </h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Global Search"
                            />
                        </span>
                    </React.Fragment>
                )}
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
        return <span> {customer.user ? customer.user.nama : "-"}</span>;
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
                <a
                    href={`/admin/riwayat-by-ruangan/export?mulai=${dateRange[0]}&sampai=${dateRange[1]}&ruangan_id=${ruangan.id}`}
                    rel="noopener noreferrer"
                    className="p-button font-bold p-component"
                >
                    <span
                        class="p-button-icon p-c p-button-icon-left pi pi-download"
                        data-pc-section="icon"
                    ></span>
                    <span class="p-button-label p-c" data-pc-section="label">
                        Export
                    </span>
                </a>
            </React.Fragment>
        );
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };
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
    // TEST
    const filterByDate = (e) => {
        e.preventDefault();
        router.get(
            route("admin.riwayat-by-ruangan.index"),
            { dates, ruangan_id: ruangan.id },
            {
                onSuccess: () => {},
            }
        );
    };

    useEffect(() => {
        if (ruangan) {
            if (dataKosong) {
                toast.current.show({
                    severity: "warn",
                    summary: "Warning",
                    detail: `Tidak ditemukan riwayat di ruangan ${
                        ruangan.nama_ruangan
                    } mulai tanggal ${moment(dates[0]).format(
                        "DD-MM-YYYY"
                    )} sampai ${moment(dates[1]).format("DD-MM-YYYY")}`,
                    life: 3000,
                });
            }

            window.Echo.private(`management.${auth.user.id}`).listen(
                "StoreHistoryEvent",
                (event) => {
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
                    if (event.ruangan.id == ruangan.id) {
                        const updatedUsers = [data, ...customers];
                        setCustomers(updatedUsers);
                    }
                }
            );
        }
    }, [customers]);
    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="field">
                            <label htmlFor="ruangan" className="font-bold">
                                Ruangan
                            </label>
                            <Dropdown
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.value);
                                    router.get(
                                        `/admin/riwayat-by-ruangan?ruangan_id=${e.value.code}`,
                                        {}
                                    );
                                }}
                                options={ruangans}
                                optionLabel="name"
                                placeholder="Select a Room"
                                filter
                                valueTemplate={selectedCountryTemplate}
                                itemTemplate={countryOptionTemplate}
                                className="w-full "
                            />
                        </div>
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        ></Toolbar>
                        {riwayat.length > 0 && (
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
                                    field="kode"
                                    header="Kode Scanner"
                                    sortable
                                    filter
                                    filterPlaceholder="Type"
                                    headerStyle={{ width: "12rem" }}
                                />

                                <Column
                                    headerClassName="fw-bold"
                                    field="type"
                                    filter
                                    header="Type"
                                    sortable
                                    filterPlaceholder="Type"
                                    body={(rowData) => {
                                        return (
                                            <span>{rowData.scanner?.type}</span>
                                        );
                                    }}
                                    headerStyle={{ width: "8rem" }}
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
                                    filter
                                    filterPlaceholder="Search by status"
                                    body={statusBodyTemplate}
                                    headerStyle={{ width: "10rem" }}
                                />
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RiwayatByRuangan;
