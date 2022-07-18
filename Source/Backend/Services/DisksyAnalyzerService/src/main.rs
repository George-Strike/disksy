use std::{io::{self, Error}, env, path::PathBuf};

pub mod disk_info;
pub mod walker;
pub mod controllers;
use actix_cors::Cors;
use actix_web_lab::web::spa;
use actix_files as fs;

mod structs {
    pub mod disk;
    pub mod file;
    pub mod directory;
}

use actix_web::{get, web, App, HttpServer, Responder, middleware::Logger};

use crate::controllers::{disk_controller::get_disk_data, directory_controller::{directory, delete_item, rename_item}};

async fn greet() -> String {
    format!("Hello !")
}


async fn single_page_app() -> fs::NamedFile {
    // 1.
    let path: PathBuf = PathBuf::from("../../../ClientApp/dist/index.html");
    fs::NamedFile::open_async(path).await.unwrap()
}


#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("{:?}", env::current_dir().unwrap());
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("debug"));
    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
            .wrap(Logger::new("%a %{User-Agent}i"))
            .wrap(cors)
            .service(get_disk_data)
            .service(directory)
            .service(delete_item)
            .service(rename_item)
            .route("/hello", web::get().to( greet ))
            /*.route("/", web::get().to(single_page_app))
            .service(fs::Files::new("/", "../../../ClientApp/dist/").index_file("index.html"))*/

    })
    .bind(("0.0.0.0", 9876))?
    .run()
    .await
}