# QuestNotes Deployment

## Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://projua4vvx1766634968225.vercel.app |
| **GitHub Repository** | https://github.com/Vishal2602/questnotes-gba |

## Infrastructure

### Hosting: Vercel
- **Project**: proj_ua4vvx_1766634968225
- **Framework**: Vite (auto-detected)
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

### CI/CD Pipeline
- GitHub integration enabled
- Auto-deploys on push to `main` branch
- Preview deployments for pull requests

## Deployment Process

### Automatic Deployment
Push to `main` triggers automatic deployment:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Deployment
```bash
npx vercel --prod
```

### Preview Deployment
```bash
npx vercel
```

## Environment Variables

No environment variables required for base deployment.

If adding features later, configure in Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add variables for Production/Preview/Development

## Monitoring

- **Build Logs**: https://vercel.com/vishal2602s-projects/proj_ua4vvx_1766634968225
- **Deployment History**: Available in Vercel dashboard
- **Analytics**: Enable in Vercel dashboard (optional)

## Rollback Procedure

1. Go to Vercel Dashboard
2. Select the project
3. Navigate to Deployments
4. Find the previous working deployment
5. Click the three dots menu
6. Select "Promote to Production"

## Security Notes

- HTTPS enforced by default
- No sensitive data stored (localStorage only)
- No backend services exposed
- Static assets served via Vercel CDN

---

*Last deployed: December 25, 2025*
