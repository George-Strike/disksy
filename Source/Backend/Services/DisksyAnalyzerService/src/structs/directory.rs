use serde::Serialize;

use super::file::FileInfo;

#[derive(Debug, Serialize)]
pub struct Directory {
    pub directory_info: Vec<DirectoryInfo>
}

#[derive(Debug, Serialize)]
pub struct DirectoryInfo {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub files: Vec<FileInfo>
}