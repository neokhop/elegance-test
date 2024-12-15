import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 100, // จำนวนผู้ใช้งานพร้อมกัน
  duration: "30s", // ระยะเวลาทดสอบ
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
  },
};

export default function testTransaction() {
  const payload = JSON.stringify({
    symbol: "99.99",
    state: "BUY",
    quantity: 1,
    amount: 2800,
    price: 42800,
    date: 1234567890,
    user_id: "1",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
    cookies: { user_id: "1" },
  };

  const res = http.post("http://localhost:3000/api/tx", payload, params);

  // Check response status and log results
  check(res, {
    "status is 200": (r) => r.status === 200,
    // "response time is below 500ms": (r) => r.timings.duration < 500,
  });

  console.log(`Response status: ${res.status}`);
  console.log(`Response body: ${res.body}`);

  // Wait 1 second before the next iteration
  sleep(1);
}
