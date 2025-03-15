"use client";

import Layout from "@/Layouts/layout/layout";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState, useRef } from "react";
import { Link } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { FilterMatchMode } from "primereact/api";

export default function Index2({ jadwals }) {
    // State management
    const [dataJadwals] = useState(jadwals);
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");

    // Refs
    const toast = useRef(null);

    // Handlers
    const onInputSearch = (e) => {
        setGlobalFilter(e.target.value);
    };

    // Render schedule information template
    const scheduleTemplate = (rowData) => {
        return (
            <div className="flex flex-column">
                <span className="mb-1">
                    <i className="pi pi-calendar mr-2"></i>
                    {rowData.hak_akses.tanggal}
                </span>
                <span className="mb-1">
                    <i className="pi pi-clock mr-2"></i>
                    {rowData.hak_akses.jam_masuk} -{" "}
                    {rowData.hak_akses.jam_keluar}
                </span>
            </div>
        );
    };

    // Render participants template with improved styling
    const participantsTemplate = (rowData) => {
        const participants = rowData.hak_akses.additional_participant || [];

        if (participants.length === 0) {
            return <span className="text-color-secondary">Tidak ada</span>;
        }

        return (
            <div className="flex flex-wrap gap-1">
                {participants.map((participant, index) => (
                    <Tag
                        key={index}
                        value={participant.label}
                        severity="info"
                        className="mr-1 mb-1"
                    />
                ))}
            </div>
        );
    };

    // Header template for the DataTable
    const headerTemplate = () => (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2">
            <h5 className="m-0">
                Pendaftaran Jadwal{" "}
                <Badge value="Disetujui" severity="success" />
            </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilter}
                    onChange={onInputSearch}
                    placeholder="Cari..."
                />
            </span>
        </div>
    );

    return (
        <Layout>
            <Toast ref={toast} />

            <div className="grid">
                <div className="col-12">
                    <Card>
                        <DataTable
                            value={dataJadwals}
                            paginator
                            rows={10}
                            filters={filters}
                            globalFilter={globalFilter}
                            header={headerTemplate}
                            emptyMessage="Tidak ada jadwal yang disetujui"
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} jadwal"
                            responsiveLayout="scroll"
                            className="p-datatable-gridlines"
                            stripedRows
                        >
                            <Column
                                field="hak_akses.ruangan.nama_ruangan"
                                header="Ruangan"
                                sortable
                                style={{ minWidth: "12rem" }}
                            />
                            <Column
                                header="Jadwal"
                                body={scheduleTemplate}
                                sortable
                                sortField="hak_akses.tanggal"
                                style={{ minWidth: "14rem" }}
                            />
                            <Column
                                field="hak_akses.skill"
                                header="Skill"
                                sortable
                                style={{ minWidth: "15rem" }}
                            />
                            <Column
                                field="hak_akses.tujuan"
                                header="Tujuan"
                                sortable
                                style={{ minWidth: "15rem" }}
                            />
                            <Column
                                header="Peserta Tambahan"
                                body={participantsTemplate}
                                style={{ minWidth: "15rem" }}
                            />
                        </DataTable>

                        <div className="mt-4">
                            <Link
                                href={route("mahasiswa.register.index")}
                                className="flex align-items-center text-primary"
                            >
                                <i className="pi pi-clock mr-2"></i>
                                Lihat Jadwal yang <b className="ml-1">
                                    belum
                                </b>{" "}
                                di approve
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
