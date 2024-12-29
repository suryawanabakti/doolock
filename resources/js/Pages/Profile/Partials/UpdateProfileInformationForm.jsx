import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useState } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
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
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Hi 👋 . {user.name}
                </p>
            </header>

            <form onSubmit={submit} className="mt-4 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Profile Picture
                    </label>
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

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
