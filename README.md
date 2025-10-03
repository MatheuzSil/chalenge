# Swift Funcionários - Dashboard Gamificado

## 🚀 Deploy no Vercel

### Configuração Atual
- **Página Inicial**: `/siwft/login.html`
- **Estrutura**: Pasta `siwft/` contém toda a aplicação
- **Roteamento**: Configurado via `vercel.json`

### URLs Principais
- `/` → Redireciona para login
- `/login` → Tela de login
- `/cadastro` → Tela de cadastro  
- `/dashboard` → Dashboard principal

### Problemas Comuns e Soluções

#### 1. **Imagem "not exist" do Imgur**
**Causa**: Vercel pode ter problemas com redirecionamentos
**Solução**: 
- Verificar se `vercel.json` está configurado corretamente
- Confirmar que a pasta `siwft/` está sendo deployada

#### 2. **Recursos não carregando**
**Causa**: Caminhos relativos incorretos
**Solução**: 
- Todos os arquivos estão na pasta `siwft/`
- CSS, JS e imagens usam caminhos relativos

#### 3. **Botão "Desbloquear Agora" não funciona**
**Causa**: JavaScript pode não estar carregando
**Solução**: 
- Função `unlockFeaturedReward` tem fallback para alerts
- Console do navegador mostra logs de debug

### Estrutura de Arquivos
```
chalenge/
├── siwft/
│   ├── login.html          # Tela de login
│   ├── cadastro.html       # Tela de cadastro
│   ├── index.html          # Dashboard principal
│   ├── style.css           # Estilos
│   ├── script.js           # JavaScript
│   ├── swift_logo.png      # Logo
│   └── images/             # Imagens das missões
├── vercel.json             # Configuração Vercel
├── index.html              # Redirecionamento raiz
└── README.md               # Este arquivo
```

### Funcionalidades Implementadas
- ✅ Sistema de login/cadastro (visual)
- ✅ Dashboard gamificado
- ✅ Missões com progresso
- ✅ Recompensas com raridades
- ✅ Rankings interativos
- ✅ Conquistas por categorias
- ✅ Sistema de modais customizado
- ✅ Design responsivo

### Debug
Para testar botões e funcionalidades, abra o console (F12) e use:
- `testFeaturedButton()` - Testa botão da recompensa
- `unlockFeaturedReward()` - Executa diretamente
- `testModals()` - Testa sistema de modais