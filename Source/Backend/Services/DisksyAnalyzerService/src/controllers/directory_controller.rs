use actix_web::{get, Responder, HttpResponse, web};

use crate::structs::{directory::DirectoryInfo, file::{FileInfo, FileSize}};


#[get("/directory/{directory_path}")]
pub async fn directory(directory_path: web::Path<String>) -> impl Responder {
    let mut files: Vec<FileInfo> = Vec::new();
    let file_info: FileInfo = FileInfo {
        name: "File1".to_string(),
        size: FileSize {
            size: 10
        }
    };
    files.push(file_info);
    
    let directory: DirectoryInfo = DirectoryInfo {
        name: directory_path.to_string(),
        path: directory_path.to_string(),
        files: Some(files),
        size: 0
    };
    HttpResponse::Ok().body(serde_json::to_string(&directory).unwrap())

    //format!("{}/{}", "path", directory_path)
}