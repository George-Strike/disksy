use std::fs;

use actix_web::{get, Responder, HttpResponse, web, post};
use serde::Deserialize;

use crate::walker::walk_dir;

#[derive(Deserialize)]
struct DeleteRequest {
    path: String
}

#[derive(Deserialize)]
struct RenameRequest {
    from_path: String,
    to_path: String
}

#[get("/directory/{directory_path}")]
pub async fn directory(directory_path: web::Path<String>) -> impl Responder {
    match walk_dir(directory_path.to_string()) {
        Ok(dir) => {
            return HttpResponse::Ok().body(serde_json::to_string(&dir).unwrap())
        },
        Err(err) => {return HttpResponse::Ok().body(format!("Error happened: {:?}", err))}
    };
}


#[post("/directory/delete")]
pub async fn delete_item(req_body: String) -> impl Responder {
    let delete_request: DeleteRequest = serde_json::from_str(&req_body).unwrap();
    println!("path: {}", delete_request.path);
    match fs::remove_file(delete_request.path) {
        Ok(()) => HttpResponse::Ok(),
        Err(err) => HttpResponse::BadRequest()
    }
}

#[post("/directory/rename")]
pub async fn rename_item(req_body: String) -> impl Responder {
    let rename_request: RenameRequest = serde_json::from_str(&req_body).unwrap();
    println!("from path: {}, to path: {}", rename_request.from_path, rename_request.to_path);
    match fs::rename(rename_request.from_path, rename_request.to_path) {
        Ok(()) => HttpResponse::Ok(),
        Err(err) => HttpResponse::BadRequest()
    }
}