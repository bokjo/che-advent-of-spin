use anyhow::Result;
use spin_sdk::{
    http::{Request, Response},
    http_component,
};

#[derive(serde::Serialize)]
struct LowercaseRequest {
    value: String,
}

#[derive(serde::Deserialize)]
struct LowercaseResponse {
    message: String,
}

#[derive(serde::Serialize)]
struct HelloResponse {
    message: String,
}

/// A simple Spin HTTP component.
#[http_component]
fn aos_c2_rust_hello(req: Request) -> Result<Response> {
    println!("headers {:?}", req.headers());
    // let domain = req.uri().host().unwrap();
    // println!("domain {:?}", domain);

    let default_value: &str = "world";

    let name: &str = req
        .headers()
        .get("spin-path-info")
        .unwrap()
        .to_str()
        .unwrap();

    let mut hello_response = HelloResponse {
        message: format!("Hello, {}!", default_value),
    };

    println!("name {:?}", name);

    if name != "" {
        let lowercase_request = LowercaseRequest {
            value: name.strip_prefix("/").unwrap().to_string(),
        };
        println!("lowercase_request {:?}", lowercase_request.value);

        let mut res = spin_sdk::outbound_http::send_request(
            http::Request::builder()
                .method("POST")
                .uri("https://127.0.0.1:3000/lowercase")
                .body(Some(
                    serde_json::to_string(&lowercase_request).unwrap().into(),
                ))?,
        )?;

        let lowercase_response: LowercaseResponse =
            serde_json::from_slice(res.body().clone().unwrap().to_vec().as_slice()).unwrap();

        println!("lowercase_response {:?}", lowercase_response.message);

        hello_response.message = format!("Hello, {}!", lowercase_response.message);
    }

    let json_response = serde_json::to_string(&hello_response)?;

    Ok(http::Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(Some(json_response.into()))?)
}
