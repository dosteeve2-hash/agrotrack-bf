@echo off
cd /d "C:\Users\pc\Documents\GitHub\agrotrack-bf"
echo ========== npm run build ==========
call npm run build > build_output.txt 2>&1
if %ERRORLEVEL% neq 0 (
  echo *** BUILD FAILED *** - details in build_output.txt:
  type build_output.txt
  pause
  exit /b 1
)
echo Build OK.
echo ========== git branch + commit ==========
git checkout -b feat/sprint14-membres-parametres 2>nul
if %ERRORLEVEL% neq 0 git checkout feat/sprint14-membres-parametres
git add -A
git commit -m "feat: membres cooperative + parametres sprint14" -m "- Page /membres : stats, liste avatars, filtres, modal ajout" -m "- Page /parametres : onglets Profil/Cooperative/Alertes, animation spring, toast" -m "- Sidebar : lien Parametres" -m "" -m "Co-authored-by: Claude <claude@anthropic.com>"
git push -u origin feat/sprint14-membres-parametres
echo ========== gh pr create ==========
gh pr create --title "feat: membres cooperative + parametres (Sprint 14)" --body "## Sprint 14 — 2 nouvelles pages\n\n### /membres\n- Stats actifs / villages / surface / production\n- Liste avec avatars colores initiales, recherche, filtres village+culture+statut\n- Modal ajout membre\n\n### /parametres\n- Onglets Profil / Cooperative / Alertes (Framer Motion spring)\n- Toggle alertes animé, checkboxes cultures\n- Toast sauvegarde\n\nCo-authored-by: Claude <claude@anthropic.com>" --base main
echo ========== DONE ==========
pause
