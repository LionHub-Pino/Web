export default {
  async fetch(request, env) {
    // DANH SÁCH 20 KEY HỆ THỐNG (Bạn có thể thêm hoặc bớt tại đây)
    const ALLOWED_KEYS = [
      "36363636-7e81-4b31-9f2d-8a5c1234abcd",
      "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "f8e9d0c1-b2a3-4b5c-6d7e-8f9a0b1c2d3e",
      "742093f0-46c6-416e-9507-e941873922c5",
      "de308854-be3b-40b5-9005-4c04e9e98341",
      "6cf87e2b-2a74-4f51-b8d1-7c9e0a3b2147",
      "92837465-a1b2-4c3d-e4f5-g6h7i8j9k0l1",
      "bcde1234-5678-4901-abcd-ef1234567890",
      "09876543-2109-4876-5432-109876543210",
      "550e8400-e29b-41d4-a716-446655440000",
      "123e4567-e89b-12d3-a456-426614174000",
      "88888888-4444-4444-4444-121212121212",
      "66663333-3636-4444-8888-000036363636",
      "a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d",
      "d1d2d3d4-c1c2-4b3b-a4a5-e6e7e8e9f0f0",
      "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      "9f8e7d6c-5b4a-3210-fedc-ba9876543210",
      "77777777-8888-9999-0000-aaaaaaaaaaaa",
      "4c4c4c4c-3636-2222-1111-555555555555",
      "00000000-1111-2222-3333-444444444444"
    ];

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-user-key",
    };

    // Xử lý Preflight request cho CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Endpoint chính để xử lý Bypass
    if (url.pathname === "/api/bypass") {
      const userKey = request.headers.get("x-user-key");
      const targetUrl = url.searchParams.get("url");

      // 1. Kiểm tra tính hợp lệ của Key
      if (!userKey || !ALLOWED_KEYS.includes(userKey)) {
        return new Response(JSON.stringify({ 
          error: "Key không hợp lệ hoặc đã hết hạn!" 
        }), { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      // 2. Kiểm tra có URL mục tiêu hay không
      if (!targetUrl) {
        return new Response(JSON.stringify({ 
          error: "Thiếu tham số URL mục tiêu!" 
        }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      try {
        // 3. Gọi API gốc để thực hiện Bypass
        const apiResponse = await fetch(`https://api.izen.lol/v1/bypass?url=${encodeURIComponent(targetUrl)}`, {
          method: 'GET',
          headers: { 
            'x-api-key': 'e9418739-2747-416e-9507-542093f046c6' // API Key của dịch vụ bypass
          }
        });

        const data = await apiResponse.json();
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: "Lỗi kết nối đến máy chủ Bypass!" 
        }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    // Trang mặc định khi truy cập vào root URL
    return new Response("CATTE BYPASS API SYSTEM IS ACTIVE", { 
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }
};
