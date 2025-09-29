use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use ethers::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::env;
use dotenv::dotenv;

abigen!(PointsToken, "../packages/contracts-abi/PointsToken.json");

#[derive(Clone)]
struct AppState {
    contract: PointsToken<SignerMiddleware<Provider<Http>, LocalWallet>>,
}

#[derive(Deserialize)]
struct MintReq {
    user: String,
    amount: u64,
}

#[derive(Serialize)]
struct MintResp {
    ok: bool,
    tx: String,
    new_balance: String,
}

#[post("/mint")]
async fn mint(data: web::Data<AppState>, body: web::Json<MintReq>) -> impl Responder {
    let user: Address = match body.user.parse() {
        Ok(a) => a,
        Err(e) => {
            return HttpResponse::BadRequest()
                .json(serde_json::json!({ "error": format!("Invalid address: {}", e) }))
        }
    };  
    let amount = U256::from(body.amount);

    let call = data.contract
        .mint_points(user, amount)
        .gas_price(U256::from(30_000_000_000u64)); // 30 Gwei

    let send_result = call.send().await;

    match send_result {
        Ok(pending) => match pending.await {
            Ok(receipt_opt) => match data.contract.balance_of(user).call().await {
                Ok(bal) => {
                    let txhash = receipt_opt
                        .map(|r| r.transaction_hash)
                        .unwrap_or_else(H256::zero);
                    let txhex = format!("{:#x}", txhash);
                    let resp = MintResp {
                        ok: true,
                        tx: txhex,
                        new_balance: bal.to_string(),
                    };
                    HttpResponse::Ok().json(resp)
                }
                Err(e) => HttpResponse::InternalServerError().json(
                    serde_json::json!({ "error": format!("Error reading balance: {}", e) }),
                ),
            },
            Err(e) => HttpResponse::InternalServerError()
                .json(serde_json::json!({ "error": format!("Tx failed: {}", e) })),
        },
        Err(e) => HttpResponse::InternalServerError()
            .json(serde_json::json!({ "error": format!("Send error: {}", e) })),
    }
}

#[get("/balance/{user}")]
async fn get_balance(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let user_str = path.into_inner();
    let user: Address = match user_str.parse() {
        Ok(a) => a,
        Err(e) => {
            return HttpResponse::BadRequest()
                .json(serde_json::json!({ "error": format!("Invalid address: {}", e) }))
        }
    };
    match data.contract.balance_of(user).call().await {
        Ok(bal) => HttpResponse::Ok().json(serde_json::json!({ "balance": bal.to_string() })),
        Err(e) => HttpResponse::InternalServerError()
            .json(serde_json::json!({ "error": format!("Error: {}", e) })),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let rpc = env::var("AMOY_RPC_URL").expect("AMOY_RPC_URL missing");
    let pk = env::var("DEPLOYER_PRIVATE_KEY").expect("DEPLOYER_PRIVATE_KEY missing");
    let contract_addr: Address = env::var("CONTRACT_ADDRESS")
        .expect("CONTRACT_ADDRESS missing")
        .parse()
        .expect("Invalid contract address");

    let provider = Provider::<Http>::try_from(rpc.as_str()).expect("provider");
    let wallet: LocalWallet = pk.parse().expect("private key parse");
    let wallet = wallet.with_chain_id(80002u64);

    let client = SignerMiddleware::new(provider, wallet);
    let client = Arc::new(client);

    let contract = PointsToken::new(contract_addr, client.clone());
    let state = AppState { contract };

    println!("✅ Backend running on http://localhost:3001");

    HttpServer::new(move || {
        // ⚠️ En desarrollo, permite todo
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(state.clone()))
            .service(mint)
            .service(get_balance)
    })
    .bind(("0.0.0.0", 3001))?
    .run()
    .await
}
