use std::env;

use walkdir::WalkDir;

fn main() {
    for entry in WalkDir::new(env::current_dir().unwrap()).follow_links(true) {
        let ent = entry.unwrap();
        let size = ent.path().metadata().unwrap().len();
        let size_as_kb = size as f64 / 1024f64;
        let size_as_mb = (size as f64 / 1024f64) / 1024f64;
        if size_as_mb >= 0.1 {
            println!("path: {}, size {:.3}mb", ent.path().display(), size_as_mb);
        } 
        else {
            println!("path: {}, size {:.3}kb", ent.path().display(), size_as_kb);
        }
    }
}
