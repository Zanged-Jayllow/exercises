import type { FormSchema } from "./FormBoiler";

const PROFILE_SCHEMA: FormSchema = {
    title: "Add New Profile",
    fields: [
        {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "John Smith",
            validation: { required: true, minLength: 2 },
        },
        {
            id: "bio",
            type: "textarea",
            label: "Short Bio",
            placeholder: "Tell us about yourself",
            validation: { maxLength: 100 },
        },
        {
            id: "avatarUrl",
            type: "url",
            label: "URL Link To Avatar Image",
            placeholder: "https://i.pravatar.cc/200?img=12",
            validation: { required: true, pattern: "^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$", message: "Enter a valid url." },
        },
        {
            id: "colorScheme",
            type: "select",
            label: "Profile Color",
            options: [
                { label: "Red", value: "#e90e0e" },
                { label: "Green", value: "#0ee948" },
                { label: "Blue", value: "#0e53e9" },
                { label: "Orange", value: "#e9830e" },
                { label: "Yellow", value: "#e9d00e" },
                { label: "Mint", value: "#0ee99c" },
                { label: "Ultraviolet", value: "#830ee9" },
                { label: "Cerulean", value: "#0e8ee9" },
            ],
            validation: { required: true },
        },
    ],
};

export default PROFILE_SCHEMA;