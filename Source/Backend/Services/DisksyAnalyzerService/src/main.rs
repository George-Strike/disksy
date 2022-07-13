use std::{env, path::Path, io::{self, Error}, fs::Metadata};

use sysinfo::{System, SystemExt, DiskExt};
use walkdir::WalkDir;

use crate::structs::{file::{FileInfo, FileSize, FileSizeConversion}, disk::{DiskInfo, DiskSizeInfo}};

mod structs {
    pub mod disk;
    pub mod file;
}

fn main() -> io::Result<()>{

    let mut sys = System::new_all();

    // First we update all information of our `System` struct.
    sys.refresh_all();
    
    println!("=> disks:");
    for disk in sys.disks() {
        let disk_info: DiskInfo = DiskInfo { 
            name: disk.name().to_owned().into_string().unwrap(), 
            file_system: std::str::from_utf8(disk.file_system()).unwrap().to_string(), 
            disk_type: disk.type_(), 
            label: disk.mount_point().to_str().unwrap().to_string(), 
            disk_size_info: DiskSizeInfo {
                available_space_bytes: disk.available_space(),
                total_space_bytes: disk.total_space(),
            } 
        };
        println!("{:?}", disk_info);
    }
    std::env::set_current_dir(Path::new("C:\\")).unwrap();
    print!("current: {:?}", std::env::current_dir().unwrap());

    for entry in WalkDir::new(env::current_dir()?).into_iter().filter_map(|e| e.ok()) {
        let metadata: Result<Metadata, String> = match entry.path().metadata() {
            Ok(metadata) => {Ok(metadata)},
            Err(e) => {
                println!("err: {:?}", e);
                Err("".to_string())
            }
        };
        let mut size = 0;
        match metadata {
            Ok(metadata) => {
                size = metadata.len()
            }
            Err(e) => println!("err: {:?}", e)
        }
        let file_info: FileInfo = FileInfo {
            file_name: entry.path().display().to_string(),
            size: FileSize {
                size
            }
        };
        if file_info.size.as_mb() >= 0.1 {
            println!("path: {}, size {:.3}mb", file_info.file_name, file_info.size.as_mb());
        } 
        else {
            println!("path: {}, size {:.3}kb", file_info.file_name, file_info.size.as_kb());
        }
    }
    Ok(())
}
