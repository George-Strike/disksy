use serde::Serialize;


pub trait FileSizeConversion {
    fn as_kb(&self) -> f64;
    fn as_mb(&self) -> f64;
}

#[derive(Debug, Serialize)]
pub struct FileInfo {
    pub name: String,
    pub size: u64,
}

impl FileSizeConversion for FileInfo { 
    fn as_kb(&self) -> f64 {
        self.size as f64 / 1024f64
    }
    fn as_mb(&self) -> f64 {
        (self.size as f64 / 1024f64) / 1024f64
    }
}