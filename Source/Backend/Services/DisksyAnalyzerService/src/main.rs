use std::{io::{self, Error}, env, path::PathBuf};

pub mod disk_info;
pub mod walker;
use actix_cors::Cors;
use actix_web_lab::web::spa;
use actix_files as fs;

mod structs {
    pub mod disk;
    pub mod file;
}

use actix_web::{get, web, App, HttpServer, Responder};

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}


async fn single_page_app() -> fs::NamedFile {
    // 1.
    let path: PathBuf = PathBuf::from("../../../ClientApp/dist/index.html");
    fs::NamedFile::open(path).unwrap()
}


#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("{:?}", env::current_dir().unwrap());
    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
            .route("/hello", web::get().to(|| async { "Hello World!" }))
            .route("/", web::get().to(single_page_app))
            .service(fs::Files::new("/", "../../../ClientApp/dist/").index_file("index.html"))
    })
    .bind(("0.0.0.0", 9876))?
    .run()
    .await
}