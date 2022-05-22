/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { SPRING_WEBSOCKET } = require('../../jdl/jhipster/websocket-types');
const { OAUTH2, SESSION } = require('../../jdl/jhipster/authentication-types');
const { GATEWAY } = require('../../jdl/jhipster/application-types');
const constants = require('../generator-constants');

const { CLIENT_MAIN_SRC_DIR, CLIENT_TEST_SRC_DIR, REACT_DIR } = constants;

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const files = {
  common: [
    {
      templates: [
        'package.json',
        '.eslintrc.json',
        'tsconfig.json',
        'tsconfig.test.json',
        'jest.conf.js',
        'webpack/environment.js',
        'webpack/webpack.common.js',
        'webpack/webpack.dev.js',
        'webpack/webpack.prod.js',
        'webpack/utils.js',
        { file: 'webpack/logo-jhipster.png', method: 'copy' },
      ],
    },
    {
      condition: generator => generator.protractorTests,
      templates: ['tsconfig.e2e.json'],
    },
  ],
  sass: [
    {
      templates: ['postcss.config.js'],
    },
  ],
  reactApp: [
    {
      path: REACT_DIR,
      templates: [
        // { file: 'index.tsx', method: 'processJsx' },
        // 'setup-tests.ts',
        // 'typings.d.ts',
        'config/constants.ts',
        'config/dayjs.ts',
        'config/axios-interceptor.ts',
        'config/error-middleware.ts',
        'config/logger-middleware.ts',
        'config/notification-middleware.ts',
        'config/store.ts',
        // 'config/icon-loader.ts',
      ],
    },
    {
      condition: generator => generator.enableTranslation,
      path: REACT_DIR,
      templates: ['config/translation.ts', 'config/translation-middleware.ts'],
    },
    {
      condition: generator => generator.websocket === SPRING_WEBSOCKET,
      path: REACT_DIR,
      templates: ['config/websocket-middleware.ts'],
    },
  ],
  reactEntities: [
    {
      path: REACT_DIR,
      templates: [
        // { file: 'entities/menu.tsx', method: 'processJsx' },
        { file: 'entities/routes.tsx', method: 'processJsx' },
      ],
    },
  ],
  reactReducers: [
    {
      path: REACT_DIR,
      templates: ['reducers/entities/reducers.ts'],
    },
  ],
  reactMain: [
    {
      path: REACT_DIR,
      templates: [
        // { file: 'modules/home/home.tsx', method: 'processJsx' },
        { file: 'modules/login/logout.tsx', method: 'processJsx' },
      ],
    },
    {
      condition: generator => generator.authenticationType !== OAUTH2,
      path: REACT_DIR,
      templates: [
        { file: 'modules/login/login.tsx', method: 'processJsx' },
        { file: 'modules/login/login-modal.tsx', method: 'processJsx' },
      ],
    },
    {
      condition: generator => generator.authenticationType === OAUTH2,
      path: REACT_DIR,
      templates: [{ file: 'modules/login/login-redirect.tsx', method: 'processJsx' }],
    },
  ],
  reducers: [
    {
      path: REACT_DIR,
      templates: [
        'shared/reducers/index.ts',
        'shared/reducers/reducer.utils.ts',
        'shared/reducers/authentication.ts',
        // 'shared/reducers/application-profile.ts',
      ],
    },
    {
      condition: generator => generator.enableTranslation,
      path: REACT_DIR,
      templates: ['shared/reducers/locale.ts'],
    },
    // {
    //   condition: generator => generator.authenticationType === OAUTH2,
    //   path: REACT_DIR,
    //   templates: ['shared/reducers/user-management.ts'],
    // },
  ],
  reactShared: [
    {
      path: REACT_DIR,
      templates: [
        // util
        'shared/util/date-utils.ts',
        'shared/util/pagination.constants.ts',
        'shared/util/entity-utils.ts',
        // components
        { file: 'shared/error/error-boundary.tsx', method: 'processJsx' },
        { file: 'shared/error/page-not-found.tsx', method: 'processJsx' },
        { file: 'shared/DurationFormat.tsx', method: 'processJsx' },
      ],
    },
    {
      condition: generator => generator.authenticationType === OAUTH2,
      path: REACT_DIR,
      templates: ['shared/util/url-utils.ts'],
    },
    {
      condition: generator => generator.authenticationType === SESSION && generator.websocket === SPRING_WEBSOCKET,
      path: REACT_DIR,
      templates: ['shared/util/cookie-utils.ts'],
    },
  ],
  microfrontend: [
    {
      condition: generator => generator.microfrontend,
      templates: ['webpack/webpack.microfrontend.js.jhi.react'],
    },
    {
      condition: generator => generator.microfrontend,
      path: REACT_DIR,
      templates: ['main.tsx', 'shared/error/error-loading.tsx'],
    },
    {
      condition: generator => generator.microfrontend && generator.applicationTypeGateway,
      path: CLIENT_MAIN_SRC_DIR,
      templates: ['microfrontends/entities-menu.tsx', 'microfrontends/entities-routes.tsx'],
    },
  ],
};

module.exports = {
  writeFiles,
  files,
  cleanup,
};

function cleanup() {
  if (!this.clientFrameworkReact) return;

  if (this.isJhipsterVersionLessThan('7.4.0') && this.enableI18nRTL) {
    this.removeFile(`${CLIENT_MAIN_SRC_DIR}content/scss/rtl.scss`);
  }
  if (this.isJhipsterVersionLessThan('7.4.1')) {
    this.removeFile('.npmrc');
  }
  if (this.isJhipsterVersionLessThan('7.7.1')) {
    this.removeFile(`${CLIENT_MAIN_SRC_DIR}app/entities/index.tsx`);
  }
}

function writeFiles() {
  // write React files
  return this.writeFilesToDisk(files, 'react');
}
