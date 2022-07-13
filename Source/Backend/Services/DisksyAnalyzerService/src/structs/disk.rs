use sysinfo::DiskType;

pub trait DiskSizeConversion {
    fn available_space_bytes_as_mb(&self) -> f64;
    fn available_space_bytes_as_gb(&self) -> f64;
    fn available_space_bytes_as_tb(&self) -> f64;
    fn total_space_bytes_as_gb(&self) -> f64;
    fn total_space_bytes_as_tb(&self) -> f64;
    fn get_used_perfectage(&self) -> f64;
}

#[derive(Debug)]
pub struct DiskInfo {
    pub name: String,
    pub file_system: String,
    pub disk_type: DiskType,
    pub label: String,
    pub disk_size_info: DiskSizeInfo
}
#[derive(Debug)]
pub struct DiskSizeInfo {
    pub available_space_bytes: u64,
    pub total_space_bytes: u64,
}

impl DiskSizeConversion for DiskSizeInfo { 
    fn available_space_bytes_as_mb(&self) -> f64 {
        ((self.available_space_bytes as f64 / 1024f64) / 1024f64).round()
    }
    fn available_space_bytes_as_gb(&self) -> f64 {
        (self.available_space_bytes_as_mb() / 1024f64).round()
    }
    fn available_space_bytes_as_tb(&self) -> f64 {
        self.available_space_bytes_as_gb().round()
    }
    fn total_space_bytes_as_gb(&self) -> f64 {
        ((self.total_space_bytes as f64 / 1024f64) / 1024f64 / 1024f64).round()
    }
    fn total_space_bytes_as_tb(&self) -> f64 {
        (self.total_space_bytes_as_gb() / 1024f64).round()
    }

    fn get_used_perfectage(&self) -> f64 {
        todo!()
    }
}