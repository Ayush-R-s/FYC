$response = curl.exe -s -X POST -H "Content-Type: application/json" -d '{\"email\":\"admin@jestJest.com\",\"password\":\"123\"}' http://localhost:8080/api/auth/admin-login
$json = $response | ConvertFrom-Json
Write-Host "TOKEN: $($json.token)"
curl.exe -s -v -H "Authorization: Bearer $($json.token)" http://localhost:8080/api/admin/stats/overall
