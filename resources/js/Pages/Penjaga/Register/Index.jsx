"use client";

import Layout from "@/Layouts/layout/layout";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { FilterMatchMode } from "primereact/api";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export default function Index({ jadwals, ruangan }) {
    const participantsTemplate = (rowData) => {
        const participants = rowData.hak_akses.additional_participant || [];
        console.log("PARTIICPANT", participants);
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
    // Get ruangan_id from URL params
    const searchParams = new URLSearchParams(window.location.search);
    const ruangan_id = searchParams.get("id");

    // State management
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [dataJadwals, setDataJadwals] = useState(jadwals);
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    // Refs
    const toast = useRef(null);

    // Handlers
    const onInputSearch = (e) => {
        setGlobalFilter(e.target.value);
    };

    const reject = () => {
        // Empty reject function for confirmPopup
    };

    // Approve a single schedule
    const handleApprove = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Apakah anda yakin menyutujui pendaftaran jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    const res = await axios.patch(
                        route("penjaga.pendaftaran.approve", rowData.id),
                        {
                            ruangan_id: ruangan_id,
                        }
                    );

                    toast.current.show({
                        severity: "success",
                        summary: "Berhasil",
                        detail: "Jadwal berhasil disetujui",
                        life: 3000,
                    });

                    // Remove the approved item from the table
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

    // Approve multiple schedules
    const multiApprove = (e) => {
        e.preventDefault();
        confirmPopup({
            target: e.currentTarget,
            message: "Apakah anda yakin menyutujui pendaftaran jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    await axios.post(
                        route("penjaga.pendaftaran.multi-approve"),
                        {
                            selectedCustomers: selectedCustomers,
                            ruangan_id: ruangan_id,
                        }
                    );

                    toast.current.show({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `${selectedCustomers.length} jadwal berhasil disetujui`,
                        life: 3000,
                    });

                    // Reload the page to refresh data
                    location.reload();
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

    // Disapprove multiple schedules
    const multiDisapprove = (e) => {
        e.preventDefault();
        confirmPopup({
            target: e.currentTarget,
            message: "Apakah anda yakin menolak pendaftaran jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.post(
                        route("penjaga.pendaftaran.multi-disapprove"),
                        {
                            selectedCustomers: selectedCustomers,
                            ruangan_id: ruangan_id,
                        }
                    );

                    toast.current.show({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `${selectedCustomers.length} jadwal berhasil ditolak`,
                        life: 3000,
                    });

                    // Reload the page to refresh data
                    location.reload();
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

    // Action button template
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-content-center">
                <Button
                    icon="pi pi-check"
                    rounded
                    outlined
                    severity="success"
                    onClick={(e) => handleApprove(e, rowData)}
                    tooltip="Approve"
                    tooltipOptions={{ position: "top" }}
                />
            </div>
        );
    };

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

    // Header template for the DataTable
    const headerTemplate = () => (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2">
            <h5 className="m-0">
                Pendaftaran Jadwal <Badge value="Menunggu" severity="warning" />
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
            <ConfirmPopup />

            <div className="grid">
                <div className="col-12">
                    <Card title={ruangan.nama_ruangan} className="mb-4">
                        <Toolbar
                            className="mb-4"
                            left={() => (
                                <div className="flex gap-2">
                                    <Button
                                        label="Terima Semua"
                                        icon="pi pi-check"
                                        severity="success"
                                        disabled={selectedCustomers.length <= 0}
                                        onClick={multiApprove}
                                    />
                                    <Button
                                        label="Tolak Semua"
                                        icon="pi pi-times"
                                        severity="danger"
                                        disabled={selectedCustomers.length <= 0}
                                        onClick={multiDisapprove}
                                    />
                                </div>
                            )}
                            right={() => (
                                <div>
                                    <span className="text-sm text-color-secondary mr-2">
                                        {selectedCustomers.length} item dipilih
                                    </span>
                                </div>
                            )}
                        />

                        <DataTable
                            value={dataJadwals}
                            paginator
                            rows={10}
                            dataKey="hak_akses_id"
                            selection={selectedCustomers}
                            onSelectionChange={(e) =>
                                setSelectedCustomers(e.value)
                            }
                            filters={filters}
                            globalFilter={globalFilter}
                            header={headerTemplate}
                            emptyMessage="Tidak ada jadwal yang menunggu persetujuan"
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} jadwal"
                            responsiveLayout="scroll"
                            className="p-datatable-gridlines"
                            stripedRows
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{ width: "3rem" }}
                                exportable={false}
                            />
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
                                style={{ minWidth: "12rem" }}
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
                            <Column
                                field="hak_akses.additional_participant"
                                header="Participant"
                                body={participantsTemplate}
                                sortable
                                style={{ minWidth: "10rem" }}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
