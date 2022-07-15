export enum DiskType {
    /// HDD type.
    HDD,
    /// SSD type.
    SSD,
    /// Unknown type.
    Unknown
}

export interface DiskInfo {
     name: String,
     file_system: String,
     disk_type: DiskType,
     label: String,
     disk_size_info: DiskSizeInfo
}

export interface DiskSizeInfo {
     available_space_bytes: number,
     total_space_bytes: number,
     available_space_gb: number,
     total_space_gb: number
}