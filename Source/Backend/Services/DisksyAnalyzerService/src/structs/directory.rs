use serde::Serialize;

use super::file::FileInfo;

#[derive(Debug, Serialize)]
pub struct DirectoryInfo {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub files: Option<Vec<FileInfo>>
}