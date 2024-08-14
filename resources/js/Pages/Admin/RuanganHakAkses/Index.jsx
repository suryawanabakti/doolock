import Layout from "@/Layouts/layout/layout";
import { router } from "@inertiajs/react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function Index({
    mahasiswa,
    mahasiswaSelected,
    ruangan,
    today,
}) {
    const [dataMahasiswa, setDataMahasiswa] = useState(mahasiswa);

    const onInputSearch = (e) => {
        var value = e.target.value;
        setGlobalFilter(value);
    };

    const header = (
        <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
            <h5>Hak Akses Masuk {ruangan.nama_ruangan}</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => onInputSearch(e)}
                    placeholder="Global Search"
                />
            </span>
        </div>
    );
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                route("admin.ruangan-hak-akses.store"),
                {
                    day: today,
                    selectedRows,
                    ruangan_id: ruangan.id,
                }
            );
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: `Berhasil simpan ${selectedRows.length} Mahasiswa. 🎉`,
                life: 3000,
            });
            console.log(res);
        } catch (error) {
            console.log(error);
            alert("error");
        }
        setLoading(false);
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    disabled={loading}
                    label="Kembali"
                    icon="pi pi-chevron-left"
                    severity="primary"
                    onClick={() => router.visit(route("admin.ruangan.index"))}
                />
            </div>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    disabled={loading}
                    label={`Save ${selectedRows.length} Mahasiswa`}
                    icon="pi pi-save"
                    severity="primary"
                    onClick={handleSave}
                />
            </div>
        );
    };

    const [ingredient, setIngredient] = useState(today);
    const [loadingTable, setLoadingTable] = useState(false);
    const handleDayChange = async (value) => {
        setIngredient(value);
        setLoadingTable(true);
        router.visit(
            route("admin.ruangan-hak-akses.index", {
                id: ruangan.id,
                today: value,
            }),
            {
                onFinish: () => {
                    setLoadingTable(false);
                },
            }
        );
    };

    const leftToolbarTemplate2 = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Mon"
                        name="day"
                        value="Mon"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Mon"}
                    />
                    <label htmlFor="Mon" className="ml-2">
                        Senin
                    </label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Tue"
                        name="day"
                        value="Tue"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Tue"}
                    />
                    <label htmlFor="Tue" className="ml-2">
                        Selasa
                    </label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Wed"
                        name="day"
                        value="Wed"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Wed"}
                    />
                    <label htmlFor="Wed" className="ml-2">
                        Rabu
                    </label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Thu"
                        name="day"
                        value="Thu"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Thu"}
                    />
                    <label htmlFor="Thu" className="ml-2">
                        Kamis
                    </label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Fri"
                        name="day"
                        value="Fri"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Fri"}
                    />
                    <label htmlFor="Fri" className="ml-2">
                        Jum'at
                    </label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Sat"
                        name="day"
                        value="Sat"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Sat"}
                    />
                    <label htmlFor="Sat" className="ml-2">
                        Sabtu
                    </label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton
                        inputId="Sun"
                        name="day"
                        value="Sun"
                        onChange={(e) => handleDayChange(e.value)}
                        checked={ingredient === "Sun"}
                    />
                    <label htmlFor="Sun" className="ml-2">
                        Minggu
                    </label>
                </div>
            </div>
        );
    };

    const [selectedRows, setSelectedRows] = useState(mahasiswaSelected);

    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "ruangan.nama_ruangan": {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    });

    const [globalFilter, setGlobalFilter] = useState(null);

    return (
        <Layout>
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12">
                    <Toolbar
                        className="mb-4"
                        left={leftToolbarTemplate}
                        right={rightToolbarTemplate}
                    ></Toolbar>
                    <Toolbar
                        className="mb-4"
                        center={leftToolbarTemplate2}
                    ></Toolbar>
                    <DataTable
                        loading={loadingTable}
                        globalFilter={globalFilter}
                        filters={filters}
                        header={header}
                        rows={10}
                        dataKey="id"
                        paginator
                        value={dataMahasiswa}
                        selection={selectedRows}
                        onSelectionChange={(e) => {
                            console.log(e.value);
                            setSelectedRows(e.value);
                        }}
                    >
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "3rem" }}
                        ></Column>
                        <Column
                            headerClassName="fw-bold"
                            field="id_tag"
                            header="ID TAG"
                            sortable
                            filterPlaceholder="ID TAG"
                            style={{ minWidth: "10rem" }}
                            headerStyle={{ width: "10rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="nim"
                            header="Nim"
                            sortable
                            filterPlaceholder="nim"
                            style={{ minWidth: "10rem" }}
                            headerStyle={{ width: "10rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="nama"
                            header="Nama"
                            sortable
                            filterPlaceholder="nama"
                            style={{ minWidth: "10rem" }}
                            headerStyle={{ width: "10rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="ruangan.nama_ruangan"
                            sortable
                            filter
                            filterPlaceholder="Nama Kelas"
                            header="Kelas"
                            style={{ minWidth: "10rem" }}
                            headerStyle={{ width: "10rem" }}
                        />
                    </DataTable>
                </div>
            </div>
        </Layout>
    );
}
