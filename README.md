# vscode-cmplint

A [Visual Studio Code](https://code.visualstudio.com/) extension to lint [Aura](http://auraframework.org/) component files with [cmplint](http://github.com/Corvimae/cmplint).

## Usage

Enable the linter in the VS Code [settings](https://code.visualstudio.com/docs/customization/userandworkspace).

```json
{
  "cmplint.enable": true
}
```

### Configurations

*You can set the config by adding cmplint configuration files to the workspace directory.*

#### cmplint.enable

Type: `Boolean`  
Default: `true`

Control whether cmplint is enabled or not.

#### cmplint.config

Type: `Object`  
Default: `null`

Will be directly passed as the `config` option. Note that if you set `config` option, this plugin ignores all the cmplint configuration files.

## License

Copyright 2017 [May Roussel](https://github.com/Corvimae).

Heavily based off [Shinnosuke Watanabe](https://github.com/shinnn)'s [vscode-stylelint](https://github.com/shinnn/vscode-stylelint).

Licensed under [the MIT License](./LICENSE).
