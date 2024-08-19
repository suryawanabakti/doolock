import Layout from "@/Layouts/layout/layout.jsx";
import { router } from "@inertiajs/react";
import moment from "moment-timezone";
import { FilterMatchMode } from "primereact/api";
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

const Absensi = ({
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
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <a
                    href={`/admin/riwayat-by-ruangan/export?mulai=${dateRange[0]}&sampai=${dateRange[1]}&ruangan_id=${ruangan?.id}`}
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
            route("admin.absensi.index"),
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
                    detail: `Tidak ditemukan absensi di ruangan ${
                        ruangan.nama_ruangan
                    } mulai tanggal ${moment(dates[0]).format(
                        "DD-MM-YYYY"
                    )} sampai ${moment(dates[1]).format("DD-MM-YYYY")}`,
                    life: 3000,
                });
            }
        }
    }, [customers]);
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
                        {riwayat.length > 0 && (
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
                                    field="tanggal"
                                    header="Tanggal"
                                    sortable
                                    filterPlaceholder="Search by user"
                                    headerStyle={{ width: "10rem" }}
                                />
                                <Column
                                    headerClassName="fw-bold"
                                    field="id_tag"
                                    header="ID TAG"
                                    sortable
                                    filterPlaceholder="Search by user"
                                    headerStyle={{ width: "6rem" }}
                                />

                                <Column
                                    headerClassName="fw-bold"
                                    field="user.nim"
                                    header="NIM"
                                    filter
                                    sortable
                                    filterPlaceholder="Search by nim"
                                    headerStyle={{ width: "8rem" }}
                                />
                                <Column
                                    headerClassName="fw-bold"
                                    field="user.nama"
                                    header="Nama"
                                    filter
                                    sortable
                                    filterPlaceholder="Search by user"
                                    headerStyle={{ width: "12rem" }}
                                />
                                <Column
                                    headerClassName="fw-bold"
                                    field="jam_masuk"
                                    header="Jam Masuk"
                                    sortable
                                    filterPlaceholder="Jam Masuk"
                                    headerStyle={{ width: "12rem" }}
                                />
                                <Column
                                    headerClassName="fw-bold"
                                    field="jam_keluar"
                                    header="Jam Keluar"
                                    sortable
                                    filterPlaceholder="Jam Keluar"
                                    headerStyle={{ width: "12rem" }}
                                />
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Absensi;
