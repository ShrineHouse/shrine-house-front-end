import { queryClient } from "..";

export function useGetFetchQuery (name:string) {
    return queryClient.getQueryData(name);
};