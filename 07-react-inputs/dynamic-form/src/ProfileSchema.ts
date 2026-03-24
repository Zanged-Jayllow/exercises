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
            placeholder: "Tell us about yourself…",
            validation: { maxLength: 200 },
        },
        {
            id: "avatarUrl",
            type: "checkbox",
            label: "I agree to the terms and conditions",
            validation: { required: true, message: "You must agree to continue." },
        },
        {
            id: "colorScheme",
            type: "checkbox",
            label: "I agree to the terms and conditions",
            validation: { required: true, message: "You must agree to continue." },
        },
    ],
};

export default PROFILE_SCHEMA;