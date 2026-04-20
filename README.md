# DatVillage — Mundo Online Jogável

Um vilarejo 3D interativo feito com React, Three.js e física Rapier. Explore em primeira pessoa com controles estilo FPS.

## Como rodar

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (versão 18+)
2. No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

3. Abra o navegador no endereço mostrado (geralmente `http://localhost:5173`)
4. Clique na tela para travar o mouse e comece a explorar!

## Controles

| Tecla | Ação |
|-------|------|
| W/A/S/D | Mover |
| Mouse | Olhar ao redor (após clicar) |
| Shift | Correr |
| Space | Pular |
| Esc | Liberar o mouse |

## Como adicionar mais casas e árvores

Edite o arquivo `src/components/Village.tsx`. Para adicionar uma nova casa:

```tsx
<House position={[X, 0, Z]} roofColor="#COR_TELHADO" wallColor="#COR_PAREDE" scale={1} />
```

- `position`: coordenadas `[X, Y, Z]` — X é esquerda/direita, Z é frente/trás
- `roofColor`: cor do telhado (hex)
- `wallColor`: cor das paredes (hex)
- `scale`: tamanho (1 = normal, 1.5 = 50% maior)

Para adicionar uma árvore:

```tsx
<Tree position={[X, 0, Z]} scale={1} crownColor="#228B22" />
```

## Como fazer deploy no Vercel (passo a passo para leigos)

### 1. Crie uma conta no Vercel
- Acesse [vercel.com](https://vercel.com) e clique em **Sign Up**
- Faça login com sua conta do GitHub

### 2. Suba o código para o GitHub
Se ainda não fez:

```bash
git init
git add .
git commit -m "Versão inicial do DatVillage"
```

Depois crie um repositório no GitHub e faça o push:

```bash
git remote add origin https://github.com/SEU_USUARIO/datvillage.git
git branch -M main
git push -u origin main
```

### 3. Importe no Vercel
- No painel do Vercel, clique em **Add New → Project**
- Selecione o repositório `datvillage` do GitHub
- O Vercel detecta automaticamente que é um projeto Vite
- Clique em **Deploy**

### 4. Pronto!
O Vercel vai gerar uma URL pública (ex: `datvillage.vercel.app`) onde qualquer pessoa pode acessar e explorar o vilarejo.

**Dica**: cada vez que você fizer `git push`, o Vercel atualiza automaticamente.

## Tecnologias

- [Vite](https://vite.dev/) + React + TypeScript
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei) — helpers (Sky, etc.)
- [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) — física e colisão
