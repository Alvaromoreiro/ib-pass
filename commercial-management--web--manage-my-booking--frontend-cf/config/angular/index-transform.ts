import { TargetOptions } from '@angular-builders/custom-webpack';
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));

export default (targetOptions: TargetOptions, indexHtml: string) => {
    const head = '<head>';
    const indexOfHead = indexHtml.indexOf(head) + head.length;

    const metaVersions = [
        { name: 'version', content: packageJson.version },
        { name: 'cmns', content: packageJson.dependencies['ib-web-commons'] },
        { name: 'payments', content: packageJson.dependencies['ib-web-payments'] },
        { name: 'menus', content: packageJson.dependencies['ib-menus'] },
        { name: 'anc', content: packageJson.dependencies['ib-web-ancillaries'] },
        { name: 'digitalComponentsLibrary', content: packageJson.dependencies['commercial-management--digital--web-components-design--library'] }
    ];

    const generateMetaTags = (metaVersions: { name: string, content: string }[]) => {
        return metaVersions.map(meta => `<meta name="${meta.name}" content="${meta.content}">`).join('');
    };

    const generateEnvScript = (version: string) => {
        return `<script src="env-${version.replace(/[.]/g, '-')}.js"></script>`;
    };

    const insertedTags = generateEnvScript(packageJson.version) + generateMetaTags(metaVersions);

    return `${indexHtml.slice(0, indexOfHead)}${insertedTags}${indexHtml.slice(indexOfHead)}`;
};
