use actix_web::{get, Responder, HttpResponse, web};

use crate::structs::directory::DirectoryInfo;


#[get("/directory/{directory_path}")]
pub async fn directory(directory_path: web::Path<String>) -> impl Responder {
    let directory: DirectoryInfo = DirectoryInfo {
        name: directory_path.to_string(),
        path: directory_path.to_string(),
        files: None,
        size: 0
    };
    HttpResponse::Ok().body(serde_json::to_string(&directory).unwrap())

    //format!("{}/{}", "path", directory_path)
}