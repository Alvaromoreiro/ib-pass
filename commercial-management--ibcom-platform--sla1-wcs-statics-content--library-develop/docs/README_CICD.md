# Flujo de CD para Despliegue en S3

## Descripción
Este repositorio contiene un flujo de trabajo reutilizable de Despliegue Continuo (CD) para desplegar aplicaciones en Amazon S3. El flujo de trabajo está diseñado para ser desencadenado manualmente mediante el evento `workflow_dispatch` de GitHub Actions, lo que permite despliegues flexibles y personalizables a varios entornos.

## Creación del Repositorio
Este repositorio se creó utilizando una acción de otro repositorio, lo que simplifica el proceso de configuración. La acción utilizada se puede encontrar aquí: [Utilidades para Crear Repositorio de Aplicaciones](https://github.com/Iberia-Ent/software-engineering--create-application-repository--utils/actions/runs/9479626026). Esta acción inicializa el repositorio con los [parámetros y configuraciones necesarios](https://transform.atlassian.net/wiki/spaces/CCP/pages/4148494373/ibcom-platform+Infrastructure).

## Uso
Para desencadenar el flujo de trabajo, navega a la pestaña Actions en tu repositorio de GitHub, selecciona el flujo de trabajo de CD y haz clic en "Run workflow". Proporciona las entradas requeridas como `environment`, `level-config-file` y opcionalmente `config-file-path`.

## Versión
1.0

## Código en GitHub
[software-engineering--workflow--node--cd-s3](https://github.com/Iberia-Ent/software-engineering--workflow--node--cd-s3)

## Plantilla de Git Flow
[software-engineering--git-flow--template](https://github.com/Iberia-Ent/software-engineering--git-flow--template)

## Entradas del Flujo de Trabajo
- **environment**: El entorno al que desplegar (por defecto: Integration)
- **level-config-file**: El nivel para leer en el archivo de configuración (por defecto: cd-int)
- **config-file-path**: La ruta al archivo de configuración (por defecto: .github/config/ci-config.json)

## Trabajos
### Trabajo de CD
Este trabajo realiza los siguientes pasos:

1. **Checkout del Código**: Utiliza la acción `actions/checkout@v4` para hacer checkout del código del repositorio.
2. **Verificar Variables Vacías**: Asegura que todas las variables requeridas estén establecidas utilizando `Iberia-Ent/software-engineering--check-empty-variables-action@v1`.
3. **Leer Archivo de Configuración**: Lee el archivo de configuración utilizando `Iberia-Ent/software-engineering--read-file-action@v1`.
4. **Configurar Credenciales de AWS para Recursos Comunes**: Configura las credenciales de AWS para recursos comunes utilizando `Iberia-Ent/software-engineering--reset-and-configure-aws-credentials--action@v1`.
5. **Configurar Credenciales de AWS para Despliegue en S3**: Configura las credenciales de AWS para el despliegue en S3 utilizando la misma acción.
6. **Reemplazar Variables en la Distribución**: Reemplaza las variables de entorno en el paquete de distribución utilizando `Iberia-Ent/software-engineering--replace-environments-variables-in-distribution-package--action@v1`.
7. **Subir Archivos de la Aplicación a S3**: Sube los archivos de la aplicación a S3 utilizando `Iberia-Ent/software-engineering--upload-to-s3-bucket--action@v1`.
8. **Configurar Credenciales de AWS para Invalidar la Caché de CloudFront**: Configura las credenciales de AWS para invalidar la caché de CloudFront (condicional).
9. **Invalidar Caché de CloudFront**: Invalida la caché de CloudFront para asegurar que se sirvan los archivos más recientes (condicional).
10. **Limpiar**: Limpia el directorio de trabajo utilizando `Iberia-Ent/software-engineering--clean-up-working-directory-action@v1`.
