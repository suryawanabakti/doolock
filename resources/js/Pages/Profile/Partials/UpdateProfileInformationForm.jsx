import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email_notifikasi: user.email_notifikasi,
            image: null,
        });

    const [preview, setPreview] = useState(
        user.image ? `/storage/${user.image}` : null
    );

    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        // Submit form with the updated image
        post(route("profile.update"), {
            onSuccess: () => {
                if (data.image) {
                    setPreview(URL.createObjectURL(data.image));
                }
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Hi 👋 . {user.name} . Harap lengkapi data anda di bawah ini.
                </p>
            </header>

            <form onSubmit={submit} className="mt-4">
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm font-bold text-green-500">
                        Berhasil update profile 🎉🎉.
                    </p>
                </Transition>
                <div className="field">
                    <label className="block text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        type="text"
                        className="block w-full text-sm "
                        value={data.email_notifikasi}
                        onChange={(e) =>
                            setData("email_notifikasi", e.target.value)
                        }
                        placeholder="Masukkan Email Untuk Notifikasi...."
                    />
                    <InputError
                        message={errors.email_notifikasi}
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Foto</label>
                    <div className="mt-2 flex items-center gap-4">
                        {preview && (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="h-5 w-5 rounded-full object-cover"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500"
                        />
                    </div>
                    <InputError message={errors.image} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 mt-3">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
