# DuckOK (DuckOK)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)


DuckOK es un compresor de imágenes por lotes gratuito y de código abierto que
se ejecuta completamente en el navegador. Las imágenes se procesan localmente con
Web Workers, WebAssembly, Canvas y los códecs del navegador. Los archivos nunca se
suben a un servidor de aplicaciones.

Use la aplicación alojada en [duckok.com](https://duckok.com/) o
[www.duckok.com](https://www.duckok.com/).

## Características

- Comprimir imágenes JPEG, PNG, WebP, GIF, SVG y AVIF por lotes.
- Decodificar archivos HEIC y HEIF localmente y exportarlos como JPEG, PNG, WebP o AVIF.
- Convertir formatos, redimensionar, recortar y controlar opciones de calidad por codificador.
- Agregar archivos mediante selector, selector de carpetas, arrastrar y soltar o portapapeles.
- Comparar imágenes originales y comprimidas con una vista dividida interactiva.
- Descargar resultados individuales o guardar el lote completo como archivo ZIP.
- Mantenga su privacidad: el procesamiento permanece en su dispositivo.

## Captura de pantalla

![Espacio de trabajo de DuckOK](../demo1.png)

El espacio de trabajo principal integra la entrada por lotes, los resultados de
compresión, los ajustes de salida y las acciones de descarga en una sola vista.

## Desarrollo

Requisitos:

- Node.js 22 LTS o superior
- npm 10 o superior

```bash
git clone YOUR_DUCKOK_REPOSITORY_URL
cd duckok
npm ci
npm run dev
```

Comandos útiles:

```bash
npm test            # Ejecutar la suite de pruebas
npm run lint        # Ejecutar ESLint
npm run build       # Construir el servidor Node.js independiente
npm run build:pages # Exportar el sitio estático de Cloudflare Pages a out/
```

## Despliegue

### Cloudflare Pages

El sitio público utiliza Cloudflare Pages con la integración del repositorio de GitHub.
Cloudflare construye y despliega el sitio automáticamente con estos ajustes:

| Ajuste | Valor |
| --- | --- |
| Rama de producción | `master` |
| Rama de vista previa | `develop` |
| Comando de compilación | `npm run build:pages` |
| Directorio de salida | `out` |
| Versión de Node.js | `22` |

Los envíos a `master` actualizan producción. Los envíos a `develop` crean
despliegues de vista previa. Otras ramas no se despliegan automáticamente.

La compilación de Pages elimina el `404.html` de nivel superior generado por Next.js,
permitiendo que Cloudflare Pages aplique su respaldo nativo de aplicación de página única.

### Docker

La imagen Docker es una alternativa para despliegues privados o autogestionados.
Utiliza la salida independiente de Next.js, se ejecuta como el usuario no privilegiado
`node`, gestiona las señales a través de `tini` e incluye una verificación de estado.

```bash
docker build --pull -t duckok:latest .

docker run -d \
  --name duckok \
  --restart unless-stopped \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -p 127.0.0.1:3000:3000 \
  duckok:latest
```

Abra `http://127.0.0.1:3000`. Para acceso público, coloque el contenedor detrás de
un proxy inverso con terminación TLS como Caddy, nginx o Traefik.
Elimine el prefijo `127.0.0.1:` solo si la exposición directa a la red es intencional.

### Secretos y configuración

La aplicación web no requiere claves API. Nunca incluya credenciales,
tokens de Cloudflare, archivos `.env`, `.dev.vars`, claves privadas o estado
local de Wrangler en los commits. Las reglas de ignorar del repositorio excluyen
estos archivos. Si una función futura necesita secretos, almacénelos en el gestor
de secretos de la plataforma de despliegue y proporcione solo nombres de marcador
de posición documentados en un archivo `.env.example`.

## Estructura del proyecto

- `src/app/`: puntos de entrada de la aplicación Next.js.
- `src/components/`: componentes de interfaz reutilizables.
- `src/engines/`: códecs de navegador, workers, transformaciones y cola de compresión.
- `src/locales/`: traducciones.
- `src/views/`: vistas de la aplicación.
- `public/`: códecs de navegador y recursos WebAssembly preparados durante la compilación.
- `scripts/`: preparación de códecs y scripts auxiliares de despliegue.
- `tests/`: suite de pruebas Node.js.

## Contribuir

1. Cree una rama desde `develop`.
2. Ejecute `npm test`, `npm run lint` y la compilación de producción correspondiente.
3. Actualice la documentación y las capturas de pantalla si cambia el comportamiento.
4. Abra una Pull Request enfocada con una descripción clara y notas de verificación.

## Licencia

DuckOK está disponible bajo la [Licencia MIT](./LICENSE).

## Agradecimientos

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) para los códecs AVIF, ImageQuant y OxiPNG.
- [heic-to](https://github.com/hoppergee/heic-to) para la decodificación HEIC/HEIF en el navegador.
- [SVGO](https://github.com/svg/svgo) para la optimización SVG.
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) para la compresión GIF.
