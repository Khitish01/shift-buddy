import createAxios from "./createAxios";


export const adminClient = createAxios(
    process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || "http://localhost:4000"
);


export const carerClient = createAxios(
    process.env.NEXT_PUBLIC_CARER_API_BASE_URL || "http://localhost:4001"
);


// export const fileClient = createAxios(
//     process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:6000"
// );
