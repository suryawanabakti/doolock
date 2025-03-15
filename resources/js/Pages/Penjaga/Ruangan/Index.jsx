import Layout from "@/Layouts/layout/layout.jsx";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import { useState } from "react";
import { useEffect } from "react";

const RuanganUpdate = ({ ruangan, mahasiswas }) => {
    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];

        const response = await fetch(
            `/api/v1/search-dosen?search=${inputValue}`
        );

        const data = await response.json();

        return data.map((user) => ({
            label: user.name,
            value: user.id,
        }));
    };

    const [selectedDosen, setSelectedDosen] = useState(null);

    const { data, setData, put, processing, errors } = useForm({
        max_register: ruangan.max_register || 10,
        jam_buka: ruangan.jam_buka || "00:01",
        jam_tutup: ruangan.jam_tutup || "23:59",
        mahasiswa_id: ruangan.mahasiswa_id || null,
        penanggung_jawab: ruangan.penanggung_jawab || null,
    });

    const handleChangeParticipant = (selectedOption) => {
        setData("penanggung_jawab", selectedOption);
        setSelectedDosen(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("penjaga.ruangan.update", ruangan.id), {
            onSuccess: () => alert("berhasil update"),
            preserveScroll: true,
        });
    };

    useEffect(() => {
        setSelectedDosen(ruangan.penanggung_jawab);
    }, []);
    return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-lg">
                    <Card
                        title="Update Ruangan"
                        className="shadow-lg rounded-xl p-6"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="field">
                                <label
                                    htmlFor="nama_ruangan"
                                    className="font-semibold"
                                >
                                    Nama Ruangan
                                </label>
                                <InputText
                                    id="nama_ruangan"
                                    value={ruangan.nama_ruangan}
                                    disabled
                                    className={`w-full p-2 border rounded-md ${
                                        errors.nama_ruangan ? "p-invalid" : ""
                                    }`}
                                />
                                {errors.nama_ruangan && (
                                    <small className="text-red-500">
                                        {errors.nama_ruangan}
                                    </small>
                                )}
                            </div>

                            <div className="field">
                                <label
                                    htmlFor="max_register"
                                    className="font-semibold"
                                >
                                    Maksimal Registrasi
                                </label>
                                <InputText
                                    id="max_register"
                                    type="number"
                                    value={data.max_register}
                                    onChange={(e) =>
                                        setData("max_register", e.target.value)
                                    }
                                    className={`w-full p-2 border rounded-md ${
                                        errors.max_register ? "p-invalid" : ""
                                    }`}
                                />
                                {errors.max_register && (
                                    <small className="text-red-500">
                                        {errors.max_register}
                                    </small>
                                )}
                            </div>

                            <div className="field">
                                <label
                                    htmlFor="jam_buka"
                                    className="font-semibold"
                                >
                                    Jam Buka
                                </label>
                                <InputText
                                    id="jam_buka"
                                    type="time"
                                    value={data.jam_buka}
                                    onChange={(e) =>
                                        setData("jam_buka", e.target.value)
                                    }
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div className="field">
                                <label
                                    htmlFor="jam_tutup"
                                    className="font-semibold"
                                >
                                    Jam Tutup
                                </label>
                                <InputText
                                    id="jam_tutup"
                                    type="time"
                                    value={data.jam_tutup}
                                    onChange={(e) =>
                                        setData("jam_tutup", e.target.value)
                                    }
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="field">
                                <label
                                    htmlFor="additional_participant"
                                    className="font-bold"
                                >
                                    Dosen Penanggung Jawab
                                </label>
                                <AsyncSelect
                                    isMulti
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    value={selectedDosen}
                                    onChange={handleChangeParticipant}
                                    placeholder="Cari Dosen Penanggung jawab..."
                                    className="w-full"
                                />
                                {errors.additional_participant && (
                                    <small className="p-error">
                                        {errors.additional_participant}
                                    </small>
                                )}
                            </div>

                            <Button
                                type="submit"
                                label="Update"
                                icon="pi pi-check"
                                loading={processing}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                            />
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default RuanganUpdate;
