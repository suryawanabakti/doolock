import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
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

const StatusBodyTemplate = ({ status }) => (
    <Tag value={status} severity={getSeverity(status)} />
);

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
    const [dates, setDates] = useState([new Date(mulai), new Date(sampai)]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [dateRange, setDateRange] = useState([
        new Date(mulai),
        new Date(sampai),
    ]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const toast = useRef(null);

    const header = useMemo(() => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                {ruangan && (
                    <>
                        <h5> Ruangan : {ruangan?.nama_ruangan} </h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Global Search"
                            />
                        </span>
                    </>
                )}
            </div>
        );
    }, [ruangan]);

    const handleChangeDate = useCallback((e) => {
        const [start, end] = e.value;
        setDateRange([start, end]);
        setDates([
            moment(start).tz("Asia/Makassar").format("YYYY-MM-DD"),
            moment(end).tz("Asia/Makassar").format("YYYY-MM-DD"),
        ]);
    }, []);

    const filterByDate = useCallback(
        (e) => {
            e.preventDefault();
            router.get(route("admin.riwayat-by-ruangan.index"), {
                dates,
                ruangan_id: ruangan.id,
            });
        },
        [dates, ruangan]
    );

    const leftToolbarTemplate = useMemo(
        () => (
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
        ),
        [dateRange, handleChangeDate, filterByDate]
    );

    const rightToolbarTemplate = useMemo(
        () => (
            <a
                href={`/admin/riwayat-by-ruangan/export?mulai=${dateRange[0]}&sampai=${dateRange[1]}&ruangan_id=${ruangan?.id}`}
                rel="noopener noreferrer"
                className="p-button font-bold p-component"
            >
                <span className="p-button-icon p-c p-button-icon-left pi pi-download"></span>
                <span className="p-button-label p-c">Export</span>
            </a>
        ),
        [dateRange, ruangan]
    );

    const countryOptionTemplate = useCallback(
        (option) => (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        ),
        []
    );

    const selectedCountryTemplate = useCallback(
        (option, props) => (
            <div className="flex align-items-center">
                <div>{option ? option.name : props.placeholder}</div>
            </div>
        ),
        []
    );

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

            window.Echo.private(`management.1`).listen(
                "StoreHistoryEvent",
                (event) => {
                    const statusMap = [
                        "Blok",
                        "Terbuka",
                        "Tidak Terdaftar",
                        "No Akses",
                    ];
                    const status = statusMap[event.histori?.status] || null;

                    const data = {
                        id: event.histori.id,
                        id_tag: event.histori.id_tag,
                        user: event.histori.user,
                        status,
                        scanner: event.histori.scanner,
                        kode: event.histori.kode,
                        waktu: event.histori.waktu,
                    };

                    if (event.ruangan.id === ruangan.id) {
                        setCustomers((prevCustomers) => [
                            data,
                            ...prevCustomers,
                        ]);
                    }
                }
            );
        }
    }, [customers, dataKosong, dates, ruangan]);

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
                                        `/admin/riwayat-by-ruangan?ruangan_id=${e.value.code}`
                                    );
                                }}
                                options={ruangans}
                                optionLabel="name"
                                placeholder="Select a Room"
                                filter
                                valueTemplate={selectedCountryTemplate}
                                itemTemplate={countryOptionTemplate}
                                className="w-full"
                            />
                        </div>
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        />
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
                                    body={({ scanner }) => (
                                        <span>{scanner?.type}</span>
                                    )}
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
                                    field="user.nama"
                                    header="Nama"
                                    filter
                                    sortable
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
                                    body={({ status }) => (
                                        <StatusBodyTemplate status={status} />
                                    )}
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
