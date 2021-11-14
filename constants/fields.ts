import { FieldType, LenderFields } from "lib/types";

const fields: Record<FieldType, LenderFields> = {
    first_name: {
        name: 'first_name',
        type: 'text',
        required: true
    },
    last_name: {
        name: 'last_name',
        type: 'text',
        required: true
    },
    email: {
        name: 'email',
        type: 'text',
        required: true
    },
    date_of_birth: {
        name: 'date_of_birth',
        type: 'date',
        required: true
    },
    monthly_income: {
        name: 'monthly_income',
        type: 'number',
        required: true
    },
    gender: {
        name: 'gender',
        type: 'select',
        required: true,
        options: ['Male', 'Female']
    },
    address: {
        name: 'email',
        type: 'text',
        required: true
    },
    contractor: {
        name: 'contractor',
        type: 'checkbox',
        required: false
    }
}

export default fields;
