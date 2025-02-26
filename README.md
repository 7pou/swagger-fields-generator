<p align="center">
  <img alt="logo" width="200px" src="./assets/icon.png" />
</p>

<p align="center">
  <a aria-label="License" href="./LICENSE">
    <img alt="See License" src="https://img.shields.io/github/license/7pou/swagger-fields-generator?style=flat-square"/>
  </a>
  <a aria-label="Discord" href="https://discord.gg/mvTPqXKat5">
    <img alt="Join our Discord for support and chat about our projects" src="https://img.shields.io/discord/1342034439991070764?logo=discord&logoColor=white"/>
  </a>
</p>

# Swagger Fields Generator

English | [简体中文](./README_zh-CN.md)

**Swagger Fields Generator** is a browser extension designed to simplify API transformations, quickly generate forms and tables, and accelerate interface development.

## Features

- **Automatic Conversion:** Automatically converts Swagger documents into form fields and table columns.
- **Custom Converters:** Supports user-defined conversion rules to meet specific requirements.
- **Multilingual Support:** Provides multilingual interfaces for global users.
- **Single Project Configuration:** Supports single project configurations, allowing users to switch projects quickly.

## Installation

- The plugin is available for download in the plugin store; you can install it directly.
- Alternatively, you can manually install the plugin by following these steps:
  1. Download the plugin's `.crx` file.
  2. Enter `chrome://extensions/` in the browser's address bar to open the Extensions page.
  3. Enable "Developer mode," then drag and drop the `.crx` file onto the page to install.

## Usage

1. Open the target Swagger website.
2. Click the plugin icon in the browser toolbar to open the plugin popup.
3. In the popup, click the "Enable" button to activate the plugin.
4. The plugin will automatically attempt to fetch data from the configured JSON request URL.
5. After successful retrieval, refresh the current page to see the generator buttons added by the plugin.
6. Click the generator buttons, and the generated code will appear in a popup for you to copy and use.

## Configuration

- **Number of Buttons Displayed:** Sets the maximum number of buttons displayed in the API section on the Swagger page. The default value is 5. When the number of buttons configured in the project exceeds this value, they will be presented in a collapsed manner.
- **JSON Request URL:** Configures the JSON request URL for the current Swagger. Supports adding multiple URLs, separated by line breaks. Supports both full and relative paths.
- **Select Buttons to Display:** Selects the buttons to display on the current Swagger page. Supports drag-and-drop sorting.

## Contributing

We welcome issue reports, feature requests, or direct code contributions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Thanks to the following projects and libraries for their support:

- [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript)
- [plasmo](https://github.com/PlasmoHQ/plasmo)

**Swagger Fields Generator** aims to simplify API transformations, quickly generate forms and tables, and accelerate interface development.
