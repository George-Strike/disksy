use std::{path::Path, env, fs::Metadata, io::Error};

use jwalk::{WalkDir, Parallelism};

use crate::structs::file::{FileInfo, FileSizeConversion};

pub fn walk_dir() -> Result<(), Error> {
    std::env::set_current_dir(Path::new("C:\\")).unwrap();
    print!("current: {:?}", std::env::current_dir().unwrap());

    for entry in WalkDir::new(env::current_dir()?).follow_links(false).sort(true).parallelism(Parallelism::RayonNewPool(1000)).into_iter().filter_map(|e| e.ok()) {
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
            name: entry.path().display().to_string(),
            size
        };
        if file_info.as_mb() >= 0.1 {
            println!("path: {}, size {:.3}mb", file_info.name, file_info.as_mb());
        } 
        else {
            println!("path: {}, size {:.3}kb", file_info.name, file_info.as_kb());
        }
    }
    Ok(())
}