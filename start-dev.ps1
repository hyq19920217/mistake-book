# 启动后端服务
Start-Process powershell -ArgumentList "-NoExit", "cd backend; npm run dev"

# 启动前端服务
Start-Process powershell -ArgumentList "-NoExit", "cd frontend; npm run dev" 