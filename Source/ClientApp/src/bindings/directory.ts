import { FileInfo } from "./file";

export interface DirectoryInfo {
    name: string;
    path: string;
    size: string;
    files?: FileInfo[];
}