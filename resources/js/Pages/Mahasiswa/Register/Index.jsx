"use client";

import Layout from "@/Layouts/layout/layout";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useState, useRef } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";

export default function Index({ jadwals, ruangans }) {
    // State management
    const [dataRuangans] = useState(ruangans);
    const [dataJadwals, setDataJadwals] = useState(jadwals);
    const [dialogNew, setDialogNew] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");

    // Time options for dropdowns
    const options = Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: `${i}:00`,
    }));

    // Refs
    const toast = useRef(null);

    // Get user from page props
    const user = usePage().props.auth.user;

    // Form handling
    const { data, setData, post, errors } = useForm({
        ruangan_id: "",
        tanggal: "",
        jam_masuk: "",
        jam_keluar: "",
        skill: "",
        additional_participant: "",
        tujuan: "",
    });

    // Handlers
    const onInputSearch = (e) => {
        setGlobalFilter(e.target.value);
    };

    const reject = () => {
        // Empty reject function for confirmPopup
    };

    const openNewDialog = (e) => {
        e.preventDefault();
        setDialogNew(true);
    };

    const handleChangeJamMasuk = (selectedOption) => {
        const formattedTime = `${String(selectedOption.value).padStart(
            2,
            "0"
        )}:00:00`;
        setData("jam_masuk", formattedTime);
    };

    const handleChangeJamKeluar = (selectedOption) => {
        const formattedTime = `${String(selectedOption.value).padStart(
            2,
            "0"
        )}:00:00`;
        setData("jam_keluar", formattedTime);
    };

    const handleChangeParticipant = (selectedOption) => {
        setData("additional_participant", selectedOption);
        setSelectedMahasiswa(selectedOption);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setProcessing(true);

        post(route("mahasiswa.register.store"), {
            onSuccess: () => {
                toast.current.show({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Jadwal berhasil ditambahkan",
                    life: 3000,
                });
                setDialogNew(false);
                location.reload();
            },
            onFinish: () => {
                setProcessing(false);
            },
            onError: (err) => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        err.message ||
                        Object.values(err)[0] ||
                        "Terjadi kesalahan",
                    life: 3000,
                });
            },
        });
    };

    const handleDelete = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Apakah anda yakin ingin menghapus jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(
                        route(
                            "mahasiswa.register.destroy",
                            rowData.hak_akses_id
                        )
                    );

                    toast.current.show({
                        severity: "success",
                        summary: "Berhasil",
                        detail: "Jadwal berhasil dihapus",
                        life: 3000,
                    });

                    // Remove the deleted item from the table
                    setDataJadwals(
                        dataJadwals.filter((item) => item.id !== rowData.id)
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

    // Load options for AsyncSelect
    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];

        const response = await fetch(
            `/api/v1/search-mahasiswa?search=${inputValue}`
        );
        const data = await response.json();
        console.log(data);
        return data.map((mhs) => ({
            label: `${mhs.nama} - ${mhs.nim}`,
            value: mhs.id,
            email: mhs.nim,
        }));
    };

    // Templates
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
                        value={`${participant.label}`}
                        severity="info"
                        className="mr-1 mb-1"
                    />
                ))}
            </div>
        );
    };

    // Action button template
    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                onClick={(event) => handleDelete(event, rowData)}
                tooltip="Hapus Jadwal"
                tooltipOptions={{ position: "top" }}
            />
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

            {/* Add Schedule Dialog */}
            <Dialog
                header="Tambah Jadwal"
                visible={dialogNew}
                style={{ width: "85%" }}
                onHide={() => setDialogNew(false)}
                footer={
                    <div className="flex justify-content-end">
                        <Button
                            label="Batal"
                            icon="pi pi-times"
                            onClick={() => setDialogNew(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Simpan"
                            icon="pi pi-save"
                            onClick={handleSave}
                            disabled={processing}
                            severity="primary"
                        />
                    </div>
                }
            >
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="ruangan" className="font-bold">
                                Ruangan <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.value);
                                    setData("ruangan_id", e.value.code);
                                }}
                                options={dataRuangans}
                                optionLabel="name"
                                placeholder="Pilih ruangan"
                                filter
                                valueTemplate={selectedCountryTemplate}
                                itemTemplate={countryOptionTemplate}
                                className="w-full"
                            />
                            {errors.ruangan_id && (
                                <small className="p-error">
                                    {errors.ruangan_id}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="tanggal" className="font-bold">
                                Tanggal <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                className="w-full"
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) =>
                                    setData("tanggal", e.target.value)
                                }
                                autoFocus
                            />
                            {errors.tanggal && (
                                <small className="p-error">
                                    {errors.tanggal}
                                </small>
                            )}
                        </div>

                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label
                                        htmlFor="jam_masuk"
                                        className="font-bold"
                                    >
                                        Jam Masuk{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        className="w-full"
                                        options={options}
                                        onChange={handleChangeJamMasuk}
                                        placeholder="Pilih Jam"
                                        isSearchable
                                    />
                                    {errors.jam_masuk && (
                                        <small className="p-error">
                                            {errors.jam_masuk}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label
                                        htmlFor="jam_keluar"
                                        className="font-bold"
                                    >
                                        Jam Keluar{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        className="w-full"
                                        options={options}
                                        onChange={handleChangeJamKeluar}
                                        placeholder="Pilih Jam"
                                        isSearchable
                                    />
                                    {errors.jam_keluar && (
                                        <small className="p-error">
                                            {errors.jam_keluar}
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="tujuan" className="font-bold">
                                Tujuan <span className="text-red-500">*</span>
                            </label>
                            <InputTextarea
                                autoResize
                                value={data.tujuan}
                                onChange={(e) =>
                                    setData("tujuan", e.target.value)
                                }
                                rows={3}
                                className="w-full"
                            />
                            {errors.tujuan && (
                                <small className="p-error">
                                    {errors.tujuan}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="skill" className="font-bold">
                                Skill <span className="text-red-500">*</span>
                            </label>
                            <InputTextarea
                                autoResize
                                value={data.skill}
                                onChange={(e) =>
                                    setData("skill", e.target.value)
                                }
                                rows={3}
                                className="w-full"
                            />
                            {errors.skill && (
                                <small className="p-error">
                                    {errors.skill}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="field">
                            <label
                                htmlFor="additional_participant"
                                className="font-bold"
                            >
                                Peserta Tambahan
                            </label>
                            <AsyncSelect
                                isMulti
                                cacheOptions
                                loadOptions={loadOptions}
                                defaultOptions
                                onChange={handleChangeParticipant}
                                placeholder="Cari Mahasiswa..."
                                className="w-full"
                            />
                            {errors.additional_participant && (
                                <small className="p-error">
                                    {errors.additional_participant}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>

            <div className="grid">
                <div className="col-12">
                    <Card>
                        <Toolbar
                            className="mb-4"
                            left={() => (
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={openNewDialog}
                                        label="Tambah Jadwal Baru"
                                        icon="pi pi-plus"
                                        severity="primary"
                                    />
                                </div>
                            )}
                        />

                        {!user.email_notifikasi && !user.nowa && (
                            <div className="p-3 mb-4 border-1 border-yellow-300 bg-yellow-50 border-round">
                                <div className="flex align-items-center">
                                    <i className="pi pi-exclamation-triangle text-yellow-500 mr-2"></i>
                                    <span>
                                        Mohon lengkapi email dan nohp Anda untuk
                                        menerima notifikasi penting, seperti
                                        peringatan saat keluar ruangan,
                                        persetujuan permohonan, dan informasi
                                        lainnya. Terima kasih! 😊{" "}
                                        <Link
                                            href="/profile"
                                            className="font-medium"
                                        >
                                            Klik disini
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        )}

                        <DataTable
                            value={dataJadwals}
                            paginator
                            rows={10}
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
                            <Column
                                body={actionBodyTemplate}
                                header="Aksi"
                                style={{ minWidth: "8rem" }}
                                exportable={false}
                            />
                        </DataTable>

                        <div className="mt-4">
                            <Link
                                href={route("mahasiswa.register-approve.index")}
                                className="flex align-items-center text-primary"
                            >
                                <i className="pi pi-check-circle mr-2"></i>
                                Lihat Jadwal yang <b className="ml-1">
                                    sudah
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
