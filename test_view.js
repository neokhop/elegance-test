import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 100, // จำนวนผู้ใช้งานพร้อมกัน
  duration: "30s", // ระยะเวลาทดสอบ
};

export default function testView() {
  let res = http.get("http://localhost:3000/api/price");
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(1); // พัก 1 วินาที
}
