
pub trait FileSizeConversion {
    fn as_kb(&self) -> f64;
    fn as_mb(&self) -> f64;
}

pub struct FileInfo {
    pub file_name: String,
    pub size: FileSize,
}
pub struct FileSize {
    pub size: u64,
}

impl FileSizeConversion for FileSize { 
    fn as_kb(&self) -> f64 {
        self.size as f64 / 1024f64
    }
    fn as_mb(&self) -> f64 {
        (self.size as f64 / 1024f64) / 1024f64
    }
}