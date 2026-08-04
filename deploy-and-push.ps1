# ============================================================
# deploy-and-push.ps1 - 一键部署到 GitHub Pages
# 自动：生成 deploy 文件夹 → 初始化 git → 推送到 GitHub
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RollingQuate 一键部署到 GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 第 1 步：生成 deploy 文件夹
Write-Host "第 1 步：生成部署文件夹..." -ForegroundColor Green
node "$PSScriptRoot\deploy.js"
Write-Host ""

# 第 2 步：进入 deploy 文件夹
$deployDir = Join-Path $PSScriptRoot "deploy"
Set-Location $deployDir

# 第 3 步：初始化 git（如果还没有）
if (-not (Test-Path ".git")) {
    Write-Host "第 2 步：初始化 git 仓库..." -ForegroundColor Green
    git init
    git config user.email "cshusbs@gmail.com"
    git config user.name "FALLEN"
} else {
    Write-Host "第 2 步：git 仓库已存在" -ForegroundColor Green
}

# 第 4 步：添加所有文件并提交
Write-Host "第 3 步：提交文件..." -ForegroundColor Green
git add -A
git commit -m "部署到 GitHub Pages $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 第 5 步：设置远程仓库
Write-Host "第 4 步：设置远程仓库..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin https://github.com/fallen0757/rollingquate.git
git branch -M main

# 第 6 步：推送到 GitHub
Write-Host "第 5 步：推送到 GitHub..." -ForegroundColor Green
Write-Host "（首次推送需要输入 GitHub 用户名和密码/Token）" -ForegroundColor Yellow
git push -u origin main --force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "访问地址：https://fallen0757.github.io/rollingquate/" -ForegroundColor White
Write-Host ""
Write-Host "如果推送失败，请检查：" -ForegroundColor Yellow
Write-Host "1. GitHub 仓库 fallen0757/rollingquate 是否存在" -ForegroundColor White
Write-Host "2. 用户名和密码/Token 是否正确" -ForegroundColor White
Write-Host "3. 网络是否正常" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
