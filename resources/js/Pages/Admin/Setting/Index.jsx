import Layout from "@/Layouts/layout/layout.jsx";
import { Calendar } from "primereact/calendar";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

const Scanner = () => {
    const toast = useRef(null);
    const [jamMasuk, setJamMasuk] = useState(new Date());
    const [jamPulang, setJamPulang] = useState(new Date());
    console.log(jamMasuk);
    useEffect(() => {}, []);

    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="grid">
                            <div className="col-6">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="username">Jam Masuk </label>
                                    <Calendar
                                        value={jamMasuk}
                                        onChange={(e) => setJamMasuk(e.value)}
                                        timeOnly
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="username">
                                        Jam Pulang{" "}
                                    </label>
                                    <Calendar
                                        value={jamPulang}
                                        onChange={(e) => setJamPulang(e.value)}
                                        timeOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Scanner;
