use sysinfo::{System, SystemExt, DiskExt};


use crate::structs::disk::{DiskInfo, DiskSizeInfo, DiskSizeConversion};

pub fn get_all_disk_info() -> Vec<DiskInfo> {
    let mut disk_info_vec: Vec<DiskInfo> = Vec::new();
    let mut sys = System::new_all();

    // First we update all information of our `System` struct.
    sys.refresh_all();
    
    println!("=> disks:");
    for disk in sys.disks() {
        let mut disk_info: DiskInfo = DiskInfo { 
            name: disk.name().to_owned().into_string().unwrap(), 
            file_system: std::str::from_utf8(disk.file_system()).unwrap().to_string(), 
            disk_type: disk.type_(), 
            label: disk.mount_point().to_str().unwrap().to_string(), 
            disk_size_info: DiskSizeInfo {
                available_space_bytes: disk.available_space(),
                total_space_bytes: disk.total_space(),
                available_space_gb: disk.available_space(),
                total_space_gb: disk.total_space()
            } 
        };
        disk_info.disk_size_info.available_space_gb = disk_info.disk_size_info.available_space_bytes_as_gb() as u64;
        disk_info.disk_size_info.total_space_gb = disk_info.disk_size_info.total_space_bytes_as_gb() as u64;

        println!("{:?}", disk_info);
        disk_info_vec.push(disk_info);
    }

    return disk_info_vec;
}