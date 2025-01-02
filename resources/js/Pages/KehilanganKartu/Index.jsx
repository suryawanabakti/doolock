import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";

import Layout from "@/Layouts/layout/layout.jsx";
import { Transition } from "@headlessui/react";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";

const KehilanganKartu = ({ mahasiswa }) => {
    const { recentlySuccessful, patch } = useForm();
    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route("mahasiswa.kehilangan-kartu.update"));
    };
    return (
        <Layout>
            <div className="grid">
                <div className="col">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-green-500">
                            Berhasil Update ID CARD.
                        </p>
                    </Transition>
                    <Panel header="Kehilangan Kartu" className="">
                        <p>
                            Jika kartu anda hilang, silahkan hubungi admin untuk
                            melakukan pembuatan kartu baru.
                        </p>

                        <p>
                            Status ID Card :{" "}
                            {mahasiswa.status == 1 ? "Aktif" : "Tidak Aktif"}
                        </p>
                        <Button
                            onClick={handleUpdate}
                            size="sm"
                            severity={
                                mahasiswa.status == 1 ? "danger" : "success"
                            }
                        >
                            {mahasiswa.status == 1
                                ? "Nonaktifkan ID Card"
                                : "Aktfikan ID Card"}
                        </Button>
                    </Panel>
                </div>
            </div>
        </Layout>
    );
};

export default KehilanganKartu;
