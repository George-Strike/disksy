use std::{env};

use walkdir::WalkDir;

pub trait SizeConversion {
    fn as_kb(&self) -> f64;
    fn as_mb(&self) -> f64;
}
struct FileInfo {
    file_name: String,
    size: FileSize,
}
struct FileSize {
    size: u64,
}
impl SizeConversion for FileSize { 
    fn as_kb(&self) -> f64 {
        self.size as f64 / 1024f64
    }
    fn as_mb(&self) -> f64 {
        (self.size as f64 / 1024f64) / 1024f64
    }
}

fn main() {
    for entry in WalkDir::new(env::current_dir().unwrap()).follow_links(true) {

        //let ent: &Path = entry.unwrap().path();
        
        let file_info: FileInfo = FileInfo {
            file_name: entry.as_ref().unwrap().path().display().to_string(),
            size: FileSize {
                size: entry.unwrap().path().metadata().unwrap().len()
            }
        };
        if file_info.size.as_mb() >= 0.1 {
            println!("path: {}, size {:.3}mb", file_info.file_name, file_info.size.as_mb());
        } 
        else {
            println!("path: {}, size {:.3}kb", file_info.file_name, file_info.size.as_kb());
        }
    }
}
