/* eslint-disable prettier/prettier */
import { Controller, Get, VERSION_NEUTRAL, Version, Req, Res} from '@nestjs/common';
import { AppService } from './app.service';
import { initialContentMap as iCM } from './global/backend.settings';
import { assetMap as aM } from './global/backend.settings';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Response } from 'express';
import AppWithNavDemo from '../../users-demo-frontend/src/AppWithNavDemo';
// import * as acceptLangParser from 'accept-language-parser';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  initialContentMap = { ...iCM, title: 'Welcome to demo Hello World!' };

  assetMap = { ...aM, initialContentMap: this.initialContentMap };

  @Get('web*')
  @Version(VERSION_NEUTRAL) //applies to no version
  getHelloWithSsr(@Req() req: Request, @Res() res: Response) {
    const assetMap = {
      ...this.assetMap,
      baseUrl: '/web',
      initialContentMap: {
        ...this.initialContentMap,
        'hello-message': this.appService.getHello(),
        initialLanguage: 'en-US',
        initialI18nStore: {},
      },
    }; //override the base Url with req route since it could be influenced by version, etc.

    const entryPoint = [assetMap['main.js']];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pipe, abort: _abort } = renderToPipeableStream(
      <StaticRouter location={req.url}>
        <AppWithNavDemo assetMap={assetMap} />
      </StaticRouter>,
      {
        bootstrapScriptContent: `window.assetMap = ${JSON.stringify(
          assetMap,
        )};`,
        //bootstrapScripts: entryPoint,
        bootstrapModules: entryPoint,
        onShellReady() {
          res.statusCode = 200;
          res.setHeader('Content-type', 'text/html');
          pipe(res);
        },
        onShellError() {
          res.statusCode = 500;
          res.send('<!doctype html><p>Loading...</p>');
        },
      },
    );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
