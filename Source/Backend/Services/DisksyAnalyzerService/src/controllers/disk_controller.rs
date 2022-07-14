use actix_web::{get, Responder, HttpResponse};

use crate::disk_info::get_all_disk_info;

#[get("/get-disk-data")]
pub async fn get_disk_data() -> impl Responder {
    //HttpResponse::Ok().body()
    let disk_info = get_all_disk_info();
    HttpResponse::Ok().body(serde_json::to_string(&disk_info).unwrap())
}
