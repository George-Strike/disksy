use std::{path::Path, env, fs::Metadata, io::Error};
use urlencoding::decode;
use jwalk::{WalkDir, Parallelism};

use crate::structs::{file::{FileInfo, FileSizeConversion}, directory::DirectoryInfo};

pub fn walk_dir(directory_path: String) -> Result<Vec<DirectoryInfo>, Error> {
    println!("test: {}", decode(directory_path.as_str()).unwrap().into_owned());
    std::env::set_current_dir(Path::new(format!("{}", decode(directory_path.as_str()).unwrap().into_owned()).as_str())).unwrap();
    let mut directory_info_vec: Vec<DirectoryInfo> = Vec::new();
    for entry in WalkDir::new(env::current_dir()?).follow_links(false).sort(true).parallelism(Parallelism::RayonNewPool(20)).into_iter().filter_map(|e| e.ok()) {

        let metadata: Result<Metadata, String> = match entry.path().metadata() {
            Ok(metadata) => {Ok(metadata)},
            Err(e) => {
                println!("err: {:?}", e);
                Err("".to_string())
            }
        };

        match metadata {
            Ok(metadata) => {
                let v: Vec<FileInfo> = Vec::new();
                if metadata.is_dir() {
                    let dir = DirectoryInfo {
                        name: entry.path().display().to_string(),
                        path: entry.path().as_path().to_str().unwrap().to_string(),
                        size: metadata.len(),
                        files: v,
                    };
                    directory_info_vec.push(dir);
                }
                else if metadata.is_file() {
                    let mut file_info: FileInfo = FileInfo {
                        name: entry.path().display().to_string(),
                        size: metadata.len()
                    };
                    if file_info.size_as_mb() >= 0.1 {
                        file_info.size = file_info.size_as_mb() as u64;
                    } 
                    else {
                        file_info.size = file_info.size_as_kb() as u64;
                    }
                    for i in 0..directory_info_vec.len() {
                        if directory_info_vec[i].path ==  entry.path().parent().unwrap().to_str().unwrap().to_string()
                        {
                            directory_info_vec[i].files.push(file_info.clone());
                            break;
                        }
                    }
                }
 
            }
            Err(e) => println!("err: {:?}", e)
        }   
    }
    Ok(directory_info_vec)
}