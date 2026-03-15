import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TithiEvent {
    tithi: string;
    lunarMonth: string;
    name: string;
    description: string;
}
export interface Festival {
    id: bigint;
    day: bigint;
    month: bigint;
    nameOdia: string;
    description: string;
    nameEnglish: string;
}
export interface backendInterface {
    addFestival(nameOdia: string, nameEnglish: string, description: string, month: bigint, day: bigint): Promise<bigint>;
    addTithiEvent(name: string, description: string, lunarMonth: string, tithi: string): Promise<bigint>;
    deleteFestival(id: bigint): Promise<void>;
    getAllFestivals(): Promise<Array<Festival>>;
    getAllTithiEvents(): Promise<Array<TithiEvent>>;
    getFestivalsByDateRange(startMonth: bigint, startDay: bigint, endMonth: bigint, endDay: bigint): Promise<Array<Festival>>;
    getFestivalsByMonth(month: bigint): Promise<Array<Festival>>;
    updateFestival(id: bigint, nameOdia: string, nameEnglish: string, description: string, month: bigint, day: bigint): Promise<void>;
}
