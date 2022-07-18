use serde::Serialize;


pub trait FileSizeConversion {
    fn size_as_kb(&self) -> f64;
    fn size_as_mb(&self) -> f64;
}

#[derive(Clone, Debug, Serialize)]
pub struct FileInfo {
    pub name: String,
    pub size: u64,
}

impl FileSizeConversion for FileInfo { 
    fn size_as_kb(&self) -> f64 {
        self.size as f64 / 1024f64
    }
    fn size_as_mb(&self) -> f64 {
        (self.size as f64 / 1024f64) / 1024f64
    }
}