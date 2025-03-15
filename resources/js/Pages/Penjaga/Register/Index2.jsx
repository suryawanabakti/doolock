"use client";

import Layout from "@/Layouts/layout/layout";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { FilterMatchMode } from "primereact/api";
import { Card } from "primereact/card";

export default function Index2({ jadwals, ruangan }) {
    // State management
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [dataJadwals, setDataJadwals] = useState(jadwals);

    // Refs
    const toast = useRef(null);

    // Handlers
    const onInputSearch = (e) => {
        setGlobalFilter(e.target.value);
    };

    const reject = () => {
        toast.current.show({
            severity: "warn",
            summary: "Dibatalkan",
            detail: "Operasi dibatalkan",
            life: 3000,
        });
    };

    // Unapprove a schedule
    const handleUnapprove = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Apakah anda yakin membatalkan pendaftaran jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-warning",
            accept: async () => {
                try {
                    await axios.patch(
                        route("penjaga.pendaftaran.unapprove", rowData.id)
                    );

                    toast.current.show({
                        severity: "success",
                        summary: "Berhasil",
                        detail: "Jadwal berhasil dibatalkan",
                        life: 3000,
                    });

                    // Remove the unapproved item from the table
                    setDataJadwals((prevData) =>
                        prevData.filter((user) => user.id !== rowData.id)
                    );
                } catch (e) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: e.response?.data?.message || e.message,
                        life: 3000,
                    });
                }
            },
            reject,
        });
    };

    // Action button template - keeping the original as requested
    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-undo"
                rounded
                outlined
                severity="warning"
                onClick={(event) => handleUnapprove(event, rowData)}
                tooltip="Batalkan Persetujuan"
                tooltipOptions={{ position: "top" }}
            />
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
    // Render mahasiswa information template
    const mahasiswaTemplate = (rowData) => {
        return (
            <div className="flex flex-column">
                <span className="font-bold mb-1">{rowData.mahasiswa.nama}</span>
                <span className="text-sm text-color-secondary">
                    NIM: {rowData.mahasiswa.nim}
                </span>
            </div>
        );
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
    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />

            <div className="grid">
                <div className="col-12">
                    <Card title={ruangan.nama_ruangan} className="mb-4">
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
                                header="Mahasiswa"
                                body={mahasiswaTemplate}
                                sortable
                                sortField="mahasiswa.nama"
                                style={{ minWidth: "14rem" }}
                            />
                            <Column
                                header="Jadwal"
                                body={scheduleTemplate}
                                sortable
                                sortField="hak_akses.tanggal"
                                style={{ minWidth: "14rem" }}
                            />
                            <Column
                                field="hak_akses.tujuan"
                                header="Tujuan"
                                sortable
                                style={{ minWidth: "12rem" }}
                            />
                            <Column
                                field="hak_akses.skill"
                                header="Skill"
                                sortable
                                style={{ minWidth: "10rem" }}
                            />
                            {/* <Column
                                field="hak_akses.additional_participant"
                                header="Participant"
                                sortable

                                style={{ minWidth: "10rem" }}
                            /> */}
                            <Column
                                body={actionBodyTemplate}
                                header="Aksi"
                                style={{ minWidth: "8rem" }}
                                exportable={false}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
