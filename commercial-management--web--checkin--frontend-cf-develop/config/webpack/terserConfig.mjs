export class TerserConfig {
    // Configuration key must match "process.env.npm_lifecycle_event" or default for default config
    configs = {
        default: {
            parallel: true,
            terserOptions: {
                mangle: {
                    keep_classnames: true,
                    keep_fnames: true, 
                },
                compress: {
                    keep_classnames: true,
                    keep_fnames: true,
                }
            }
        },
        'build-pre':{
            parallel: true,
            terserOptions: {
                mangle: false
            }
        }
    }
    

    get config() { 
        return this.configs[process.env.npm_lifecycle_event] ?? this.configs['default'];
    }

}
